import React, { useMemo } from 'react';
import { SkillTheme } from '../../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface SkillsRadarProps {
    themes: SkillTheme[];
}

export default function SkillsRadar({ themes }: SkillsRadarProps) {
    // Calculate scores for each theme
    const chartData = useMemo(() => {
        return themes.map(theme => {
            let totalLevel = 0;
            let skillCount = 0;

            theme.subCategories.forEach(sub => {
                sub.skills.forEach(skill => {
                    totalLevel += skill.level;
                    skillCount += 1;
                });
            });

            const average = skillCount > 0 ? totalLevel / skillCount : 0;

            return {
                subject: theme.name.split(' ')[0].toUpperCase(),
                fullName: theme.name,
                A: parseFloat(average.toFixed(2)),
                fullMark: 5,
            };
        });
    }, [themes]);

    // Calculate overall progress
    const totalScore = chartData.reduce((acc, curr) => acc + curr.A, 0);
    const maxScore = themes.length * 5;
    const percentage = Math.round((totalScore / maxScore) * 100);

    return (
        <div className="space-y-6">
            <div className="bg-bg-card border border-divider p-8 rounded-lg shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -mr-16 -mt-16 rounded-full blur-2xl"></div>
                
                <div className="flex items-end gap-3 mb-6 relative">
                    <span className="text-6xl font-black text-white tracking-tighter leading-none">{percentage}%</span>
                    <div className="flex flex-col mb-1">
                        <span className="text-primary font-black text-[10px] uppercase tracking-widest">Global</span>
                        <span className="text-text-secondary font-bold text-[10px] uppercase tracking-widest">Score</span>
                    </div>
                </div>

                <div className="w-full bg-slate-900 border border-divider h-1.5 mb-8 rounded-full overflow-hidden">
                    <div
                        className="bg-primary h-full transition-all duration-1000 ease-out"
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>

                {/* Radar Chart */}
                <div className="h-[280px] w-full flex flex-col items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
                            <PolarGrid stroke="#1a202c" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#718096', fontSize: 9, fontWeight: 700, fontFamily: 'monospace' }} />
                            <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
                            <Radar
                                name="Competency"
                                dataKey="A"
                                stroke="#5a67d8"
                                strokeWidth={2}
                                fill="#5a67d8"
                                fillOpacity={0.15}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0b0e14', border: '1px solid #1a202c', borderRadius: '4px', padding: '12px' }}
                                itemStyle={{ color: '#ffffff', fontSize: '11px', fontWeight: 'bold' }}
                                labelStyle={{ color: '#5a67d8', fontSize: '10px', marginBottom: '4px', fontWeight: 'black', textTransform: 'uppercase' }}
                                formatter={(value: number) => [value, 'PROFICIENCY']}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
                
                <div className="mt-6 pt-6 border-t border-divider flex justify-between items-center">
                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Tier Rank</span>
                    <span className="text-xs font-black text-white uppercase tracking-tighter">
                        {percentage < 30 ? "Associate" :
                            percentage < 60 ? "Professional" :
                                percentage < 85 ? "Strategic" :
                                    "Distinguished"}
                    </span>
                </div>
            </div>
        </div>
    );
}
