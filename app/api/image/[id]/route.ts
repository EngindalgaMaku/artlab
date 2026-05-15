import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  // Sanitize: sadece UUID formatına izin ver
  if (!/^[0-9a-f-]{36}$/.test(id)) {
    return NextResponse.json({ error: 'Geçersiz id' }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), 'public', 'generated', `${id}.png`);

  try {
    const buf = await fs.readFile(filePath);
    return new NextResponse(buf, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Resim bulunamadı' }, { status: 404 });
  }
}