import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { useAuth } from '../hooks/useAuth';
import { profileService } from '../services/profileService';
import { Save, MapPin, Mail, Phone, Github, Linkedin, GraduationCap, Edit3, Terminal } from 'lucide-react';

export default function Profile() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const { token } = useAuth();

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
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, [token]);

    const handleSave = async () => {
        if (profile && token) {
            setIsSaving(true);
            try {
                await profileService.updateProfile(profile, token);
                setIsEditing(false);
            } catch (error) {
                console.error("Failed to save profile:", error);
            } finally {
                setIsSaving(false);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4 font-mono">
                <div className="w-10 h-10 border-2 border-slate-800 border-t-sky-500 rounded-full animate-spin"></div>
                <p className="text-sky-500/50 text-[10px] tracking-[0.3em]">FETCHING_IDENTITY...</p>
            </div>
        );
    }

    if (error) return <div className="text-red-400 p-6 bg-red-900/10 rounded border border-red-900/20 font-mono text-xs uppercase tracking-widest">[ ERROR ] {error}</div>;
    if (!profile) return <div className="text-slate-500 font-mono text-xs uppercase tracking-widest">[ NO_DATA ]</div>;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (profile) {
            setProfile(prev => prev ? { ...prev, [name]: value } : null);
        }
    };

    return (
        <div className="space-y-10">
            <div className="flex justify-between items-end border-b border-slate-800 pb-8">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Terminal size={14} className="text-sky-500" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] font-mono">Profile Details</span>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase font-mono">Profile</h1>
                </div>
                <button
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    disabled={isSaving}
                    className={`flex items-center gap-2 px-6 py-2 rounded font-mono text-[11px] font-bold uppercase tracking-widest transition-all ${isEditing
                        ? 'bg-sky-600 text-white hover:bg-sky-500'
                        : 'bg-slate-900 border border-slate-700 text-sky-400 hover:bg-slate-800'
                        } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {isEditing ? <Save size={14} /> : <Edit3 size={14} />}
                    {isEditing ? (isSaving ? 'Saving...' : 'Save Changes') : 'Edit Profile'}
                </button>
            </div>

            <div className="bg-bg-card rounded-xl border border-slate-800/80 overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-sky-500/50 to-transparent"></div>
                <div className="px-10 pb-10 pt-12">
                    <div className="flex flex-col md:flex-row gap-10 items-start mb-12">
                        <div className="w-32 h-32 rounded bg-slate-900 p-1 shadow-2xl flex-shrink-0 border border-slate-800">
                            <div className="w-full h-full bg-slate-800 rounded flex items-center justify-center text-5xl font-black text-sky-500 font-mono border border-sky-500/20">
                                {profile.firstName.charAt(0)}
                            </div>
                        </div>
                        <div className="flex-1 space-y-4">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-sky-500 uppercase tracking-[0.2em] font-mono">User ID: {profile.email.split('@')[0].toUpperCase()}</p>
                                <h2 className="text-3xl font-black text-white uppercase tracking-tighter font-mono">{profile.firstName} {profile.lastName}</h2>
                            </div>
                            <p className="text-slate-400 font-medium text-lg border-l-2 border-slate-800 pl-4">{profile.title}</p>
                            <div className="flex flex-wrap gap-3">
                                <div className="flex items-center gap-2 px-3 py-1 bg-slate-900/50 rounded border border-slate-800 text-[11px] font-bold text-slate-500 font-mono">
                                    <MapPin size={12} className="text-sky-600" />
                                    {profile.location}
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1 bg-slate-900/50 rounded border border-slate-800 text-[11px] font-bold text-slate-500 font-mono">
                                    <Terminal size={12} className="text-sky-600" />
                                    Experience: {profile.yearsOfExperience}Y
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-12">
                        {/* Basic Info */}
                        <div className="space-y-8">
                            <h3 className="text-xs font-black text-slate-600 uppercase tracking-[0.3em] font-mono border-b border-slate-800/50 pb-3">Personal Information</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {isEditing ? (
                                    <>
                                        <Field label="First Name" name="firstName" value={profile.firstName} isEditing={true} onChange={handleChange} />
                                        <Field label="Last Name" name="lastName" value={profile.lastName} isEditing={true} onChange={handleChange} />
                                    </>
                                ) : null}
                            </div>
                            <Field label="Professional Title" name="title" value={profile.title} isEditing={isEditing} onChange={handleChange} />
                            <Field label="About Me" name="bio" value={profile.bio} isEditing={isEditing} onChange={handleChange} type="textarea" />

                            <div className="grid grid-cols-2 gap-6">
                                <Field label="Years of Experience" name="yearsOfExperience" value={profile.yearsOfExperience} isEditing={isEditing} onChange={handleChange} type="number" />
                                <Field label="Visa Status" name="visaStatus" value={profile.visaStatus} isEditing={isEditing} onChange={handleChange} />
                            </div>
                        </div>

                        {/* Contact & Social */}
                        <div className="space-y-8">
                            <h3 className="text-xs font-black text-slate-600 uppercase tracking-[0.3em] font-mono border-b border-slate-800/50 pb-3">Contact Details</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <Field
                                    label="Email"
                                    name="email"
                                    value={profile.email}
                                    isEditing={isEditing}
                                    onChange={handleChange}
                                    icon={<Mail size={14} />}
                                />
                                <Field
                                    label="Phone"
                                    name="phone"
                                    value={profile.phone}
                                    isEditing={isEditing}
                                    onChange={handleChange}
                                    icon={<Phone size={14} />}
                                />
                                <Field
                                    label="Location"
                                    name="location"
                                    value={profile.location}
                                    isEditing={isEditing}
                                    onChange={handleChange}
                                    icon={<MapPin size={14} />}
                                />
                                <Field
                                    label="Education"
                                    name="education"
                                    value={profile.education}
                                    isEditing={isEditing}
                                    onChange={handleChange}
                                    icon={<GraduationCap size={14} />}
                                />
                                <Field
                                    label="GitHub Profile"
                                    name="githubUrl"
                                    value={profile.githubUrl}
                                    isEditing={isEditing}
                                    onChange={handleChange}
                                    icon={<Github size={14} />}
                                />
                                <Field
                                    label="LinkedIn Profile"
                                    name="linkedinUrl"
                                    value={profile.linkedinUrl}
                                    isEditing={isEditing}
                                    onChange={handleChange}
                                    icon={<Linkedin size={14} />}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface FieldProps {
    label: string;
    name: string;
    value: string | number;
    isEditing: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    type?: 'text' | 'textarea' | 'number';
    icon?: React.ReactNode;
}

function Field({ label, name, value, isEditing, onChange, type = 'text', icon }: FieldProps) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2 font-mono">
                {icon}
                {label}
            </label>
            {isEditing ? (
                type === 'textarea' ? (
                    <textarea
                        name={name}
                        value={value}
                        onChange={onChange}
                        rows={4}
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-500/30 focus:border-sky-500 transition-all text-xs font-mono leading-relaxed"
                    />
                ) : (
                    <input
                        type={type}
                        name={name}
                        value={value}
                        onChange={onChange}
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-500/30 focus:border-sky-500 transition-all text-xs font-mono"
                    />
                )
            ) : (
                <div className={`text-slate-200 ${type === 'textarea' ? 'whitespace-pre-wrap leading-relaxed' : ''} font-bold text-xs bg-slate-900/30 px-4 py-2.5 rounded border border-slate-800/40 font-mono`}>
                    {value || <span className="text-slate-700 italic font-normal tracking-widest">NULL</span>}
                </div>
            )}
        </div>
    );
}
