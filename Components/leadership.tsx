'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

type Leader = {
  id: number;
  name: string;
  role: string;
  category: string;
  image_url: string;
  github_link: string | null;
};

export default function LeadershipSection() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      const { data, error } = await supabase
        .from('leaders')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error("Error fetching leaders:", error);
      } else if (data) {
        setLeaders(data);
      }
      setLoading(false);
    };

    fetchLeaders();
  }, []);

  const faculty = leaders.filter(l => l.category === 'Faculty');
  const students = leaders.filter(l => l.category === 'Student');

  // Prevent rendering empty space if DB is empty, but show loading state
  if (!loading && leaders.length === 0) return null;

  return (
    <section
      id="leadership"
      className="w-full bg-[#020202] text-white font-mono py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-12 border-t border-[#00FF41]/10"
    >
      <div className="max-w-7xl mx-auto space-y-12 md:space-y-16">

        {/* ── Header ── */}
        <header className="text-center space-y-3 px-2">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#00FF41] tracking-tighter leading-tight">
            ./Faculty_Coordinators
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            The architects and operators behind the BIAS Coding Club mainframe.
          </p>
        </header>

        {loading ? (
          <div className="text-center text-[#00FF41] animate-pulse">Fetching personnel data...</div>
        ) : (
          <>
            {/* ── Faculty ── */}
            {faculty.length > 0 && (
              <div className="space-y-6 md:space-y-8">
                <h3 className="text-lg sm:text-2xl border-b border-[#00FF41]/20 pb-2 text-gray-300 inline-block">
                  &gt; Faculty Coordinators
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 justify-items-center">
                  {faculty.map(leader => (
                    <div key={leader.id} className="w-full max-w-xs sm:max-w-sm">
                      <LeaderCard leader={leader} size="lg" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Students ── */}
            {students.length > 0 && (
              <div className="space-y-6 md:space-y-8">
                <h3 className="text-lg sm:text-2xl border-b border-[#00FF41]/20 pb-2 text-gray-300 inline-block">
                  &gt; Student Coordinators
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-6">
                  {students.map(leader => (
                    <LeaderCard key={leader.id} leader={leader} size="sm" />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

// ... Keep your existing LeaderCard function exactly the same down here ...
function LeaderCard({ leader, size = "sm" }: { leader: Leader; size?: "lg" | "sm" }) {
  const isLg = size === "lg";

  return (
    <div className="group relative border border-[#00FF41]/20 bg-[#050505] overflow-hidden hover:border-[#00FF41] hover:shadow-[0_0_25px_rgba(0,255,65,0.15)] transition-all duration-500 flex flex-col items-center text-center h-full"
      style={{ padding: isLg ? "1.5rem" : "0.875rem" }}
    >
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00FF41] opacity-50" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#00FF41] opacity-50" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#00FF41] opacity-50" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#00FF41] opacity-50" />

      <div
        className="relative mb-3 rounded-full overflow-hidden border-2 border-[#00FF41]/30 group-hover:border-[#00FF41] transition-colors duration-500 flex-shrink-0"
        style={{
          width:  isLg ? "clamp(96px, 20vw, 160px)" : "clamp(64px, 18vw, 100px)",
          height: isLg ? "clamp(96px, 20vw, 160px)" : "clamp(64px, 18vw, 100px)",
        }}
      >
        <Image
          src={leader.image_url}
          alt={leader.name}
          fill
          unoptimized
          className="object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out"
        />
      </div>

      <h3
        className="font-bold text-gray-100 mb-1 leading-snug"
        style={{ fontSize: isLg ? "clamp(0.95rem, 2.5vw, 1.25rem)" : "clamp(0.75rem, 3.5vw, 0.95rem)" }}
      >
        {leader.name}
      </h3>

      <p
        className="text-[#00FF41] uppercase tracking-widest font-bold mb-3"
        style={{ fontSize: isLg ? "0.7rem" : "0.6rem" }}
      >
        {leader.role}
      </p>

      {leader.github_link && (
        <a
          href={leader.github_link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto text-gray-500 hover:text-[#00FF41] transition-colors duration-300 border-b border-transparent hover:border-[#00FF41]"
          style={{ fontSize: isLg ? "0.85rem" : "0.7rem" }}
        >
          [ View_Profile ]
        </a>
      )}
    </div>
  );
}