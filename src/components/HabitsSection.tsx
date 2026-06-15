import React, { useState } from 'react';
import { Habit, UserProfile } from '../types';
import { Flame, Sparkles, Plus, Calendar, Compass, RefreshCw, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HabitsSectionProps {
  profile: UserProfile;
  habits: Habit[];
  onAddHabit: (newHabit: Habit) => void;
  onToggleHabit: (habitId: string, dateKey: string) => void;
  onDeleteHabit: (habitId: string) => void;
}

const CATEGORIES = [
  { value: 'study', label: 'Study & Work', icon: '📝' },
  { value: 'exercise', label: 'Exercise', icon: '🏃' },
  { value: 'reading', label: 'Reading', icon: '📚' },
  { value: 'sleep', label: 'Sleep Quality', icon: '😴' },
  { value: 'meditation', label: 'Mindfulness', icon: '🧘' },
  { value: 'water', label: 'Water Intake', icon: '💧' },
  { value: 'custom', label: 'Custom Protocol', icon: '🎯' }
] as const;

export default function HabitsSection({ profile, habits, onAddHabit, onToggleHabit, onDeleteHabit }: HabitsSectionProps) {
  const [habitName, setHabitName] = useState('');
  const [category, setCategory] = useState<Habit['category']>('study');
  const [frequency, setFrequency] = useState<Habit['frequency']>('daily');

  const handleCreateHabit = () => {
    if (!habitName.trim()) return;
    const newHabit: Habit = {
      id: `habit_${Date.now()}`,
      name: habitName,
      category,
      streak: 0,
      maxStreak: 0,
      logs: {},
      frequency
    };
    onAddHabit(newHabit);
    setHabitName('');
  };

  // Generate date formats for past 5 days
  const getPastDays = () => {
    const list = [];
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 4; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const parts = d.toISOString().split('T')[0];
      list.push({
        dateKey: parts,
        dayNum: d.getDate(),
        weekday: weekdays[d.getDay()],
        isToday: i === 0
      });
    }
    return list;
  };

  const datesList = getPastDays();

  return (
    <div id="habits-tab" className="space-y-8">
      
      {/* Top Creation Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Habit setup form */}
        <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Plus className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">Create Habit Anchor</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-1.5 uppercase tracking-wider">Habit Action Name</label>
                <input 
                  id="habit-setup-name"
                  type="text" 
                  value={habitName}
                  onChange={(e) => setHabitName(e.target.value)}
                  placeholder="e.g., Code 1 hour, Write journal, Meditate 10m"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 text-white border border-white/10 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-sm placeholder:text-slate-600"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-1.5 uppercase tracking-wider">Category Category</label>
                <select 
                  id="habit-setup-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Habit['category'])}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-955 text-sm bg-slate-950 text-white border border-white/10 focus:border-cyan-500"
                >
                  {CATEGORIES.map(c => (
                    <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-1.5 uppercase tracking-wider">Commitment Frequency</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    id="freq-daily-btn"
                    onClick={() => setFrequency('daily')}
                    className={`py-2 rounded-lg text-xs font-bold capitalize transition-all border ${
                      frequency === 'daily' 
                        ? 'bg-cyan-950/40 border-cyan-400 text-cyan-300 ring-1 ring-cyan-400' 
                        : 'bg-slate-955 bg-slate-950 border-white/10 text-slate-400'
                    }`}
                  >
                    Daily loop
                  </button>
                  <button
                    id="freq-weekly-btn"
                    onClick={() => setFrequency('weekly')}
                    className={`py-2 rounded-lg text-xs font-bold capitalize transition-all border ${
                      frequency === 'weekly' 
                        ? 'bg-cyan-950/40 border-cyan-400 text-cyan-300 ring-1 ring-cyan-400' 
                        : 'bg-slate-955 bg-slate-950 border-white/10 text-slate-400'
                    }`}
                  >
                    Weekly loop
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            id="create-habit-btn"
            disabled={!habitName.trim()}
            onClick={handleCreateHabit}
            className="w-full mt-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-600 text-xs font-bold text-white uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/10 cursor-pointer disabled:opacity-50"
          >
            Deploy Habit Anchor
          </button>
        </div>

        {/* Habit tracker info card */}
        <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-gradient-to-br from-slate-950 via-slate-900/50 to-cyan-950/20 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-400/10 border border-cyan-500/20 text-[10px] font-bold text-cyan-400 uppercase tracking-wider font-mono mb-3">
              <Sparkles className="w-3.5 h-3.5" /> REFLEX HABIT LOOPS
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight leading-none">
              Streaks & Rhythm Compounding
            </h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Habits are the molecular actions building your future path. Tapping off completion dates registers logs instantly and triggers XP. Maintain 7-day limits to cultivate the <b>"Consistency King"</b> trophy.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="bg-slate-950 p-3 rounded-lg border border-white/5">
              <span className="text-[10px] font-mono text-slate-600 block uppercase">Highest Streak</span>
              <span className="text-2xl font-black text-orange-500 font-mono flex items-center gap-1 mt-1">
                <Flame className="w-5 h-5 text-orange-500" />
                {habits.length > 0 ? Math.max(...habits.map(h => h.maxStreak || h.streak || 0), 0) : 0}d
              </span>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-white/5">
              <span className="text-[10px] font-mono text-slate-600 block uppercase">Log buffer space</span>
              <span className="text-2xl font-black text-cyan-400 font-mono flex items-center gap-1 mt-1">
                {habits.length} Anchors
              </span>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-white/5">
              <span className="text-[10px] font-mono text-slate-600 block uppercase">Habit Success</span>
              <span className="text-2xl font-black text-emerald-400 font-mono mt-1 block">
                {habits.length > 0 ? Math.round(habits.reduce((acc, h) => {
                  const logsCount = Object.keys(h.logs).length;
                  return acc + Math.min(100, logsCount * 12);
                }, 0) / habits.length) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Habits Checklist Grid layout */}
      <div>
        <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-cyan-400" /> Active Habits Grid
        </h3>

        {habits.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-white/5 bg-slate-900/10">
            <Flame className="w-12 h-12 text-slate-700 mx-auto mb-3" />
            <span className="font-bold text-slate-400 block">No Active Habits Found</span>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">Populate habit objectives using the creator sidebar to ignite daily tracking loops.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {habits.map((h) => {
              // Calculate custom success rate
              const loggedDatesCount = Object.keys(h.logs).filter(k => h.logs[k]).length;
              const successRate = Math.min(100, Math.round((loggedDatesCount / 5) * 100)); // proxy of 5-day success

              return (
                <div key={h.id} id={`habit-row-${h.id}`} className="rounded-xl border border-white/5 bg-slate-900/20 p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow hover:border-white/10 transition-all">
                  
                  {/* Left segment info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-base p-1 rounded bg-slate-950 border border-white/5 shrink-0 leading-none">
                        {CATEGORIES.find(c => c.value === h.category)?.icon || '🎯'}
                      </span>
                      <h4 className="text-sm font-black text-slate-100 truncate">{h.name}</h4>
                      <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded uppercase border border-white/5 bg-slate-950 text-cyan-400">
                        {h.frequency}
                      </span>
                    </div>

                    <div className="flex gap-4 text-[11px] text-slate-500 mt-2">
                      <span className="flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-orange-500" /> Current streak: <b className="text-orange-400 font-bold">{h.streak}d</b>
                      </span>
                      <span>Max Streak: <b className="text-slate-300 font-mono font-semibold">{h.maxStreak || h.streak}d</b></span>
                      <span>Efficiency Index: <b className="text-emerald-400 font-mono font-bold">{successRate}%</b></span>
                    </div>
                  </div>

                  {/* 5-day logs checker grid */}
                  <div className="flex items-center gap-3">
                    <span className="hidden md:inline-block text-[10px] font-mono text-slate-600 uppercase font-bold tracking-wider">Fast Log past-5d:</span>
                    <div className="flex bg-slate-950/80 p-2 border border-white/5 rounded-xl gap-2.5">
                      {datesList.map((d) => {
                        const isDone = !!h.logs[d.dateKey];
                        return (
                          <div 
                            key={d.dateKey} 
                            id={`habit-cell-${h.id}-${d.dateKey}`}
                            onClick={() => onToggleHabit(h.id, d.dateKey)}
                            title={`${h.name}: ${d.weekday} ${d.dayNum}`}
                            className={`w-11 h-11 rounded-lg border flex flex-col items-center justify-center cursor-pointer select-none transition-all ${
                              isDone 
                                ? 'bg-cyan-500 border-none text-slate-950 scale-105 shadow-md shadow-cyan-500/25 font-black' 
                                : d.isToday 
                                  ? 'bg-slate-900 border-cyan-500/35 hover:bg-slate-800 text-cyan-400' 
                                  : 'bg-slate-900 border-white/5 hover:border-slate-800 text-slate-400'
                            }`}
                          >
                            <span className="text-[8px] uppercase tracking-wider block font-mono leading-none">{d.weekday}</span>
                            <span className="text-xs font-bold font-mono leading-none mt-1">{d.dayNum}</span>
                          </div>
                        );
                      })}
                    </div>

                    <button
                      id={`delete-habit-${h.id}`}
                      onClick={() => onDeleteHabit(h.id)}
                      className="p-1 px-1.5 text-slate-600 hover:text-red-400 transition-colors"
                      title="Decommission Habit"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
