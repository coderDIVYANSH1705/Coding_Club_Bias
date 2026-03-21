import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#050505] text-white font-mono border-t border-[#00FF41]/20 pt-16 pb-8 px-6 md:px-12 relative overflow-hidden">
      
      {/* Subtle background grid overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#00FF41 1px, transparent 1px), linear-gradient(90deg, #00FF41 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col gap-12 relative z-10">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-[#00FF41] tracking-tight whitespace-nowrap">
                &lt;CodeClub /&gt;
              </span>
              <span className="text-[10px] text-gray-400 tracking-widest uppercase mt-1">
                Birla Institute of Applied Sciences
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Building the future, one line of code at a time. Join the terminal and push your limits.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-[#00FF41] text-sm uppercase tracking-widest font-bold mb-4">
              ./Directory
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <a href="#about" className="group flex items-center gap-2 hover:text-[#00FF41] transition-colors duration-300">
                  <span className="text-[#00FF41] opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">&gt;</span> 
                  About_Us
                </a>
              </li>
              <li>
                <a href="#gallery" className="group flex items-center gap-2 hover:text-[#00FF41] transition-colors duration-300">
                  <span className="text-[#00FF41] opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">&gt;</span> 
                  System_Logs (Events)
                </a>
              </li>
              <li>
                <a href="#leadership" className="group flex items-center gap-2 hover:text-[#00FF41] transition-colors duration-300">
                  <span className="text-[#00FF41] opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">&gt;</span> 
                  Command_Team
                </a>
              </li>
              <li>
                <Link href="/admin/login" className="group flex items-center gap-2 hover:text-[#00FF41] transition-colors duration-300">
                  <span className="text-[#00FF41] opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">&gt;</span> 
                  Root_Access
                </Link>
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div className="space-y-4">
            <h4 className="text-[#00FF41] text-sm uppercase tracking-widest font-bold mb-4">
              ./Network
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <a href="https://github.com/biascodingclub" className="group flex items-center gap-2 hover:text-white transition-colors duration-300">
                  <span className="text-[#00FF41] opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">#</span> 
                  GitHub
                </a>
              </li>
            
            </ul>
          </div>

          {/* System Status Widget */}
          <div className="h-full flex items-end">
            <div className="w-full border border-[#00FF41]/20 p-5 bg-black relative group hover:border-[#00FF41]/50 transition-colors duration-500">
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00FF41] opacity-50"></div>
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#00FF41] opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#00FF41] opacity-50"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#00FF41] opacity-50"></div>
              
              <h4 className="text-gray-500 text-[10px] uppercase tracking-widest mb-3 border-b border-[#00FF41]/10 pb-2">
                Server_Diagnostics
              </h4>
              <div className="flex items-center gap-3 text-sm mb-2">
                <div className="w-2.5 h-2.5 bg-[#00FF41] rounded-full animate-pulse shadow-[0_0_10px_#00FF41]"></div>
                <span className="text-[#00FF41] font-bold tracking-wider text-xs">ONLINE</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-500 uppercase tracking-wider mt-4">
                <p>Ping: <span className="text-gray-300">12ms</span></p>
                <p>Uptime: <span className="text-gray-300">99.9%</span></p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-[#00FF41]/20 text-xs text-gray-600">
          <p>
            © {currentYear} BIAS Coding Club. Execute local environment.
          </p>
          <Link href="/components/team">
    <span className="text-[#00FF41] font-bold cursor-pointer hover:underline">
      Divyansh & the Core Team
    </span>
  </Link>
        </div>

      </div>
    </footer>
  );
}