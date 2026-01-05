'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image'; // Use Next.js Image for optimization
import { createClient } from '@/lib/supabase/client';
import { SkipForward, Music } from 'lucide-react';

// 1. DYNAMIC IMPORT (Prevents "window is not defined" error)
// We cast to 'any' to avoid the TypeScript build error you saw earlier.
const ReactPlayer = dynamic(() => import('react-player'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-900 flex items-center justify-center text-gray-500 animate-pulse">
      Loading System...
    </div>
  )
}) as any;

export default function JukeboxHost() {
  const [queue, setQueue] = useState<any[]>([]);
  const [currentVideo, setCurrentVideo] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isClient, setIsClient] = useState(false); // To ensure client-side rendering
  
  const supabase = createClient();

  // 2. REALTIME LISTENER
  useEffect(() => {
    setIsClient(true);
    fetchQueue();

    const channel = supabase
      .channel('jukebox_queue')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'jukebox_queue' }, (payload) => {
        setQueue((prev) => [...prev, payload.new]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // 3. AUTO-PLAY LOGIC
  useEffect(() => {
    // If nothing is playing and we have songs, play the next one
    if (!currentVideo && queue.length > 0) {
      playNext();
    }
  }, [queue, currentVideo]);

  const fetchQueue = async () => {
    const { data } = await supabase
      .from('jukebox_queue')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true });
    
    if (data) setQueue(data);
  };

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

    // Mark as played so it doesn't repeat on refresh
    await supabase.from('jukebox_queue').update({ status: 'played' }).eq('id', next.id);
  };

  // Prevent hydration mismatch
  if (!isClient) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 font-sans">
      
      {/* --- THE PLAYER --- */}
      <div className="w-full max-w-4xl aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10 mb-8 relative">
        <ReactPlayer
          // FORCE RESET: This ensures the player fully reloads for every new song
          key={currentVideo?.video_id || 'empty'}
          
          // ✅ THE FIX: Standard YouTube URL with correct '${}' syntax
          url={currentVideo ? `https://www.youtube.com/watch?v=${currentVideo.video_id}` : ''}
          
          // MOBILE SETTINGS
          playing={true}
          controls={true}
          muted={true}        // <--- Essential for mobile autoplay
          playsinline={true}  // <--- Essential for iOS

          width="100%"
          height="100%"
          
          onEnded={playNext} 
          onStart={() => setIsPlaying(true)}
          onError={(e: any) => console.log('Player Error:', e)}
        />

        {/* Empty State Overlay */}
        {!currentVideo && (
           <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 z-10 bg-gray-900">
             <Music size={64} className="mb-4 opacity-50" />
             <p className="text-xl font-bold">Queue is empty</p>
             <p className="text-sm mt-2 opacity-70">Waiting for requests...</p>
           </div>
        )}
      </div>

      {/* --- INFO SECTION --- */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-black mb-2 tracking-tight">
            {currentVideo?.title || "Silence in the Room"}
        </h1>
        <div className={`inline-flex items-center gap-2 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest ${isPlaying ? 'bg-red-600/20 text-red-500' : 'bg-gray-800 text-gray-500'}`}>
           {isPlaying ? "Now Playing" : "Standby"}
        </div>
      </div>

      {/* --- UP NEXT LIST --- */}
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-end mb-4 border-b border-white/10 pb-2">
           <h3 className="text-gray-400 text-sm uppercase tracking-widest font-bold">Up Next ({queue.length})</h3>
           {currentVideo && (
             <button onClick={playNext} className="text-white hover:text-red-500 transition flex items-center gap-2 text-sm font-bold">
               <SkipForward size={16} /> Skip Song
             </button>
           )}
        </div>
        
        <div className="space-y-2">
          {queue.length === 0 ? (
             <p className="text-gray-700 text-center py-4 italic">No songs coming up.</p>
          ) : (
            queue.map((item, i) => (
                <div key={item.id} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg border border-white/5">
                  <span className="text-gray-500 font-mono text-sm w-6">#{i + 1}</span>
                  
                  {/* Thumbnail Image */}
                  <div className="relative w-12 h-8 rounded overflow-hidden flex-shrink-0">
                      <Image 
                        src={item.thumbnail} 
                        alt="thumbnail"
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                  </div>
                  
                  <p className="truncate font-medium text-gray-300">{item.title}</p>
                </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
