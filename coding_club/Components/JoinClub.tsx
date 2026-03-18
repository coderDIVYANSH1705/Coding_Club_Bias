'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function JoinClubForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    const formData = new FormData(e.currentTarget);
    const full_name = formData.get('full_name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const branch_year = formData.get('branch_year') as string;
    const reason = formData.get('reason') as string;

    try {
      const { error } = await supabase
        .from('members')
        .insert([{ full_name, email, phone, branch_year, reason }]);

      if (error) throw error;
      
      setStatus('success');
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <section id="join" className="w-full bg-black text-white font-mono py-12 md:py-24 px-6 md:px-12 border-t border-[#00FF41]/20">
      <div className="max-w-3xl mx-auto space-y-8">
        <header>
          <h2 className="text-3xl md:text-4xl font-bold text-[#00FF41] tracking-tighter">
            &gt; init_recruitment
          </h2>
          <p className="mt-2 text-gray-400">Request access to the mainframe. We are currently accepting applications for new members.</p>
        </header>

        {status === 'success' ? (
          <div className="p-6 border border-[#00FF41] bg-[#00FF41]/10 text-[#00FF41]">
            <p className="font-bold">SUCCESS: Application received.</p>
            <p className="text-sm mt-2">Your data has been securely transmitted. Admins will review your request shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 border border-[#00FF41]/30 p-8 bg-[#050505] shadow-[0_0_15px_rgba(0,255,65,0.05)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm uppercase tracking-wider text-[#00FF41]">Full Name_</label>
                <input type="text" name="full_name" required
                  className="w-full bg-transparent border border-[#00FF41]/50 p-3 text-white focus:outline-none focus:border-[#00FF41] transition-all"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm uppercase tracking-wider text-[#00FF41]">College Email_</label>
                <input type="email" name="email" required
                  className="w-full bg-transparent border border-[#00FF41]/50 p-3 text-white focus:outline-none focus:border-[#00FF41] transition-all"
                  placeholder="student@college.edu"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm uppercase tracking-wider text-[#00FF41]">Phone Number_</label>
                <input type="tel" name="phone" required
                  className="w-full bg-transparent border border-[#00FF41]/50 p-3 text-white focus:outline-none focus:border-[#00FF41] transition-all"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm uppercase tracking-wider text-[#00FF41]">Branch & Year_</label>
                <input type="text" name="branch_year" required
                  className="w-full bg-transparent border border-[#00FF41]/50 p-3 text-white focus:outline-none focus:border-[#00FF41] transition-all"
                  placeholder="e.g., B.Tech 2nd Year - Computer Science"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm uppercase tracking-wider text-[#00FF41]">Why join us?_</label>
              <textarea name="reason" rows={3} required
                className="w-full bg-transparent border border-[#00FF41]/50 p-3 text-white focus:outline-none focus:border-[#00FF41] transition-all"
                placeholder="What skills do you bring to the terminal?"
              />
            </div>

            <button type="submit" disabled={status === 'loading'}
              className="w-full px-8 py-3 bg-transparent border-2 border-[#00FF41] text-[#00FF41] hover:bg-[#00FF41] hover:text-black font-bold uppercase tracking-widest transition-all duration-300 disabled:opacity-50">
              {status === 'loading' ? 'Transmitting...' : 'Submit Data'}
            </button>
            
            {status === 'error' && (
              <p className="text-red-500 text-sm">ERR: Connection failed. Try again.</p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}