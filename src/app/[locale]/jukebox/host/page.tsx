'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { SkipForward, Disc3, Play, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';

// Dynamic Import
const ReactPlayer = dynamic(() => import('react-player'), { 
  ssr: false,
}) as any;

export default function JukeboxHost() {
  const [queue, setQueue] = useState<any[]>([]);
  const [currentVideo, setCurrentVideo] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false); // Permission check
  
  const supabase = createClient();

  useEffect(() => {
    const fetchQueue = async () => {
      const { data } = await supabase
        .from('jukebox_queue')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: true });
      if (data) setQueue(data);
    };

    fetchQueue();

    const channel = supabase
      .channel('jukebox_queue')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'jukebox_queue' }, (payload) => {
        setQueue((prev) => [...prev, payload.new]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    if (!currentVideo && queue.length > 0) {
      playNext();
    }
  }, [queue, currentVideo]);

  const playNext = async () => {
    if (queue.length === 0) {
      setCurrentVideo(null);
      setIsPlaying(false);
      return;
    }
    const next = queue[0];
    const remaining = queue.slice(1);
    setCurrentVideo(next);
    setQueue(remaining);
    await supabase.from('jukebox_queue').update({ status: 'played' }).eq('id', next.id);
  };

  // 1. PERMISSION SCREEN (Mandatory for Audio)
  if (!hasInteracted) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4 text-center z-50 relative">
        <button 
          onClick={() => setHasInteracted(true)}
          className="bg-red-600 hover:bg-red-700 text-white rounded-full p-8 shadow-[0_0_50px_rgba(220,38,38,0.5)] transition transform hover:scale-110 mb-6"
        >
          <Play size={48} fill="currentColor" className="ml-2" />
        </button>
        <h1 className="text-2xl font-black uppercase tracking-tighter mb-2">Tap to Start Jukebox</h1>
        <p className="text-gray-400 font-mono text-xs">Required to enable audio</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white overflow-hidden font-sans relative flex flex-col">
      
      {/* --- LAYER 0: THE "HIDDEN" PLAYER --- */}
      {/* We make it fullscreen but put it at z-index 0 so browsers verify it is "visible" */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-50">
        <ReactPlayer
          key={currentVideo?.video_id || 'empty'}
          // We use the exact URL that works for your thumbnails
          url={currentVideo ? `https://www.youtube.com/watch?v=${currentVideo.video_id}` : ''}
          playing={true}
          muted={false}       // Audio ON
          playsinline={true}  // iOS Requirement
          width="100%"        // Must be full width
          height="100%"       // Must be full height
          
          onEnded={playNext}
          onStart={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={(e: any) => console.error("Player Error:", e)}
          
          // Force YouTube to treat this as a real playback
          config={{
            youtube: {
              playerVars: { 
                playsinline: 1,
                controls: 0, // Hide YouTube controls
                showinfo: 0 
              }
            }
          }}
        />
      </div>

      {/* --- LAYER 1: THE BLACK CURTAIN --- */}
      {/* This covers the video player so you don't see the video, but audio still plays */}
      <div className="fixed inset-0 z-1 bg-neutral-950/90 backdrop-blur-3xl"></div>

      {/* --- LAYER 2: THE UI (Vinyl & Controls) --- */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-8">
        
        {/* Vinyl Record */}
        <motion.div 
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="relative w-72 h-72 md:w-96 md:h-96 rounded-full shadow-2xl border-4 border-gray-900 bg-black flex items-center justify-center overflow-hidden"
        >
          {/* Vinyl Textures */}
          <div className="absolute inset-0 rounded-full border-[2px] border-white/5"></div>
          <div className="absolute inset-0 rounded-full border-[24px] border-neutral-900/80 pointer-events-none"></div>
          <div className="absolute inset-0 rounded-full border-[60px] border-neutral-800/40 pointer-events-none"></div>
          
          {/* Album Art */}
          <div className="relative w-[40%] h-[40%] rounded-full overflow-hidden border-4 border-neutral-950 shadow-2xl z-20">
            {currentVideo ? (
               <Image src={currentVideo.thumbnail} alt="art" fill className="object-cover" />
            ) : (
               <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
                 <Disc3 className="text-neutral-700" size={48} />
               </div>
            )}
          </div>
        </motion.div>

        {/* Info & Status */}
        <div className="mt-12 text-center space-y-4 max-w-lg">
          <div className="flex items-center justify-center gap-2 text-red-500 font-bold uppercase tracking-[0.2em] text-xs">
             {isPlaying ? <Volume2 size={16} className="animate-pulse" /> : <VolumeX size={16} />}
             {isPlaying ? "Broadcasting" : "Buffering / Waiting"}
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tighter leading-tight drop-shadow-2xl line-clamp-2">
            {currentVideo?.title || "Jukebox Offline"}
          </h1>
        </div>
      </div>

      {/* --- LAYER 3: QUEUE --- */}
      <div className="relative z-20 bg-black/40 backdrop-blur-md border-t border-white/5 p-6 min-h-[180px]">
         <div className="max-w-4xl mx-auto flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Up Next ({queue.length})</h3>
              {currentVideo && (
                <button 
                  onClick={playNext} 
                  className="flex items-center gap-2 text-xs font-bold bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition"
                >
                  <SkipForward size={14} /> Skip
                </button>
              )}
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {queue.length === 0 ? (
                <div className="text-gray-600 text-sm italic w-full text-center mt-4">Queue is empty</div>
              ) : (
                queue.map((item, i) => (
                  <div key={item.id} className="min-w-[140px] max-w-[140px] p-2 bg-white/5 rounded-xl border border-white/5 group">
                    <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
                       <Image src={item.thumbnail} alt="thumb" fill className="object-cover opacity-80 group-hover:opacity-100" />
                    </div>
                    <p className="text-xs font-bold truncate text-gray-300">{item.title}</p>
                  </div>
                ))
              )}
            </div>
         </div>
      </div>

    </div>
  );
}
