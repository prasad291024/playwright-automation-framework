# Playwright image tag must match the @playwright/test version resolved in package-lock.json.
# Browsers are baked into this image, so the version cannot drift from the test runner.
FROM mcr.microsoft.com/playwright:v1.64.1-noble AS deps

WORKDIR /app

# Husky hooks are not needed in an image build, and browsers already exist in the base image.
ENV HUSKY=0 \
    PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

COPY package.json package-lock.json ./

RUN npm ci --no-audit --no-fund

FROM mcr.microsoft.com/playwright:v1.64.1-noble AS runtime

LABEL org.opencontainers.image.title="UI Automation Framework" \
      org.opencontainers.image.description="Playwright test runner for the UI automation framework" \
      org.opencontainers.image.version="1.64.1"

ENV CI=true \
    HOME=/home/pwuser \
    PLAYWRIGHT_BROWSERS_PATH=/ms-playwright \
    PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

# tini reaps zombie browser processes and forwards SIGTERM so interrupted runs stop cleanly.
# The base image tag pins the Ubuntu suite; pinning tini's apt version would break when
# Microsoft republishes the image with a security update for that package.
# hadolint ignore=DL3008
RUN apt-get update \
    && apt-get install -y --no-install-recommends tini \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir -p /app/test-results /app/playwright-report /app/storage-state /app/screenshots \
    && chown -R pwuser:pwuser /app /home/pwuser

WORKDIR /app

COPY --from=deps --chown=pwuser:pwuser /app/node_modules ./node_modules
COPY --chown=pwuser:pwuser . .

# Defense in depth: .dockerignore excludes these, but a build must never ship local secrets.
RUN test ! -e /app/.env && test ! -e /app/.env.local && test ! -e /app/.env.backup

# Browser sandboxing is governed by Playwright/container isolation; the runner never runs as root.
USER pwuser

ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["npx", "playwright", "test"]
