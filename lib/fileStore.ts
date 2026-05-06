import { promises as fs } from 'fs';
import path from 'path';
import type { PendingItem } from './pendingStore';

const DATA_FILE = path.join(process.cwd(), 'data', 'submissions.json');
const GENERATED_DIR = path.join(process.cwd(), 'public', 'generated');

async function ensureDataDir() {
  const dir = path.dirname(DATA_FILE);
  await fs.mkdir(dir, { recursive: true });
}

async function ensureGeneratedDir() {
  await fs.mkdir(GENERATED_DIR, { recursive: true });
}

async function readFile(): Promise<PendingItem[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw) as PendingItem[];
  } catch {
    return [];
  }
}

async function writeFile(items: PendingItem[]) {
  await ensureDataDir();
  // Strip base64 blobs from JSON — use imagePath instead for storage efficiency
  const stripped = items.map((item) => ({
    ...item,
    imageBase64: item.imagePath ? '' : item.imageBase64,
  }));
  await fs.writeFile(DATA_FILE, JSON.stringify(stripped, null, 2), 'utf-8');
}

/** Save raw base64 image to public/generated/<id>.png and return the public URL path */
async function saveImageFile(id: string, b64: string): Promise<string> {
  await ensureGeneratedDir();
  const buf = Buffer.from(b64, 'base64');
  const filePath = path.join(GENERATED_DIR, `${id}.png`);
  await fs.writeFile(filePath, buf);
  return `/generated/${id}.png`;
}

/** Read image file back as base64 */
async function readImageFile(id: string): Promise<string | null> {
  try {
    const filePath = path.join(GENERATED_DIR, `${id}.png`);
    const buf = await fs.readFile(filePath);
    return buf.toString('base64');
  } catch {
    return null;
  }
}

export async function addPendingFile(item: PendingItem): Promise<void> {
  const items = await readFile();
  items.unshift(item);
  const trimmed = items.slice(0, 200);
  await writeFile(trimmed);
}

export async function getPendingFile(): Promise<PendingItem[]> {
  const items = await readFile();
  // Re-attach base64 from disk for items that have imagePath
  const hydrated = await Promise.all(
    items.map(async (item) => {
      if (item.imagePath && !item.imageBase64) {
        const b64 = await readImageFile(item.id);
        return { ...item, imageBase64: b64 ?? '' };
      }
      return item;
    }),
  );
  return hydrated;
}

export async function updateStatusFile(
  id: string,
  status: PendingItem['status'],
  errorMessage?: string,
): Promise<PendingItem | null> {
  const items = await readFile();
  const item = items.find((i) => i.id === id);
  if (!item) return null;
  item.status = status;
  if (errorMessage !== undefined) item.errorMessage = errorMessage;
  await writeFile(items);
  // Hydrate base64 before returning
  if (item.imagePath && !item.imageBase64) {
    item.imageBase64 = (await readImageFile(id)) ?? '';
  }
  return item;
}

export async function getApprovedFile(): Promise<PendingItem[]> {
  const items = await getPendingFile();
  return items.filter((i) => i.status === 'approved');
}

export async function getByIdFile(id: string): Promise<PendingItem | null> {
  const items = await readFile();
  const item = items.find((i) => i.id === id);
  if (!item) return null;
  // Hydrate base64 from disk if needed
  if (item.imagePath && !item.imageBase64) {
    item.imageBase64 = (await readImageFile(id)) ?? '';
  }
  return item;
}

export async function updateImageBase64File(
  id: string,
  imageBase64: string,
): Promise<PendingItem | null> {
  const items = await readFile();
  const item = items.find((i) => i.id === id);
  if (!item) return null;

  // Save image to disk
  const imagePath = await saveImageFile(id, imageBase64);
  item.imagePath = imagePath;
  item.imageBase64 = ''; // will be hydrated on read
  item.status = 'pending'; // admin onayına gönder

  await writeFile(items);

  // Return with base64 hydrated
  return { ...item, imageBase64 };
}

export async function deleteItemFile(id: string): Promise<boolean> {
  const items = await readFile();
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return false;
  const item = items[idx];
  items.splice(idx, 1);
  await writeFile(items);
  // Also remove image file
  if (item.imagePath) {
    const filePath = path.join(process.cwd(), 'public', item.imagePath);
    await fs.unlink(filePath).catch(() => {});
  }
  return true;
}