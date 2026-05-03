'use client';
import { useState } from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { artStyles, type ArtStyle } from '@/lib/artStyles';

interface StylePickerProps {
  words: [string, string, string];
  onSelect: (style: ArtStyle) => void;
}

export default function StylePicker({ words, onSelect }: StylePickerProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (style: ArtStyle) => {
    setSelected(style.id);
    setTimeout(() => onSelect(style), 300);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-6">
      {/* Başlık */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-3 mb-4">
          {words.map((w, i) => (
            <span key={i} className={`px-4 py-2 rounded-full text-base font-bold border ${
              i === 0 ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
              : i === 1 ? 'bg-purple-500/15 border-purple-500/40 text-purple-300'
              : 'bg-orange-500/15 border-orange-500/40 text-orange-300'
            }`}>{w}</span>
          ))}
        </div>
        <h2 className="text-3xl md:text-4xl font-black neon-text mb-2">Sanatsal Tarzını Seç</h2>
        <p className="text-white/50 text-base">
          Hangi sanat akımında üretilsin? Bir esere tıkla.
        </p>
      </div>

      {/* Stil grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {artStyles.map((style) => {
          const isHovered = hovered === style.id;
          const isSelected = selected === style.id;
          return (
            <button
              key={style.id}
              onClick={() => handleSelect(style)}
              onMouseEnter={() => setHovered(style.id)}
              onMouseLeave={() => setHovered(null)}
              className={`group relative rounded-2xl overflow-hidden border-2 transition-all duration-300 text-left ${
                isSelected
                  ? 'border-orange-400 scale-105 shadow-[0_0_30px_rgba(255,102,0,0.4)]'
                  : isHovered
                  ? 'border-cyan-400/60 scale-102 shadow-[0_0_20px_rgba(0,240,255,0.2)]'
                  : 'border-white/15 hover:border-white/30'
              }`}
            >
              {/* Eser görseli */}
              <div className="aspect-[3/4] relative overflow-hidden bg-slate-900">
                <img
                  src={style.exampleImage}
                  alt={style.exampleWork}
                  className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
                  onError={(e) => {
                    const t = e.currentTarget as HTMLImageElement;
                    t.style.display = 'none';
                    const p = t.parentElement;
                    if (p && !p.querySelector('.img-fb')) {
                      const d = document.createElement('div');
                      d.className = 'img-fb w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900';
                      d.innerHTML = `<div class="text-5xl">🎨</div>`;
                      p.appendChild(d);
                    }
                  }}
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                {/* Seçildi işareti */}
                {isSelected && (
                  <div className="absolute inset-0 bg-orange-500/20 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center">
                      <Check className="w-6 h-6 text-white" />
                    </div>
                  </div>
                )}

                {/* Alt bilgi */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white font-bold text-sm leading-tight">{style.nametr}</p>
                  <p className="text-white/60 text-xs mt-0.5">{style.artist}</p>
                </div>
              </div>

              {/* Hover detay paneli */}
              <div className={`absolute inset-0 bg-black/85 backdrop-blur-sm p-3 flex flex-col justify-end transition-opacity duration-300 ${isHovered && !isSelected ? 'opacity-100' : 'opacity-0'}`}>
                <p className="text-white font-bold text-sm mb-1">{style.nametr}</p>
                <p className="text-cyan-400 text-xs mb-1">{style.artist} • {style.period}</p>
                <p className="text-white/60 text-xs leading-relaxed mb-2">{style.description}</p>
                <p className="text-white/40 text-xs italic">{style.exampleWork}</p>
                <div className="mt-2 flex items-center gap-1 text-orange-400 text-xs font-semibold">
                  <span>Bu tarzı seç</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}