import { useState, useEffect } from 'react';
import { Experience } from '../types';
import { Plus, Trash2, Calendar, Building, Briefcase, Loader2, Pencil, X, Check, Terminal } from 'lucide-react';
import { profileService } from '../services/profileService';
import { useAuth } from '../hooks/useAuth';

export default function ExperiencePage() {
    const { token } = useAuth();
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [newExp, setNewExp] = useState<Partial<Experience>>({});
    const [editExp, setEditExp] = useState<Partial<Experience>>({});

    useEffect(() => {
        const loadExperiences = async () => {
            if (!token) return;
            try {
                setIsLoading(true);
                const data = await profileService.fetchExperiences(token);
                setExperiences(data);
                setError(null);
            } catch (err) {
                console.error('Error loading experiences:', err);
                setError('Failed to load experiences. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        loadExperiences();
    }, [token]);

    const handleDelete = async (id: string) => {
        if (!token) return;
        if (confirm('Are you sure you want to purge this record?')) {
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
            <div className="flex flex-col items-center justify-center py-24 gap-4 font-mono">
                <div className="w-10 h-10 border-2 border-slate-800 border-t-sky-500 rounded-full animate-spin"></div>
                <p className="text-sky-500/50 text-[10px] tracking-[0.3em]">SYNCHRONIZING_TIMELINE...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <div className="flex justify-between items-end border-b border-slate-800 pb-8">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Terminal size={14} className="text-sky-500" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] font-mono">CHRONOLOGICAL_HISTORY</span>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase font-mono">Experience</h1>
                </div>
                <button
                    onClick={() => {
                        setIsAdding(true);
                        setEditingId(null);
                    }}
                    className="flex items-center gap-2 px-6 py-2 bg-sky-600 text-white rounded font-mono text-[11px] font-bold uppercase tracking-widest hover:bg-sky-500 transition-all shadow-lg shadow-sky-900/40"
                >
                    <Plus size={14} />
                    PUSH_RECORD
                </button>
            </div>

            {error && (
                <div className="bg-red-900/10 text-red-400 p-4 rounded border border-red-900/20 font-mono text-xs uppercase tracking-widest">
                    [ ERROR ] {error}
                </div>
            )}

            {isAdding && (
                <div className="bg-bg-card p-8 rounded-xl border border-slate-800 shadow-2xl animate-in fade-in slide-in-from-top-4 relative">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-sky-500/50 to-transparent"></div>
                    <div className="flex items-center gap-3 mb-8 border-b border-slate-800 pb-4">
                        <h3 className="text-[11px] font-bold text-sky-500 uppercase tracking-[0.2em] font-mono">// INITIALIZE_NEW_BLOCK</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest font-mono ml-1">Org_Name</label>
                            <input
                                placeholder="Organization"
                                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded text-sky-400 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-sky-500/30"
                                value={newExp.company || ''}
                                onChange={e => setNewExp({ ...newExp, company: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest font-mono ml-1">Role_ID</label>
                            <input
                                placeholder="Position"
                                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded text-sky-400 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-sky-500/30"
                                value={newExp.role || ''}
                                onChange={e => setNewExp({ ...newExp, role: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest font-mono ml-1">T_Start</label>
                            <input
                                type="month"
                                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded text-sky-400 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-sky-500/30"
                                value={newExp.startDate || ''}
                                onChange={e => setNewExp({ ...newExp, startDate: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest font-mono ml-1">T_End</label>
                            <input
                                type="text"
                                placeholder="YYYY-MM or 'Present'"
                                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded text-sky-400 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-sky-500/30"
                                value={newExp.endDate || ''}
                                onChange={e => setNewExp({ ...newExp, endDate: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5 mb-6">
                        <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest font-mono ml-1">Mission_Parameters</label>
                        <textarea
                            placeholder="Responsibilities and impact..."
                            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded text-sky-400 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-sky-500/30 h-32 leading-relaxed"
                            value={newExp.description || ''}
                            onChange={e => setNewExp({ ...newExp, description: e.target.value })}
                        />
                    </div>
                    <div className="space-y-1.5 mb-8">
                        <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest font-mono ml-1">Tech_Dependencies (comma separated)</label>
                        <input
                            placeholder="React, AWS, Node, etc."
                            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded text-sky-400 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-sky-500/30"
                            value={Array.isArray(newExp.technologies) ? newExp.technologies.join(', ') : ''}
                            onChange={e => setNewExp({ ...newExp, technologies: e.target.value.split(',').map(t => t.trim()).filter(t => t !== '') })}
                        />
                    </div>
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => setIsAdding(false)}
                            className="px-6 py-2 text-slate-500 hover:text-slate-300 font-mono text-xs uppercase font-bold tracking-widest"
                            disabled={isSaving}
                        >
                            ABORT
                        </button>
                        <button
                            onClick={handleAdd}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-8 py-2.5 bg-sky-600 text-white rounded font-mono text-[11px] font-bold uppercase tracking-widest hover:bg-sky-500 transition-all shadow-lg shadow-sky-900/40"
                        >
                            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                            {isSaving ? 'PROCESS...' : 'COMMIT_BLOCK'}
                        </button>
                    </div>
                </div>
            )}

            <div className="space-y-8">
                {experiences.map((exp) => (
                    <div key={exp.id} className="bg-bg-card p-8 rounded border border-slate-800/60 relative group transition-all hover:border-sky-900/50 shadow-xl">
                        {editingId === exp.id ? (
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-6 font-mono text-sky-500 text-xs font-bold uppercase tracking-widest">
                                    <Pencil size={14} />
                                    REWRITING_HISTORY_NODE
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest font-mono">Org</label>
                                        <input
                                            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded text-sky-400 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-sky-500/30"
                                            value={editExp.company || ''}
                                            onChange={e => setEditExp({ ...editExp, company: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest font-mono">Role</label>
                                        <input
                                            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded text-sky-400 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-sky-500/30"
                                            value={editExp.role || ''}
                                            onChange={e => setEditExp({ ...editExp, role: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest font-mono">Start</label>
                                        <input
                                            type="month"
                                            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded text-sky-400 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-sky-500/30"
                                            value={editExp.startDate || ''}
                                            onChange={e => setEditExp({ ...editExp, startDate: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest font-mono">End</label>
                                        <input
                                            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded text-sky-400 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-sky-500/30"
                                            value={editExp.endDate || ''}
                                            onChange={e => setEditExp({ ...editExp, endDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest font-mono">Mission_Params</label>
                                    <textarea
                                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded text-sky-400 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-sky-500/30 h-32 leading-relaxed"
                                        value={editExp.description || ''}
                                        onChange={e => setEditExp({ ...editExp, description: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest font-mono">Dependencies</label>
                                    <input
                                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded text-sky-400 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-sky-500/30"
                                        value={Array.isArray(editExp.technologies) ? editExp.technologies.join(', ') : ''}
                                        onChange={e => setEditExp({ ...editExp, technologies: e.target.value.split(',').map(t => t.trim()).filter(t => t !== '') })}
                                    />
                                </div>
                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        onClick={handleCancelEdit}
                                        className="px-6 py-2 text-slate-500 hover:text-slate-300 font-mono text-xs uppercase font-bold tracking-widest"
                                        disabled={isSaving}
                                    >
                                        ABORT
                                    </button>
                                    <button
                                        onClick={handleUpdate}
                                        disabled={isSaving}
                                        className="flex items-center gap-2 px-8 py-2.5 bg-sky-600 text-white rounded font-mono text-[11px] font-bold uppercase tracking-widest hover:bg-sky-500 transition-all shadow-lg shadow-sky-900/40"
                                    >
                                        {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                                        {isSaving ? 'PATCHING...' : 'APPLY_PATCH'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="absolute top-8 right-8 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all">
                                    <button
                                        onClick={() => handleEdit(exp)}
                                        className="p-2.5 text-slate-600 hover:text-sky-400 hover:bg-slate-900 rounded border border-transparent hover:border-slate-800 transition-all"
                                        title="EDIT_NODE"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(exp.id)}
                                        className="p-2.5 text-slate-600 hover:text-red-400 hover:bg-slate-900 rounded border border-transparent hover:border-slate-800 transition-all"
                                        title="PURGE_NODE"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div className="flex flex-col md:flex-row gap-10">
                                    <div className="flex-shrink-0 pt-1">
                                        <div className="w-14 h-14 bg-slate-900 rounded flex items-center justify-center text-sky-500 border border-slate-800 shadow-inner">
                                            <Building size={24} />
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                                            <h3 className="text-xl font-black text-white tracking-tighter uppercase font-mono">{exp.role}</h3>
                                            <div className="flex items-center gap-2 text-[10px] text-slate-600 font-bold font-mono mt-1 md:mt-0 uppercase tracking-widest">
                                                <Calendar size={12} className="text-slate-700" />
                                                <span>{exp.startDate} :: {exp.endDate}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-sky-500/80 font-bold text-[11px] mb-6 uppercase tracking-[0.2em] font-mono">
                                            <Briefcase size={14} className="text-sky-700" />
                                            {exp.company}
                                        </div>

                                        <p className="text-slate-400 leading-relaxed mb-8 whitespace-pre-wrap font-medium text-sm border-l border-slate-800 pl-6">{exp.description}</p>

                                        <div className="flex flex-wrap gap-2">
                                            {exp.technologies.map((tech, i) => (
                                                <span key={i} className="px-3 py-1 bg-slate-900/50 text-slate-500 text-[10px] font-bold font-mono rounded border border-slate-800 uppercase tracking-widest">
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

                {!isLoading && experiences.length === 0 && (
                    <div className="text-center py-24 bg-slate-900/20 rounded-xl border border-dashed border-slate-800">
                        <p className="text-slate-600 font-mono text-xs uppercase tracking-[0.3em] font-bold">HISTORICAL_BUFFER_EMPTY</p>
                    </div>
                )}
            </div>
        </div>
    );
}
