import { NextRequest, NextResponse } from 'next/server';
import { getStyleById, buildStyledPrompt } from '@/lib/artStyles';
import { filterWords } from '@/lib/bannedWords';
import { addPending, getById, updateStatus } from '@/lib/pendingStore';
import { addPendingFile, updateImageBase64File, updateStatusFile } from '@/lib/fileStore';
import { readSettings } from '@/lib/settings';
import { generateImageWithScale } from '@/lib/scaleClient';
import { randomUUID } from 'crypto';

const VERTEX_API_KEY = process.env.VERTEX_API_KEY ?? '';

// ── Vertex backend (synchronous, existing implementation) ──────────────────

async function generateWithVertex(id: string, prompt: string) {
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
      signal: AbortSignal.timeout(90_000),
    });

    if (!res.ok) {
      const err = await res.text();
      const msg = `Vertex API hatası ${res.status}: ${err.slice(0, 200)}`;
      console.error(`[Generate/Vertex] ${msg}`);
      await updateStatusFile(id, 'error', msg).catch(() => {});
      updateStatus(id, 'error', msg);
      return;
    }

    const data = await res.json() as { data?: { b64_json?: string }[] };
    const b64 = data?.data?.[0]?.b64_json;
    if (!b64) {
      const msg = 'Vertex: yanıtta görsel verisi bulunamadı (b64_json)';
      console.error(`[Generate/Vertex] ${msg}`);
      await updateStatusFile(id, 'error', msg).catch(() => {});
      updateStatus(id, 'error', msg);
      return;
    }

    await updateImageBase64File(id, b64);
    const memItem = getById(id);
    if (memItem) { memItem.imageBase64 = b64; memItem.status = 'pending'; }
    console.log(`[Generate/Vertex] Görsel hazır → ${id}`);
  } catch (err: any) {
    const msg = err?.name === 'TimeoutError'
      ? 'Vertex API zaman aşımı (90 sn)'
      : `Vertex istek hatası: ${err?.message ?? String(err)}`;
    console.error(`[Generate/Vertex] ${msg}`);
    await updateStatusFile(id, 'error', msg).catch(() => {});
    updateStatus(id, 'error', msg);
  }
}

// ── Scale backend (async task API) ────────────────────────────────────────

async function generateWithScale(id: string, prompt: string, model: string) {
  try {
    console.log(`[Generate/Scale] Starting task — model=${model}, id=${id}`);
    const { base64 } = await generateImageWithScale(VERTEX_API_KEY, model, prompt);

    await updateImageBase64File(id, base64);
    const memItem = getById(id);
    if (memItem) { memItem.imageBase64 = base64; memItem.status = 'pending'; }
    console.log(`[Generate/Scale] Görsel hazır → ${id}`);
  } catch (err: any) {
    const msg = err?.message ?? String(err);
    console.error(`[Generate/Scale] ${msg}`);
    await updateStatusFile(id, 'error', msg).catch(() => {});
    updateStatus(id, 'error', msg);
  }
}

// ── Route ─────────────────────────────────────────────────────────────────

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
      status: 'generating' as const,
      creatorName: creatorName?.trim() || undefined,
    };

    addPending(item);
    await addPendingFile(item).catch((e) => console.warn('fileStore yazma hatası:', e));

    if (!VERTEX_API_KEY) {
      const msg = 'API anahtarı sunucuda tanımlı değil (VERTEX_API_KEY)';
      updateStatus(id, 'error', msg);
      await updateStatusFile(id, 'error', msg).catch(() => {});
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    // Read backend selection from settings
    const settings = await readSettings().catch(() => ({ backend: 'vertex' as const, scaleModel: 'nano-banana' }));

    if (settings.backend === 'scale') {
      void generateWithScale(id, finalPrompt, settings.scaleModel);
    } else {
      void generateWithVertex(id, finalPrompt);
    }

    return NextResponse.json({
      id,
      templateName: style.name,
      templateNameTr: style.nametr,
      templateCategory: style.artist,
      prompt: finalPrompt,
      imageBase64: null,
      imageReady: false,
      status: 'generating',
      backend: settings.backend,
    });
  } catch (err: any) {
    console.error('Route hatası:', err);
    return NextResponse.json({ error: err.message || 'Sunucu hatası' }, { status: 500 });
  }
}