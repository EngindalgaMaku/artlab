export interface ArtStyle {
  id: string;
  name: string;
  nametr: string;
  artist: string;
  period: string;
  exampleWork: string;
  exampleImage: string; // Wikimedia Commons / public domain
  description: string;
  promptTemplate: string;
}

export const artStyles: ArtStyle[] = [
  {
    id: 'impressionism',
    name: 'Impressionism',
    nametr: 'İzlenimcilik',
    artist: 'Claude Monet',
    period: '1860–1900',
    exampleWork: 'Nilüfer Çiçekleri (1906)',
    exampleImage: '/artworks/monet.jpg',
    description: 'Görünür fırça darbeleri, açık renkler, ışığın anlık etkisi',
    promptTemplate: 'Oil painting in the exact style of Claude Monet, French Impressionism, depicting {w1}, {w2}, and {w3}, thick visible impasto brushstrokes, dappled sunlight and reflections, soft pastel color palette, en plein air natural light, water and garden atmosphere, canvas texture visible, museum masterpiece',
  },
  {
    id: 'surrealism',
    name: 'Surrealism',
    nametr: 'Sürrealizm',
    artist: 'Salvador Dalí',
    period: '1920–1950',
    exampleWork: 'Belleğin Azmi (1931)',
    exampleImage: '/artworks/dali.jpg',
    description: 'Eriyen saatler, imkânsız sahneler, rüya mantığı',
    promptTemplate: 'Oil painting masterpiece in the exact style of Salvador Dali, Surrealism, featuring {w1}, {w2}, and {w3} as melting distorted objects in a vast barren landscape, soft melting clocks, elongated dreamlike shadows, hyper-realistic impossible dream logic, rich oil paint texture, dramatic golden sky, museum exhibition masterpiece',
  },
  {
    id: 'cubism',
    name: 'Cubism',
    nametr: 'Kübizm',
    artist: 'Pablo Picasso',
    period: '1907–1920',
    exampleWork: 'Avignonlu Kızlar (1907)',
    exampleImage: '/artworks/cubism.jpg',
    description: 'Geometrik parçalanma, çoklu bakış açıları',
    promptTemplate: 'Oil painting in the exact style of Pablo Picasso, Analytical Cubism, depicting {w1}, {w2}, and {w3} broken into geometric facets and angular planes, multiple simultaneous viewpoints, muted ochre and grey palette, fragmented forms reassembled, bold black outlines, early 20th century avant-garde masterpiece',
  },
  {
    id: 'vangogh',
    name: 'Post-Impressionism',
    nametr: 'Van Gogh Tarzı',
    artist: 'Vincent van Gogh',
    period: '1880–1890',
    exampleWork: 'Yıldızlı Gece (1889)',
    exampleImage: '/artworks/vangogh.jpg',
    description: 'Girdaplı fırça darbeleri, yoğun renkler, duygusal enerji',
    promptTemplate: 'Oil painting in the exact style of Vincent van Gogh, Post-Impressionism, depicting {w1}, {w2}, and {w3} under a dramatic swirling Starry Night sky, thick impasto brushstrokes with visible ridges, vivid swirling deep blues and luminous yellows, turbulent emotional energy, expressionist distortion, intensely textured canvas surface',
  },
  {
    id: 'popart',
    name: 'Pop Art',
    nametr: 'Pop Sanat',
    artist: 'Andy Warhol',
    period: '1960–1970',
    exampleWork: 'Marilyn Monroe (1962)',
    exampleImage: '/artworks/warhol.jpg',
    description: 'Canlı düz renkler, Ben-Day noktaları, tekrarlayan motifler',
    promptTemplate: 'Pop art artwork in the exact style of Andy Warhol, screen print technique, depicting {w1}, {w2}, and {w3} with bold flat colors, Ben-Day halftone dots, high-contrast black outlines, vibrant neon color fills, repeated grid motifs, commercial printing aesthetic, 1960s New York art scene',
  },
  {
    id: 'artdeco',
    name: 'Art Deco',
    nametr: 'Art Deco',
    artist: 'Tamara de Lempicka',
    period: '1920–1940',
    exampleWork: 'Yeşil Bugatti\'de (1929)',
    exampleImage: '/artworks/lempicka.jpg',
    description: 'Geometrik zarafet, altın detaylar, parlak yüzeyler',
    promptTemplate: 'Painting in the exact style of Tamara de Lempicka, Art Deco movement, depicting {w1}, {w2}, and {w3} with sleek geometric elegance, metallic gold and silver highlights, smooth polished surfaces, bold angular lines, glamorous 1920s aesthetic, rich jewel-tone colors, chrome and glass reflections',
  },
  {
    id: 'baroque',
    name: 'Baroque',
    nametr: 'Barok',
    artist: 'Caravaggio',
    period: '1600–1650',
    exampleWork: 'Judith ve Holofernes (1599)',
    exampleImage: '/artworks/caravaggio.jpg',
    description: 'Dramatik ışık-gölge, tenebrism, duygusal yoğunluk',
    promptTemplate: 'Oil painting in the exact style of Caravaggio, Italian Baroque, tenebrism technique, depicting {w1}, {w2}, and {w3} dramatically lit by a single beam of candlelight against pitch-black darkness, extreme chiaroscuro contrast, hyperrealistic textures, intense emotional drama, deep shadows, museum-quality old master painting',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    nametr: 'Siberpunk',
    artist: 'Dijital Sanat',
    period: '1980–Günümüz',
    exampleWork: 'Neon Gece Şehri',
    exampleImage: '/artworks/cyberpunk.jpg',
    description: 'Neon ışıklar, yağmurlu sokaklar, dijital fütürizm',
    promptTemplate: 'Cyberpunk digital art depicting {w1}, {w2}, and {w3}, neon-lit rain-soaked streets, holographic advertisements, towering megacity architecture, purple and cyan neon glow, reflective wet pavement, Blade Runner 2049 cinematic atmosphere, 8K ultra-detailed digital painting, dystopian future aesthetic',
  },
  {
    id: 'artnouveau',
    name: 'Art Nouveau',
    nametr: 'Art Nouveau',
    artist: 'Alphonse Mucha',
    period: '1890–1910',
    exampleWork: 'Gismonda (1895)',
    exampleImage: '/artworks/mucha.jpg',
    description: 'Akışkan organik çizgiler, çiçek motifleri, zarif süsleme',
    promptTemplate: 'Decorative illustration in the exact style of Alphonse Mucha, Art Nouveau movement, depicting {w1}, {w2}, and {w3} surrounded by flowing organic botanical ornaments, intricate floral borders, graceful curved lines, pastel and gold palette, ornate circular halo frame, vintage poster aesthetic, lithograph print quality',
  },
  {
    id: 'renaissance',
    name: 'Renaissance',
    nametr: 'Rönesans',
    artist: 'Leonardo da Vinci',
    period: '1400–1600',
    exampleWork: 'Mona Lisa (1503)',
    exampleImage: '/artworks/davinci.jpg',
    description: 'Sfumato tekniği, altın oran, anatomik mükemmellik',
    promptTemplate: 'Oil painting in the exact style of Leonardo da Vinci, Italian Renaissance, depicting {w1}, {w2}, and {w3} with sfumato soft atmospheric haze technique, golden ratio composition, warm earthy umber and sienna palette, precise anatomical detail, mysterious rocky landscape background, aged wood panel painting texture, Louvre museum masterpiece',
  },
];

export function getStyleById(id: string): ArtStyle | undefined {
  return artStyles.find((s) => s.id === id);
}

export function buildStyledPrompt(style: ArtStyle, w1: string, w2: string, w3: string): string {
  const base = style.promptTemplate
    .replace(/{w1}/g, w1.trim())
    .replace(/{w2}/g, w2.trim())
    .replace(/{w3}/g, w3.trim());

  return `${base}, incorporating the symbolic visual elements of ${w1.trim()}, ${w2.trim()}, and ${w3.trim()} as distinct recognizable objects within the composition, fine art museum quality, masterpiece, no text, no letters, no words, no typography, no writing, no labels`;
}