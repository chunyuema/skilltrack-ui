import { useParams, Navigate, Link } from 'react-router-dom';
import { MOCK_USERS } from '../data/mockUsers';
import SkillsRadar from '../components/skills/SkillsRadar';
import SkillsList from '../components/skills/SkillsList';
import { MapPin, Mail, Github, Linkedin, ArrowLeft, Briefcase, Building, Calendar, Terminal } from 'lucide-react';

export default function PublicProfile() {
    const { userId } = useParams();
    const user = MOCK_USERS.find(u => u.id === userId);

    if (!user) {
        return <Navigate to="/directory" replace />;
    }

    return (
        <div className="space-y-10">
            <Link to="/directory" className="inline-flex items-center gap-2 text-slate-500 hover:text-sky-400 transition-colors font-bold text-xs uppercase tracking-widest font-mono group">
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                RET_TO_DIRECTORY
            </Link>

            {/* Profile Header */}
            <div className="bg-bg-card rounded border border-slate-800/60 overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-sky-500/40 to-transparent"></div>
                <div className="px-10 pb-10 pt-12">
                    <div className="relative mb-12 flex flex-col md:flex-row md:items-end justify-between gap-10">
                        <div className="flex items-end gap-8">
                            <div className="w-32 h-32 rounded bg-slate-900 p-1 shadow-2xl border border-slate-800">
                                <div className="w-full h-full bg-slate-800 rounded flex items-center justify-center text-5xl font-black text-sky-500 font-mono border border-sky-500/10">
                                    {user.profile.firstName.charAt(0)}
                                </div>
                            </div>
                            <div className="mb-2 space-y-2">
                                <p className="text-[10px] font-bold text-sky-500 uppercase tracking-[0.2em] font-mono">// ACCESS_NODE: {user.id}</p>
                                <h1 className="text-4xl font-black text-white tracking-tighter uppercase font-mono">{user.profile.firstName} {user.profile.lastName}</h1>
                                <p className="text-slate-500 font-bold text-sm uppercase tracking-widest font-mono">{user.profile.title.replace(/ /g, '_')}</p>
                            </div>
                        </div>
                        <div className="flex gap-2.5 mb-2">
                            <SocialLink href={user.profile.githubUrl} icon={<Github size={18} />} label="REPO" />
                            <SocialLink href={user.profile.linkedinUrl} icon={<Linkedin size={18} />} label="NET" />
                            <SocialLink href={`mailto:${user.profile.email}`} icon={<Mail size={18} />} label="MAIL" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-20 border-t border-slate-800/50 pt-12">
                        <div className="lg:col-span-2 space-y-16">
                            <div>
                                <h3 className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em] font-mono mb-6">[ SYSTEM_OVERVIEW ]</h3>
                                <p className="text-slate-300 leading-relaxed font-medium text-lg italic border-l-2 border-sky-900/50 pl-6 pr-6">"{user.profile.bio}"</p>
                            </div>

                            <div>
                                <h3 className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em] font-mono mb-10">[ HISTORICAL_TIMELINE ]</h3>
                                <div className="space-y-12">
                                    {user.experiences.map(exp => (
                                        <div key={exp.id} className="relative pl-8 border-l border-slate-800 group">
                                            <div className="absolute top-0 left-0 -translate-x-[4.5px] w-2 h-2 bg-slate-900 border border-sky-700 group-hover:bg-sky-500 group-hover:border-sky-500 transition-colors"></div>
                                            <h4 className="font-bold text-white text-lg tracking-tight uppercase font-mono mb-1">{exp.role}</h4>
                                            <div className="flex items-center gap-2 text-sky-500/70 font-bold mb-2 text-xs font-mono uppercase tracking-wider">
                                                <Building size={14} className="text-sky-800" />
                                                <span>{exp.company}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] text-slate-600 mb-5 font-bold uppercase tracking-[0.2em] font-mono">
                                                <Calendar size={12} className="text-slate-800" />
                                                <span>{exp.startDate} :: {exp.endDate}</span>
                                            </div>
                                            <p className="text-sm text-slate-400 leading-relaxed font-medium max-w-2xl border-l border-slate-900 pl-4">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-10">
                            <div className="bg-slate-900/40 p-8 rounded border border-slate-800/80 space-y-8 shadow-inner">
                                <h3 className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em] font-mono mb-2">// METADATA</h3>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 text-slate-400 font-bold text-xs font-mono">
                                        <div className="w-10 h-10 rounded bg-slate-800 flex items-center justify-center text-sky-600 border border-slate-700/50">
                                            <MapPin size={18} />
                                        </div>
                                        <span>LOC: {user.profile.location.toUpperCase()}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-slate-400 font-bold text-xs font-mono">
                                        <div className="w-10 h-10 rounded bg-slate-800 flex items-center justify-center text-sky-600 border border-slate-700/50">
                                            <Briefcase size={18} />
                                        </div>
                                        <span>EXP_L: {user.profile.yearsOfExperience}Y_CYCLES</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-slate-400 font-bold text-xs font-mono">
                                        <div className="w-10 h-10 rounded bg-slate-800 flex items-center justify-center text-sky-600 border border-slate-700/50">
                                            <Terminal size={18} />
                                        </div>
                                        <span>STA: AUTH_SUCCESS</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Skills Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                        <Terminal size={18} className="text-sky-600" />
                        <h2 className="text-xl font-black text-white tracking-tighter uppercase font-mono">Competency_Matrix</h2>
                    </div>
                    <SkillsList themes={user.themes} readOnly />
                </div>
                <div className="lg:col-span-1 space-y-8">
                    <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                        <Terminal size={18} className="text-sky-600" />
                        <h2 className="text-xl font-black text-white tracking-tighter uppercase font-mono">Proficiency_Map</h2>
                    </div>
                    <SkillsRadar themes={user.themes} />
                </div>
            </div>
        </div>
    );
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <a 
            href={href} 
            target="_blank" 
            rel="noreferrer" 
            className="flex items-center gap-2.5 px-4 py-2 bg-slate-900 border border-slate-800 rounded text-slate-500 hover:text-sky-400 hover:border-sky-900/50 transition-all text-[10px] font-black font-mono tracking-widest"
            title={label}
        >
            {icon}
            <span className="hidden sm:inline">{label}</span>
        </a>
    );
}
