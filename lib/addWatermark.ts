/**
 * Görselin sağ alt köşesine isim etiketi ekler.
 * Canvas API ile client-side çalışır.
 *
 * `src` parametresi şunlardan biri olabilir:
 *  - raw base64 string (prefix'siz)
 *  - "data:image/...;base64,…" data URL
 *  - "/generated/<id>.png" gibi bir URL
 */
export async function addWatermark(
  src: string,
  name: string,
  label = 'AI ArtLab',
): Promise<string> {
  // Kaynağa uygun img.src değerini belirle
  let imgSrc: string;
  if (src.startsWith('data:') || src.startsWith('/') || src.startsWith('http')) {
    imgSrc = src; // already a URL or data-URL
  } else {
    imgSrc = `data:image/png;base64,${src}`; // raw base64
  }

  // İsim yoksa görseli olduğu gibi döndür
  if (!name?.trim()) return imgSrc;

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;

      // Görseli çiz
      ctx.drawImage(img, 0, 0);

      // Font ayarları
      const fontSize = Math.max(18, Math.round(img.width * 0.022));
      ctx.font = `600 ${fontSize}px Inter, system-ui, sans-serif`;

      const displayText = `${name.trim()}  ·  ${label}`;
      const textWidth = ctx.measureText(displayText).width;
      const padding = fontSize * 0.7;
      const pillW = textWidth + padding * 2;
      const pillH = fontSize * 1.7;
      const margin = Math.round(img.width * 0.025);
      const x = img.width - pillW - margin;
      const y = img.height - pillH - margin;
      const r = pillH / 2;

      // Arka plan pill — yarı şeffaf siyah
      ctx.globalAlpha = 0.65;
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + pillW - r, y);
      ctx.quadraticCurveTo(x + pillW, y, x + pillW, y + r);
      ctx.lineTo(x + pillW, y + pillH - r);
      ctx.quadraticCurveTo(x + pillW, y + pillH, x + pillW - r, y + pillH);
      ctx.lineTo(x + r, y + pillH);
      ctx.quadraticCurveTo(x, y + pillH, x, y + pillH - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
      ctx.fill();

      // İsim metni — beyaz
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#ffffff';
      ctx.textBaseline = 'middle';
      ctx.fillText(displayText, x + padding, y + pillH / 2);

      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => resolve(imgSrc); // watermark başarısız olursa orijinali dön
    img.src = imgSrc;
  });
}