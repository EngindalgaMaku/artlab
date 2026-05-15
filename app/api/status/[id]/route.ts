import { NextRequest, NextResponse } from 'next/server';
import { getByIdFile } from '@/lib/fileStore';
import { getById } from '@/lib/pendingStore';

/**
 * GET /api/status/:id
 * Lightweight polling endpoint — returns only status/meta, NOT the full base64.
 * The result page polls this every 7 s to know when to fetch the full image.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  // File store first (persistent), fallback to in-memory
  const item = (await getByIdFile(id).catch(() => null)) ?? getById(id);

  if (!item) {
    return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 });
  }

  return NextResponse.json({
    id: item.id,
    status: item.status,             // 'generating' | 'pending' | 'approved' | 'rejected' | 'error'
    errorMessage: item.errorMessage ?? null,
    imageReady: item.status === 'approved' && !!(item.imageBase64 || item.imagePath),
    imagePath: item.status === 'approved' ? (item.imagePath ?? null) : null,
    createdAt: item.createdAt,
  });
}