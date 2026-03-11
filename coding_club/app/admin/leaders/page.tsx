'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ManageLeaders() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const role = formData.get('role') as string;
    const category = formData.get('category') as string;
    const github_link = formData.get('github_link') as string;
    const file = formData.get('image') as File;

    try {
      // 1. Upload Image (Reusing your unlocked 'event-images' bucket for simplicity)
      const fileExt = file.name.split('.').pop();
      const fileName = `profile-${Math.random()}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('event-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 2. Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('event-images')
        .getPublicUrl(fileName);

      // 3. Save to the database
      const { error: dbError } = await supabase
        .from('leaders')
        .insert([{ name, role, category, image_url: publicUrl, github_link }]);

      if (dbError) throw dbError;

      alert('Personnel file successfully uploaded to mainframe.');
      (e.target as HTMLFormElement).reset();

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
        <h2 className="text-3xl font-semibold mb-2">&gt; Execute: Add_Personnel</h2>
        <p className="text-[#00FF41]/70 text-sm">Register new faculty advisors or core team members.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6 bg-black border border-[#00FF41]/30 p-8 rounded-sm shadow-[0_0_15px_rgba(0,255,65,0.1)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm uppercase tracking-wider text-[#00FF41]">Full Name_</label>
            <input type="text" name="name" required
              className="w-full bg-transparent border border-[#00FF41]/50 p-3 text-white focus:outline-none focus:border-[#00FF41] focus:ring-1 focus:ring-[#00FF41] transition-all"
              placeholder="e.g., Dr. Alan Turing"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm uppercase tracking-wider text-[#00FF41]">Designation/Role_</label>
            <input type="text" name="role" required
              className="w-full bg-transparent border border-[#00FF41]/50 p-3 text-white focus:outline-none focus:border-[#00FF41] transition-all"
              placeholder="e.g., Faculty Advisor"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm uppercase tracking-wider text-[#00FF41]">Hierarchy Level_</label>
            <select name="category" required
              className="w-full bg-black border border-[#00FF41]/50 p-3 text-white focus:outline-none focus:border-[#00FF41] transition-all appearance-none cursor-pointer">
              <option value="Student">Core Team (Student)</option>
              <option value="Faculty">Faculty Advisor</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm uppercase tracking-wider text-[#00FF41]">Profile Image_</label>
            <input type="file" name="image" accept="image/*" required
              className="w-full bg-transparent border border-[#00FF41]/50 p-2.5 text-sm text-[#00FF41]/70 file:mr-4 file:py-1 file:px-4 file:rounded-none file:border-0 file:text-sm file:font-semibold file:bg-[#00FF41] file:text-black hover:file:bg-[#00cc33] cursor-pointer"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm uppercase tracking-wider text-[#00FF41]">GitHub/LinkedIn URL (Optional)_</label>
          <input type="url" name="github_link"
            className="w-full bg-transparent border border-[#00FF41]/50 p-3 text-white focus:outline-none focus:border-[#00FF41] transition-all"
            placeholder="https://github.com/username"
          />
        </div>

        <button type="submit" disabled={loading}
          className="w-full md:w-auto px-8 py-3 bg-transparent border-2 border-[#00FF41] text-[#00FF41] hover:bg-[#00FF41] hover:text-black font-bold uppercase tracking-widest transition-all duration-300 disabled:opacity-50">
          {loading ? 'Processing...' : 'Deploy Profile'}
        </button>
      </form>
    </div>
  );
}