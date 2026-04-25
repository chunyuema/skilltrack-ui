import React, { useState } from 'react';
import { SkillTheme, Skill } from '../../types';
import { ChevronDown, ChevronUp, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface SkillsListProps {
  themes: SkillTheme[];
  onUpdateSkill?: (themeId: string, subCatId: string, skillId: string, level: number) => void;
  readOnly?: boolean;
}

export default function SkillsList({ themes, onUpdateSkill, readOnly = false }: SkillsListProps) {
  const [expandedTheme, setExpandedTheme] = useState<string | null>('foundations');
  const [expandedSubCategory, setExpandedSubCategory] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {themes.map((theme) => (
        <div key={theme.id} className="bg-bg-card rounded-lg border border-divider overflow-hidden transition-all duration-300 hover:border-primary/40">
          <button
            onClick={() => setExpandedTheme(expandedTheme === theme.id ? null : theme.id)}
            className="w-full flex items-center justify-between p-8 hover:bg-white/[0.02] transition-colors text-left"
          >
            <div className="flex flex-col items-start gap-1">
              <h3 className="text-2xl font-black text-white tracking-tight leading-tight uppercase font-mono">
                {theme.name}
              </h3>
              <p className="text-xs text-text-secondary font-medium">{theme.description}</p>
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
                <div className="p-8 pt-0 border-t border-divider space-y-6">
                  {theme.subCategories.map((subCat) => (
                    <div key={subCat.id} className="border border-divider rounded-lg bg-bg-deep/50 overflow-hidden">
                      <button
                        onClick={() => setExpandedSubCategory(expandedSubCategory === subCat.id ? null : subCat.id)}
                        className="w-full flex items-center justify-between p-5 hover:bg-white/[0.03] transition-colors"
                      >
                        <span className="font-black text-white text-xs uppercase tracking-[0.2em]">{subCat.name}</span>
                        <ChevronRight size={14} className={cn("transition-transform duration-300 text-primary", expandedSubCategory === subCat.id ? "rotate-90" : "")} />
                      </button>
                      
                      {expandedSubCategory === subCat.id && (
                        <div className="p-8 bg-black/20 space-y-8 animate-in fade-in zoom-in-95 duration-300">
                          {subCat.skills.map((skill) => (
                            <SkillRow 
                              key={skill.id} 
                              skill={skill} 
                              onChange={(val) => onUpdateSkill?.(theme.id, subCat.id, skill.id, val)}
                              readOnly={readOnly}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

const SkillRow: React.FC<{ skill: Skill; onChange: (val: number) => void; readOnly: boolean }> = ({ skill, onChange, readOnly }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 group">
      <div className="flex-1 space-y-1">
        <div className="font-bold text-white text-sm uppercase tracking-widest flex items-center gap-3">
          <div className="w-1 h-4 bg-primary/20 group-hover:bg-primary transition-colors"></div>
          {skill.name}
        </div>
      </div>
      <div className="flex items-center gap-1.5 self-end sm:self-auto bg-slate-900/50 p-1.5 rounded-lg border border-divider">
        {[0, 1, 2, 3, 4, 5].map((level) => (
          <button
            key={level}
            onClick={() => !readOnly && onChange(level)}
            disabled={readOnly}
            className={cn(
              "w-8 h-8 rounded text-[10px] font-black transition-all flex items-center justify-center font-mono",
              skill.level >= level && level !== 0
                ? "bg-primary text-white shadow-lg shadow-primary/20" 
                : level === 0 && skill.level === 0
                ? "bg-white/[0.05] text-primary border border-primary/20"
                : "bg-transparent text-text-secondary hover:text-white"
            )}
            title={`Set proficiency to ${level}`}
          >
            {level === 0 ? 'X' : level}
          </button>
        ))}
      </div>
    </div>
  );
};
