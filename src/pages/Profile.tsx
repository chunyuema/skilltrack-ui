import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { useAuth } from '../hooks/useAuth';
import { profileService } from '../services/profileService';
import { Save, MapPin, Mail, Phone, Github, Linkedin, GraduationCap } from 'lucide-react';

export default function Profile() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
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

    if (isLoading) {
        return <div>Loading profile...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!profile) {
        return <div>No profile data found.</div>;
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (profile) {
            setProfile(prev => prev ? { ...prev, [name]: value } : null);
        }
    };

    const handleSave = () => {
        if (profile) {
            console.log('Saving profile:', profile);
            setIsEditing(false);
        }
    };
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Profile</h1>
                    <p className="text-slate-500 mt-1">Manage your personal and professional details</p>
                </div>
                <button
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors ${isEditing
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                >
                    <Save size={18} />
                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                <div className="px-8 pb-8">
                    <div className="relative -mt-12 mb-6">
                        <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg inline-block">
                            <div className="w-full h-full bg-slate-100 rounded-xl flex items-center justify-center text-3xl font-bold text-indigo-600">
                                {profile.fullName.charAt(0)}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                        {/* Basic Info */}
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">Basic Information</h2>

                            <Field label="Full Name" name="fullName" value={profile.fullName} isEditing={isEditing} onChange={handleChange} />
                            <Field label="Professional Title" name="title" value={profile.title} isEditing={isEditing} onChange={handleChange} />
                            <Field label="Bio" name="bio" value={profile.bio} isEditing={isEditing} onChange={handleChange} type="textarea" />

                            <Field label="Years of Exp" name="yearsOfExperience" value={profile.yearsOfExperience} isEditing={isEditing} onChange={handleChange} type="number" />
                            <Field label="Visa Status" name="visaStatus" value={profile.visaStatus} isEditing={isEditing} onChange={handleChange} />
                        </div>

                        {/* Contact & Social */}
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">Contact & Links</h2>

                            <Field
                                label="Email"
                                name="email"
                                value={profile.email}
                                isEditing={isEditing}
                                onChange={handleChange}
                                icon={<Mail size={16} />}
                            />
                            <Field
                                label="Phone"
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
                                label="GitHub URL"
                                name="githubUrl"
                                value={profile.githubUrl}
                                isEditing={isEditing}
                                onChange={handleChange}
                                icon={<Github size={16} />}
                            />
                            <Field
                                label="LinkedIn URL"
                                name="linkedinUrl"
                                value={profile.linkedinUrl}
                                isEditing={isEditing}
                                onChange={handleChange}
                                icon={<Linkedin size={16} />}
                            />
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
        <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                {icon}
                {label}
            </label>
            {isEditing ? (
                type === 'textarea' ? (
                    <textarea
                        name={name}
                        value={value}
                        onChange={onChange}
                        rows={3}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                ) : (
                    <input
                        type={type}
                        name={name}
                        value={value}
                        onChange={onChange}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                )
            ) : (
                <div className={`text-slate-900 ${type === 'textarea' ? 'whitespace-pre-wrap' : ''} font-medium`}>
                    {value || <span className="text-slate-400 italic">Not set</span>}
                </div>
            )}
        </div>
    );
}
