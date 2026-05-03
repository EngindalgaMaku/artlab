'use client';
import { useState, useEffect, useCallback } from 'react';
import { Maximize2, Minimize2, Zap } from 'lucide-react';

export default function Navbar() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleFSChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFSChange);
    return () => document.removeEventListener('fullscreenchange', handleFSChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Left: Logo + Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-white text-lg leading-none block">AI ArtLab</span>
            <span className="text-xs text-cyan-400 leading-none">TÜBİTAK 4006 • 2026</span>
            <span className="text-xs text-white/30 leading-none block">Hüsniye Özdilek TMTAL</span>
          </div>
        </div>

        {/* Center: Nav links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <a href="/" className="text-white/70 hover:text-cyan-400 transition-colors">Oluştur</a>
          <a href="/gallery" className="text-white/70 hover:text-cyan-400 transition-colors">Galeri</a>
          <a href="/demo" className="text-white/70 hover:text-cyan-400 transition-colors">Gelişmiş Demo</a>
          <a href="/stats" className="text-white/70 hover:text-cyan-400 transition-colors">İstatistikler</a>
          <a href="/display" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-cyan-400 transition-colors">Büyük Ekran</a>
        </div>

        {/* Right: Clock + Fullscreen */}
        <div className="flex items-center gap-4">
          <span className="hidden sm:block text-cyan-400 font-mono text-sm font-semibold">
            {time}
          </span>
          <button
            onClick={toggleFullscreen}
            className="glass px-3 py-2 rounded-xl text-white/70 hover:text-cyan-400 transition-all hover:border-cyan-400/40 flex items-center gap-2 text-sm"
            title="Tam Ekran (F11)"
          >
            {isFullscreen ? (
              <><Minimize2 className="w-4 h-4" /> <span className="hidden sm:inline">Çıkış</span></>
            ) : (
              <><Maximize2 className="w-4 h-4" /> <span className="hidden sm:inline">Tam Ekran</span></>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}