'use client';
import { Zap, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="glass border-t border-white/10 mt-16 py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>AI ArtLab – TÜBİTAK 4006 Bilim Fuarı</span>
          </div>
          <span className="text-white/30 text-xs pl-6">Hüsniye Özdilek Ticaret Mesleki ve Teknik Anadolu Lisesi</span>
        </div>

        <div className="flex items-center gap-2 text-white/40 text-xs">
          <span>Prompt Engineering × STEM × Sanat</span>
          <Heart className="w-3 h-3 text-pink-500 fill-pink-500" />
          <span>2026</span>
        </div>

        <div className="flex items-center gap-4 text-white/40 text-xs">
          <span className="px-3 py-1 rounded-full border border-white/10 text-cyan-400/60">
            Next.js 14
          </span>
          <span className="px-3 py-1 rounded-full border border-white/10 text-purple-400/60">
            Framer Motion
          </span>
          <span className="px-3 py-1 rounded-full border border-white/10 text-orange-400/60">
            Tailwind CSS
          </span>
        </div>
      </div>
    </footer>
  );
}