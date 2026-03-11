import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function AdminLogin() {
  
  // This Server Action runs securely on the backend
  async function handleLogin(formData: FormData) {
    'use server';
    
    const id = formData.get('admin_id');
    const password = formData.get('admin_pass');

    // Securely retrieve credentials from your .env.local vault
    const CORRECT_ID = process.env.ADMIN_ID;
    const CORRECT_PASS = process.env.ADMIN_PASS;

    // Failsafe: Prevent login if environment variables are missing
    if (!CORRECT_ID || !CORRECT_PASS) {
      console.error("CRITICAL ERR: Admin credentials missing from environment variables.");
      redirect('/admin/login?error=server_config');
    }

    // Verify credentials
    if (id === CORRECT_ID && password === CORRECT_PASS) {
      // Grant clearance: Set the secure auth cookie
      const cookieStore = await cookies();
      cookieStore.set('admin_auth', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only requires HTTPS in production
        maxAge: 60 * 60 * 24, // Cookie expires in 1 day
        path: '/',
      });
      
      // Redirect to the mainframe
      redirect('/admin');
    } else {
      // Access denied
      redirect('/admin/login?error=invalid_credentials');
    }
  }

  return (
    <div className="min-h-screen bg-black text-[#00FF41] flex items-center justify-center font-mono p-4">
      <div className="w-full max-w-md border border-[#00FF41]/30 p-8 shadow-[0_0_20px_rgba(0,255,65,0.1)] bg-[#050505]">
        <h1 className="text-2xl font-bold mb-6 tracking-tighter uppercase">&gt; System_Login</h1>
        
        <form action={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-widest text-[#00FF41]/70">Admin_ID</label>
            <input 
              type="text" 
              name="admin_id"
              required
              className="w-full bg-transparent border border-[#00FF41]/50 p-3 text-white focus:outline-none focus:border-[#00FF41] focus:ring-1 focus:ring-[#00FF41] transition-all"
              autoComplete="off"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-widest text-[#00FF41]/70">Password</label>
            <input 
              type="password" 
              name="admin_pass"
              required
              className="w-full bg-transparent border border-[#00FF41]/50 p-3 text-white focus:outline-none focus:border-[#00FF41] focus:ring-1 focus:ring-[#00FF41] transition-all"
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-3 bg-transparent border-2 border-[#00FF41] text-[#00FF41] hover:bg-[#00FF41] hover:text-black font-bold uppercase tracking-widest transition-all duration-300"
          >
            Authenticate
          </button>
        </form>
      </div>
    </div>
  );
}