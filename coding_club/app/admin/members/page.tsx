'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Member {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  branch_year: string;
  reason: string;
  created_at?: string;
}

export default function ManageMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Member>>({});

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch members';
      console.error(errorMessage);
      alert(`Error fetching members: ${errorMessage}`);
    }
  };

  const handleEditStart = (member: Member) => {
    setEditingId(member.id);
    setEditData({
      full_name: member.full_name,
      email: member.email,
      phone: member.phone,
      branch_year: member.branch_year,
      reason: member.reason,
    });
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleEditSave = async (memberId: string) => {
    setLoading(true);

    try {
      const { error } = await supabase
        .from('members')
        .update({
          full_name: editData.full_name,
          email: editData.email,
          phone: editData.phone,
          branch_year: editData.branch_year,
          reason: editData.reason,
        })
        .eq('id', memberId);

      if (error) throw error;

      alert('Member information successfully updated in the system.');
      setEditingId(null);
      setEditData({});
      fetchMembers();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(errorMessage);
      alert(`Error updating member: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (memberId: string) => {
    if (!window.confirm('Are you sure you want to remove this member from the database?')) return;

    try {
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      alert('Member successfully purged from the system.');
      fetchMembers();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(errorMessage);
      alert(`Error deleting member: ${errorMessage}`);
    }
  };

  return (
    <div className="max-w-6xl space-y-8 animate-fade-in">
      <header>
        <h2 className="text-3xl font-semibold mb-2">&gt; Execute: Read_Applications</h2>
        <p className="text-[#00FF41]/70 text-sm">Review and manage access requests for the coding club.</p>
      </header>

      {members.length === 0 ? (
        <div className="bg-black border border-[#00FF41]/30 p-8 text-center">
          <p className="text-[#00FF41]/50 italic">No pending applications found in the database.</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          {members.map((member) => (
            <div
              key={member.id}
              className="bg-black border border-[#00FF41]/30 p-6 rounded-sm hover:border-[#00FF41] transition-all"
            >
              {editingId === member.id ? (
                // EDIT MODE
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#00FF41] mb-2">Full Name_</label>
                      <input
                        type="text"
                        value={editData.full_name || ''}
                        onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
                        className="w-full bg-transparent border border-[#00FF41]/50 p-2 text-white focus:outline-none focus:border-[#00FF41] transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#00FF41] mb-2">Email_</label>
                      <input
                        type="email"
                        value={editData.email || ''}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                        className="w-full bg-transparent border border-[#00FF41]/50 p-2 text-white focus:outline-none focus:border-[#00FF41] transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#00FF41] mb-2">Phone_</label>
                      <input
                        type="tel"
                        value={editData.phone || ''}
                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                        className="w-full bg-transparent border border-[#00FF41]/50 p-2 text-white focus:outline-none focus:border-[#00FF41] transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#00FF41] mb-2">Branch/Year_</label>
                      <input
                        type="text"
                        value={editData.branch_year || ''}
                        onChange={(e) => setEditData({ ...editData, branch_year: e.target.value })}
                        className="w-full bg-transparent border border-[#00FF41]/50 p-2 text-white focus:outline-none focus:border-[#00FF41] transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#00FF41] mb-2">Reason_</label>
                    <textarea
                      rows={2}
                      value={editData.reason || ''}
                      onChange={(e) => setEditData({ ...editData, reason: e.target.value })}
                      className="w-full bg-transparent border border-[#00FF41]/50 p-2 text-white focus:outline-none focus:border-[#00FF41] transition-all text-sm"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEditSave(member.id)}
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
                <div className="space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs text-[#00FF41] font-mono">#{member.id.toString().padStart(4, '0')}</span>
                        <h3 className="text-lg font-bold text-white">{member.full_name}</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-400">
                        <div>
                          <span className="text-[#00FF41]/70">Email:</span> <a href={`mailto:${member.email}`} className="text-[#00FF41] hover:underline">{member.email}</a>
                        </div>
                        <div>
                          <span className="text-[#00FF41]/70">Phone:</span> <a href={`tel:${member.phone}`} className="text-[#00FF41] hover:underline">{member.phone}</a>
                        </div>
                        <div className="col-span-1 md:col-span-2">
                          <span className="text-[#00FF41]/70">Branch/Year:</span> {member.branch_year}
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs text-[#00FF41]/70 mb-1">Reason:</p>
                        <p className="text-sm text-gray-400 line-clamp-2">{member.reason}</p>
                      </div>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                      <button
                        onClick={() => handleEditStart(member)}
                        className="flex-1 md:flex-none px-4 py-2 bg-transparent border border-[#00FF41] text-[#00FF41] font-bold uppercase text-xs tracking-widest hover:bg-[#00FF41]/10 transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="flex-1 md:flex-none px-4 py-2 bg-transparent border border-red-500 text-red-500 font-bold uppercase text-xs tracking-widest hover:bg-red-500/10 transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}