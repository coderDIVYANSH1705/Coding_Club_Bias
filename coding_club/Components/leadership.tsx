import Image from 'next/image';
import { supabase } from '@/lib/supabase';

// Define the TypeScript shape for our data
type Leader = {
  id: number;
  name: string;
  role: string;
  category: string;
  image_url: string;
  github_link: string | null;
};

export default async function LeadershipSection() {
  // Fetch all leaders
  const { data, error } = await supabase
    .from('leaders')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error("Error fetching leaders:", error);
  }

  const leaders: Leader[] = data || [];
  
  // Split the data into two groups
  const faculty = leaders.filter(l => l.category === 'Faculty');
  const students = leaders.filter(l => l.category === 'Student');

  if (leaders.length === 0) return null; // Hide section if db is empty

  return (
    <section id="leadership" className="w-full bg-[#020202] text-white font-mono py-16 md:py-24 px-6 md:px-12 border-t border-[#00FF41]/10">
      <div className="max-w-7xl mx-auto space-y-16">
        
        <header className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-[#00FF41] tracking-tighter">
            ./Faculty_Coordinators
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            The architects and operators behind the BIAS Coding Club mainframe.
          </p>
        </header>

        {/* Faculty Section - Shown larger/centered if they exist */}
        {faculty.length > 0 && (
          <div className="space-y-8">
            <h3 className="text-2xl border-b border-[#00FF41]/20 pb-2 text-gray-300 inline-block">
              &gt; Faculty Coordinators
            </h3>
            <div className="flex flex-wrap justify-center gap-8">
              {faculty.map(leader => (
                 <div key={leader.id} className="w-full max-w-sm">
                   <LeaderCard leader={leader} />
                 </div>
              ))}
            </div>
          </div>
        )}

        {/* Students Section */}
        {students.length > 0 && (
          <div className="space-y-8">
            <h3 className="text-2xl border-b border-[#00FF41]/20 pb-2 text-gray-300 inline-block">
              &gt; Student Coordinators
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {students.map(leader => (
                <LeaderCard key={leader.id} leader={leader} />
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

// Reusable ID Card Component pulled out for cleaner code
function LeaderCard({ leader }: { leader: Leader }) {
  return (
    <div className="group relative border border-[#00FF41]/20 bg-[#050505] overflow-hidden hover:border-[#00FF41] hover:shadow-[0_0_25px_rgba(0,255,65,0.15)] transition-all duration-500 flex flex-col items-center p-6 text-center h-full">
      {/* Decorative Terminal Corners */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00FF41] opacity-50"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#00FF41] opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#00FF41] opacity-50"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#00FF41] opacity-50"></div>

      <div className="relative w-32 h-32 md:w-40 md:h-40 mb-4 rounded-full overflow-hidden border-2 border-[#00FF41]/30 group-hover:border-[#00FF41] transition-colors duration-500">
        <div className="absolute inset-0 bg-[#00FF41]/20 group-hover:bg-transparent transition-colors duration-500 z-10 mix-blend-overlay"></div>
        <Image 
          src={leader.image_url} 
          alt={leader.name}
          fill
          unoptimized={true} // <-- The Fix
          className="object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out"
        />
      </div>
      
      <h3 className="text-xl font-bold text-gray-100 mb-1">{leader.name}</h3>
      <p className="text-[#00FF41] text-xs uppercase tracking-widest font-bold mb-4">
        {leader.role}
      </p>

      {leader.github_link && (
        <a 
          href={leader.github_link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-auto text-gray-500 hover:text-[#00FF41] transition-colors duration-300 text-sm border-b border-transparent hover:border-[#00FF41]"
        >
          [ View_Profile ]
        </a>
      )}
    </div>
  );
}