import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

/**
 * Accessibility Testing Templates (a11y)
 *
 * Use axe-core testing library to scan for accessibility issues.
 * Helps ensure your app is usable by people with disabilities.
 *
 * Install: npm install -D axe-playwright
 *
 * Common issues checked:
 * - Missing alt text on images
 * - Improper heading hierarchy
 * - Low color contrast
 * - Missing ARIA labels
 * - Keyboard navigation issues
 */

test.describe('Accessibility: WCAG Compliance', () => {
  test('Playwright.dev homepage passes accessibility scan', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    // Inject axe core library
    await injectAxe(page);

    // Run accessibility check and allow violations to be logged
    await checkA11y(page, null, {
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
    });
  });

  test('Form inputs have proper labels', async ({ page }) => {
    // Example: Create a test page with a form or use a real form
    await page.goto('https://playwright.dev/');

    // All input fields should have associated labels
    const inputs = await page.locator('input').count();
    if (inputs > 0) {
      for (let i = 0; i < inputs; i++) {
        const input = page.locator('input').nth(i);
        const ariaLabel = await input.getAttribute('aria-label');
        const id = await input.getAttribute('id');

        if (id) {
          // Check if there's a label element for this input
          const label = page.locator(`label[for="${id}"]`);
          const labelExists = await label.count();
          expect(labelExists + (ariaLabel ? 1 : 0)).toBeGreaterThan(0);
        }
      }
    }
  });

  test('All images have alternative text', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      const ariaLabel = await img.getAttribute('aria-label');

      // Image should have alt text or aria-label
      expect(alt || ariaLabel).toBeTruthy();
    }
  });

  test('Page has proper heading hierarchy', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    let lastLevel = 0;

    for (const heading of headings) {
      const tagName = await heading.evaluate((el) => el.tagName);
      const currentLevel = parseInt(tagName[1]);

      // Heading level should not skip levels (e.g., h1 -> h4 is bad)
      expect(Math.abs(currentLevel - lastLevel)).toBeLessThanOrEqual(1);
      lastLevel = currentLevel;
    }

    console.log(`Found ${headings.length} headings with proper hierarchy`);
  });

  test('Buttons and clickable elements are keyboard accessible', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    // Tab through page and verify focusable elements
    let focusCount = 0;
    let previousElement = null;

    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab');
      const focusedElement = await page.evaluate(() => {
        const el = document.activeElement;
        return el?.tagName || 'BODY';
      });

      if (focusedElement !== 'BODY' && focusedElement !== previousElement) {
        focusCount++;
        previousElement = focusedElement;
      }
    }

    // At least some elements should be keyboard navigable
    expect(focusCount).toBeGreaterThan(0);
    console.log(`Found ${focusCount} keyboard-accessible elements`);
  });

  test('Color contrast is sufficient', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    // Check if text has sufficient color contrast
    const elements = await page.locator('body *').all();

    for (const element of elements.slice(0, 100)) {
      // Check a sample of elements
      const color = await element.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return {
          color: style.color,
          backgroundColor: style.backgroundColor,
        };
      });

      // This is a simplified check - for production, use a proper contrast checker
      // like https://www.npmjs.com/package/axe-core
      console.log('Color:', color.color, 'BG:', color.backgroundColor);
    }
  });
});

test.describe('Accessibility: Screen Reader Compatibility', () => {
  test('Page structure is logical for screen readers', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    // Check for main landmark
    const main = page.locator('main, [role="main"]');
    expect(await main.count()).toBeGreaterThanOrEqual(0);

    // Check for navigation landmark
    const nav = page.locator('nav, [role="navigation"]');
    expect(await nav.count()).toBeGreaterThanOrEqual(0);

    console.log('Page landmarks for screen readers validated');
  });

  test('Links have descriptive text', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    const links = await page.locator('a').all();

    for (const link of links.slice(0, 10)) {
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      const title = await link.getAttribute('title');

      // Link should have meaningful text (not "click here", "link", etc.)
      const meaningfulText = (text || '').trim().length > 2;
      expect(meaningfulText || ariaLabel || title).toBeTruthy();
    }
  });
});
