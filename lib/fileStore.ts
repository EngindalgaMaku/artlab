import type { PendingItem } from './pendingStore';

// ── Storage backend detection ──────────────────────────────────────────────
// Upstash Redis env vars set automatically by Vercel KV integration
const REDIS_URL   = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const BLOB_TOKEN  = process.env.BLOB_READ_WRITE_TOKEN;

const USE_REDIS = !!(REDIS_URL && REDIS_TOKEN);
const USE_BLOB  = !!BLOB_TOKEN;

const REDIS_KEY      = 'artlab:submissions';
const MAX_ITEMS      = 200;

// ── Lazy Redis client ──────────────────────────────────────────────────────
function getRedis() {
  const { Redis } = require('@upstash/redis') as typeof import('@upstash/redis');
  return new Redis({ url: REDIS_URL!, token: REDIS_TOKEN! });
}

// ── Lazy Blob helpers ──────────────────────────────────────────────────────
async function blobPut(id: string, b64: string): Promise<string> {
  const { put } = require('@vercel/blob') as typeof import('@vercel/blob');
  const buf = Buffer.from(b64, 'base64');
  const { url } = await put(`generated/${id}.png`, buf, {
    access: 'public',
    contentType: 'image/png',
    token: BLOB_TOKEN,
  });
  return url;
}

async function blobDel(url: string): Promise<void> {
  const { del } = require('@vercel/blob') as typeof import('@vercel/blob');
  await del(url, { token: BLOB_TOKEN }).catch(() => {});
}

// ── Local filesystem fallback ──────────────────────────────────────────────
import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE     = path.join(process.cwd(), 'data', 'submissions.json');
const GENERATED_DIR = path.join(process.cwd(), 'public', 'generated');

async function ensureDataDir() {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
}
async function ensureGeneratedDir() {
  await fs.mkdir(GENERATED_DIR, { recursive: true });
}

async function readLocalFile(): Promise<PendingItem[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw) as PendingItem[];
  } catch {
    return [];
  }
}

async function writeLocalFile(items: PendingItem[]) {
  await ensureDataDir();
  const stripped = items.map((item) => ({
    ...item,
    imageBase64: item.imagePath || item.imageBlobUrl ? '' : item.imageBase64,
  }));
  await fs.writeFile(DATA_FILE, JSON.stringify(stripped, null, 2), 'utf-8');
}

async function saveLocalImage(id: string, b64: string): Promise<string> {
  await ensureGeneratedDir();
  const buf = Buffer.from(b64, 'base64');
  await fs.writeFile(path.join(GENERATED_DIR, `${id}.png`), buf);
  return `/api/image/${id}`;
}

async function readLocalImage(id: string): Promise<string | null> {
  try {
    const buf = await fs.readFile(path.join(GENERATED_DIR, `${id}.png`));
    return buf.toString('base64');
  } catch {
    return null;
  }
}

// ── Redis implementation ───────────────────────────────────────────────────

async function redisReadAll(): Promise<PendingItem[]> {
  try {
    const redis = getRedis();
    const raw = await redis.get<PendingItem[]>(REDIS_KEY);
    return raw ?? [];
  } catch {
    return [];
  }
}

async function redisWriteAll(items: PendingItem[]) {
  const redis = getRedis();
  // Never store base64 blobs in Redis — use blob URL instead
  const stripped = items.map((i) => ({ ...i, imageBase64: '' }));
  await redis.set(REDIS_KEY, stripped);
}

// ── Public API (same signatures as before) ────────────────────────────────

export async function addPendingFile(item: PendingItem): Promise<void> {
  if (USE_REDIS) {
    const items = await redisReadAll();
    items.unshift({ ...item, imageBase64: '' });
    const trimmed = items.slice(0, MAX_ITEMS);
    await redisWriteAll(trimmed);
  } else {
    const items = await readLocalFile();
    items.unshift(item);
    await writeLocalFile(items.slice(0, MAX_ITEMS));
  }
}

export async function getPendingFile(): Promise<PendingItem[]> {
  if (USE_REDIS) {
    return redisReadAll();
  }
  const items = await readLocalFile();
  return Promise.all(
    items.map(async (item) => {
      if (item.imagePath && !item.imageBase64) {
        const b64 = await readLocalImage(item.id);
        return { ...item, imageBase64: b64 ?? '' };
      }
      return item;
    }),
  );
}

export async function updateStatusFile(
  id: string,
  status: PendingItem['status'],
  errorMessage?: string,
): Promise<PendingItem | null> {
  if (USE_REDIS) {
    const items = await redisReadAll();
    const item = items.find((i) => i.id === id);
    if (!item) return null;
    item.status = status;
    if (errorMessage !== undefined) item.errorMessage = errorMessage;
    await redisWriteAll(items);
    return item;
  }

  const items = await readLocalFile();
  const item = items.find((i) => i.id === id);
  if (!item) return null;
  item.status = status;
  if (errorMessage !== undefined) item.errorMessage = errorMessage;
  await writeLocalFile(items);
  if (item.imagePath && !item.imageBase64) {
    item.imageBase64 = (await readLocalImage(id)) ?? '';
  }
  return item;
}

export async function getApprovedFile(): Promise<PendingItem[]> {
  const items = await getPendingFile();
  return items.filter((i) => i.status === 'approved');
}

export async function getByIdFile(id: string): Promise<PendingItem | null> {
  if (USE_REDIS) {
    const items = await redisReadAll();
    return items.find((i) => i.id === id) ?? null;
  }

  const items = await readLocalFile();
  const item = items.find((i) => i.id === id);
  if (!item) return null;
  if (item.imagePath && !item.imageBase64) {
    item.imageBase64 = (await readLocalImage(id)) ?? '';
  }
  return item;
}

export async function updateImageBase64File(
  id: string,
  imageBase64: string,
): Promise<PendingItem | null> {
  if (USE_REDIS) {
    const items = await redisReadAll();
    const item = items.find((i) => i.id === id);
    if (!item) return null;

    if (USE_BLOB) {
      const blobUrl = await blobPut(id, imageBase64);
      item.imageBlobUrl = blobUrl;
    }
    item.imageBase64 = ''; // don't store in Redis
    item.status = 'pending';
    await redisWriteAll(items);
    // Return with base64 so caller can cache in-memory
    return { ...item, imageBase64 };
  }

  // Local filesystem path
  const items = await readLocalFile();
  const item = items.find((i) => i.id === id);
  if (!item) return null;
  const imagePath = await saveLocalImage(id, imageBase64);
  item.imagePath = imagePath;
  item.imageBase64 = '';
  item.status = 'pending';
  await writeLocalFile(items);
  return { ...item, imageBase64 };
}

export async function deleteItemFile(id: string): Promise<boolean> {
  if (USE_REDIS) {
    const items = await redisReadAll();
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) return false;
    const [removed] = items.splice(idx, 1);
    await redisWriteAll(items);
    if (removed.imageBlobUrl) await blobDel(removed.imageBlobUrl);
    return true;
  }

  const items = await readLocalFile();
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return false;
  const item = items[idx];
  items.splice(idx, 1);
  await writeLocalFile(items);
  // Disk'teki PNG dosyasını sil (imagePath format değişse bile id'den bul)
  const pngPath = path.join(GENERATED_DIR, `${item.id}.png`);
  await fs.unlink(pngPath).catch(() => {});
  return true;
}