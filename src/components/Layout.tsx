import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Layers, LogOut, User, Search, Bell } from 'lucide-react';
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
    <div className="min-h-screen bg-bg-deep flex flex-col font-main overflow-x-hidden">
      {/* Sticky Top Header */}
      <header className="sticky top-0 z-50 bg-bg-deep/80 backdrop-blur-md border-b border-divider h-20 flex items-center px-6 md:px-12">
        <div className="max-w-[1400px] w-full mx-auto flex items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2.5 group cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/30 transition-transform group-hover:scale-105">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tighter text-white uppercase hidden sm:block">SkillTrack</span>
          </div>

          {/* Centered Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <HeaderLink to="/profile" label="Profile" />
            <HeaderLink to="/experience" label="Experience" />
            <HeaderLink to="/skills" label="Matrix" />
            <HeaderLink to="/directory" label="Community" />
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4 lg:gap-6">
            <div className="hidden lg:flex items-center gap-2 text-text-secondary hover:text-white transition-colors cursor-pointer">
              <Search size={18} />
            </div>
            <div className="hidden lg:flex items-center gap-2 text-text-secondary hover:text-white transition-colors cursor-pointer relative">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-accent rounded-full border-2 border-bg-deep"></span>
            </div>
            
            <div className="h-8 w-[1px] bg-divider hidden sm:block"></div>
            
            <div className="flex items-center gap-3">
               <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded font-bold text-xs uppercase tracking-widest hover:bg-primary-hover transition-all shadow-lg shadow-primary/20"
              >
                <span>Log out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area - Centered for better focus */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-6 md:px-12 py-10 lg:py-16">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-divider py-12 px-6 md:px-12 bg-bg-card/30">
        <div className="max-w-[1400px] w-full mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-2 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all cursor-pointer">
            <Layers className="w-5 h-5 text-primary" />
            <span className="text-sm font-extrabold tracking-tighter text-white uppercase">SkillTrack</span>
          </div>
          <p className="text-xs text-text-secondary font-medium">© 2026 SkillTrack Engineering Network. Built for technical excellence.</p>
          <div className="flex gap-6">
            <footerLink label="Privacy" />
            <footerLink label="Terms" />
            <footerLink label="Support" />
          </div>
        </div>
      </footer>
    </div>
  );
}

function HeaderLink({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "text-sm font-bold transition-all hover:text-white uppercase tracking-widest relative py-1",
          isActive ? "text-white" : "text-text-secondary"
        )
      }
    >
      {({ isActive }) => (
        <>
          {label}
          {isActive && (
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-full animate-in fade-in slide-in-from-bottom-1"></span>
          )}
        </>
      )}
    </NavLink>
  );
}

function footerLink({ label }: { label: string }) {
  return <span className="text-xs font-bold text-text-secondary hover:text-primary transition-colors cursor-pointer uppercase tracking-widest">{label}</span>;
}
