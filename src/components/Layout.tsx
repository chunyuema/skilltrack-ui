import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { User, Briefcase, BarChart2, Layers, Users, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../hooks/useAuth';

export default function Layout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-bg-dark flex flex-col md:flex-row text-slate-300">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-bg-card text-slate-400 flex-shrink-0 flex flex-col border-r border-slate-800/60">
        <div className="p-8">
          <div className="flex items-center gap-3 text-white">
            <div className="w-9 h-9 bg-sky-600 rounded flex items-center justify-center shadow-lg shadow-sky-900/40">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">SkillTrack</span>
          </div>
        </div>
        
        <nav className="p-4 space-y-1.5 flex-1">
          <NavItem to="/profile" icon={<User size={18} />} label="Profile" />
          <NavItem to="/experience" icon={<Briefcase size={18} />} label="Experience" />
          <NavItem to="/skills" icon={<BarChart2 size={18} />} label="Skills Matrix" />
          <div className="pt-6 mt-6 border-t border-slate-800/80">
            <p className="px-4 text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] mb-4 font-mono">Community</p>
            <NavItem to="/directory" icon={<Users size={18} />} label="Member Directory" />
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800/80 space-y-4">
          <div className="px-4 py-3 bg-slate-900/50 rounded border border-slate-800/50">
            <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest font-mono mb-1">Logged in as</p>
            <p className="text-sm text-sky-400 truncate font-bold font-mono" title={user || ''}>{user}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded text-slate-500 hover:bg-slate-800 hover:text-white transition-all duration-200 font-mono text-xs uppercase font-bold tracking-wider"
          >
            <LogOut size={16} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto bg-bg-dark">
        <div className="max-w-5xl mx-auto p-6 md:p-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-4 py-2.5 rounded transition-all duration-200 text-[11px] font-bold font-mono tracking-widest uppercase",
          isActive
            ? "bg-sky-500/10 text-sky-400 border-l-2 border-sky-500 pl-[14px]"
            : "hover:bg-slate-800/50 hover:text-slate-200 text-slate-500"
        )
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}
