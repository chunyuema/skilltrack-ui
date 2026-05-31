import { useState, useEffect } from 'react';
import { SkillTheme } from '../types';
import SkillsRadar from '../components/skills/SkillsRadar';
import SkillsList from '../components/skills/SkillsList';
import { useAuth } from '../hooks/useAuth';
import { profileService } from '../services/profileService';
import { TRACK_VISUALS } from '../lib/constants';
import { cn } from '../lib/utils';

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
            setThemes(previousThemes);
            alert("Failed to save skill update.");
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
                <button onClick={() => window.location.reload()} className="px-4 py-2 border border-divider hover:bg-white/5 transition-colors uppercase text-xs font-black">Retry Connection</button>
            </div>
        );
    }

    const themesByTier = themes.reduce((acc, theme) => {
        const tier = (theme.track?.track_type || 'CORE') as 'CORE' | 'DOMAIN' | 'SPECIAL';
        if (!acc[tier]) acc[tier] = [];
        acc[tier].push(theme);
        return acc;
    }, {} as Record<'CORE' | 'DOMAIN' | 'SPECIAL', SkillTheme[]>);

    const activeDomain = themesByTier['DOMAIN']?.[0]?.track;
    const domainVisual = activeDomain ? (TRACK_VISUALS[activeDomain.id] || TRACK_VISUALS.default) : TRACK_VISUALS.default;

    const activeSpecials = Array.from(
        (themesByTier['SPECIAL'] || []).reduce((map, t) => {
            if (t.track) map.set(t.track.id, t.track);
            return map;
        }, new Map<string, any>()).values()
    );

    const firstSpecialVisual = activeSpecials.length > 0 ? (TRACK_VISUALS[activeSpecials[0]!.id] || TRACK_VISUALS.default) : TRACK_VISUALS.default;

    const tierStyles = {
        'CORE': TRACK_VISUALS.default,
        'DOMAIN': domainVisual,
        'SPECIAL': firstSpecialVisual
    };

    return (
        <div className="animate-in fade-in duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 lg:gap-20">
                <div className="lg:col-span-1 space-y-10">
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
                                    {tier === 'CORE' ? 'Essentials' : tier === 'DOMAIN' ? 'Professional' : 'Superpowers'}
                                </button>
                            ))}
                        </div>

                        {activeTab === 'DOMAIN' && activeDomain && (() => {
                            const Icon = domainVisual.icon;
                            return (
                                <div className={cn("flex items-center gap-3 px-4 py-2 rounded-lg animate-in fade-in slide-in-from-left-4 duration-500 shrink-0 border", domainVisual.bg, domainVisual.border)}>
                                    <div className={cn("w-2 h-2 rounded-full animate-pulse", domainVisual.dot)} />
                                    <Icon size={12} className={domainVisual.color} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white whitespace-nowrap">
                                        Role: {activeDomain.name}
                                    </span>
                                </div>
                            );
                        })()}

                        {activeTab === 'SPECIAL' && activeSpecials.length > 0 && (() => {
                            const Icon = firstSpecialVisual.icon;
                            const label = activeSpecials.length > 1 
                                ? `${activeSpecials[0]!.name} +${activeSpecials.length - 1}`
                                : activeSpecials[0]!.name;
                            
                            return (
                                <div className={cn("flex items-center gap-3 px-4 py-2 rounded-lg animate-in fade-in slide-in-from-left-4 duration-500 shrink-0 border", firstSpecialVisual.bg, firstSpecialVisual.border)}>
                                    <div className={cn("w-2 h-2 rounded-full animate-pulse", firstSpecialVisual.dot)} />
                                    <Icon size={12} className={firstSpecialVisual.color} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white whitespace-nowrap">
                                        Specialization: {label}
                                    </span>
                                </div>
                            );
                        })()}
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
                                <p className="text-text-secondary font-mono text-xs uppercase tracking-widest">No skill modules selected.</p>
                            </div>
                        )}
                    </div>
                </div>

                <aside className="lg:col-span-1 space-y-8 sticky top-24 self-start">
                     <div className="space-y-1 lg:mb-10">
                        <h2 className={cn("text-xs font-black uppercase tracking-[0.3em]", tierStyles[activeTab].color)}>Proficiency Map</h2>
                        <div className={cn("h-1 w-20 opacity-40", tierStyles[activeTab].bg.replace('/5', '/40'))}></div>
                    </div>
                    <SkillsRadar 
                        themes={themesByTier[activeTab] || []} 
                        activeTierLabel={activeTab === 'CORE' ? 'Core' : activeTab === 'DOMAIN' ? 'Domain' : 'Special'}
                        color={tierStyles[activeTab].radar}
                    />
                </aside>
            </div>
        </div>
    );
}
