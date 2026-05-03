'use client';
import { useState, useRef } from 'react';
import { Sparkles, Send, RefreshCw, Clock, Wand2, Wifi, WifiOff } from 'lucide-react';
import { findBestMatch, type PoolImage } from '@/lib/imagePool';

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

const PROGRESS_STEPS = [10, 25, 42, 60, 78, 91, 100];

type ResultMode = 'ai' | 'pool';

interface GenerationResult {
  prompt: string;
  imageBase64?: string;
  poolImage?: PoolImage;
  mode: ResultMode;
  theme: string;
  style: string;
  mood: string;
  timestamp: string;
}

export default function InteractiveDemo() {
  const [theme, setTheme] = useState('kültür');
  const [style, setStyle] = useState('futuristik');
  const [mood, setMood] = useState('gizemli');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState('');
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [history, setHistory] = useState<GenerationResult[]>([]);
  const [apiStatus, setApiStatus] = useState<'unknown' | 'ok' | 'offline'>('unknown');
  const resultRef = useRef<HTMLDivElement>(null);

  const buildPrompt = () => {
    const base = `${theme} temalı ${style} dijital sanat eseri, ${mood} atmosfer`;
    const extra = customPrompt.trim() ? `, ${customPrompt.trim()}` : ', yüksek detay, simetrik kompozisyon';
    return `${base}${extra}, neon ışıklar, 8K çözünürlük, sergi kalitesi poster, TÜBİTAK bilim fuarı`;
  };

  const simulateProgress = (labels: string[], onDone: () => void) => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < PROGRESS_STEPS.length) {
        setProgress(PROGRESS_STEPS[i]);
        setProgressLabel(labels[Math.min(i, labels.length - 1)]);
        i++;
      } else {
        clearInterval(interval);
        onDone();
      }
    }, 300);
    return interval;
  };

  const generate = async () => {
    setIsGenerating(true);
    setProgress(0);
    const promptText = buildPrompt();

    const aiLabels = [
      'Prompt analiz ediliyor…',
      'Model yükleniyor…',
      'Kompozisyon hesaplanıyor…',
      'Renkler ve ışıklar işleniyor…',
      'Detaylar ekleniyor…',
      'Son rötuşlar…',
      'Tamamlandı!',
    ];
    const poolLabels = [
      'Prompt analiz ediliyor…',
      'Anahtar kelimeler çıkarılıyor…',
      'En uygun görsel aranıyor…',
      'Eşleştirme yapılıyor…',
      'Görsel yükleniyor…',
      'Son rötuşlar…',
      'Tamamlandı!',
    ];

    // API'yi dene
    try {
      setProgressLabel('Gemini API bağlanıyor…');
      setProgress(5);

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText }),
      });

      const data = await res.json();

      if (res.ok && data.imageBase64) {
        setApiStatus('ok');
        // Kalan progress adımlarını hızlı tamamla
        let p = 20;
        const tick = setInterval(() => {
          p = Math.min(p + 15, 100);
          setProgress(p);
          setProgressLabel(aiLabels[Math.floor((p / 100) * (aiLabels.length - 1))]);
          if (p >= 100) {
            clearInterval(tick);
            const newResult: GenerationResult = {
              prompt: promptText,
              imageBase64: data.imageBase64,
              mode: 'ai',
              theme, style, mood,
              timestamp: new Date().toLocaleTimeString('tr-TR'),
            };
            setResult(newResult);
            setHistory((prev) => [newResult, ...prev.slice(0, 4)]);
            setIsGenerating(false);
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
          }
        }, 250);
        return;
      }

      throw new Error(data.error || 'API yanıt vermedi');
    } catch {
      // API yoksa/hata varsa → yerel görsel havuzuna düş
      setApiStatus('offline');
      simulateProgress(poolLabels, () => {
        const poolImg = findBestMatch(theme, style, customPrompt);
        const newResult: GenerationResult = {
          prompt: promptText,
          poolImage: poolImg,
          mode: 'pool',
          theme, style, mood,
          timestamp: new Date().toLocaleTimeString('tr-TR'),
        };
        setResult(newResult);
        setHistory((prev) => [newResult, ...prev.slice(0, 4)]);
        setIsGenerating(false);
        setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
      });
    }
  };

  const reset = () => {
    setResult(null);
    setCustomPrompt('');
    setTheme('kültür');
    setStyle('futuristik');
    setMood('gizemli');
    setProgress(0);
  };

  const imageSrc = result
    ? result.mode === 'ai' && result.imageBase64
      ? `data:image/png;base64,${result.imageBase64}`
      : result.poolImage?.url ?? ''
    : '';

  return (
    <section id="demo" className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold neon-text mb-3">
          Kendi AI Sanatını Oluştur
        </h2>
        <p className="text-white/60 text-lg max-w-2xl mx-auto">
          Parametreleri seç, isteğe bağlı kendi prompt&apos;unu ekle ve yapay zekânın nasıl çalıştığını gör
        </p>

        {/* API durum göstergesi */}
        {apiStatus !== 'unknown' && (
          <div className={`inline-flex items-center gap-2 mt-4 px-4 py-1.5 rounded-full text-xs font-medium border ${
            apiStatus === 'ok'
              ? 'bg-green-500/10 border-green-500/30 text-green-400'
              : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
          }`}>
            {apiStatus === 'ok'
              ? <><Wifi className="w-3 h-3" /> Gemini API bağlı – Gerçek AI üretimi aktif</>
              : <><WifiOff className="w-3 h-3" /> API bulunamadı – Hazır görsel havuzu kullanılıyor</>
            }
          </div>
        )}
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
                  className={`py-3 px-2 rounded-2xl text-sm font-medium transition-all duration-200 text-left border ${
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
                  className={`py-3 px-2 rounded-2xl text-sm font-medium transition-all duration-200 text-left border ${
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
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
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
              4 — Kendi Prompt&apos;unu Yaz{' '}
              <span className="text-white/25 normal-case tracking-normal">(isteğe bağlı)</span>
            </label>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Örn: Anadolu motifleri ile neon devreler birleşsin, altın sarısı aksan renkler, simetrik kompozisyon..."
              rows={3}
              className="w-full bg-white/5 border border-white/20 rounded-2xl p-4 text-white placeholder:text-white/25 focus:outline-none focus:border-cyan-400/60 resize-none transition-colors text-sm leading-relaxed"
            />
          </div>

          {/* Prompt preview */}
          <div className="bg-black/40 rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Wand2 className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-white/40 uppercase tracking-widest">Oluşturulan Prompt</span>
            </div>
            <p className="text-cyan-300/80 font-mono text-xs leading-relaxed">{buildPrompt()}</p>
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
                <span className="truncate text-base">{progressLabel || 'Başlatılıyor…'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                <span>AI İLE ÜRET</span>
                <Send className="w-6 h-6" />
              </>
            )}
          </button>

          {/* Progress bar */}
          {isGenerating && (
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden -mt-3">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #00f0ff, #c026d3, #ff6600)',
                }}
              />
            </div>
          )}
        </div>

        {/* ─── SONUÇ ALANI ─── */}
        <div ref={resultRef} className="glass rounded-3xl p-6 neon-border min-h-[600px] flex flex-col">
          {result ? (
            <div className="flex flex-col h-full gap-4">
              {/* Mod rozeti */}
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                  result.mode === 'ai'
                    ? 'bg-green-500/10 border-green-500/30 text-green-400'
                    : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                }`}>
                  {result.mode === 'ai'
                    ? <><Wifi className="w-3 h-3" /> Gemini AI – Gerçek Üretim</>
                    : <><WifiOff className="w-3 h-3" /> Hazır Görsel Havuzu</>
                  }
                </span>
                <div className="flex items-center gap-1 text-white/30 text-xs">
                  <Clock className="w-3 h-3" />
                  {result.timestamp}
                </div>
              </div>

              {/* Görsel */}
              <div className="flex-1 rounded-2xl overflow-hidden result-glow relative min-h-64">
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt="AI Üretilen Görsel"
                    className="w-full h-full object-cover rounded-2xl"
                    onError={(e) => {
                      const t = e.currentTarget as HTMLImageElement;
                      t.style.display = 'none';
                      const p = t.parentElement;
                      if (p && !p.querySelector('.img-fallback')) {
                        const d = document.createElement('div');
                        d.className = 'img-fallback w-full h-full min-h-64 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl';
                        d.innerHTML = '<div class="text-7xl">🎨</div><p class="text-white/50 text-sm text-center px-6">Poster görselini<br/>public/posters/ klasörüne ekleyin</p>';
                        p.appendChild(d);
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full min-h-64 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl">
                    <div className="text-7xl">🎨</div>
                    <p className="text-white/50 text-sm text-center px-6">
                      Poster görselini<br />public/posters/ klasörüne ekleyin
                    </p>
                  </div>
                )}
              </div>

              {/* Etiketler */}
              <div className="flex flex-wrap gap-2">
                {[result.theme, result.style, result.mood].map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 border border-white/15 text-white/70">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Kullanılan prompt */}
              <div className="bg-black/40 rounded-2xl p-4 border border-cyan-500/20">
                <p className="text-xs text-white/40 mb-1">Kullanılan Prompt:</p>
                <p className="font-mono text-xs text-cyan-300/90 leading-relaxed">{result.prompt}</p>
              </div>

              {/* Açıklama (havuz modu) */}
              {result.mode === 'pool' && result.poolImage?.desc && (
                <p className="text-orange-300/70 italic text-sm">{result.poolImage.desc}</p>
              )}

              {/* Aksiyon butonları */}
              <div className="flex gap-3">
                <button onClick={generate} className="flex-1 py-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-all text-sm font-medium flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4" /> Yeniden Üret
                </button>
                <button onClick={reset} className="flex-1 py-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-all text-sm font-medium">
                  Sıfırla
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-6">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border border-cyan-500/30 flex items-center justify-center float-anim">
                <Sparkles className="w-14 h-14 text-cyan-400/60" />
              </div>
              <div className="text-center">
                <p className="text-white/50 text-lg font-medium">Hazır!</p>
                <p className="text-white/30 text-sm mt-1">
                  Sol taraftan seçimlerini yap ve
                  <br />
                  <span className="text-orange-400/70">"AI İLE ÜRET"</span> butonuna bas
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

      {/* ─── ÜRETİM GEÇMİŞİ ─── */}
      {history.length > 0 && (
        <div className="mt-12">
          <h3 className="text-xl font-semibold text-white/60 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            Son Üretimlerin
          </h3>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {history.map((item, i) => {
              const src = item.mode === 'ai' && item.imageBase64
                ? `data:image/png;base64,${item.imageBase64}`
                : item.poolImage?.url ?? '';
              return (
                <div key={i} onClick={() => setResult(item)} className="flex-shrink-0 w-36 cursor-pointer group">
                  <div className="w-36 h-36 rounded-2xl overflow-hidden border border-white/10 group-hover:border-cyan-500/40 transition-all">
                    {src ? (
                      <img src={src} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).parentElement!.innerHTML = '<div class="w-full h-full bg-slate-800 flex items-center justify-center text-4xl">🎨</div>'; }} />
                    ) : (
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center text-4xl">🎨</div>
                    )}
                  </div>
                  <div className="mt-1.5 text-xs text-white/40 truncate px-1">{item.theme} × {item.style}</div>
                  <div className="text-xs text-white/20 px-1">{item.timestamp}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}