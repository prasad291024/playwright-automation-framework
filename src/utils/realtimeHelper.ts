/*
 * Helper utilities for emitting/triggering realtime events on the server
 * Tests can use Playwright's `request` fixture to call server endpoints that
 * cause the server to broadcast websocket/sse events to connected clients.
 *
 * This file intentionally keeps logic minimal and environment-driven so you
 * can adapt it to your application's realtime API.
 */
import { APIRequestContext } from '@playwright/test';
import { getEnv } from './envHelper';

export async function emitRealtimeEvent(
  request: APIRequestContext,
  payload: Record<string, any>,
  path?: string,
): Promise<any> {
  // Path may be passed explicitly by tests or taken from env
  const emitPath = path || getEnv('REALTIME_EMIT_PATH') || '/api/realtime/emit';
  const base = getEnv('BASE_API_URL') || getEnv('API_BASE_URL') || '';
  const url = emitPath.startsWith('http') ? emitPath : `${base}${emitPath}`;

  const res = await request.post(url, { data: payload });
  const body = await res.text();
  return { status: res.status(), body };
}

export default { emitRealtimeEvent };
