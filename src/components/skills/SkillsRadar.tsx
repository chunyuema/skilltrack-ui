import React, { useMemo } from 'react';
import { SkillTheme } from '../../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Info } from 'lucide-react';

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
                subject: theme.name.split(' ')[0], // Shorten name for chart
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
            <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg sticky top-6">
                <h3 className="text-lg font-semibold mb-2">Overall Proficiency</h3>
                <div className="flex items-end gap-2 mb-4">
                    <span className="text-5xl font-bold text-indigo-400">{percentage}%</span>
                    <span className="text-slate-400 mb-1">of max potential</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 mb-2">
                    <div
                        className="bg-indigo-500 h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
                <p className="text-sm text-slate-400 mb-6">
                    {percentage < 30 ? "Junior Level" :
                        percentage < 60 ? "Mid-Level" :
                            percentage < 85 ? "Senior Level" :
                                "Staff / Principal Level"}
                </p>

                {/* Radar Chart */}
                <div className="bg-white p-2 rounded-xl h-[300px] flex flex-col">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                            <PolarGrid stroke="#e2e8f0" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
                            <Radar
                                name="Proficiency"
                                dataKey="A"
                                stroke="#6366f1"
                                strokeWidth={2}
                                fill="#818cf8"
                                fillOpacity={0.3}
                            />
                            <Tooltip
                                formatter={(value: number) => [value, 'Score']}
                                labelFormatter={(label: string) => {
                                    const item = chartData.find(d => d.subject === label);
                                    return item ? item.fullName : label;
                                }}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
