'use client';
import { useState } from 'react';

export default function ManageEvents() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // Here you would handle the actual FormData and send it to your API/Database
    // const formData = new FormData(e.currentTarget);
    setTimeout(() => {
      setLoading(false);
      alert('Event successfully synchronized to the mainframe.');
    }, 1000);
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
            required
            className="w-full bg-transparent border border-[#00FF41]/50 p-3 text-white focus:outline-none focus:border-[#00FF41] focus:ring-1 focus:ring-[#00FF41] transition-all"
            placeholder="e.g., Hackathon 2026"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm uppercase tracking-wider text-[#00FF41]">Date_</label>
            <input 
              type="date" 
              required
              className="w-full bg-transparent border border-[#00FF41]/50 p-3 text-white focus:outline-none focus:border-[#00FF41] transition-all color-scheme-dark"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm uppercase tracking-wider text-[#00FF41]">Event Image_</label>
            <input 
              type="file" 
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
            required
            className="w-full bg-transparent border border-[#00FF41]/50 p-3 text-white focus:outline-none focus:border-[#00FF41] transition-all"
            placeholder="Enter event details, rules, or wrap-up summary..."
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