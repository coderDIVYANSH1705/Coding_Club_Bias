'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

// Type specifically for Gallery (with image_url)
type SystemLog = {
  id: string; 
  title: string;
  event_date: string;
  description: string;
  image_url: string;
};

export default function EventGallery() {
  const [activeLogs, setActiveLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      // YAHAN CHANGE KIYA HAI: 'events' ki jagah 'gallery' table se data aayega
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching logs:", error);
      } else if (data) {
        setActiveLogs(data);
      }
      setLoading(false);
    };

    fetchLogs();
  }, []);

  return (
    <section id="gallery" className="w-full bg-[#020202] text-white font-mono py-12 md:py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="border-b border-[#00FF41]/20 pb-6">
          <h2 className="text-4xl md:text-5xl font-bold text-[#00FF41] tracking-tighter">
            ./System_Logs
          </h2>
          <p className="mt-2 text-gray-400">Archive of club operations, workshops, and deployments.</p>
        </header>

        {loading ? (
          <p className="text-[#00FF41] animate-pulse">Extracting logs from database...</p>
        ) : activeLogs.length === 0 ? (
          <p className="text-[#00FF41]/50 italic">No system logs found in the database.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeLogs.map((log) => (
              <article 
                key={log.id} 
                className="group border border-[#00FF41]/20 bg-black overflow-hidden hover:border-[#00FF41] hover:shadow-[0_0_20px_rgba(0,255,65,0.15)] transition-all duration-300 flex flex-col"
              >
                <div className="relative h-48 w-full overflow-hidden border-b border-[#00FF41]/20">
                  <div className="absolute inset-0 bg-[#00FF41]/10 group-hover:bg-transparent transition-colors z-10 mix-blend-overlay"></div>
                  <Image 
                    src={log.image_url} 
                    alt={log.title}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <span className="text-xs text-[#00FF41] font-bold tracking-widest mb-2">
                    [{log.event_date}]
                  </span>
                  <h3 className="text-xl font-bold mb-3 text-gray-100">{log.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                    {log.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}