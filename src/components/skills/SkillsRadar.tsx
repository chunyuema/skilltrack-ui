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
            {/* Summary Card */}
            <div className="bg-[#0f172a] border border-slate-800 p-8 rounded-xl shadow-2xl sticky top-6">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-6 font-mono">// ANALYSIS_SUMMARY</h3>
                <div className="flex items-end gap-2 mb-6">
                    <span className="text-6xl font-black text-sky-500 tracking-tighter font-mono">{percentage}%</span>
                    <span className="text-slate-600 text-[10px] font-bold uppercase mb-2 font-mono tracking-widest">Efficiency</span>
                </div>
                <div className="w-full bg-slate-900 border border-slate-800 h-3 mb-6 p-0.5">
                    <div
                        className="bg-sky-500 h-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(14,165,233,0.3)]"
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
                <div className="mb-8">
                    <p className="text-[11px] font-bold text-slate-400 font-mono tracking-widest border-l-2 border-sky-900/50 pl-4 uppercase">
                        CLASS: {percentage < 30 ? "JUNIOR_INIT" :
                            percentage < 60 ? "MID_SYSTEMS" :
                                percentage < 85 ? "SR_ARCHITECT" :
                                    "MASTER_ENG"}
                    </p>
                </div>

                {/* Radar Chart */}
                <div className="bg-slate-900/40 p-4 rounded border border-slate-800/50 h-[300px] flex flex-col items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                            <PolarGrid stroke="#1e293b" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 9, fontWeight: 700, fontFamily: 'monospace' }} />
                            <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
                            <Radar
                                name="Core"
                                dataKey="A"
                                stroke="#0ea5e9"
                                strokeWidth={2}
                                fill="#0ea5e9"
                                fillOpacity={0.15}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '4px' }}
                                itemStyle={{ color: '#0ea5e9', fontSize: '10px', fontWeight: 'bold', fontFamily: 'monospace' }}
                                labelStyle={{ color: '#94a3b8', fontSize: '10px', marginBottom: '4px', fontWeight: 'bold', fontFamily: 'monospace' }}
                                formatter={(value: number) => [value, 'VAL']}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
