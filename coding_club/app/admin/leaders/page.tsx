'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

type Leader = {
  id: number;
  name: string;
  role: string;
  category: string;
  image_url: string;
  github_link: string | null;
};

export default function ManageLeaders() {
  const [loading, setLoading] = useState(false);
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Leader>>({});

  // Fetch leaders on mount
  useEffect(() => {
    fetchLeaders();
  }, []);

  const fetchLeaders = async () => {
    try {
      const { data, error } = await supabase
        .from('leaders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeaders(data || []);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error fetching leaders:', errorMessage);
    }
  };

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
      let imageUrl = '';

      // Upload image if provided
      if (file && file.size > 0) {
        const fileExt = file.name.split('.').pop();
        const fileName = `profile-${Math.random()}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('event-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('event-images')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      // Save to database
      const { error: dbError } = await supabase
        .from('leaders')
        .insert([{ name, role, category, image_url: imageUrl, github_link }]);

      if (dbError) throw dbError;

      alert('Personnel file successfully uploaded to mainframe.');
      (e.target as HTMLFormElement).reset();
      fetchLeaders();

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(error);
      alert(`System Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this personnel file?')) return;

    try {
      const { error } = await supabase
        .from('leaders')
        .delete()
        .eq('id', id);

      if (error) throw error;
      alert('Personnel file successfully removed.');
      fetchLeaders();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(error);
      alert(`Error: ${errorMessage}`);
    }
  };

  const handleEditStart = (leader: Leader) => {
    setEditingId(leader.id);
    setEditData(leader);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleEditSubmit = async () => {
    if (!editingId) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('leaders')
        .update({
          name: editData.name,
          role: editData.role,
          category: editData.category,
          github_link: editData.github_link,
        })
        .eq('id', editingId);

      if (error) throw error;
      alert('Personnel file successfully updated.');
      setEditingId(null);
      setEditData({});
      fetchLeaders();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(error);
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl space-y-8 animate-fade-in">
      <header>
        <h2 className="text-3xl font-semibold mb-2">&gt; Execute: Manage_Personnel</h2>
        <p className="text-[#00FF41]/70 text-sm">Add, update, or remove faculty advisors and core team members.</p>
      </header>

      {/* Add New Leader Form */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-black border border-[#00FF41]/30 p-8 rounded-sm shadow-[0_0_15px_rgba(0,255,65,0.1)]">
        <h3 className="text-xl font-semibold text-[#00FF41]">&gt; Add_New_Personnel</h3>
        
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

      {/* Leaders List */}
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-[#00FF41]">&gt; Current_Personnel ({leaders.length})</h3>
        
        {leaders.length === 0 ? (
          <p className="text-[#00FF41]/70">No personnel records found.</p>
        ) : (
          <div className="space-y-4">
            {leaders.map((leader) => (
              <div key={leader.id} className="bg-black border border-[#00FF41]/30 p-6 rounded-sm hover:shadow-[0_0_20px_rgba(0,255,65,0.1)] transition-shadow">
                {editingId === leader.id ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={editData.name || ''}
                        onChange={(e) => setEditData({...editData, name: e.target.value})}
                        className="bg-transparent border border-[#00FF41]/50 p-2 text-white focus:outline-none focus:border-[#00FF41]"
                        placeholder="Name"
                      />
                      <input
                        type="text"
                        value={editData.role || ''}
                        onChange={(e) => setEditData({...editData, role: e.target.value})}
                        className="bg-transparent border border-[#00FF41]/50 p-2 text-white focus:outline-none focus:border-[#00FF41]"
                        placeholder="Role"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <select
                        value={editData.category || ''}
                        onChange={(e) => setEditData({...editData, category: e.target.value})}
                        className="bg-black border border-[#00FF41]/50 p-2 text-white focus:outline-none focus:border-[#00FF41]"
                      >
                        <option value="Student">Core Team (Student)</option>
                        <option value="Faculty">Faculty Advisor</option>
                      </select>
                      <input
                        type="url"
                        value={editData.github_link || ''}
                        onChange={(e) => setEditData({...editData, github_link: e.target.value})}
                        className="bg-transparent border border-[#00FF41]/50 p-2 text-white focus:outline-none focus:border-[#00FF41]"
                        placeholder="GitHub URL"
                      />
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={handleEditSubmit}
                        disabled={loading}
                        className="px-6 py-2 bg-[#00FF41] text-black font-bold uppercase text-sm transition-all disabled:opacity-50"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleEditCancel}
                        className="px-6 py-2 border border-[#00FF41]/50 text-[#00FF41] font-bold uppercase text-sm transition-all hover:border-[#00FF41]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-white mb-1">{leader.name}</h4>
                      <p className="text-[#00FF41] text-sm font-semibold mb-2">{leader.role}</p>
                      <p className="text-[#00FF41]/60 text-xs uppercase tracking-wider mb-2">{leader.category}</p>
                      {leader.github_link && (
                        <a href={leader.github_link} target="_blank" rel="noopener noreferrer" className="text-[#00FF41] hover:underline text-sm">
                          [ View_Profile ]
                        </a>
                      )}
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                      <button
                        onClick={() => handleEditStart(leader)}
                        className="flex-1 md:flex-none px-6 py-2 bg-transparent border border-[#00FF41]/50 text-[#00FF41] font-bold uppercase text-xs transition-all hover:border-[#00FF41] hover:shadow-[0_0_10px_rgba(0,255,65,0.3)]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(leader.id)}
                        className="flex-1 md:flex-none px-6 py-2 bg-transparent border border-red-500/50 text-red-500 font-bold uppercase text-xs transition-all hover:border-red-500 hover:shadow-[0_0_10px_rgba(255,0,0,0.3)]"
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