import { Link } from 'react-router-dom';
import { MOCK_USERS } from '../data/mockUsers';
import { Briefcase, ChevronRight, Search, Users, ShieldCheck, Mail, MapPin } from 'lucide-react';

export default function UserDirectory() {
    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Compact Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-6 border-b border-divider">
                <div className="flex items-center gap-4">
                    <div className="pill flex items-center gap-1.5">
                        <Users size={12} />
                        Network
                    </div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-tight">Member Directory</h1>
                </div>
                <div className="flex gap-2">
                    <HeroPill label="React Architects" />
                    <HeroPill label="Cloud Native" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 lg:gap-20">
                {/* Main List Column */}
                <div className="space-y-4">
                     <div className="flex justify-between items-center mb-8">
                        <div className="relative group w-full max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary group-focus-within:text-primary transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Search by name, role or tech node..." 
                                className="bg-bg-card border border-divider rounded-md py-4 pl-12 pr-6 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/40 w-full transition-all placeholder:text-text-secondary/50 font-medium"
                            />
                        </div>
                    </div>

                    <div className="divide-y divide-divider border-t border-divider">
                        {MOCK_USERS.map((user) => (
                            <Link
                                key={user.id}
                                to={`/users/${user.id}`}
                                className="card-row block p-8 group relative overflow-hidden"
                            >
                                <div className="flex flex-col md:flex-row gap-8">
                                    <div className="flex-shrink-0">
                                        <div className="w-16 h-16 rounded bg-slate-900 flex items-center justify-center text-primary font-black text-2xl border border-divider shadow-inner group-hover:border-primary/40 transition-all group-hover:scale-105">
                                            {user.profile.firstName.charAt(0)}
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-black text-white group-hover:text-primary transition-colors text-2xl tracking-tight leading-tight uppercase">{user.profile.firstName} {user.profile.lastName}</h3>
                                                    <ShieldCheck size={16} className="text-emerald-accent opacity-50" />
                                                </div>
                                                <div className="flex items-center gap-3 text-primary font-bold text-xs uppercase tracking-widest font-mono">
                                                    <span>{user.profile.title}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 self-start md:self-auto">
                                                 <div className="pill flex items-center gap-2">
                                                    <Briefcase size={12} className="opacity-60" />
                                                    {user.profile.yearsOfExperience}Y Exp
                                                </div>
                                                <div className="pill-success flex items-center gap-2">
                                                    Available
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-text-secondary text-base mb-2 line-clamp-2 leading-relaxed font-medium max-w-3xl">
                                            {user.profile.bio}
                                        </p>

                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {user.profile.location && (
                                                <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest flex items-center gap-1.5 mr-4 font-mono opacity-50">
                                                    <MapPin size={12} />
                                                    {user.profile.location}
                                                </span>
                                            )}
                                            {/* Dummy tech tags based on name for visual parity with TokyoDev */}
                                            <TechTag label="React" />
                                            <TechTag label="TypeScript" />
                                            <TechTag label="Node.js" />
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute right-8 bottom-8 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all">
                                    <ChevronRight size={24} className="text-primary" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Sidebar Column */}
                <aside className="space-y-8">
                     <div className="bg-bg-card border border-divider p-8 rounded-lg space-y-6">
                        <div className="space-y-1">
                             <h4 className="font-black text-xs text-white uppercase tracking-[0.3em]">Join the network</h4>
                             <div className="h-1 w-12 bg-primary/30"></div>
                        </div>
                        <p className="text-sm leading-relaxed text-text-secondary font-medium">Verified engineers get access to exclusive architectural blueprints and private tech matrices.</p>
                        <button className="w-full py-4 bg-primary text-white rounded font-black text-[10px] uppercase tracking-[0.2em] hover:bg-primary-hover transition-all shadow-lg shadow-primary/20">
                             Register Identity
                        </button>
                    </div>

                    <div className="bg-emerald-accent/5 border border-emerald-accent/20 p-8 rounded-lg space-y-6">
                        <div className="space-y-1">
                             <h4 className="font-black text-xs text-emerald-accent uppercase tracking-[0.3em]">Active Status</h4>
                             <div className="h-1 w-12 bg-emerald-accent/30"></div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Active Nodes</span>
                                <span className="text-xs font-black text-white font-mono">{MOCK_USERS.length}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Growth (24h)</span>
                                <span className="text-xs font-black text-emerald-accent font-mono">+12.4%</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 p-4">
                        <h5 className="text-[10px] font-black text-text-secondary uppercase tracking-widest px-4 font-mono opacity-50">// Browse Categories</h5>
                        <div className="flex flex-col gap-1">
                            <CategoryLink label="Architects" count={42} />
                            <CategoryLink label="Frontend Leads" count={128} />
                            <CategoryLink label="Security Ops" count={34} />
                            <CategoryLink label="Data Scientists" count={89} />
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

function HeroPill({ label }: { label: string }) {
    return (
        <span className="px-4 py-2 rounded-full bg-white/[0.03] border border-divider text-white font-bold text-[11px] uppercase tracking-widest hover:bg-white/[0.08] transition-all cursor-pointer">
            {label}
        </span>
    );
}

function TechTag({ label }: { label: string }) {
    return (
        <span className="px-2 py-0.5 rounded bg-primary/5 text-primary/80 border border-primary/10 text-[9px] font-black uppercase tracking-widest font-mono">
            {label}
        </span>
    );
}

function CategoryLink({ label, count }: { label: string, count: number }) {
    return (
        <div className="flex justify-between items-center px-4 py-3 rounded hover:bg-white/[0.03] transition-colors cursor-pointer group">
            <span className="text-sm font-bold text-text-secondary group-hover:text-white transition-colors">{label}</span>
            <span className="text-[10px] font-mono font-black opacity-30">{count}</span>
        </div>
    );
}
