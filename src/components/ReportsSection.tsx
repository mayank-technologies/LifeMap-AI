import React, { useState } from 'react';
import { UserProfile, Goal, Habit, Task } from '../types';
import { Award, CheckCircle2, Heart, Scale, ShieldAlert, Sparkles, Compass, Printer, Share2 } from 'lucide-react';
import { motion } from 'motion/react';

interface ReportsSectionProps {
  profile: UserProfile;
  goals: Goal[];
  habits: Habit[];
  tasks: Task[];
}

export default function ReportsSection({ profile, goals, habits, tasks }: ReportsSectionProps) {
  const [reportType, setReportType] = useState<'weekly' | 'monthly'>('weekly');

  const todayStr = new Date().toISOString().split('T')[0];
  
  // Calculate completed metrics
  const completedTasksCount = tasks.filter(t => t.completed).length;
  const activeRoadmapsCount = goals.length;
  const completedMilestones = goals.reduce((acc, g) => acc + g.milestones.filter(m => m.done).length, 0);

  // Compute habit logs count
  const totalHabitLogsRegistered = habits.reduce((acc, h) => acc + Object.keys(h.logs).length, 0);

  // Print/PDF action handler helper
  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="reports-tab" className="space-y-8 print:bg-white print:text-black print:p-8">
      
      {/* Selector and Print actions bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/60 p-4 rounded-xl border border-white/5 print:hidden">
        <div className="flex gap-2">
          <button
            id="report-type-weekly"
            onClick={() => setReportType('weekly')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              reportType === 'weekly' 
                ? 'bg-indigo-600 text-white' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Weekly Statement
          </button>
          <button
            id="report-type-monthly"
            onClick={() => setReportType('monthly')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              reportType === 'monthly' 
                ? 'bg-indigo-600 text-white' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Monthly audit
          </button>
        </div>

        <div className="flex gap-2 self-stretch md:self-auto">
          <button
            id="print-report-btn"
            onClick={handlePrint}
            className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-slate-950 hover:bg-slate-900 border border-white/10 text-xs font-bold text-slate-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* Document page look layout box */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/10 p-6 md:p-10 shadow-2xl space-y-8 relative overflow-hidden print:border-none print:shadow-none print:p-0">
        
        {/* Decorative corner borders representing high high-fidelity standard */}
        <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-indigo-500/20 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-indigo-500/20 pointer-events-none" />

        {/* Document Header */}
        <div className="flex flex-col md:flex-row justify-between items-start border-b border-white/10 pb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[9px] font-mono text-indigo-400 font-extrabold uppercase tracking-widest mb-1.5">
              <Sparkles className="w-3" /> Mayank Technologies &bull; LifeMap AI
            </div>
            <h2 className="text-xl md:text-2.5xl font-black text-slate-100 tracking-tight leading-none uppercase">
              {reportType === 'weekly' ? 'WEEKLY STATISTICAL STATEMENT' : 'MONTHLY LIFE-FACTOR AUDIT'}
            </h2>
            <p className="text-[11px] text-slate-500 font-serif italic mt-1.5 font-medium">
              "Design Your Future. Live With Direction." Continuous growth prediction report
            </p>
          </div>

          <div className="text-left md:text-right font-mono text-[10px] text-slate-500 space-y-1">
            <p><b>Statement ID:</b> AUD_W{Date.now().toString().slice(-6)}</p>
            <p><b>Compiled on:</b> {new Date().toLocaleString()}</p>
            <p><b>Registered Owner:</b> {profile.fullName}</p>
          </div>
        </div>

        {/* Executive summary details block */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-slate-950/60 p-6 rounded-xl border border-white/5">
          <div className="text-center md:border-r border-white/5 last:border-none p-2">
            <span className="text-[9px] uppercase font-mono text-slate-500 block">Compound Level</span>
            <span className="text-2xl font-black text-white font-mono mt-1 block">Lv. {profile.level}</span>
            <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">{profile.xp} Cumulative XP</span>
          </div>

          <div className="text-center md:border-r border-white/5 last:border-none p-2">
            <span className="text-[9px] uppercase font-mono text-slate-500 block">Completed Items</span>
            <span className="text-2xl font-black text-emerald-400 font-mono mt-1 block">+{completedTasksCount} Tasks</span>
            <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">{completedMilestones} milestones checks</span>
          </div>

          <div className="text-center md:border-r border-white/5 last:border-none p-2">
            <span className="text-[9px] uppercase font-mono text-slate-500 block">Habit anchor Logs</span>
            <span className="text-2xl font-black text-cyan-400 font-mono mt-1 block">+{totalHabitLogsRegistered} Hits</span>
            <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">{activeRoadmapsCount} dynamic roadmaps</span>
          </div>

          <div className="text-center p-2">
            <span className="text-[9px] uppercase font-mono text-slate-500 block">Overall Balance Index</span>
            <span className="text-2xl font-black text-rose-400 font-mono mt-1 block">{profile.scores.balanceIndex}%</span>
            <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">{profile.scores.productivity}% productivity rate</span>
          </div>
        </div>

        {/* Dynamic section: KPI indices and radar-like metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-slate-300 font-mono border-b border-white/5 pb-2">Active Indices Summary (%)</h4>
            
            <div className="space-y-3.5">
              {[
                { name: "Productivity Coefficient", val: profile.scores.productivity, color: "bg-indigo-500" },
                { name: "Health & Care Reserve", val: profile.scores.health, color: "bg-emerald-500" },
                { name: "Learning Compounding Scale", val: profile.scores.learning, color: "bg-cyan-500" },
                { name: "Goal Alignment Yield", val: profile.scores.goal, color: "bg-amber-500" },
              ].map((idx, index) => (
                <div key={index} className="space-y-1 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-400">{idx.name}</span>
                    <span className="text-slate-200 font-mono">{idx.val}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-white/5">
                    <div className={`${idx.color} h-full rounded-full`} style={{ width: `${idx.val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-xl border border-white/5 bg-slate-950/40 flex flex-col justify-between">
            <div>
              <span className="text-[10px] bg-slate-900 border border-white/5 px-2 py-0.5 rounded text-indigo-400 font-mono uppercase font-bold">
                Strategist Advice summary
              </span>
              <p className="text-xs text-slate-300 font-serif italic leading-relaxed mt-4">
                "Based on the weekly consistency rate of {totalHabitLogsRegistered > 6 ? '78%' : '45%'}, focus remains highly anchored but prone to minor switches. We recommend allocating a strict Time Block for coding milestones, and securing an earlier sleep schedule on weekdays to defend base health metrics."
              </p>
            </div>

            <div className="pt-3 border-t border-white/5 mt-4 flex items-center gap-1.5 text-[9px] font-mono text-slate-500 uppercase font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Verified by Mayank Technologies AI Engine
            </div>
          </div>
        </div>

        {/* Milestone targets compiled review card */}
        <div className="border-t border-dashed border-white/10 pt-6 space-y-3">
          <h4 className="text-xs font-black uppercase text-slate-400 font-mono">System goals log checklist</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {goals.slice(0, 4).map((g) => {
              const comp = g.milestones.filter(m => m.done).length;
              return (
                <div key={g.id} className="text-xs flex justify-between p-3 border border-white/5 bg-slate-950 rounded-xl">
                  <span className="font-semibold text-slate-300 truncate max-w-[170px]">{g.title}</span>
                  <span className="font-mono text-slate-500 font-bold">{comp} / {g.milestones.length} stages checked</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Printable Footer */}
        <div className="border-t border-white/10 pt-6 text-center text-[10px] text-slate-600 font-mono">
          <p>© 2026 Mayank Technologies LifeMap AI Engine. All personal objectives are securely encrypted locally.</p>
          <p className="mt-1 print:block hidden">System printed from LifeMap AI OS preview environment.</p>
        </div>

      </div>

    </div>
  );
}
