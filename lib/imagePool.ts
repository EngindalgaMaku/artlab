export interface PoolImage {
  url: string;
  desc: string;
  tags: string[];
}

function p(prompt: string, seed: number) {
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=768&height=1024&seed=${seed}&model=flux&nologo=true`;
}

export const imagePool: PoolImage[] = [
  {
    url: p('Anatolian traditional motifs merging with neon circuit boards, symmetric composition, cyan purple glow, digital art, 8K', 1001),
    desc: 'Anadolu motifleri neon devrelerle buluşuyor – gelenekten geleceğe köprü',
    tags: ['kültür', 'futuristik', 'anadolu'],
  },
  {
    url: p('Turkish coffee cup with rising data streams and digital particles, warm cold contrast, cyberpunk, 8K poster', 1002),
    desc: 'Türk kahvesinden dijital evrene geçiş – aroma piksellere dönüşüyor',
    tags: ['kültür', 'minimal', 'kahve'],
  },
  {
    url: p('Forest with fractal data streams, green neon veins growing through trees, organic technology fusion, 8K', 1003),
    desc: 'Orman ve teknoloji iç içe – doğal fraktallar veri akışına karışıyor',
    tags: ['doğa', 'organik', 'veri'],
  },
  {
    url: p('Neon lit megacity futuristic skyline, flying vehicles, AI data streams in the night sky, cyberpunk, 8K', 1004),
    desc: 'Gelecek şehir – neon ışıklı gökdelenler arasında yapay zekâ izleri',
    tags: ['gelecek', 'şehir', 'futuristik'],
  },
  {
    url: p('Human silhouette filled with glowing circuit diagrams, biology meets technology, biopunk portrait, 8K', 1005),
    desc: 'İnsan yüzü ve devre diyagramı – biyoloji ile teknoloji arasındaki ince çizgi',
    tags: ['insan', 'teknoloji', 'portre'],
  },
  {
    url: p('Algorithmic wave forms visualized as music and mathematics, vibrant abstract colors, digital art, 8K', 1006),
    desc: 'Soyut sanat dalgaları – algoritmanın yarattığı ritim ve armoni',
    tags: ['sanat', 'soyut', 'ritim'],
  },
];

export function findBestMatch(theme: string, style: string, customPrompt: string): PoolImage {
  const keywords = [theme, style, ...customPrompt.toLowerCase().split(' ')];

  const scored = imagePool.map((img) => {
    const score = keywords.reduce((acc, kw) => {
      const match = img.tags.some((tag) => tag.includes(kw) || kw.includes(tag));
      return acc + (match ? 1 : 0);
    }, 0);
    return { img, score };
  });

  scored.sort((a, b) => b.score - a.score);

  // En iyi eşleşmeyi döndür; beraberlikte rastgele seç
  const topScore = scored[0].score;
  const topCandidates = scored.filter((s) => s.score === topScore);
  return topCandidates[Math.floor(Math.random() * topCandidates.length)].img;
}