'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { Maximize2, Minimize2, ChevronLeft, ChevronRight } from 'lucide-react';

interface ApprovedItem {
  id: string;
  words: [string, string, string];
  templateNameTr: string;
  templateCategory: string;
  prompt: string;
  imageBase64: string;
  imagePath?: string;      // /generated/<id>.png — yerel disk
  imageBlobUrl?: string;   // Vercel Blob kalıcı URL
  createdAt: number;
  creatorName?: string;
}

/** Blob URL > disk path > base64 data URI öncelik sırası */
function resolveImgSrc(item: ApprovedItem): string {
  if (item.imageBlobUrl) return item.imageBlobUrl;
  if (item.imagePath) return item.imagePath;
  if (item.imageBase64) return `data:image/png;base64,${item.imageBase64}`;
  return '';
}

export default function DisplayPage() {
  const [items, setItems] = useState<ApprovedItem[]>([]);
  const [current, setCurrent] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fade, setFade] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchApproved = useCallback(async () => {
    const res = await fetch('/api/pending');
    const data = await res.json();
    const approved = (data.items ?? []).filter(
      (i: ApprovedItem & { status: string }) => i.status === 'approved',
    );
    setItems(approved);
  }, []);

  const goTo = useCallback((index: number, totalItems: number) => {
    setFade(false);
    setTimeout(() => {
      setCurrent(((index % totalItems) + totalItems) % totalItems);
      setFade(true);
    }, 400);
  }, []);

  const startAutoTimer = useCallback((totalItems: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => {
        setFade(false);
        setTimeout(() => setFade(true), 400);
        return (prev + 1) % totalItems;
      });
    }, 8000);
  }, []);

  // Otomatik geçiş — items değişince yeniden başlat
  useEffect(() => {
    if (items.length === 0) return;
    startAutoTimer(items.length);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [items.length, startAutoTimer]);

  // 5 saniyede bir yeni onaylananları çek
  useEffect(() => {
    fetchApproved();
    const interval = setInterval(fetchApproved, 5000);
    return () => clearInterval(interval);
  }, [fetchApproved]);

  // Klavye navigasyonu
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (items.length === 0) return;
      if (e.key === 'ArrowRight') {
        goTo(current + 1, items.length);
        startAutoTimer(items.length);
      } else if (e.key === 'ArrowLeft') {
        goTo(current - 1, items.length);
        startAutoTimer(items.length);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [current, items.length, goTo, startAutoTimer]);

  const navigate = (dir: 1 | -1) => {
    if (items.length === 0) return;
    goTo(current + dir, items.length);
    startAutoTimer(items.length);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const item = items[current] ?? null;
  const imgSrc = item ? resolveImgSrc(item) : '';

  return (
    <div className="min-h-screen text-white relative overflow-hidden flex flex-col items-center justify-center">
      {/* Başlık + kontroller */}
      <div className="absolute top-0 left-0 right-0 z-20 glass border-b border-white/10 px-8 py-4 flex items-center justify-between">
        <div>
          <span className="text-cyan-400 font-bold text-lg tracking-wide">AI ArtLab</span>
          <span className="text-white/30 text-sm ml-3">TÜBİTAK 4006 · 2026</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white/40 text-sm">
            {items.length > 0 ? `${current + 1} / ${items.length} onaylı eser` : 'Henüz onaylı eser yok'}
          </span>
          <button
            onClick={toggleFullscreen}
            className="p-2 glass rounded-xl text-white/50 hover:text-white transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Ana içerik */}
      {item ? (
        <div
          className="w-full h-screen flex items-center justify-center pt-16"
          style={{ opacity: fade ? 1 : 0, transition: 'opacity 0.6s ease' }}
        >
          {/* Arka plan blur görseli */}
          {imgSrc && (
            <div
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: `url(${imgSrc})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(40px) brightness(0.15)',
              }}
            />
          )}

          {/* Görsel + bilgi */}
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10 px-8 max-w-6xl w-full">
            {/* Görsel */}
            <div className="flex-shrink-0">
              {imgSrc && (
                <img
                  src={imgSrc}
                  alt="AI Eseri"
                  className="max-h-[75vh] max-w-[50vw] rounded-3xl object-contain result-glow"
                />
              )}
            </div>

            {/* Bilgi paneli */}
            <div className="glass rounded-3xl p-10 border border-white/10 max-w-md w-full space-y-6">
              <div>
                <p className="text-xs text-white/30 uppercase tracking-widest mb-4">Ziyaretçinin 3 Kelimesi</p>
                <div className="flex flex-wrap gap-3">
                  {item.words.map((w, i) => (
                    <span
                      key={i}
                      className={`px-5 py-2.5 rounded-full text-lg font-bold border ${
                        i === 0 ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                        : i === 1 ? 'bg-purple-500/15 border-purple-500/40 text-purple-300'
                        : 'bg-orange-500/15 border-orange-500/40 text-orange-300'
                      }`}
                    >
                      {w}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <p className="text-xs text-white/30 mb-1">Sanat Stili</p>
                <p className="text-xl font-bold text-white">{item.templateNameTr}</p>
                <p className="text-xs text-white/40 mt-0.5">{item.templateCategory}</p>
              </div>

              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <p className="text-xs text-white/30 mb-1">Oluşturan</p>
                <p className={`text-lg font-bold ${item.creatorName ? 'text-white' : 'text-white/30 italic'}`}>
                  {item.creatorName || 'İsimsiz'}
                </p>
              </div>

              <div className="bg-black/40 rounded-2xl p-4 border border-cyan-500/20">
                <p className="text-xs text-white/30 mb-2">AI Prompt</p>
                <p className="font-mono text-xs text-cyan-300/80 leading-relaxed line-clamp-4">
                  {item.prompt}
                </p>
              </div>

              <p className="text-white/20 text-xs text-center">
                {new Date(item.createdAt).toLocaleString('tr-TR')}
              </p>
            </div>
          </div>

          {/* Sol ok */}
          {items.length > 1 && (
            <button
              onClick={() => navigate(-1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 glass rounded-2xl border border-white/10 text-white/50 hover:text-white hover:border-cyan-400/40 hover:bg-cyan-500/10 transition-all"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          {/* Sağ ok */}
          {items.length > 1 && (
            <button
              onClick={() => navigate(1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 glass rounded-2xl border border-white/10 text-white/50 hover:text-white hover:border-cyan-400/40 hover:bg-cyan-500/10 transition-all"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}

          {/* Alt navigasyon */}
          {items.length > 1 && (
            <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-3 z-20">
              {items.length <= 12 ? (
                items.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { goTo(i, items.length); startAutoTimer(items.length); }}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === current ? 'bg-cyan-400 w-6' : 'bg-white/20 w-2 hover:bg-white/40'
                    }`}
                  />
                ))
              ) : (
                <span className="text-white/40 text-sm glass px-4 py-1.5 rounded-full border border-white/10">
                  {current + 1} / {items.length}
                </span>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center space-y-4">
          <div className="text-8xl animate-pulse">🎨</div>
          <h2 className="text-3xl font-bold text-white/60">Onaylı Eser Bekleniyor</h2>
          <p className="text-white/30">
            Admin panelinden görseller onaylandığında burada görünür
          </p>
          <p className="text-white/20 text-sm mt-8">
            Otomatik yenileniyor — her 5 saniyede kontrol ediliyor
          </p>
        </div>
      )}
    </div>
  );
}