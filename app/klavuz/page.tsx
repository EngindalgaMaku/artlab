import { Sparkles, Zap } from 'lucide-react';

export default function KlavuzPage() {
  return (
    <div className="min-h-screen text-white">
      {/* Minimal başlık */}
      <div className="glass border-b border-white/10 px-8 py-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <div>
          <span className="font-bold text-white">AI ArtLab</span>
          <span className="text-white/30 text-sm ml-3">Kullanım Kılavuzu</span>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-6 py-14 space-y-14">

        {/* Başlık */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/15 text-xs mb-5">
            <Sparkles className="w-3 h-3 text-orange-400" />
            <span className="text-white/60">Ekip İçi Rehber — TÜBİTAK 4006 • 2026</span>
          </div>
          <h1 className="text-4xl font-black neon-text mb-3">Kullanım Kılavuzu</h1>
          <p className="text-white/40 text-lg">
            Hüsniye Özdilek Ticaret Mesleki ve Teknik Anadolu Lisesi
          </p>
        </div>

        {/* ─── 1. GENEL BAKIŞ ─── */}
        <section className="space-y-4">
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center text-sm font-bold">1</span>
            Projeye Genel Bakış
          </h2>
          <div className="glass border border-white/10 rounded-2xl p-6 space-y-3 text-white/60 leading-relaxed">
            <p>
              <strong className="text-white">AI ArtLab</strong>, ziyaretçilerin 3 kelime ve bir sanat stili seçerek yapay zekâ ile özgün tablolar oluşturduğu interaktif bir kiosk sistemidir.
            </p>
            <p>Sistem 4 ana bileşenden oluşur:</p>
            <ul className="space-y-2 pl-4">
              <li className="flex items-start gap-2"><span className="text-cyan-400 mt-0.5">→</span><span><strong className="text-white">3 Kelime 1 Şaheser</strong> — Ziyaretçi kiosk arayüzü</span></li>
              <li className="flex items-start gap-2"><span className="text-purple-400 mt-0.5">→</span><span><strong className="text-white">Prompt Atölyesi</strong> — Daha serbest, tema/stil/atmosfer seçimli üretim</span></li>
              <li className="flex items-start gap-2"><span className="text-orange-400 mt-0.5">→</span><span><strong className="text-white">Admin Paneli</strong> — Proje ekibinin eserleri denetlediği kontrol merkezi</span></li>
              <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">→</span><span><strong className="text-white">Büyük Ekran / Galeri</strong> — Onaylı eserlerin sergilendiği ekranlar</span></li>
            </ul>
          </div>
        </section>

        {/* ─── 2. ZİYARETÇİ AKIŞI ─── */}
        <section className="space-y-4">
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-400 flex items-center justify-center text-sm font-bold">2</span>
            Ziyaretçi Akışı
          </h2>
          <div className="space-y-3">
            {[
              { n: '1', title: 'Adın Soyadın (isteğe bağlı)', desc: 'Ziyaretçi adını yazarsa eser galeride ve büyük ekranda ismiyle görünür. Boş bırakılabilir.', color: 'cyan' },
              { n: '2', title: '3 Kelime Gir', desc: 'Aklına gelen herhangi 3 kelimeyi yazar. Örn: "Ateş, Deniz, Rüzgâr". Yasak kelimeler filtresi otomatik çalışır.', color: 'purple' },
              { n: '3', title: 'Sanat Stili Seç', desc: '10 sanat akımından biri seçilir: İzlenimcilik, Sürrealizm, Kübizm, Van Gogh, Pop Sanat, Art Deco, Barok, Siberpunk, Art Nouveau, Rönesans.', color: 'orange' },
              { n: '4', title: 'Görsel Üretimi', desc: 'Yapay zekâ (Nano Banana / Gemini 2.5) arka planda ~6–15 saniyede görseli üretir. Ziyaretçi bekleme ekranı görür.', color: 'cyan' },
              { n: '5', title: 'Sonuç Sayfası', desc: '"Görseliniz Hazırlanıyor" mesajı çıkar. Admin onaylayana kadar görsel gösterilmez. Ziyaretçi "Yenile & Kontrol Et" butonuna basarak kontrol eder.', color: 'green' },
            ].map((step) => (
              <div key={step.n} className="glass border border-white/10 rounded-2xl p-5 flex gap-4">
                <span className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center text-sm font-bold
                  ${step.color === 'cyan' ? 'bg-cyan-500/15 text-cyan-400' :
                    step.color === 'purple' ? 'bg-purple-500/15 text-purple-400' :
                    step.color === 'orange' ? 'bg-orange-500/15 text-orange-400' :
                    'bg-green-500/15 text-green-400'}`}>
                  {step.n}
                </span>
                <div>
                  <p className="text-white font-semibold mb-1">{step.title}</p>
                  <p className="text-white/50 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 3. ADMİN PANELİ ─── */}
        <section className="space-y-4">
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 flex items-center justify-center text-sm font-bold">3</span>
            Admin Paneli — Detaylı Kullanım
          </h2>

          <div className="glass border border-orange-500/20 rounded-2xl p-6 space-y-5 text-white/60 leading-relaxed">
            <div>
              <p className="text-white font-semibold mb-1">Erişim</p>
              <p className="text-sm">Adres çubuğuna <code className="bg-white/10 px-2 py-0.5 rounded text-cyan-300 text-xs">/admin</code> yazarak açılır. Şifre sorulur — şifreyi sadece proje ekibi bilmeli.</p>
            </div>

            <div className="border-t border-white/10 pt-5">
              <p className="text-white font-semibold mb-3">Sekmeler</p>
              <div className="space-y-3">
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-green-400 font-semibold text-sm mb-1">🟢 Onay Kuyruğu</p>
                  <p className="text-sm">Nano Banana'nın ürettiği ve onay bekleyen eserler burada sıralanır. Her kartta görsel, 3 kelime, stil ve oluşturan ismi görünür.</p>
                  <ul className="mt-2 space-y-1 text-xs text-white/40">
                    <li>• <strong className="text-white/70">Büyük Ekrana Gönder</strong> → Eseri galeri ve büyük ekranda yayınlar</li>
                    <li>• <strong className="text-white/70">Reddet (X)</strong> → Görseli reddeder, galeride görünmez</li>
                    <li>• Bir karta tıklayınca sağda büyük önizleme açılır</li>
                  </ul>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-yellow-400 font-semibold text-sm mb-1">🟡 Görsel Bekliyor</p>
                  <p className="text-sm">Nano Banana henüz görsel üretmemiş veya başarısız olmuş eserler. Manuel görsel yüklemek için bu sekme kullanılır.</p>
                  <ul className="mt-2 space-y-1 text-xs text-white/40">
                    <li>• Dosya seç butonu ile bilgisayardan görsel yüklenebilir</li>
                    <li>• Yüklenen görsel onay kuyruğuna geçer</li>
                  </ul>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-blue-400 font-semibold text-sm mb-1">🔵 Onaylananlar</p>
                  <p className="text-sm">Galeri ve büyük ekranda yayında olan eserler. <strong className="text-red-400">Kalıcı Sil</strong> butonu ile eser hem listeden hem dosyadan kalıcı olarak silinir.</p>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-5 bg-orange-500/5 rounded-xl p-4 border border-orange-500/20">
              <p className="text-orange-400 font-semibold text-sm mb-2">⚠️ Önemli Uyarılar</p>
              <ul className="space-y-1 text-xs text-white/50">
                <li>• Uygunsuz içerik içeren eserler <strong className="text-white/70">mutlaka reddedilmeli</strong>, galeride yayınlanmamalı</li>
                <li>• "Kalıcı Sil" geri alınamaz — dikkatli kullanın</li>
                <li>• Admin şifresi kimseyle paylaşılmamalı</li>
                <li>• Fuar süresince admin paneli açık bir bilgisayarda takipte tutulmalı</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ─── 4. BÜYÜK EKRAN ─── */}
        <section className="space-y-4">
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 flex items-center justify-center text-sm font-bold">4</span>
            Büyük Ekran Kurulumu
          </h2>
          <div className="glass border border-white/10 rounded-2xl p-6 space-y-3 text-white/60 leading-relaxed text-sm">
            <p>Fuar salonundaki büyük monitör veya projeksiyon için:</p>
            <ol className="space-y-2 pl-4 list-decimal list-inside">
              <li>Büyük ekrana bağlı bilgisayarda tarayıcı açın</li>
              <li><code className="bg-white/10 px-2 py-0.5 rounded text-cyan-300 text-xs">/display</code> adresine gidin</li>
              <li>Sağ üstteki <strong className="text-white">Tam Ekran</strong> butonuna basın (ya da F11)</li>
              <li>Onaylanan eserler 8 saniyede bir otomatik değişir</li>
              <li>Yeni eser onaylandığında sayfa 5 saniye içinde otomatik güncellenir</li>
            </ol>
            <div className="bg-white/5 rounded-xl p-3 mt-2">
              <p className="text-white/40 text-xs">Sol/Sağ ok tuşlarıyla manuel geçiş yapılabilir. Noktalar tıklanarak da seçilebilir.</p>
            </div>
          </div>
        </section>

        {/* ─── 5. GALERİ ─── */}
        <section className="space-y-4">
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-pink-500/20 border border-pink-500/30 text-pink-400 flex items-center justify-center text-sm font-bold">5</span>
            Galeri Sayfası
          </h2>
          <div className="glass border border-white/10 rounded-2xl p-6 space-y-3 text-white/60 leading-relaxed text-sm">
            <p><code className="bg-white/10 px-2 py-0.5 rounded text-cyan-300 text-xs">/gallery</code> adresinde tüm onaylı eserler ızgara görünümünde listelenir.</p>
            <ul className="space-y-2 pl-4">
              <li className="flex items-start gap-2"><span className="text-pink-400">→</span><span>Üstteki stil butonlarıyla filtreleme yapılabilir</span></li>
              <li className="flex items-start gap-2"><span className="text-pink-400">→</span><span>Herhangi bir esere tıklanınca detay modalı açılır (kelimeler, stil, prompt, isim)</span></li>
              <li className="flex items-start gap-2"><span className="text-pink-400">→</span><span>Modal içinde görsele tıklayınca tam ekran büyütme açılır</span></li>
              <li className="flex items-start gap-2"><span className="text-pink-400">→</span><span>Sayfa başına 12 eser gösterilir, alt kısımda sayfalama var</span></li>
              <li className="flex items-start gap-2"><span className="text-pink-400">→</span><span>8 saniyede bir otomatik güncellenir</span></li>
            </ul>
          </div>
        </section>

        {/* ─── 6. KIOSK MODU ─── */}
        <section className="space-y-4">
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 flex items-center justify-center text-sm font-bold">6</span>
            Kiosk Modu & Otomatik Sıfırlama
          </h2>
          <div className="glass border border-white/10 rounded-2xl p-6 space-y-3 text-white/60 leading-relaxed text-sm">
            <p>Kiosk bilgisayarı (ziyaretçilerin kullandığı) için özel korumalar aktif:</p>
            <ul className="space-y-2 pl-4">
              <li className="flex items-start gap-2"><span className="text-yellow-400">→</span><span><strong className="text-white">2,5 dakika</strong> hareketsizlik sonrası geri sayım başlar (30 saniye)</span></li>
              <li className="flex items-start gap-2"><span className="text-yellow-400">→</span><span>Sayım bitince sistem başa döner, form temizlenir</span></li>
              <li className="flex items-start gap-2"><span className="text-yellow-400">→</span><span>"Devam Et" butonuyla sayım iptal edilebilir</span></li>
              <li className="flex items-start gap-2"><span className="text-yellow-400">→</span><span>Görsel üretimi sırasında kiosk sayacı duraklar</span></li>
            </ul>
          </div>
        </section>

        {/* ─── 7. SAYFA LİSTESİ ─── */}
        <section className="space-y-4">
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-white/10 border border-white/20 text-white/60 flex items-center justify-center text-sm font-bold">7</span>
            Hızlı Adres Rehberi
          </h2>
          <div className="glass border border-white/10 rounded-2xl overflow-hidden">
            {[
              { path: '/', label: '3 Kelime 1 Şaheser', desc: 'Ana kiosk arayüzü — ziyaretçi kullanır', color: 'text-cyan-400' },
              { path: '/demo', label: 'Prompt Atölyesi', desc: 'Serbest tema/stil/atmosfer seçimli üretim', color: 'text-purple-400' },
              { path: '/gallery', label: 'Galeri', desc: 'Tüm onaylı eserlerin ızgara görünümü', color: 'text-pink-400' },
              { path: '/display', label: 'Büyük Ekran', desc: 'Büyük monitöre yansıtmak için slideshow', color: 'text-green-400' },
              { path: '/admin', label: 'Admin Paneli', desc: 'Şifreli — sadece proje ekibi', color: 'text-orange-400' },
              { path: '/stats', label: 'İstatistikler', desc: 'Üretim sayıları ve stil dağılımı', color: 'text-blue-400' },
              { path: '/klavuz', label: 'Bu Sayfa', desc: 'Ekip kullanım kılavuzu', color: 'text-white/30' },
            ].map((item, i) => (
              <div key={item.path} className={`flex items-center gap-4 px-6 py-4 ${i > 0 ? 'border-t border-white/5' : ''}`}>
                <code className={`text-sm font-mono font-bold ${item.color} w-28 flex-shrink-0`}>{item.path}</code>
                <div>
                  <p className="text-white text-sm font-semibold">{item.label}</p>
                  <p className="text-white/35 text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Alt bilgi */}
        <div className="text-center pt-6 border-t border-white/10">
          <p className="text-white/20 text-sm">Hüsniye Özdilek Ticaret Mesleki ve Teknik Anadolu Lisesi · TÜBİTAK 4006 · 2026</p>
        </div>

      </main>
    </div>
  );
}