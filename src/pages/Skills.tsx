import { useState } from 'react';
import { SkillTheme } from '../types';
import { INITIAL_THEMES } from '../data/initialData';
import SkillsRadar from '../components/skills/SkillsRadar';
import SkillsList from '../components/skills/SkillsList';

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
                subCategories: theme.subCategories.map(subCat => {
                    if (subCat.id !== subCatId) return subCat;
                    return {
                        ...subCat,
                        skills: subCat.skills.map(skill =>
                            skill.id === skillId ? { ...skill, level: level as any } : skill
                        )
                    };
                })
            };
        });
        setThemes(newThemes);
        localStorage.setItem('skilltrack_themes', JSON.stringify(newThemes));
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Skills Matrix</h1>
                <p className="text-slate-500 mt-1">Assess your technical proficiency against industry standards</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
