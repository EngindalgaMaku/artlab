import { NextRequest, NextResponse } from 'next/server';
import { getPending, updateStatus } from '@/lib/pendingStore';
import { getPendingFile, updateStatusFile } from '@/lib/fileStore';

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
  const status = action === 'approve' ? 'approved' : 'rejected';

  // Önce dosyaya yaz
  const fileItem = await updateStatusFile(id, status).catch(() => null);
  // Bellekte de güncelle
  const memItem = updateStatus(id, status);

  const item = fileItem ?? memItem;
  if (!item) {
    return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 });
  }
  return NextResponse.json({ ok: true, item });
}