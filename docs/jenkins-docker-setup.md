# Jenkins Docker Setup for UI_Automation_Framework

This project can use the same Jenkins server and the same Jenkins accounts that are already in use for the API framework.

If you want a project-specific explanation of what Docker Desktop means in practice for this pipeline, see `docs/docker-desktop-guide.md`.

## Reuse Model

- Reuse the same Jenkins instance.
- Reuse the same personal admin account: `jenkins-admin`.
- Reuse the same Jenkins service user: `jenkins-service`.
- Reuse the same webhook and Slack integration approach.

No separate Jenkins account is required per project.

## What Is Different for This Project

This UI project is intended to run through a Docker-based Jenkins job because Playwright UI testing benefits from a consistent browser/runtime image.

The current Jenkinsfile is designed to work on a Windows Jenkins host by invoking Docker CLI commands from a normal Jenkins node. This avoids the Windows path issue that can happen with declarative `agent { docker { ... } }` when running Linux containers on Docker Desktop.

Use:

- `Jenkinsfile.docker` for the Jenkins job script path
- `mcr.microsoft.com/playwright:v1.56.1-noble` as the runtime container

## Jenkins Prerequisites

Before this job will run successfully, the Jenkins host must have:

- Docker installed and running
- Docker Desktop healthy enough to run Linux containers
- Git, Slack, HTML Publisher, JUnit, Workspace Cleanup, and Pipeline plugins available
- `AnsiColor` and `Timestamper` plugins available for the pipeline options in `Jenkinsfile.docker`

`jenkins/plugins.txt` includes:

- `docker-workflow`
- `ansicolor`
- `timestamper`

`docker-workflow` can still remain installed, but this pipeline no longer depends on Jenkins Docker agent syntax for the Windows-hosted setup.

## Recommended Jenkins Job Type

Use a separate Jenkins job or multibranch pipeline for this repo.

Suggested names:

- `ui-automation-framework`
- `ui-automation-framework-multibranch`

## Recommended Job Configuration

### If using a regular Pipeline job

- Definition: `Pipeline script from SCM`
- SCM: `Git`
- Repository URL: the UI project repository URL
- Branch Specifier: `*/main`
- Script Path: `Jenkinsfile.docker`

### If using a Multibranch Pipeline

- Branch source: Git or GitHub Branch Source
- Script Path: `Jenkinsfile.docker`

## Pipeline Stages

`Jenkinsfile.docker` runs:

1. `Checkout`
2. `Preflight`
3. `Install`
4. `Lint`
5. `Typecheck`
6. `Test`
7. `Publish Report`
8. `Archive Artifacts`
9. `Notify`

## Parameters

The Docker pipeline exposes these Jenkins parameters:

- `TEST_SCOPE`: `smoke` or `full`
- `PLAYWRIGHT_PROJECT`: `chromium`, `firefox`, `webkit`, `saucedemo`, or `cura`
- `APP`: `local`, `cura`, `saucedemo`, or `orangehrm`

## Slack Notifications

The pipeline includes a dedicated `Notify` stage for Slack success and failure notifications.

Current default channel in `Jenkinsfile.docker`:

- `#ui-automation-framework`

Adjust that value before production use if you want a UI-specific channel such as:

- `#ui-automation-framework`

## Preflight Behavior

The pipeline now includes a `Preflight` stage that checks Docker availability before any container-based step runs.

If Docker Desktop or the Docker Linux engine is not running on the Jenkins host, the pipeline fails early with a clear message instead of cascading through every stage.

## Overnight Ops Checklist

For nightly UI builds to run reliably on the current local Jenkins host, make sure all of the following are true before the overnight window:

1. Jenkins is running.
2. Docker Desktop is running.
3. `docker info` works in PowerShell.
4. The machine is awake and not sleeping.
5. Internet access is available for GitHub and Slack.

Recommended Windows settings:

- Enable Docker Desktop auto-start at sign-in.
- Keep the Jenkins PowerShell session running, or move Jenkins to a more persistent startup model later.
- Set Windows sleep to `Never` or to a value that will not interrupt the nightly schedule.

## Next Practical Step

1. Keep the nightly job pinned to `main`.
2. Use stable nightly parameters such as `TEST_SCOPE=smoke`, `PLAYWRIGHT_PROJECT=cura`, and `APP=cura`.
3. Confirm HTML report and Slack notifications after any Jenkins or Docker maintenance.
