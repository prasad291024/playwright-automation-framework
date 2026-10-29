# Docker and Kubernetes Execution Guide

This guide covers the containerized and Kubernetes execution paths for the framework. It is additive: the existing local, GitHub Actions, and Jenkins workflows remain in place.

## 1. Architecture

```text
Developer / CI
     │
     ├── docker build ──────────────► Playwright 1.64.1 image (non-root, tini)
     │                                      │
     │                                      ├── docker run / Compose (one-shot test run)
     │                                      │
     │                                      └── Kubernetes Job (one-shot test run)
     │                                                │
     │                                                ├── ConfigMap (non-sensitive settings)
     │                                                ├── Secret (credentials, optional)
     │                                                └── emptyDir artifacts
     │
     └── GitHub Actions (build, scan, container smoke, optional GHCR publish)
```

Separation of concerns:

| Concern                 | Implementation                                                       |
| ----------------------- | -------------------------------------------------------------------- |
| Test runner             | `@playwright/test` from the committed lockfile                       |
| Browser runtime         | `mcr.microsoft.com/playwright:v1.64.1-noble` (browsers preinstalled) |
| Application under test  | Public demo apps or an in-cluster Service via `APP_BASE_URL`         |
| Orchestration           | Docker Compose locally; Kubernetes `Job` in a cluster                |
| Results and diagnostics | `test-results/`, `playwright-report/`, `screenshots/`                |
| CI/CD                   | Existing `ci.yml` plus `.github/workflows/container.yml`             |

## 2. Version Alignment

`package-lock.json` resolves `@playwright/test` to **1.64.1**. The Docker base image, Kubernetes Job image tag, and Jenkins image tag must use the same Playwright release so the browser binaries match the test runner. If you upgrade Playwright:

1. Regenerate the lockfile on Linux with the supported npm version.
2. Update the image tag in `Dockerfile`, `k8s/base/kustomization.yaml`, `k8s/base/job.yaml`, and `Jenkinsfile.docker`.
3. Rebuild and rerun the container smoke checks.

## 3. Docker Image

The root `Dockerfile` uses two stages from the same pinned Playwright image:

- `deps`: installs `node_modules` from `package-lock.json` with `npm ci`, skipping Husky and browser downloads.
- `runtime`: installs `tini`, copies dependencies and source, and runs as `pwuser` (UID/GID 1001).

Runtime properties:

- Non-root user; no added Linux capabilities required.
- `tini` as PID 1 for signal forwarding and zombie reaping.
- Compatible with a read-only root filesystem when `/tmp`, `/home/pwuser`, and artifact directories are writable mounts.
- No `HEALTHCHECK`: this is a finite test-runner image, not a service. Kubernetes Jobs do not use liveness/readiness probes here.
- Browsers are not re-downloaded at build time; the base image already contains the matching revisions.

The built image is approximately 5.6 GB uncompressed. The official Playwright image contains Chromium, Firefox, and WebKit, and the project's devDependency tree includes ruflo. If image size becomes a constraint, use a single-browser base and a minimal runtime dependency set for that scope; do not delete packages blindly.

npm 11.19 in the pinned image reports several ruflo/agentdb native install scripts as not covered by its `allowScripts` policy. The Playwright test path does not import those packages, and the container suite passes. If ruflo is used inside the image later, review `npm install-scripts` and add an explicit allow list.

Build:

```bash
docker build -t ui-automation-framework:1.64.1 .
```

Run a suite directly:

```bash
mkdir -p test-results playwright-report storage-state screenshots

# On Linux, the bind-mounted directories must be writable by UID 1001.
# Docker Desktop on Windows/macOS handles this through its file sharing layer.
sudo chown -R 1001:1001 test-results playwright-report storage-state screenshots

docker run --rm \
  --read-only \
  --tmpfs /tmp \
  --tmpfs /home/pwuser \
  --shm-size=1g \
  --cap-drop=ALL \
  --security-opt no-new-privileges \
  -v "$PWD/test-results:/app/test-results" \
  -v "$PWD/playwright-report:/app/playwright-report" \
  -v "$PWD/storage-state:/app/storage-state" \
  -v "$PWD/screenshots:/app/screenshots" \
  ui-automation-framework:1.64.1 \
  node scripts/run-app-suite.cjs --app=saucedemo --suite=smoke
```

The suite runner accepts `APP`, `TEST_SUITE`, and `PLAYWRIGHT_PROJECT` from either CLI arguments or environment variables, which keeps Kubernetes manifests free of shell interpolation.

## 4. Docker Compose

`docker-compose.yml` mirrors the hardened `docker run` flags: read-only root, `tmpfs` for `/tmp` and the user home, `cap_drop: ALL`, `no-new-privileges`, a 1 GiB shared memory device, and resource limits.

```bash
# Run the default Playwright command
docker compose run --rm test

# Run one app/suite
docker compose run --rm test node scripts/run-app-suite.cjs --app=cura --suite=smoke

# Update visual snapshots inside the Linux container
docker compose run --rm test node scripts/run-app-suite.cjs --app=saucedemo --suite=visual -u

# Headed tests under Xvfb (no interactive display)
docker compose --profile headed run --rm test-headed
```

Compose loads `.env` only if it exists (`required: false`). It never copies `.env` into the image; `.dockerignore` excludes all `.env*` files.

## 5. Kubernetes

Manifests live in `k8s/` and use Kustomize. Helm was not introduced because the workload is a single Job and Kustomize is available through `kubectl`.

- `k8s/base/`: Namespace, ServiceAccount, ConfigMap, Job, NetworkPolicy.
- `k8s/base/secret.example.yaml`: placeholder-only Secret example; not part of the Kustomize build.
- `k8s/overlays/local/`: credential-free `local/shared-api` smoke configuration and shorter retention.
- `k8s/README.md`: operational runbook.

Quick start:

```bash
docker build -t ui-automation-framework:1.64.1 .
# kind: kind load docker-image ui-automation-framework:1.64.1
# minikube: minikube image load ui-automation-framework:1.64.1

kubectl apply -f k8s/base/namespace.yaml
kubectl -n playwright-tests create secret generic playwright-credentials \
  --from-literal=SAUCEDEMO_USERNAME='standard_user' \
  --from-literal=SAUCEDEMO_PASSWORD='<replace-me>' \
  --dry-run=client -o yaml | kubectl apply -f -

kubectl apply -k k8s/overlays/local
kubectl -n playwright-tests wait --for=condition=complete job/playwright-suite --timeout=900s
kubectl -n playwright-tests logs job/playwright-suite
```

Collect artifacts before the TTL expires:

```bash
POD=$(kubectl -n playwright-tests get pod -l job-name=playwright-suite \
  -o jsonpath='{.items[0].metadata.name}')
mkdir -p k8s-artifacts
kubectl -n playwright-tests cp "$POD:/app/playwright-report" k8s-artifacts/playwright-report
kubectl -n playwright-tests cp "$POD:/app/test-results" k8s-artifacts/test-results
```

Key design decisions:

- **Job, not Deployment**: the suite is finite. `backoffLimit: 0` avoids duplicating a full suite on top of Playwright's own retries.
- **No sharding**: the suite targets public demo applications; one worker keeps external state deterministic. Sharding can be added with separate Jobs and `--shard`.
- **emptyDir artifacts**: no storage class assumption. Results are copied out before `ttlSecondsAfterFinished`. Add a PVC if you need durable storage.
- **No cluster credentials**: the ServiceAccount token is not mounted and no RBAC is granted to the test pod.
- **Reachability**: pods cannot reach a developer workstation's `localhost`. Use a public URL or an in-cluster Service via `APP_BASE_URL`.

## 6. GitHub Actions

`.github/workflows/container.yml` adds:

1. Kustomize rendering and kubeconform schema validation.
2. Advisory kubelinter checks.
3. Docker image build.
4. Non-root UID verification.
5. Chromium launch under a read-only root filesystem.
6. `local/shared-api` suite execution inside the container with artifact upload.
7. Trivy HIGH/CRITICAL image scan (SARIF uploaded to code scanning; currently advisory).
8. GHCR publication on pushes to `main`, with BuildKit provenance and SBOM attestations.

The existing `ci.yml` and `codeql.yml` workflows are unchanged.

### Existing Jenkins path

`Jenkinsfile.docker` still runs the official Playwright image with a bind-mounted workspace and the root user. This change aligns its image version to `1.64.1` but does not migrate Jenkins to the hardened Dockerfile. Keep Jenkins as-is until a separate migration is approved, or point Jenkins at the new image in a follow-up.

## 7. Configuration

| Variable                       | Scope        | Purpose                                             |
| ------------------------------ | ------------ | --------------------------------------------------- |
| `APP` / `APP_NAME`             | runner       | Application profile from `config/apps.json`         |
| `TEST_SUITE`                   | runner       | Suite from `config/test-suites.json`                |
| `PLAYWRIGHT_PROJECT`           | runner       | Browser project                                     |
| `APP_BASE_URL`                 | Playwright   | Overrides the app profile's `baseUrl`               |
| `PLAYWRIGHT_WORKERS`           | Playwright   | Worker count override                               |
| `PLAYWRIGHT_RETRIES`           | Playwright   | Retry override                                      |
| `PLAYWRIGHT_HTML_REPORT`       | Playwright   | HTML report directory                               |
| `PLAYWRIGHT_JSON_OUTPUT_FILE`  | Playwright   | JSON report file                                    |
| `PLAYWRIGHT_JUNIT_OUTPUT_FILE` | Playwright   | JUnit report file                                   |
| App credentials                | Secret / env | `*_USERNAME` and `*_PASSWORD` pairs per application |

`APP_BASE_URL` was added because `playwright.config.ts` otherwise always uses the URL declared in `config/apps.json`. It is the supported way to point containerized or Kubernetes runs at an alternate environment.

## 8. Security Controls and Residual Risks

Implemented:

- Pinned Playwright image matching the lockfile.
- Non-root execution (UID/GID 1001).
- Dropped capabilities, `allowPrivilegeEscalation: false`, `RuntimeDefault` seccomp.
- Read-only root filesystem with explicit writable mounts.
- No host networking, host PID/IPC, hostPath, Docker socket, or cluster RBAC in the test pod.
- ServiceAccount token automount disabled.
- Default-deny ingress; egress limited to DNS and TCP 443.
- Pod Security Standards `restricted` namespace labels.
- `.dockerignore` excludes `.env*`, storage state, reports, and VCS/tooling state.
- Secret example uses placeholders only; populated secrets are gitignored.
- Trivy image scanning and BuildKit provenance/SBOM attestations on publish.

Residual risks:

- Playwright disables the Chromium OS sandbox by default. Container isolation is the compensating control; enabling the browser sandbox requires cluster-specific tuning.
- NetworkPolicy enforcement depends on the CNI.
- Trivy currently runs in advisory mode (`exit-code: 0`). Change it to `1` once the baseline is reviewed.
- Third-party GitHub Actions are referenced by version tags. Pin them to commit SHAs if your supply-chain policy requires it.
- The Kubernetes image is referenced by tag. Pin by digest in environments that require immutable references.
- No admission controller enforces image signatures or policies yet.

## 9. Validation Record

| Check                                  | Status                                                                                      |
| -------------------------------------- | ------------------------------------------------------------------------------------------- |
| Baseline typecheck, lint, Prettier     | Passed before changes                                                                       |
| Playwright image version alignment     | Verified: image `v1.64.1-noble`, lock `1.64.1`                                              |
| Docker image build                     | Passed: `ui-automation-framework:1.64.1` (5.56 GB uncompressed)                             |
| Non-root execution                     | Passed: UID 1001, `pwuser`                                                                  |
| Init process                           | Passed: `tini` is PID 1                                                                     |
| Chromium launch under read-only root   | Passed: Chromium launched and rendered content with `--read-only`                           |
| Containerized shared API suite         | Passed: 24/24 via `docker run`, 24/24 via Compose, 8/8 env-driven (Kubernetes command path) |
| Report and artifact generation         | Passed: HTML, JSON, and JUnit files written through bind mounts                             |
| Failure exit-code propagation          | Passed: unknown suite exits `1`                                                             |
| Compose configuration                  | Passed with and without a local `.env`                                                      |
| Secret exclusion                       | Passed: no `.env*` in the image; build-time guard added                                     |
| Kustomize rendering                    | Passed for base and local overlay                                                           |
| Kubeconform schema validation          | Passed: 11/11 resources valid                                                               |
| Kube-linter checks                     | Passed: no lint errors                                                                      |
| Dockerfile lint (hadolint)             | Passed: no findings                                                                         |
| Workflow lint (actionlint)             | New workflow clean; only pre-existing ShellCheck notes in `ci.yml` (SC2129, SC2016)         |
| Final typecheck / lint / Prettier      | Passed after all changes                                                                    |
| Live Kubernetes Job execution          | Not run: no cluster is configured in this workspace                                         |
| Full cross-application container suite | Not run: targets public demo applications; existing CI covers those suites                  |

## 10. Rollback

- Remove the container workflow: delete `.github/workflows/container.yml`.
- Remove Kubernetes resources: `kubectl delete -k k8s/overlays/local` (deletes the dedicated namespace and its Secret).
- Restore the previous Dockerfile/Compose files from version control if you need the legacy behavior.
- Revert the commit; no application data, database, or shared infrastructure is migrated by this setup.

## 11. Troubleshooting

| Symptom                                       | Resolution                                                                 |
| --------------------------------------------- | -------------------------------------------------------------------------- |
| `npm ci` fails on lockfile differences        | Regenerate the lockfile on Linux with the supported npm version            |
| Browser launch fails in a read-only container | Mount writable `/tmp` and `/home/pwuser`; keep the artifact mounts         |
| `EACCES` writing reports on Linux             | `chown -R 1001:1001` the bind-mounted directories                          |
| Kubernetes `ImagePullBackOff`                 | Load the local image into the cluster or add an `imagePullSecret`          |
| NetworkPolicy blocks the app                  | Add an egress rule for its namespace/port and set `APP_BASE_URL`           |
| Job apply fails after editing the template    | Delete `job/playwright-suite` and re-apply; Jobs are immutable             |
| Artifacts disappeared                         | Copy them before `ttlSecondsAfterFinished`; add a PVC for longer retention |
