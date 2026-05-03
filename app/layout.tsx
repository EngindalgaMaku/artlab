import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI ArtLab – TÜBİTAK Bilim Fuarı 2026',
  description: 'Yapay Zekâ ile Yaratıcılık Atölyesi – TÜBİTAK 4006 Bilim Fuarı',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" style={{ background: '#0a0a2e' }}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{
          background: 'linear-gradient(135deg, #0a0a2e 0%, #1a0033 100%)',
          minHeight: '100vh',
          backgroundAttachment: 'fixed',
        }}
      >
        {children}
      </body>
    </html>
  );
}