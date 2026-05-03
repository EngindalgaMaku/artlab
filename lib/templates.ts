export interface ArtTemplate {
  id: number;
  name: string;
  nametr: string;
  category: string;
  template: string;
}

export const artTemplates: ArtTemplate[] = [
  // ── SÜRREALİST ──────────────────────────────────────────────
  {
    id: 1,
    name: 'Surrealist Dream',
    nametr: 'Sürrealist Rüya – Salvador Dali',
    category: 'Sürrealizm',
    template: 'Oil painting masterpiece in the exact style of Salvador Dali, surrealism, featuring {w1}, {w2}, and {w3} as melting distorted objects in a vast desert landscape, soft melting clocks, elongated shadows, hyper-realistic dream logic, rich oil paint texture, dramatic sky, museum exhibition quality',
  },
  {
    id: 2,
    name: 'Magritte Vision',
    nametr: 'Sürrealist Gizem – René Magritte',
    category: 'Sürrealizm',
    template: 'Oil painting in the exact style of René Magritte, surrealism, depicting {w1}, {w2}, and {w3} in paradoxical impossible situations, bowler-hatted figures, green apple motifs, blue sky with white clouds backdrop, philosophical visual paradox, Belgian surrealism, smooth flat paint technique',
  },
  {
    id: 3,
    name: 'Dream Collage',
    nametr: 'Sürrealist Kolaj – Max Ernst',
    category: 'Sürrealizm',
    template: 'Surrealist collage artwork in the style of Max Ernst featuring {w1}, {w2}, and {w3}, floating islands, inverted gravity, impossible architecture, dreamlike vivid impossible colors, frottage texture, automatic drawing technique',
  },

  // ── SİBERPUNK ───────────────────────────────────────────────
  {
    id: 4,
    name: 'Cyberpunk City',
    nametr: 'Siberpunk Şehir',
    category: 'Siberpunk',
    template: 'A high-tech cyberpunk visualization of {w1}, {w2}, and {w3}, neon glow, rainy night, 8K cinematic lighting, futuristic city background, holographic elements, blade runner aesthetic',
  },
  {
    id: 5,
    name: 'Neon Noir',
    nametr: 'Neon Kara Film',
    category: 'Siberpunk',
    template: 'Neon noir cyberpunk artwork featuring {w1}, {w2}, and {w3}, purple and cyan neon lights, rain-slicked streets, towering megastructures, dystopian atmosphere, cinematic composition',
  },
  {
    id: 6,
    name: 'Cyber Oracle',
    nametr: 'Siber Kehanet',
    category: 'Siberpunk',
    template: 'Cyberpunk oracle visualization of {w1}, {w2}, and {w3}, data streams, neural networks, glowing circuitry overlaid on organic forms, ultra-sharp 8K render',
  },

  // ── KLASİK YAĞLI BOYA ───────────────────────────────────────
  {
    id: 7,
    name: 'Old Masters Oil',
    nametr: 'Altın Işık – Rembrandt',
    category: 'Klasik Sanat',
    template: 'Oil painting in the exact style of Rembrandt van Rijn, Dutch Golden Age, depicting {w1}, {w2}, and {w3} dramatically lit from a single light source, deep rich shadows, chiaroscuro technique, warm amber and gold tones, thick impasto brushwork, aged canvas craquelure texture, museum masterpiece',
  },
  {
    id: 8,
    name: 'Baroque Drama',
    nametr: 'Işık ve Gölge – Caravaggio',
    category: 'Klasik Sanat',
    template: 'Oil painting in the exact style of Caravaggio, Italian Baroque, depicting {w1}, {w2}, and {w3} with extreme dramatic chiaroscuro lighting, pitch-black background, single beam of light, intense emotional realism, hyperrealistic skin texture, dark and powerful composition',
  },
  {
    id: 9,
    name: 'Renaissance Glory',
    nametr: 'Sfumato – Leonardo da Vinci',
    category: 'Klasik Sanat',
    template: 'Oil painting in the exact style of Leonardo da Vinci, Italian Renaissance, depicting {w1}, {w2}, and {w3} with sfumato soft-focus technique, golden ratio composition, warm earthy umber palette, anatomical precision, mysterious atmospheric perspective, aged panel painting texture',
  },

  // ── UKİYO-E / JAPON ─────────────────────────────────────────
  {
    id: 10,
    name: 'Ukiyo-e Wave',
    nametr: 'Ukiyo-e Dalgası',
    category: 'Japon Sanatı',
    template: 'Japanese Ukiyo-e woodblock print of {w1}, {w2}, and {w3}, in the style of Hokusai, bold outlines, flat color areas, Mount Fuji background, traditional Japanese aesthetic',
  },
  {
    id: 11,
    name: 'Anime Fantasy',
    nametr: 'Anime Fantezi',
    category: 'Japon Sanatı',
    template: 'Studio Ghibli inspired anime illustration of {w1}, {w2}, and {w3}, lush watercolor backgrounds, whimsical characters, magical atmosphere, soft pastel tones, Hayao Miyazaki style',
  },
  {
    id: 12,
    name: 'Zen Ink',
    nametr: 'Zen Mürekkep',
    category: 'Japon Sanatı',
    template: 'Japanese sumi-e ink painting of {w1}, {w2}, and {w3}, minimalist brushstrokes, negative space mastery, Zen philosophy, black ink on rice paper texture, contemplative mood',
  },

  // ── BAUHAUS / MİNİMALİST ────────────────────────────────────
  {
    id: 13,
    name: 'Bauhaus Geometry',
    nametr: 'Bauhaus Geometri',
    category: 'Minimalizm',
    template: 'Bauhaus design poster of {w1}, {w2}, and {w3}, primary colors, geometric shapes, Swiss grid layout, sans-serif typography integration, modernist aesthetic, Paul Klee inspired',
  },
  {
    id: 14,
    name: 'Minimal Lines',
    nametr: 'Minimal Çizgiler',
    category: 'Minimalizm',
    template: 'Ultra-minimalist artwork representing {w1}, {w2}, and {w3}, single continuous line art, white negative space, elegant simplicity, modern gallery aesthetic, premium quality',
  },
  {
    id: 15,
    name: 'Geometric Abstract',
    nametr: 'Geometrik Soyut',
    category: 'Minimalizm',
    template: 'Geometric abstract composition of {w1}, {w2}, and {w3}, Mondrian influenced, bold color blocks, perfect symmetry, flat design, vector art precision, contemporary art gallery',
  },

  // ── ART NOUVEAU ─────────────────────────────────────────────
  {
    id: 16,
    name: 'Art Nouveau Flow',
    nametr: 'Art Nouveau Akışı',
    category: 'Art Nouveau',
    template: 'Art Nouveau illustration of {w1}, {w2}, and {w3}, flowing organic lines, floral motifs, Alphonse Mucha style, ornate borders, elegant curves, golden details, poster art',
  },
  {
    id: 17,
    name: 'Belle Époque',
    nametr: 'Belle Époque',
    category: 'Art Nouveau',
    template: 'Belle Époque decorative poster featuring {w1}, {w2}, and {w3}, graceful female figures, botanical ornaments, pastel and gold palette, Klimt inspired, luxurious detail',
  },

  // ── VAPORWAVE / RETROWAVE ────────────────────────────────────
  {
    id: 18,
    name: 'Vaporwave Dream',
    nametr: 'Vaporwave Rüyası',
    category: 'Vaporwave',
    template: 'Vaporwave aesthetic artwork of {w1}, {w2}, and {w3}, pink and purple gradient sky, retro computer graphics, palm trees, Greek statues, synthwave grid, nostalgic 80s atmosphere',
  },
  {
    id: 19,
    name: 'Retrowave Sunset',
    nametr: 'Retrowave Günbatımı',
    category: 'Vaporwave',
    template: 'Retrowave synthwave visualization of {w1}, {w2}, and {w3}, neon sunset, chrome typography, laser grid landscape, 1980s retro-futurism, DeLorean aesthetic, electric purple tones',
  },

  // ── GOTİK / DARK ART ────────────────────────────────────────
  {
    id: 20,
    name: 'Gothic Cathedral',
    nametr: 'Gotik Katedral',
    category: 'Gotik Sanat',
    template: 'Gothic dark fantasy artwork of {w1}, {w2}, and {w3}, ancient stone architecture, moonlight through stained glass, dramatic shadows, ravens, mystical atmosphere, Tim Burton inspired',
  },
  {
    id: 21,
    name: 'Dark Romanticism',
    nametr: 'Karanlık Romantizm',
    category: 'Gotik Sanat',
    template: 'Dark romanticism painting of {w1}, {w2}, and {w3}, stormy night sky, candlelight, Victorian aesthetic, Caspar David Friedrich style, melancholy beauty, fog and mist',
  },

  // ── İZLENİMCİLİK ────────────────────────────────────────────
  {
    id: 22,
    name: 'Impressionist Garden',
    nametr: 'İzlenimci Yağlıboya – Claude Monet',
    category: 'İzlenimcilik',
    template: 'Oil painting in the exact style of Claude Monet, French Impressionism, depicting {w1}, {w2}, and {w3} surrounded by water lilies and garden reflections, thick visible impasto brushstrokes, dappled sunlight, soft pastel palette, en plein air atmosphere, canvas texture visible',
  },
  {
    id: 23,
    name: 'Post-Impressionist',
    nametr: 'Girdaplı Fırça – Vincent van Gogh',
    category: 'İzlenimcilik',
    template: 'Oil painting in the exact style of Vincent van Gogh, Post-Impressionism, depicting {w1}, {w2}, and {w3} under a swirling Starry Night sky, thick impasto brushstrokes, vivid swirling yellows and deep blues, emotional turbulent energy, expressionist distortion, visible paint ridges on canvas',
  },

  // ── FÜTÜRZM / SCI-FI ────────────────────────────────────────
  {
    id: 24,
    name: 'Sci-Fi Cosmos',
    nametr: 'Bilim Kurgu Kozmos',
    category: 'Bilim Kurgu',
    template: 'Epic science fiction space art of {w1}, {w2}, and {w3}, nebulae, distant galaxies, alien megastructures, bioluminescent life forms, NASA aesthetic, hyperrealistic render',
  },
  {
    id: 25,
    name: 'Futurist Speed',
    nametr: 'Fütürist Hız',
    category: 'Bilim Kurgu',
    template: 'Italian Futurist dynamic artwork of {w1}, {w2}, and {w3}, motion lines, speed and energy, fragmented forms, Umberto Boccioni style, industrial power, vibrant movement',
  },
  {
    id: 26,
    name: 'Biopunk',
    nametr: 'Biyopunk',
    category: 'Bilim Kurgu',
    template: 'Biopunk organic sci-fi visualization of {w1}, {w2}, and {w3}, fused organic and mechanical, bioluminescent tissues, DNA helices, cellular structures, eerie green glow, ultra-detailed',
  },

  // ── FOTOGERÇEKÇI ────────────────────────────────────────────
  {
    id: 27,
    name: 'Photorealistic',
    nametr: 'Fotogerçekçi',
    category: 'Fotogerçekçilik',
    template: 'Hyperrealistic professional photograph of {w1}, {w2}, and {w3}, studio lighting, 8K resolution, shot on Hasselblad, razor sharp focus, award-winning composition',
  },
  {
    id: 28,
    name: 'Cinematic Still',
    nametr: 'Sinematik Kare',
    category: 'Fotogerçekçilik',
    template: 'Cinematic movie still featuring {w1}, {w2}, and {w3}, anamorphic lens flare, dramatic golden hour lighting, depth of field, Oscar-winning cinematography, epic scale',
  },

  // ── SOYUT DIŞAVURUMCULUK ────────────────────────────────────
  {
    id: 29,
    name: 'Abstract Expressionism',
    nametr: 'Soyut Dışavurumculuk',
    category: 'Soyut Sanat',
    template: 'Abstract expressionist painting representing {w1}, {w2}, and {w3}, drip painting technique, Jackson Pollock inspired, explosive color energies, emotional raw power, large canvas feel',
  },
  {
    id: 30,
    name: 'Color Field',
    nametr: 'Renk Alanı',
    category: 'Soyut Sanat',
    template: 'Color field painting evoking {w1}, {w2}, and {w3}, Mark Rothko inspired, large blocks of luminous color, meditative depth, subtle gradients, spiritual contemplation',
  },

  // ── ANADOLU / TÜRK ──────────────────────────────────────────
  {
    id: 31,
    name: 'Ottoman Miniature',
    nametr: 'Osmanlı Minyatürü',
    category: 'Türk Sanatı',
    template: 'Ottoman miniature painting style depicting {w1}, {w2}, and {w3}, intricate geometric patterns, gold leaf details, lapis lazuli blues, traditional Turkish motifs, Topkapı Palace aesthetic',
  },
  {
    id: 32,
    name: 'Anatolian Mosaic',
    nametr: 'Anadolu Mozaiği',
    category: 'Türk Sanatı',
    template: 'Anatolian mosaic artwork inspired by {w1}, {w2}, and {w3}, Byzantine tessellate patterns, turquoise and terracotta palette, ancient Anatolia imagery, neon-lit modern reinterpretation',
  },
  {
    id: 33,
    name: 'Neon Kilim',
    nametr: 'Neon Kilim',
    category: 'Türk Sanatı',
    template: 'Traditional Turkish kilim rug pattern reimagined with {w1}, {w2}, and {w3}, geometric tribal motifs, neon color palette, digital-age reinterpretation, symmetrical composition, 8K detail',
  },

  // ── STREETARt / GRAFFITI ────────────────────────────────────
  {
    id: 34,
    name: 'Street Mural',
    nametr: 'Sokak Duvar Resmi',
    category: 'Sokak Sanatı',
    template: 'Urban street art mural of {w1}, {w2}, and {w3}, Banksy meets Jean-Michel Basquiat style, spray paint texture, brick wall background, social commentary, bold graphic impact',
  },
  {
    id: 35,
    name: 'Graffiti Tag',
    nametr: 'Graffiti',
    category: 'Sokak Sanatı',
    template: 'Graffiti wildstyle lettering artwork incorporating {w1}, {w2}, and {w3}, vibrant spray paint colors, urban environment, chrome and outline effects, New York subway aesthetic',
  },

  // ── İSLAMİ GEOMETRİ ─────────────────────────────────────────
  {
    id: 36,
    name: 'Islamic Geometry',
    nametr: 'İslami Geometri',
    category: 'İslami Sanat',
    template: 'Islamic geometric art pattern inspired by {w1}, {w2}, and {w3}, infinite tessellation, arabesques, turquoise and gold palette, mathematical perfection, Alhambra palace style, meditative symmetry',
  },
  {
    id: 37,
    name: 'Calligraphy Fusion',
    nametr: 'Kaligrafi Füzyon',
    category: 'İslami Sanat',
    template: 'Modern Arabic calligraphy fusion artwork with themes of {w1}, {w2}, and {w3}, fluid letterforms, neon illumination, geometric background, East meets West contemporary style',
  },

  // ── ÇOCUK KİTABI / WHIMSICAL ────────────────────────────────
  {
    id: 38,
    name: 'Storybook Magic',
    nametr: 'Masal Büyüsü',
    category: 'Masalsı',
    template: 'Whimsical children\'s storybook illustration of {w1}, {w2}, and {w3}, watercolor style, magical forest setting, fairy tale atmosphere, soft glowing light, enchanting and joyful',
  },
  {
    id: 39,
    name: 'Pixar World',
    nametr: 'Pixar Dünyası',
    category: 'Masalsı',
    template: 'Pixar animation style 3D render of {w1}, {w2}, and {w3}, warm lighting, subsurface scattering, expressive characters, vibrant colors, heartwarming atmosphere, cinema quality',
  },

  // ── LOWPOLY / DIJITAL ───────────────────────────────────────
  {
    id: 40,
    name: 'Low Poly Art',
    nametr: 'Low Poly Sanat',
    category: 'Dijital Sanat',
    template: 'Low poly geometric art of {w1}, {w2}, and {w3}, triangulated mesh, sunset gradient colors, clean faceted forms, modern digital poster, sharp geometric beauty',
  },
  {
    id: 41,
    name: 'Glitch Art',
    nametr: 'Glitch Sanat',
    category: 'Dijital Sanat',
    template: 'Glitch art digital corruption aesthetic of {w1}, {w2}, and {w3}, RGB channel splits, scan lines, pixel sorting, digital artifacts, corrupted data beauty, neon on black',
  },
  {
    id: 42,
    name: 'Holographic',
    nametr: 'Holografik',
    category: 'Dijital Sanat',
    template: 'Holographic iridescent visualization of {w1}, {w2}, and {w3}, rainbow prismatic light dispersion, transparent layers, chrome reflections, futuristic hologram display, 8K render',
  },

  // ── DOĞA / ORGANİK ──────────────────────────────────────────
  {
    id: 43,
    name: 'Botanical Illustration',
    nametr: 'Botanik İllüstrasyon',
    category: 'Doğa Sanatı',
    template: 'Detailed botanical scientific illustration of {w1}, {w2}, and {w3}, Victorian natural history style, intricate pen and ink details, watercolor fills, white background, encyclopedia plate quality',
  },
  {
    id: 44,
    name: 'Fractal Nature',
    nametr: 'Fraktal Doğa',
    category: 'Doğa Sanatı',
    template: 'Fractal mathematical nature artwork of {w1}, {w2}, and {w3}, Mandelbrot set inspired, infinite recursive patterns, bioluminescent ocean colors, sacred geometry, ultra-detailed zoom',
  },

  // ── POP ART ─────────────────────────────────────────────────
  {
    id: 45,
    name: 'Pop Art Bang',
    nametr: 'Pop Art Patlaması',
    category: 'Pop Art',
    template: 'Pop art poster of {w1}, {w2}, and {w3}, Andy Warhol screen print style, bold flat colors, Ben-Day dots, comic book outlines, repeated motifs, high contrast, iconic imagery',
  },
  {
    id: 46,
    name: 'Retro Comic',
    nametr: 'Retro Çizgi Roman',
    category: 'Pop Art',
    template: 'Vintage comic book panel depicting {w1}, {w2}, and {w3}, Roy Lichtenstein style, halftone dots, bold black outlines, speech bubbles, primary colors, 1960s printing texture',
  },

  // ── STEAMPUNK ───────────────────────────────────────────────
  {
    id: 47,
    name: 'Steampunk Engine',
    nametr: 'Buharpunk Makine',
    category: 'Steampunk',
    template: 'Victorian steampunk mechanical artwork featuring {w1}, {w2}, and {w3}, brass gears and cogs, steam pipes, dirigibles, copper and sepia tones, Victorian engineering aesthetic, intricate clockwork',
  },

  // ── ÇEVRE / EKOLOJİ ─────────────────────────────────────────
  {
    id: 48,
    name: 'Solarpunk Utopia',
    nametr: 'Solarpunk Ütopya',
    category: 'Çevre Sanatı',
    template: 'Solarpunk utopian vision of {w1}, {w2}, and {w3}, green technology harmony, solar panels and gardens, bright optimistic future, lush vegetation meets clean architecture, warm sunlight, hopeful',
  },

  // ── ENSTALASYON / 3D ────────────────────────────────────────
  {
    id: 49,
    name: '3D Sculptural',
    nametr: '3D Heykelsi',
    category: '3D Sanat',
    template: '3D sculptural render of {w1}, {w2}, and {w3}, museum installation art, polished marble and glass, dramatic gallery lighting, Zaha Hadid architecture inspiration, ultra-realistic Blender render',
  },
  {
    id: 50,
    name: 'Ink & Watercolor',
    nametr: 'Mürekkep & Sulu Boya',
    category: 'Geleneksel',
    template: 'Expressive ink and watercolor artwork of {w1}, {w2}, and {w3}, loose wet-on-wet technique, ink bleeds and blooms, textured paper, spontaneous mark-making, contemporary fine art',
  },
];

export function getRandomTemplate(): ArtTemplate {
  return artTemplates[Math.floor(Math.random() * artTemplates.length)];
}

export function buildFinalPrompt(template: ArtTemplate, w1: string, w2: string, w3: string): string {
  // Şablondaki kelimeleri yerleştir
  const styledPrompt = template.template
    .replace(/{w1}/g, w1.trim())
    .replace(/{w2}/g, w2.trim())
    .replace(/{w3}/g, w3.trim())
    .replace(/{words}/g, `${w1.trim()}, ${w2.trim()} and ${w3.trim()}`);

  // Sanatçı tarzı öne çıkar, kelimeler görsel olarak dahil edilsin
  // Yapı: [Tarz] + [Kelimeler görsel birer eleman olarak] + [Kalite]
  return `${styledPrompt}, incorporating the symbolic visual elements of ${w1.trim()}, ${w2.trim()}, and ${w3.trim()} as distinct recognizable objects within the composition, fine art museum quality, masterpiece`;
}