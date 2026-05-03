'use client';
import { useEffect, useState, useCallback } from 'react';
import { Sparkles, X, Clock, Palette, ChevronLeft, ChevronRight, User, ZoomIn } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface ApprovedItem {
  id: string;
  words: [string, string, string];
  templateNameTr: string;
  templateCategory: string;
  prompt: string;
  imageBase64: string;
  createdAt: number;
  creatorName?: string;
}

function ArtCard({ item, onClick }: { item: ApprovedItem; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer glass border border-white/10 rounded-3xl overflow-hidden hover:border-cyan-400/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(0,240,255,0.08)]"
    >
      {/* Görsel */}
      <div className="relative overflow-hidden aspect-[3/4] bg-white/5">
        <img
          src={`data:image/png;base64,${item.imageBase64}`}
          alt={item.words.join(', ')}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <p className="text-white/70 text-xs font-mono line-clamp-2 leading-relaxed">
            {item.prompt.slice(0, 120)}…
          </p>
        </div>
      </div>

      {/* Alt bilgi */}
      <div className="p-4 space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {item.words.map((w, i) => (
            <span
              key={i}
              className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                i === 0 ? 'bg-cyan-500/10 border-cyan-500/25 text-cyan-300'
                : i === 1 ? 'bg-purple-500/10 border-purple-500/25 text-purple-300'
                : 'bg-orange-500/10 border-orange-500/25 text-orange-300'
              }`}
            >
              {w}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm font-semibold">{item.templateNameTr}</p>
            <p className="text-white/30 text-xs">{item.templateCategory}</p>
          </div>
          <span className="text-white/20 text-xs">
            {new Date(item.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-white/30 text-xs">
          <User className="w-3 h-3 flex-shrink-0" />
          <span className={item.creatorName ? 'text-white/50' : 'italic'}>
            {item.creatorName || 'İsimsiz'}
          </span>
        </div>
      </div>
    </div>
  );
}

function Modal({ item, onClose }: { item: ApprovedItem; onClose: () => void }) {
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { if (zoomed) setZoomed(false); else onClose(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, zoomed]);

  const imgSrc = `data:image/png;base64,${item.imageBase64}`;

  // Tam ekran zoom katmanı
  if (zoomed) {
    return (
      <div
        className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center cursor-zoom-out"
        onClick={() => setZoomed(false)}
      >
        <button
          onClick={() => setZoomed(false)}
          className="absolute top-4 right-4 p-2 rounded-xl glass border border-white/20 text-white/60 hover:text-white transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>
        <img
          src={imgSrc}
          alt={item.words.join(', ')}
          className="max-h-screen max-w-screen object-contain p-4"
          style={{ maxHeight: '95vh', maxWidth: '95vw' }}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="glass border border-white/15 rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col lg:flex-row shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Görsel */}
        <div
          className="flex-shrink-0 lg:w-1/2 bg-black/40 flex items-center justify-center p-4 relative group cursor-zoom-in"
          onClick={() => setZoomed(true)}
        >
          <img
            src={imgSrc}
            alt={item.words.join(', ')}
            className="max-h-[60vh] lg:max-h-[80vh] rounded-2xl object-contain result-glow"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl bg-black/20">
            <div className="bg-black/60 rounded-full p-3 border border-white/20">
              <ZoomIn className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Detaylar */}
        <div className="flex-1 p-8 overflow-y-auto space-y-6">
          <div className="flex items-start justify-between">
            <h2 className="text-2xl font-black text-white">Eser Detayı</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl glass border border-white/10 text-white/50 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Kelimeler */}
          <div>
            <p className="text-xs text-white/30 uppercase tracking-widest mb-3">3 Kelime</p>
            <div className="flex flex-wrap gap-2">
              {item.words.map((w, i) => (
                <span
                  key={i}
                  className={`px-4 py-2 rounded-full text-base font-bold border ${
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

          {/* Sanat stili */}
          <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-4 border border-white/10">
            <Palette className="w-5 h-5 text-purple-400 flex-shrink-0" />
            <div>
              <p className="text-white font-bold">{item.templateNameTr}</p>
              <p className="text-white/40 text-xs">{item.templateCategory}</p>
            </div>
          </div>

          {/* Prompt */}
          <div className="bg-black/40 rounded-2xl p-4 border border-cyan-500/20">
            <p className="text-xs text-white/30 uppercase tracking-widest mb-2">AI Prompt</p>
            <p className="font-mono text-xs text-cyan-300/80 leading-relaxed">{item.prompt}</p>
          </div>

          {/* Oluşturan + Tarih */}
          <div className="flex items-center justify-between text-xs text-white/30">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span className={item.creatorName ? 'text-white/60 font-medium' : 'italic'}>
                {item.creatorName || 'İsimsiz'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{new Date(item.createdAt).toLocaleString('tr-TR')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GalleryPage() {
  const [items, setItems] = useState<ApprovedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ApprovedItem | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;

  const fetchApproved = useCallback(async () => {
    const res = await fetch('/api/pending');
    const data = await res.json();
    const approved = (data.items ?? []).filter(
      (i: ApprovedItem & { status: string }) => i.status === 'approved' && i.imageBase64
    );
    setItems(approved);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchApproved();
    const interval = setInterval(fetchApproved, 8000);
    return () => clearInterval(interval);
  }, [fetchApproved]);

  // Benzersiz stiller
  const styles = ['all', ...Array.from(new Set(items.map((i) => i.templateNameTr)))];
  const filtered = filter === 'all' ? items : items.filter((i) => i.templateNameTr === filter);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const changeFilter = (f: string) => { setFilter(f); setPage(1); };

  return (
    <div className="min-h-screen text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Başlık */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/15 text-xs mb-5">
            <Sparkles className="w-3 h-3 text-orange-400" />
            <span className="text-white/60">Onaylı Eserler</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black neon-text mb-3">Sanat Galerisi</h1>
          <p className="text-white/40 text-lg">
            Ziyaretçilerin 3 kelimesiyle doğan{' '}
            <span className="text-cyan-400 font-semibold">{items.length} eser</span>
          </p>
        </div>

        {/* Stil filtreleri */}
        {!loading && items.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {styles.map((s) => (
              <button
                key={s}
                onClick={() => changeFilter(s)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                  filter === s
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                    : 'glass border-white/10 text-white/40 hover:text-white hover:border-white/25'
                }`}
              >
                {s === 'all' ? `Tümü (${items.length})` : s}
              </button>
            ))}
          </div>
        )}

        {/* İçerik */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-cyan-400 animate-spin" />
            <p className="text-white/30">Galeri yükleniyor…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32 space-y-4">
            <div className="text-7xl">🎨</div>
            <h2 className="text-2xl font-bold text-white/50">Henüz eser yok</h2>
            <p className="text-white/25 text-sm">
              {filter !== 'all'
                ? 'Bu stilde onaylı eser bulunamadı.'
                : 'Admin panelinden eserler onaylandığında burada görünür.'}
            </p>
            {filter !== 'all' && (
              <button
                onClick={() => setFilter('all')}
                className="inline-flex items-center gap-2 mt-4 text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Tümünü Göster
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
              {paged.map((item) => (
                <div key={item.id} className="break-inside-avoid">
                  <ArtCard item={item} onClick={() => setSelected(item)} />
                </div>
              ))}
            </div>

            {/* Sayfalama */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-12">
                <button
                  onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  disabled={page === 1}
                  className="p-2.5 glass rounded-xl border border-white/10 text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className={`w-9 h-9 rounded-xl text-sm font-bold border transition-all ${
                        p === page
                          ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                          : 'glass border-white/10 text-white/40 hover:text-white hover:border-white/25'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  disabled={page === totalPages}
                  className="p-2.5 glass rounded-xl border border-white/10 text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            <p className="text-center text-white/20 text-xs mt-4">
              {filtered.length} eserin {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} arası gösteriliyor
            </p>
          </>
        )}
      </main>

      {!loading && <Footer />}

      {selected && <Modal item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
