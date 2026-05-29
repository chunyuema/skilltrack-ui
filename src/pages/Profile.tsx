import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile, Experience } from '../types';
import { useAuth } from '../hooks/useAuth';
import { profileService } from '../services/profileService';
import { Save, Mail, Github, Linkedin, GraduationCap, Edit3, Shield, User, Clock, Globe, Plus, Trash2, Pencil, Briefcase, MapPin, ExternalLink } from 'lucide-react';
import { FormInput } from '../components/ui/FormInput';
import { MonthYearPicker } from '../components/ui/MonthYearPicker';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { cn } from '../lib/utils';

const COUNTRY_OPTIONS = [
  { label: 'United States', value: 'United States' },
  { label: 'United Kingdom', value: 'United Kingdom' },
  { label: 'Canada', value: 'Canada' },
  { label: 'Germany', value: 'Germany' },
  { label: 'France', value: 'France' },
  { label: 'Japan', value: 'Japan' },
  { label: 'China', value: 'China' },
  { label: 'India', value: 'India' },
  { label: 'Brazil', value: 'Brazil' },
  { label: 'Australia', value: 'Australia' },
  { label: 'Singapore', value: 'Singapore' },
  { label: 'Netherlands', value: 'Netherlands' },
];

export default function Profile() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [globalScore, setGlobalScore] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isAddingExp, setIsAddingExp] = useState(false);
    const [editingExpId, setEditingExpId] = useState<string | null>(null);
    const [newExp, setNewExp] = useState<Partial<Experience>>({});
    const [editExp, setEditExp] = useState<Partial<Experience>>({});
    const [expError, setExpError] = useState<string | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const { token, logout } = useAuth();

    const validateDates = (start?: string, end?: string): string | null => {
        if (!start) return 'Start date is required.';
        if (!end) return 'End date is required.';
        if (end !== 'Present' && end < start) {
            return 'End date cannot be before start date.';
        }
        return null;
    };

    useEffect(() => {
        const loadData = async () => {
            if (!token) { setIsLoading(false); return; }
            try {
                const [p, e, s] = await Promise.all([
                    profileService.fetchProfile(token), 
                    profileService.fetchExperiences(token),
                    profileService.fetchSkills(token)
                ]);
                setProfile(p); 
                setExperiences(e);
                
                // Calculate global score
                if (s && s.length > 0) {
                    const allSubCats = s.flatMap((t: any) => t.subCategories);
                    const totalLevel = allSubCats.reduce((sum: number, sub: any) => sum + (sub.level || 0), 0);
                    const maxLevel = allSubCats.length * 5;
                    setGlobalScore(maxLevel > 0 ? Math.round((totalLevel / maxLevel) * 100) : 0);
                }
            } catch (err) { logout(); navigate('/login'); } finally { setIsLoading(false); }
        };
        loadData();
    }, [token, logout, navigate]);

    const handleSave = async () => {
        setIsSaving(true);
        await profileService.updateProfile(profile!, token!);
        setIsEditing(false); setIsSaving(false);
    };

    const handleAddExperience = async () => {
        if (!token || !newExp.company || !newExp.role) return;

        const validationError = validateDates(newExp.startDate, newExp.endDate);
        if (validationError) {
            setExpError(validationError);
            return;
        }

        setIsSaving(true);
        setExpError(null);
        const exp = await profileService.addExperience({ company: newExp.company, role: newExp.role, startDate: newExp.startDate || '', endDate: newExp.endDate || 'Present', description: newExp.description || '', technologies: newExp.technologies || [] }, token);
        setExperiences([exp, ...experiences]);
        setIsAddingExp(false); setNewExp({}); setIsSaving(false);
    };

    const handleUpdateExperience = async () => {
        if (!editingExpId) return;

        const validationError = validateDates(editExp.startDate, editExp.endDate);
        if (validationError) {
            setExpError(validationError);
            return;
        }

        setIsSaving(true);
        setExpError(null);
        const updated = await profileService.updateExperience(editingExpId, editExp as any, token!);
        setExperiences(experiences.map(e => e.id === editingExpId ? updated : e));
        setEditingExpId(null); setIsSaving(false);
    };

    const handleDeleteExperience = async (id: string) => {
        await profileService.deleteExperience(id, token!);
        setExperiences(experiences.filter(exp => exp.id !== id));
        setDeleteConfirmId(null);
    };

    if (isLoading || !profile) return <div className="p-24 text-center text-white">Loading...</div>;

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

            <aside className="space-y-6">
                <div className="bg-bg-card border border-divider p-6 rounded-lg space-y-6 sticky top-24">
                    <div className="text-center">
                        <div className="w-24 h-24 mx-auto bg-slate-900 rounded-full flex items-center justify-center text-4xl font-black text-white">{profile.firstName.charAt(0)}</div>
                        <h3 className="mt-4 font-black text-xl text-white uppercase">{profile.firstName} {profile.lastName}</h3>
                    </div>

                    {/* Overall Skill Score Card */}
                    <button 
                        onClick={() => navigate('/skills')}
                        className="w-full bg-primary/5 border border-primary/20 p-4 rounded-xl flex items-center justify-between group hover:bg-primary/10 transition-all duration-300"
                    >
                        <div className="flex flex-col items-start">
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Overall Skills</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-black text-white tabular-nums">{globalScore}%</span>
                                <span className="text-[10px] font-bold text-text-secondary uppercase">Score</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-full border-2 border-primary/20 flex items-center justify-center relative group-hover:scale-105 transition-transform duration-500">
                            <svg className="w-12 h-12 -rotate-90">
                                <circle
                                    cx="24"
                                    cy="24"
                                    r="20"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    className="text-white/5"
                                />
                                <circle
                                    cx="24"
                                    cy="24"
                                    r="20"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
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
                            {isEditing ? (
                                <textarea 
                                    value={profile.bio || ''} 
                                    onChange={(e) => setProfile({...profile, bio: e.target.value})} 
                                    className="w-full bg-bg-deep border border-divider rounded p-3 text-xs text-white leading-relaxed focus:border-primary outline-none transition-all" 
                                    rows={4} 
                                />
                            ) : (
                                <p className="text-xs text-text-secondary leading-relaxed line-clamp-6">{profile.bio || "No bio added."}</p>
                            )}
                         </div>

                        <div className="space-y-3 pt-4 border-t border-divider">
                            <FormInput 
                                label="Email" 
                                value={profile.email} 
                                onChange={v => setProfile({...profile, email: v})} 
                                isEditing={isEditing} 
                                icon={<Mail size={12}/>} 
                                inputClassName="py-2 px-3 text-xs"
                                labelClassName="text-[9px]"
                                readOnlyClassName="text-sm font-medium tracking-normal text-text-secondary"
                            />
                            <FormInput 
                                label="Visa Status" 
                                value={profile.visaStatus} 
                                onChange={v => setProfile({...profile, visaStatus: v})} 
                                isEditing={isEditing} 
                                icon={<Shield size={12}/>} 
                                inputClassName="py-2 px-3 text-xs"
                                labelClassName="text-[9px]"
                                readOnlyClassName="text-sm font-medium tracking-normal text-text-secondary"
                            />
                            <FormInput 
                                label="LinkedIn" 
                                value={profile.linkedinUrl} 
                                onChange={v => setProfile({...profile, linkedinUrl: v})} 
                                isEditing={isEditing} 
                                icon={<Linkedin size={12}/>} 
                                inputClassName="py-2 px-3 text-xs"
                                labelClassName="text-[9px]"
                                readOnlyClassName="text-sm font-medium tracking-normal text-text-secondary"
                                renderValue={(val) => {
                                    if (!val) return null;
                                    const shortVal = String(val).replace(/https?:\/\/(www\.)?linkedin\.com\/in\//, '').replace(/\/$/, '');
                                    return (
                                        <a href={String(val)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary transition-colors">
                                            {shortVal}
                                            <ExternalLink size={10} className="opacity-50" />
                                        </a>
                                    );
                                }}
                            />
                            <FormInput 
                                label="GitHub" 
                                value={profile.githubUrl} 
                                onChange={v => setProfile({...profile, githubUrl: v})} 
                                isEditing={isEditing} 
                                icon={<Github size={12}/>} 
                                inputClassName="py-2 px-3 text-xs"
                                labelClassName="text-[9px]"
                                readOnlyClassName="text-sm font-medium tracking-normal text-text-secondary"
                                renderValue={(val) => {
                                    if (!val) return null;
                                    const shortVal = String(val).replace(/https?:\/\/(www\.)?github\.com\//, '').replace(/\/$/, '');
                                    return (
                                        <a href={String(val)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary transition-colors">
                                            {shortVal}
                                            <ExternalLink size={10} className="opacity-50" />
                                        </a>
                                    );
                                }}
                            />
                        </div>
                    </div>

                    <button onClick={() => isEditing ? handleSave() : setIsEditing(true)} className="w-full py-3 bg-primary text-white rounded font-bold text-[10px] uppercase transition-all hover:bg-primary-hover active:scale-[0.98]">
                        {isEditing ? 'Save Changes' : 'Edit Profile'}
                    </button>
                </div>
            </aside>

            <main className="space-y-8">
                {/* Visual Metrics Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <MetricCard 
                        icon={<Briefcase size={18} className="text-primary" />}
                        label="Experience"
                        isEditing={isEditing}
                    >
                        {isEditing ? (
                            <input 
                                type="number"
                                value={profile.yearsOfExperience}
                                onChange={(e) => setProfile({...profile, yearsOfExperience: parseInt(e.target.value)})}
                                className="bg-transparent border-b border-primary/40 focus:border-primary outline-none w-full text-white font-black text-2xl"
                            />
                        ) : (
                            <span className="text-white font-black text-2xl">{profile.yearsOfExperience} <span className="text-text-secondary text-sm font-bold uppercase tracking-widest ml-1">Years</span></span>
                        )}
                    </MetricCard>

                    <MetricCard 
                        icon={<MapPin size={18} className="text-emerald-accent" />}
                        label="Location"
                        isEditing={isEditing}
                    >
                        {isEditing ? (
                            <select 
                                value={profile.country}
                                onChange={(e) => setProfile({...profile, country: e.target.value})}
                                className="bg-transparent border-b border-emerald-accent/40 focus:border-emerald-accent outline-none w-full text-white font-black text-lg appearance-none"
                            >
                                {COUNTRY_OPTIONS.map(opt => <option key={opt.value} value={opt.value} className="bg-bg-deep">{opt.label}</option>)}
                            </select>
                        ) : (
                            <span className="text-white font-black text-xl leading-tight">{profile.country}</span>
                        )}
                    </MetricCard>

                    <MetricCard 
                        icon={<GraduationCap size={18} className="text-amber-400" />}
                        label="Education"
                        isEditing={isEditing}
                    >
                        {isEditing ? (
                            <input 
                                type="text"
                                value={profile.education}
                                onChange={(e) => setProfile({...profile, education: e.target.value})}
                                className="bg-transparent border-b border-amber-400/40 focus:border-amber-400 outline-none w-full text-white font-bold text-sm"
                            />
                        ) : (
                            <span className="text-white font-bold text-sm leading-tight line-clamp-2">{profile.education}</span>
                        )}
                    </MetricCard>
                </div>

                 <div className="flex justify-between items-center pb-4 border-b border-divider">
                     <h2 className="text-sm font-black text-white uppercase tracking-[0.3em]">Work History</h2>
                     <button onClick={() => { setIsAddingExp(true); setExpError(null); }} className="text-primary hover:scale-110 transition-transform"><Plus size={18} /></button>
                 </div>

                 {expError && (
                     <div className="bg-red-900/10 border border-red-900/20 text-red-400 p-4 rounded-lg text-xs font-bold uppercase tracking-widest">
                         {expError}
                     </div>
                 )}

                 {isAddingExp && (
                     <div className="bg-bg-deep p-6 rounded-lg border border-divider space-y-4">
                        <FormInput label="Company" value={newExp.company || ''} onChange={v => setNewExp({...newExp, company: v})} />
                        <FormInput label="Role" value={newExp.role || ''} onChange={v => setNewExp({...newExp, role: v})} />
                        <div className="grid grid-cols-2 gap-4">
                            <MonthYearPicker label="Start" value={newExp.startDate || ''} onChange={v => setNewExp({...newExp, startDate: v})} />
                            <MonthYearPicker label="End" value={newExp.endDate || ''} onChange={v => setNewExp({...newExp, endDate: v})} allowPresent />
                        </div>
                        <textarea value={newExp.description || ''} onChange={e => setNewExp({...newExp, description: e.target.value})} className="w-full bg-bg-card border border-divider rounded p-3 text-xs text-white" rows={3} placeholder="Description" />
                        <div className="flex gap-2">
                            <button onClick={handleAddExperience} className="px-4 py-2 bg-primary text-white text-xs font-bold rounded flex-1">Save Position</button>
                            <button onClick={() => setIsAddingExp(false)} className="px-4 py-2 bg-white/5 text-white text-xs font-bold rounded">Cancel</button>
                        </div>
                     </div>
                 )}

                 {experiences.map(exp => (
                     <div key={exp.id} className="bg-bg-card border border-divider p-6 rounded-lg">
                        {editingExpId === exp.id ? (
                           <div className="space-y-4">
                              <FormInput label="Company" value={editExp.company || exp.company} onChange={v => setEditExp({...editExp, company: v})} />
                              <FormInput label="Role" value={editExp.role || exp.role} onChange={v => setEditExp({...editExp, role: v})} />
                              <div className="grid grid-cols-2 gap-4">
                                  <MonthYearPicker label="Start" value={editExp.startDate || exp.startDate} onChange={v => setEditExp({...editExp, startDate: v})} />
                                  <MonthYearPicker label="End" value={editExp.endDate || exp.endDate} onChange={v => setEditExp({...editExp, endDate: v})} allowPresent />
                              </div>
                              <textarea value={editExp.description || exp.description} onChange={e => setEditExp({...editExp, description: e.target.value})} className="w-full bg-bg-deep border border-divider rounded p-3 text-xs text-white" rows={3} />
                              <div className="flex gap-2">
                                <button onClick={handleUpdateExperience} className="px-4 py-2 bg-primary text-white text-xs font-bold rounded flex-1">Commit Changes</button>
                                <button onClick={() => setEditingExpId(null)} className="px-4 py-2 bg-white/5 text-white text-xs font-bold rounded">Cancel</button>
                              </div>
                           </div>
                        ) : (
                           <div className="flex justify-between items-start">
                               <div>
                                   <h4 className="font-bold text-white text-lg">{exp.role}</h4>
                                   <p className="text-sm text-text-secondary">{exp.company} • {exp.startDate} to {exp.endDate}</p>
                                   <p className="text-xs text-text-secondary mt-2">{exp.description}</p>
                               </div>
                               <div className="flex gap-2">
                                   <button onClick={() => { setEditingExpId(exp.id); setEditExp(exp); setExpError(null); }} className="text-text-secondary hover:text-white"><Pencil size={14}/></button>
                                   <button onClick={() => setDeleteConfirmId(exp.id)} className="text-text-secondary hover:text-red-400"><Trash2 size={14}/></button>
                               </div>
                           </div>
                        )}
                     </div>
                 ))}
            </main>
        </div>
    );
}

function MetricCard({ icon, label, children, isEditing }: { icon: React.ReactNode, label: string, children: React.ReactNode, isEditing: boolean }) {
    return (
        <div className={cn(
            "bg-bg-card border border-divider p-5 rounded-xl flex flex-col justify-center min-h-[110px] transition-all duration-300",
            isEditing ? "border-primary/30 bg-primary/5" : "hover:border-white/10"
        )}>
            <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-bg-deep flex items-center justify-center border border-divider">
                    {icon}
                </div>
                <span className="text-[9px] font-black text-text-secondary uppercase tracking-[0.2em]">{label}</span>
            </div>
            <div className="flex items-end">
                {children}
            </div>
        </div>
    );
}
