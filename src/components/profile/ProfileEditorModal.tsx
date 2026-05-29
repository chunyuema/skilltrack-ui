import React, { useState } from 'react';
import { UserProfile, Experience } from '../../types';
import { FormInput } from '../ui/FormInput';
import { MonthYearPicker } from '../ui/MonthYearPicker';
import { Save, X, Plus, Trash2, Briefcase, User, MapPin, GraduationCap, Mail, Shield, Linkedin, Github } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

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

interface ProfileEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  experiences: Experience[];
  onSave: (profile: UserProfile, experiences: Experience[], deletedIds: string[]) => Promise<void>;
}

export function ProfileEditorModal({ isOpen, onClose, profile: initialProfile, experiences: initialExperiences, onSave }: ProfileEditorModalProps) {
  const [profile, setProfile] = useState<UserProfile>({ ...initialProfile });
  const [experiences, setExperiences] = useState<Experience[]>([...initialExperiences]);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'experience'>('general');
  const [editingExpId, setEditingExpId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(profile, experiences, deletedIds);
      onClose();
    } catch (error) {
      console.error("Failed to save profile changes:", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const updateExperience = (id: string, updates: Partial<Experience>) => {
    setExperiences(prev => prev.map(exp => exp.id === id ? { ...exp, ...updates } : exp));
  };

  const addExperience = () => {
    const newId = `temp-${Date.now()}`;
    const newExp: Experience = {
      id: newId,
      company: '',
      role: '',
      startDate: '',
      endDate: 'Present',
      description: '',
      technologies: []
    };
    setExperiences([newExp, ...experiences]);
    setEditingExpId(newId);
  };

  const removeExperience = (id: string) => {
    if (!String(id).startsWith('temp-')) {
      setDeletedIds([...deletedIds, String(id)]);
    }
    setExperiences(experiences.filter(exp => exp.id !== id));
    if (editingExpId === id) setEditingExpId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 md:p-8 animate-in fade-in duration-300">
      <div className="bg-bg-card border border-divider w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="px-8 py-6 border-b border-divider flex justify-between items-center bg-white/[0.02]">
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tighter">Centralized Profile Editor</h2>
            <p className="text-[10px] text-text-secondary font-bold uppercase tracking-[0.2em] mt-1">Manage your identity and career history</p>
          </div>
          <button onClick={onClose} className="p-2 text-text-secondary hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-8 border-b border-divider bg-white/[0.01]">
          <button 
            onClick={() => setActiveTab('general')}
            className={cn(
              "px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2",
              activeTab === 'general' ? "border-primary text-white" : "border-transparent text-text-secondary hover:text-white"
            )}
          >
            General Info
          </button>
          <button 
            onClick={() => setActiveTab('experience')}
            className={cn(
              "px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2",
              activeTab === 'experience' ? "border-primary text-white" : "border-transparent text-text-secondary hover:text-white"
            )}
          >
            Work History
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
          {activeTab === 'general' ? (
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
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Experience Pipeline</h3>
                <button 
                  onClick={addExperience}
                  className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-primary/20 transition-all"
                >
                  <Plus size={14} /> Add Position
                </button>
              </div>

              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id} className={cn(
                    "bg-bg-deep border rounded-xl transition-all duration-300 overflow-hidden",
                    editingExpId === exp.id ? "border-primary ring-1 ring-primary/20" : "border-divider"
                  )}>
                    <div className="p-4 flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-bg-card flex items-center justify-center border border-divider">
                          <Briefcase size={16} className={editingExpId === exp.id ? "text-primary" : "text-text-secondary"} />
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm">{exp.role || "Untitled Position"}</h4>
                          <p className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">{exp.company || "Company Name"} • {exp.startDate || "Start"} - {exp.endDate || "Present"}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setEditingExpId(editingExpId === exp.id ? null : exp.id)}
                          className="px-3 py-1.5 bg-white/[0.03] border border-divider text-[9px] font-black uppercase text-text-secondary hover:text-white rounded transition-all"
                        >
                          {editingExpId === exp.id ? "Minimize" : "Edit"}
                        </button>
                        <button 
                          onClick={() => removeExperience(exp.id)}
                          className="p-2 text-text-secondary hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <AnimatePresence>
                      {editingExpId === exp.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="p-6 pt-2 border-t border-divider grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/[0.01]">
                            <FormInput label="Company" value={exp.company} onChange={v => updateExperience(exp.id, { company: v })} />
                            <FormInput label="Role" value={exp.role} onChange={v => updateExperience(exp.id, { role: v })} />
                            <div className="grid grid-cols-2 gap-4">
                                <MonthYearPicker label="Start Date" value={exp.startDate} onChange={v => updateExperience(exp.id, { startDate: v })} />
                                <MonthYearPicker label="End Date" value={exp.endDate} onChange={v => updateExperience(exp.id, { endDate: v })} allowPresent />
                            </div>
                            <FormInput 
                                label="Technologies (comma separated)" 
                                value={exp.technologies.join(', ')} 
                                onChange={v => updateExperience(exp.id, { technologies: v.split(',').map(s => s.trim()).filter(Boolean) })} 
                            />
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">Contribution Summary</label>
                                <textarea 
                                    value={exp.description} 
                                    onChange={e => updateExperience(exp.id, { description: e.target.value })}
                                    className="w-full bg-bg-card border border-divider rounded-lg p-4 text-xs text-white leading-relaxed focus:border-primary outline-none transition-all h-24"
                                />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-divider bg-bg-deep flex justify-between items-center">
          <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">
            {isSaving ? "Synchronizing data..." : "Unsaved changes are kept in this session"}
          </p>
          <div className="flex gap-4">
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
              {isSaving ? "Saving..." : "Commit All Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
