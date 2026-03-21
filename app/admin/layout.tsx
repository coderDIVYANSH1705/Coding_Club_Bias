import Link from 'next/link';
import UpcomingEvents from '../../Components/UpcomingEvents';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-[#00FF41] flex flex-col md:flex-row font-mono">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[#00FF41]/30 p-6 flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tighter uppercase">
            &gt; Root_Access
          </h1>
          <p className="text-xs text-[#00FF41]/70 mt-1">Coding Club System v1.0</p>
        </div>
        
        <nav className="flex flex-col gap-4">
          <Link href="/admin" className="hover:bg-[#00FF41]/10 px-3 py-2 rounded transition-colors duration-200">
            ~/dashboard
          </Link>
          <Link href="/admin/events" className="bg-[#00FF41]/10 px-3 py-2 rounded border-l-2 border-[#00FF41]">
            ~/manage_events
          </Link>
          {/* Room to add more later */}
        <Link href="/admin/members" className="hover:bg-[#00FF41]/10 px-3 py-2 rounded transition-colors duration-200">
  ~/manage_users
</Link>
          <Link href="/admin/settings" className="hover:bg-[#00FF41]/10 px-3 py-2 rounded transition-colors duration-200 text-gray-500 pointer-events-none">
            ~/system_config (coming soon)
          </Link>
          <Link href="/admin/leaders" className="hover:bg-[#00FF41]/10 px-3 py-2 rounded transition-colors duration-200">
  ~/manage_leaders
</Link>
 <Link href="/admin/future" className="hover:bg-[#00FF41]/10 px-3 py-2 rounded transition-colors duration-200">
            ~/upcoming
          </Link>



        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 bg-[#050505]">
        {children}
      </main>
    </div>
  );
}