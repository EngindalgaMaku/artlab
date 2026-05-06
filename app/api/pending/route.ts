import { NextRequest, NextResponse } from 'next/server';
import { getPending, updateStatus, deleteItem } from '@/lib/pendingStore';
import { getPendingFile, updateStatusFile, deleteItemFile } from '@/lib/fileStore';
import type { PendingItem } from '@/lib/pendingStore';

// GET /api/pending — kuyruğu getir (dosya öncelikli, fallback bellek)
export async function GET() {
  try {
    const fileItems = await getPendingFile();
    if (fileItems.length > 0) {
      return NextResponse.json({ items: fileItems });
    }
  } catch {
    // dosya yoksa belleği kullan
  }
  return NextResponse.json({ items: getPending() });
}

// PATCH /api/pending — onayla veya reddet
export async function PATCH(req: NextRequest) {
  const { id, action } = await req.json() as { id: string; action: 'approve' | 'reject' };
  if (!id || !action) {
    return NextResponse.json({ error: 'id ve action gerekli' }, { status: 400 });
  }
  const status: PendingItem['status'] = action === 'approve' ? 'approved' : 'rejected';

  const fileItem = await updateStatusFile(id, status).catch(() => null);
  const memItem = updateStatus(id, status);

  const item = fileItem ?? memItem;
  if (!item) {
    return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 });
  }
  return NextResponse.json({ ok: true, item });
}

// DELETE /api/pending — kalıcı sil
export async function DELETE(req: NextRequest) {
  const { id } = await req.json() as { id: string };
  if (!id) {
    return NextResponse.json({ error: 'id gerekli' }, { status: 400 });
  }

  const fileDeleted = await deleteItemFile(id).catch(() => false);
  const memDeleted = deleteItem(id);

  if (!fileDeleted && !memDeleted) {
    return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}