import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { profileService } from '../services/profileService';
import { Track, SkillTheme } from '../types';
import { ChevronRight, ChevronLeft, Check, Sparkles, Target, Zap, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Onboarding() {
  const navigate = useNavigate();
  const { token, logout, refreshProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [coreSkills, setCoreSkills] = useState<SkillTheme[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [selectedSpecials, setSelectedSpecials] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const initOnboarding = async () => {
      if (!token) return;
      try {
        const [allTracks, skills] = await Promise.all([
          profileService.fetchTracks(token),
          profileService.fetchSkills(token)
        ]);
        setTracks(allTracks);
        // Step 1: Initial fetch will only return CORE tracks because none are selected yet.
        setCoreSkills(skills);
      } catch (err) {
        if (err instanceof Error && err.message === 'Unauthorized') {
          logout();
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };
    initOnboarding();
  }, [token, logout, navigate]);

  const handleDomainSelect = (id: string) => setSelectedDomain(id);
  
  const toggleSpecial = (id: string) => {
    setSelectedSpecials(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleSkillRate = async (skillId: string, level: number) => {
    if (!token) return;
    try {
      await profileService.updateSkillLevel(skillId, level, token);
    } catch (err) {
      console.error("Failed to update skill level", err);
    }
  };

  const handleComplete = async () => {
    if (!token) return;
    setIsSaving(true);
    try {
      const trackIds = [selectedDomain, ...selectedSpecials].filter(Boolean);
      await profileService.updateUserTracks(trackIds, token);
      await refreshProfile();
      navigate('/skills');
    } catch (err) {
      console.error("Failed to complete onboarding", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-deep flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  const domainTracks = tracks.filter(t => t.track_type === 'DOMAIN');
  const specialTracks = tracks.filter(t => t.track_type === 'SPECIAL');

  return (
    <div className="min-h-screen bg-bg-deep text-white font-main selection:bg-primary/30">
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-24">
        {/* Progress Bar */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary">Step {step} of 3</span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
              {step === 1 ? 'Establish Baseline' : step === 2 ? 'Select Domain' : 'Add Superpowers'}
            </span>
          </div>
          <div className="h-1.5 w-full bg-divider rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-700 ease-out"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Core Essentials */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-4">The Baseline</h1>
              <p className="text-text-secondary text-lg max-w-2xl">
                Every engineer starts with the same fundamentals. Rate your proficiency in these universal essentials.
              </p>
            </div>

            <div className="space-y-12 mb-16">
              {coreSkills.map(theme => (
                <div key={theme.id} className="space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                    <ShieldCheck size={16} />
                    {theme.name}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {theme.subCategories.flatMap(sc => sc.skills).map(skill => (
                      <div key={skill.id} className="bg-bg-card border border-divider p-6 rounded-lg group hover:border-primary/30 transition-all">
                        <div className="flex justify-between items-center mb-4">
                          <span className="font-bold text-sm uppercase tracking-wider">{skill.name}</span>
                          <span className="text-[10px] font-mono text-text-secondary">LVL {skill.level}</span>
                        </div>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map(lvl => (
                            <button
                              key={lvl}
                              onClick={() => {
                                skill.level = lvl as any;
                                handleSkillRate(skill.id, lvl);
                                setCoreSkills([...coreSkills]);
                              }}
                              className={cn(
                                "flex-1 h-2 rounded-full transition-all",
                                skill.level >= lvl ? "bg-primary" : "bg-divider hover:bg-primary/20"
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button 
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded font-black text-xs uppercase tracking-[0.2em] hover:bg-primary-hover transition-all shadow-xl shadow-primary/20 group"
              >
                Continue to Domain
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Professional Domains */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-4">Your Role</h1>
              <p className="text-text-secondary text-lg max-w-2xl">
                What is your primary area of focus? This unlocks specific modules tailored to your career path.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {domainTracks.map(track => (
                <button
                  key={track.id}
                  onClick={() => handleDomainSelect(track.id)}
                  className={cn(
                    "flex flex-col items-start p-8 rounded-lg border-2 transition-all text-left group",
                    selectedDomain === track.id 
                      ? "bg-primary/5 border-primary shadow-2xl shadow-primary/10" 
                      : "bg-bg-card border-divider hover:border-primary/30"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center mb-6 transition-all",
                    selectedDomain === track.id ? "bg-primary text-white" : "bg-divider text-text-secondary group-hover:text-white"
                  )}>
                    <Target size={24} />
                  </div>
                  <h3 className="font-black text-lg uppercase tracking-tight mb-2">{track.name}</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Unlocks specialized {track.name.toLowerCase()} skill trees and architectures.
                  </p>
                </button>
              ))}
            </div>

            <div className="flex justify-between">
              <button 
                onClick={() => setStep(1)}
                className="flex items-center gap-2 px-8 py-4 bg-white/5 text-white rounded font-black text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all"
              >
                <ChevronLeft size={16} />
                Back
              </button>
              <button 
                disabled={!selectedDomain}
                onClick={() => setStep(3)}
                className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded font-black text-xs uppercase tracking-[0.2em] hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-primary/20 group"
              >
                Next Step
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Advanced Specializations */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-4">Superpowers</h1>
              <p className="text-text-secondary text-lg max-w-2xl">
                Do you have deep expertise in specific niche areas? These optional modules add high-leverage skill blocks to your profile.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
              {specialTracks.map(track => (
                <button
                  key={track.id}
                  onClick={() => toggleSpecial(track.id)}
                  className={cn(
                    "flex items-center gap-6 p-8 rounded-lg border-2 transition-all text-left group",
                    selectedSpecials.includes(track.id) 
                      ? "bg-primary/5 border-primary" 
                      : "bg-bg-card border-divider hover:border-primary/30"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center transition-all",
                    selectedSpecials.includes(track.id) ? "bg-primary text-white" : "bg-divider text-text-secondary group-hover:text-white"
                  )}>
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-lg uppercase tracking-tight mb-1">{track.name}</h3>
                    <p className="text-xs text-text-secondary uppercase tracking-widest font-mono">Specialization</p>
                  </div>
                  {selectedSpecials.includes(track.id) && <Check className="ml-auto text-primary" size={24} />}
                </button>
              ))}
            </div>

            <div className="flex justify-between">
              <button 
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-8 py-4 bg-white/5 text-white rounded font-black text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all"
              >
                <ChevronLeft size={16} />
                Back
              </button>
              <button 
                onClick={handleComplete}
                disabled={isSaving}
                className="flex items-center gap-2 px-10 py-4 bg-emerald-accent text-bg-deep rounded font-black text-xs uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl shadow-emerald-accent/20 group"
              >
                {isSaving ? 'Finalizing...' : 'Initialize Profile'}
                <Zap size={16} className="fill-current" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
