# Jenkins Docker Setup for UI_Automation_Framework

This project can use the same Jenkins server and the same Jenkins accounts that are already in use for the API framework.

## Reuse Model
- Reuse the same Jenkins instance.
- Reuse the same personal admin account: `jenkins-admin`.
- Reuse the same Jenkins service user: `jenkins-service`.
- Reuse the same webhook and Slack integration approach.

No separate Jenkins account is required per project.

## What Is Different for This Project
This UI project is intended to run through a Docker-based Jenkins job because Playwright UI testing benefits from a consistent browser/runtime image.

Use:
- `Jenkinsfile.docker` for the Jenkins job script path
- `mcr.microsoft.com/playwright:v1.56.1-noble` as the runtime container

## Jenkins Prerequisites
Before this job will run successfully, the Jenkins host must have:
- Docker installed and running
- Jenkins `Docker Pipeline` plugin installed
- Git, Slack, HTML Publisher, JUnit, Workspace Cleanup, and Pipeline plugins available

`jenkins/plugins.txt` now includes:
- `docker-workflow`

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
2. `Install`
3. `Lint`
4. `Typecheck`
5. `Test`
6. `Publish Report`
7. `Archive Artifacts`
8. `Notify`

## Parameters
The Docker pipeline exposes these Jenkins parameters:
- `TEST_SCOPE`: `smoke` or `full`
- `PLAYWRIGHT_PROJECT`: `chromium`, `firefox`, or `webkit`
- `APP`: `local`, `vwo`, `cura`, `saucedemo`, or `orangehrm`

## Slack Notifications
The pipeline includes a dedicated `Notify` stage for Slack success and failure notifications.

Current default channel in `Jenkinsfile.docker`:
- `#api-automation-framework`

Adjust that value before production use if you want a UI-specific channel such as:
- `#ui-automation-framework`

## Important Note About Current Machine
Docker is not currently installed on this machine, so this Docker-based pipeline has been prepared in the repository but not executed locally from this environment.

That means:
- the Jenkins integration files are ready
- the Jenkins job can be created
- actual execution still depends on Docker being available to Jenkins

## Next Practical Step
Once Docker is available to the Jenkins host:
1. Create a Jenkins job for this repo.
2. Point Script Path to `Jenkinsfile.docker`.
3. Run one smoke build first.
4. Confirm HTML report and Slack notifications.
