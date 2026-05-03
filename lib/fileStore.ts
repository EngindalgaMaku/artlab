import { promises as fs } from 'fs';
import path from 'path';
import type { PendingItem } from './pendingStore';

const DATA_FILE = path.join(process.cwd(), 'data', 'submissions.json');

async function ensureDataDir() {
  const dir = path.dirname(DATA_FILE);
  await fs.mkdir(dir, { recursive: true });
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
  await fs.writeFile(DATA_FILE, JSON.stringify(items, null, 2), 'utf-8');
}

export async function addPendingFile(item: PendingItem): Promise<void> {
  const items = await readFile();
  items.unshift(item);
  const trimmed = items.slice(0, 200);
  await writeFile(trimmed);
}

export async function getPendingFile(): Promise<PendingItem[]> {
  return readFile();
}

export async function updateStatusFile(
  id: string,
  status: 'approved' | 'rejected'
): Promise<PendingItem | null> {
  const items = await readFile();
  const item = items.find((i) => i.id === id);
  if (!item) return null;
  item.status = status;
  await writeFile(items);
  return item;
}

export async function getApprovedFile(): Promise<PendingItem[]> {
  const items = await readFile();
  return items.filter((i) => i.status === 'approved');
}

export async function getByIdFile(id: string): Promise<PendingItem | null> {
  const items = await readFile();
  return items.find((i) => i.id === id) ?? null;
}

export async function updateImageBase64File(
  id: string,
  imageBase64: string
): Promise<PendingItem | null> {
  const items = await readFile();
  const item = items.find((i) => i.id === id);
  if (!item) return null;
  item.imageBase64 = imageBase64;
  item.status = 'pending'; // admin onayına gönder
  await writeFile(items);
  return item;
}