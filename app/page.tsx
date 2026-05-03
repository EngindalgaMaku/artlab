'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Palette, Wand2, LayoutGrid } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ROTATING_WORDS = [
  ['Ateş', 'Deniz', 'Özgürlük'],
  ['Zaman', 'Işık', 'Umut'],
  ['Orman', 'Sessizlik', 'Yıldız'],
  ['Rüzgâr', 'Renk', 'Hayal'],
];

const CARDS = [
  {
    href: '/olustur',
    icon: Sparkles,
    tag: 'Kiosk Deneyimi',
    title: '3 Kelime\n1 Şaheser',
    desc: '3 kelime yaz, bir sanat akımı seç. Yapay zekâ sana özgün bir tablo üretsin. En saf yaratıcı deneyim.',
    cta: 'Oluşturmaya Başla',
    gradient: 'from-cyan-500/20 via-transparent to-transparent',
    border: 'border-cyan-500/25 hover:border-cyan-400/50',
    iconColor: 'text-cyan-400',
    ctaColor: 'text-cyan-400',
    badge: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300',
  },
  {
    href: '/demo',
    icon: Wand2,
    tag: 'Serbest Üretim',
    title: 'Prompt\nAtölyesi',
    desc: 'Tema, stil ve atmosferi kendin belirle. Daha fazla kontrol, daha fazla özgürlük. Sanatçı ruhun için.',
    cta: 'Atölyeye Gir',
    gradient: 'from-purple-500/20 via-transparent to-transparent',
    border: 'border-purple-500/25 hover:border-purple-400/50',
    iconColor: 'text-purple-400',
    ctaColor: 'text-purple-400',
    badge: 'bg-purple-500/10 border-purple-500/20 text-purple-300',
  },
  {
    href: '/gallery',
    icon: LayoutGrid,
    tag: 'Eser Koleksiyonu',
    title: 'Sanat\nGalerisi',
    desc: 'Fuar boyunca oluşturulan tüm şaheserleri keşfet. Her eser, bir zihnin 3 kelimelik izinden doğdu.',
    cta: 'Galeriyi Gez',
    gradient: 'from-orange-500/20 via-transparent to-transparent',
    border: 'border-orange-500/25 hover:border-orange-400/50',
    iconColor: 'text-orange-400',
    ctaColor: 'text-orange-400',
    badge: 'bg-orange-500/10 border-orange-500/20 text-orange-300',
  },
];

export default function LandingPage() {
  const [wordIdx, setWordIdx] = useState(0);
  const [fade, setFade] = useState(true);
  const [approvedCount, setApprovedCount] = useState<number | null>(null);

  // Dönen kelimeler animasyonu
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setWordIdx((i) => (i + 1) % ROTATING_WORDS.length);
        setFade(true);
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Onaylı eser sayısı
  useEffect(() => {
    fetch('/api/pending')
      .then((r) => r.json())
      .then((d) => {
        const count = (d.items ?? []).filter(
          (i: { status: string; imageBase64: string }) => i.status === 'approved' && i.imageBase64
        ).length;
        setApprovedCount(count);
      })
      .catch(() => {});
  }, []);

  const words = ROTATING_WORDS[wordIdx];

  return (
    <div className="min-h-screen text-white">
      <Navbar />

      {/* ─── HERO ─── */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-20 pb-16 overflow-hidden">
        {/* Arka plan parlamalar */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-500/6 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-500/6 blur-3xl pointer-events-none" />

        {/* Rozet */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/15 text-xs mb-8">
          <Sparkles className="w-3 h-3 text-orange-400" />
          <span className="text-white/60">TÜBİTAK 4006 Bilim Fuarı • 2026</span>
        </div>

        {/* Ana başlık */}
        <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight">
          <span className="neon-text">Yapay Zekâ</span>
          <br />
          <span className="text-white">Sanatla Buluşuyor</span>
        </h1>

        {/* Alt başlık */}
        <p className="text-white/50 text-lg md:text-xl max-w-2xl mb-8 leading-relaxed">
          3 kelime, bir sanat akımı, sonsuz olasılık.{' '}
          <span className="text-white/80">Hüsniye Özdilek Ticaret MTAL</span> öğrencilerinin
          geliştirdiği bu proje; prompt mühendisliği, üretici yapay zekâ ve sanat tarihini
          bir araya getiriyor.
        </p>

        {/* Canlı kelime animasyonu */}
        <div
          className={`flex items-center gap-3 mb-10 transition-opacity duration-400 ${fade ? 'opacity-100' : 'opacity-0'}`}
        >
          {words.map((w, i) => (
            <span
              key={i}
              className={`px-4 py-2 rounded-full text-sm font-bold border ${
                i === 0 ? 'bg-cyan-500/10 border-cyan-500/25 text-cyan-300'
                : i === 1 ? 'bg-purple-500/10 border-purple-500/25 text-purple-300'
                : 'bg-orange-500/10 border-orange-500/25 text-orange-300'
              }`}
            >
              {w}
            </span>
          ))}
          <span className="text-white/20 text-sm">→ Şaheser</span>
        </div>

        {/* İstatistik */}
        {approvedCount !== null && approvedCount > 0 && (
          <div className="flex items-center gap-2 text-white/30 text-sm mb-10">
            <Palette className="w-4 h-4 text-cyan-400/50" />
            <span>Bugüne kadar{' '}
              <span className="text-cyan-400 font-bold">{approvedCount} özgün eser</span>{' '}
              yaratıldı
            </span>
          </div>
        )}

        {/* CTA butonları */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/olustur"
            className="inline-flex items-center gap-3 px-8 py-4 text-lg font-black btn-neon rounded-3xl"
          >
            <Sparkles className="w-5 h-5" />
            Hemen Başla
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold glass border border-white/15 rounded-3xl text-white/70 hover:text-white hover:border-white/30 transition-all"
          >
            <LayoutGrid className="w-5 h-5" />
            Galeriyi Keşfet
          </Link>
        </div>
      </section>

      {/* ─── KARTLAR ─── */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.href}
                href={card.href}
                className={`group glass border ${card.border} rounded-3xl p-8 flex flex-col gap-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(0,0,0,0.3)] relative overflow-hidden`}
              >
                {/* Gradient arka plan */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-50 pointer-events-none`} />

                {/* İçerik */}
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 ${card.iconColor}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${card.badge}`}>
                      {card.tag}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-white mb-3 whitespace-pre-line leading-tight">
                    {card.title}
                  </h3>

                  <p className="text-white/45 text-sm leading-relaxed mb-6">
                    {card.desc}
                  </p>

                  <div className={`flex items-center gap-2 text-sm font-bold ${card.ctaColor} group-hover:gap-3 transition-all`}>
                    {card.cta}
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ─── PROJE BİLGİSİ ─── */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="glass border border-white/10 rounded-3xl p-10 text-center">
          <h2 className="text-2xl font-black text-white mb-4">Bu Proje Hakkında</h2>
          <p className="text-white/50 leading-relaxed mb-6">
            Bu çalışma, yapay zekânın sanatla buluştuğu noktayı keşfetmek için tasarlandı.
            Ziyaretçiler 3 kelime ve bir sanat akımı seçerek{' '}
            <span className="text-cyan-400/80">Nano Banana (Gemini 2.5 Flash Image)</span>{' '}
            modeliyle özgün tablolar üretiyor. Böylece{' '}
            <span className="text-purple-400/80">prompt mühendisliği</span>,{' '}
            <span className="text-cyan-400/80">üretici yapay zekâ</span> ve{' '}
            <span className="text-orange-400/80">sanat tarihi</span>{' '}
            bir arada deneyimleniyor.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-xs text-white/30">
            {['İzlenimcilik', 'Sürrealizm', 'Kübizm', 'Van Gogh', 'Pop Sanat', 'Art Deco', 'Barok', 'Siberpunk', 'Art Nouveau', 'Rönesans'].map((s) => (
              <span key={s} className="px-3 py-1 rounded-full bg-white/5 border border-white/10">{s}</span>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}