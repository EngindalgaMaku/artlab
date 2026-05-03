import InteractiveDemo from '@/components/InteractiveDemo';

export default function DemoPage() {
  return (
    <main className="min-h-screen text-white">
      <div className="glass border-b border-white/10 px-8 py-4 flex items-center justify-between">
        <div>
          <span className="text-cyan-400 font-bold text-lg">AI ArtLab</span>
          <span className="text-white/30 text-sm ml-3">Prompt Atölyesi</span>
        </div>
        <a
          href="/"
          className="text-white/50 hover:text-white text-sm transition-colors"
        >
          ← Ana Sayfa
        </a>
      </div>
      <InteractiveDemo />
    </main>
  );
}