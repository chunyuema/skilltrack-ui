import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { useAuth } from '../hooks/useAuth';
import { profileService } from '../services/profileService';
import { Save, MapPin, Mail, Phone, Github, Linkedin, GraduationCap, Edit3, Shield } from 'lucide-react';

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
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) return <div className="text-red-400 p-6 bg-red-900/10 rounded-2xl border border-red-900/20 font-bold uppercase tracking-widest text-xs">{error}</div>;
    if (!profile) return <div className="text-slate-500 font-bold uppercase tracking-widest text-xs">No profile data found.</div>;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (profile) {
            setProfile(prev => prev ? { ...prev, [name]: value } : null);
        }
    };

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Compact Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-6 border-b border-divider">
                <div className="flex items-center gap-4">
                    <div className="pill-success flex items-center gap-1.5">
                        <Shield size={12} />
                        Verified
                    </div>
                    <h1 className="text-2xl font-black text-white tracking-tight">PROFILE</h1>
                </div>
                <button
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    disabled={isSaving}
                    className={`flex items-center gap-2 px-5 py-2 rounded font-bold text-[10px] uppercase tracking-widest transition-all ${isEditing
                        ? 'bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/20'
                        : 'bg-transparent border border-divider text-white hover:bg-white/[0.05]'
                        } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {isEditing ? <Save size={14} /> : <Edit3 size={14} />}
                    {isEditing ? (isSaving ? 'Saving...' : 'Save') : 'Edit Profile'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-12 lg:gap-20">
                {/* Sidebar Column */}
                <aside className="space-y-8">
                    <div className="bg-bg-card border border-divider p-8 rounded-lg space-y-8">
                        <div className="space-y-4 text-center">
                            <div className="w-24 h-24 mx-auto bg-slate-900 border-2 border-divider rounded-full flex items-center justify-center text-4xl font-black text-white shadow-inner">
                                {profile.firstName.charAt(0)}
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-black text-xl text-white uppercase tracking-tight">{profile.firstName}</h3>
                                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] font-mono">Tier: Senior Engineer</p>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-divider">
                             <SidebarStat label="Profile Strength" value="94%" />
                             <SidebarStat label="Skill Nodes" value="28" />
                             <SidebarStat label="Endorsements" value="12" />
                        </div>

                        <button className="w-full py-4 bg-white/[0.03] border border-divider rounded font-black text-[10px] uppercase tracking-[0.2em] text-text-secondary hover:text-white hover:bg-white/[0.08] transition-all">
                             Generate Resume PDF
                        </button>
                    </div>
                </aside>

                {/* Main Column */}
                <div className="space-y-16">
                    {/* Basic Info */}
                    <section className="space-y-10">
                        <div className="space-y-1">
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Personal Information</h2>
                            <div className="h-1 w-20 bg-primary/20"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {isEditing ? (
                                <>
                                    <Field label="First Name" name="firstName" value={profile.firstName} isEditing={true} onChange={handleChange} />
                                    <Field label="Last Name" name="lastName" value={profile.lastName} isEditing={true} onChange={handleChange} />
                                </>
                            ) : (
                                <div className="md:col-span-2">
                                    <Field label="Full Name" name="fullName" value={`${profile.firstName} ${profile.lastName}`} isEditing={false} onChange={handleChange} />
                                </div>
                            )}
                            <div className="md:col-span-2">
                                <Field label="Professional Title" name="title" value={profile.title} isEditing={isEditing} onChange={handleChange} />
                            </div>

                            <Field label="Years of Experience" name="yearsOfExperience" value={profile.yearsOfExperience} isEditing={isEditing} onChange={handleChange} type="number" />
                            <Field label="Visa Status" name="visaStatus" value={profile.visaStatus} isEditing={isEditing} onChange={handleChange} />
                        </div>
                    </section>

                    {/* Links */}
                    <section className="space-y-10">
                         <div className="space-y-1">
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Contact & Social</h2>
                            <div className="h-1 w-20 bg-primary/20"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Field
                                label="Email Address"
                                name="email"
                                value={profile.email}
                                isEditing={isEditing}
                                onChange={handleChange}
                                icon={<Mail size={16} />}
                            />
                            <Field
                                label="Phone Number"
                                name="phone"
                                value={profile.phone}
                                isEditing={isEditing}
                                onChange={handleChange}
                                icon={<Phone size={16} />}
                            />
                            <Field
                                label="Location"
                                name="location"
                                value={profile.location}
                                isEditing={isEditing}
                                onChange={handleChange}
                                icon={<MapPin size={16} />}
                            />
                            <Field
                                label="Education"
                                name="education"
                                value={profile.education}
                                isEditing={isEditing}
                                onChange={handleChange}
                                icon={<GraduationCap size={16} />}
                            />
                            <Field
                                label="GitHub Profile"
                                name="githubUrl"
                                value={profile.githubUrl}
                                isEditing={isEditing}
                                onChange={handleChange}
                                icon={<Github size={16} />}
                            />
                            <Field
                                label="LinkedIn Profile"
                                name="linkedinUrl"
                                value={profile.linkedinUrl}
                                isEditing={isEditing}
                                onChange={handleChange}
                                icon={<Linkedin size={16} />}
                            />
                        </div>
                    </section>
                </div>
            </div>

        </div>
    );
}

function SidebarStat({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-text-secondary uppercase tracking-wider">{label}</span>
            <span className="font-black text-white font-mono">{value}</span>
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
        <div className="space-y-3">
            <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] flex items-center gap-2">
                {icon}
                {label}
            </label>
            {isEditing ? (
                type === 'textarea' ? (
                    <textarea
                        name={name}
                        value={value}
                        onChange={onChange}
                        rows={5}
                        className="w-full px-5 py-4 bg-bg-deep border border-divider rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-base leading-relaxed"
                    />
                ) : (
                    <input
                        type={type}
                        name={name}
                        value={value}
                        onChange={onChange}
                        className="w-full px-5 py-4 bg-bg-deep border border-divider rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-base"
                    />
                )
            ) : (
                <div className={`text-white ${type === 'textarea' ? 'whitespace-pre-wrap leading-relaxed' : ''} font-bold text-xl tracking-tight`}>
                    {value || <span className="text-slate-700 italic font-normal tracking-widest text-sm">NULL</span>}
                </div>
            )}
        </div>
    );
}
