'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// Replace this with a fetch call to your database in production
const MOCK_EVENTS = [
  {
    id: '1',
    title: 'BIAS 48-Hour Hackathon',
    date: 'MAR 15',
    time: '10:00 AM - 10:00 AM (48hrs)',
    location: 'Main Auditorium / Online',
    type: 'Hackathon',
    description: 'Build, break, and deploy. Join 200+ developers for our flagship annual hackathon. Cash prizes and cloud credits up for grabs.',
    registrationLink: '#',
    isActive: true,
  },
  {
    id: '2',
    title: 'Next.js & Server Actions Masterclass',
    date: 'MAR 22',
    time: '04:00 PM - 06:00 PM',
    location: 'Lab 3',
    type: 'Workshop',
    description: 'Deep dive into React Server Components, caching strategies, and building full-stack applications without traditional APIs.',
    registrationLink: '#',
    isActive: true,
  },
  {
    id: '3',
    title: 'DSA Championship Circuit',
    date: 'APR 02',
    time: '05:00 PM - 08:00 PM',
    location: 'Online (HackerRank)',
    type: 'Competition',
    description: 'Test your algorithmic skills against the best minds on campus. Graph theory, dynamic programming, and advanced data structures.',
    registrationLink: '#',
    isActive: true,
  }
];

const G = '#00ff88';

const EventCard = ({ event, index }: { event: any, index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      className="group relative flex flex-col md:flex-row gap-6 p-6 rounded-2xl bg-zinc-950/40 border border-white/5 hover:border-[#00ff88]/30 transition-all duration-500 backdrop-blur-md overflow-hidden"
    >
      {/* Background Hover Glow */}
      <div className="absolute -inset-px bg-gradient-to-r from-[#00ff88]/0 via-[#00ff88]/5 to-[#00ff88]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />

      {/* Left: Date Block */}
      <div className="flex-shrink-0 flex md:flex-col items-center justify-center gap-2 md:gap-0 md:w-32 py-4 md:py-6 rounded-xl bg-black/40 border border-white/5 group-hover:border-[#00ff88]/20 transition-colors">
        <span className="font-['Orbitron'] text-2xl md:text-3xl font-black text-white group-hover:text-[#00ff88] transition-colors tracking-tighter">
          {event.date.split(' ')[1]}
        </span>
        <span className="font-['JetBrains_Mono'] text-xs md:text-sm tracking-[0.2em] text-zinc-500 uppercase">
          {event.date.split(' ')[0]}
        </span>
      </div>

      {/* Right: Content Block */}
      <div className="flex flex-col flex-grow justify-center">
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <span className="px-3 py-1 text-[10px] font-bold font-['JetBrains_Mono'] uppercase tracking-widest text-[#00ff88] bg-[#00ff88]/10 border border-[#00ff88]/20 rounded-full">
            {event.type}
          </span>
          <span className="text-zinc-400 text-xs font-['JetBrains_Mono'] flex items-center gap-2">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {event.time}
          </span>
        </div>

        <h3 className="text-2xl font-bold text-white font-['Orbitron'] mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-[#00ff88] transition-all">
          {event.title}
        </h3>
        
        <p className="text-sm text-zinc-400 font-['JetBrains_Mono'] leading-relaxed mb-6 max-w-2xl">
          {event.description}
        </p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-auto">
          <span className="text-zinc-500 text-xs font-['JetBrains_Mono'] flex items-center gap-2">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            {event.location}
          </span>
          
          <a 
            href={event.registrationLink}
            className="px-6 py-2 bg-transparent border border-[#00ff88]/30 text-[#00ff88] hover:bg-[#00ff88] hover:text-black font-['JetBrains_Mono'] text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-lg"
          >
            Register /&gt;
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default function UpcomingEvents() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const activeEvents = MOCK_EVENTS.filter(e => e.isActive);

  return (
    <section className="relative w-full min-h-screen bg-[#050505] py-24 md:py-32 overflow-hidden" id="events">
      {/* Background effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-[#00ff88]/20 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#00ff88]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6" ref={containerRef}>
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 mb-6 rounded-full border border-[#00ff88]/20 bg-[#00ff88]/5">
              <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
              <span className="text-[#00ff88] text-[10px] font-bold tracking-[0.2em] font-['JetBrains_Mono'] uppercase">Calendar</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white font-['Orbitron'] tracking-tighter">
              Upcoming <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] to-[#00cfff]">Events</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            <p className="text-zinc-500 font-['JetBrains_Mono'] text-sm max-w-xs md:text-right">
              Don't miss out on our latest workshops, hackathons, and guest lectures.
            </p>
          </motion.div>
        </div>

        {/* Events List */}
        <div className="flex flex-col gap-4">
          {activeEvents.length > 0 ? (
            activeEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))
          ) : (
            <div className="py-20 text-center border border-dashed border-white/10 rounded-2xl bg-white/5">
              <p className="text-zinc-500 font-['JetBrains_Mono']">No upcoming events scheduled. Check back soon.</p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}