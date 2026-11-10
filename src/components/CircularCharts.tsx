import { useState } from 'react';
import { QuestionStats, QUESTIONS, OverallStats } from '../types';

interface CircularGaugeProps {
  score: number;
  maxScore?: number;
  size?: number;
  strokeWidth?: number;
  color: string;
  bgColor?: string;
  label?: string;
  sublabel?: string;
}

export function CircularGauge({
  score,
  maxScore = 5,
  size = 130,
  strokeWidth = 9,
  color,
  bgColor = 'rgba(226, 232, 240, 0.6)',
  label,
  sublabel,
}: CircularGaugeProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(100, Math.max(0, (score / maxScore) * 100));
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-stone-200/70 dark:text-stone-800/80"
            fill="transparent"
          />
          {/* Animated progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-extrabold text-stone-900 dark:text-stone-100 tabular-nums tracking-tight leading-none">
            {score.toFixed(2)}
          </span>
          <span className="text-[11px] text-stone-400 font-medium mt-1">
            / {maxScore.toFixed(0)}
          </span>
        </div>
      </div>

      {label && (
        <span className="mt-2 text-xs font-semibold text-stone-800 dark:text-stone-200 text-center line-clamp-2">
          {label}
        </span>
      )}
      {sublabel && (
        <span className="text-[11px] text-stone-400 dark:text-stone-500 text-center">
          {sublabel}
        </span>
      )}
    </div>
  );
}

interface DonutDistributionChartProps {
  stats: OverallStats;
}

export function DonutDistributionChart({ stats }: DonutDistributionChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Aggregate ratings across all 5 questions
  const totalStarCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let grandTotalVotes = 0;

  Object.values(stats.questionStats).forEach((qStat) => {
    [5, 4, 3, 2, 1].forEach((star) => {
      const count = qStat.distribution[star as 1 | 2 | 3 | 4 | 5];
      totalStarCounts[star as 1 | 2 | 3 | 4 | 5] += count;
      grandTotalVotes += count;
    });
  });

  const tiersData = [
    { star: 5, label: 'ระดับมากที่สุด (5 ดาว)', color: '#10b981', count: totalStarCounts[5] },
    { star: 4, label: 'ระดับมาก (4 ดาว)', color: '#0ea5e9', count: totalStarCounts[4] },
    { star: 3, label: 'ระดับปานกลาง (3 ดาว)', color: '#f59e0b', count: totalStarCounts[3] },
    { star: 2, label: 'ระดับน้อย (2 ดาว)', color: '#f97316', count: totalStarCounts[2] },
    { star: 1, label: 'ระดับน้อยที่สุด (1 ดาว)', color: '#f43f5e', count: totalStarCounts[1] },
  ];

  // SVG Donut calculation
  const size = 240;
  const strokeWidth = 32;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="flex flex-col md:flex-row items-center justify-around gap-8 p-4">
      {/* Donut graphic */}
      <div className="relative inline-flex items-center justify-center shrink-0">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-stone-100 dark:text-stone-800"
            fill="transparent"
          />

          {grandTotalVotes > 0 &&
            tiersData.map((tier, idx) => {
              const slicePercent = (tier.count / grandTotalVotes) * 100;
              const strokeDasharray = `${(slicePercent / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
              accumulatedPercent += slicePercent;

              if (slicePercent <= 0) return null;

              const isHovered = hoveredIndex === idx;

              return (
                <circle
                  key={tier.star}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke={tier.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  fill="transparent"
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              );
            })}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 tabular-nums">
            {stats.overallMean.toFixed(2)}
          </span>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
            {stats.overallTier.level}
          </span>
          <span className="text-[10px] text-stone-400 mt-1">
            {stats.totalCount} ผู้ตอบแบบประเมิน
          </span>
        </div>
      </div>

      {/* Legend list */}
      <div className="space-y-2.5 w-full max-w-sm">
        <div className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2">
          สัดส่วนการให้คะแนนทั้งหมด ({grandTotalVotes} โหวต)
        </div>
        {tiersData.map((tier, idx) => {
          const pct = grandTotalVotes > 0 ? ((tier.count / grandTotalVotes) * 100).toFixed(1) : '0.0';
          const isHovered = hoveredIndex === idx;
          return (
            <div
              key={tier.star}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`p-2 rounded-xl border transition-all flex items-center justify-between text-xs cursor-pointer ${
                isHovered
                  ? 'bg-stone-100 dark:bg-stone-800 border-stone-300 dark:border-stone-700'
                  : 'bg-stone-50/60 dark:bg-stone-800/40 border-stone-200/60 dark:border-stone-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: tier.color }} />
                <span className="font-medium text-stone-700 dark:text-stone-200">{tier.label}</span>
              </div>
              <div className="flex items-center gap-3 tabular-nums font-semibold">
                <span className="text-stone-500 dark:text-stone-400">{tier.count} โหวต</span>
                <span className="text-stone-900 dark:text-stone-100 w-12 text-right">{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface CircularQuestionsListProps {
  stats: OverallStats;
}

export function CircularQuestionsList({ stats }: CircularQuestionsListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {QUESTIONS.map((q, idx) => {
        const qStat = stats.questionStats[q.id];
        const tier = qStat.tier;

        return (
          <div
            key={q.id}
            className="bg-white dark:bg-stone-900/80 rounded-2xl p-4 border border-stone-200/80 dark:border-stone-800 shadow-sm flex flex-col items-center justify-between text-center transition hover:border-stone-300 dark:hover:border-stone-700"
          >
            <div className="w-full text-left mb-2">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                ข้อที่ {idx + 1}
              </span>
              <h4 className="text-xs font-semibold text-stone-800 dark:text-stone-200 line-clamp-2 mt-0.5 leading-snug">
                {q.title}
              </h4>
            </div>

            {/* Circular Gauge */}
            <div className="my-2">
              <CircularGauge
                score={qStat.mean}
                maxScore={5}
                size={110}
                strokeWidth={8}
                color={tier.hexColor}
              />
            </div>

            {/* Likert Badge & Details */}
            <div className="w-full mt-2 pt-2 border-t border-stone-100 dark:border-stone-800 space-y-1">
              <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-bold ${tier.badgeBg} ${tier.textColor}`}>
                {tier.level}
              </span>
              <div className="text-[10px] text-stone-400 tabular-nums">
                S.D. = {qStat.sd.toFixed(2)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
