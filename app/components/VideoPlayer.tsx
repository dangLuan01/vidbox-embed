import React from 'react';

interface VideoPlayerProps {
  mediaType: 'movie' | 'tv';
  tmdbId: string;
  season?: string;
  episode?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  mediaType, 
  tmdbId, 
  season = '1', 
  episode = '1' 
}) => {
  
  const EMBED_BASE_URL = 'https://player.xoailac.top';
  
  const videoSrc = mediaType === 'movie' 
    ? `${EMBED_BASE_URL}/movie/${tmdbId}`
    : `${EMBED_BASE_URL}/tv/${tmdbId}/${season}/${episode}`;

  return (
    <div className="relative w-full max-w-6xl mx-auto group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
      <div className="relative rounded-2xl bg-black p-[1px] overflow-hidden">
        <div className="relative rounded-2xl overflow-hidden bg-black h-full w-full">
          
          <div className="aspect-video w-full relative z-10">
            {tmdbId ? (
              <iframe
                src={videoSrc}
                title="Video Player"
                className="w-full h-full"
                frameBorder="0"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-[#050505] text-gray-500 space-y-4">
                <div className="w-12 h-12 border-2 border-gray-800 border-t-cyan-500 rounded-full animate-spin"></div>
                <p className="font-mono text-xs tracking-widest uppercase">System Standby</p>
              </div>
            )}
          </div>

          {/* Hiệu ứng kính phản chiếu (Glass reflection overlay) */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/5 to-transparent pointer-events-none z-20"></div>
        </div>
        <div className="p-2 bg-gray-900 text-xs text-gray-400 font-mono text-center">
            Source: {videoSrc}
        </div>
        </div>
    </div>
  );
};

export default VideoPlayer;