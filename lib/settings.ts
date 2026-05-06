import { promises as fs } from 'fs';
import path from 'path';

export interface AppSettings {
  /**
   * Which generation backend to use.
   *  - 'vertex'  → existing vertex.claude.gg OpenAI-images endpoint (synchronous)
   *  - 'scale'   → scale.claude.gg async task API
   */
  backend: 'vertex' | 'scale';
  /** Model id to use with the scale backend (e.g. 'nano-banana', 'imagen-4', ...) */
  scaleModel: string;
}

const SETTINGS_FILE = path.join(process.cwd(), 'data', 'settings.json');

const DEFAULTS: AppSettings = {
  backend: 'vertex',
  scaleModel: 'nano-banana',
};

async function ensureDataDir() {
  await fs.mkdir(path.dirname(SETTINGS_FILE), { recursive: true });
}

export async function readSettings(): Promise<AppSettings> {
  try {
    const raw = await fs.readFile(SETTINGS_FILE, 'utf-8');
    return { ...DEFAULTS, ...JSON.parse(raw) } as AppSettings;
  } catch {
    return { ...DEFAULTS };
  }
}

export async function writeSettings(partial: Partial<AppSettings>): Promise<AppSettings> {
  await ensureDataDir();
  const current = await readSettings();
  const updated = { ...current, ...partial };
  await fs.writeFile(SETTINGS_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  return updated;
}