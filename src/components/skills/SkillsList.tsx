import React, { useState } from 'react';
import { SkillTheme, SkillSubCategory } from '../../types';
import { 
  ChevronDown, 
  ChevronUp, 
  ChevronRight, 
  Cpu, 
  Code2, 
  Server, 
  Database, 
  Monitor, 
  Cloud, 
  ShieldCheck, 
  Activity, 
  Brain,
  Layers
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface SkillsListProps {
  themes: SkillTheme[];
  onUpdateSkill?: (themeId: string, subCatId: string, level: number) => void;
  readOnly?: boolean;
  activeColor?: string;
}

const IconMapper: Record<string, { icon: React.ElementType, color: string, bg: string }> = {
  foundations: { icon: Cpu, color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20' },
  language: { icon: Code2, color: 'text-sky-400', bg: 'bg-sky-400/10 border-sky-400/20' },
  backend: { icon: Server, color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20' },
  data: { icon: Database, color: 'text-rose-400', bg: 'bg-rose-400/10 border-rose-400/20' },
  frontend: { icon: Monitor, color: 'text-indigo-400', bg: 'bg-indigo-400/10 border-indigo-400/20' },
  cloud: { icon: Cloud, color: 'text-cyan-400', bg: 'bg-cyan-400/10 border-cyan-400/20' },
  security: { icon: ShieldCheck, color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20' },
  quality: { icon: Activity, color: 'text-fuchsia-400', bg: 'bg-fuchsia-400/10 border-fuchsia-400/20' },
  ai: { icon: Brain, color: 'text-violet-400', bg: 'bg-violet-400/10 border-violet-400/20' }
};

const StringIconMapper: Record<string, React.ElementType> = {
  Cpu, Code2, Server, Database, Monitor, Cloud, ShieldCheck, Activity, Brain
};

export default function SkillsList({ themes, onUpdateSkill, readOnly = false, activeColor = 'bg-primary' }: SkillsListProps) {
  const [expandedTheme, setExpandedTheme] = useState<string | null>('foundations');
  const [expandedSubCategory, setExpandedSubCategory] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {themes.map((theme) => {
        // Try mapping by ID first (fallback for API missing icon field), then by icon string
        const config = IconMapper[theme.id] || { 
          icon: (theme.icon && StringIconMapper[theme.icon]) || Layers, 
          color: 'text-primary', 
          bg: 'bg-primary/10 border-primary/20' 
        };
        
        const ThemeIcon = config.icon;
        
        return (
          <div key={theme.id} className="bg-bg-card rounded-lg border border-divider overflow-hidden transition-all duration-300 hover:border-primary/40">
            <button
              onClick={() => setExpandedTheme(expandedTheme === theme.id ? null : theme.id)}
              className="w-full flex items-center justify-between p-8 hover:bg-white/[0.02] transition-colors text-left"
            >
              <div className="flex items-center gap-6">
                <div className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center border transition-all duration-500",
                  expandedTheme === theme.id 
                    ? `${config.bg} ${config.color} shadow-lg shadow-black/20 scale-110 border-opacity-50` 
                    : "bg-slate-900 border-divider text-text-secondary group-hover:border-primary/30"
                )}>
                  <ThemeIcon size={28} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col items-start gap-1">
                  <h3 className="text-2xl font-black text-white tracking-tight leading-tight uppercase font-mono">
                    {theme.name}
                  </h3>
                  <p className="text-xs text-text-secondary font-medium">{theme.description}</p>
                </div>
              </div>
              <div className={cn("p-2 rounded-full transition-all", expandedTheme === theme.id ? "bg-primary text-white" : "bg-white/[0.05] text-text-secondary")}>
                  {expandedTheme === theme.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </button>
            
            <AnimatePresence>
              {expandedTheme === theme.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="p-8 pt-0 border-t border-divider space-y-4">
                    {theme.subCategories.map((subCat) => (
                      <SubCategoryRow 
                        key={subCat.id} 
                        subCat={subCat} 
                        onChange={(val) => onUpdateSkill?.(theme.id, subCat.id, val)}
                        readOnly={readOnly}
                        activeColor={activeColor}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

const SubCategoryRow: React.FC<{ 
  subCat: SkillSubCategory; 
  onChange: (val: number) => void; 
  readOnly: boolean;
  activeColor: string;
}> = ({ subCat, onChange, readOnly, activeColor }) => {
  const activeColorShadow = activeColor.includes('primary') ? 'shadow-primary/20' : activeColor.replace('bg-', 'shadow-') + '/20';
  const textColor = activeColor.replace('bg-', 'text-');

  return (
    <div className="bg-bg-deep/50 border border-divider rounded-lg p-6 space-y-4">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 space-y-1">
          <h4 className="font-black text-white text-xs uppercase tracking-[0.2em]">{subCat.name}</h4>
          <p className="text-[10px] text-text-secondary font-mono tracking-widest uppercase">
            Includes: {subCat.skills.map(s => s.name).join(', ')}
          </p>
        </div>
        <div className="flex items-center gap-1 bg-slate-900/50 p-1 rounded-lg border border-divider">
          {[0, 1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              onClick={() => !readOnly && onChange(level)}
              disabled={readOnly}
              className={cn(
                "w-8 h-8 rounded text-[10px] font-black transition-all flex items-center justify-center font-mono",
                subCat.level >= level && level !== 0
                  ? cn(activeColor, "text-white shadow-lg", activeColorShadow) 
                  : level === 0 && subCat.level === 0
                  ? cn("bg-white/[0.05] border border-opacity-20", textColor, activeColor.replace('bg-', 'border-'))
                  : "bg-transparent text-text-secondary hover:text-white"
              )}
            >
              {level === 0 ? 'X' : level}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
