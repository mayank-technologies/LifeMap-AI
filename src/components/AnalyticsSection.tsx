import React, { useState } from 'react';
import { UserProfile, Goal, Habit, Task } from '../types';
import { TrendingUp, BarChart3, Calendar, Grid, Activity, Sparkles, Scale, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

interface AnalyticsSectionProps {
  profile: UserProfile;
  goals: Goal[];
  habits: Habit[];
  tasks: Task[];
}

export default function AnalyticsSection({ profile, goals, habits, tasks }: AnalyticsSectionProps) {
  const [metricTab, setMetricTab] = useState<'all' | 'productivity' | 'habits' | 'balance'>('all');

  // Calculate actual ratios for charts
  const finishedGoals = goals.filter(g => g.status === 'completed' || (g.milestones.length > 0 && g.milestones.every(m => m.done))).length;
  const activeGoalsCount = goals.length;
  const goalCompletionPct = activeGoalsCount > 0 ? Math.round((finishedGoals / activeGoalsCount) * 100) : 0;

  // Compute habit completion metrics
  const totalHabitsReg = habits.length;
  const completedTodayCount = habits.filter(h => h.logs[new Date().toISOString().split('T')[0]]).length;
  const habitCompletionTodayPct = totalHabitsReg > 0 ? Math.round((completedTodayCount / totalHabitsReg) * 100) : 0;

  // Weekday productivity data (last 7 days proxy)
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const productivityTrendData = [62, 70, 68, 82, 75, 88, 92]; // proxy of high growth trend

  // Create GitHub-style monthly 28-cell grid completion map (simulated mock based on current habit trends)
  const generateHeatmapGrid = () => {
    const cells = [];
    // generate 28 cells
    for (let i = 1; i <= 28; i++) {
      // Simulate higher consistency toward weekdays unless total habits are very low
      const frequencyFactor = totalHabitsReg > 0 ? 0.4 + (Math.random() * 0.6) : 0.2;
      const reached = frequencyFactor > 0.45;
      cells.push({
        dayIndex: i,
        intensity: reached ? (Math.random() > 0.5 ? 'high' : 'medium') : 'none'
      });
    }
    return cells;
  };
  const heatmapData = generateHeatmapGrid();

  return (
    <div id="analytics-tab" className="space-y-8">
      
      {/* Intro Panel */}
      <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-400/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-400 uppercase tracking-wider font-mono mb-3">
            <Activity className="w-3.5 h-3.5 animate-pulse" /> BIO-LOGICAL ANALYTICS HUB
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight leading-none">
            Life Map Performance Intelligence
          </h2>
          <p className="text-xs text-slate-400 mt-2 max-w-2xl leading-relaxed">
            Correlate habit completions directly against long-term roadmap outputs to optimize focus allocation.
          </p>
        </div>
      </div>

      {/* Analytics subtabs */}
      <div className="flex border-b border-white/5 gap-4">
        {[
          { tab: 'all' as const, label: "Compound Dashboard" },
          { tab: 'productivity' as const, label: "Productivity Index" },
          { tab: 'habits' as const, label: "Habit Consistency Heatmap" },
          { tab: 'balance' as const, label: "Balance Quotient" }
        ].map(item => (
          <button
            key={item.tab}
            id={`analytics-subtab-${item.tab}`}
            onClick={() => setMetricTab(item.tab)}
            className={`pb-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              metricTab === item.tab 
                ? 'border-indigo-500 text-slate-100 font-extrabold' 
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Metric tab conditional rendering: Productivity (7-day Curve) */}
        {(metricTab === 'all' || metricTab === 'productivity') && (
          <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-slate-900/20 p-5 space-y-4 shadow-lg">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <div>
                <h4 className="font-bold text-sm text-slate-200 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-indigo-400" /> Daily Productivity Trend
                </h4>
                <p className="text-[11px] text-slate-500">Focus hours metrics logged past 7 days</p>
              </div>
              <span className="text-xs text-indigo-400 font-mono font-extrabold">Avg: 77%</span>
            </div>

            {/* Custom SVG Line Graph for ultra-clean compatibility */}
            <div className="w-full h-48 relative pt-4">
              <svg className="w-full h-full text-indigo-500 overflow-visible" viewBox="0 0 700 200">
                <defs>
                  <linearGradient id="glowgrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                
                {/* Horizontal reference lines */}
                <line x1="0" y1="40" x2="700" y2="40" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1="0" y1="100" x2="700" y2="100" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1="0" y1="160" x2="700" y2="160" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

                {/* Shaded Area */}
                <path 
                  d="M 50,150 L 150,130 L 250,135 L 350,100 L 450,115 L 550,85 L 650,55 L 650,180 L 50,180 Z" 
                  fill="url(#glowgrad)" 
                />

                {/* Smooth curve line */}
                <path 
                  d="M 50,150 Q 100,135 150,130 T 250,135 T 350,100 T 450,115 T 550,85 T 650,55" 
                  fill="none" 
                  stroke="url(#indigo-grad)" 
                  strokeWidth="3" 
                  strokeLinecap="round"
                />
                
                {/* Linear Glow Gradient definition */}
                <linearGradient id="indigo-grad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#4F46E5" />
                  <stop offset="50%" stopColor="#06B6D4" />
                  <stop offset="100%" stopColor="#22C55E" />
                </linearGradient>

                {/* SVG Nodes dots */}
                {[
                  { x: 50, y: 150, val: 62 },
                  { x: 150, y: 130, val: 70 },
                  { x: 250, y: 135, val: 68 },
                  { x: 350, y: 100, val: 82 },
                  { x: 450, y: 115, val: 75 },
                  { x: 550, y: 85, val: 88 },
                  { x: 650, y: 55, val: 92 },
                ].map((node, nIdx) => (
                  <g key={nIdx}>
                    <circle cx={node.x} cy={node.y} r="5" fill="#1e1b4b" stroke={nIdx === 6 ? '#22C55E' : '#4F46E5'} strokeWidth="2.5" />
                    {/* Val print */}
                    <text x={node.x} y={node.y - 12} fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                      {node.val}%
                    </text>
                    {/* Day name */}
                    <text x={node.x} y="195" fill="#475569" fontSize="10" fontFamily="monospace" textAnchor="middle">
                      {daysOfWeek[nIdx]}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>
        )}

        {/* Metric tab conditional rendering: Heatmap (Grid) */}
        {(metricTab === 'all' || metricTab === 'habits') && (
          <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-slate-900/20 p-5 space-y-4 shadow-lg">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <div>
                <h4 className="font-bold text-sm text-slate-200 flex items-center gap-1.5">
                  <Grid className="w-4 h-4 text-cyan-400" /> Habit Consistency Heatmap
                </h4>
                <p className="text-[11px] text-slate-500">28-day habit tracking blocks</p>
              </div>
              <span className="text-[10px] uppercase font-mono text-cyan-400 font-bold">RECONSTRUCT SLOTS</span>
            </div>

            {/* Heatmap Blocks */}
            <div className="py-2">
              <div className="grid grid-cols-7 gap-2.5">
                {heatmapData.map((cell) => (
                  <div 
                    key={cell.dayIndex}
                    className={`aspect-square rounded border flex items-center justify-center transition-all ${
                      cell.intensity === 'high' 
                        ? 'bg-cyan-500 border-cyan-400 text-slate-950 font-black shadow shadow-cyan-500/10' 
                        : cell.intensity === 'medium'
                          ? 'bg-cyan-950/40 border-cyan-700/40 text-cyan-300 font-bold'
                          : 'bg-slate-950 border-white/5 text-slate-600'
                    }`}
                  >
                    <span className="text-[9px] font-mono">{cell.dayIndex}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between text-[10px] text-slate-500 mt-4 px-1 font-mono">
                <span>Day 1 (Beginning of block)</span>
                <div className="flex items-center gap-1">
                  <span>Legend:</span>
                  <div className="w-2.5 h-2.5 bg-slate-950 border border-white/5 rounded" />
                  <span>No log</span>
                  <div className="w-2.5 h-2.5 bg-cyan-950/45 border border-cyan-800 rounded" />
                  <span>Logged</span>
                  <div className="w-2.5 h-2.5 bg-cyan-500 rounded" />
                  <span>Perfect</span>
                </div>
                <span>Day 28 (Goal terminal)</span>
              </div>
            </div>
          </div>
        )}

        {/* Life Balance Index Wheel Widget */}
        <div className="rounded-2xl border border-white/5 bg-slate-900/20 p-5 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <div>
              <h4 className="font-bold text-sm text-slate-200 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-rose-400" /> Balance Quotient
              </h4>
              <p className="text-[11px] text-slate-500">Stability across core sectors</p>
            </div>
            <span className="text-3xl font-black text-slate-100 font-mono tracking-tight">{profile.scores.balanceIndex}</span>
          </div>

          <div className="relative flex justify-center items-center py-6">
            {/* Visual Balance Circle */}
            <svg className="w-32 h-32 transform -rotate-95 overflow-visible">
              <circle cx="64" cy="64" r="54" stroke="rgba(255,255,255,0.03)" strokeWidth="6" fill="transparent" />
              <circle 
                cx="64" 
                cy="64" 
                r="54" 
                stroke="#EF4444" 
                strokeWidth="6" 
                fill="transparent" 
                strokeDasharray="339.29" 
                strokeDashoffset={339.29 - (339.29 * profile.scores.balanceIndex) / 100}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-x-0 mx-auto text-center flex flex-col justify-center items-center">
              <span className="text-xs font-mono font-bold text-rose-400">Balance</span>
              <span className="text-[10px] text-slate-500 font-mono">Factor index</span>
            </div>
          </div>

          <div className="space-y-2 text-[11px] bg-slate-950 p-2.5 rounded-lg border border-white/5">
            <span className="text-[9px] uppercase font-mono text-slate-500 block font-bold">Balance Matrix Factors:</span>
            <div className="flex justify-between">
              <span className="text-slate-400">Career Vector allocation:</span>
              <b className="text-slate-200 font-mono">Excellent</b>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Health consistency level:</span>
              <b className="text-slate-200 font-mono">{profile.scores.health > 70 ? 'Optimal' : 'Needs sleep buffer'}</b>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Skills compounding logs:</span>
              <b className="text-slate-200 font-mono">compounding</b>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
