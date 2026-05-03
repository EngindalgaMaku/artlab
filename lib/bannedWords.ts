const BANNED: string[] = [
  // Şiddet
  'kill','murder','weapon','gun','bomb','blood','gore','death','war','violence','shoot','stab','torture',
  'öldür','ölüm','silah','bomba','kan','şiddet','savaş','katliam',
  // Cinsel içerik
  'nude','naked','sex','porn','erotic','nsfw','explicit',
  'çıplak','seks','müstehcen',
  // Nefret söylemi
  'hate','racist','nazi','terrorist','isis',
  'ırkçı','terörist','nefret',
  // Uyuşturucu
  'drug','cocaine','heroin','meth','cannabis',
  'uyuşturucu','kokain','eroin',
];

export interface FilterResult {
  ok: boolean;
  blocked: string[];
}

export function filterWords(words: string[]): FilterResult {
  const blocked: string[] = [];
  for (const word of words) {
    const lower = word.toLowerCase().trim();
    if (BANNED.some((b) => lower.includes(b))) {
      blocked.push(word);
    }
  }
  return { ok: blocked.length === 0, blocked };
}