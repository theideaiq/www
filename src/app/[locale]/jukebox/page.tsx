'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Search, Plus, Check, Youtube, Clock, Music } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';

// Define the shape of our video data
interface VideoResult {
  id: string;
  title: string;
  thumbnail: string;
  channel: string;
  duration: string;
}

export default function JukeboxGuest() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<VideoResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState<string | null>(null); // Stores ID of video being added
  
  const supabase = createClient();

  // 1. Search Handler
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setResults([]); // Clear old results while searching

    try {
      const res = await fetch(`/api/youtube/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.items || []);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Add to Queue Handler
  const addToQueue = async (video: VideoResult) => {
    // Prevent double-clicking
    if (cooldown) return;

    setCooldown(video.id); // Start visual feedback
    
    const { error } = await supabase.from('jukebox_queue').insert({
      video_id: video.id,
      title: video.title,
      thumbnail: video.thumbnail,
      status: 'pending' // Default status
    });

    if (error) {
      console.error("Supabase Error:", error);
      // Optional: Show error toast here
      setCooldown(null);
    } else {
      // Success! Keep the green checkmark for 2 seconds, then reset
      setTimeout(() => setCooldown(null), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white font-sans selection:bg-red-500 selection:text-white">
      
      {/* HEADER */}
      <div className="p-8 text-center border-b border-white/5 bg-[#0f0f0f] sticky top-0 z-20 shadow-2xl">
        <h1 className="text-3xl font-black flex items-center justify-center gap-3 tracking-tighter">
          <Youtube className="text-red-600" size={36} /> 
          <span>IDEA <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">JUKEBOX</span></span>
        </h1>
        <p className="text-gray-400 text-sm mt-2 font-medium">Control the Vibe. Request a Track.</p>
      </div>

      {/* SEARCH BAR */}
      <div className="max-w-xl mx-auto p-4 -mt-6 relative z-30">
        <form onSubmit={handleSearch} className="relative group">
          <div className="absolute inset-0 bg-red-600/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition duration-500"></div>
          <div className="relative flex shadow-xl">
            <input 
              type="text" 
              placeholder="Search artist or song..." 
              className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-l-2xl px-6 h-14 text-white placeholder:text-gray-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all font-medium"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button 
              type="submit" 
              className="rounded-r-2xl rounded-l-none h-14 w-16 bg-red-600 hover:bg-red-700 p-0 flex items-center justify-center transition-all border-l border-white/10"
              disabled={loading}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Search size={22} />
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* RESULTS LIST */}
      <div className="max-w-xl mx-auto p-4 pb-20 space-y-4">
        
        {/* Empty State Hint */}
        {results.length === 0 && !loading && (
          <div className="text-center py-20 opacity-30 flex flex-col items-center">
            <Music size={48} className="mb-4" />
            <p>Search for music to get started</p>
          </div>
        )}

        {results.map((video) => (
          <div 
            key={video.id} 
            className="group flex gap-4 items-center bg-[#1a1a1a] border border-white/5 p-3 rounded-xl hover:bg-[#252525] hover:border-white/10 transition-all"
          >
            {/* Thumbnail */}
            <div className="relative w-28 h-20 rounded-lg overflow-hidden shrink-0 shadow-lg group-hover:shadow-red-900/10 transition-all">
              <Image 
                src={video.thumbnail} 
                alt={video.title} 
                fill 
                className="object-cover" 
              />
              <div className="absolute bottom-1 right-1 bg-black/80 text-[10px] font-bold px-1.5 py-0.5 rounded text-white backdrop-blur-sm">
                {video.duration}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 flex flex-col justify-center h-full">
              <h3 
                className="font-bold text-sm leading-snug line-clamp-2 text-gray-100 group-hover:text-white mb-1"
                dangerouslySetInnerHTML={{ __html: video.title }} // YouTube returns HTML entities
              ></h3>
              <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                 {video.channel}
              </p>
            </div>

            {/* Action Button */}
            <button 
              onClick={() => addToQueue(video)}
              disabled={cooldown !== null} // Disable all buttons while one request is processing to prevent spam
              className={`
                w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg transform
                ${cooldown === video.id 
                   ? 'bg-green-500 text-black scale-100' 
                   : 'bg-white/5 text-white hover:bg-red-600 hover:scale-110'}
              `}
            >
              {cooldown === video.id ? (
                <Check size={20} className="animate-in zoom-in duration-200" /> 
              ) : (
                <Plus size={20} />
              )}
            </button>
          </div>
        ))}
      </div>
      
    </div>
  );
}
