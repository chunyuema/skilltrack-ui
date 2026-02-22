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
        <div key={theme.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <button
            onClick={() => setExpandedTheme(expandedTheme === theme.id ? null : theme.id)}
            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
          >
            <div className="flex flex-col items-start text-left">
              <h3 className="text-lg font-semibold text-slate-900">{theme.name}</h3>
              <p className="text-sm text-slate-500">{theme.description}</p>
            </div>
            {expandedTheme === theme.id ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
          </button>
          
          <AnimatePresence>
            {expandedTheme === theme.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-4 pt-0 border-t border-slate-100 space-y-2">
                  {theme.subCategories.map((subCat) => (
                    <div key={subCat.id} className="border border-slate-100 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setExpandedSubCategory(expandedSubCategory === subCat.id ? null : subCat.id)}
                        className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 transition-colors"
                      >
                        <span className="font-medium text-slate-700">{subCat.name}</span>
                        {expandedSubCategory === subCat.id ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
                      </button>
                      
                      {expandedSubCategory === subCat.id && (
                        <div className="p-3 bg-white space-y-3">
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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 py-2 border-b border-slate-50 last:border-0">
      <div className="flex-1">
        <div className="font-medium text-slate-700 text-sm">{skill.name}</div>
      </div>
      <div className="flex items-center gap-1 self-end sm:self-auto">
        {[0, 1, 2, 3, 4, 5].map((level) => (
          <button
            key={level}
            onClick={() => !readOnly && onChange(level)}
            disabled={readOnly}
            className={cn(
              "w-7 h-7 rounded-full text-xs font-medium transition-all flex items-center justify-center",
              skill.level >= level && level !== 0
                ? "bg-indigo-600 text-white shadow-sm" 
                : level === 0 && skill.level === 0
                ? "bg-slate-200 text-slate-500 ring-2 ring-slate-300"
                : "bg-slate-100 text-slate-400",
              !readOnly && "hover:bg-slate-200 cursor-pointer",
              readOnly && "cursor-default"
            )}
            title={`Level ${level}`}
          >
            {level}
          </button>
        ))}
      </div>
    </div>
  );
};
