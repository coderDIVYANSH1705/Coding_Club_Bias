'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ManageEvents() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const date = formData.get('date') as string;
    const description = formData.get('description') as string;
    const file = formData.get('image') as File;

    try {
      // 1. Upload the Image to the 'event-images' bucket
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('event-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 2. Get the public URL of the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('event-images')
        .getPublicUrl(fileName);

      // 3. Save the text data + image URL into the 'events' database table
      const { error: dbError } = await supabase
        .from('events')
        .insert([
          { title, event_date: date, description, image_url: publicUrl }
        ]);

      if (dbError) throw dbError;

      alert('Event successfully synchronized to the mainframe.');
      (e.target as HTMLFormElement).reset(); // Clear the form

    } catch (error: any) {
      console.error(error);
      alert(`System Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-8 animate-fade-in">
      <header>
        <h2 className="text-3xl font-semibold mb-2">&gt; Execute: Upload_Event</h2>
        <p className="text-[#00FF41]/70 text-sm">Synchronize new event data to the public gallery.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6 bg-black border border-[#00FF41]/30 p-8 rounded-sm shadow-[0_0_15px_rgba(0,255,65,0.1)]">
        <div className="space-y-2">
          <label className="block text-sm uppercase tracking-wider text-[#00FF41]">Event Title_</label>
          <input 
            type="text" 
            name="title" // Added name
            required
            className="w-full bg-transparent border border-[#00FF41]/50 p-3 text-white focus:outline-none focus:border-[#00FF41] focus:ring-1 focus:ring-[#00FF41] transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm uppercase tracking-wider text-[#00FF41]">Date_</label>
            <input 
              type="date" 
              name="date" // Added name
              required
              className="w-full bg-transparent border border-[#00FF41]/50 p-3 text-white focus:outline-none focus:border-[#00FF41] transition-all color-scheme-dark"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm uppercase tracking-wider text-[#00FF41]">Event Image_</label>
            <input 
              type="file" 
              name="image" // Added name
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
            name="description" // Added name
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
    </div>
  );
}