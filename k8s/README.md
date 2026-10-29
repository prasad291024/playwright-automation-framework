# Kubernetes Execution Runbook

This directory runs the Playwright suite as a finite Kubernetes **Job**. It is not a long-running service.

## Architecture

| Layer             | Resource                                                                |
| ----------------- | ----------------------------------------------------------------------- |
| Namespace         | `playwright-tests`, labeled for Pod Security Standards `restricted`     |
| Identity          | `playwright-runner` ServiceAccount, token automount disabled            |
| Configuration     | `playwright-config` ConfigMap (non-sensitive values only)               |
| Credentials       | `playwright-credentials` Secret (created by you, never committed)       |
| Workload          | `playwright-suite` Job (`backoffLimit: 0`, one completed run)           |
| Temporary storage | `emptyDir` volumes for `/tmp`, home, `/dev/shm`, and report directories |
| Network           | Default-deny ingress; egress limited to DNS and TCP 443                 |

## Prerequisites

- `kubectl` 1.30+ (Kustomize v5)
- A cluster with a loadable local image (Docker Desktop Kubernetes, kind, or minikube)
- The image tag must match `@playwright/test` in `package-lock.json` (currently `1.64.1`)

Build the image from the repository root:

```bash
docker build -t ui-automation-framework:1.64.1 .
```

Make it available to the cluster:

```bash
# kind
kind load docker-image ui-automation-framework:1.64.1

# minikube
minikube image load ui-automation-framework:1.64.1

# Docker Desktop Kubernetes uses the local image store directly.
```

## Create the Namespace and Secret

```bash
kubectl apply -f k8s/base/namespace.yaml

kubectl -n playwright-tests create secret generic playwright-credentials \
  --from-literal=SAUCEDEMO_USERNAME='standard_user' \
  --from-literal=SAUCEDEMO_PASSWORD='<replace-me>' \
  --from-literal=CURA_USERNAME='<replace-me>' \
  --from-literal=CURA_PASSWORD='<replace-me>' \
  --from-literal=ORANGEHRM_USERNAME='<replace-me>' \
  --from-literal=ORANGEHRM_PASSWORD='<replace-me>' \
  --dry-run=client -o yaml | kubectl apply -f -
```

The Secret is optional in the Job manifest, so a missing Secret does not block pod startup. Login flows that need credentials will skip authentication and their tests will fail rather than silently pass.

## Run the Job

The `local` overlay runs the credential-free `local/shared-api` suite and is a safe first validation:

```bash
kubectl apply -k k8s/overlays/local
kubectl -n playwright-tests wait --for=condition=complete job/playwright-suite --timeout=900s
```

To run an application suite, edit `k8s/overlays/local/configmap-patch.yaml` (or create a new overlay) and set `APP`, `TEST_SUITE`, and `PLAYWRIGHT_PROJECT`, then recreate the Job:

```bash
kubectl -n playwright-tests delete job playwright-suite --ignore-not-found
kubectl apply -k k8s/overlays/local
```

Jobs are immutable. Deleting the Job before re-applying is required when its pod template changes.

## Inspect Results

```bash
kubectl -n playwright-tests get job,pod
kubectl -n playwright-tests describe job playwright-suite
kubectl -n playwright-tests logs job/playwright-suite
```

A non-zero Playwright exit code makes the Job fail, and `kubectl wait --for=condition=complete` returns non-zero. Failures are not reported as success.

Copy artifacts before `ttlSecondsAfterFinished` deletes the Job:

```bash
POD=$(kubectl -n playwright-tests get pod -l job-name=playwright-suite \
  -o jsonpath='{.items[0].metadata.name}')

mkdir -p k8s-artifacts
kubectl -n playwright-tests cp "$POD:/app/playwright-report" k8s-artifacts/playwright-report
kubectl -n playwright-tests cp "$POD:/app/test-results" k8s-artifacts/test-results
kubectl -n playwright-tests cp "$POD:/app/screenshots" k8s-artifacts/screenshots
```

The base Job keeps completed resources for one hour; the local overlay keeps them for 15 minutes. Adjust `ttlSecondsAfterFinished` in the overlay if you need a longer collection window.

## Reachability of the Application Under Test

Kubernetes pods do not see the developer workstation's `localhost`. Use one of these:

- Public demo applications: allow TCP 443 egress (the default NetworkPolicy does this).
- An in-cluster application: add an egress rule for its namespace in `k8s/base/networkpolicy.yaml`, and set `APP_BASE_URL` to its in-cluster Service URL (for example `http://my-app.test.svc.cluster.local:3000`).
- An external environment: set `APP_BASE_URL` and ensure the NetworkPolicy allows the destination port.

`APP_BASE_URL` overrides the base URL from `config/apps.json` without changing the app registry.

## Configuration

| ConfigMap key           | Purpose                                                    |
| ----------------------- | ---------------------------------------------------------- |
| `APP`                   | Application profile from `config/apps.json`                |
| `TEST_SUITE`            | Suite from `config/test-suites.json`                       |
| `PLAYWRIGHT_PROJECT`    | Browser project (`chromium`, `firefox`, `webkit`)          |
| `PLAYWRIGHT_WORKERS`    | Worker count; keep at `1` for public demo targets          |
| `PLAYWRIGHT_RETRIES`    | Playwright retry count                                     |
| `APP_BASE_URL`          | Optional base URL override                                 |
| `PLAYWRIGHT_*_OUTPUT_*` | Report paths (the suite runner recalculates per app/suite) |

Credentials belong in the Secret, never in the ConfigMap or manifests.

## Resource Sizing

The base Job requests `500m` CPU, `1Gi` memory, and `2Gi` ephemeral storage, with limits of `2` CPU, `3Gi` memory, and `8Gi` ephemeral storage. That fits one headless Chromium worker with a `512Mi` memory-backed `/dev/shm`.

If you raise `PLAYWRIGHT_WORKERS`:

- Increase the memory limit (roughly `1.5-2Gi` per concurrent Chromium worker).
- Increase `emptyDir` sizes for traces and videos.
- Increase `activeDeadlineSeconds` if the suite is long-running.

## Security Controls

- Runs as UID/GID `1001` (`pwuser`), never root.
- `allowPrivilegeEscalation: false`, all Linux capabilities dropped, `RuntimeDefault` seccomp.
- Read-only root filesystem with explicit `emptyDir` mounts for writable paths.
- No host networking, host PID/IPC, hostPath, Docker socket, or cluster RBAC.
- ServiceAccount token automount disabled.
- Default-deny ingress; egress restricted to DNS and TCP 443.
- Namespace enforces Pod Security Standards `restricted`.
- No credentials in manifests, image layers, or ConfigMaps.

Residual risks:

- Playwright disables the Chromium OS sandbox by default (`chromiumSandbox` is not enabled). Container isolation (non-root, dropped capabilities, seccomp, PSS) is the compensating control. Enabling the browser sandbox requires cluster-specific user-namespace tuning and is intentionally not forced here.
- `NetworkPolicy` enforcement depends on the CNI plugin. Without a policy-capable CNI, the egress restrictions are not effective.
- Image vulnerability scanning and provenance are performed in CI, not enforced by the cluster admission controller. Add a policy engine (for example Kyverno or Gatekeeper) if admission-time enforcement is required.
- Artifacts live in `emptyDir` and disappear when the Job is cleaned up. Copy them out or add a storage-class-specific PVC if longer retention is required.
- The image is referenced by tag, not digest. For production clusters, pin the image by digest in your overlay.

## Sharding

Sharding is intentionally not enabled. The suite targets public demo applications and one worker keeps behavior deterministic. If you need sharding, create separate Jobs with the Playwright `--shard=<index>/<total>` argument, each with its own artifact volume, and aggregate the reports afterward. Do not point multiple shards at shared mutable test data.

## Cleanup and Rollback

Delete the test workload:

```bash
kubectl delete -k k8s/overlays/local
```

That removes the Namespace and everything inside it, including the Secret. To remove only the Job:

```bash
kubectl -n playwright-tests delete job playwright-suite
```

To roll back repository changes, revert the commit that added or modified the Docker/Kubernetes files; no application data or shared infrastructure is migrated by this setup.

## Local Validation Status

Static manifest rendering and schema validation are part of CI (`.github/workflows/container.yml`). Running the Job against a live cluster is a manual step because it depends on a cluster and a loaded image. See `docs/CONTAINERIZATION.md` for the commands and the validation record.
