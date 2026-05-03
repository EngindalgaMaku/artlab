'use client';
import { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';

function pollinationsUrl(prompt: string, seed: number) {
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=768&height=1024&seed=${seed}&model=flux&nologo=true`;
}

const posters = [
  {
    id: 1,
    file: pollinationsUrl('Anatolian traditional motifs merging with neon circuit boards, symmetric composition, cyan purple glow, digital art, 8K', 1001),
    title: 'Anadolu × Neon',
    prompt: 'Anadolu motifleri ile neon devreler, simetrik kompozisyon, mor-mavi ışıltı',
    color: 'from-cyan-500/20 to-purple-600/20',
    border: 'border-cyan-500/30',
  },
  {
    id: 2,
    file: pollinationsUrl('Turkish coffee cup with rising data streams and digital particles, warm cold contrast, cyberpunk, 8K poster', 1002),
    title: 'Kahve × Dijital',
    prompt: 'Türk kahvesi fincanından yükselen veri akışı, sıcak-soğuk kontrast',
    color: 'from-orange-500/20 to-amber-600/20',
    border: 'border-orange-500/30',
  },
  {
    id: 3,
    file: pollinationsUrl('Forest with fractal data streams, green neon veins growing through trees, organic technology fusion, 8K', 1003),
    title: 'Orman × Veri',
    prompt: 'Ormanda fraktal veri akışları, yeşil neon damarlar, organik teknoloji',
    color: 'from-green-500/20 to-cyan-600/20',
    border: 'border-green-500/30',
  },
  {
    id: 4,
    file: pollinationsUrl('Neon lit megacity futuristic skyline, flying vehicles, AI data streams in the night sky, cyberpunk, 8K', 1004),
    title: 'Gelecek Şehir',
    prompt: 'Neon ışıklı megaşehir, uçan araçlar, yapay zekâ izleri, gece sahnesi',
    color: 'from-blue-500/20 to-purple-600/20',
    border: 'border-blue-500/30',
  },
  {
    id: 5,
    file: pollinationsUrl('Human silhouette filled with glowing circuit diagrams, biology meets technology, biopunk portrait, 8K', 1005),
    title: 'İnsan × Devre',
    prompt: 'İnsan silüeti içinde devre diyagramı, biyoloji ve teknoloji birleşimi',
    color: 'from-pink-500/20 to-orange-600/20',
    border: 'border-pink-500/30',
  },
  {
    id: 6,
    file: pollinationsUrl('Algorithmic wave forms visualized as music and mathematics, vibrant abstract colors, digital art, 8K', 1006),
    title: 'Soyut Ritim',
    prompt: 'Algoritmik dalga formları, müzik ve matematik görselleşmesi, canlı renkler',
    color: 'from-purple-500/20 to-pink-600/20',
    border: 'border-purple-500/30',
  },
];

export default function PosterGallery() {
  const [selected, setSelected] = useState<(typeof posters)[0] | null>(null);

  return (
    <section id="gallery" className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold neon-text mb-3">Poster Galerisi</h2>
        <p className="text-white/60 text-lg">
          Her poster, farklı bir prompt ile yapay zekâya yönlendirildi
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {posters.map((poster) => (
          <div
            key={poster.id}
            onClick={() => setSelected(poster)}
            className={`group relative cursor-pointer rounded-2xl overflow-hidden border ${poster.border} bg-gradient-to-br ${poster.color} neon-border transition-all duration-300 hover:scale-105`}
          >
            {/* Poster image or placeholder */}
            <div className="aspect-[3/4] relative overflow-hidden">
              <img
                src={poster.file}
                alt={poster.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent && !parent.querySelector('.placeholder-bg')) {
                    const div = document.createElement('div');
                    div.className = 'placeholder-bg w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900';
                    div.innerHTML = `<div class="text-center p-4"><div class="text-5xl mb-3">🖼️</div><div class="text-white/40 text-xs">Poster görseli<br/>buraya gelecek</div></div>`;
                    parent.appendChild(div);
                  }
                }}
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div className="flex items-center gap-2 text-white text-sm font-medium">
                  <ZoomIn className="w-4 h-4 text-cyan-400" />
                  <span>Büyüt &amp; Prompt Gör</span>
                </div>
              </div>
            </div>

            {/* Title bar */}
            <div className="p-3 bg-black/40">
              <h3 className="font-semibold text-white text-sm">{poster.title}</h3>
              <p className="text-white/40 text-xs mt-0.5 truncate">{poster.prompt}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
          onClick={() => setSelected(null)}
        >
          <div
            className="glass rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={selected.file}
                alt={selected.title}
                className="w-full object-cover max-h-[60vh]"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.src = '';
                  target.style.display = 'none';
                }}
              />
              <button
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-red-500/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-white mb-3">{selected.title}</h3>
              <div className="bg-black/40 rounded-2xl p-4 font-mono text-sm text-cyan-300 border border-cyan-500/20">
                <span className="text-white/40 text-xs block mb-1">Kullanılan Prompt:</span>
                {selected.prompt}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}