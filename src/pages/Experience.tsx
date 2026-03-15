import { useState, useEffect } from 'react';
import { Experience } from '../types';
import { Plus, Trash2, Calendar, Building, Briefcase, Loader2, Pencil, X, Check } from 'lucide-react';
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
        if (confirm('Are you sure you want to delete this experience?')) {
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
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                <p className="text-slate-500 font-medium">Loading your experiences...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Experience</h1>
                    <p className="text-slate-500 mt-1">Your professional journey</p>
                </div>
                <button
                    onClick={() => {
                        setIsAdding(true);
                        setEditingId(null);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                    <Plus size={18} />
                    Add Experience
                </button>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
                    {error}
                </div>
            )}

            {isAdding && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 animate-in fade-in slide-in-from-top-4">
                    <h3 className="text-lg font-semibold mb-4">Add New Role</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input
                            placeholder="Company Name"
                            className="px-4 py-2 border border-slate-200 rounded-lg"
                            value={newExp.company || ''}
                            onChange={e => setNewExp({ ...newExp, company: e.target.value })}
                        />
                        <input
                            placeholder="Role Title"
                            className="px-4 py-2 border border-slate-200 rounded-lg"
                            value={newExp.role || ''}
                            onChange={e => setNewExp({ ...newExp, role: e.target.value })}
                        />
                        <input
                            type="month"
                            placeholder="Start Date"
                            className="px-4 py-2 border border-slate-200 rounded-lg"
                            value={newExp.startDate || ''}
                            onChange={e => setNewExp({ ...newExp, startDate: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="End Date (or 'Present')"
                            className="px-4 py-2 border border-slate-200 rounded-lg"
                            value={newExp.endDate || ''}
                            onChange={e => setNewExp({ ...newExp, endDate: e.target.value })}
                        />
                    </div>
                    <textarea
                        placeholder="Description of responsibilities..."
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg mb-4 h-24"
                        value={newExp.description || ''}
                        onChange={e => setNewExp({ ...newExp, description: e.target.value })}
                    />
                    <input
                        placeholder="Technologies (comma separated)"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg mb-6"
                        value={Array.isArray(newExp.technologies) ? newExp.technologies.join(', ') : ''}
                        onChange={e => setNewExp({ ...newExp, technologies: e.target.value.split(',').map(t => t.trim()).filter(t => t !== '') })}
                    />
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => setIsAdding(false)}
                            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                            disabled={isSaving}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAdd}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSaving && <Loader2 size={18} className="animate-spin" />}
                            {isSaving ? 'Saving...' : 'Save Role'}
                        </button>
                    </div>
                </div>
            )}

            <div className="space-y-6">
                {experiences.map((exp) => (
                    <div key={exp.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative group transition-all hover:shadow-md">
                        {editingId === exp.id ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-indigo-600 font-semibold mb-2">
                                    <Pencil size={18} />
                                    Editing Experience
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Company</label>
                                        <input
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                            value={editExp.company || ''}
                                            onChange={e => setEditExp({ ...editExp, company: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Role</label>
                                        <input
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                            value={editExp.role || ''}
                                            onChange={e => setEditExp({ ...editExp, role: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Start Date</label>
                                        <input
                                            type="month"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                            value={editExp.startDate || ''}
                                            onChange={e => setEditExp({ ...editExp, startDate: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">End Date</label>
                                        <input
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                            value={editExp.endDate || ''}
                                            onChange={e => setEditExp({ ...editExp, endDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                                    <textarea
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-24"
                                        value={editExp.description || ''}
                                        onChange={e => setEditExp({ ...editExp, description: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Technologies (comma separated)</label>
                                    <input
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        value={Array.isArray(editExp.technologies) ? editExp.technologies.join(', ') : ''}
                                        onChange={e => setEditExp({ ...editExp, technologies: e.target.value.split(',').map(t => t.trim()).filter(t => t !== '') })}
                                    />
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        onClick={handleCancelEdit}
                                        className="flex items-center gap-1.5 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                                        disabled={isSaving}
                                    >
                                        <X size={18} />
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleUpdate}
                                        disabled={isSaving}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium"
                                    >
                                        {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                                        {isSaving ? 'Updating...' : 'Update Experience'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="absolute top-6 right-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                    <button
                                        onClick={() => handleEdit(exp)}
                                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                        title="Edit"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(exp.id)}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                            <Building size={24} />
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                                            <h3 className="text-xl font-bold text-slate-900">{exp.role}</h3>
                                            <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                                                <Calendar size={14} />
                                                <span>{exp.startDate} — {exp.endDate}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-indigo-600 font-medium mb-4">
                                            <Briefcase size={16} />
                                            {exp.company}
                                        </div>

                                        <p className="text-slate-600 leading-relaxed mb-4 whitespace-pre-wrap">{exp.description}</p>

                                        <div className="flex flex-wrap gap-2">
                                            {exp.technologies.map((tech, i) => (
                                                <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
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
                    <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                        <p className="text-slate-500">No experience added yet. Click "Add Experience" to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
