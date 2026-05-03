'use client';
import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Download, Sparkles, RefreshCw, Clock, CheckCircle } from 'lucide-react';
import QRCode from 'qrcode';
import { addWatermark } from '@/lib/addWatermark';

interface ResultData {
  id: string;
  imageBase64: string | null;
  imageReady: boolean;
  templateNameTr: string;
  templateCategory: string;
  prompt: string;
  status?: string;
}

function ResultContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [data, setData] = useState<ResultData | null>(null);
  const [qrUrl, setQrUrl] = useState('');
  const [imgSrc, setImgSrc] = useState('');
  const [checking, setChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const id = params.get('id') ?? '';
  const style = params.get('style') ?? '';
  const category = params.get('category') ?? '';
  const w1 = params.get('w1') ?? '';
  const w2 = params.get('w2') ?? '';
  const w3 = params.get('w3') ?? '';
  const creatorName = params.get('name') ?? '';

  // Sunucudan güncel durumu çek
  const checkStatus = useCallback(async (silent = false) => {
    if (!id) return;
    if (!silent) setChecking(true);
    try {
      const res = await fetch(`/api/submission/${id}`);
      if (res.ok) {
        const fresh = await res.json() as ResultData;
        setData(fresh);
        if (fresh.imageReady && fresh.imageBase64) {
          const watermarked = await addWatermark(
            fresh.imageBase64,
            creatorName,
            'AI ArtLab'
          );
          setImgSrc(watermarked);
        }
        setLastChecked(new Date());
      }
    } finally {
      if (!silent) setChecking(false);
    }
  }, [id]);

  // İlk yükleme: önce session storage, sonra sunucu
  useEffect(() => {
    if (!id) return;
    // Önce session storage'dan prompt/stil bilgilerini al (görsel hariç)
    const raw = sessionStorage.getItem(`result_${id}`);
    if (raw) {
      try {
        const parsed: ResultData = JSON.parse(raw);
        setData({ ...parsed, imageBase64: null, imageReady: false });
      } catch {}
    }
    // Sunucudan taze veri çek (görsel dahil — watermark ile)
    checkStatus(true);

    const qrText = `AI ArtLab – TÜBİTAK 4006\nKelimeler: ${w1} · ${w2} · ${w3}\nStil: ${style}`;
    QRCode.toDataURL(qrText, {
      width: 200,
      margin: 2,
      color: { dark: '#00f0ff', light: '#0a0a2e' },
    }).then(setQrUrl);
  }, [id]);

  const handleDownload = () => {
    if (!imgSrc) return;
    const a = document.createElement('a');
    a.href = imgSrc;
    a.download = `aiartlab-${w1}-${w2}-${w3}.png`;
    a.click();
  };

  const handleNewArt = () => {
    sessionStorage.removeItem(`result_${id}`);
    router.push('/');
  };

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-4 border-cyan-400/30 border-t-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-white/50">Yükleniyor…</p>
        </div>
      </div>
    );
  }

  const imageReady = data.imageReady && !!imgSrc;

  return (
    <div className="min-h-screen text-white flex flex-col">
      {/* Top bar */}
      <div className="glass border-b border-white/10 px-6 py-3 flex items-center justify-between">
        <button onClick={handleNewArt} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
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
          ) : (
            /* Görsel henüz hazır değil */
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
                <h2 className="text-2xl font-bold text-white mb-2">Görseliniz Hazırlanıyor</h2>
                <p className="text-white/40 text-sm leading-relaxed">
                  Promptunuz admin ekibine iletildi.
                  <br />
                  Görsel yüklendikten sonra burada görünecek.
                </p>
              </div>

              {/* Son kontrol zamanı */}
              {lastChecked && (
                <p className="text-white/20 text-xs">
                  Son kontrol: {lastChecked.toLocaleTimeString('tr-TR')}
                </p>
              )}

              {/* Yenile butonu */}
              <button
                onClick={() => checkStatus(false)}
                disabled={checking}
                className="flex items-center gap-2 mx-auto px-6 py-3 btn-neon rounded-2xl font-semibold text-sm disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
                {checking ? 'Kontrol ediliyor…' : 'Yenile & Kontrol Et'}
              </button>

              <p className="text-white/20 text-xs">
                Görsel hazır olduğunda yenile butonuna bas
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
              : 'bg-yellow-500/10 border-yellow-500/25 text-yellow-400'
          }`}>
            {imageReady
              ? <><CheckCircle className="w-3.5 h-3.5" /> Görsel Hazır</>
              : <><Clock className="w-3.5 h-3.5" /> Hazırlanıyor…</>
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
            <p className="text-lg font-bold text-white">{style || data.templateNameTr}</p>
            <p className="text-xs text-white/40 mt-0.5">{category || data.templateCategory}</p>
          </div>

          {/* Oluşturan */}
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <p className="text-xs text-white/40 mb-1">Oluşturan</p>
            <p className={`text-lg font-bold ${creatorName ? 'text-white' : 'text-white/25 italic'}`}>
              {creatorName || 'İsimsiz'}
            </p>
          </div>

          {/* Prompt */}
          <div className="bg-black/40 rounded-2xl p-4 border border-cyan-500/20">
            <p className="text-xs text-white/30 mb-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" /> Kullanılan AI Prompt
            </p>
            <p className="font-mono text-xs text-cyan-300/80 leading-relaxed">
              {data.prompt}
            </p>
          </div>

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