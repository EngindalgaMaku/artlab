'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, RefreshCw, Clock, Wand2, User, Download } from 'lucide-react';

const THEMES = [
  { value: 'kültür', label: '🏛️ Kültür', desc: 'Anadolu, gelenek' },
  { value: 'doğa', label: '🌿 Doğa', desc: 'Orman, fraktal' },
  { value: 'gelecek', label: '🚀 Gelecek', desc: 'Uzay, teknoloji' },
  { value: 'şehir', label: '🏙️ Şehir', desc: 'Megakent, neon' },
  { value: 'insan', label: '👤 İnsan', desc: 'Portre, biyoloji' },
  { value: 'sanat', label: '🎨 Sanat', desc: 'Soyut, ritim' },
];

const STYLES = [
  { value: 'futuristik', label: '⚡ Futuristik', desc: 'Neon, siber' },
  { value: 'minimal', label: '◻️ Minimal', desc: 'Temiz, sade' },
  { value: 'organik', label: '🌊 Organik', desc: 'Akışkan, doğal' },
  { value: 'dramatik', label: '🔥 Dramatik', desc: 'Güçlü, koyu' },
  { value: 'pastel', label: '🌸 Pastel', desc: 'Yumuşak, açık' },
  { value: 'simetrik', label: '✦ Simetrik', desc: 'Dengeli, mandala' },
];

const MOODS = [
  { value: 'gizemli', label: '🌙 Gizemli' },
  { value: 'enerjik', label: '⚡ Enerjik' },
  { value: 'sakin', label: '🌊 Sakin' },
  { value: 'epik', label: '🏔️ Epik' },
];

const STATUS_LABELS = [
  'Prompt hazırlanıyor…',
  'Nano Banana yükleniyor…',
  'Kompozisyon hesaplanıyor…',
  'Renkler ve ışıklar işleniyor…',
  'Detaylar ekleniyor…',
  'Son rötuşlar…',
  'Görsel tamamlandı!',
];

type Phase = 'idle' | 'generating' | 'polling' | 'done' | 'error';

export default function InteractiveDemo() {
  const [theme, setTheme] = useState('kültür');
  const [style, setStyle] = useState('futuristik');
  const [mood, setMood] = useState('gizemli');
  const [customPrompt, setCustomPrompt] = useState('');
  const [creatorName, setCreatorName] = useState('');

  const [phase, setPhase] = useState<Phase>('idle');
  const [progress, setProgress] = useState(0);
  const [statusLabel, setStatusLabel] = useState('');
  const [submissionId, setSubmissionId] = useState('');
  const [finalPrompt, setFinalPrompt] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const buildPreviewPrompt = () => {
    const extra = customPrompt.trim() ? `, ${customPrompt.trim()}` : ', yüksek detay, simetrik kompozisyon';
    return `${theme} temalı ${style} dijital sanat eseri, ${mood} atmosfer${extra}, neon ışıklar, 8K çözünürlük, sergi kalitesi poster`;
  };

  const stopPolling = useCallback(() => {
    if (pollingRef.current) { clearInterval(pollingRef.current); pollingRef.current = null; }
  }, []);

  const stopProgress = useCallback(() => {
    if (progressRef.current) { clearInterval(progressRef.current); progressRef.current = null; }
  }, []);

  // Polling: submission ID'ye bakarak imageBase64 geldi mi kontrol et
  const startPolling = useCallback((id: string) => {
    let attempts = 0;
    const MAX = 30; // 30 × 2sn = 60 sn max
    pollingRef.current = setInterval(async () => {
      attempts++;
      try {
        const res = await fetch(`/api/submission/${id}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.imageBase64) {
          stopPolling();
          stopProgress();
          setProgress(100);
          setStatusLabel('Görsel tamamlandı!');
          setImageSrc(`data:image/png;base64,${data.imageBase64}`);
          setPhase('done');
          setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
        } else if (attempts >= MAX) {
          stopPolling();
          stopProgress();
          setPhase('error');
          setErrorMsg('Görsel üretimi zaman aşımına uğradı. Lütfen tekrar deneyin.');
        }
      } catch { /* sessizce devam et */ }
    }, 2000);
  }, [stopPolling, stopProgress]);

  const generate = async () => {
    setPhase('generating');
    setProgress(5);
    setStatusLabel(STATUS_LABELS[0]);
    setImageSrc('');
    setErrorMsg('');

    // Animasyon ilerleme
    let step = 0;
    const pcts = [10, 22, 38, 52, 65, 78, 90];
    progressRef.current = setInterval(() => {
      step = Math.min(step + 1, STATUS_LABELS.length - 2);
      setProgress(pcts[step]);
      setStatusLabel(STATUS_LABELS[step]);
    }, 600);

    try {
      const res = await fetch('/api/demo-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme,
          style,
          mood,
          customPrompt: customPrompt.trim() || undefined,
          creatorName: creatorName.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        stopProgress();
        setPhase('error');
        setErrorMsg(data.error || 'Bir hata oluştu.');
        return;
      }

      setSubmissionId(data.id);
      setFinalPrompt(data.prompt);
      setPhase('polling');
      startPolling(data.id);
    } catch {
      stopProgress();
      setPhase('error');
      setErrorMsg('Bağlantı hatası. Lütfen tekrar deneyin.');
    }
  };

  const reset = () => {
    stopPolling();
    stopProgress();
    setPhase('idle');
    setProgress(0);
    setStatusLabel('');
    setImageSrc('');
    setErrorMsg('');
    setSubmissionId('');
    setFinalPrompt('');
    setCustomPrompt('');
  };

  // Temizlik
  useEffect(() => () => { stopPolling(); stopProgress(); }, [stopPolling, stopProgress]);

  const isGenerating = phase === 'generating' || phase === 'polling';

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/15 text-xs mb-4">
          <Sparkles className="w-3 h-3 text-orange-400" />
          <span className="text-white/60">Serbest Prompt Üretimi</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-black neon-text mb-3">Prompt Atölyesi</h2>
        <p className="text-white/50 text-lg max-w-2xl mx-auto">
          Tema, stil ve atmosferi kendin belirle. Nano Banana yapay zekâsı sana özgün bir eser üretsin.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* ─── KONTROL PANELİ ─── */}
        <div className="glass rounded-3xl p-8 space-y-7 neon-border">

          {/* Tema */}
          <div>
            <label className="block text-xs font-semibold text-white/50 mb-3 uppercase tracking-widest">
              1 — Tema Seç
            </label>
            <div className="grid grid-cols-3 gap-2">
              {THEMES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTheme(t.value)}
                  disabled={isGenerating}
                  className={`py-3 px-2 rounded-2xl text-sm font-medium transition-all duration-200 text-left border disabled:opacity-50 ${
                    theme === t.value
                      ? 'bg-gradient-to-br from-orange-500/30 to-purple-600/30 border-orange-500/60 scale-105'
                      : 'bg-white/5 hover:bg-white/10 border-white/10'
                  }`}
                >
                  <div>{t.label}</div>
                  <div className="text-white/40 text-xs mt-0.5">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Stil */}
          <div>
            <label className="block text-xs font-semibold text-white/50 mb-3 uppercase tracking-widest">
              2 — Stil Seç
            </label>
            <div className="grid grid-cols-3 gap-2">
              {STYLES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setStyle(s.value)}
                  disabled={isGenerating}
                  className={`py-3 px-2 rounded-2xl text-sm font-medium transition-all duration-200 text-left border disabled:opacity-50 ${
                    style === s.value
                      ? 'bg-gradient-to-br from-cyan-500/30 to-blue-600/30 border-cyan-500/60 scale-105'
                      : 'bg-white/5 hover:bg-white/10 border-white/10'
                  }`}
                >
                  <div>{s.label}</div>
                  <div className="text-white/40 text-xs mt-0.5">{s.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Atmosfer */}
          <div>
            <label className="block text-xs font-semibold text-white/50 mb-3 uppercase tracking-widest">
              3 — Atmosfer
            </label>
            <div className="flex flex-wrap gap-2">
              {MOODS.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setMood(m.value)}
                  disabled={isGenerating}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border disabled:opacity-50 ${
                    mood === m.value
                      ? 'bg-purple-500/30 border-purple-400/60 scale-105'
                      : 'bg-white/5 hover:bg-white/10 border-white/10'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Prompt */}
          <div>
            <label className="block text-xs font-semibold text-white/50 mb-3 uppercase tracking-widest">
              4 — Kendi Prompt&apos;unu Ekle{' '}
              <span className="text-white/25 normal-case tracking-normal">(isteğe bağlı)</span>
            </label>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              disabled={isGenerating}
              placeholder="Örn: Anadolu motifleri ile neon devreler birleşsin, altın sarısı aksan renkler…"
              rows={3}
              className="w-full bg-white/5 border border-white/20 rounded-2xl p-4 text-white placeholder:text-white/25 focus:outline-none focus:border-cyan-400/60 resize-none transition-colors text-sm leading-relaxed disabled:opacity-50"
            />
          </div>

          {/* İsim */}
          <div>
            <label className="block text-xs font-semibold text-white/50 mb-3 uppercase tracking-widest">
              5 — Adın Soyadın{' '}
              <span className="text-white/25 normal-case tracking-normal">(isteğe bağlı)</span>
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input
                type="text"
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
                disabled={isGenerating}
                placeholder="Galeride görünmesini istiyorsan yaz"
                maxLength={40}
                className="w-full bg-white/5 border border-white/20 rounded-2xl pl-11 pr-4 py-3 text-white placeholder:text-white/25 focus:outline-none focus:border-cyan-400/60 transition-colors text-sm disabled:opacity-50"
              />
            </div>
          </div>

          {/* Prompt önizleme */}
          <div className="bg-black/40 rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Wand2 className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-white/40 uppercase tracking-widest">Oluşturulan Prompt</span>
            </div>
            <p className="text-cyan-300/80 font-mono text-xs leading-relaxed line-clamp-3">{buildPreviewPrompt()}</p>
          </div>

          {/* Üret butonu */}
          <button
            onClick={generate}
            disabled={isGenerating}
            className="w-full py-6 text-xl font-bold btn-neon rounded-3xl flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-6 h-6 animate-spin" />
                <span className="text-base">{statusLabel || 'Başlatılıyor…'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                <span>ÜRET</span>
              </>
            )}
          </button>

          {/* Progress bar */}
          {isGenerating && (
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden -mt-3">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #00f0ff, #c026d3, #ff6600)',
                }}
              />
            </div>
          )}

          {/* Hata */}
          {phase === 'error' && (
            <div className="bg-red-500/10 border border-red-500/25 rounded-2xl p-4 text-red-400 text-sm text-center">
              {errorMsg}
              <button onClick={reset} className="block mx-auto mt-2 text-xs text-white/40 hover:text-white underline transition-colors">
                Tekrar Dene
              </button>
            </div>
          )}
        </div>

        {/* ─── SONUÇ ALANI ─── */}
        <div ref={resultRef} className="glass rounded-3xl p-6 neon-border min-h-[600px] flex flex-col">
          {phase === 'done' && imageSrc ? (
            <div className="flex flex-col h-full gap-4">
              {/* Başlık */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border bg-green-500/10 border-green-500/30 text-green-400">
                  <Sparkles className="w-3 h-3" /> Nano Banana — Gerçek AI Üretimi
                </span>
                <div className="flex items-center gap-1 text-white/30 text-xs">
                  <Clock className="w-3 h-3" />
                  {new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              {/* Görsel */}
              <div className="flex-1 rounded-2xl overflow-hidden result-glow">
                <img
                  src={imageSrc}
                  alt="AI Üretilen Görsel"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>

              {/* Etiketler */}
              <div className="flex flex-wrap gap-2">
                {[theme, style, mood].map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 border border-white/15 text-white/70">
                    {tag}
                  </span>
                ))}
                {creatorName && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 flex items-center gap-1">
                    <User className="w-3 h-3" /> {creatorName}
                  </span>
                )}
              </div>

              {/* Prompt */}
              <div className="bg-black/40 rounded-2xl p-4 border border-cyan-500/20">
                <p className="text-xs text-white/40 mb-1">Kullanılan Prompt:</p>
                <p className="font-mono text-xs text-cyan-300/90 leading-relaxed line-clamp-3">{finalPrompt}</p>
              </div>

              {/* Info notu */}
              <p className="text-white/25 text-xs text-center">
                Bu eser admin onayından sonra galeride ve büyük ekranda görünecek.
              </p>

              {/* Aksiyonlar */}
              <div className="flex gap-3">
                <a
                  href={imageSrc}
                  download={`prompt-atolyesi-${submissionId.slice(0, 8)}.png`}
                  className="flex-1 py-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-all text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" /> İndir
                </a>
                <button
                  onClick={reset}
                  className="flex-1 py-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-all text-sm font-medium"
                >
                  Yeniden Üret
                </button>
              </div>
            </div>
          ) : isGenerating ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-8">
              {/* Animasyonlu yüzük */}
              <div className="relative w-28 h-28">
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
                  <Sparkles className="w-9 h-9 text-cyan-400" />
                </div>
              </div>
              <div className="text-center space-y-1">
                <p className="text-white/70 font-semibold">{statusLabel}</p>
                <p className="text-white/30 text-sm">{theme} × {style} × {mood}</p>
              </div>
              <div className="w-full max-w-xs">
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${progress}%`,
                      background: 'linear-gradient(90deg, #00f0ff, #c026d3, #ff6600)',
                    }}
                  />
                </div>
                <p className="text-right text-xs text-white/20 mt-1">{progress}%</p>
              </div>
              <p className="text-white/20 text-xs">Nano Banana görsel üretiyor (~10–15 sn)…</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-6">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border border-cyan-500/30 flex items-center justify-center">
                <Sparkles className="w-14 h-14 text-cyan-400/60" />
              </div>
              <div className="text-center">
                <p className="text-white/50 text-lg font-medium">Hazır!</p>
                <p className="text-white/30 text-sm mt-1">
                  Sol taraftan seçimlerini yap ve
                  <br />
                  <span className="text-orange-400/70">"ÜRET"</span> butonuna bas
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
                {['Tema', 'Stil', 'Atmosfer'].map((label, i) => (
                  <div key={label} className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-2xl mb-1">{['🎯', '✨', '🌈'][i]}</div>
                    <div className="text-white/40 text-xs">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
