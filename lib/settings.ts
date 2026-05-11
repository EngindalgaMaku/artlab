import { promises as fs } from 'fs';
import path from 'path';

export interface AppSettings {
  backend: 'vertex' | 'scale';
  scaleModel: string;
}

const REDIS_URL   = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const USE_REDIS   = !!(REDIS_URL && REDIS_TOKEN);
const REDIS_KEY   = 'artlab:settings';

const SETTINGS_FILE = path.join(process.cwd(), 'data', 'settings.json');

const DEFAULTS: AppSettings = {
  backend: 'scale',
  scaleModel: 'nano-banana',
};

function getRedis() {
  const { Redis } = require('@upstash/redis') as typeof import('@upstash/redis');
  return new Redis({ url: REDIS_URL!, token: REDIS_TOKEN! });
}

export async function readSettings(): Promise<AppSettings> {
  if (USE_REDIS) {
    try {
      const redis = getRedis();
      const raw = await redis.get<AppSettings>(REDIS_KEY);
      return raw ? { ...DEFAULTS, ...raw } : { ...DEFAULTS };
    } catch {
      return { ...DEFAULTS };
    }
  }

  try {
    const raw = await fs.readFile(SETTINGS_FILE, 'utf-8');
    return { ...DEFAULTS, ...JSON.parse(raw) } as AppSettings;
  } catch {
    return { ...DEFAULTS };
  }
}

export async function writeSettings(partial: Partial<AppSettings>): Promise<AppSettings> {
  const current = await readSettings();
  const updated = { ...current, ...partial };

  if (USE_REDIS) {
    const redis = getRedis();
    await redis.set(REDIS_KEY, updated);
    return updated;
  }

  await fs.mkdir(path.dirname(SETTINGS_FILE), { recursive: true });
  await fs.writeFile(SETTINGS_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  return updated;
}