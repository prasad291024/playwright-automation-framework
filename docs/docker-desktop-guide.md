# Docker Desktop Guide for UI_Automation_Framework

This guide explains Docker Desktop only in the context of this project and its Jenkins UI pipeline.

## Why Docker Matters Here

Docker is used only for the UI project:

- `UI_Automation_Framework`
- Jenkins job: `ui-automation-framework-multibranch`
- Nightly job: `ui-automation-framework-nightly`

The API project does not depend on Docker for its current Jenkins pipeline.

For this UI project, Jenkins uses Docker to run Playwright tests inside a clean Linux environment.

## The One Docker Image That Matters

The main image for this project is:

- `mcr.microsoft.com/playwright:v1.56.1-noble`

This image contains:

- Playwright
- browser dependencies
- a stable Linux runtime for UI test execution

When Jenkins runs the UI pipeline, it uses this image to execute:

- `npm ci`
- `npm run lint`
- `npm run typecheck`
- `npx playwright test ...`

The `hello-world` image is not part of the project. It was only used to confirm that Docker was working.

## Simple Mental Model

Use this model when looking at Docker Desktop:

- `Jenkins` = orchestrator
- `Docker Desktop` = runtime engine
- `Playwright image` = reusable test environment
- `Container` = temporary running execution of that environment

## What You See in Docker Desktop

### Images

This is the most important section for this project.

An image is a reusable template.

For this project, the important image is:

- `mcr.microsoft.com/playwright:v1.56.1-noble`

Why it matters:

- Jenkins pulls this image
- Jenkins starts a container from it
- the UI pipeline runs inside that container

### Containers

A container is a running or completed instance of an image.

For this project:

- Jenkins creates temporary containers during the UI build
- they may appear briefly while a build is running
- they usually disappear after the build finishes because the pipeline uses `docker run --rm`

`--rm` means the container is removed automatically after execution.

So it is normal if you do not see a permanent container for this project.

### Volumes

This section is not very important for the current UI Jenkins setup.

The pipeline mainly mounts the Jenkins workspace directly into the Playwright container.

You can ignore this section for now.

### Builds

This becomes important only if we start building our own custom Docker images using a `Dockerfile`.

Right now, this project does not build its own image. It reuses Microsoft's Playwright image.

So this section is not central yet.

### Kubernetes, Models, MCP Toolkit, Docker Scout, Extensions

These are not part of the current Jenkins setup for this project.

You can safely ignore them for now.

## What Actually Happens During a UI Jenkins Build

When the UI Jenkins pipeline runs, this is the flow:

1. Jenkins checks out the repo.
2. Jenkins talks to Docker Desktop.
3. Docker uses the Playwright image `mcr.microsoft.com/playwright:v1.56.1-noble`.
4. Docker creates a temporary container.
5. Jenkins runs the UI test commands inside that container.
6. The container is removed after the build completes.

## What You Actually Need To Check

For this project, you only need to care about these checks.

### 1. Docker Engine Status

In Docker Desktop, bottom-left should show:

- `Engine running`

If the engine is not running, the UI Jenkins jobs will fail.

### 2. Docker CLI Health

In PowerShell, this command should work:

```powershell
docker info
```

If this fails, Jenkins UI Docker jobs will also fail.

### 3. Playwright Image Availability

The `Images` page should show:

- `mcr.microsoft.com/playwright:v1.56.1-noble`

If it is missing, Jenkins can usually pull it again automatically, but seeing it there is a good sign.

## What To Ignore Most of the Time

For the current project setup, you can mostly ignore:

- generic Docker Hub items
- Kubernetes
- Models
- MCP Toolkit
- Docker Scout
- Extensions
- the `hello-world` image

## Overnight Reliability Checklist

For nightly UI Jenkins runs to work reliably, make sure:

1. Jenkins is running.
2. Docker Desktop is running.
3. `docker info` works.
4. the machine is awake and not sleeping.
5. internet access is available for GitHub and Slack.

## Project-Specific Quick Rules

Use these rules when you are unsure.

- If Docker Desktop says `Engine running`, that is good.
- If `docker info` works, Docker is healthy enough for Jenkins.
- If the Playwright image exists, Jenkins can use it immediately.
- If UI nightly fails with a Docker connection error, first check whether Docker Desktop is running.

## Short Version

If you want the simplest possible explanation:

- Docker Desktop is just the machine that runs your UI tests inside a clean Playwright environment.
- For this project, the only Docker thing that really matters is whether the engine is running and whether Jenkins can use `mcr.microsoft.com/playwright:v1.56.1-noble`.
