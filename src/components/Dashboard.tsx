import React, { useState, useEffect } from 'react';
import { UserProfile, Goal, Habit, Task, FutureProjection } from '../types';
import { Sparkles, CheckCircle2, TrendingUp, Heart, BookOpen, Target, Scale, Award, ArrowUpRight, Flame, ChevronRight, Calendar, UserCheck, Play, Quote, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardProps {
  profile: UserProfile;
  goals: Goal[];
  habits: Habit[];
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onToggleHabit: (habitId: string, dateKey: string) => void;
  onNavigate: (tab: string) => void;
  xpHistory: number;
  focusMode?: boolean;
}

const parseStorySentences = (text: string): string[] => {
  if (!text) return [];
  return text.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
};

export default function Dashboard({ profile, goals, habits, tasks, onToggleTask, onToggleHabit, onNavigate, focusMode }: DashboardProps) {
  const [activeProjecting, setActiveProjecting] = useState(false);
  const [projectionData, setProjectionData] = useState<FutureProjection | null>(null);
  const [motivation, setMotivation] = useState<{
    message: string;
    story: { title: string; content: string; takeaway: string };
  } | null>(null);
  const [loadingMotivation, setLoadingMotivation] = useState(false);

  const fetchMotivation = async (forceRefresh = false) => {
    // Generate cache key based on today's date and active goals
    const today = new Date().toISOString().split('T')[0];
    const goalsHash = goals ? goals.map(g => g.id).join('_') : '';
    const cacheKey = `lifemap_motivation_${today}_${goalsHash}`;

    if (!forceRefresh) {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.message && parsed.story) {
            setMotivation(parsed);
            return;
          }
        } catch (e) {
          console.error("Failed to parse cached motivation:", e);
        }
      }
    }

    setLoadingMotivation(true);
    try {
      const response = await fetch('/api/dashboard-motivation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, activeGoals: goals })
      });
      const data = await response.json();
      setMotivation(data);
      
      // Cache the result
      if (data && data.message && data.story) {
        localStorage.setItem(cacheKey, JSON.stringify(data));
      }
    } catch (err) {
      console.error("Error fetching motivation:", err);
    } finally {
      setLoadingMotivation(false);
    }
  };

  useEffect(() => {
    fetchMotivation(false);
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  
  // Filter core daily items
  const dailyTasks = tasks.filter(t => t.date === todayStr);
  const completedTasks = dailyTasks.filter(t => t.completed).length;
  const taskCompletionRate = dailyTasks.length > 0 ? Math.round((completedTasks / dailyTasks.length) * 100) : 0;

  // Compute actual habit execution rate for current metrics
  const totalHabitSlots = habits.length * 5; // looking back 5 days
  let filledHabitSlots = 0;
  
  for (let i = 0; i < 5; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateKey = d.toISOString().split('T')[0];
    habits.forEach(h => {
      if (h.logs[dateKey]) filledHabitSlots++;
    });
  }
  const habitExecutionRate = totalHabitSlots > 0 ? Math.round((filledHabitSlots / totalHabitSlots) * 100) : 0;

  const triggerFutureSimulation = async () => {
    setActiveProjecting(true);
    try {
      const response = await fetch('/api/future-projection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          activeGoals: goals,
          habitSuccessRate: habitExecutionRate || 50
        })
      });
      const data = await response.json();
      setProjectionData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setActiveProjecting(false);
    }
  };

  // Get greeting based on current local hours
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good morning";
    if (hours < 18) return "Good afternoon";
    return "Good evening";
  };

  // Determine levels bounds
  const nextLevelXp = profile.level * 500;
  const levelProgress = Math.min(100, Math.round((profile.xp / nextLevelXp) * 100));

  return (
    <div id="dashboard-tab" className="space-y-8">
      {/* Top bar welcome panel */}
      <div className={`grid grid-cols-1 ${focusMode ? '' : 'lg:grid-cols-3'} gap-6`}>
        <div className={`${focusMode ? 'w-full' : 'lg:col-span-2'} rounded-2xl border border-white/5 bg-gradient-to-br from-indigo-900/10 via-slate-900/40 to-cyan-950/10 p-6 md:p-8 relative overflow-hidden flex flex-col justify-between min-h-[180px]`}>
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 font-mono">WORKSPACE INTEL</span>
              <div className="w-2 h-2 rounded-full bg-indigo-505 bg-indigo-500 animate-pulse" />
            </div>
            <h1 className="text-2xl md:text-3.5xl font-black text-slate-100 tracking-tight leading-none mb-2">
              {getGreeting()}, <span className="text-indigo-400">{profile.fullName}</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-400 font-medium max-w-lg">
              {focusMode ? "Pure execution mode is active. Decisive layout engaged. Prioritize active priorities and compound consistency metrics without compromise." : `"Design Your Future. Live With Direction." Your Life Operating System is fully synchronized at ${profile.country}.`}
            </p>
          </div>

          <div className="flex items-center gap-1.5 mt-6 bg-slate-900/60 border border-white/5 py-2 px-3.5 rounded-xl self-start">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono text-slate-300">
              <span className="text-cyan-400 font-semibold">Today's Focus:</span> {focusMode ? "Deliver single-task focus limits in scheduled items." : "Optimize routines and stack milestones for XP compounding."}
            </span>
          </div>
        </div>

        {/* Gamification Level Widget */}
        {!focusMode && (
          <div className="rounded-2xl border border-white/5 bg-slate-900/30 p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider font-mono font-bold">GAMIFICATION INDEX</span>
                <h2 className="text-xl font-bold text-slate-100 mt-1">Consistency Level</h2>
              </div>
              <div className="bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 px-3 py-1.5 rounded-lg font-black text-base flex items-center gap-1 shadow-lg shadow-orange-500/10">
                <Award className="w-5 h-5 text-slate-900" />
                <span>Lv. {profile.level}</span>
              </div>
            </div>

            <div className="my-4">
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-400">XP Progress</span>
                <span className="text-slate-300 font-bold">{profile.xp} / {nextLevelXp} XP</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 border border-white/5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-300" 
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
            </div>

            <div className="text-[11px] text-slate-500 font-serif italic text-center">
              {profile.level < 5 ? "Level 1 → Beginner Athlete (Complete tasks and log habits daily to level up)" : "Level up bounds expanding. Keeping consistency high!"}
            </div>
          </div>
        )}
      </div>

      {/* Daily Motivation & Success Story Catalyst */}
      {!focusMode && (
        <div id="daily-inspiration-catalyst" className="rounded-2xl border border-white/5 bg-slate-900/10 p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5 relative z-10">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
              <h3 className="text-lg font-bold text-slate-200 tracking-tight">Daily Motivation & Success story</h3>
            </div>
            <button 
              id="regenerate-inspiration-btn"
              onClick={() => fetchMotivation(true)}
              disabled={loadingMotivation}
              className="flex items-center gap-1.5 text-xs font-mono text-indigo-400 hover:text-indigo-300 disabled:opacity-50 transition-colors bg-slate-950/60 border border-white/5 rounded-lg py-1 px-3"
            >
              <RefreshCw className={`w-3 h-3 ${loadingMotivation ? 'animate-spin' : ''}`} />
              <span>{loadingMotivation ? "Tuning Catalyst..." : "Refresh Feed"}</span>
            </button>
          </div>

          {loadingMotivation ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4 relative z-10">
              <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-400 rounded-full animate-spin" />
              <p className="text-xs font-mono text-slate-400">Consulting performance strategist databases...</p>
            </div>
          ) : motivation ? (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8 relative z-10">
              {/* Motivation Quote Column */}
              <div className="lg:col-span-2 flex flex-col justify-between p-5 rounded-xl bg-slate-950/60 border border-white/5 relative">
                <Quote className="absolute top-4 right-4 w-12 h-12 text-indigo-500/10 pointer-events-none" />
                <div className="space-y-3">
                  <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest block">DAILY MOTIVATIONAL QUOTE</span>
                  <p className="text-sm md:text-base text-slate-100 font-medium leading-relaxed italic pr-4">
                    "{motivation.message}"
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-indigo-500/10 flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  <span>Personalized Growth Sentiment</span>
                </div>
              </div>

              {/* Success Story Column */}
              <div className="lg:col-span-3 flex flex-col justify-between p-5 rounded-xl bg-gradient-to-br from-slate-950 to-slate-900 border border-white/5 relative">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block">3-SENTENCE GROWTH PATHWAYS</span>
                    <div className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/15 px-2 py-0.5 rounded-full font-mono">
                      <CheckCircle2 className="w-3 h-3" />
                       Inspiring Success Blueprint
                    </div>
                  </div>
                  <h4 className="text-base font-bold text-slate-100 tracking-tight">
                    {motivation.story?.title}
                  </h4>
                  
                  {/* Sentences with highly styled, progressive layout */}
                  <div className="space-y-3 mt-3">
                    {(() => {
                      const sentences = parseStorySentences(motivation.story?.content || "");
                      if (sentences.length === 3) {
                        const labels = [
                          { label: "Challenge", text: "The Obstacle", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
                          { label: "Execution", text: "The Catalyst", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
                          { label: "Triumph", text: "The Victory", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" }
                        ];
                        return sentences.map((sentence, idx) => (
                          <div key={idx} className="flex gap-3 items-start bg-slate-900/40 p-3 rounded-lg border border-white/5 transition-all hover:bg-slate-900/70">
                            <div className="flex flex-col items-center shrink-0">
                              <span className={`text-[9px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded border ${labels[idx].color}`}>
                                {labels[idx].label}
                              </span>
                              <span className="text-[8px] text-slate-500 font-mono mt-1 uppercase tracking-tight">{labels[idx].text}</span>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed font-serif">
                              {sentence}
                            </p>
                          </div>
                        ));
                      }
                      
                      // Fallback if not exactly 3 sentences
                      return (
                        <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-serif italic">
                          {motivation.story?.content}
                        </p>
                      );
                    })()}
                  </div>
                </div>
                
                <div className="mt-5 p-3 rounded-lg bg-indigo-900/15 border border-indigo-500/10 flex items-start gap-2.5">
                  <Award className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase block">CORE TAKEAWAY</span>
                    <p className="text-xs text-slate-300 font-medium mt-0.5">{motivation.story?.takeaway}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 relative z-10">
              <p className="text-xs text-slate-500">Failed to load motivational catalyst briefing.</p>
              <button 
                onClick={fetchMotivation}
                className="mt-2 text-xs py-1.5 px-3 rounded-lg bg-indigo-600/20 text-indigo-400 font-semibold border border-indigo-500/10 hover:bg-indigo-600/30"
              >
                Load Catalyst Feed
              </button>
            </div>
          )}
        </div>
      )}      {/* Life Analytics KPI Grid */}
      {!focusMode && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" /> Life Analytics Scores
            </h3>
            <span className="text-xs text-slate-500 font-mono">Dynamic indices influenced by behaviors</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { title: "Productivity", score: profile.scores.productivity, icon: CheckCircle2, color: "text-indigo-400", bg: "from-indigo-600/10 to-indigo-900/5", border: "border-indigo-500/10" },
              { title: "Health Index", score: profile.scores.health, icon: Heart, color: "text-emerald-400", bg: "from-emerald-600/10 to-emerald-900/5", border: "border-emerald-500/10" },
              { title: "Learning Score", score: profile.scores.learning, icon: BookOpen, color: "text-cyan-400", bg: "from-cyan-600/10 to-cyan-900/5", border: "border-cyan-500/10" },
              { title: "Goal Progress", score: profile.scores.goal, icon: Target, color: "text-amber-400", bg: "from-amber-600/10 to-amber-900/5", border: "border-amber-500/10" },
              { title: "Life Balance", score: profile.scores.balanceIndex, icon: Scale, color: "text-rose-400", bg: "from-rose-600/10 to-rose-900/5", border: "border-rose-500/10" },
            ].map((item, idx) => (
              <div key={idx} id={`score-card-${item.title.toLowerCase().replace(/\s+/g, '-')}`} className={`rounded-xl border ${item.border} bg-gradient-to-b ${item.bg} p-4.5 flex flex-col justify-between shadow-lg`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-slate-400">{item.title}</span>
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                </div>
                <div>
                  <span className="text-3xl font-black text-white font-mono tracking-tight">{item.score}</span>
                  <span className="text-[10px] text-slate-500 font-mono ml-1">/100</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1 mt-3 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${item.color.replace('text', 'bg')}`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Widgets & Task trackers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Today's Tasks widget */}
        <div className="rounded-2xl border border-white/5 bg-slate-900/20 p-5 lg:col-span-1">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="font-bold text-sm text-slate-200">Today's Agenda</h4>
              <p className="text-[11px] text-slate-500">{dailyTasks.length} tasks scheduled</p>
            </div>
            <button 
              id="dashboard-goto-planner"
              onClick={() => onNavigate('planner')} 
              className="text-indigo-400 hover:text-indigo-300 text-xs font-semibold flex items-center gap-0.5"
            >
              Planner <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
            {dailyTasks.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
                <p className="text-xs text-slate-500">No tasks planned for today.</p>
                <button 
                  id="dashboard-schedule-tasks"
                  onClick={() => onNavigate('planner')} 
                  className="mt-2 text-xs py-1 px-3 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 font-semibold border border-indigo-500/10 transition-colors"
                >
                  Schedule tasks +
                </button>
              </div>
            ) : (
              dailyTasks.map((t) => (
                <div 
                  key={t.id} 
                  id={`dashboard-task-row-${t.id}`}
                  onClick={() => onToggleTask(t.id)}
                  className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                    t.completed 
                      ? 'bg-slate-950/40 border-slate-900/50 opacity-60' 
                      : 'bg-slate-900 border-white/5 hover:border-white/10'
                  }`}
                >
                  <input 
                    type="checkbox" 
                    checked={t.completed}
                    onChange={() => {}} // handled by row click
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-0 bg-slate-950 border-white/10 pointer-events-none"
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold truncate ${t.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {t.title}
                    </p>
                    {t.timeBlock && (
                      <span className="text-[9px] font-mono text-slate-500 bg-slate-950 px-1 py-0.5 rounded leading-none mt-1 inline-block">
                        {t.timeBlock}
                      </span>
                    )}
                  </div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                    t.priority === 'high' ? 'bg-red-500/10 text-red-400 border border-red-500/10' :
                    t.priority === 'medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/10' :
                    'bg-slate-600/10 text-slate-400'
                  }`}>
                    {t.priority}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Today's Habits widget */}
        <div className="rounded-2xl border border-white/5 bg-slate-900/20 p-5 lg:col-span-1">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="font-bold text-sm text-slate-200">Habit Anchor Rules</h4>
              <p className="text-[11px] text-slate-500">Streak compounding buffer</p>
            </div>
            <button 
              id="dashboard-goto-habits"
              onClick={() => onNavigate('habits')} 
              className="text-cyan-400 hover:text-cyan-300 text-xs font-semibold flex items-center gap-0.5"
            >
              Habits <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
            {habits.length === 0 ? (
              <div className="text-center py-8">
                <Flame className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
                <p className="text-xs text-slate-500">No habits tracks registered yet.</p>
                <button 
                  id="dashboard-setup-habit"
                  onClick={() => onNavigate('habits')} 
                  className="mt-2 text-xs py-1 px-3 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 font-semibold border border-cyan-500/10 transition-colors"
                >
                  Configure Habits +
                </button>
              </div>
            ) : (
              habits.map((h) => {
                const checked = !!h.logs[todayStr];
                return (
                  <div 
                    key={h.id} 
                    id={`dashboard-habit-row-${h.id}`}
                    onClick={() => onToggleHabit(h.id, todayStr)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      checked 
                        ? 'bg-slate-950/40 border-slate-900/50' 
                        : 'bg-slate-900 border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg text-slate-950 font-black flex items-center justify-center ${
                        checked ? 'bg-cyan-400' : 'bg-slate-800 text-slate-500'
                      }`}>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className={`text-xs font-semibold ${checked ? 'text-slate-400 line-through' : 'text-slate-200'}`}>{h.name}</span>
                        <span className="block text-[10px] text-slate-500 font-serif lowercase">{h.category} drill</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 font-mono text-xs">
                      <Flame className={`w-3.5 h-3.5 ${h.streak > 0 ? 'text-orange-500 animate-pulse' : 'text-slate-600'}`} />
                      <span className={h.streak > 0 ? 'text-orange-400 font-bold' : 'text-slate-500'}>{h.streak}d streak</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Goal Progress widget */}
        <div className="rounded-2xl border border-white/5 bg-slate-900/20 p-5 lg:col-span-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="font-bold text-sm text-slate-200">Active Goals</h4>
                <p className="text-[11px] text-slate-500">Long-term vision progression</p>
              </div>
              <button 
                id="dashboard-goto-goals"
                onClick={() => onNavigate('goals')} 
                className="text-indigo-400 hover:text-indigo-300 text-xs font-semibold flex items-center gap-0.5"
              >
                Goals <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3.5 max-h-[160px] overflow-y-auto pr-1">
              {goals.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-xs text-slate-500">No active goals found.</p>
                  <button 
                    id="dashboard-create-goal"
                    onClick={() => onNavigate('goals')} 
                    className="mt-2 text-xs py-1 px-3 rounded-lg bg-indigo-600/30 text-indigo-400 font-semibold"
                  >
                    Setup First Goal +
                  </button>
                </div>
              ) : (
                goals.slice(0, 3).map((g) => {
                  const completedMilestones = g.milestones.filter(m => m.done).length;
                  const pct = g.milestones.length > 0 ? Math.round((completedMilestones / g.milestones.length) * 100) : 0;
                  return (
                    <div key={g.id} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-slate-200 truncate max-w-[180px]">{g.title}</span>
                        <span className="text-slate-400 font-mono font-semibold">{pct}%</span>
                      </div>
                      <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-white/5">
                        <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex gap-2">
            <div className="w-1/2 p-2.5 rounded-xl bg-slate-950 border border-white/5 text-center">
              <span className="text-[10px] text-slate-500 block uppercase font-mono">Habit Consistency</span>
              <span className="text-base font-black text-cyan-400 font-mono mt-0.5 block">{habitExecutionRate}%</span>
            </div>
            <div className="w-1/2 p-2.5 rounded-xl bg-slate-950 border border-white/5 text-center">
              <span className="text-[10px] text-slate-500 block uppercase font-mono">Task Execution</span>
              <span className="text-base font-black text-indigo-400 font-mono mt-0.5 block">{taskCompletionRate}%</span>
            </div>
          </div>
        </div>

      </div>      {/* Future Projection Engine™ Section */}
      {!focusMode && (
        <div id="future-projection-engine-widget" className="rounded-2xl border border-indigo-500/10 bg-gradient-to-r from-slate-950 via-slate-900/60 to-indigo-950/20 p-6 md:p-8 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-400/15 border border-indigo-500/20 text-xs font-bold text-indigo-400 uppercase tracking-widest font-mono mb-3">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" /> UNIQUE OS ADVANTAGE
              </div>
              <h3 className="text-xl md:text-2xl font-black text-white leading-none tracking-tight">
                Future Projection Engine™
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Based on your exact demographic metrics and historical success variables inside habit and planner dashboards, our AI model simulates and models the next 180 days of your physical and professional vector potential.
              </p>
            </div>

            <button
              id="simulation-trigger-btn"
              disabled={activeProjecting}
              onClick={triggerFutureSimulation}
              className="shrink-0 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-xs font-bold text-slate-950 uppercase tracking-wider transition-all hover:scale-105 shadow-xl shadow-indigo-500/10 flex items-center gap-2 font-mono"
            >
              {activeProjecting ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  <span>Simulating...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-slate-900 fill-slate-900" />
                  <span>Execute Simulation</span>
                </>
              )}
            </button>
          </div>

          {/* Interactive Future Projection Results */}
          {projectionData && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 pt-6 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div className="p-4 rounded-xl border border-white/5 bg-slate-950">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Productivity Gain</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2.5xl font-black text-cyan-400 font-mono">+{projectionData.productivityGain}%</span>
                  <span className="text-xs text-slate-400">in 180 days</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-3">
                  <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${projectionData.productivityGain}%` }} />
                </div>
              </div>

              <div className="p-4 rounded-xl border border-white/5 bg-slate-950">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Compounding Growth Multiplier</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2.5xl font-black text-indigo-400 font-mono">{projectionData.growthMultiplier}x</span>
                  <span className="text-xs text-slate-400">output efficiency</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-3">
                  <div className="bg-indigo-400 h-full rounded-full" style={{ width: `${Math.min(100, (projectionData.growthMultiplier - 1) * 200)}%` }} />
                </div>
              </div>

              <div className="p-4 rounded-xl border border-white/5 bg-slate-950">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Health & Energy Outlook</span>
                <p className="text-xs font-semibold text-emerald-400 mt-1 truncate">{projectionData.healthOutlook}</p>
                <div className="flex items-center gap-2 mt-3 text-[10px] font-mono text-slate-400 border-t border-white/5 pt-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>{projectionData.learningMilestonesCount} major learning targets secure</span>
                </div>
              </div>

              <div className="md:col-span-3 p-5 rounded-xl border border-indigo-500/10 bg-slate-950/80">
                <div className="flex justify-between items-center mb-2 pb-2 border-b border-white/5">
                  <span className="text-xs font-mono font-bold text-indigo-400 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4" /> DECISION SIMULATOR TRAJECTORY REPORT
                  </span>
                  <button 
                    id="projection-view-coach-btn"
                    onClick={() => onNavigate('coach')} 
                    className="text-[10px] text-cyan-400 hover:underline uppercase font-mono"
                  >
                    View Future Self Letter &rarr;
                  </button>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-serif italic">
                  "{projectionData.simulationReport}"
                </p>
              </div>
            </motion.div>
          )}
        </div>
      )}

    </div>
  );
}
