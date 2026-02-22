import { useState } from 'react';
import { Experience } from '../types';
import { INITIAL_EXPERIENCE } from '../data/initialData';
import { Plus, Trash2, Calendar, Building, Briefcase } from 'lucide-react';

export default function ExperiencePage() {
    const [experiences, setExperiences] = useState<Experience[]>(() => {
        const saved = localStorage.getItem('skilltrack_experience');
        return saved ? JSON.parse(saved) : INITIAL_EXPERIENCE;
    });

    const [isAdding, setIsAdding] = useState(false);
    const [newExp, setNewExp] = useState<Partial<Experience>>({});

    const saveExperiences = (newExperiences: Experience[]) => {
        setExperiences(newExperiences);
        localStorage.setItem('skilltrack_experience', JSON.stringify(newExperiences));
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this experience?')) {
            saveExperiences(experiences.filter(exp => exp.id !== id));
        }
    };

    const handleAdd = () => {
        if (!newExp.company || !newExp.role) return;

        const experience: Experience = {
            id: Date.now().toString(),
            company: newExp.company,
            role: newExp.role,
            startDate: newExp.startDate || '',
            endDate: newExp.endDate || 'Present',
            description: newExp.description || '',
            technologies: newExp.technologies ? (Array.isArray(newExp.technologies) ? newExp.technologies : (newExp.technologies as string).split(',').map(t => t.trim())) : [],
        };

        saveExperiences([experience, ...experiences]);
        setIsAdding(false);
        setNewExp({});
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Experience</h1>
                    <p className="text-slate-500 mt-1">Your professional journey</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                    <Plus size={18} />
                    Add Experience
                </button>
            </div>

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
                        value={Array.isArray(newExp.technologies) ? newExp.technologies.join(', ') : newExp.technologies || ''}
                        onChange={e => setNewExp({ ...newExp, technologies: e.target.value.split(',').map(t => t.trim()) })}
                    />
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => setIsAdding(false)}
                            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAdd}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                            Save Role
                        </button>
                    </div>
                </div>
            )}

            <div className="space-y-6">
                {experiences.map((exp) => (
                    <div key={exp.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative group transition-all hover:shadow-md">
                        <button
                            onClick={() => handleDelete(exp.id)}
                            className="absolute top-6 right-6 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                            title="Delete"
                        >
                            <Trash2 size={18} />
                        </button>

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

                                <p className="text-slate-600 leading-relaxed mb-4">{exp.description}</p>

                                <div className="flex flex-wrap gap-2">
                                    {exp.technologies.map((tech, i) => (
                                        <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {experiences.length === 0 && (
                    <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                        <p className="text-slate-500">No experience added yet. Click "Add Experience" to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
