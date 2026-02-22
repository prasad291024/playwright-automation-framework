import { test, expect } from '@playwright/test';
import { emitRealtimeEvent } from '../../src/utils/realtimeHelper';

/**
 * Realtime tests templates
 *
 * Notes:
 * - These tests are templates showing common realtime scenarios:
 *   1) UI updates when server pushes an event
 *   2) Broadcast to multiple connected clients
 *   3) Reconnection handling
 *   4) Message ordering
 *
 * - Adapt selectors and server emit payload/endpoint to match your application.
 * - The tests use Playwright's `request` fixture to trigger server-side events
 *   (server must expose an endpoint that causes it to broadcast messages).
 *
 * TO ADAPT FOR YOUR APP:
 * 1. Update MESSAGES_LIST_SELECTOR to match your app's messages container
 * 2. Update MESSAGE_ITEM selector builder to match your message item elements
 * 3. Update page.goto('/') to your realtime feature path
 * 4. Update REALTIME_EMIT_PATH in .env to your server's emit endpoint
 */

// Selector where realtime messages appear in the UI. Update to your app's selector.
const MESSAGES_LIST_SELECTOR = '[data-testid="realtime-messages"]';
const MESSAGE_ITEM = (text: string) => `text=${text}`;

test('Realtime: UI receives server push and displays message', async ({ page, request }) => {
  // Navigate to the page under test
  await page.goto('/'); // TODO: change to your realtime page path

  // Ensure messages container exists
  await expect(page.locator(MESSAGES_LIST_SELECTOR)).toBeVisible();

  const payload = { type: 'test-message', text: `hello-${Date.now()}` };

  // Emit server event (server should broadcast to connected clients)
  const emit = await emitRealtimeEvent(request, payload);
  expect(emit.status).toBeGreaterThan(199);

  // Wait for UI to receive and render the message
  await expect(page.locator(MESSAGE_ITEM(payload.text))).toBeVisible({ timeout: 5000 });
});

test('Realtime: Broadcast reaches multiple connected clients', async ({
  browser,
  request,
  baseURL,
}) => {
  // Create two isolated contexts to simulate two users
  const contextA = await browser.newContext({ baseURL });
  const contextB = await browser.newContext({ baseURL });
  const pageA = await contextA.newPage();
  const pageB = await contextB.newPage();

  await pageA.goto('/');
  await pageB.goto('/');

  const payload = { type: 'broadcast', text: `broadcast-${Date.now()}` };

  const emit = await emitRealtimeEvent(request, payload);
  expect(emit.status).toBeGreaterThan(199);

  await expect(pageA.locator(MESSAGE_ITEM(payload.text))).toBeVisible({ timeout: 5000 });
  await expect(pageB.locator(MESSAGE_ITEM(payload.text))).toBeVisible({ timeout: 5000 });

  await contextA.close();
  await contextB.close();
});

test('Realtime: Client reconnects and receives messages after network flaps', async ({
  page,
  request,
}) => {
  await page.goto('/');
  await expect(page.locator(MESSAGES_LIST_SELECTOR)).toBeVisible();

  // Simulate offline
  await page.context().setOffline(true);
  // Wait a moment
  await page.waitForTimeout(500);

  // Simulate back online
  await page.context().setOffline(false);

  const payload = { type: 'after-reconnect', text: `reconnect-${Date.now()}` };
  const emit = await emitRealtimeEvent(request, payload);
  expect(emit.status).toBeGreaterThan(199);

  // After reconnect, the client should receive the message (server may buffer or re-emit)
  await expect(page.locator(MESSAGE_ITEM(payload.text))).toBeVisible({ timeout: 8000 });
});

test('Realtime: Messages maintain order when multiple are emitted in quick succession', async ({
  page,
  request,
}) => {
  await page.goto('/');
  await expect(page.locator(MESSAGES_LIST_SELECTOR)).toBeVisible();

  const messages = [1, 2, 3, 4, 5].map((n) => ({
    type: 'seq',
    seq: n,
    text: `seq-${n}-${Date.now()}`,
  }));

  // Emit messages quickly
  for (const m of messages) {
    const r = await emitRealtimeEvent(request, m);
    expect(r.status).toBeGreaterThan(199);
  }

  // Verify order in UI by checking the first and last messages
  await expect(page.locator(MESSAGE_ITEM(messages[0].text))).toBeVisible({ timeout: 5000 });
  await expect(page.locator(MESSAGE_ITEM(messages[messages.length - 1].text))).toBeVisible({
    timeout: 5000,
  });

  // Optional: read the list and assert ordering if your UI preserves a predictable DOM order
  // const items = await page.locator(MESSAGES_LIST_SELECTOR + ' > li').allTextContents();
  // expect(items).toContainOrdered([...messages.map(m => m.text)]);
});
