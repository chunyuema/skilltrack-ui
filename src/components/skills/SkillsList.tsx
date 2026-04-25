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
        <div key={theme.id} className="bg-bg-card rounded-lg border border-slate-800 shadow-xl overflow-hidden transition-all hover:border-slate-700">
          <button
            onClick={() => setExpandedTheme(expandedTheme === theme.id ? null : theme.id)}
            className="w-full flex items-center justify-between p-6 hover:bg-slate-800/40 transition-colors text-left"
          >
            <div className="flex flex-col items-start">
              <h3 className="text-xl font-black text-white tracking-tighter uppercase font-mono">
                {theme.name}
              </h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 font-mono">{theme.description}</p>
            </div>
            {expandedTheme === theme.id ? <ChevronUp size={20} className="text-sky-500" /> : <ChevronDown size={20} className="text-sky-500" />}
          </button>
          
          <AnimatePresence>
            {expandedTheme === theme.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-6 pt-0 border-t border-slate-800/50 space-y-4">
                  {theme.subCategories.map((subCat) => (
                    <div key={subCat.id} className="border border-slate-800 rounded bg-slate-900/30 overflow-hidden">
                      <button
                        onClick={() => setExpandedSubCategory(expandedSubCategory === subCat.id ? null : subCat.id)}
                        className="w-full flex items-center justify-between p-4 bg-slate-900/50 hover:bg-slate-800/50 transition-colors"
                      >
                        <span className="font-bold text-slate-400 text-xs uppercase tracking-widest font-mono">{subCat.name}</span>
                        {expandedSubCategory === subCat.id ? <ChevronDown size={18} className="text-sky-500" /> : <ChevronRight size={18} className="text-sky-500" />}
                      </button>
                      
                      {expandedSubCategory === subCat.id && (
                        <div className="p-6 bg-slate-950/20 space-y-6">
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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
      <div className="flex-1">
        <div className="font-bold text-slate-300 text-[11px] flex items-center gap-3 uppercase tracking-wider font-mono">
          <div className="w-1.5 h-1.5 bg-slate-800 group-hover:bg-sky-500 transition-colors"></div>
          {skill.name}
        </div>
      </div>
      <div className="flex items-center gap-1.5 self-end sm:self-auto">
        {[0, 1, 2, 3, 4, 5].map((level) => (
          <button
            key={level}
            onClick={() => !readOnly && onChange(level)}
            disabled={readOnly}
            className={cn(
              "w-8 h-7 rounded-sm text-[10px] font-black transition-all flex items-center justify-center border font-mono",
              skill.level >= level && level !== 0
                ? "bg-sky-500/20 text-sky-400 border-sky-500/40 shadow-[0_0_10px_rgba(14,165,233,0.1)]" 
                : level === 0 && skill.level === 0
                ? "bg-slate-800 text-slate-400 border-slate-700"
                : "bg-slate-900 text-slate-700 border-slate-800",
              !readOnly && "hover:border-sky-500/40 cursor-pointer",
              readOnly && "cursor-default"
            )}
            title={`Level ${level}`}
          >
            {level === 0 ? 'Reset' : level}
          </button>
        ))}
      </div>
    </div>
  );
};
