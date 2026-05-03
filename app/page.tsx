'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, AlertCircle, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StylePicker from '@/components/StylePicker';
import { type ArtStyle } from '@/lib/artStyles';

type Step = 'words' | 'style' | 'generating';

const STATUS_STEPS = [
  'Kelimeler analiz ediliyor…',
  'Sanatsal stil hazırlanıyor…',
  'Prompt oluşturuluyor…',
  'Yapay zekâ fırçaları hazırlanıyor…',
  'Görsel sentezleniyor…',
  'Son rötuşlar uygulanıyor…',
  'Şaheser tamamlandı!',
];

const KIOSK_TIMEOUT_MS = 3 * 60 * 1000; // 3 dakika

export default function Home() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('words');
  const [words, setWords] = useState(['', '', '']);
  const [creatorName, setCreatorName] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<ArtStyle | null>(null);
  const [statusMsg, setStatusMsg] = useState('');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [idleCountdown, setIdleCountdown] = useState<number | null>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const resetKiosk = useCallback(() => {
    setStep('words');
    setWords(['', '', '']);
    setCreatorName('');
    setSelectedStyle(null);
    setError('');
    setProgress(0);
    setStatusMsg('');
    setIdleCountdown(null);
    if (countdownTimer.current) clearInterval(countdownTimer.current);
    setTimeout(() => inputRefs[0].current?.focus(), 100);
  }, []);

  const startIdleTimer = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    if (countdownTimer.current) clearInterval(countdownTimer.current);
    setIdleCountdown(null);

    // 2.5 dakikada geri sayım başlar (30 saniye uyarı)
    idleTimer.current = setTimeout(() => {
      let remaining = 30;
      setIdleCountdown(remaining);
      countdownTimer.current = setInterval(() => {
        remaining -= 1;
        setIdleCountdown(remaining);
        if (remaining <= 0) {
          clearInterval(countdownTimer.current!);
          resetKiosk();
        }
      }, 1000);
    }, KIOSK_TIMEOUT_MS - 30000);
  }, [resetKiosk]);

  const resetIdleTimer = useCallback(() => {
    startIdleTimer();
  }, [startIdleTimer]);

  useEffect(() => {
    // Üretim sırasında kiosk timer çalışmaz
    if (step === 'generating') {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      if (countdownTimer.current) clearInterval(countdownTimer.current);
      setIdleCountdown(null);
      return;
    }
    startIdleTimer();
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach((e) => window.addEventListener(e, resetIdleTimer));
    return () => {
      events.forEach((e) => window.removeEventListener(e, resetIdleTimer));
      if (idleTimer.current) clearTimeout(idleTimer.current);
      if (countdownTimer.current) clearInterval(countdownTimer.current);
    };
  }, [step, startIdleTimer, resetIdleTimer]);

  const handleWordChange = (i: number, val: string) => {
    const next = [...words];
    next[i] = val;
    setWords(next);
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (i < 2) inputRefs[i + 1].current?.focus();
      else if (words.every((w) => w.trim())) setStep('style');
    }
  };

  const handleStyleSelect = (style: ArtStyle) => {
    setSelectedStyle(style);
    generate(style);
  };

  const generate = async (style: ArtStyle) => {
    setStep('generating');
    setProgress(5);
    setStatusMsg(STATUS_STEPS[0]);
    setError('');

    // Animasyon
    let stepIdx = 0;
    const pcts = [15, 28, 45, 62, 78, 92, 100];
    const interval = setInterval(() => {
      stepIdx++;
      if (stepIdx < STATUS_STEPS.length) {
        setStatusMsg(STATUS_STEPS[stepIdx]);
        setProgress(pcts[stepIdx]);
      }
    }, 600);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          words: words as [string, string, string],
          styleId: style.id,
          creatorName: creatorName.trim() || undefined,
        }),
      });
      const data = await res.json();
      clearInterval(interval);

      if (!res.ok) {
        setError(data.error || 'Bir hata oluştu.');
        setStep('style');
        return;
      }

      setProgress(100);
      setStatusMsg('Şaheser tamamlandı!');

      const params = new URLSearchParams({
        id: data.id,
        style: style.nametr,
        category: style.artist,
        w1: words[0], w2: words[1], w3: words[2],
      });
      sessionStorage.setItem(`result_${data.id}`, JSON.stringify(data));

      setTimeout(() => router.push(`/result?${params.toString()}`), 600);
    } catch {
      clearInterval(interval);
      setError('Bağlantı hatası. Lütfen tekrar dene.');
      setStep('style');
    }
  };

  const WORD_LABELS = ['Birinci Kelime', 'İkinci Kelime', 'Üçüncü Kelime'];
  const WORD_PLACEHOLDERS = ['Örn: Ateş', 'Örn: Deniz', 'Örn: Rüzgâr'];
  const WORD_COLORS = [
    'border-cyan-400/60 focus:border-cyan-400',
    'border-purple-400/60 focus:border-purple-400',
    'border-orange-400/60 focus:border-orange-400',
  ];

  const wordsValid = words.every((w) => w.trim().length > 0);

  return (
    <div className="min-h-screen text-white">
      <Navbar />

      {/* ─── KİOSK SAYAÇ UYARISI ─── */}
      {idleCountdown !== null && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 glass border border-orange-500/40 rounded-2xl px-6 py-4 flex items-center gap-4">
          <RotateCcw className="w-5 h-5 text-orange-400 animate-spin" style={{ animationDuration: '2s' }} />
          <div>
            <p className="text-white font-semibold text-sm">Hareketsizlik algılandı</p>
            <p className="text-white/50 text-xs">{idleCountdown} saniye içinde sıfırlanacak</p>
          </div>
          <button
            onClick={resetIdleTimer}
            className="px-4 py-2 bg-orange-500/20 border border-orange-500/40 rounded-xl text-orange-300 text-sm font-medium hover:bg-orange-500/30 transition-colors"
          >
            Devam Et
          </button>
        </div>
      )}

      {/* ─── ADIM GÖSTERGESİ ─── */}
      <div className="flex items-center justify-center gap-3 pt-8 pb-2">
        {[
          { key: 'words', label: '1. Kelimeler' },
          { key: 'style', label: '2. Stil Seç' },
          { key: 'generating', label: '3. Üret' },
        ].map((s, i) => {
          const isActive = step === s.key;
          const isDone =
            (s.key === 'words' && (step === 'style' || step === 'generating')) ||
            (s.key === 'style' && step === 'generating');
          return (
            <div key={s.key} className="flex items-center gap-2">
              {i > 0 && <div className={`w-8 h-px ${isDone ? 'bg-orange-400' : 'bg-white/20'}`} />}
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                isActive ? 'bg-orange-500/20 border-orange-500/50 text-orange-300'
                : isDone ? 'bg-white/10 border-white/20 text-white/60'
                : 'border-white/10 text-white/30'
              }`}>
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                  isDone ? 'bg-green-500 text-white' : isActive ? 'bg-orange-500 text-white' : 'bg-white/10 text-white/30'
                }`}>{isDone ? '✓' : i + 1}</span>
                {s.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── ADIM 1: 3 KELİME ─── */}
      {step === 'words' && (
        <section className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
          <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-purple-500/5 blur-3xl pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/15 text-xs mb-4">
            <Sparkles className="w-3 h-3 text-orange-400" />
            <span className="text-white/60">TÜBİTAK 4006 Bilim Fuarı • 2026</span>
          </div>

          <p className="text-white/30 text-sm mb-8">Hüsniye Özdilek Ticaret Mesleki ve Teknik Anadolu Lisesi</p>

          <h1 className="text-5xl md:text-7xl font-black neon-text mb-3 leading-none">3 Kelime</h1>
          <h2 className="text-2xl md:text-4xl font-bold text-orange-400 mb-6">1 Şaheser</h2>

          {/* Proje amacı */}
          <div className="glass border border-white/10 rounded-2xl px-6 py-4 max-w-lg mb-10 text-left space-y-2">
            <p className="text-white/70 text-sm font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              Bu proje ne amaçla yapıldı?
            </p>
            <p className="text-white/45 text-sm leading-relaxed">
              Bu çalışma, yapay zekânın sanatla buluştuğu noktayı keşfetmek için tasarlandı.
              Ziyaretçiler 3 kelime ve bir sanat akımı seçerek yapay zekâya özgün bir tablo ürettiriyor.
              Böylece <span className="text-cyan-400/80">prompt mühendisliği</span>, <span className="text-purple-400/80">üretici yapay zekâ</span> ve
              <span className="text-orange-400/80"> sanat tarihi</span> bir arada deneyimleniyor.
            </p>
          </div>

          <div className="w-full max-w-xl">
            <div className="grid grid-cols-3 gap-4 mb-5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex flex-col gap-2">
                  <label className="text-xs text-white/40 uppercase tracking-widest text-center">
                    {WORD_LABELS[i]}
                  </label>
                  <input
                    ref={inputRefs[i]}
                    type="text"
                    value={words[i]}
                    onChange={(e) => handleWordChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    placeholder={WORD_PLACEHOLDERS[i]}
                    maxLength={25}
                    className={`w-full text-center text-xl font-bold py-5 px-3 rounded-2xl bg-white/5 border-2 ${WORD_COLORS[i]} text-white placeholder:text-white/20 focus:outline-none transition-all`}
                  />
                </div>
              ))}
            </div>

            {/* İsteğe bağlı isim */}
            <div className="mb-5">
              <label className="text-xs text-white/30 uppercase tracking-widest block text-center mb-2">
                Adın Soyadın <span className="normal-case text-white/20">(isteğe bağlı)</span>
              </label>
              <input
                type="text"
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
                placeholder="Galeride görünmesini istiyorsan yaz"
                maxLength={40}
                className="w-full text-center py-3.5 px-4 rounded-2xl bg-white/5 border border-white/15 text-white placeholder:text-white/20 focus:outline-none focus:border-white/35 transition-all text-sm"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 justify-center text-red-400 text-sm mb-4 bg-red-500/10 border border-red-500/20 rounded-xl py-3 px-4">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}

            <button
              onClick={() => setStep('style')}
              disabled={!wordsValid}
              className="w-full py-5 text-xl font-black btn-neon rounded-3xl flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>Sanat Tarzı Seç</span>
              <ArrowRight className="w-6 h-6" />
            </button>
            <p className="text-white/20 text-xs mt-3">
              10 farklı sanat akımından birini seçeceksin
            </p>
          </div>
        </section>
      )}

      {/* ─── ADIM 2: STİL SEÇ ─── */}
      {step === 'style' && (
        <section className="py-12">
          {error && (
            <div className="max-w-xl mx-auto mb-6 flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl py-3 px-4">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}
          <StylePicker words={words as [string, string, string]} onSelect={handleStyleSelect} />
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setStep('words')}
              className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Kelimeleri değiştir
            </button>
          </div>
        </section>
      )}

      {/* ─── ADIM 3: ÜRETİLİYOR ─── */}
      {step === 'generating' && (
        <section className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
          <div className="w-full max-w-md">
            {/* Seçilen stil */}
            {selectedStyle && (
              <div className="mb-8 inline-flex items-center gap-3 px-5 py-3 glass rounded-2xl border border-white/15">
                <img
                  src={selectedStyle.exampleImage}
                  alt=""
                  className="w-10 h-10 rounded-xl object-cover"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
                <div className="text-left">
                  <p className="text-white font-bold text-sm">{selectedStyle.nametr}</p>
                  <p className="text-white/40 text-xs">{selectedStyle.artist}</p>
                </div>
              </div>
            )}

            {/* Yüzük animasyonu */}
            <div className="relative w-32 h-32 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full border-4 border-white/10" />
              <div
                className="absolute inset-0 rounded-full border-4 border-transparent"
                style={{
                  borderTopColor: '#00f0ff',
                  borderRightColor: '#c026d3',
                  animation: 'spin 1.2s linear infinite',
                }}
              />
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-cyan-400" />
              </div>
            </div>

            {/* Durum mesajı */}
            <p className="text-xl font-semibold text-white mb-2">{statusMsg}</p>
            <p className="text-white/40 text-sm mb-6">
              {words.filter(Boolean).join(' • ')}
            </p>

            {/* Progress bar */}
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-2">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #00f0ff, #c026d3, #ff6600)',
                }}
              />
            </div>
            <p className="text-right text-xs text-white/30">{progress}%</p>

            <p className="text-white/25 text-xs mt-6">
              Görsel üretimi 15–25 saniye sürebilir…
            </p>
          </div>
        </section>
      )}

      {step !== 'generating' && <Footer />}
    </div>
  );
}