import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="max-w-5xl space-y-8 animate-fade-in">
      <header className="border-b border-[#00FF41]/30 pb-4">
        <h2 className="text-3xl font-semibold mb-2">&gt; System_Overview</h2>
        <p className="text-[#00FF41]/70 text-sm">Welcome back, root. All systems are operational.</p>
      </header>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-black border border-[#00FF41]/30 p-6 rounded-sm shadow-[0_0_10px_rgba(0,255,65,0.05)]">
          <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Total Deployments_</h3>
          <p className="text-4xl font-bold text-[#00FF41]">12</p>
          <p className="text-xs text-[#00FF41]/50 mt-2">+2 this month</p>
        </div>
        
        <div className="bg-black border border-[#00FF41]/30 p-6 rounded-sm shadow-[0_0_10px_rgba(0,255,65,0.05)]">
          <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Active Members_</h3>
          <p className="text-4xl font-bold text-[#00FF41]">104</p>
          <p className="text-xs text-[#00FF41]/50 mt-2">Database synced</p>
        </div>

        <div className="bg-black border border-[#00FF41]/30 p-6 rounded-sm shadow-[0_0_10px_rgba(0,255,65,0.05)]">
          <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Server Status_</h3>
          <p className="text-4xl font-bold text-[#00FF41] animate-pulse">ONLINE</p>
          <p className="text-xs text-[#00FF41]/50 mt-2">Latency: 12ms</p>
        </div>
      </div>

      {/* Quick Actions & Recent Logs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-200 border-b border-[#00FF41]/20 pb-2">./Quick_Actions</h3>
          <div className="flex flex-col gap-3">
            <Link href="/admin/events" className="group p-4 bg-black border border-[#00FF41]/30 hover:bg-[#00FF41]/10 hover:border-[#00FF41] transition-all flex justify-between items-center">
              <span>Create New Event</span>
              <span className="text-[#00FF41] group-hover:translate-x-1 transition-transform">-&gt;</span>
            </Link>
           <Link href="/admin/members" className="group p-4 bg-black border border-[#00FF41]/30 hover:bg-[#00FF41]/10 hover:border-[#00FF41] transition-all flex justify-between items-center">
  <span>Review Applications</span>
  <span className="text-[#00FF41] group-hover:translate-x-1 transition-transform">-&gt;</span>
</Link>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-200 border-b border-[#00FF41]/20 pb-2">./Recent_Logs</h3>
          <div className="bg-[#050505] border border-gray-800 p-4 font-mono text-sm space-y-2 h-48 overflow-y-auto">
            <p className="text-gray-400"><span className="text-[#00FF41]">[10:32:01]</span> INFO: Admin logged in.</p>
            <p className="text-gray-400"><span className="text-[#00FF41]">[09:15:44]</span> CRON: Database backup successful.</p>
            <p className="text-gray-400"><span className="text-yellow-500">[08:42:12]</span> WARN: High memory usage detected.</p>
            <p className="text-gray-400"><span className="text-[#00FF41]">[Yesterday]</span> INFO: New event "Web3 Workshop" deployed.</p>
            <p className="text-gray-400 animate-pulse">_</p>
          </div>
        </section>
      </div>
    </div>
  );
}