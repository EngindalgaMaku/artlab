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

/**
 * Her Scale modeli farklı geçerli boyut listesine sahip.
 * Portresiz (portrait) en yakın boyutu modele göre seç.
 * Bilinmeyen modeller için 848x1264 kullan.
 */
const MODEL_PORTRAIT_SIZE: Record<string, string> = {
  'nano-banana':              '832x1248',   // Gemini 2.5 — sadece bu boyutu kabul ediyor
  'nano-banana-pro':          '848x1264',   // Gemini 3.0
  'nano-banana-pro-flash':    '848x1264',   // Gemini 3.1
  'flux-2':                   '848x1264',
  'flux-2-flex':              '848x1264',
  'flux-2-pro':               '848x1264',
  'flux-kontext-max':         '848x1264',
  'seedream-seedream-v4':     '848x1264',
  'seedream-seedream-v5-lite':'848x1264',
  'imagen-4':                 '896x1200',
  'imagen-4-fast':            '896x1200',
  'imagen-4-ultra':           '896x1200',
  'ideogram-3':               '848x1264',
  'gpt-image-2':              '1024x1024',
  'gpt-image-1-5':            '1024x1024',
};

function getPortraitSize(model: string): string {
  return MODEL_PORTRAIT_SIZE[model] ?? '848x1264';
}

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
  /** Boyut belirtilmezse modele göre otomatik seçilir */
  size?: string,
): Promise<ScaleResult> {
  const resolvedSize = size ?? getPortraitSize(model);
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
        size: resolvedSize,
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