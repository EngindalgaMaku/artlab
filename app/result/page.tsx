'use client';
import { useEffect, useState, useCallback, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Download, Sparkles, RefreshCw, Clock, CheckCircle, AlertTriangle,
} from 'lucide-react';
import QRCode from 'qrcode';
import { addWatermark } from '@/lib/addWatermark';

interface StatusData {
  id: string;
  status: 'generating' | 'pending' | 'approved' | 'rejected' | 'error';
  errorMessage: string | null;
  imageReady: boolean;
  imagePath: string | null;
}

interface FullData extends StatusData {
  words?: [string, string, string];
  templateNameTr: string;
  templateCategory: string;
  prompt: string;
  imageBase64: string | null;
  imageUrl: string | null;
}

const STATUS_LABELS: Record<StatusData['status'], string> = {
  generating: 'Görsel üretiliyor…',
  pending:    'Admin onayı bekleniyor…',
  approved:   'Görsel Hazır',
  rejected:   'Reddedildi',
  error:      'Üretim Hatası',
};

const POLL_INTERVAL_MS = 7_000;

function ResultContent() {
  const params = useSearchParams();
  const router = useRouter();

  const [status, setStatus] = useState<StatusData | null>(null);
  const [fullData, setFullData] = useState<FullData | null>(null);
  const [imgSrc, setImgSrc] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  const [checking, setChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [pollCount, setPollCount] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const startTimeRef = useRef<number>(Date.now());
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const id = params.get('id') ?? '';
  const style = params.get('style') ?? '';
  const category = params.get('category') ?? '';
  const w1 = params.get('w1') ?? '';
  const w2 = params.get('w2') ?? '';
  const w3 = params.get('w3') ?? '';
  const creatorName = params.get('name') ?? '';

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  /** Lightweight status check — only fetches meta, not the full image */
  const checkStatus = useCallback(async (silent = false) => {
    if (!id) return;
    if (!silent) setChecking(true);
    try {
      const res = await fetch(`/api/status/${id}`);
      if (!res.ok) return;
      const s: StatusData = await res.json();
      setStatus(s);
      setLastChecked(new Date());
      setPollCount((c) => c + 1);

      // Terminal states — fetch full data then stop polling
      if (s.status === 'approved' && s.imageReady) {
        stopPolling();
        // Fetch full submission to get base64 / imageUrl
        const fullRes = await fetch(`/api/submission/${id}`);
        if (fullRes.ok) {
          const fd: FullData = await fullRes.json();
          setFullData(fd);

          // Prefer disk URL; fall back to inline base64
          let rawSrc: string | null = null;
          if (fd.imageUrl) {
            rawSrc = fd.imageUrl; // e.g. /generated/<id>.png
          } else if (fd.imageBase64) {
            rawSrc = `data:image/png;base64,${fd.imageBase64}`;
          }
          if (rawSrc) {
            const watermarked = await addWatermark(
              rawSrc,
              creatorName,
              'AI ArtLab',
            );
            setImgSrc(watermarked);
          }
        }
      } else if (s.status === 'error' || s.status === 'rejected') {
        stopPolling();
      }
    } finally {
      if (!silent) setChecking(false);
    }
  }, [id, creatorName, stopPolling]);

  // Bootstrap
  useEffect(() => {
    if (!id) return;

    // Load meta from session storage first
    const raw = sessionStorage.getItem(`result_${id}`);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as FullData;
        setFullData({ ...parsed, imageBase64: null, imageReady: false });
      } catch {}
    }

    // Start 1-second elapsed counter
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);

    // Immediate first check
    checkStatus(true);

    // Start polling
    pollRef.current = setInterval(() => checkStatus(true), POLL_INTERVAL_MS);

    // QR code
    const qrText = `AI ArtLab – TÜBİTAK 4006\nKelimeler: ${w1} · ${w2} · ${w3}\nStil: ${style}`;
    QRCode.toDataURL(qrText, {
      width: 200,
      margin: 2,
      color: { dark: '#00f0ff', light: '#0a0a2e' },
    }).then(setQrUrl);

    return () => stopPolling();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleDownload = () => {
    if (!imgSrc) return;
    const a = document.createElement('a');
    a.href = imgSrc;
    a.download = `aiartlab-${w1}-${w2}-${w3}.png`;
    a.click();
  };

  const handleNewArt = () => {
    stopPolling();
    sessionStorage.removeItem(`result_${id}`);
    router.push('/olustur');
  };

  if (!status && !fullData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-4 border-cyan-400/30 border-t-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-white/50">Yükleniyor…</p>
        </div>
      </div>
    );
  }

  const currentStatus = status?.status ?? 'generating';
  const imageReady = currentStatus === 'approved' && !!imgSrc;
  const isError = currentStatus === 'error';
  const isRejected = currentStatus === 'rejected';
  const isGenerating = currentStatus === 'generating';
  const isPending = currentStatus === 'pending';

  const elapsedMM = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const elapsedSS = String(elapsed % 60).padStart(2, '0');

  return (
    <div className="min-h-screen text-white flex flex-col">
      {/* Top bar */}
      <div className="glass border-b border-white/10 px-6 py-3 flex items-center justify-between">
        <button
          onClick={handleNewArt}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Yeni Şaheser
        </button>
        <span className="text-cyan-400 font-semibold text-sm">AI ArtLab</span>
        <button
          onClick={handleDownload}
          disabled={!imageReady}
          className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" /> İndir
        </button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-0">
        {/* ─── Görsel alanı (sol / üst) ─── */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          {imageReady ? (
            <img
              src={imgSrc}
              alt="AI Üretilen Sanat Eseri"
              className="max-h-[80vh] max-w-full rounded-3xl result-glow object-contain"
            />
          ) : isError ? (
            /* Hata durumu */
            <div className="text-center max-w-sm space-y-6">
              <div className="relative w-36 h-36 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-red-500/20" />
                <div className="absolute inset-5 rounded-full bg-red-500/10 flex items-center justify-center">
                  <AlertTriangle className="w-10 h-10 text-red-400/80" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-red-400 mb-2">Görsel Üretilemedi</h2>
                <p className="text-white/40 text-sm leading-relaxed">
                  {status?.errorMessage ?? 'API bir hata döndürdü veya zaman aşımı oluştu.'}
                </p>
              </div>
              <button
                onClick={handleNewArt}
                className="flex items-center gap-2 mx-auto px-6 py-3 btn-neon rounded-2xl font-semibold text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Yeniden Dene
              </button>
            </div>
          ) : isRejected ? (
            /* Reddedildi */
            <div className="text-center max-w-sm space-y-6">
              <div className="relative w-36 h-36 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-orange-500/20" />
                <div className="absolute inset-5 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <AlertTriangle className="w-10 h-10 text-orange-400/80" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-orange-400 mb-2">İçerik Onaylanmadı</h2>
                <p className="text-white/40 text-sm leading-relaxed">
                  Görseliniz yönetici tarafından uygun bulunmadı.
                </p>
              </div>
              <button
                onClick={handleNewArt}
                className="flex items-center gap-2 mx-auto px-6 py-3 btn-neon rounded-2xl font-semibold text-sm"
              >
                <Sparkles className="w-4 h-4" />
                Yeni Şaheser Yarat
              </button>
            </div>
          ) : (
            /* Üretiliyor / Onay bekleniyor */
            <div className="text-center max-w-sm space-y-6">
              {/* Animasyonlu halka */}
              <div className="relative w-36 h-36 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-white/5" />
                <div
                  className="absolute inset-0 rounded-full border-4 border-transparent"
                  style={{
                    borderTopColor: '#00f0ff',
                    borderRightColor: '#c026d3',
                    animation: 'spin 2s linear infinite',
                  }}
                />
                <div className="absolute inset-5 rounded-full bg-cyan-500/10 flex items-center justify-center">
                  <Clock className="w-10 h-10 text-cyan-400/60" />
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {isGenerating ? 'Görsel Üretiliyor' : 'Görsel Onay Bekliyor'}
                </h2>
                <p className="text-white/40 text-sm leading-relaxed">
                  {isGenerating
                    ? 'Yapay zekâ görselinizi oluşturuyor. Bu 15–90 saniye sürebilir.'
                    : 'Görseliniz admin ekibine iletildi. Onaylandığında burada görünecek.'}
                </p>
              </div>

              {/* Geçen süre — büyük sayaç */}
              <div className="glass rounded-2xl px-6 py-4 border border-cyan-500/20 inline-flex items-center gap-3 mx-auto">
                <Clock className="w-5 h-5 text-cyan-400/70 flex-shrink-0" />
                <div className="text-left">
                  <p className="font-mono text-3xl font-black text-cyan-300 leading-none tracking-widest">
                    {elapsedMM}:{elapsedSS}
                  </p>
                  <p className="text-white/30 text-xs mt-0.5">geçen süre</p>
                </div>
              </div>

              {/* Otomatik kontrol sayacı */}
              <div className="space-y-2">
                <div className="h-1 bg-white/10 rounded-full overflow-hidden w-48 mx-auto">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                    style={{
                      width: '100%',
                      animation: `shrink ${POLL_INTERVAL_MS / 1000}s linear infinite`,
                    }}
                  />
                </div>
                {lastChecked && (
                  <p className="text-white/20 text-xs">
                    Son kontrol: {lastChecked.toLocaleTimeString('tr-TR')} · #{pollCount}. sorgu
                  </p>
                )}
              </div>

              {/* Manuel yenile butonu */}
              <button
                onClick={() => checkStatus(false)}
                disabled={checking}
                className="flex items-center gap-2 mx-auto px-6 py-3 btn-neon rounded-2xl font-semibold text-sm disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
                {checking ? 'Kontrol ediliyor…' : 'Şimdi Kontrol Et'}
              </button>

              <p className="text-white/20 text-xs">
                Her {POLL_INTERVAL_MS / 1000} saniyede bir otomatik güncelleniyor
              </p>
            </div>
          )}
        </div>

        {/* ─── Bilgi paneli (sağ / alt) ─── */}
        <div className="lg:w-80 glass border-l border-white/10 p-8 flex flex-col gap-6 justify-center">

          {/* Durum rozeti */}
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium w-fit ${
            imageReady
              ? 'bg-green-500/10 border-green-500/25 text-green-400'
              : isError
              ? 'bg-red-500/10 border-red-500/25 text-red-400'
              : isRejected
              ? 'bg-orange-500/10 border-orange-500/25 text-orange-400'
              : isPending
              ? 'bg-blue-500/10 border-blue-500/25 text-blue-300'
              : 'bg-yellow-500/10 border-yellow-500/25 text-yellow-400'
          }`}>
            {imageReady
              ? <><CheckCircle className="w-3.5 h-3.5" /> Görsel Hazır</>
              : isError
              ? <><AlertTriangle className="w-3.5 h-3.5" /> Hata</>
              : isRejected
              ? <><AlertTriangle className="w-3.5 h-3.5" /> Reddedildi</>
              : isPending
              ? <><Clock className="w-3.5 h-3.5" /> Admin Onayı Bekleniyor</>
              : <><Clock className="w-3.5 h-3.5" /> Üretiliyor…</>
            }
          </div>

          {/* Kelimeler */}
          <div>
            <p className="text-xs text-white/40 uppercase tracking-widest mb-3">Senin 3 Kelimelerin</p>
            <div className="flex flex-wrap gap-2">
              {[w1, w2, w3].map((w, i) => (
                <span key={i} className={`px-4 py-2 rounded-full text-base font-bold border ${
                  i === 0 ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                  : i === 1 ? 'bg-purple-500/15 border-purple-500/40 text-purple-300'
                  : 'bg-orange-500/15 border-orange-500/40 text-orange-300'
                }`}>{w}</span>
              ))}
            </div>
          </div>

          {/* Seçilen stil */}
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <p className="text-xs text-white/40 mb-1">Seçilen Stil</p>
            <p className="text-lg font-bold text-white">{style || fullData?.templateNameTr}</p>
            <p className="text-xs text-white/40 mt-0.5">{category || fullData?.templateCategory}</p>
          </div>

          {/* Oluşturan */}
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <p className="text-xs text-white/40 mb-1">Oluşturan</p>
            <p className={`text-lg font-bold ${creatorName ? 'text-white' : 'text-white/25 italic'}`}>
              {creatorName || 'İsimsiz'}
            </p>
          </div>

          {/* Prompt */}
          {fullData?.prompt && (
            <div className="bg-black/40 rounded-2xl p-4 border border-cyan-500/20">
              <p className="text-xs text-white/30 mb-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" /> Kullanılan AI Prompt
              </p>
              <p className="font-mono text-xs text-cyan-300/80 leading-relaxed">
                {fullData.prompt}
              </p>
            </div>
          )}

          {/* QR Kod — sadece görsel hazır olunca göster */}
          {imageReady && qrUrl && (
            <div className="flex flex-col items-center gap-3">
              <p className="text-xs text-white/40 uppercase tracking-widest">QR ile Paylaş</p>
              <img src={qrUrl} alt="QR Kod" className="w-36 h-36 rounded-2xl" />
              <p className="text-white/20 text-xs text-center">Telefon kameranla okut</p>
            </div>
          )}

          {/* Yeni üret */}
          <button
            onClick={handleNewArt}
            className="w-full py-4 btn-neon rounded-2xl font-bold text-base flex items-center justify-center gap-2 mt-auto"
          >
            <Sparkles className="w-5 h-5" /> Yeni Şaheser Yarat
          </button>
        </div>
      </div>

      {/* Inline keyframe for progress bar shrink animation */}
      <style>{`
        @keyframes shrink {
          from { transform: scaleX(1); transform-origin: left; }
          to   { transform: scaleX(0); transform-origin: left; }
        }
      `}</style>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-4 border-cyan-400/30 border-t-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-white/50">Yükleniyor…</p>
        </div>
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
}