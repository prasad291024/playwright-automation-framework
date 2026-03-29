import { test, expect } from '@playwright/test';

/**
 * Visual Regression Testing Templates
 *
 * Compare screenshots across runs to detect unintended visual changes.
 * Playwright's built-in visual comparison helps catch design regressions.
 *
 * Key features:
 * - Take screenshots and compare against baseline
 * - Detect pixel-level changes
 * - Support for fuzzy matching (threshold)
 * - Useful for responsive design testing
 *
 * Usage:
 * - First run: generates baseline screenshots in __screenshots__
 * - Subsequent runs: compares against baseline
 * - Update with: npx playwright test --update-snapshots
 */

test.describe('Visual Regression: Homepage', () => {
  test('Homepage layout matches baseline screenshot', async ({ page }) => {
    await page.goto('https://playwright.dev/');
    await page.waitForLoadState('networkidle');

    // Capture full page screenshot
    await expect(page).toHaveScreenshot('homepage-full-page.png');
  });

  test('Header section matches baseline', async ({ page }) => {
    await page.goto('https://playwright.dev/');
    await page.waitForLoadState('networkidle');

    const header = page.locator('header').first();
    await expect(header).toHaveScreenshot('header-section.png');
  });

  test('Navigation menu appearance', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    // Capture navigation element specifically
    const nav = page.locator('nav').first();
    if (await nav.isVisible()) {
      await expect(nav).toHaveScreenshot('navigation-menu.png');
    }
  });

  test('Mobile viewport matches baseline', async ({ context }) => {
    // Create a mobile viewport context
    const mobileContext = await context.browser()?.newContext({
      viewport: { width: 375, height: 667 },
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15',
    });

    if (mobileContext) {
      const mobilePage = await mobileContext.newPage();
      await mobilePage.goto('https://playwright.dev/');
      await mobilePage.waitForLoadState('networkidle');

      // Capture mobile screenshot
      await expect(mobilePage).toHaveScreenshot('homepage-mobile.png');

      await mobileContext.close();
    }
  });

  test('Tablet viewport layout', async ({ context }) => {
    const tabletContext = await context.browser()?.newContext({
      viewport: { width: 768, height: 1024 },
    });

    if (tabletContext) {
      const tabletPage = await tabletContext.newPage();
      await tabletPage.goto('https://playwright.dev/');
      await tabletPage.waitForLoadState('networkidle');

      await expect(tabletPage).toHaveScreenshot('homepage-tablet.png');

      await tabletContext.close();
    }
  });
});

test.describe('Visual Regression: Component States', () => {
  test('Button states (normal, hover, active)', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    const button = page.getByRole('button').first();

    if (await button.isVisible()) {
      // Normal state
      await expect(button).toHaveScreenshot('button-normal-state.png');

      // Hover state
      await button.hover();
      await expect(button).toHaveScreenshot('button-hover-state.png');

      // Active/focused state
      await button.focus();
      await expect(button).toHaveScreenshot('button-focused-state.png');
    }
  });

  test('Form inputs appearance', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    const inputs = page.locator('input').first();
    if (await inputs.isVisible()) {
      // Empty state
      await expect(inputs).toHaveScreenshot('input-empty-state.png');

      // Filled state
      await inputs.fill('test input');
      await expect(inputs).toHaveScreenshot('input-filled-state.png');

      // Focused state
      await inputs.focus();
      await expect(inputs).toHaveScreenshot('input-focused-state.png');
    }
  });
});

test.describe('Visual Regression: Responsive Design', () => {
  const viewports = [
    { name: '1920x1080', width: 1920, height: 1080 },
    { name: '1366x768', width: 1366, height: 768 },
    { name: '768x1024', width: 768, height: 1024 },
    { name: '375x667', width: 375, height: 667 },
  ];

  for (const viewport of viewports) {
    test(`Homepage renders correctly at ${viewport.name}`, async ({ browser }) => {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
      });

      const responsivePage = await context.newPage();
      await responsivePage.goto('https://playwright.dev/');
      await responsivePage.waitForLoadState('networkidle');

      await expect(responsivePage).toHaveScreenshot(`homepage-${viewport.name}.png`);

      await context.close();
    });
  }
});

test.describe('Visual Regression: Dynamic Content', () => {
  test('Page after user interactions', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    // Perform some interactions
    const getStartedLink = page.getByRole('link', { name: /get started/i });
    if (await getStartedLink.isVisible()) {
      await getStartedLink.click();
      await page.waitForLoadState('networkidle');

      // Capture after navigation
      await expect(page).toHaveScreenshot('after-navigation.png', {
        maxDiffPixels: 100, // Allow up to 100 pixel differences
      });
    }
  });

  test('Loading states (if applicable)', async ({ page }) => {
    // Note: If your app has loading indicators, capture them here
    await page.goto('https://playwright.dev/');

    // For this example, just capture current state
    await expect(page).toHaveScreenshot('page-loaded-state.png', {
      fullPage: true,
    });
  });
});

test.describe('Visual Regression: Dark Mode (if applicable)', () => {
  test('Homepage in dark mode matches baseline', async ({ context }) => {
    // Create context with dark color scheme preference
    const darkContext = await context.browser()?.newContext({
      colorScheme: 'dark',
    });

    if (darkContext) {
      const darkPage = await darkContext.newPage();
      await darkPage.goto('https://playwright.dev/');
      await darkPage.waitForLoadState('networkidle');

      await expect(darkPage).toHaveScreenshot('homepage-dark-mode.png');

      await darkContext.close();
    }
  });

  test('Homepage in light mode matches baseline', async ({ context }) => {
    const lightContext = await context.browser()?.newContext({
      colorScheme: 'light',
    });

    if (lightContext) {
      const lightPage = await lightContext.newPage();
      await lightPage.goto('https://playwright.dev/');
      await lightPage.waitForLoadState('networkidle');

      await expect(lightPage).toHaveScreenshot('homepage-light-mode.png');

      await lightContext.close();
    }
  });
});
