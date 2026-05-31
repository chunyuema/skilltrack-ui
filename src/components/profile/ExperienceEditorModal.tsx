import React, { useState } from 'react';
import { Experience } from '../../types';
import { FormInput } from '../ui/FormInput';
import { MonthYearPicker } from '../ui/MonthYearPicker';
import { Save, X, Briefcase, Plus, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ExperienceEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  experience?: Experience; // If provided, we're editing. If not, we're adding.
  onSave: (experience: Experience | Omit<Experience, 'id'>) => Promise<void>;
}

export function ExperienceEditorModal({ isOpen, onClose, experience: initialExperience, onSave }: ExperienceEditorModalProps) {
  const [exp, setExp] = useState<Partial<Experience>>(
    initialExperience 
      ? { ...initialExperience } 
      : { company: '', role: '', startDate: '', endDate: 'Present', description: '', technologies: [] }
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!exp.company || !exp.role || !exp.startDate || !exp.endDate) {
      setError("Company, Role, and Dates are required.");
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      await onSave(exp as Experience);
      onClose();
    } catch (err) {
      console.error("Failed to save experience:", err);
      setError("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 md:p-8 animate-in fade-in duration-300">
      <div className="bg-bg-card border border-divider w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="px-8 py-6 border-b border-divider flex justify-between items-center bg-white/[0.02]">
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tighter">
              {initialExperience ? "Edit Experience" : "Add New Position"}
            </h2>
            <p className="text-[10px] text-text-secondary font-bold uppercase tracking-[0.2em] mt-1">
              {initialExperience ? "Update your professional history" : "Add a new milestone to your career"}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-text-secondary hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-bold uppercase tracking-widest text-center">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput 
              label="Company" 
              value={exp.company || ''} 
              onChange={v => setExp({ ...exp, company: v })} 
              placeholder="e.g. Acme Corp"
            />
            <FormInput 
              label="Role" 
              value={exp.role || ''} 
              onChange={v => setExp({ ...exp, role: v })} 
              placeholder="e.g. Senior Engineer"
            />
            <MonthYearPicker 
              label="Start Date" 
              value={exp.startDate || ''} 
              onChange={v => setExp({ ...exp, startDate: v })} 
            />
            <MonthYearPicker 
              label="End Date" 
              value={exp.endDate || ''} 
              onChange={v => setExp({ ...exp, endDate: v })} 
              allowPresent 
            />
          </div>

          <FormInput 
            label="Technologies (comma separated)" 
            value={exp.technologies?.join(', ') || ''} 
            onChange={v => setExp({ ...exp, technologies: v.split(',').map(s => s.trim()).filter(Boolean) })} 
            placeholder="e.g. React, TypeScript, Node.js"
          />

          <div className="space-y-2">
            <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">Contribution Summary</label>
            <textarea 
              value={exp.description || ''} 
              onChange={e => setExp({ ...exp, description: e.target.value })}
              className="w-full bg-bg-deep border border-divider rounded-lg p-4 text-sm text-white leading-relaxed focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all h-32"
              placeholder="Describe your key achievements and responsibilities..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-divider bg-bg-deep flex justify-end gap-4">
          <button 
            onClick={onClose}
            disabled={isSaving}
            className="px-6 py-3 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/5 rounded-xl transition-all"
          >
            Cancel
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
            {isSaving ? "Saving..." : initialExperience ? "Commit Changes" : "Add Position"}
          </button>
        </div>
      </div>
    </div>
  );
}
