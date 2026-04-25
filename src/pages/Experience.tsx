import { useState, useEffect } from 'react';
import { Experience, UserProfile } from '../types';
import { Plus, Trash2, Calendar, Building, Briefcase, Loader2, Pencil, X, Check, Globe, User, Edit3, Save } from 'lucide-react';
import { profileService } from '../services/profileService';
import { useAuth } from '../hooks/useAuth';

export default function ExperiencePage() {
    const { token } = useAuth();
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [newExp, setNewExp] = useState<Partial<Experience>>({});
    const [editExp, setEditExp] = useState<Partial<Experience>>({});
    
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [bioText, setBioText] = useState('');

    useEffect(() => {
        const loadData = async () => {
            if (!token) return;
            try {
                setIsLoading(true);
                const [expData, profileData] = await Promise.all([
                    profileService.fetchExperiences(token),
                    profileService.fetchProfile(token)
                ]);
                setExperiences(expData);
                setProfile(profileData);
                setBioText(profileData.bio);
                setError(null);
            } catch (err) {
                console.error('Error loading data:', err);
                setError('Failed to load professional data.');
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [token]);

    const handleSaveBio = async () => {
        if (!profile || !token) return;
        try {
            setIsSaving(true);
            const updatedProfile = { ...profile, bio: bioText };
            await profileService.updateProfile(updatedProfile, token);
            setProfile(updatedProfile);
            setIsEditingBio(false);
        } catch (err) {
            console.error('Failed to update bio:', err);
            alert('Failed to save bio.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!token) return;
        if (confirm('Are you sure you want to delete this experience record?')) {
            try {
                await profileService.deleteExperience(id, token);
                setExperiences(experiences.filter(exp => exp.id !== id));
            } catch (err) {
                console.error('Error deleting experience:', err);
                alert('Failed to delete experience.');
            }
        }
    };

    const handleAdd = async () => {
        if (!token || !newExp.company || !newExp.role) return;

        try {
            setIsSaving(true);
            const experience: Omit<Experience, 'id'> = {
                company: newExp.company,
                role: newExp.role,
                startDate: newExp.startDate || '',
                endDate: newExp.endDate || 'Present',
                description: newExp.description || '',
                technologies: newExp.technologies || [],
            };

            const savedExp = await profileService.addExperience(experience, token);
            setExperiences([savedExp, ...experiences]);
            setIsAdding(false);
            setNewExp({});
        } catch (err) {
            console.error('Error adding experience:', err);
            alert('Failed to save experience.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleEdit = (exp: Experience) => {
        setEditingId(exp.id);
        setEditExp({ ...exp });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditExp({});
    };

    const handleUpdate = async () => {
        if (!token || !editingId || !editExp.company || !editExp.role) return;

        try {
            setIsSaving(true);
            const updatedExp = await profileService.updateExperience(editingId, editExp, token);
            setExperiences(experiences.map(exp => exp.id === editingId ? updatedExp : exp));
            setEditingId(null);
            setEditExp({});
        } catch (err) {
            console.error('Error updating experience:', err);
            alert('Failed to update experience.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Compact Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-6 border-b border-divider">
                <div className="flex items-center gap-4">
                    <div className="pill flex items-center gap-1.5">
                        <Briefcase size={12} />
                        Experience
                    </div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-tight">Work History</h1>
                </div>
                <button
                    onClick={() => {
                        setIsAdding(true);
                        setEditingId(null);
                    }}
                    className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded font-black text-[10px] uppercase tracking-widest hover:bg-primary-hover shadow-lg shadow-primary/20 active:scale-95 transition-all"
                >
                    <Plus size={14} />
                    Add Position
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 lg:gap-20">
                {/* Main Content */}
                <div className="space-y-4">
                    {error && (
                        <div className="bg-red-900/10 text-red-400 p-6 rounded-lg border border-red-900/20 text-xs font-bold uppercase tracking-widest mb-8">
                            {error}
                        </div>
                    )}

                    {isAdding && (
                        <div className="bg-bg-card p-10 rounded-lg border border-primary/30 shadow-2xl animate-in slide-in-from-top-4 duration-500 mb-12">
                            <h3 className="text-xs font-black text-white uppercase tracking-[0.3em] mb-10 border-b border-divider pb-4">Initialize New Record</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Organization</label>
                                    <input
                                        placeholder="Company Name"
                                        className="w-full px-5 py-4 bg-bg-deep border border-divider rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-base"
                                        value={newExp.company || ''}
                                        onChange={e => setNewExp({ ...newExp, company: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Role ID</label>
                                    <input
                                        placeholder="Role Title"
                                        className="w-full px-5 py-4 bg-bg-deep border border-divider rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-base"
                                        value={newExp.role || ''}
                                        onChange={e => setNewExp({ ...newExp, role: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Start Date</label>
                                    <input
                                        type="month"
                                        className="w-full px-5 py-4 bg-bg-deep border border-divider rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-base"
                                        value={newExp.startDate || ''}
                                        onChange={e => setNewExp({ ...newExp, startDate: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">End Date</label>
                                    <input
                                        type="text"
                                        placeholder="YYYY-MM or 'Present'"
                                        className="w-full px-5 py-4 bg-bg-deep border border-divider rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-base"
                                        value={newExp.endDate || ''}
                                        onChange={e => setNewExp({ ...newExp, endDate: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2 mb-8">
                                <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Job Description</label>
                                <textarea
                                    placeholder="Impact summary..."
                                    className="w-full px-5 py-4 bg-bg-deep border border-divider rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-base h-32 leading-relaxed"
                                    value={newExp.description || ''}
                                    onChange={e => setNewExp({ ...newExp, description: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2 mb-10">
                                <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Tech Stack (comma separated)</label>
                                <input
                                    placeholder="React, AWS, Node, etc."
                                    className="w-full px-5 py-4 bg-bg-deep border border-divider rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-base"
                                    value={Array.isArray(newExp.technologies) ? newExp.technologies.join(', ') : ''}
                                    onChange={e => setNewExp({ ...newExp, technologies: e.target.value.split(',').map(t => t.trim()).filter(t => t !== '') })}
                                />
                            </div>
                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={() => setIsAdding(false)}
                                    className="px-8 py-4 text-text-secondary hover:text-white font-black text-xs uppercase tracking-[0.2em] transition-all"
                                    disabled={isSaving}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAdd}
                                    disabled={isSaving}
                                    className="flex items-center gap-2 px-10 py-4 bg-primary text-white rounded-md font-black text-sm uppercase tracking-widest hover:bg-primary-hover shadow-xl shadow-primary/20"
                                >
                                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                                    {isSaving ? 'Saving...' : 'Save Position'}
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="divide-y divide-divider border-t border-divider">
                        {experiences.map((exp) => (
                            <div key={exp.id} className="card-row py-12 px-2 group relative">
                                {editingId === exp.id ? (
                                     <div className="bg-bg-card p-10 rounded-lg border border-primary/30 shadow-2xl animate-in slide-in-from-top-4 duration-500">
                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                            <FieldSmall label="Org" value={editExp.company || ''} onChange={val => setEditExp({...editExp, company: val})} />
                                            <FieldSmall label="Role" value={editExp.role || ''} onChange={val => setEditExp({...editExp, role: val})} />
                                            <FieldSmall label="Start" value={editExp.startDate || ''} onChange={val => setEditExp({...editExp, startDate: val})} />
                                            <FieldSmall label="End" value={editExp.endDate || ''} onChange={val => setEditExp({...editExp, endDate: val})} />
                                         </div>
                                         <div className="space-y-2 mb-8">
                                            <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Mission Log</label>
                                            <textarea
                                                className="w-full px-5 py-4 bg-bg-deep border border-divider rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-base h-32"
                                                value={editExp.description || ''}
                                                onChange={e => setEditExp({ ...editExp, description: e.target.value })}
                                            />
                                         </div>
                                         <div className="flex justify-end gap-4 pt-4">
                                            <button onClick={handleCancelEdit} className="px-6 py-3 text-text-secondary hover:text-white font-black text-xs uppercase tracking-widest">Abort</button>
                                            <button onClick={handleUpdate} className="px-8 py-3 bg-primary text-white rounded font-black text-xs uppercase tracking-widest hover:bg-primary-hover">Commit Patch</button>
                                         </div>
                                     </div>
                                ) : (
                                    <>
                                        <div className="absolute top-12 right-2 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all">
                                            <button
                                                onClick={() => handleEdit(exp)}
                                                className="p-2.5 text-text-secondary hover:text-white hover:bg-white/5 rounded transition-all border border-transparent hover:border-divider"
                                                title="Edit Node"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(exp.id)}
                                                className="p-2.5 text-text-secondary hover:text-red-400 hover:bg-red-500/5 rounded transition-all border border-transparent hover:border-red-900/20"
                                                title="Purge Node"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>

                                        <div className="flex flex-col md:flex-row gap-10">
                                            <div className="flex-shrink-0 pt-1">
                                                <div className="w-14 h-14 bg-bg-card rounded flex items-center justify-center text-primary border border-divider shadow-inner group-hover:border-primary/30 transition-colors">
                                                    <Building size={24} />
                                                </div>
                                            </div>

                                            <div className="flex-1 space-y-6">
                                                <div className="space-y-1">
                                                     <h3 className="text-2xl font-black text-white tracking-tight uppercase group-hover:text-primary transition-colors">{exp.role}</h3>
                                                     <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                                        <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest font-mono">
                                                            <Briefcase size={14} className="opacity-50" />
                                                            {exp.company}
                                                        </div>
                                                        <div className="w-1 h-1 bg-divider rounded-full hidden md:block"></div>
                                                        <div className="flex items-center gap-2 text-[11px] text-text-secondary font-bold font-mono uppercase tracking-[0.1em]">
                                                            <Calendar size={14} className="opacity-50 text-text-secondary" />
                                                            <span>{exp.startDate} — {exp.endDate}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <p className="text-text-secondary leading-relaxed font-medium text-lg max-w-3xl">{exp.description}</p>

                                                <div className="flex flex-wrap gap-2.5 pt-2">
                                                    {exp.technologies.map((tech, i) => (
                                                        <span key={i} className="pill font-mono">
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    {!isLoading && experiences.length === 0 && (
                        <div className="text-center py-32 bg-white/[0.02] rounded-lg border-2 border-dashed border-divider">
                            <p className="text-text-secondary font-black uppercase text-xs tracking-[0.3em]">No career nodes detected. Push record to begin.</p>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <aside className="space-y-8">
                     <div className="bg-bg-card border border-divider p-8 rounded-lg space-y-6">
                        <div className="flex justify-between items-center border-b border-divider pb-4">
                            <h4 className="font-black text-xs text-white uppercase tracking-[0.3em] flex items-center gap-2">
                                <User size={14} className="text-primary" />
                                About Me
                            </h4>
                            <button 
                                onClick={() => isEditingBio ? handleSaveBio() : setIsEditingBio(true)}
                                className="text-primary hover:text-white transition-colors"
                            >
                                {isEditingBio ? <Save size={14} /> : <Edit3 size={14} />}
                            </button>
                        </div>
                        
                        {isEditingBio ? (
                            <textarea 
                                value={bioText}
                                onChange={(e) => setBioText(e.target.value)}
                                rows={8}
                                className="w-full bg-bg-deep border border-divider rounded p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/40"
                            />
                        ) : (
                            <p className="text-sm leading-relaxed text-text-secondary font-medium italic">
                                "{profile?.bio || 'No professional summary provided.'}"
                            </p>
                        )}
                        
                        <div className="pt-4 border-t border-divider">
                            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                                <span>Verification Status</span>
                                <span className="text-emerald-accent">Active</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

function FieldSmall({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) {
    return (
        <div className="space-y-1.5">
            <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">{label}</label>
            <input
                className="w-full px-4 py-3 bg-bg-deep border border-divider rounded text-white focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all text-sm font-mono"
                value={value}
                onChange={e => onChange(e.target.value)}
            />
        </div>
    );
}
