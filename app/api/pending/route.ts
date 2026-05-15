import { NextRequest, NextResponse } from 'next/server';
import { getPending, updateStatus, deleteItem } from '@/lib/pendingStore';
import { getPendingFile, updateStatusFile, deleteItemFile } from '@/lib/fileStore';
import type { PendingItem } from '@/lib/pendingStore';

// GET /api/pending — dosya + bellek birleştir (kayıp item olmasın)
export async function GET() {
  let fileItems: PendingItem[] = [];
  try {
    fileItems = await getPendingFile();
  } catch {
    // dosya okunamazsa boş bırak
  }

  const memItems = getPending();

  // Dosyada olmayan memory item'larını ekle (yazma hatası durumunda kayıp olmasın)
  const fileIds = new Set(fileItems.map((i) => i.id));
  const extraMem = memItems.filter((i) => !fileIds.has(i.id));

  const merged = [...fileItems, ...extraMem];
  return NextResponse.json({ items: merged });
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