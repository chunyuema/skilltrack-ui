import { useState } from 'react';
import { SkillTheme } from '../types';
import { INITIAL_THEMES } from '../data/initialData';
import SkillsRadar from '../components/skills/SkillsRadar';
import SkillsList from '../components/skills/SkillsList';
import { Terminal } from 'lucide-react';

export default function SkillsPage() {
    const [themes, setThemes] = useState<SkillTheme[]>(() => {
        const saved = localStorage.getItem('skilltrack_themes');
        return saved ? JSON.parse(saved) : INITIAL_THEMES;
    });

    const updateSkill = (themeId: string, subCatId: string, skillId: string, level: number) => {
        const newThemes = themes.map(theme => {
            if (theme.id !== themeId) return theme;
            return {
                ...theme,
                subCategories: theme.subCategories.map(sub => {
                    if (sub.id !== subCatId) return sub;
                    return {
                        ...sub,
                        skills: sub.skills.map(skill => {
                            if (skill.id !== skillId) return skill;
                            return { ...skill, level };
                        })
                    };
                })
            };
        });
        setThemes(newThemes);
        localStorage.setItem('skilltrack_themes', JSON.stringify(newThemes));
    };

    return (
        <div className="space-y-10">
            <div className="border-b border-slate-800 pb-8">
                <div className="flex items-center gap-2 mb-2">
                    <Terminal size={14} className="text-sky-500" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] font-mono">Proficiency Assessment</span>
                </div>
                <h1 className="text-4xl font-black text-white tracking-tighter uppercase font-mono">Skills Matrix</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Column: Visualization */}
                <div className="lg:col-span-1">
                    <SkillsRadar themes={themes} />
                </div>
                {/* Right Column: Skill Inputs */}
                <div className="lg:col-span-2">
                    <SkillsList themes={themes} onUpdateSkill={updateSkill} />
                </div>
            </div>
        </div>
    );
}
