import { NextRequest, NextResponse } from 'next/server';
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
      console.error(`[Demo Nano Banana] Hata ${res.status}:`, await res.text());
      return;
    }

    const data = await res.json() as { data?: { b64_json?: string }[] };
    const b64 = data?.data?.[0]?.b64_json;
    if (!b64) { console.error('[Demo Nano Banana] b64_json bulunamadı'); return; }

    await updateImageBase64File(id, b64);
    const memItem = getById(id);
    if (memItem) memItem.imageBase64 = b64;

    console.log(`[Demo Nano Banana] Görsel hazır → ${id}`);
  } catch (err) {
    console.error('[Demo Nano Banana] İstek hatası:', err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { theme, style, mood, customPrompt, creatorName } = await req.json() as {
      theme: string;
      style: string;
      mood: string;
      customPrompt?: string;
      creatorName?: string;
    };

    if (!theme || !style || !mood) {
      return NextResponse.json({ error: 'Tema, stil ve atmosfer gerekli' }, { status: 400 });
    }

    // Basit içerik kontrolü
    const wordsToCheck = [theme, style, mood].filter(Boolean);
    const filter = filterWords(wordsToCheck as [string, string, string]);
    if (!filter.ok) {
      return NextResponse.json(
        { error: `Uygunsuz içerik: ${filter.blocked.join(', ')}` },
        { status: 400 }
      );
    }

    const extra = customPrompt?.trim()
      ? `, ${customPrompt.trim()}`
      : ', yüksek detay, simetrik kompozisyon';

    const finalPrompt = `${theme} temalı ${style} dijital sanat eseri, ${mood} atmosfer${extra}, neon ışıklar, 8K çözünürlük, sergi kalitesi poster, no text, no letters, no words, no typography`;

    const id = randomUUID();

    const item = {
      id,
      words: [theme, style, mood] as [string, string, string],
      templateName: 'Prompt Atölyesi',
      templateNameTr: 'Prompt Atölyesi',
      templateCategory: 'Serbest Üretim',
      prompt: finalPrompt,
      imageBase64: '',
      createdAt: Date.now(),
      status: 'pending' as const,
      creatorName: creatorName?.trim() || undefined,
    };

    addPending(item);
    await addPendingFile(item).catch((e) => console.warn('fileStore yazma hatası:', e));

    if (VERTEX_API_KEY) {
      void generateImageInBackground(id, finalPrompt);
    }

    return NextResponse.json({ id, prompt: finalPrompt });
  } catch (err: any) {
    console.error('Demo route hatası:', err);
    return NextResponse.json({ error: err.message || 'Sunucu hatası' }, { status: 500 });
  }
}