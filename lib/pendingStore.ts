// Bellekte onay kuyruğu — sunucu yeniden başlatılana kadar saklanır
export interface PendingItem {
  id: string;
  words: [string, string, string];
  templateName: string;
  templateNameTr: string;
  templateCategory: string;
  prompt: string;
  imageBase64: string;
  imagePath?: string; // /generated/<id>.png (public/ relative)
  createdAt: number;
  status: 'generating' | 'pending' | 'approved' | 'rejected' | 'error';
  errorMessage?: string;
  creatorName?: string;
}

// Next.js hot-reload sırasında global objeyi koru
const g = global as any;
if (!g._pendingStore) g._pendingStore = { items: [] as PendingItem[] };
const store: { items: PendingItem[] } = g._pendingStore;

export function addPending(item: PendingItem) {
  store.items.unshift(item);
  if (store.items.length > 50) store.items = store.items.slice(0, 50);
}

export function getPending(): PendingItem[] {
  return store.items;
}

export function updateStatus(
  id: string,
  status: PendingItem['status'],
  errorMessage?: string,
): PendingItem | null {
  const item = store.items.find((i) => i.id === id);
  if (!item) return null;
  item.status = status;
  if (errorMessage !== undefined) item.errorMessage = errorMessage;
  return item;
}

export function getApproved(): PendingItem[] {
  return store.items.filter((i) => i.status === 'approved');
}

export function getById(id: string): PendingItem | null {
  return store.items.find((i) => i.id === id) ?? null;
}

export function deleteItem(id: string): boolean {
  const idx = store.items.findIndex((i) => i.id === id);
  if (idx === -1) return false;
  store.items.splice(idx, 1);
  return true;
}