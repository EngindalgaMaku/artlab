'use client';
import { useState } from 'react';
import { Lightbulb, PenTool, Cpu, Palette, CheckCircle, ChevronDown } from 'lucide-react';

const steps = [
  {
    id: 1,
    icon: Lightbulb,
    title: 'Fikir & Araştırma',
    subtitle: 'İlham kaynağı belirleme',
    color: 'text-yellow-400',
    bg: 'from-yellow-500/20 to-orange-500/20',
    border: 'border-yellow-500/30',
    detail:
      'Öğrenci önce kültürel bir referans seçer: Anadolu mozaiği, Osmanlı hat sanatı, doğa desenleri... Bu ilham kaynağı, yapay zekâya verilecek talimatın (prompt) temelini oluşturur.',
    example: '"Geleneksel Anadolu kilim motiflerini modern neon estetiğiyle birleştir"',
    duration: 'Süre: ~10 dakika',
  },
  {
    id: 2,
    icon: PenTool,
    title: 'Prompt Yazımı',
    subtitle: 'Talimat mühendisliği',
    color: 'text-cyan-400',
    bg: 'from-cyan-500/20 to-blue-500/20',
    border: 'border-cyan-500/30',
    detail:
      'Prompt Engineering: Yapay zekâyı doğru yönlendirmek için açık, detaylı ve katmanlı talimat yazma sanatı. Stil, renk paleti, kompozisyon ve atmosfer tanımlanır.',
    example: '"...simetrik kompozisyon, mor-mavi neon ışıklar, 8K kalite, sanat galerisi posterleri"',
    duration: 'Süre: ~15 dakika',
  },
  {
    id: 3,
    icon: Cpu,
    title: 'AI Üretimi',
    subtitle: 'Model işleme & iterasyon',
    color: 'text-purple-400',
    bg: 'from-purple-500/20 to-pink-500/20',
    border: 'border-purple-500/30',
    detail:
      'Yapay zekâ modeli (Midjourney / DALL-E / Stable Diffusion) prompt\'u işler ve görseli üretir. Öğrenci sonucu değerlendirerek prompt\'u rafine eder – ortalama 3-5 iterasyon.',
    example: 'Her iterasyonda öğrenci geri bildirim vererek sonucu şekillendirir.',
    duration: 'Süre: ~20 dakika (iterasyonlar dahil)',
  },
  {
    id: 4,
    icon: Palette,
    title: 'Düzenleme & Sergi',
    subtitle: 'Son rötuşlar & sunum',
    color: 'text-orange-400',
    bg: 'from-orange-500/20 to-red-500/20',
    border: 'border-orange-500/30',
    detail:
      'Seçilen en iyi görsel Adobe Photoshop veya Canva ile rafine edilir. Poster formatına getirilir, açıklama metni eklenir ve fiziksel baskıya hazırlanır.',
    example: 'A3 / 70×100 cm baskı + dijital versiyon → TÜBİTAK standında sergileme',
    duration: 'Süre: ~30 dakika',
  },
  {
    id: 5,
    icon: CheckCircle,
    title: 'Sonuç & Yansıma',
    subtitle: 'Değerlendirme & öğrenme',
    color: 'text-green-400',
    bg: 'from-green-500/20 to-teal-500/20',
    border: 'border-green-500/30',
    detail:
      '"AI sihirli kutu değil, öğrencinin yönlendirdiği bir tasarım aracıdır." Öğrenci bu süreçte problem çözme, eleştirel düşünme ve yaratıcı ifade becerilerini geliştirdi.',
    example: 'Kazanım: Prompt Engineering + Dijital Okuryazarlık + Sanat & Teknoloji Entegrasyonu',
    duration: 'TÜBİTAK 4006 Hedefleri karşılandı ✓',
  },
];

export default function ProcessBoard() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <section id="process" className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold neon-text mb-3">Prompttan Postera: Süreç</h2>
        <p className="text-white/60 text-lg">
          Her adımı keşfetmek için tıkla
        </p>
      </div>

      {/* Desktop: horizontal timeline */}
      <div className="hidden lg:block">
        <div className="relative">
          {/* Connector line */}
          <div className="absolute top-12 left-0 right-0 h-0.5 timeline-line mx-24 z-0" />

          <div className="grid grid-cols-5 gap-4 relative z-10">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = activeStep === step.id;
              return (
                <div key={step.id} className="flex flex-col items-center">
                  <button
                    onClick={() => setActiveStep(isActive ? null : step.id)}
                    className={`w-24 h-24 rounded-full border-2 bg-gradient-to-br ${step.bg} ${step.border} flex items-center justify-center transition-all duration-300 ${isActive ? 'scale-110 shadow-lg' : 'hover:scale-105'} neon-border`}
                  >
                    <Icon className={`w-10 h-10 ${step.color}`} />
                  </button>
                  <div className="mt-3 text-center">
                    <p className={`font-bold text-sm ${step.color}`}>{step.title}</p>
                    <p className="text-white/40 text-xs mt-0.5">{step.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detail panel */}
        {activeStep !== null && (() => {
          const step = steps.find((s) => s.id === activeStep)!;
          const Icon = step.icon;
          return (
            <div className={`mt-8 glass rounded-3xl p-8 border ${step.border} bg-gradient-to-br ${step.bg}`}>
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl border ${step.border} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-7 h-7 ${step.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className={`text-2xl font-bold ${step.color} mb-2`}>
                    {step.id}. {step.title}
                  </h3>
                  <p className="text-white/80 text-base leading-relaxed mb-4">{step.detail}</p>
                  <div className="bg-black/40 rounded-2xl p-4 font-mono text-sm text-cyan-300 border border-cyan-500/20 mb-3">
                    {step.example}
                  </div>
                  <p className="text-white/40 text-sm">{step.duration}</p>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Mobile: accordion */}
      <div className="lg:hidden space-y-3">
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = activeStep === step.id;
          return (
            <div
              key={step.id}
              className={`glass rounded-2xl border ${step.border} bg-gradient-to-br ${step.bg} overflow-hidden`}
            >
              <button
                onClick={() => setActiveStep(isActive ? null : step.id)}
                className="w-full p-4 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl border ${step.border} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${step.color}`} />
                  </div>
                  <div className="text-left">
                    <p className={`font-bold text-sm ${step.color}`}>{step.title}</p>
                    <p className="text-white/40 text-xs">{step.subtitle}</p>
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-white/40 transition-transform ${isActive ? 'rotate-180' : ''}`}
                />
              </button>
              {isActive && (
                <div className="px-4 pb-4 border-t border-white/10 pt-4">
                  <p className="text-white/80 text-sm leading-relaxed mb-3">{step.detail}</p>
                  <div className="bg-black/40 rounded-xl p-3 font-mono text-xs text-cyan-300 border border-cyan-500/20 mb-2">
                    {step.example}
                  </div>
                  <p className="text-white/40 text-xs">{step.duration}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}