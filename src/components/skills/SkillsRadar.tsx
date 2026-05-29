import React, { useMemo } from "react";
import { SkillTheme } from "../../types";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface SkillsRadarProps {
  themes: SkillTheme[];
  allThemes?: SkillTheme[];
  activeTierLabel?: string;
  color?: string;
}

// Custom tick renderer to dynamically prevent text collisions based on circle positioning
const RadarAxisTick = (props: any) => {
  const { x, y, payload, cx, cy } = props;

  // Determine horizontal alignment based on which side of the center the tick sits
  let textAnchor: "start" | "middle" | "end" | "inherit" = "middle";
  if (x > cx + 10) textAnchor = "start";
  if (x < cx - 10) textAnchor = "end";

  // Determine vertical offset to prevent top/bottom clipping
  let dy = 3;
  if (y < cy - 10) dy = -4; // Pull top labels slightly higher
  if (y > cy + 10) dy = 10; // Push bottom labels slightly lower

  return (
    <g transform={`translate(${x}, ${y})`}>
      <text
        textAnchor={textAnchor}
        dy={dy}
        fill="#718096"
        fontSize={8}
        fontWeight={700}
        fontFamily="monospace"
      >
        {payload.value}
      </text>
    </g>
  );
};

export default function SkillsRadar({ themes, activeTierLabel, color = "#5a67d8" }: SkillsRadarProps) {
  // 1. Calculate Tier Progress (from current themes)
  const { percentage: tierPercentage, totalPoints } = useMemo(() => {
    if (!themes || themes.length === 0)
      return { percentage: 0, totalPoints: 0 };

    const allSubCats = themes.flatMap((t) => t.subCategories);
    const totalLevel = allSubCats.reduce(
      (sum, sub) => sum + (sub.level || 0),
      0,
    );
    const maxLevel = allSubCats.length * 5;

    return {
      percentage: maxLevel > 0 ? Math.round((totalLevel / maxLevel) * 100) : 0,
      totalPoints: allSubCats.length,
    };
  }, [themes]);

  // 2. Calculate Chart Data (Aggregated by Parent Theme)
  const chartData = useMemo(() => {
    if (!themes || themes.length === 0) return [];

    return themes.map((theme) => {
      const total = theme.subCategories.reduce(
        (sum, sub) => sum + (sub.level || 0),
        0,
      );
      const avg = theme.subCategories.length
        ? total / theme.subCategories.length
        : 0;

      const truncatedName =
        theme.name.length > 16
          ? `${theme.name.slice(0, 16).trim()}…`
          : theme.name;

      return {
        subject: truncatedName.toUpperCase(),
        fullName: theme.name,
        A: Number(avg.toFixed(1)),
        fullMark: 5,
      };
    });
  }, [themes]);

  if (chartData.length === 0) {
    return (
      <div className="bg-bg-card border border-divider p-12 rounded-lg text-center flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 border-2 border-divider border-dashed rounded-full flex items-center justify-center mb-4">
            <span className="text-text-secondary">?</span>
        </div>
        <p className="text-text-secondary font-mono text-[10px] uppercase tracking-widest max-w-[200px]">
          Select modules in this tier to view proficiency mapping.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-bg-card border border-divider p-8 rounded-lg shadow-xl relative overflow-hidden">
        <div 
          className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full blur-2xl"
          style={{ backgroundColor: `${color}10` }}
        ></div>

        <div className="flex justify-between items-start mb-6 relative">
          <div className="flex items-end gap-3">
            <span className="text-6xl font-black text-white tracking-tighter leading-none">
              {tierPercentage}%
            </span>
            <div className="flex flex-col mb-1">
              <span 
                className="font-black text-[10px] uppercase tracking-widest"
                style={{ color }}
              >
                {activeTierLabel || 'Tier'}
              </span>
              <span className="text-text-secondary font-bold text-[10px] uppercase tracking-widest">
                Proficiency
              </span>
            </div>
          </div>
        </div>

        <div className="w-full bg-slate-900 border border-divider h-1.5 mb-8 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-1000 ease-out"
            style={{ width: `${tierPercentage}%`, backgroundColor: color }}
          ></div>
        </div>

        {/* Radar Chart Container */}
        <div className="h-[340px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="60%" data={chartData}>
              <PolarGrid stroke="#1a202c" />
              <PolarAngleAxis dataKey="subject" tick={<RadarAxisTick />} />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 5]}
                tick={false}
                axisLine={false}
              />
              <Radar
                name="Competency"
                dataKey="A"
                stroke={color}
                strokeWidth={2}
                fill={color}
                fillOpacity={0.25}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0b0e14",
                  border: "1px solid #1a202c",
                  borderRadius: "4px",
                  padding: "12px",
                }}
                itemStyle={{
                  color: "#ffffff",
                  fontSize: "11px",
                  fontWeight: "bold",
                }}
                labelStyle={{
                  color: color,
                  fontSize: "10px",
                  marginBottom: "4px",
                  fontWeight: "black",
                  textTransform: "uppercase",
                }}
                labelFormatter={(label, items) =>
                  items[0]?.payload?.fullName || label
                }
                formatter={(value: number) => [value, "LEVEL"]}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 pt-4 border-t border-divider flex flex-wrap gap-x-4 gap-y-2 justify-center">
          <div className="flex items-center gap-1.5">
            <div 
              className="w-2 h-2 rounded-full border"
              style={{ backgroundColor: `${color}4d`, borderColor: `${color}80` }}
            ></div>
            <span className="text-[8px] font-black text-text-secondary uppercase tracking-widest">
              Modules: {chartData.length} themes
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-white/10 border border-white/20"></div>
            <span className="text-[8px] font-black text-text-secondary uppercase tracking-widest">
              Points: {totalPoints} Sub-Categories
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
