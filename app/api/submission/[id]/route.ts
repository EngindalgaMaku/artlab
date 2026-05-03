import { NextRequest, NextResponse } from 'next/server';
import { getByIdFile } from '@/lib/fileStore';
import { getById } from '@/lib/pendingStore';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // Dosyadan bul, yoksa bellekten
  const item = (await getByIdFile(id).catch(() => null)) ?? getById(id);
  if (!item) {
    return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 });
  }

  const approved = item.status === 'approved';

  return NextResponse.json({
    id: item.id,
    words: item.words,
    templateNameTr: item.templateNameTr,
    templateCategory: item.templateCategory,
    prompt: item.prompt,
    imageReady: approved && !!item.imageBase64,
    imageBase64: approved ? (item.imageBase64 || null) : null,
    status: item.status,
    createdAt: item.createdAt,
  });
}