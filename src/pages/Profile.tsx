import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '../types';
import { useAuth } from '../hooks/useAuth';
import { profileService } from '../services/profileService';
import { Save, Mail, Github, Linkedin, GraduationCap, Edit3, Shield, User, Clock, Globe } from 'lucide-react';
import { FormInput } from '../components/ui/FormInput';

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
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const { token, logout } = useAuth();

    useEffect(() => {
        const fetchProfileData = async () => {
            if (!token) {
                setIsLoading(false);
                setError("No authentication token found.");
                return;
            }

            try {
                const userProfile = await profileService.fetchProfile(token);
                setProfile(userProfile);
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

        fetchProfileData();
    }, [token, logout, navigate]);

    const handleSave = async () => {
        if (profile && token) {
            setIsSaving(true);
            try {
                await profileService.updateProfile(profile, token);
                setIsEditing(false);
            } catch (err) {
                if (err instanceof Error && err.message === 'Unauthorized') {
                    logout();
                    navigate('/login');
                } else {
                    console.error("Failed to save profile:", err);
                }
            } finally {
                setIsSaving(false);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) return <div className="text-red-400 p-6 bg-red-900/10 rounded-2xl border border-red-900/20 font-bold uppercase tracking-widest text-xs">{error}</div>;
    if (!profile) return <div className="text-slate-500 font-bold uppercase tracking-widest text-xs">No profile data found.</div>;

    const handleFieldChange = (name: string, value: string | number) => {
        if (profile) {
            setProfile(prev => prev ? { ...prev, [name]: value } : null);
        }
    };

    return (
        <div className="animate-in fade-in duration-700 max-w-xl mx-auto">
            {/* Unified Sidebar Card */}
            <aside className="space-y-6">
                <div className="bg-bg-card border border-divider p-6 rounded-lg space-y-6">
                    <div className="space-y-4 text-center">
                        <div className="w-20 h-20 mx-auto bg-slate-900 border-2 border-divider rounded-full flex items-center justify-center text-3xl font-black text-white shadow-inner">
                            {profile.firstName.charAt(0)}
                        </div>
                        <div className="space-y-1">
                            {isEditing ? (
                                <div className="grid grid-cols-2 gap-2">
                                    <input 
                                        value={profile.firstName} 
                                        onChange={(e) => handleFieldChange("firstName", e.target.value)} 
                                        className="w-full bg-bg-deep border border-divider rounded px-2 py-1 text-center text-sm text-white"
                                    />
                                    <input 
                                        value={profile.lastName} 
                                        onChange={(e) => handleFieldChange("lastName", e.target.value)} 
                                        className="w-full bg-bg-deep border border-divider rounded px-2 py-1 text-center text-sm text-white"
                                    />
                                </div>
                            ) : (
                                <h3 className="font-black text-xl text-white uppercase tracking-tight">{profile.firstName} {profile.lastName}</h3>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-divider">
                        <FormInput 
                            label="Email" 
                            name="email" 
                            value={profile.email} 
                            isEditing={isEditing} 
                            onChange={val => handleFieldChange("email", val)} 
                            icon={<Mail size={14} />} 
                        />
                        <FormInput 
                            label="Years of Exp" 
                            name="yearsOfExperience" 
                            value={profile.yearsOfExperience} 
                            isEditing={isEditing} 
                            onChange={val => handleFieldChange("yearsOfExperience", val)} 
                            type="number" 
                            icon={<Clock size={14} />} 
                        />
                        <FormInput 
                            label="Country" 
                            name="country" 
                            value={profile.country} 
                            isEditing={isEditing} 
                            onChange={val => handleFieldChange("country", val)} 
                            type="select"
                            options={COUNTRY_OPTIONS}
                            icon={<Globe size={14} />} 
                        />
                        <FormInput 
                            label="Education" 
                            name="education" 
                            value={profile.education} 
                            isEditing={isEditing} 
                            onChange={val => handleFieldChange("education", val)} 
                            icon={<GraduationCap size={14} />} 
                        />
                        <FormInput 
                            label="Visa" 
                            name="visaStatus" 
                            value={profile.visaStatus} 
                            isEditing={isEditing} 
                            onChange={val => handleFieldChange("visaStatus", val)} 
                            icon={<Shield size={14} />} 
                        />
                        <FormInput 
                            label="LinkedIn" 
                            name="linkedinUrl" 
                            value={profile.linkedinUrl} 
                            isEditing={isEditing} 
                            onChange={val => handleFieldChange("linkedinUrl", val)} 
                            icon={<Linkedin size={14} />} 
                        />
                        <FormInput 
                            label="GitHub" 
                            name="githubUrl" 
                            value={profile.githubUrl} 
                            isEditing={isEditing} 
                            onChange={val => handleFieldChange("githubUrl", val)} 
                            icon={<Github size={14} />} 
                        />
                        {isEditing ? (
                            <div className="space-y-2">
                                <label className="text-[10px] font-mono font-bold text-text-secondary uppercase tracking-[0.2em]">Bio</label>
                                <textarea
                                    value={profile.bio || ''}
                                    onChange={(e) => handleFieldChange("bio", e.target.value)}
                                    rows={4}
                                    className="w-full px-3 py-2 bg-bg-deep border border-divider rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary transition-all resize-none leading-relaxed"
                                />
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-mono font-bold text-text-secondary uppercase tracking-[0.2em]">Bio</h4>
                                <p className="text-xs text-white leading-relaxed font-medium whitespace-pre-wrap">{profile.bio || "No bio added."}</p>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                        disabled={isSaving}
                        className={`w-full flex items-center justify-center gap-2 px-5 py-3 rounded font-bold text-[10px] uppercase tracking-widest transition-all ${isEditing
                            ? 'bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/20'
                            : 'bg-white/[0.03] border border-divider text-text-secondary hover:text-white hover:bg-white/[0.08]'
                            } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isEditing ? <Save size={14} /> : <Edit3 size={14} />}
                        {isEditing ? (isSaving ? 'Saving...' : 'Save') : 'Edit Profile'}
                    </button>
                </div>
            </aside>
        </div>
    );
}
