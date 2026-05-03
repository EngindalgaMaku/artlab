'use client';
import { useEffect, useState, useCallback } from 'react';
import { BarChart3, RefreshCw, TrendingUp, Users, Palette, CheckCircle } from 'lucide-react';

interface Item {
  id: string;
  words: [string, string, string];
  templateNameTr: string;
  templateCategory: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: number;
}

export default function StatsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/pending');
    const data = await res.json();
    setItems(data.items ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const total = items.length;
  const approved = items.filter((i) => i.status === 'approved').length;
  const pending = items.filter((i) => i.status === 'pending').length;
  const rejected = items.filter((i) => i.status === 'rejected').length;

  // En çok kullanılan stiller
  const styleCounts = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.templateNameTr] = (acc[item.templateNameTr] ?? 0) + 1;
    return acc;
  }, {});
  const topStyles = Object.entries(styleCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  // En çok kullanılan kelimeler
  const wordCounts = items.reduce<Record<string, number>>((acc, item) => {
    item.words.forEach((w) => {
      const word = w.toLowerCase().trim();
      if (word) acc[word] = (acc[word] ?? 0) + 1;
    });
    return acc;
  }, {});
  const topWords = Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);

  // Son 10 gönderi
  const recent = [...items].sort((a, b) => b.createdAt - a.createdAt).slice(0, 10);

  const maxStyleCount = topStyles[0]?.[1] ?? 1;

  return (
    <div className="min-h-screen text-white">
      {/* Header */}
      <div className="glass border-b border-white/10 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <span className="font-bold text-white">Sergi İstatistikleri</span>
            <span className="text-white/30 text-sm ml-3">TÜBİTAK 4006 · AI ArtLab</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a href="/admin" className="text-white/40 hover:text-white text-sm transition-colors">
            Admin →
          </a>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-3 py-1.5 glass rounded-xl text-white/50 hover:text-white transition-all text-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Yenile
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-8 space-y-10">

        {/* Ana istatistikler */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Toplam Üretim', value: total, icon: Users, color: 'text-white', bg: 'border-white/10' },
            { label: 'Onaylanan', value: approved, icon: CheckCircle, color: 'text-green-400', bg: 'border-green-500/20' },
            { label: 'Bekleyen', value: pending, icon: TrendingUp, color: 'text-yellow-400', bg: 'border-yellow-500/20' },
            { label: 'Reddedilen', value: rejected, icon: Palette, color: 'text-red-400', bg: 'border-red-500/20' },
          ].map((s) => (
            <div key={s.label} className={`glass rounded-2xl p-5 border ${s.bg} text-center`}>
              <s.icon className={`w-6 h-6 ${s.color} mx-auto mb-2`} />
              <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-white/40 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* En popüler stiller */}
          <div>
            <h2 className="text-lg font-semibold text-white/70 mb-5 flex items-center gap-2">
              <Palette className="w-5 h-5 text-purple-400" />
              En Çok Seçilen Stiller
            </h2>
            {topStyles.length === 0 ? (
              <p className="text-white/30 text-sm">Henüz veri yok</p>
            ) : (
              <div className="space-y-3">
                {topStyles.map(([name, count]) => (
                  <div key={name} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/80">{name}</span>
                      <span className="text-white/40">{count}x</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-purple-500/60 transition-all duration-500"
                        style={{ width: `${(count / maxStyleCount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* En çok kullanılan kelimeler */}
          <div>
            <h2 className="text-lg font-semibold text-white/70 mb-5 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              En Çok Kullanılan Kelimeler
            </h2>
            {topWords.length === 0 ? (
              <p className="text-white/30 text-sm">Henüz veri yok</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {topWords.map(([word, count], i) => {
                  const sizes = ['text-2xl', 'text-xl', 'text-lg', 'text-base', 'text-sm'];
                  const size = sizes[Math.min(i, sizes.length - 1)];
                  return (
                    <span
                      key={word}
                      className={`${size} font-bold px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300`}
                      title={`${count} kez kullanıldı`}
                    >
                      {word}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Son gönderimler */}
        <div>
          <h2 className="text-lg font-semibold text-white/70 mb-5 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-orange-400" />
            Son 10 Gönderi
          </h2>
          {recent.length === 0 ? (
            <p className="text-white/30 text-sm">Henüz gönderi yok</p>
          ) : (
            <div className="space-y-2">
              {recent.map((item) => (
                <div
                  key={item.id}
                  className="glass rounded-2xl px-5 py-3 border border-white/10 flex items-center gap-4"
                >
                  <div className="flex gap-2">
                    {item.words.map((w, i) => (
                      <span
                        key={i}
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          i === 0 ? 'bg-cyan-500/10 border-cyan-500/25 text-cyan-300'
                          : i === 1 ? 'bg-purple-500/10 border-purple-500/25 text-purple-300'
                          : 'bg-orange-500/10 border-orange-500/25 text-orange-300'
                        }`}
                      >
                        {w}
                      </span>
                    ))}
                  </div>
                  <span className="text-white/40 text-xs flex-1">{item.templateNameTr}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${
                    item.status === 'approved' ? 'bg-green-500/10 border-green-500/20 text-green-400'
                    : item.status === 'rejected' ? 'bg-red-500/10 border-red-500/20 text-red-400'
                    : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                  }`}>
                    {item.status === 'approved' ? 'Onaylı' : item.status === 'rejected' ? 'Reddedildi' : 'Bekliyor'}
                  </span>
                  <span className="text-white/25 text-xs">
                    {new Date(item.createdAt).toLocaleTimeString('tr-TR')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}