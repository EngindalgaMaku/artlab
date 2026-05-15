import { NextRequest, NextResponse } from 'next/server';
import { getByIdFile } from '@/lib/fileStore';
import { getById } from '@/lib/pendingStore';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  // Dosyadan bul, yoksa bellekten
  const item = (await getByIdFile(id).catch(() => null)) ?? getById(id);
  if (!item) {
    return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 });
  }

  const approved = item.status === 'approved';
  const hasImage = !!(item.imageBase64 || item.imagePath || item.imageBlobUrl);

  return NextResponse.json({
    id: item.id,
    words: item.words,
    templateNameTr: item.templateNameTr,
    templateCategory: item.templateCategory,
    prompt: item.prompt,
    status: item.status,
    errorMessage: item.errorMessage ?? null,
    imageReady: approved && hasImage,
    // Prefer Blob URL → local path URL → inline base64
    imageUrl: approved
      ? (item.imageBlobUrl ?? (item.imagePath ?? null))
      : null,
    imageBase64: approved && !item.imageBlobUrl && !item.imagePath
      ? (item.imageBase64 || null)
      : null,
    createdAt: item.createdAt,
    creatorName: item.creatorName ?? null,
  });
}