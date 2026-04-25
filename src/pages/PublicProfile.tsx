import { useParams, Navigate, Link } from 'react-router-dom';
import { MOCK_USERS } from '../data/mockUsers';
import SkillsRadar from '../components/skills/SkillsRadar';
import SkillsList from '../components/skills/SkillsList';
import { MapPin, Mail, Github, Linkedin, ArrowLeft, Briefcase, Building, Calendar, Terminal, Shield } from 'lucide-react';

export default function PublicProfile() {
    const { userId } = useParams();
    const user = MOCK_USERS.find(u => u.id === userId);

    if (!user) {
        return <Navigate to="/directory" replace />;
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <Link to="/directory" className="inline-flex items-center gap-2 text-slate-500 hover:text-sky-400 transition-colors font-bold text-[10px] uppercase tracking-widest font-mono group">
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                Back to Directory
            </Link>

            {/* Profile Header */}
            <div className="bg-bg-card rounded border border-slate-800/60 overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-sky-500/40 to-transparent"></div>
                <div className="px-10 pb-10 pt-12 border-b border-divider">
                    <div className="relative mb-12 flex flex-col md:flex-row md:items-end justify-between gap-10">
                        <div className="flex items-end gap-8">
                            <div className="w-32 h-32 rounded bg-slate-900 p-1 shadow-2xl border border-slate-800">
                                <div className="w-full h-full bg-slate-800 rounded flex items-center justify-center text-5xl font-black text-sky-500 font-mono border border-sky-500/10">
                                    {user.profile.firstName.charAt(0)}
                                </div>
                            </div>
                            <div className="mb-2 space-y-3">
                                <div className="flex items-center gap-2">
                                     <div className="pill-success flex items-center gap-1.5 py-0.5">
                                        <Shield size={10} />
                                        Verified
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest font-mono">NODE_ID: {user.id}</span>
                                </div>
                                <h1 className="text-4xl font-black text-white tracking-tighter uppercase">{user.profile.firstName} {user.profile.lastName}</h1>
                                <p className="text-primary font-bold text-sm uppercase tracking-[0.2em] font-mono">{user.profile.title}</p>
                            </div>
                        </div>
                        <div className="flex gap-2.5 mb-2">
                            <SocialLink href={user.profile.githubUrl} icon={<Github size={18} />} label="GitHub" />
                            <SocialLink href={user.profile.linkedinUrl} icon={<Linkedin size={18} />} label="LinkedIn" />
                            <SocialLink href={`mailto:${user.profile.email}`} icon={<Mail size={18} />} label="Email" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-20 pt-12">
                        <div className="lg:col-span-2 space-y-16">
                            <div>
                                <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-6">Professional Summary</h3>
                                <p className="text-text-secondary leading-relaxed font-medium text-lg italic border-l-2 border-primary/30 pl-6 pr-6">"{user.profile.bio}"</p>
                            </div>

                            <div>
                                <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-10">Work History</h3>
                                <div className="space-y-12">
                                    {user.experiences.map(exp => (
                                        <div key={exp.id} className="relative pl-8 border-l border-divider group">
                                            <div className="absolute top-0 left-0 -translate-x-[4.5px] w-2 h-2 bg-slate-900 border border-sky-700 group-hover:bg-primary group-hover:border-primary transition-colors"></div>
                                            <h4 className="font-black text-white text-xl tracking-tight uppercase mb-1">{exp.role}</h4>
                                            <div className="flex items-center gap-2 text-primary font-bold mb-2 text-xs uppercase tracking-wider">
                                                <Building size={14} className="opacity-50" />
                                                <span>{exp.company}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] text-text-secondary mb-5 font-bold uppercase tracking-[0.2em] font-mono">
                                                <Calendar size={12} className="opacity-40" />
                                                <span>{exp.startDate} — {exp.endDate}</span>
                                            </div>
                                            <p className="text-base text-text-secondary leading-relaxed font-medium max-w-2xl">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-10">
                            <div className="bg-slate-900/40 p-8 rounded border border-divider space-y-8 shadow-inner">
                                <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em] mb-2">Technical Context</h3>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 text-white font-bold text-xs">
                                        <div className="w-10 h-10 rounded bg-bg-card flex items-center justify-center text-primary border border-divider shadow-sm">
                                            <MapPin size={18} />
                                        </div>
                                        <span>{user.profile.location}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-white font-bold text-xs">
                                        <div className="w-10 h-10 rounded bg-bg-card flex items-center justify-center text-primary border border-divider shadow-sm">
                                            <Briefcase size={18} />
                                        </div>
                                        <span>{user.profile.yearsOfExperience} Years Experience</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-white font-bold text-xs">
                                        <div className="w-10 h-10 rounded bg-bg-card flex items-center justify-center text-emerald-accent border border-divider shadow-sm">
                                            <Shield size={18} />
                                        </div>
                                        <span className="text-emerald-accent">Verified Member</span>
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
                    <div className="flex items-center gap-3 border-b border-divider pb-4">
                        <Terminal size={18} className="text-primary" />
                        <h2 className="text-xl font-black text-white tracking-tighter uppercase">Skills Matrix</h2>
                    </div>
                    <SkillsList themes={user.themes} readOnly />
                </div>
                <div className="lg:col-span-1 space-y-8">
                    <div className="flex items-center gap-3 border-b border-divider pb-4">
                        <Terminal size={18} className="text-primary" />
                        <h2 className="text-xl font-black text-white tracking-tighter uppercase">Proficiency Map</h2>
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
            className="flex items-center gap-2.5 px-4 py-2 bg-bg-card border border-divider rounded text-text-secondary hover:text-white hover:border-primary transition-all text-[10px] font-black uppercase tracking-widest font-mono"
            title={label}
        >
            {icon}
            <span className="hidden sm:inline">{label}</span>
        </a>
    );
}
