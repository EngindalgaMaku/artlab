/**
 * scale.claude.gg async client for text-to-image generation.
 *
 * Flow:
 *  1. POST /api/generate { model, params } → { task_id }
 *  2. GET  /get/:task_id every POLL_MS until status == FINISHED | FAILED
 *  3. Download the first result URL and return it as base64 PNG
 */

const SCALE_BASE = 'https://scale.claude.gg';
const POLL_MS = 3_000;          // poll every 3 seconds
const MAX_WAIT_MS = 180_000;    // give up after 3 minutes

interface SubmitResponse {
  task_id: string;
  status: string;
  poll_url?: string;
}

interface PollResponse {
  status: 'PROCESSING' | 'FINISHED' | 'FAILED';
  progress?: number;
  result?: string[];
  error?: { code: string; message: string };
}

export interface ScaleResult {
  base64: string;    // PNG image as raw base64 (no data-URL prefix)
  taskId: string;
}

export async function generateImageWithScale(
  apiKey: string,
  model: string,
  prompt: string,
  size = '832x1248',   // portrait 2:3 close to original 1024x1792
): Promise<ScaleResult> {
  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };

  // 1. Submit job
  const submitRes = await fetch(`${SCALE_BASE}/api/generate`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model,
      params: {
        prompt,
        size,
        n: 1,
      },
    }),
  });

  if (!submitRes.ok) {
    const errText = await submitRes.text().catch(() => '');
    throw new Error(`Scale submit failed ${submitRes.status}: ${errText.slice(0, 300)}`);
  }

  const submit = await submitRes.json() as SubmitResponse;
  const taskId = submit.task_id;
  if (!taskId) {
    throw new Error('Scale did not return a task_id');
  }

  // 2. Poll until done
  const deadline = Date.now() + MAX_WAIT_MS;
  while (Date.now() < deadline) {
    await sleep(POLL_MS);

    const pollRes = await fetch(`${SCALE_BASE}/get/${taskId}`, { headers });
    if (!pollRes.ok) {
      // Non-fatal — task may not be indexed yet; retry
      continue;
    }

    const poll = await pollRes.json() as PollResponse;

    if (poll.status === 'FINISHED') {
      const url = poll.result?.[0];
      if (!url) throw new Error('Scale FINISHED but result array is empty');
      // 3. Download image → base64
      const imgRes = await fetch(url);
      if (!imgRes.ok) {
        throw new Error(`Could not download result image: ${imgRes.status}`);
      }
      const buf = Buffer.from(await imgRes.arrayBuffer());
      return { base64: buf.toString('base64'), taskId };
    }

    if (poll.status === 'FAILED') {
      const msg = poll.error?.message ?? poll.error?.code ?? 'Unknown error';
      throw new Error(`Scale task failed: ${msg}`);
    }

    // PROCESSING — loop again
  }

  throw new Error(`Scale task timed out after ${MAX_WAIT_MS / 1000}s (task_id=${taskId})`);
}

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

// ── Catalog helpers ──────────────────────────────────────────────────────────

export interface ScaleModel {
  model: string;
  type: string;
  name: string;
  description: string;
  capabilities: Record<string, unknown>;
}

let _catalogCache: ScaleModel[] | null = null;
let _catalogTs = 0;
const CATALOG_TTL_MS = 5 * 60_000; // refresh every 5 minutes

export async function fetchImageModels(apiKey: string): Promise<ScaleModel[]> {
  if (_catalogCache && Date.now() - _catalogTs < CATALOG_TTL_MS) {
    return _catalogCache;
  }
  const res = await fetch(`${SCALE_BASE}/v1/models?view=compact`, {
    headers: { 'Authorization': `Bearer ${apiKey}` },
  });
  if (!res.ok) return [];
  const data = await res.json() as { models: ScaleModel[] };
  _catalogCache = (data.models ?? []).filter((m) => m.type === 'text-to-image');
  _catalogTs = Date.now();
  return _catalogCache;
}