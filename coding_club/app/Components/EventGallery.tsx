import Image from 'next/image';

// Mock data: In a real app, you'd fetch this from your database (e.g., Prisma/MongoDB)
const mockEvents = [
  {
    id: 1,
    title: 'AlgoRhythm: Competitive Programming',
    date: 'March 15, 2026',
    description: 'A 12-hour intense coding sprint. Over 500 lines of logic written. Pushing the boundaries of time complexity.',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Web3 & Docker Workshop',
    date: 'February 28, 2026',
    description: 'Containerizing modern applications. Students learned how to deploy scalable architecture from scratch.',
    imageUrl: 'https://images.unsplash.com/photo-1618401471353-b98a5233c591?q=80&w=1000&auto=format&fit=crop',
  }
];

export default function EventGallery() {
  return (
    <section className="w-full bg-[#020202] text-white font-mono py-12 md:py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="border-b border-[#00FF41]/20 pb-6">
          <h2 className="text-4xl md:text-5xl font-bold text-[#00FF41] tracking-tighter">
            ./System_Logs
          </h2>
          <p className="mt-2 text-gray-400">Archive of club operations, workshops, and deployments.</p>
        </header>

        {/* 100% Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockEvents.map((event) => (
            <article 
              key={event.id} 
              className="group border border-[#00FF41]/20 bg-black overflow-hidden hover:border-[#00FF41] hover:shadow-[0_0_20px_rgba(0,255,65,0.15)] transition-all duration-300 flex flex-col"
            >
              <div className="relative h-48 w-full overflow-hidden border-b border-[#00FF41]/20">
                {/* Image overlay to ensure the terminal vibe stays intact */}
                <div className="absolute inset-0 bg-[#00FF41]/10 group-hover:bg-transparent transition-colors z-10 mix-blend-overlay"></div>
                <Image 
                  src={event.imageUrl} 
                  alt={event.title}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <span className="text-xs text-[#00FF41] font-bold tracking-widest mb-2">
                  [{event.date}]
                </span>
                <h3 className="text-xl font-bold mb-3 text-gray-100">{event.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">
                  {event.description}
                </p>
                <button className="text-[#00FF41] text-sm uppercase tracking-wider text-left hover:underline w-fit">
                  Read_More &gt;
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}