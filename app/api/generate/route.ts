import { NextRequest, NextResponse } from 'next/server';
import { getStyleById, buildStyledPrompt } from '@/lib/artStyles';
import { filterWords } from '@/lib/bannedWords';
import { addPending, getById } from '@/lib/pendingStore';
import { addPendingFile, updateImageBase64File } from '@/lib/fileStore';
import { randomUUID } from 'crypto';

const VERTEX_API_KEY = process.env.VERTEX_API_KEY ?? '';

async function generateImageInBackground(id: string, prompt: string) {
  try {
    const res = await fetch('https://vertex.claude.gg/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VERTEX_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gemini-2.5-flash-image',
        prompt,
        response_format: 'b64_json',
        size: '1024x1792',
        quality: 'hd',
        n: 1,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`[Nano Banana] Hata ${res.status}:`, err);
      return;
    }

    const data = await res.json() as { data?: { b64_json?: string }[] };
    const b64 = data?.data?.[0]?.b64_json;
    if (!b64) {
      console.error('[Nano Banana] b64_json bulunamadı');
      return;
    }

    // Dosya ve bellek deposunu güncelle
    await updateImageBase64File(id, b64);
    const memItem = getById(id);
    if (memItem) {
      memItem.imageBase64 = b64;
    }

    console.log(`[Nano Banana] Görsel hazır → ${id}`);
  } catch (err) {
    console.error('[Nano Banana] İstek hatası:', err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { words, styleId, creatorName } = await req.json() as {
      words: [string, string, string];
      styleId: string;
      creatorName?: string;
    };

    if (!words || words.length !== 3 || words.some((w) => !w?.trim())) {
      return NextResponse.json({ error: '3 kelime gerekli' }, { status: 400 });
    }

    const filter = filterWords(words);
    if (!filter.ok) {
      return NextResponse.json(
        { error: `Uygunsuz kelime: ${filter.blocked.join(', ')}` },
        { status: 400 }
      );
    }

    const style = getStyleById(styleId);
    if (!style) {
      return NextResponse.json({ error: 'Geçersiz stil' }, { status: 400 });
    }

    const finalPrompt = buildStyledPrompt(style, words[0], words[1], words[2]);
    const id = randomUUID();

    const item = {
      id,
      words,
      templateName: style.name,
      templateNameTr: style.nametr,
      templateCategory: style.artist,
      prompt: finalPrompt,
      imageBase64: '',
      createdAt: Date.now(),
      status: 'pending' as const,
      creatorName: creatorName?.trim() || undefined,
    };

    addPending(item);
    await addPendingFile(item).catch((e) => console.warn('fileStore yazma hatası:', e));

    // Nano Banana ile görsel üretimi arka planda başlat (~6 sn)
    if (VERTEX_API_KEY) {
      void generateImageInBackground(id, finalPrompt);
    }

    return NextResponse.json({
      id,
      templateName: style.name,
      templateNameTr: style.nametr,
      templateCategory: style.artist,
      prompt: finalPrompt,
      imageBase64: null,
      imageReady: false,
    });
  } catch (err: any) {
    console.error('Route hatası:', err);
    return NextResponse.json({ error: err.message || 'Sunucu hatası' }, { status: 500 });
  }
}