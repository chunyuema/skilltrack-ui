import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile, Experience } from '../types';
import { useAuth } from '../hooks/useAuth';
import { profileService } from '../services/profileService';
import { Save, Mail, Github, Linkedin, GraduationCap, Edit3, Shield, User, Clock, Globe, Briefcase, Calendar, Building, Plus, Check, Trash2, Pencil } from 'lucide-react';
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
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isAddingExp, setIsAddingExp] = useState(false);
    const [editingExpId, setEditingExpId] = useState<string | null>(null);
    const [newExp, setNewExp] = useState<Partial<Experience>>({});
    const [editExp, setEditExp] = useState<Partial<Experience>>({});
    const { token, logout } = useAuth();

    useEffect(() => {
        const loadData = async () => {
            if (!token) {
                setIsLoading(false);
                setError("No authentication token found.");
                return;
            }

            try {
                const [userProfile, expData] = await Promise.all([
                    profileService.fetchProfile(token),
                    profileService.fetchExperiences(token)
                ]);
                setProfile(userProfile);
                setExperiences(expData);
            } catch (err) {
                if (err instanceof Error && err.message === 'Unauthorized') {
                    logout();
                    navigate('/login');
                } else {
                    setError(err instanceof Error ? err.message : 'An unknown error occurred');
                }
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [token, logout, navigate]);

    const handleSaveProfile = async () => {
        if (profile && token) {
            setIsSaving(true);
            try {
                await profileService.updateProfile(profile, token);
                setIsEditing(false);
            } catch (err) {
                if (err instanceof Error && err.message === 'Unauthorized') {
                    logout();
                    navigate('/login');
                }
            } finally {
                setIsSaving(false);
            }
        }
    };

    const handleAddExperience = async () => {
        if (!token || !newExp.company || !newExp.role) return;
        try {
            setIsSaving(true);
            const experience = { company: newExp.company!, role: newExp.role!, startDate: newExp.startDate || '', endDate: newExp.endDate || 'Present', description: newExp.description || '', technologies: newExp.technologies || [] };
            const savedExp = await profileService.addExperience(experience, token);
            setExperiences([savedExp, ...experiences]);
            setIsAddingExp(false);
            setNewExp({});
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdateExperience = async () => {
        if (!token || !editingExpId || !editExp.company || !editExp.role) return;
        try {
            setIsSaving(true);
            const updatedExp = await profileService.updateExperience(editingExpId, editExp as any, token);
            setExperiences(experiences.map(exp => exp.id === editingExpId ? updatedExp : exp));
            setEditingExpId(null);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteExperience = async (id: string) => {
        if (!token) return;
        try {
            await profileService.deleteExperience(id, token);
            setExperiences(experiences.filter(exp => exp.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    if (isLoading) return <div className="p-24 text-center">Loading...</div>;
    if (!profile) return <div className="p-24 text-center">No profile found.</div>;

    return (
        <div className="animate-in fade-in duration-700 max-w-xl mx-auto space-y-8">
            <div className="bg-bg-card border border-divider p-6 rounded-lg space-y-6">
                <div className="text-center">
                    <div className="w-20 h-20 mx-auto bg-slate-900 rounded-full flex items-center justify-center text-3xl font-black text-white">{profile.firstName.charAt(0)}</div>
                    <h3 className="mt-4 font-black text-xl text-white uppercase">{profile.firstName} {profile.lastName}</h3>
                </div>

                <div className="space-y-4 pt-4 border-t border-divider">
                    <FormInput label="Email" value={profile.email} onChange={v => setProfile({...profile, email: v})} isEditing={isEditing} icon={<Mail size={14}/>} />
                    <FormInput label="Country" value={profile.country} onChange={v => setProfile({...profile, country: v})} isEditing={isEditing} type="select" options={COUNTRY_OPTIONS} icon={<Globe size={14}/>} />
                    {/* ... (other fields) ... */}
                </div>

                <button onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)} className="w-full py-3 bg-primary text-white rounded font-bold text-[10px] uppercase">
                    {isEditing ? 'Save Profile' : 'Edit Profile'}
                </button>
            </div>

            <div className="bg-bg-card border border-divider p-6 rounded-lg space-y-6">
                 <div className="flex justify-between items-center pb-4 border-b border-divider">
                     <h2 className="text-xs font-black text-white uppercase tracking-[0.3em]">Work History</h2>
                     <button onClick={() => setIsAddingExp(true)}><Plus size={16} /></button>
                 </div>
                 {experiences.map(exp => (
                     <div key={exp.id} className="border-b border-divider py-4">
                         <div className="flex justify-between items-start">
                             <div>
                                 <h4 className="font-bold text-white">{exp.role}</h4>
                                 <p className="text-xs text-text-secondary">{exp.company}</p>
                             </div>
                             <div className="flex gap-2">
                                 <button onClick={() => setEditingExpId(exp.id)}><Pencil size={14}/></button>
                                 <button onClick={() => handleDeleteExperience(exp.id)}><Trash2 size={14}/></button>
                             </div>
                         </div>
                     </div>
                 ))}
            </div>
        </div>
    );
}
