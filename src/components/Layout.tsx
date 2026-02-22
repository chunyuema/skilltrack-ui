import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { User, Briefcase, BarChart2, Layers, Users } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex-shrink-0">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white">
            <Layers className="w-6 h-6 text-indigo-400" />
            <span className="text-xl font-bold tracking-tight">SkillTrack</span>
          </div>
        </div>
        
        <nav className="p-4 space-y-1">
          <NavItem to="/" icon={<User size={20} />} label="Profile" />
          <NavItem to="/experience" icon={<Briefcase size={20} />} label="Experience" />
          <NavItem to="/skills" icon={<BarChart2 size={20} />} label="Skills Matrix" />
          <div className="pt-4 mt-4 border-t border-slate-800">
            <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Community</p>
            <NavItem to="/directory" icon={<Users size={20} />} label="Directory" />
          </div>
        </nav>

        <div className="p-6 mt-auto border-t border-slate-800 text-xs text-slate-500">
          <p>&copy; 2026 SkillTrack</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto">
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
          "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
          isActive
            ? "bg-indigo-600 text-white shadow-md"
            : "hover:bg-slate-800 hover:text-white"
        )
      }
    >
      {icon}
      <span className="font-medium">{label}</span>
    </NavLink>
  );
}
