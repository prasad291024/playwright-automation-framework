import { test, expect } from '@playwright/test';

/**
 * Performance Testing Templates
 *
 * Measure page load times, API response times, and resource performance.
 * Helps identify performance regressions early in the development cycle.
 *
 * Use these as baselines and adjust thresholds based on your app's requirements.
 */

test.describe('Performance: Page Load Times', () => {
  test('Page load completes within acceptable time', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('https://playwright.dev/');
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;

    // Expect page to load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
    console.log(`Page loaded in ${loadTime}ms`);
  });

  test('First Contentful Paint (FCP) metric', async ({ page }) => {
    await page.goto('https://playwright.dev/', { waitUntil: 'networkidle' });

    // Get performance timing metrics from browser
    const perfMetrics = await page.evaluate(() => {
      const paint = performance.getEntriesByType('paint');
      const fcp = paint.find((p) => p.name === 'first-contentful-paint');
      return fcp ? fcp.startTime : null;
    });

    expect(perfMetrics).toBeLessThan(2500); // FCP should be < 2.5s
    console.log(`First Contentful Paint: ${perfMetrics}ms`);
  });

  test('Navigation timing analysis', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    const navigationTiming = await page.evaluate(() => {
      const perf = performance.timing;
      return {
        domReady: perf.domContentLoadedEventEnd - perf.navigationStart,
        pageComplete: perf.loadEventEnd - perf.navigationStart,
        domInteractive: perf.domInteractive - perf.navigationStart,
      };
    });

    expect(navigationTiming.domReady).toBeLessThan(3000);
    expect(navigationTiming.pageComplete).toBeLessThan(5000);
    console.log('Navigation Timing:', navigationTiming);
  });
});

test.describe('Performance: API Response Times', () => {
  test('API endpoint responds within SLA', async ({ request }) => {
    const startTime = Date.now();

    const response = await request.get('https://jsonplaceholder.typicode.com/users/1');

    const responseTime = Date.now() - startTime;

    expect(response.status()).toBe(200);
    expect(responseTime).toBeLessThan(2000); // API should respond within 2s
    console.log(`API response time: ${responseTime}ms`);
  });

  test('Batch API calls complete within time limit', async ({ request }) => {
    const startTime = Date.now();
    const promises = [];

    for (let i = 1; i <= 10; i++) {
      promises.push(request.get(`https://jsonplaceholder.typicode.com/users/${i}`));
    }

    const responses = await Promise.all(promises);
    const totalTime = Date.now() - startTime;

    responses.forEach((res) => {
      expect(res.status()).toBe(200);
    });

    expect(totalTime).toBeLessThan(5000); // All 10 requests should complete within 5s
    console.log(`Processed 10 API calls in ${totalTime}ms`);
  });
});

test.describe('Performance: Resource Metrics', () => {
  test('Measure JavaScript bundle size impact', async ({ page }) => {
    const jsSize: number[] = [];

    page.on('response', (response) => {
      if (response.url().endsWith('.js')) {
        response.body().then((buffer) => {
          jsSize.push(buffer.length);
        });
      }
    });

    await page.goto('https://playwright.dev/');
    await page.waitForLoadState('networkidle');

    const totalJsSize = jsSize.reduce((a, b) => a + b, 0);
    console.log(`Total JS size: ${(totalJsSize / 1024).toFixed(2)}KB`);

    // Assert reasonable JS bundle size (< 1MB)
    expect(totalJsSize).toBeLessThan(1024 * 1024);
  });

  test('Memory usage does not leak after interactions', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    // Get initial memory
    const initialMemory = await page.evaluate(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (performance as any).memory?.usedJSHeapSize || 0;
    });

    // Perform some interactions
    for (let i = 0; i < 5; i++) {
      await page.getByRole('link').first().click();
      await page.goBack();
    }

    // Get memory after interactions
    const finalMemory = await page.evaluate(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (performance as any).memory?.usedJSHeapSize || 0;
    });

    const memoryIncrease = finalMemory - initialMemory;
    console.log(`Memory increase: ${(memoryIncrease / 1024).toFixed(2)}KB`);

    // Memory increase should be reasonable (< 50MB)
    expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
  });
});
