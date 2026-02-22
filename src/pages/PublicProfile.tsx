import { useParams, Navigate, Link } from 'react-router-dom';
import { MOCK_USERS } from '../data/mockUsers';
import SkillsRadar from '../components/skills/SkillsRadar';
import SkillsList from '../components/skills/SkillsList';
import { MapPin, Mail, Github, Linkedin, ArrowLeft, Briefcase, Building, Calendar } from 'lucide-react';

export default function PublicProfile() {
    const { userId } = useParams();
    const user = MOCK_USERS.find(u => u.id === userId);

    if (!user) {
        return <Navigate to="/directory" replace />;
    }

    return (
        <div className="space-y-8">
            <Link to="/directory" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors">
                <ArrowLeft size={16} />
                Back to Directory
            </Link>

            {/* Profile Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-slate-700 to-slate-900"></div>
                <div className="px-8 pb-8">
                    <div className="relative -mt-12 mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div className="flex items-end gap-6">
                            <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg">
                                <div className="w-full h-full bg-indigo-50 rounded-xl flex items-center justify-center text-3xl font-bold text-indigo-600">
                                    {user.profile.fullName.charAt(0)}
                                </div>
                            </div>
                            <div className="mb-2">
                                <h1 className="text-2xl font-bold text-slate-900">{user.profile.fullName}</h1>
                                <p className="text-slate-500 font-medium">{user.profile.title}</p>
                            </div>
                        </div>
                        <div className="flex gap-3 mb-2">
                            <a href={user.profile.githubUrl} target="_blank" rel="noreferrer" className="p-2 bg-slate-100 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors">
                                <Github size={20} />
                            </a>
                            <a href={user.profile.linkedinUrl} target="_blank" rel="noreferrer" className="p-2 bg-slate-100 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors">
                                <Linkedin size={20} />
                            </a>
                            <a href={`mailto:${user.profile.email}`} className="p-2 bg-slate-100 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors">
                                <Mail size={20} />
                            </a>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-6">
                            <div>
                                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-2">About</h3>
                                <p className="text-slate-600 leading-relaxed">{user.profile.bio}</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Experience</h3>
                                <div className="space-y-4">
                                    {user.experiences.map(exp => (
                                        <div key={exp.id} className="border-l-2 border-slate-200 pl-4 py-1">
                                            <h4 className="font-bold text-slate-900">{exp.role}</h4>
                                            <div className="flex items-center gap-2 text-sm text-indigo-600 mb-1">
                                                <Building size={14} />
                                                <span>{exp.company}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                                                <Calendar size={12} />
                                                <span>{exp.startDate} — {exp.endDate}</span>
                                            </div>
                                            <p className="text-sm text-slate-600">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-slate-50 p-4 rounded-xl space-y-3">
                                <div className="flex items-center gap-3 text-slate-600">
                                    <MapPin size={18} />
                                    <span className="text-sm">{user.profile.location}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600">
                                    <Briefcase size={18} />
                                    <span className="text-sm">{user.profile.yearsOfExperience} Years Experience</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Skills Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Skills Matrix</h2>
                    <SkillsList themes={user.themes} readOnly />
                </div>
                <div className="lg:col-span-1">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Proficiency Visualization</h2>
                    <SkillsRadar themes={user.themes} />
                </div>
            </div>
        </div>
    );
}
