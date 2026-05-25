import { useState, useEffect } from 'react';
import { SkillTheme } from '../types';
import SkillsRadar from '../components/skills/SkillsRadar';
import SkillsList from '../components/skills/SkillsList';
import { Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { profileService } from '../services/profileService';

export default function SkillsPage() {
    const { token } = useAuth();
    const [themes, setThemes] = useState<SkillTheme[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'CORE' | 'DOMAIN' | 'SPECIAL'>('CORE');

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
                setError("Could not load your skills. Please try again later.");
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
                            return { ...skill, level: level as any };
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
                <div className="text-primary font-mono animate-pulse uppercase tracking-widest">Initialising Skills...</div>
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

    const themesByTier = themes.reduce((acc, theme) => {
        const tier = (theme.track?.track_type || 'CORE') as 'CORE' | 'DOMAIN' | 'SPECIAL';
        if (!acc[tier]) acc[tier] = [];
        acc[tier].push(theme);
        return acc;
    }, {} as Record<'CORE' | 'DOMAIN' | 'SPECIAL', SkillTheme[]>);

    const tierLabels: Record<string, string> = {
        'CORE': 'Core Essentials',
        'DOMAIN': 'Professional Domain',
        'SPECIAL': 'Advanced Specializations'
    };

    const activeDomain = themesByTier['DOMAIN']?.[0]?.track?.name;
    const activeSpecials = Array.from(new Set(themesByTier['SPECIAL']?.filter(t => t.track).map(t => t.track!.name) || []));

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Tab Navigation Header */}
            <div className="flex justify-end pb-4 border-b border-divider">
                <div className="flex bg-bg-card border border-divider p-1 rounded-lg">
                    {(['CORE', 'DOMAIN', 'SPECIAL'] as const).map(tier => (
                        <button
                            key={tier}
                            onClick={() => setActiveTab(tier)}
                            className={`px-4 py-2 rounded font-black text-[10px] uppercase tracking-widest transition-all ${
                                activeTab === tier 
                                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                                : 'text-text-secondary hover:text-white'
                            }`}
                        >
                            {tier === 'CORE' ? 'Core' : tier === 'DOMAIN' ? 'Domain' : 'Special'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 lg:gap-20">
                {/* Main Content: Skill Inputs */}
                <div className="lg:col-span-1">
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {themesByTier[activeTab] ? (
                            <div className="space-y-10">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary">{tierLabels[activeTab]}</h2>
                                        <div className="h-1 w-20 bg-primary/20"></div>
                                    </div>
                                    
                                    {activeTab === 'DOMAIN' && activeDomain && (
                                        <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 px-4 py-2 rounded-lg self-start md:self-auto">
                                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                                                Active Role: {activeDomain}
                                            </span>
                                        </div>
                                    )}

                                    {activeTab === 'SPECIAL' && activeSpecials.length > 0 && (
                                        <div className="flex flex-wrap gap-2 justify-start md:justify-end">
                                            {activeSpecials.map(name => (
                                                <div key={name} className="flex items-center gap-2 bg-emerald-400/5 border border-emerald-400/20 px-3 py-1.5 rounded-lg">
                                                    <Sparkles size={10} className="text-emerald-400" />
                                                    <span className="text-[10px] font-black uppercase tracking-[0.1em] text-emerald-400/90">
                                                        {name}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <SkillsList themes={themesByTier[activeTab]} onUpdateSkill={updateSkill} />
                            </div>
                        ) : (
                            <div className="bg-bg-card border border-divider border-dashed p-12 rounded-lg text-center">
                                <p className="text-text-secondary font-mono text-xs uppercase tracking-widest">No skill modules selected for this tier.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar: Visualization */}
                <aside className="lg:col-span-1 space-y-8">
                     <div className="space-y-1 lg:mb-10">
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Proficiency Map</h2>
                        <div className="h-1 w-20 bg-primary/20"></div>
                    </div>
                    <SkillsRadar themes={themes} />
                </aside>
            </div>
        </div>
    );
}
