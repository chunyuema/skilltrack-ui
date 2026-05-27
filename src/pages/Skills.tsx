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

    const updateSkill = async (themeId: string, subCatId: string, level: number) => {
        if (!token) return;

        // Optimistic update
        const previousThemes = [...themes];
        const newThemes = themes.map(theme => {
            if (theme.id !== themeId) return theme;
            return {
                ...theme,
                subCategories: theme.subCategories.map(sub => {
                    if (sub.id !== subCatId) return sub;
                    return { ...sub, level: level as any };
                })
            };
        });
        setThemes(newThemes);

        try {
            await profileService.updateSkillLevel(subCatId, level, token);
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

    const tierStyles: Record<'CORE' | 'DOMAIN' | 'SPECIAL', { 
        active: string, 
        text: string, 
        bg: string, 
        border: string, 
        dot: string,
        radar: string
    }> = {
        'CORE': {
            active: 'bg-primary shadow-primary/20',
            text: 'text-primary',
            bg: 'bg-primary/5',
            border: 'border-primary/20',
            dot: 'bg-primary',
            radar: '#5a67d8'
        },
        'DOMAIN': {
            active: 'bg-emerald-accent shadow-emerald-accent/20',
            text: 'text-emerald-accent',
            bg: 'bg-emerald-accent/5',
            border: 'border-emerald-accent/20',
            dot: 'bg-emerald-accent',
            radar: '#48bb78'
        },
        'SPECIAL': {
            active: 'bg-violet-500 shadow-violet-500/20',
            text: 'text-violet-500',
            bg: 'bg-violet-500/5',
            border: 'border-violet-500/20',
            dot: 'bg-violet-500',
            radar: '#8b5cf6'
        }
    };

    const activeDomain = themesByTier['DOMAIN']?.[0]?.track?.name;
    const activeSpecials = Array.from(new Set(themesByTier['SPECIAL']?.filter(t => t.track).map(t => t.track!.name) || []));

    return (
        <div className="animate-in fade-in duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 lg:gap-20">
                {/* Main Content: Tabs & Skill Inputs */}
                <div className="lg:col-span-1 space-y-10">
                    {/* Tab Navigation & Active Contexts */}
                    <div className="flex items-center gap-4 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
                        <div className="flex bg-bg-card border border-divider p-1 rounded-lg w-fit shrink-0">
                            {(['CORE', 'DOMAIN', 'SPECIAL'] as const).map(tier => (
                                <button
                                    key={tier}
                                    onClick={() => setActiveTab(tier)}
                                    className={`px-4 py-2 rounded font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${
                                        activeTab === tier 
                                        ? `${tierStyles[tier].active} text-white shadow-lg` 
                                        : 'text-text-secondary hover:text-white'
                                    }`}
                                >
                                    {tierLabels[tier]}
                                </button>
                            ))}
                        </div>

                        {activeTab === 'DOMAIN' && activeDomain && (
                            <div className={`flex items-center gap-3 ${tierStyles.DOMAIN.bg} border ${tierStyles.DOMAIN.border} px-4 py-2 rounded-lg animate-in fade-in slide-in-from-left-4 duration-500 shrink-0`}>
                                <div className={`w-2 h-2 rounded-full ${tierStyles.DOMAIN.dot} animate-pulse`} />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white whitespace-nowrap">
                                    Role: {activeDomain}
                                </span>
                            </div>
                        )}

                        {activeTab === 'SPECIAL' && activeSpecials.length > 0 && (
                            <div className="flex gap-2 animate-in fade-in slide-in-from-left-4 duration-500 shrink-0">
                                {activeSpecials.map(name => (
                                    <div key={name} className={`flex items-center gap-2 ${tierStyles.SPECIAL.bg} border ${tierStyles.SPECIAL.border} px-3 py-1.5 rounded-lg whitespace-nowrap`}>
                                        <Sparkles size={10} className={tierStyles.SPECIAL.text} />
                                        <span className={`text-[10px] font-black uppercase tracking-[0.1em] ${tierStyles.SPECIAL.text}/90`}>
                                            {name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {themesByTier[activeTab] ? (
                            <div className="space-y-10">
                                <SkillsList 
                                    themes={themesByTier[activeTab]} 
                                    onUpdateSkill={updateSkill} 
                                    activeColor={tierStyles[activeTab].active.split(' ')[0]} 
                                />
                            </div>
                        ) : (
                            <div className="bg-bg-card border border-divider border-dashed p-12 rounded-lg text-center">
                                <p className="text-text-secondary font-mono text-xs uppercase tracking-widest">No skill modules selected for this tier.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar: Visualization */}
                <aside className="lg:col-span-1 space-y-8 sticky top-24 self-start">
                     <div className="space-y-1 lg:mb-10">
                        <h2 className={`text-xs font-black uppercase tracking-[0.3em] ${tierStyles[activeTab].text}`}>Proficiency Map</h2>
                        <div className={`h-1 w-20 ${tierStyles[activeTab].bg.replace('/5', '/20')}`}></div>
                    </div>
                    <SkillsRadar 
                        themes={themesByTier[activeTab] || []} 
                        allThemes={themes}
                        activeTierLabel={activeTab === 'CORE' ? 'Core' : activeTab === 'DOMAIN' ? 'Domain' : 'Special'}
                        color={tierStyles[activeTab].radar}
                    />
                </aside>
            </div>
        </div>
    );
}
