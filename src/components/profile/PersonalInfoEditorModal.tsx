import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { FormInput } from '../ui/FormInput';
import { Save, X, User, MapPin, Briefcase, Mail, Linkedin, Github, Shield } from 'lucide-react';
import { cn } from '../../lib/utils';

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

const VISA_STATUS_OPTIONS = [
  { label: 'Citizen', value: 'Citizen' },
  { label: 'Permanent Resident (PR)', value: 'Permanent Resident' },
  { label: 'Work Visa (Requires Sponsorship)', value: 'Work Visa (Sponsorship Required)' },
  { label: 'Work Visa (No Sponsorship Required)', value: 'Work Visa (No Sponsorship)' },
  { label: 'Spouse Visa', value: 'Spouse Visa' },
  { label: 'Student Visa', value: 'Student Visa' },
  { label: 'Other', value: 'Other' },
];

interface PersonalInfoEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (profile: UserProfile) => Promise<void>;
}

export function PersonalInfoEditorModal({ isOpen, onClose, profile: initialProfile, onSave }: PersonalInfoEditorModalProps) {
  const [profile, setProfile] = useState<UserProfile>({ ...initialProfile });
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(profile);
      onClose();
    } catch (error) {
      console.error("Failed to save personal info:", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 md:p-8 animate-in fade-in duration-300">
      <div className="bg-bg-card border border-divider w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="px-8 py-6 border-b border-divider flex justify-between items-center bg-white/[0.02]">
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tighter">Edit Personal Profile</h2>
            <p className="text-[10px] text-text-secondary font-bold uppercase tracking-[0.2em] mt-1">Manage your identity and professional metrics</p>
          </div>
          <button onClick={onClose} className="p-2 text-text-secondary hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-8">
              <div className="space-y-6">
                 <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-2">
                   <User size={12} />
                   Identity & Bio
                 </h3>
                 <div className="grid grid-cols-2 gap-4">
                    <FormInput label="First Name" value={profile.firstName} onChange={v => setProfile({...profile, firstName: v})} />
                    <FormInput label="Last Name" value={profile.lastName} onChange={v => setProfile({...profile, lastName: v})} />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">Professional Bio</label>
                    <textarea 
                      value={profile.bio} 
                      onChange={e => setProfile({...profile, bio: e.target.value})}
                      className="w-full bg-bg-deep border border-divider rounded-lg p-4 text-sm text-white leading-relaxed focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all h-32"
                      placeholder="Tell us about your professional journey..."
                    />
                 </div>
              </div>

              <div className="space-y-6">
                 <h3 className="text-[10px] font-black text-emerald-accent uppercase tracking-[0.3em] flex items-center gap-2">
                   <MapPin size={12} />
                   Location & Education
                 </h3>
                 <FormInput label="Country" type="select" options={COUNTRY_OPTIONS} value={profile.country} onChange={v => setProfile({...profile, country: v})} />
                 <FormInput label="Education" value={profile.education} onChange={v => setProfile({...profile, education: v})} />
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-6">
                 <h3 className="text-[10px] font-black text-amber-400 uppercase tracking-[0.3em] flex items-center gap-2">
                   <Briefcase size={12} />
                   Metrics
                 </h3>
                 <FormInput label="Years of Experience" type="number" value={profile.yearsOfExperience} onChange={v => setProfile({...profile, yearsOfExperience: parseInt(v)})} />
                 <FormInput 
                   label="Visa Status" 
                   type="select" 
                   options={VISA_STATUS_OPTIONS} 
                   value={profile.visaStatus} 
                   onChange={v => setProfile({...profile, visaStatus: v})} 
                 />
              </div>

              <div className="space-y-6">
                 <h3 className="text-[10px] font-black text-sky-400 uppercase tracking-[0.3em] flex items-center gap-2">
                   <Mail size={12} />
                   Social & Contact
                 </h3>
                 <FormInput label="Email" value={profile.email} onChange={v => setProfile({...profile, email: v})} icon={<Mail size={12}/>} />
                 <FormInput label="LinkedIn URL" value={profile.linkedinUrl} onChange={v => setProfile({...profile, linkedinUrl: v})} icon={<Linkedin size={12}/>} />
                 <FormInput label="GitHub URL" value={profile.githubUrl} onChange={v => setProfile({...profile, githubUrl: v})} icon={<Github size={12}/>} />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-divider bg-bg-deep flex justify-end gap-4">
          <button 
            onClick={onClose}
            disabled={isSaving}
            className="px-6 py-3 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/5 rounded-xl transition-all"
          >
            Discard
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-3 px-10 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-xl shadow-primary/20 hover:bg-primary-hover active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={14} />
            )}
            {isSaving ? "Saving..." : "Update Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}
