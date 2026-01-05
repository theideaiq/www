'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { SkipForward, Music } from 'lucide-react';

// Dynamic import to avoid SSR issues
const ReactPlayer = dynamic(() => import('react-player'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-900 flex items-center justify-center text-gray-500 animate-pulse">
      Loading Player...
    </div>
  ),
}) as any;

export default function JukeboxHost() {
  const [queue, setQueue] = useState<any[]>([]);
  const [currentVideo, setCurrentVideo] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const supabase = createClient();

  /* ---------------- Realtime Queue ---------------- */

  useEffect(() => {
    fetchQueue();

    const channel = supabase
      .channel('jukebox_queue')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'jukebox_queue' },
        (payload) => setQueue((prev) => [...prev, payload.new])
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (!currentVideo && queue.length > 0) {
      playNext();
    }
  }, [queue, currentVideo]);

  /* ---------------- Helpers ---------------- */

  const fetchQueue = async () => {
    const { data, error } = await supabase
      .from('jukebox_queue')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true });

    if (error) console.error(error);
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
    setIsPlaying(false); // ensures light thumbnail shows

    await supabase
      .from('jukebox_queue')
      .update({ status: 'played' })
      .eq('id', next.id);
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 font-sans">

      {/* PLAYER */}
      <div className="w-full max-w-4xl aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10 mb-8 relative">
        {currentVideo ? (
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${currentVideo.video_id}`}
            light={currentVideo.thumbnail || true}
            playing={isPlaying}
            controls
            width="100%"
            height="100%"
            onClickPreview={() => setIsPlaying(true)}
            onStart={() => setIsPlaying(true)}
            onEnded={playNext}
            onError={(e: unknown) => {
              console.error('ReactPlayer error:', e);
            }}
            config={{
              youtube: {
                playerVars: {
                  rel: 0,
                  modestbranding: 1,
                },
              },
            }}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 bg-gray-900">
            <Music size={64} className="mb-4 opacity-50" />
            <p className="text-xl font-bold">Queue is empty</p>
            <p className="text-sm mt-2 opacity-70">Waiting for requests...</p>
          </div>
        )}
      </div>

      {/* INFO */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-black mb-2 tracking-tight">
          {currentVideo?.title || 'Silence in the Room'}
        </h1>

        <div
          className={`inline-flex items-center gap-2 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest ${
            isPlaying
              ? 'bg-red-600/20 text-red-500'
              : 'bg-gray-800 text-gray-500'
          }`}
        >
          {isPlaying ? 'Now Playing' : 'Standby'}
        </div>
      </div>

      {/* UP NEXT */}
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-end mb-4 border-b border-white/10 pb-2">
          <h3 className="text-gray-400 text-sm uppercase tracking-widest font-bold">
            Up Next ({queue.length})
          </h3>

          {currentVideo && (
            <button
              onClick={playNext}
              className="text-white hover:text-red-500 transition flex items-center gap-2 text-sm font-bold"
            >
              <SkipForward size={16} /> Skip Song
            </button>
          )}
        </div>

        <div className="space-y-2">
          {queue.length === 0 ? (
            <p className="text-gray-700 text-center py-4 italic">
              No songs coming up.
            </p>
          ) : (
            queue.map((item, i) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-3 bg-white/5 rounded-lg border border-white/5"
              >
                <span className="text-gray-500 font-mono text-sm w-6">
                  #{i + 1}
                </span>

                <div className="relative w-12 h-8 rounded overflow-hidden flex-shrink-0">
                  <Image
                    src={item.thumbnail}
                    alt="thumbnail"
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>

                <p className="truncate font-medium text-gray-300">
                  {item.title}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
