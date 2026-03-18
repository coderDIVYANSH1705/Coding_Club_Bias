'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Event {
  id: string;
  title: string;
  event_date: string;
  description: string;
  image_url: string;
  created_at?: string;
}

export default function ManageEvents() {
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Event>>({});

  // Fetch all events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch events';
      console.error(errorMessage);
      alert(`Error fetching events: ${errorMessage}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const date = formData.get('date') as string;
    const description = formData.get('description') as string;
    const file = formData.get('image') as File;

    try {
      let publicUrl = '';

      // Only upload image if a new file is provided
      if (file && file.size > 0) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('event-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl: url } } = supabase.storage
          .from('event-images')
          .getPublicUrl(fileName);
        
        publicUrl = url;
      }

      // Insert the event into database
      const { error: dbError } = await supabase
        .from('events')
        .insert([
          { title, event_date: date, description, image_url: publicUrl }
        ]);

      if (dbError) throw dbError;

      alert('Event successfully synchronized to the mainframe.');
      (e.target as HTMLFormElement).reset();
      fetchEvents(); // Refresh the list

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(errorMessage);
      alert(`System Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      alert('Event successfully purged from the system.');
      fetchEvents();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(errorMessage);
      alert(`Error deleting event: ${errorMessage}`);
    }
  };

  const handleEditStart = (event: Event) => {
    setEditingId(event.id);
    setEditData({
      title: event.title,
      event_date: event.event_date,
      description: event.description,
      image_url: event.image_url,
    });
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleEditSave = async (eventId: string) => {
    setLoading(true);

    try {
      const { error } = await supabase
        .from('events')
        .update({
          title: editData.title,
          event_date: editData.event_date,
          description: editData.description,
          image_url: editData.image_url,
        })
        .eq('id', eventId);

      if (error) throw error;

      alert('Event successfully updated in the system.');
      setEditingId(null);
      setEditData({});
      fetchEvents();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(errorMessage);
      alert(`Error updating event: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl space-y-8 animate-fade-in">
      {/* CREATE SECTION */}
      <header>
        <h2 className="text-3xl font-semibold mb-2">&gt; Execute: Upload_Event</h2>
        <p className="text-[#00FF41]/70 text-sm">Synchronize new event data to the public gallery.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6 bg-black border border-[#00FF41]/30 p-8 rounded-sm shadow-[0_0_15px_rgba(0,255,65,0.1)]">
        <div className="space-y-2">
          <label className="block text-sm uppercase tracking-wider text-[#00FF41]">Event Title_</label>
          <input 
            type="text" 
            name="title"
            required
            className="w-full bg-transparent border border-[#00FF41]/50 p-3 text-white focus:outline-none focus:border-[#00FF41] focus:ring-1 focus:ring-[#00FF41] transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm uppercase tracking-wider text-[#00FF41]">Date_</label>
            <input 
              type="date" 
              name="date"
              required
              className="w-full bg-transparent border border-[#00FF41]/50 p-3 text-white focus:outline-none focus:border-[#00FF41] transition-all color-scheme-dark"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm uppercase tracking-wider text-[#00FF41]">Event Image_</label>
            <input 
              type="file" 
              name="image"
              accept="image/*"
              required
              className="w-full bg-transparent border border-[#00FF41]/50 p-2.5 text-sm text-[#00FF41]/70 file:mr-4 file:py-1 file:px-4 file:rounded-none file:border-0 file:text-sm file:font-semibold file:bg-[#00FF41] file:text-black hover:file:bg-[#00cc33] cursor-pointer"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm uppercase tracking-wider text-[#00FF41]">Description_</label>
          <textarea 
            rows={4} 
            name="description"
            required
            className="w-full bg-transparent border border-[#00FF41]/50 p-3 text-white focus:outline-none focus:border-[#00FF41] transition-all"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full md:w-auto px-8 py-3 bg-transparent border-2 border-[#00FF41] text-[#00FF41] hover:bg-[#00FF41] hover:text-black font-bold uppercase tracking-widest transition-all duration-300 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Deploy Event'}
        </button>
      </form>

      {/* READ & MANAGE SECTION */}
      <div className="space-y-6">
        <header>
          <h2 className="text-3xl font-semibold mb-2">&gt; Query: List_All_Events</h2>
          <p className="text-[#00FF41]/70 text-sm">Browse and manage existing events in the database.</p>
        </header>

        {events.length === 0 ? (
          <p className="text-[#00FF41]/50 italic py-8">No events found in the system.</p>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-black border border-[#00FF41]/30 p-6 rounded-sm hover:border-[#00FF41] transition-all"
              >
                {editingId === event.id ? (
                  // EDIT MODE
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-[#00FF41] mb-2">Title_</label>
                        <input
                          type="text"
                          value={editData.title || ''}
                          onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                          className="w-full bg-transparent border border-[#00FF41]/50 p-2 text-white focus:outline-none focus:border-[#00FF41] transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-[#00FF41] mb-2">Date_</label>
                        <input
                          type="date"
                          value={editData.event_date || ''}
                          onChange={(e) => setEditData({ ...editData, event_date: e.target.value })}
                          className="w-full bg-transparent border border-[#00FF41]/50 p-2 text-white focus:outline-none focus:border-[#00FF41] transition-all text-sm color-scheme-dark"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#00FF41] mb-2">Description_</label>
                      <textarea
                        rows={3}
                        value={editData.description || ''}
                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                        className="w-full bg-transparent border border-[#00FF41]/50 p-2 text-white focus:outline-none focus:border-[#00FF41] transition-all text-sm"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEditSave(event.id)}
                        disabled={loading}
                        className="flex-1 px-4 py-2 bg-[#00FF41] text-black font-bold uppercase text-sm tracking-widest hover:bg-[#00cc33] transition-all disabled:opacity-50"
                      >
                        {loading ? 'Saving...' : 'Save_Changes'}
                      </button>
                      <button
                        onClick={handleEditCancel}
                        disabled={loading}
                        className="flex-1 px-4 py-2 bg-transparent border border-[#00FF41] text-[#00FF41] font-bold uppercase text-sm tracking-widest hover:bg-[#00FF41]/10 transition-all disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // VIEW MODE
                  <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1">{event.title}</h3>
                      <p className="text-xs text-[#00FF41] mb-2">[{event.event_date}]</p>
                      <p className="text-sm text-gray-400 line-clamp-2">{event.description}</p>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                      <button
                        onClick={() => handleEditStart(event)}
                        className="flex-1 md:flex-none px-4 py-2 bg-transparent border border-[#00FF41] text-[#00FF41] font-bold uppercase text-xs tracking-widest hover:bg-[#00FF41]/10 transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="flex-1 md:flex-none px-4 py-2 bg-transparent border border-red-500 text-red-500 font-bold uppercase text-xs tracking-widest hover:bg-red-500/10 transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}