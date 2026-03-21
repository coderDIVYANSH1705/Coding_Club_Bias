'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Plus, Trash2, Power, X, Calendar, MapPin, Clock } from 'lucide-react';

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface EventData {
  id: string;
  title: string;
  event_date: string;
  time_string: string;
  location: string;
  event_type: string;
  description: string;
  registration_link: string;
  is_active: boolean;
}

export default function AdminUpcomingEvents() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '', event_date: '', time_string: '', location: '', 
    event_type: 'Workshop', description: '', registration_link: ''
  });

  // Fetch Events
  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true });
      
    if (!error && data) setEvents(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle Submit (Create)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('events').insert([formData]);
    
    if (!error) {
      setIsModalOpen(false);
      setFormData({ title: '', event_date: '', time_string: '', location: '', event_type: 'Workshop', description: '', registration_link: '' });
      fetchEvents();
    } else {
      alert('Error creating event. Check console.');
      console.error(error);
    }
  };

  // Toggle Active Status
  const toggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from('events').update({ is_active: !currentStatus }).eq('id', id);
    if (!error) fetchEvents();
  };

  // Delete Event
  const deleteEvent = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this event?')) return;
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (!error) fetchEvents();
  };

  const G = '#00ff88';

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 font-['JetBrains_Mono'] selection:bg-[#00ff88] selection:text-black">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-white/10 pb-8">
        <div>
          <h1 className="text-3xl md:text-5xl font-black font-['Orbitron'] mb-2">Event <span className="text-[#00ff88]">Command Center</span></h1>
          <p className="text-zinc-500 text-sm">Manage upcoming hackathons, workshops, and sessions.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#00ff88] text-black font-bold rounded-lg hover:bg-[#00ff88]/80 hover:scale-105 transition-all"
        >
          <Plus size={18} /> New Event
        </button>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <div className="text-[#00ff88] animate-pulse">Loading database records...</div>
        ) : events.length === 0 ? (
          <div className="col-span-full py-12 text-center border border-dashed border-white/10 rounded-xl text-zinc-600">
            No events found in the database.
          </div>
        ) : (
          events.map((event) => (
            <div key={event.id} className={`relative p-6 rounded-xl border transition-all duration-300 ${event.is_active ? 'bg-zinc-950/50 border-[#00ff88]/20 hover:border-[#00ff88]/50' : 'bg-black/40 border-white/5 opacity-60'}`}>
              
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${event.is_active ? 'bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/20' : 'bg-zinc-800 text-zinc-400'}`}>
                  {event.event_type}
                </span>
                
                {/* Actions */}
                <div className="flex gap-2">
                  <button onClick={() => toggleActive(event.id, event.is_active)} className={`p-2 rounded-md transition-colors ${event.is_active ? 'bg-[#00ff88]/10 text-[#00ff88] hover:bg-[#00ff88]/20' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`} title={event.is_active ? "Deactivate" : "Activate"}>
                    <Power size={16} />
                  </button>
                  <button onClick={() => deleteEvent(event.id)} className="p-2 rounded-md bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-bold font-['Orbitron'] mb-4 line-clamp-2">{event.title}</h3>
              
              <div className="space-y-2 text-xs text-zinc-400 mb-6">
                <div className="flex items-center gap-2"><Calendar size={14} className="text-[#00ff88]"/> {event.event_date}</div>
                <div className="flex items-center gap-2"><Clock size={14} className="text-[#00ff88]"/> {event.time_string}</div>
                <div className="flex items-center gap-2"><MapPin size={14} className="text-[#00ff88]"/> {event.location}</div>
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-between items-center text-xs">
                <span className={event.is_active ? "text-[#00ff88]" : "text-zinc-600"}>
                  {event.is_active ? "🟢 Live on website" : "⚫ Hidden"}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-950 border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-xl font-bold font-['Orbitron'] text-white">Deploy New Event</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400 uppercase tracking-wider">Event Title</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-sm focus:border-[#00ff88] focus:outline-none text-white" placeholder="e.g. BIAS 48hr Hackathon" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400 uppercase tracking-wider">Event Type</label>
                  <select required value={formData.event_type} onChange={e => setFormData({...formData, event_type: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-sm focus:border-[#00ff88] focus:outline-none text-white">
                    <option>Hackathon</option>
                    <option>Workshop</option>
                    <option>Meetup</option>
                    <option>Competition</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400 uppercase tracking-wider">Date (Display)</label>
                  <input required type="text" value={formData.event_date} onChange={e => setFormData({...formData, event_date: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-sm focus:border-[#00ff88] focus:outline-none text-white" placeholder="e.g. MAR 15" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400 uppercase tracking-wider">Time String</label>
                  <input required type="text" value={formData.time_string} onChange={e => setFormData({...formData, time_string: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-sm focus:border-[#00ff88] focus:outline-none text-white" placeholder="e.g. 10:00 AM - 06:00 PM" />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs text-zinc-400 uppercase tracking-wider">Location</label>
                  <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-sm focus:border-[#00ff88] focus:outline-none text-white" placeholder="e.g. Main Auditorium / Online" />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs text-zinc-400 uppercase tracking-wider">Registration Link</label>
                  <input required type="url" value={formData.registration_link} onChange={e => setFormData({...formData, registration_link: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-sm focus:border-[#00ff88] focus:outline-none text-white" placeholder="https://..." />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs text-zinc-400 uppercase tracking-wider">Description</label>
                  <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-sm focus:border-[#00ff88] focus:outline-none text-white resize-none" placeholder="Brief details about the event..."></textarea>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-3 border-t border-white/10 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-sm text-zinc-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2 text-sm bg-[#00ff88] text-black font-bold rounded-lg hover:bg-[#00ff88]/80 transition-colors">Ship Event</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}