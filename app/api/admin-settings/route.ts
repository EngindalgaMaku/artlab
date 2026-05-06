import { NextRequest, NextResponse } from 'next/server';
import { readSettings, writeSettings } from '@/lib/settings';
import { fetchImageModels } from '@/lib/scaleClient';

const VERTEX_API_KEY = process.env.VERTEX_API_KEY ?? '';

// GET /api/admin-settings — returns current settings + available scale models
export async function GET() {
  const settings = await readSettings();
  const models = VERTEX_API_KEY
    ? await fetchImageModels(VERTEX_API_KEY).catch(() => [])
    : [];
  return NextResponse.json({ settings, models });
}

// PATCH /api/admin-settings — update settings
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json() as { backend?: string; scaleModel?: string };
    const updated = await writeSettings({
      ...(body.backend === 'vertex' || body.backend === 'scale'
        ? { backend: body.backend }
        : {}),
      ...(body.scaleModel ? { scaleModel: body.scaleModel } : {}),
    });
    return NextResponse.json({ ok: true, settings: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Hata' }, { status: 500 });
  }
}