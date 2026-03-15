import Image from 'next/image';
import { supabase } from '@/lib/supabase';

// Change to an async function to fetch data
export default async function EventGallery() {
  
  // Fetch real data from Supabase, newest events first
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: false });

  if (error) {
    console.error("Error fetching logs:", error);
  }

  // If no events exist yet, default to an empty array
  const activeEvents = events || [];

  return (
    <section id="gallery" className="w-full bg-[#020202] text-white font-mono py-12 md:py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="border-b border-[#00FF41]/20 pb-6">
          <h2 className="text-4xl md:text-5xl font-bold text-[#00FF41] tracking-tighter">
            ./System_Logs
          </h2>
          <p className="mt-2 text-gray-400">Archive of club operations, workshops, and deployments.</p>
        </header>

        {activeEvents.length === 0 ? (
          <p className="text-[#00FF41]/50 italic">No system logs found in the database.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeEvents.map((event) => (
              <article 
                key={event.id} 
                className="group border border-[#00FF41]/20 bg-black overflow-hidden hover:border-[#00FF41] hover:shadow-[0_0_20px_rgba(0,255,65,0.15)] transition-all duration-300 flex flex-col"
              >
                <div className="relative h-48 w-full overflow-hidden border-b border-[#00FF41]/20">
                  <div className="absolute inset-0 bg-[#00FF41]/10 group-hover:bg-transparent transition-colors z-10 mix-blend-overlay"></div>
                  <Image 
                    src={event.image_url} // Now pointing to your DB column name
                    alt={event.title}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <span className="text-xs text-[#00FF41] font-bold tracking-widest mb-2">
                    [{event.event_date}]
                  </span>
                  <h3 className="text-xl font-bold mb-3 text-gray-100">{event.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                    {event.description}
                  </p>
                  <button className="text-[#00FF41] text-sm uppercase tracking-wider text-left hover:underline w-fit">
                    Read_More &gt;
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}