import { useState, useEffect } from 'react';
import { SkillTheme } from '../types';
import SkillsRadar from '../components/skills/SkillsRadar';
import SkillsList from '../components/skills/SkillsList';
import { Target } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { profileService } from '../services/profileService';

export default function SkillsPage() {
    const { token } = useAuth();
    const [themes, setThemes] = useState<SkillTheme[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadSkills = async () => {
            if (!token) return;
            try {
                setLoading(true);
                const data = await profileService.fetchSkills(token);
                setThemes(data);
                setError(null);
            } catch (err) {
                console.error("Failed to load skills:", err);
                setError("Could not load your skills matrix. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        loadSkills();
    }, [token]);

    const updateSkill = async (themeId: string, subCatId: string, skillId: string, level: number) => {
        if (!token) return;

        // Optimistic update
        const previousThemes = [...themes];
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

        try {
            await profileService.updateSkillLevel(skillId, level, token);
        } catch (err) {
            console.error("Failed to update skill:", err);
            // Rollback on failure
            setThemes(previousThemes);
            alert("Failed to save skill update. Please check your connection.");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-primary font-mono animate-pulse uppercase tracking-widest">Initialising Matrix...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <div className="text-red-500 font-bold uppercase">{error}</div>
                <button 
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 border border-divider hover:bg-white/5 transition-colors uppercase text-xs font-black"
                >
                    Retry Connection
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Compact Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-6 border-b border-divider">
                <div className="flex items-center gap-4">
                    <div className="pill-success flex items-center gap-1.5">
                        <Target size={12} />
                        Active Matrix
                    </div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-tight">Skills Matrix</h1>
                </div>
                <div className="text-[9px] font-bold text-text-secondary uppercase tracking-[0.2em] opacity-50">Reviewing: Professional Portfolio</div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 lg:gap-20">
                {/* Main Content: Skill Inputs */}
                <div className="lg:col-span-1">
                    <div className="space-y-10">
                        <div className="space-y-1">
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Technical Domains</h2>
                            <div className="h-1 w-20 bg-primary/20"></div>
                        </div>
                        <SkillsList themes={themes} onUpdateSkill={updateSkill} />
                    </div>
                </div>

                {/* Sidebar: Visualization */}
                <aside className="lg:col-span-1 space-y-8">
                     <div className="space-y-1 lg:mb-10">
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Proficiency Map</h2>
                        <div className="h-1 w-20 bg-primary/20"></div>
                    </div>
                    <SkillsRadar themes={themes} />
                    
                    <div className="bg-bg-card border border-divider p-8 rounded-lg space-y-6">
                        <h4 className="font-black text-xs text-white uppercase tracking-[0.3em] flex items-center gap-2">
                             System Logic
                        </h4>
                        <p className="text-sm leading-relaxed text-text-secondary">Changes to competency levels are reflected in real-time across your proficiency map and network profile.</p>
                        <div className="pt-4 border-t border-divider flex items-center justify-between">
                            <span className="text-[10px] font-bold text-text-secondary uppercase">Sync Status</span>
                            <span className="text-[10px] font-black text-emerald-accent uppercase font-mono">LIVE_FEED</span>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
