# Use official Playwright image as base
FROM mcr.microsoft.com/playwright:v1.56.1-noble

# Set working directory
WORKDIR /app

# Install Node.js (Playwright image includes this, but ensure it's available)
RUN apt-get update && apt-get install -y \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Install Playwright browsers
RUN npx playwright install --with-deps chromium firefox webkit

# Copy application code
COPY . .

# Set environment variables
ENV CI=true
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

# Default command: run tests
CMD ["npm", "test"]

# Healthcheck for container (optional)
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD npm run typecheck || exit 1
