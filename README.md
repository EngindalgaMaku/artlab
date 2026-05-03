# 🎨 AI ArtLab — TÜBİTAK 4006 Bilim Fuarı 2026

**Hüsniye Özdilek Ticaret Mesleki ve Teknik Anadolu Lisesi**

> 3 kelime yaz. Bir sanat akımı seç. Yapay zekâ sana özgü bir şaheser üretsin.

---

## Proje Hakkında

AI ArtLab, ziyaretçilerin yalnızca 3 kelime ve bir sanat stili seçerek yapay zekâ destekli özgün tablolar oluşturduğu interaktif bir kiosk deneyimidir. Proje; **prompt mühendisliği**, **üretici yapay zekâ** ve **sanat tarihi**ni bir araya getirerek STEM ile sanatın kesişimini göstermektedir.

---

## Özellikler

- **3 Kelime → 1 Şaheser** — Kullanıcı 3 kelime girer, 10 farklı sanat akımından birini seçer
- **Otomatik Görsel Üretimi** — Google Vertex AI üzerinden Nano Banana (Gemini 2.5 Flash Image) ile ~6 saniyede görsel üretilir
- **Moderatör Paneli** — Admin görsel üretimini izler, onaylar veya reddeder
- **Sanat Galerisi** — Onaylı eserler masonry ızgarasında sergilenir; oluşturanın adı görünür
- **Büyük Ekran Modu** — Fuar salonundaki ekrana slideshow olarak yansıtılır
- **Kiosk Modu** — 3 dakika hareketsizlikte otomatik sıfırlama
- **İsteğe Bağlı Kimlik** — Ziyaretçi adını yazarsa galeri kartında görünür

---

## Sanat Akımları

| Akım | Sanatçı |
|------|---------|
| İzlenimcilik | Claude Monet |
| Sürrealizm | Salvador Dalí |
| Kübizm | Pablo Picasso |
| Van Gogh Tarzı | Vincent van Gogh |
| Pop Sanat | Andy Warhol |
| Art Deco | Tamara de Lempicka |
| Barok | Caravaggio |
| Siberpunk | Dijital Sanat |
| Art Nouveau | Alphonse Mucha |
| Rönesans | Leonardo da Vinci |

---

## Teknoloji

- **Frontend & Backend** — [Next.js 14](https://nextjs.org/) (App Router)
- **Stil** — [Tailwind CSS](https://tailwindcss.com/)
- **Görsel Üretimi** — [Nano Banana / Gemini 2.5 Flash Image](https://vertex.claude.gg) via cortexai.io gateway
- **QR Kod** — `qrcode` paketi ile sonuç sayfasında anlık üretim
- **Veri Depolama** — JSON dosya tabanlı (sunucu yeniden başlatılsa da kalıcı)

---

## Kurulum

### Gereksinimler

- Node.js 18+
- npm

### Adımlar

```bash
# Repoyu klonla
git clone https://github.com/KULLANICI_ADI/ai-artlab.git
cd ai-artlab

# Bağımlılıkları kur
npm install

# Ortam değişkenlerini ayarla
cp .env.local.example .env.local
# .env.local dosyasını düzenle
```

### `.env.local` içeriği

```env
VERTEX_API_KEY=sk-...        # cortexai.io API anahtarı
ADMIN_PASSWORD=sifreniz      # Moderatör paneli şifresi
GEMINI_API_KEY=AIza...       # (opsiyonel) Doğrudan Gemini erişimi
FAL_API_KEY=...              # (opsiyonel) Fal.ai erişimi
```

### Geliştirme Sunucusu

```bash
npm run dev
# http://localhost:3000 adresinde açılır
```

### Üretim Build

```bash
npm run build
npm start
```

---

## Sayfa Yapısı

| Sayfa | Açıklama |
|-------|----------|
| `/` | Ana kiosk arayüzü — kelime girişi ve stil seçimi |
| `/result` | Üretim sonucu ve QR kod |
| `/gallery` | Tüm onaylı eserlerin ızgara galerisi |
| `/display` | Büyük ekran slideshow modu |
| `/admin` | Moderatör paneli (şifre korumalı) |
| `/stats` | İstatistik sayfası |

---

## Ekran Görüntüleri

> *(Fuar sonrası eklenecek)*

---

## Lisans

Bu proje TÜBİTAK 4006 Bilim Fuarı kapsamında eğitim amaçlı geliştirilmiştir.

---

*Hüsniye Özdilek Ticaret Mesleki ve Teknik Anadolu Lisesi — 2026*