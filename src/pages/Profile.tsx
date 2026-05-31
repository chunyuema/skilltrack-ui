import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile, Experience } from '../types';
import { useAuth } from '../hooks/useAuth';
import { profileService } from '../services/profileService';
import { Mail, Github, Linkedin, GraduationCap, Shield, Clock, Globe, Plus, Trash2, Pencil, Briefcase, MapPin, ExternalLink, Edit3 } from 'lucide-react';
import { FormInput } from '../components/ui/FormInput';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { ExperienceCard } from '../components/profile/ExperienceCard';
import { PersonalInfoEditorModal } from '../components/profile/PersonalInfoEditorModal';
import { ExperienceEditorModal } from '../components/profile/ExperienceEditorModal';
import { cn } from '../lib/utils';

export default function Profile() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [globalScore, setGlobalScore] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);
    
    // UI States
    const [isProfileEditorOpen, setIsProfileEditorOpen] = useState(false);
    const [experienceEditorState, setExperienceEditorState] = useState<{ isOpen: boolean; experience?: Experience }>({
        isOpen: false
    });
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    
    const { token, logout } = useAuth();

    const loadData = useCallback(async () => {
        if (!token) { setIsLoading(false); return; }
        try {
            const [p, e, s] = await Promise.all([
                profileService.fetchProfile(token), 
                profileService.fetchExperiences(token),
                profileService.fetchSkills(token)
            ]);
            setProfile(p); 
            setExperiences(e);
            
            if (s && s.length > 0) {
                const allSubCats = s.flatMap((t: any) => t.subCategories);
                const totalLevel = allSubCats.reduce((sum: number, sub: any) => sum + (sub.level || 0), 0);
                const maxLevel = allSubCats.length * 5;
                setGlobalScore(maxLevel > 0 ? Math.round((totalLevel / maxLevel) * 100) : 0);
            }
        } catch (err) { 
            console.error("Load error:", err);
            logout(); 
            navigate('/login'); 
        } finally { 
            setIsLoading(false); 
        }
    }, [token, logout, navigate]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleSaveProfile = async (updatedProfile: UserProfile) => {
        if (!token) return;
        await profileService.updateProfile(updatedProfile, token);
        await loadData();
    };

    const handleSaveExperience = async (exp: Experience | Omit<Experience, 'id'>) => {
        if (!token) return;
        if ('id' in exp && exp.id) {
            await profileService.updateExperience(exp.id, exp as Experience, token);
        } else {
            await profileService.addExperience(exp, token);
        }
        await loadData();
    };

    const handleDeleteExperience = async (id: string) => {
        await profileService.deleteExperience(id, token!);
        setExperiences(experiences.filter(exp => String(exp.id) !== id));
        setDeleteConfirmId(null);
    };

    if (isLoading && !profile) {
        return <ProfileSkeleton />;
    }

    if (!profile) return null;

    return (
        <div className="animate-in fade-in duration-700 max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-12 relative">
            <ConfirmModal
                isOpen={!!deleteConfirmId}
                title="Delete Experience?"
                description="This action cannot be undone. This work history entry will be permanently removed from your professional profile."
                confirmLabel="Confirm Delete"
                onConfirm={() => deleteConfirmId && handleDeleteExperience(deleteConfirmId)}
                onCancel={() => setDeleteConfirmId(null)}
                variant="danger"
            />

            {/* Personal Info Editor */}
            {isProfileEditorOpen && (
                <PersonalInfoEditorModal 
                    isOpen={isProfileEditorOpen}
                    onClose={() => setIsProfileEditorOpen(false)}
                    profile={profile}
                    onSave={handleSaveProfile}
                />
            )}

            {/* Experience Editor */}
            {experienceEditorState.isOpen && (
                <ExperienceEditorModal 
                    isOpen={experienceEditorState.isOpen}
                    onClose={() => setExperienceEditorState({ isOpen: false })}
                    experience={experienceEditorState.experience}
                    onSave={handleSaveExperience}
                />
            )}

            <aside className="space-y-6">
                <div className="bg-bg-card border border-divider p-6 rounded-lg space-y-6 sticky top-24">
                    <div className="text-center">
                        <div className="w-24 h-24 mx-auto bg-slate-900 rounded-full flex items-center justify-center text-4xl font-black text-white ring-1 ring-white/5">{profile.firstName.charAt(0)}</div>
                        <h3 className="mt-4 font-black text-xl text-white uppercase tracking-tight">{profile.firstName} {profile.lastName}</h3>
                    </div>

                    {/* Overall Skill Score Card */}
                    <button 
                        onClick={() => navigate('/skills')}
                        className="w-full bg-primary/5 border border-primary/20 p-4 rounded-xl flex items-center justify-between group hover:bg-primary/10 transition-all duration-300"
                    >
                        <div className="flex flex-col items-start text-left">
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Overall Skills</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-black text-white tabular-nums">{globalScore}%</span>
                                <span className="text-[10px] font-bold text-text-secondary uppercase">Score</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-full border-2 border-primary/20 flex items-center justify-center relative group-hover:scale-105 transition-transform duration-500">
                            <svg className="w-12 h-12 -rotate-90">
                                <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="3" className="text-white/5" />
                                <circle
                                    cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="3"
                                    strokeDasharray={126}
                                    strokeDashoffset={126 - (126 * globalScore / 100)}
                                    className="text-primary transition-all duration-1000 ease-out"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Shield size={16} className="text-primary opacity-50" />
                            </div>
                        </div>
                    </button>

                    <div className="space-y-4 pt-4 border-t border-divider">
                         <div className="space-y-2">
                            <h2 className="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-2">
                                <Edit3 size={12} className="text-primary" />
                                Bio
                            </h2>
                            <p className="text-xs text-text-secondary leading-relaxed line-clamp-6">{profile.bio || "No bio added."}</p>
                         </div>

                        <div className="space-y-3 pt-4 border-t border-divider">
                            <FormInput 
                                label="Email" value={profile.email} isEditing={false} icon={<Mail size={12}/>} 
                                labelClassName="text-[9px]" readOnlyClassName="text-xs font-medium text-text-secondary"
                            />
                            <FormInput 
                                label="Visa Status" value={profile.visaStatus} isEditing={false} icon={<Shield size={12}/>} 
                                labelClassName="text-[9px]" readOnlyClassName="text-xs font-medium text-text-secondary"
                            />
                            <FormInput 
                                label="LinkedIn" value={profile.linkedinUrl} isEditing={false} icon={<Linkedin size={12}/>} 
                                labelClassName="text-[9px]" readOnlyClassName="text-xs font-medium text-text-secondary"
                                renderValue={(val) => val && (
                                    <a href={String(val)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary transition-colors">
                                        {String(val).replace(/https?:\/\/(www\.)?linkedin\.com\/in\//, '').replace(/\/$/, '')}
                                        <ExternalLink size={10} className="opacity-50" />
                                    </a>
                                )}
                            />
                            <FormInput 
                                label="GitHub" value={profile.githubUrl} isEditing={false} icon={<Github size={12}/>} 
                                labelClassName="text-[9px]" readOnlyClassName="text-xs font-medium text-text-secondary"
                                renderValue={(val) => val && (
                                    <a href={String(val)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary transition-colors">
                                        {String(val).replace(/https?:\/\/(www\.)?github\.com\//, '').replace(/\/$/, '')}
                                        <ExternalLink size={10} className="opacity-50" />
                                    </a>
                                )}
                            />
                        </div>
                    </div>

                    <button 
                        onClick={() => setIsProfileEditorOpen(true)} 
                        className="w-full py-4 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-primary-hover active:scale-[0.98] shadow-lg shadow-primary/20"
                    >
                        Edit Profile
                    </button>
                </div>
            </aside>

            <main className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <MetricCard icon={<Briefcase size={18} className="text-primary" />} label="Experience">
                        <span className="text-white font-black text-2xl">{profile.yearsOfExperience} <span className="text-text-secondary text-sm font-bold uppercase tracking-widest ml-1">Years</span></span>
                    </MetricCard>

                    <MetricCard icon={<MapPin size={18} className="text-emerald-accent" />} label="Location">
                        <span className="text-white font-black text-xl leading-tight">{profile.country}</span>
                    </MetricCard>

                    <MetricCard icon={<GraduationCap size={18} className="text-amber-400" />} label="Education">
                        <span className="text-white font-bold text-sm leading-tight line-clamp-2">{profile.education}</span>
                    </MetricCard>
                </div>

                 <div className="flex justify-between items-center pb-4 border-b border-divider">
                     <h2 className="text-sm font-black text-white uppercase tracking-[0.3em]">Work History</h2>
                     <button 
                        onClick={() => setExperienceEditorState({ isOpen: true })}
                        className="text-primary hover:scale-110 transition-transform p-2 -mr-2"
                     >
                        <Plus size={18} />
                     </button>
                 </div>

                 <div className="space-y-4">
                    {experiences.length === 0 ? (
                        <div className="bg-bg-card border border-divider border-dashed p-12 rounded-xl text-center">
                            <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">No work history records found.</p>
                        </div>
                    ) : experiences.map(exp => (
                        <ExperienceCard 
                            key={exp.id}
                            exp={exp}
                            isEditing={false}
                            onEdit={() => setExperienceEditorState({ isOpen: true, experience: exp })}
                            onDelete={() => setDeleteConfirmId(String(exp.id))}
                            editUI={null}
                        />
                    ))}
                 </div>
            </main>
        </div>
    );
}

function ProfileSkeleton() {
    return (
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-12 relative animate-pulse">
            <aside className="space-y-6">
                <div className="bg-bg-card border border-divider p-6 rounded-lg space-y-6">
                    <div className="text-center">
                        <div className="w-24 h-24 mx-auto bg-slate-900 rounded-full" />
                        <div className="h-6 w-32 bg-slate-900 mx-auto mt-4 rounded" />
                    </div>
                    <div className="h-20 w-full bg-slate-900 rounded-xl" />
                    <div className="space-y-4 pt-4 border-t border-divider">
                        <div className="h-4 w-12 bg-slate-900 rounded" />
                        <div className="h-20 w-full bg-slate-900 rounded" />
                        <div className="space-y-3 pt-4 border-t border-divider">
                            {[1, 2, 3, 4].map(i => <div key={i} className="h-10 w-full bg-slate-900 rounded" />)}
                        </div>
                    </div>
                </div>
            </aside>
            <main className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-[110px] bg-bg-card border border-divider rounded-xl" />)}
                </div>
                <div className="h-8 w-40 bg-bg-card border-b border-divider rounded" />
                <div className="space-y-4">
                    {[1, 2].map(i => <div key={i} className="h-24 bg-bg-card border border-divider rounded-lg" />)}
                </div>
            </main>
        </div>
    );
}

function MetricCard({ icon, label, children }: { icon: React.ReactNode, label: string, children: React.ReactNode }) {
    return (
        <div className="bg-bg-card border border-divider p-5 rounded-xl flex flex-col justify-center min-h-[110px] transition-all duration-300 hover:border-white/10">
            <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-bg-deep flex items-center justify-center border border-divider">
                    {icon}
                </div>
                <span className="text-[9px] font-black text-text-secondary uppercase tracking-[0.2em]">{label}</span>
            </div>
            <div className="flex items-end italic">
                {children}
            </div>
        </div>
    );
}
