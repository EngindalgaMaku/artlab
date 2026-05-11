'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import {
  CheckCircle, XCircle, Clock, RefreshCw, Shield, Eye,
  Lock, Monitor, Copy, Upload, ImagePlus, Check, AlertCircle, Trash2, Loader2, Settings,
} from 'lucide-react';

interface PendingItem {
  id: string;
  words: [string, string, string];
  templateNameTr: string;
  templateCategory: string;
  prompt: string;
  imageBase64: string;
  imagePath?: string;
  errorMessage?: string;
  createdAt: number;
  status: 'generating' | 'pending' | 'approved' | 'rejected' | 'error';
}

// ─── Giriş Ekranı ───
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/admin-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      sessionStorage.setItem('admin_auth', '1');
      onLogin();
    } else {
      setError('Hatalı şifre. Tekrar deneyin.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <div className="glass rounded-3xl p-10 border border-white/10 w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7 text-orange-400" />
          </div>
          <h1 className="text-xl font-bold">Moderatör Girişi</h1>
          <p className="text-white/40 text-sm">AI ArtLab – TÜBİTAK 4006</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Şifre"
            autoFocus
            className="w-full bg-white/5 border border-white/20 rounded-2xl px-5 py-3 text-white placeholder:text-white/25 focus:outline-none focus:border-cyan-400/60 transition-colors"
          />
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3 btn-neon rounded-2xl font-bold disabled:opacity-50"
          >
            {loading ? 'Kontrol ediliyor…' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Prompt Kopyala Butonu ───
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
        copied
          ? 'bg-green-500/20 border-green-500/30 text-green-400'
          : 'bg-cyan-500/10 border-cyan-500/25 text-cyan-400 hover:bg-cyan-500/20'
      }`}
    >
      {copied ? <><Check className="w-3.5 h-3.5" /> Kopyalandı!</> : <><Copy className="w-3.5 h-3.5" /> Promptu Kopyala</>}
    </button>
  );
}

// ─── Görsel Yükleme Kartı ───
function UploadCard({ item, onUploaded }: { item: PendingItem; onUploaded: () => void }) {
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Lütfen bir görsel dosyası seçin.');
      return;
    }
    // Önizleme
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    setError('');
    const form = new FormData();
    form.append('id', item.id);
    form.append('image', file);

    const res = await fetch('/api/upload-image', { method: 'POST', body: form });
    if (res.ok) {
      setSuccess(true);
      setTimeout(() => onUploaded(), 1000);
    } else {
      const data = await res.json();
      setError(data.error || 'Yükleme başarısız');
    }
    setUploading(false);
  };

  return (
    <div className={`glass rounded-2xl border p-5 space-y-4 transition-all ${
      success ? 'border-green-500/30' : 'border-white/10'
    }`}>
      {/* Başlık */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-2 mb-2">
            {item.words.map((w, i) => (
              <span key={i} className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                i === 0 ? 'bg-cyan-500/10 border-cyan-500/25 text-cyan-300'
                : i === 1 ? 'bg-purple-500/10 border-purple-500/25 text-purple-300'
                : 'bg-orange-500/10 border-orange-500/25 text-orange-300'
              }`}>{w}</span>
            ))}
          </div>
          <p className="text-white/60 text-xs">{item.templateNameTr} · {new Date(item.createdAt).toLocaleTimeString('tr-TR')}</p>
        </div>
        {success && (
          <span className="flex items-center gap-1 text-green-400 text-xs font-medium">
            <CheckCircle className="w-4 h-4" /> Yüklendi
          </span>
        )}
      </div>

      {/* Prompt kutusu + kopyala */}
      <div className="bg-black/40 rounded-xl p-3 border border-cyan-500/15">
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="text-white/30 text-xs uppercase tracking-widest">AI Prompt</p>
          <CopyButton text={item.prompt} />
        </div>
        <p className="font-mono text-xs text-cyan-300/80 leading-relaxed">{item.prompt}</p>
      </div>

      {/* Görsel yükleme alanı */}
      {!success && (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (file) handleFile(file);
            }}
            className="border-2 border-dashed border-white/15 hover:border-cyan-500/40 rounded-2xl p-6 text-center cursor-pointer transition-all group"
          >
            {preview ? (
              <img src={preview} alt="Önizleme" className="max-h-40 mx-auto rounded-xl object-contain" />
            ) : (
              <div className="space-y-2">
                <ImagePlus className="w-8 h-8 text-white/20 group-hover:text-cyan-400/60 mx-auto transition-colors" />
                <p className="text-white/40 text-sm">Görseli buraya sürükle veya tıkla</p>
                <p className="text-white/20 text-xs">PNG, JPG, WEBP · maks. 10MB</p>
              </div>
            )}
          </div>

          {preview && (
            <button
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="w-full py-3 rounded-2xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-400 font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 text-sm"
            >
              {uploading
                ? <><RefreshCw className="w-4 h-4 animate-spin" /> Yükleniyor…</>
                : <><Upload className="w-4 h-4" /> Yükle & Kaydet</>
              }
            </button>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 rounded-xl px-3 py-2 border border-red-500/20">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {error}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Ayarlar Sekmesi ───
interface ScaleModel { model: string; name: string; description: string; type: string; }
interface AppSettings { backend: 'vertex' | 'scale'; scaleModel: string; }

/** Gerçek test ölçümleri + tahminler */
const MODEL_SPEED_INFO: Record<string, { speed: string; quality: string; recommended?: boolean; badge: string }> = {
  'nano-banana':               { speed: '~11 sn', quality: 'İyi',      recommended: true, badge: 'bg-green-500/20 border-green-500/40 text-green-300' },
  'nano-banana-pro-flash':     { speed: '~25 sn', quality: 'Yüksek',                      badge: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300' },
  'nano-banana-pro':           { speed: '~51 sn', quality: 'Yüksek',                      badge: 'bg-yellow-500/15 border-yellow-500/30 text-yellow-300' },
  'seedream-seedream-v5-lite': { speed: '~15 sn', quality: 'İyi',                         badge: 'bg-green-500/15 border-green-500/30 text-green-300' },
  'seedream-seedream-v4':      { speed: '~25 sn', quality: 'İyi',                         badge: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300' },
  'flux-2-flex':               { speed: '~15 sn', quality: 'İyi',                         badge: 'bg-green-500/15 border-green-500/30 text-green-300' },
  'flux-2':                    { speed: '~20 sn', quality: 'İyi',                         badge: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300' },
  'flux-2-pro':                { speed: '~40 sn', quality: 'Yüksek',                      badge: 'bg-yellow-500/15 border-yellow-500/30 text-yellow-300' },
  'flux-kontext-max':          { speed: '~45 sn', quality: 'Yüksek',                      badge: 'bg-yellow-500/15 border-yellow-500/30 text-yellow-300' },
  'gpt-image-1-5':             { speed: '~15 sn', quality: 'İyi',                         badge: 'bg-green-500/15 border-green-500/30 text-green-300' },
  'gpt-image-2':               { speed: '~20 sn', quality: 'İyi',                         badge: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300' },
  'ideogram-3':                { speed: '~30 sn', quality: 'Yüksek',                      badge: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300' },
  'imagen-4-fast':             { speed: '~20 sn', quality: 'İyi',                         badge: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300' },
  'imagen-4':                  { speed: '~35 sn', quality: 'Yüksek',                      badge: 'bg-yellow-500/15 border-yellow-500/30 text-yellow-300' },
  'imagen-4-ultra':            { speed: '~60 sn', quality: 'Mükemmel',                    badge: 'bg-orange-500/15 border-orange-500/30 text-orange-300' },
};

function SettingsTab() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [models, setModels] = useState<ScaleModel[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/admin-settings')
      .then((r) => r.json())
      .then((d) => { setSettings(d.settings); setModels(d.models ?? []); })
      .catch(() => {});
  }, []);

  const save = async (patch: Partial<AppSettings>) => {
    if (!settings) return;
    setSaving(true);
    const next = { ...settings, ...patch };
    setSettings(next);
    const res = await fetch('/api/admin-settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
    setSaving(false);
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2000); }
  };

  if (!settings) {
    return (
      <div className="glass rounded-2xl p-12 text-center border border-white/10">
        <Loader2 className="w-8 h-8 animate-spin text-white/30 mx-auto" />
      </div>
    );
  }

  const imageModels = models.filter((m) => m.type === 'text-to-image');
  const activeModelInfo = MODEL_SPEED_INFO[settings.scaleModel];

  return (
    <div className="space-y-6 max-w-2xl">

      {/* ─── Aktif Durum Kartı ─── */}
      <div className={`glass rounded-2xl border p-5 flex items-center gap-4 ${
        settings.backend === 'scale' ? 'border-green-500/25 bg-green-500/5' : 'border-cyan-500/25 bg-cyan-500/5'
      }`}>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0 ${
          settings.backend === 'scale' ? 'bg-green-500/15' : 'bg-cyan-500/15'
        }`}>
          {settings.backend === 'scale' ? '🌐' : '⚡'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold">
            {settings.backend === 'scale'
              ? `Scale — ${imageModels.find(m => m.model === settings.scaleModel)?.name ?? settings.scaleModel}`
              : 'Vertex — gemini-2.5-flash-image'}
          </p>
          <p className="text-white/40 text-xs mt-0.5">
            {settings.backend === 'scale' && activeModelInfo
              ? `⏱ ${activeModelInfo.speed} · Kalite: ${activeModelInfo.quality} · Boyut: 832–848x1264`
              : '⏱ ~13 sn · Kalite: İyi · Boyut: 1024x1792 HD'}
          </p>
        </div>
        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
          settings.backend === 'scale' ? 'bg-green-500/20 border-green-500/40 text-green-300' : 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
        }`}>Aktif</span>
      </div>

      {/* ─── Backend Seçimi ─── */}
      <div className="glass rounded-2xl border border-white/10 p-6 space-y-4">
        <div>
          <h2 className="text-base font-bold text-white mb-1">Görsel Üretim Motoru</h2>
          <p className="text-white/40 text-xs">Hangi API ile görsel üretileceğini seçin. Anında kaydedilir.</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Scale — Önerilen */}
          <button
            onClick={() => save({ backend: 'scale' })}
            className={`relative text-left p-4 rounded-2xl border transition-all ${
              settings.backend === 'scale'
                ? 'bg-green-500/15 border-green-500/40'
                : 'glass border-white/10 hover:border-white/25'
            }`}
          >
            {settings.backend === 'scale' && (
              <span className="absolute -top-2 left-3 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full font-bold">Aktif</span>
            )}
            <p className="text-2xl mb-2">🌐</p>
            <p className="font-bold text-white text-sm">Scale API</p>
            <p className="text-white/50 text-xs mt-1 leading-relaxed">
              15 farklı model · Nano Banana dahil · <span className="text-green-400">Önerilen</span>
            </p>
            <p className="text-white/30 text-xs mt-1">En hızlı: ~11 sn (nano-banana)</p>
          </button>

          {/* Vertex — Yedek */}
          <button
            onClick={() => save({ backend: 'vertex' })}
            className={`relative text-left p-4 rounded-2xl border transition-all ${
              settings.backend === 'vertex'
                ? 'bg-cyan-500/15 border-cyan-500/40'
                : 'glass border-white/10 hover:border-white/25'
            }`}
          >
            {settings.backend === 'vertex' && (
              <span className="absolute -top-2 left-3 text-xs bg-cyan-500 text-white px-2 py-0.5 rounded-full font-bold">Aktif</span>
            )}
            <p className="text-2xl mb-2">⚡</p>
            <p className="font-bold text-white text-sm">Vertex API</p>
            <p className="text-white/50 text-xs mt-1 leading-relaxed">
              Gemini 2.5 Flash Image · Senkron · Yedek
            </p>
            <p className="text-white/30 text-xs mt-1">~13 sn · 1024×1792 HD</p>
          </button>
        </div>
      </div>

      {/* ─── Scale Model Seçimi ─── */}
      {settings.backend === 'scale' && (
        <div className="glass rounded-2xl border border-white/10 p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white mb-1">Scale Modeli Seç</h3>
            <p className="text-white/40 text-xs">
              🟢 Yeşil = Hızlı (&lt;20 sn) &nbsp;·&nbsp; 🟡 Sarı = Orta (20–50 sn) &nbsp;·&nbsp; 🟠 Turuncu = Yavaş (&gt;50 sn)
            </p>
          </div>

          {imageModels.length === 0 ? (
            <div className="text-center py-6">
              <Loader2 className="w-6 h-6 animate-spin text-white/30 mx-auto mb-2" />
              <p className="text-white/30 text-sm">Model listesi yükleniyor…</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {imageModels.map((m) => {
                const info = MODEL_SPEED_INFO[m.model];
                const isSelected = settings.scaleModel === m.model;
                return (
                  <button
                    key={m.model}
                    onClick={() => save({ scaleModel: m.model })}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-purple-500/20 border-purple-500/40'
                        : 'glass border-white/10 hover:border-white/25'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`font-bold text-sm ${isSelected ? 'text-purple-200' : 'text-white/80'}`}>
                          {m.name}
                        </span>
                        {info?.recommended && (
                          <span className="flex-shrink-0 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full font-bold">
                            ÖNERİLEN
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {info && (
                          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${info.badge}`}>
                            {info.speed}
                          </span>
                        )}
                        {isSelected && <Check className="w-4 h-4 text-purple-400" />}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <p className={`text-xs opacity-50 truncate flex-1 ${isSelected ? 'text-purple-200' : 'text-white'}`}>
                        {m.description || m.model}
                      </p>
                      {info && (
                        <p className="text-xs text-white/25 flex-shrink-0">Kalite: {info.quality}</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── Kaydet göstergesi ─── */}
      <div className="flex items-center gap-3">
        {saving && <><Loader2 className="w-4 h-4 animate-spin text-white/40" /><span className="text-white/40 text-sm">Kaydediliyor…</span></>}
        {saved && <span className="text-green-400 text-sm flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Kaydedildi</span>}
        {!saving && !saved && <p className="text-white/25 text-xs">Seçim anında sunucuya kaydedilir</p>}
      </div>
    </div>
  );
}

// ─── Ana Admin Sayfası ───
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [items, setItems] = useState<PendingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<PendingItem | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [tab, setTab] = useState<'queue' | 'upload' | 'settings'>('upload');

  const fetchQueue = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/pending');
    const data = await res.json();
    setItems(data.items || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem('admin_auth') === '1') setAuthed(true);
  }, []);

  useEffect(() => {
    if (!authed) return;
    fetchQueue();
    const interval = setInterval(fetchQueue, 5000);
    return () => clearInterval(interval);
  }, [authed, fetchQueue]);

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    setActionLoading(id);
    await fetch('/api/pending', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action }),
    });
    await fetchQueue();
    setActionLoading(null);
    if (preview?.id === id) setPreview(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu eseri kalıcı olarak silmek istediğine emin misin?')) return;
    setActionLoading(id);
    await fetch('/api/pending', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    await fetchQueue();
    setActionLoading(null);
    if (preview?.id === id) setPreview(null);
  };

  const generating = items.filter((i) => i.status === 'generating');
  const errored    = items.filter((i) => i.status === 'error');
  const pending    = items.filter((i) => i.status === 'pending');
  const approved   = items.filter((i) => i.status === 'approved');
  const rejected   = items.filter((i) => i.status === 'rejected');
  // Görsel bekleyen: pending veya error olup henüz görseli olmayan kalemler
  const waitingUpload = items.filter(
    (i) => (i.status === 'pending' || i.status === 'error' || i.status === 'generating') && !i.imageBase64 && !i.imagePath,
  );

  const StatusBadge = ({ status }: { status: PendingItem['status'] }) => {
    const map: Record<PendingItem['status'], string> = {
      generating: 'bg-blue-500/15 border-blue-500/30 text-blue-400',
      pending:    'bg-yellow-500/15 border-yellow-500/30 text-yellow-400',
      approved:   'bg-green-500/15 border-green-500/30 text-green-400',
      rejected:   'bg-red-500/15 border-red-500/30 text-red-400',
      error:      'bg-red-700/15 border-red-700/30 text-red-300',
    };
    const labels: Record<PendingItem['status'], string> = {
      generating: 'Üretiliyor',
      pending:    'Bekliyor',
      approved:   'Onaylandı',
      rejected:   'Reddedildi',
      error:      'Hata',
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs border font-medium ${map[status]}`}>
        {labels[status]}
      </span>
    );
  };

  /** Returns the best img src for an item */
  function itemImgSrc(item: PendingItem): string {
    if (item.imagePath) return item.imagePath;
    if (item.imageBase64) return `data:image/png;base64,${item.imageBase64}`;
    return '';
  }

  return (
    <div className="min-h-screen text-white p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
              <Shield className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Moderatör Paneli</h1>
              <p className="text-white/40 text-sm">AI ArtLab – TÜBİTAK 4006</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/display"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-cyan-500/15 border border-cyan-500/30 rounded-xl text-cyan-400 hover:bg-cyan-500/25 transition-all text-sm font-medium"
            >
              <Monitor className="w-4 h-4" /> Büyük Ekran
            </a>
            <button
              onClick={fetchQueue}
              className="flex items-center gap-2 px-4 py-2 glass rounded-xl text-white/60 hover:text-white transition-all text-sm"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Yenile
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-6 gap-4 mb-8">
          {[
            { label: 'API Üretiyor', count: generating.length, color: 'text-blue-400', bg: 'border-blue-500/20' },
            { label: 'API Hatası', count: errored.length, color: 'text-red-300', bg: 'border-red-700/20' },
            { label: 'Görsel Bekliyor', count: waitingUpload.length, color: 'text-orange-400', bg: 'border-orange-500/20' },
            { label: 'Onay Bekliyor', count: pending.filter(i => !!(i.imageBase64 || i.imagePath)).length, color: 'text-yellow-400', bg: 'border-yellow-500/20' },
            { label: 'Onaylanan', count: approved.length, color: 'text-green-400', bg: 'border-green-500/20' },
            { label: 'Reddedilen', count: rejected.length, color: 'text-red-400', bg: 'border-red-500/20' },
          ].map((s) => (
            <div key={s.label} className={`glass rounded-2xl p-4 border ${s.bg} text-center`}>
              <p className={`text-3xl font-black ${s.color}`}>{s.count}</p>
              <p className="text-white/40 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Sekmeler */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setTab('upload')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
              tab === 'upload'
                ? 'bg-orange-500/20 border-orange-500/40 text-orange-300'
                : 'glass border-white/10 text-white/50 hover:text-white'
            }`}
          >
            <Upload className="w-4 h-4" />
            Manuel Yükleme
            {waitingUpload.length > 0 && (
              <span className="bg-orange-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center">
                {waitingUpload.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab('queue')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
              tab === 'queue'
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                : 'glass border-white/10 text-white/50 hover:text-white'
            }`}
          >
            <Eye className="w-4 h-4" />
            Onay Kuyruğu
            {pending.filter(i => !!(i.imageBase64 || i.imagePath)).length > 0 && (
              <span className="bg-cyan-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center">
                {pending.filter(i => !!(i.imageBase64 || i.imagePath)).length}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab('settings')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all border ml-auto ${
              tab === 'settings'
                ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                : 'glass border-white/10 text-white/50 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            API Ayarları
          </button>
        </div>

        {/* ─── MANUEL YÜKLEME SEKMESİ ─── */}
        {tab === 'upload' && (
          <div>
            {waitingUpload.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center border border-white/10">
                <CheckCircle className="w-12 h-12 text-green-400/40 mx-auto mb-3" />
                <p className="text-white/40 text-lg font-medium">Bekleyen görsel yok</p>
                <p className="text-white/25 text-sm mt-1">Yeni kullanıcı girişleri burada görünecek</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-white/40 text-sm mb-2">
                  Aşağıdaki promptları kopyalayıp Nano Banana'da üretin, ardından görseli yükleyin.
                </p>
                {waitingUpload.map((item) => (
                  <UploadCard key={item.id} item={item} onUploaded={fetchQueue} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── AYARLAR SEKMESİ ─── */}
        {tab === 'settings' && <SettingsTab />}

        {/* ─── ONAY KUYRUĞU SEKMESİ ─── */}
        {tab === 'queue' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Liste */}
            <div>
              <h2 className="text-lg font-semibold text-white/70 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-400" />
                Görseli Olan Gönderiler ({items.filter(i => !!(i.imageBase64 || i.imagePath)).length})
              </h2>
              <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
                {items.filter(i => !!(i.imageBase64 || i.imagePath)).length === 0 && (
                  <div className="glass rounded-2xl p-8 text-center text-white/30">
                    <p className="text-white/25 text-sm">Henüz görsel yüklenmiş gönderi yok</p>
                  </div>
                )}
                {items.filter(i => !!(i.imageBase64 || i.imagePath)).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setPreview(item)}
                    className={`glass rounded-2xl p-4 border cursor-pointer transition-all hover:border-white/20 ${
                      preview?.id === item.id ? 'border-cyan-500/40' : 'border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-white/5 flex items-center justify-center">
                        {itemImgSrc(item) ? (
                          <img
                            src={itemImgSrc(item)}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : item.status === 'generating' ? (
                          <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                        ) : item.status === 'error' ? (
                          <AlertCircle className="w-6 h-6 text-red-400" />
                        ) : (
                          <ImagePlus className="w-6 h-6 text-white/20" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <StatusBadge status={item.status} />
                          <span className="text-xs text-white/30">
                            {new Date(item.createdAt).toLocaleTimeString('tr-TR')}
                          </span>
                        </div>
                        <p className="font-semibold text-white text-sm truncate">
                          {item.words.join(' · ')}
                        </p>
                        <p className="text-white/40 text-xs">{item.templateNameTr}</p>
                      </div>
                      <Eye className="w-4 h-4 text-white/20 flex-shrink-0" />
                    </div>
                    <div className="flex gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
                      {item.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleAction(item.id, 'approve')}
                            disabled={actionLoading === item.id}
                            className="flex-1 py-2 rounded-xl bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-400 text-sm font-semibold flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                          >
                            <CheckCircle className="w-4 h-4" /> Onayla
                          </button>
                          <button
                            onClick={() => handleAction(item.id, 'reject')}
                            disabled={actionLoading === item.id}
                            className="flex-1 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 text-sm font-semibold flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                          >
                            <XCircle className="w-4 h-4" /> Reddet
                          </button>
                        </>
                      )}
                      {item.status === 'approved' && (
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={actionLoading === item.id}
                          className="flex-1 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400/70 hover:text-red-400 text-sm font-semibold flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" /> Kalıcı Sil
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Büyük önizleme */}
            <div className="lg:sticky lg:top-6 lg:self-start">
              <h2 className="text-lg font-semibold text-white/70 mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-cyan-400" /> Ön İzleme
              </h2>
              {preview ? (
                <div className="glass rounded-3xl overflow-hidden border border-white/10 neon-border">
                  {itemImgSrc(preview) ? (
                    <img
                      src={itemImgSrc(preview)}
                      alt="Ön İzleme"
                      className="w-full object-cover max-h-[50vh]"
                    />
                  ) : (
                    <div className="w-full h-40 flex items-center justify-center bg-white/5">
                      {preview.status === 'generating'
                        ? <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
                        : preview.status === 'error'
                        ? <div className="text-center"><AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-2" /><p className="text-red-300/60 text-xs max-w-xs px-4">{preview.errorMessage}</p></div>
                        : <ImagePlus className="w-10 h-10 text-white/20" />
                      }
                    </div>
                  )}
                  <div className="p-5 space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {preview.words.map((w, i) => (
                        <span key={i} className="px-3 py-1 rounded-full text-sm font-bold bg-white/10 border border-white/15 text-white">{w}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-white">{preview.templateNameTr}</p>
                        <p className="text-white/40 text-xs">{preview.templateCategory}</p>
                      </div>
                      <StatusBadge status={preview.status} />
                    </div>
                    <div className="bg-black/40 rounded-xl p-3 border border-cyan-500/20">
                      <p className="font-mono text-xs text-cyan-300/80 leading-relaxed">{preview.prompt}</p>
                    </div>
                    {preview.status === 'pending' && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleAction(preview.id, 'approve')}
                          disabled={actionLoading === preview.id}
                          className="flex-1 py-3 rounded-2xl bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-400 font-bold flex items-center justify-center gap-2 transition-all text-sm disabled:opacity-50"
                        >
                          <CheckCircle className="w-5 h-5" /> Büyük Ekrana Gönder
                        </button>
                        <button
                          onClick={() => handleAction(preview.id, 'reject')}
                          disabled={actionLoading === preview.id}
                          className="px-4 py-3 rounded-2xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 font-bold flex items-center justify-center transition-all text-sm disabled:opacity-50"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                    {preview.status === 'approved' && (
                      <button
                        onClick={() => handleDelete(preview.id)}
                        disabled={actionLoading === preview.id}
                        className="w-full py-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400/70 hover:text-red-400 font-bold flex items-center justify-center gap-2 transition-all text-sm disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" /> Kalıcı Sil
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="glass rounded-3xl p-12 text-center border border-white/10">
                  <p className="text-white/40">Ön izlemek için sol listeden bir görsele tıkla</p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}