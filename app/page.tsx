// app/page.tsx
'use client';

import { useState } from 'react';
import VideoPlayer from '@/app/components/VideoPlayer';

export default function WatchPage() {
  const [mediaType, setMediaType] = useState<'movie' | 'tv'>('movie');
  const [tmdbId, setTmdbId] = useState<string>('157336'); // Interstellar
  const [season, setSeason] = useState<string>('1');
  const [episode, setEpisode] = useState<string>('1');

  return (
    <main className="min-h-screen bg-black text-white relative selection:bg-cyan-500/30 selection:text-cyan-200 overflow-hidden font-sans">
      
      {/* --- Background Effects --- */}
      {/* 1. Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      {/* 2. Spotlight Gradient */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center py-12 px-4 md:px-8 max-w-7xl mx-auto">
        
        {/* --- Header --- */}
        <header className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-4">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-[10px] uppercase tracking-widest font-mono text-gray-400">Stream Ready</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-500">
            VidHub Theater
          </h1>
        </header>

        {/* --- Player Area --- */}
        <section className="w-full mb-12">
          <VideoPlayer 
            mediaType={mediaType} 
            tmdbId={tmdbId} 
            season={season} 
            episode={episode} 
          />
        </section>

        {/* --- Control Deck (Bảng điều khiển) --- */}
        <section className="w-full max-w-3xl">
          {/* Glass Container */}
          <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]">
            
            <div className="flex flex-col gap-8">
              
              {/* 1. Segmented Control (Tabs) */}
              <div className="flex justify-center">
                <div className="bg-black/40 p-1.5 rounded-xl border border-white/5 inline-flex relative">
                  {/* Sliding Effect Logic could be added here, using simple logic for now */}
                  <button
                    onClick={() => setMediaType('movie')}
                    className={`relative px-8 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 z-10 ${
                      mediaType === 'movie' 
                        ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Movie
                  </button>
                  <button
                    onClick={() => setMediaType('tv')}
                    className={`relative px-8 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 z-10 ${
                      mediaType === 'tv' 
                        ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    TV Show
                  </button>
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent w-full"></div>

              {/* 2. Data Inputs (Tech Style) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                
                {/* TMDB ID Input */}
                <div className={`flex flex-col gap-2 ${mediaType === 'tv' ? 'md:col-span-6' : 'md:col-span-12'}`}>
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-mono pl-1">TMDB Identifier</label>
                  <div className="relative group">
                    <input
                      type="text"
                      value={tmdbId}
                      onChange={(e) => setTmdbId(e.target.value)}
                      className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-cyan-400 font-mono focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder-gray-700"
                      placeholder="ENTER ID"
                    />
                    <div className="absolute right-3 top-3 text-xs text-gray-600 font-mono group-focus-within:text-cyan-500/50">#ID</div>
                  </div>
                </div>

                {/* Season & Episode */}
                {mediaType === 'tv' && (
                  <>
                    <div className="md:col-span-3 flex flex-col gap-2 animate-in fade-in slide-in-from-left-4 duration-500">
                      <label className="text-[10px] uppercase tracking-widest text-gray-500 font-mono pl-1">Season</label>
                      <input
                        type="number"
                        value={season}
                        onChange={(e) => setSeason(e.target.value)}
                        className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white font-mono focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                      />
                    </div>
                    <div className="md:col-span-3 flex flex-col gap-2 animate-in fade-in slide-in-from-right-4 duration-500">
                      <label className="text-[10px] uppercase tracking-widest text-gray-500 font-mono pl-1">Episode</label>
                      <input
                        type="number"
                        value={episode}
                        onChange={(e) => setEpisode(e.target.value)}
                        className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white font-mono focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-between items-center text-[10px] uppercase text-gray-600 font-mono tracking-widest px-4">
            <span>Video Source: vidhub</span>
            <span>Secured Connection</span>
          </div>
        </section>
      </div>
    </main>
  );
}