import React, { useState } from 'react';
import { Experience } from '../../types';
import { Briefcase, Pencil, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface ExperienceCardProps {
  exp: Experience;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
  editUI: React.ReactNode;
}

export function ExperienceCard({ exp, isEditing, onEdit, onDelete, editUI }: ExperienceCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (isEditing) {
        return (
            <div className="bg-bg-card border border-primary/30 p-6 rounded-lg ring-1 ring-primary/10">
                {editUI}
            </div>
        );
    }

    return (
        <div 
            className={cn(
                "bg-bg-card border border-divider rounded-lg transition-all duration-300 overflow-hidden group",
                isExpanded ? "border-primary/40 shadow-xl shadow-black/40" : "hover:border-primary/20"
            )}
        >
            <div 
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-6 cursor-pointer flex justify-between items-start"
            >
                <div className="flex gap-5">
                    <div className="w-12 h-12 rounded-xl bg-bg-deep border border-divider flex items-center justify-center shrink-0 group-hover:border-primary/30 transition-colors">
                        <Briefcase size={20} className={cn("transition-colors", isExpanded ? "text-primary" : "text-text-secondary")} />
                    </div>
                    <div>
                        <h4 className="font-black text-white text-lg tracking-tight leading-none mb-2">{exp.role}</h4>
                        <div className="flex items-center gap-2 text-text-secondary text-xs font-bold uppercase tracking-wider">
                            <span>{exp.company}</span>
                            <span className="w-1 h-1 rounded-full bg-divider" />
                            <span className="text-[10px] opacity-80">{exp.startDate} — {exp.endDate}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                    <button onClick={onEdit} className="p-2 text-text-secondary hover:text-white hover:bg-white/5 rounded-lg transition-all"><Pencil size={14}/></button>
                    <button onClick={onDelete} className="p-2 text-text-secondary hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-all"><Trash2 size={14}/></button>
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <div className="px-6 pb-6 pt-0 space-y-6">
                            <div className="h-px w-full bg-divider" />
                            
                            <div className="space-y-3">
                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Contribution & Scope</span>
                                <p className="text-sm text-text-secondary leading-relaxed font-medium">
                                    {exp.description}
                                </p>
                            </div>

                            {exp.technologies && exp.technologies.length > 0 && (
                                <div className="space-y-3">
                                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Stack Integration</span>
                                    <div className="flex flex-wrap gap-2">
                                        {exp.technologies.map(tech => (
                                            <span key={tech} className="px-3 py-1 bg-white/[0.03] border border-divider text-[10px] font-bold text-text-secondary rounded-full hover:border-primary/40 hover:text-white transition-all cursor-default">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
