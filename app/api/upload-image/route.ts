import { NextRequest, NextResponse } from 'next/server';
import { updateImageBase64File } from '@/lib/fileStore';
import { getById, updateStatus } from '@/lib/pendingStore';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const id = formData.get('id') as string;
    const file = formData.get('image') as File | null;

    if (!id || !file) {
      return NextResponse.json({ error: 'id ve image gerekli' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Geçersiz dosya türü' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'Dosya 10MB limitini aşıyor' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');

    // Dosya depoya yaz
    const updated = await updateImageBase64File(id, base64);
    if (!updated) {
      return NextResponse.json({ error: 'Gönderi bulunamadı' }, { status: 404 });
    }

    // Bellekte de güncelle
    const memItem = getById(id);
    if (memItem) {
      memItem.imageBase64 = base64;
      updateStatus(id, 'pending');
    }

    return NextResponse.json({ ok: true, id });
  } catch (err: any) {
    console.error('upload-image hatası:', err);
    return NextResponse.json({ error: err.message || 'Sunucu hatası' }, { status: 500 });
  }
}