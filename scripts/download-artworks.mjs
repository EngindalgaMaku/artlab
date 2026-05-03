import { writeFileSync, existsSync } from 'fs';
import { mkdirSync } from 'fs';

const dest = './public/artworks';
mkdirSync(dest, { recursive: true });

const artworks = [
  { file: 'monet.jpg',      prompt: 'Claude Monet Water Lilies impressionist oil painting 1906 museum quality' },
  { file: 'caravaggio.jpg', prompt: 'Caravaggio Judith Beheading Holofernes baroque oil painting chiaroscuro dramatic' },
  { file: 'mucha.jpg',      prompt: 'Alphonse Mucha Art Nouveau Gismonda poster 1895 floral ornamental' },
  { file: 'davinci.jpg',    prompt: 'Leonardo da Vinci Mona Lisa Renaissance sfumato oil painting Louvre' },
  { file: 'lempicka.jpg',   prompt: 'Tamara de Lempicka Art Deco 1920s glamour geometric portrait oil painting' },
  { file: 'warhol.jpg',     prompt: 'Andy Warhol Pop Art screen print Campbell soup cans bold flat colors 1962' },
  { file: 'cubism.jpg',     prompt: 'Pablo Picasso Les Demoiselles Avignon cubism geometric fragmented painting' },
];

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

for (const item of artworks) {
  const path = `${dest}/${item.file}`;
  if (existsSync(path)) {
    console.log(`SKIP ${item.file}`);
    continue;
  }

  const encoded = encodeURIComponent(item.prompt);
  const seed = Math.floor(Math.random() * 99999);
  const url = `https://image.pollinations.ai/prompt/${encoded}?width=400&height=533&model=flux&nologo=true&seed=${seed}`;

  try {
    console.log(`Downloading ${item.file}...`);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = await res.arrayBuffer();
    writeFileSync(path, Buffer.from(buf));
    console.log(`OK   ${item.file} (${Math.round(buf.byteLength / 1024)}KB)`);
  } catch (e) {
    console.log(`ERR  ${item.file} — ${e.message}`);
  }

  await sleep(12000); // rate limit için bekle
}

console.log('\nTamamlandı!');