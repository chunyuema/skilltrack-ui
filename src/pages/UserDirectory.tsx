import { Link } from 'react-router-dom';
import { MOCK_USERS } from '../data/mockUsers';
import { Briefcase, ChevronRight, Search, Terminal } from 'lucide-react';

export default function UserDirectory() {
    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Terminal size={14} className="text-sky-500" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] font-mono">GLOBAL_NETWORK_NODES</span>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase font-mono">Directory</h1>
                </div>
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-sky-400 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="SEARCH_BY_ID_OR_ROLE..." 
                        className="bg-slate-900 border border-slate-800 rounded py-2.5 pl-11 pr-4 text-xs text-sky-500 font-mono focus:outline-none focus:ring-1 focus:ring-sky-500/30 w-full md:w-80 transition-all placeholder:text-slate-700"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {MOCK_USERS.map((user) => (
                    <Link
                        key={user.id}
                        to={`/users/${user.id}`}
                        className="bg-bg-card rounded border border-slate-800/60 p-8 hover:border-sky-900/50 hover:shadow-2xl transition-all group relative overflow-hidden"
                    >
                        <div className="flex items-center gap-5 mb-8">
                            <div className="w-14 h-14 rounded bg-slate-900 flex items-center justify-center text-sky-500 font-black text-2xl border border-slate-800 shadow-inner group-hover:border-sky-500/20 font-mono transition-colors">
                                {user.profile.firstName.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-black text-white group-hover:text-sky-400 transition-colors text-lg tracking-tight leading-tight uppercase font-mono">{user.profile.firstName} {user.profile.lastName}</h3>
                                <p className="text-[9px] text-slate-500 font-bold mt-1 uppercase tracking-widest font-mono">// {user.profile.title.replace(/ /g, '_')}</p>
                            </div>
                        </div>

                        <p className="text-slate-400 text-xs mb-10 line-clamp-2 h-10 leading-relaxed font-medium">
                            {user.profile.bio}
                        </p>

                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold border-t border-slate-800 pt-6 font-mono tracking-widest">
                            <div className="flex items-center gap-2.5">
                                <Briefcase size={14} className="text-sky-700" />
                                <span>EXP: {user.profile.yearsOfExperience}Y</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-sky-500 font-black uppercase transition-all group-hover:gap-3">
                                PULL_DATA
                                <ChevronRight size={14} />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
