import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile, Experience } from '../types';
import { useAuth } from '../hooks/useAuth';
import { profileService } from '../services/profileService';
import { Save, Mail, Github, Linkedin, GraduationCap, Edit3, Shield, User, Clock, Globe, Plus, Trash2, Pencil, Check } from 'lucide-react';
import { FormInput } from '../components/ui/FormInput';
import { MonthYearPicker } from '../components/ui/MonthYearPicker';

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
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isAddingExp, setIsAddingExp] = useState(false);
    const [editingExpId, setEditingExpId] = useState<string | null>(null);
    const [newExp, setNewExp] = useState<Partial<Experience>>({});
    const [editExp, setEditExp] = useState<Partial<Experience>>({});
    const { token, logout } = useAuth();

    useEffect(() => {
        const loadData = async () => {
            if (!token) { setIsLoading(false); return; }
            try {
                const [p, e] = await Promise.all([profileService.fetchProfile(token), profileService.fetchExperiences(token)]);
                setProfile(p); setExperiences(e);
            } catch (err) { logout(); navigate('/login'); } finally { setIsLoading(false); }
        };
        loadData();
    }, [token, logout, navigate]);

    const handleSave = async () => {
        setIsSaving(true);
        await profileService.updateProfile(profile!, token!);
        setIsEditing(false); setIsSaving(false);
    };

    const handleUpdateExperience = async () => {
        if (!editingExpId) return;
        setIsSaving(true);
        const updated = await profileService.updateExperience(editingExpId, editExp as any, token!);
        setExperiences(experiences.map(e => e.id === editingExpId ? updated : e));
        setEditingExpId(null); setIsSaving(false);
    };

    if (isLoading || !profile) return <div className="p-24 text-center text-white">Loading...</div>;

    return (
        <div className="animate-in fade-in duration-700 max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-12">
            {/* Sidebar Name Card */}
            <aside className="space-y-6">
                <div className="bg-bg-card border border-divider p-6 rounded-lg space-y-6 sticky top-24">
                    <div className="text-center">
                        <div className="w-24 h-24 mx-auto bg-slate-900 rounded-full flex items-center justify-center text-4xl font-black text-white">{profile.firstName.charAt(0)}</div>
                        <h3 className="mt-4 font-black text-xl text-white uppercase">{profile.firstName} {profile.lastName}</h3>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-divider">
                        <FormInput label="Email" value={profile.email} onChange={v => setProfile({...profile, email: v})} isEditing={isEditing} icon={<Mail size={14}/>} />
                        <FormInput label="Years of Exp" value={profile.yearsOfExperience} onChange={v => setProfile({...profile, yearsOfExperience: parseInt(v)})} isEditing={isEditing} type="number" icon={<Clock size={14}/>} />
                        <FormInput label="Country" value={profile.country} onChange={v => setProfile({...profile, country: v})} isEditing={isEditing} type="select" options={COUNTRY_OPTIONS} icon={<Globe size={14}/>} />
                        <FormInput label="Education" value={profile.education} onChange={v => setProfile({...profile, education: v})} isEditing={isEditing} icon={<GraduationCap size={14}/>} />
                        <FormInput label="Visa" value={profile.visaStatus} onChange={v => setProfile({...profile, visaStatus: v})} isEditing={isEditing} icon={<Shield size={14}/>} />
                        <FormInput label="LinkedIn" value={profile.linkedinUrl} onChange={v => setProfile({...profile, linkedinUrl: v})} isEditing={isEditing} icon={<Linkedin size={14}/>} />
                        <FormInput label="GitHub" value={profile.githubUrl} onChange={v => setProfile({...profile, githubUrl: v})} isEditing={isEditing} icon={<Github size={14}/>} />
                    </div>

                    <button onClick={() => isEditing ? handleSave() : setIsEditing(true)} className="w-full py-3 bg-primary text-white rounded font-bold text-[10px] uppercase">
                        {isEditing ? 'Save Profile' : 'Edit Profile'}
                    </button>
                </div>
            </aside>

            {/* Main Content: Experience */}
            <main className="space-y-8">
                 <div className="flex justify-between items-center pb-4 border-b border-divider">
                     <h2 className="text-sm font-black text-white uppercase tracking-[0.3em]">Work History</h2>
                     <button onClick={() => setIsAddingExp(true)} className="text-primary"><Plus size={18} /></button>
                 </div>
                 {experiences.map(exp => (
                     <div key={exp.id} className="bg-bg-card border border-divider p-6 rounded-lg">
                        {editingExpId === exp.id ? (
                           <div className="space-y-4">
                              <FormInput label="Company" value={editExp.company || exp.company} onChange={v => setEditExp({...editExp, company: v})} />
                              <FormInput label="Role" value={editExp.role || exp.role} onChange={v => setEditExp({...editExp, role: v})} />
                              <button onClick={handleUpdateExperience} className="px-4 py-2 bg-primary text-white text-xs font-bold rounded">Commit</button>
                           </div>
                        ) : (
                           <div className="flex justify-between items-start">
                               <div>
                                   <h4 className="font-bold text-white text-lg">{exp.role}</h4>
                                   <p className="text-sm text-text-secondary">{exp.company}</p>
                                   <p className="text-xs text-text-secondary mt-2">{exp.description}</p>
                               </div>
                               <div className="flex gap-2">
                                   <button onClick={() => setEditingExpId(exp.id)} className="text-text-secondary hover:text-white"><Pencil size={14}/></button>
                                   <button onClick={() => {}} className="text-text-secondary hover:text-red-400"><Trash2 size={14}/></button>
                               </div>
                           </div>
                        )}
                     </div>
                 ))}
            </main>
        </div>
    );
}
