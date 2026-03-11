import { supabase } from '@/lib/supabase';

export const revalidate = 0; // Ensures the admin panel always fetches fresh data

export default async function ManageMembers() {
  // Fetch all applicants from the database
  const { data: members, error } = await supabase
    .from('members')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching members:", error);
  }

  const applicants = members || [];

  return (
    <div className="max-w-5xl space-y-8 animate-fade-in">
      <header>
        <h2 className="text-3xl font-semibold mb-2">&gt; Execute: Read_Applications</h2>
        <p className="text-[#00FF41]/70 text-sm">Review access requests for the coding club.</p>
      </header>

      <div className="bg-black border border-[#00FF41]/30 overflow-hidden shadow-[0_0_15px_rgba(0,255,65,0.05)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#00FF41]/30 bg-[#00FF41]/5 text-[#00FF41]">
                <th className="p-4 uppercase text-sm tracking-wider font-semibold">User_ID</th>
                <th className="p-4 uppercase text-sm tracking-wider font-semibold">Name</th>
                <th className="p-4 uppercase text-sm tracking-wider font-semibold">Branch/Year</th>
                <th className="p-4 uppercase text-sm tracking-wider font-semibold">Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#00FF41]/10 text-gray-300">
              {applicants.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-[#00FF41]/50 italic">
                    No pending applications found in the database.
                  </td>
                </tr>
              ) : (
                applicants.map((member) => (
                  <tr key={member.id} className="hover:bg-[#00FF41]/5 transition-colors">
                    <td className="p-4 font-mono text-xs text-[#00FF41]">#{member.id.toString().padStart(4, '0')}</td>
                    <td className="p-4">
                      <div className="font-semibold text-white">{member.full_name}</div>
                    </td>
                    <td className="p-4 text-sm text-gray-400">{member.branch_year}</td>
                    <td className="p-4">
                      <a href={`mailto:${member.email}`} className="text-[#00FF41] hover:underline text-sm">
                        {member.email}
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}