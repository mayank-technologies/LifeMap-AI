import React, { useState } from 'react';
import { Task, FocusBlock } from '../types';
import { Calendar, Plus, Trash2, Clock, CheckCircle2, ChevronRight, ListTodo, Shield, Star, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PlannerSectionProps {
  tasks: Task[];
  onAddTask: (newTask: Task) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export default function PlannerSection({ tasks, onAddTask, onToggleTask, onDeleteTask }: PlannerSectionProps) {
  const [plannerTab, setPlannerTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  
  // Daily Form State
  const [taskName, setTaskName] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [timeBlock, setTimeBlock] = useState('09:00 - 11:00');

  // Weekly Planner State
  const [weeklyTargets, setWeeklyTargets] = useState<{ id: string; text: string; done: boolean }[]>([
    { id: 'wt1', text: 'Secure 15 hours of roadmap stage work blocks', done: false },
    { id: 'wt2', text: 'Document 3 completed Stage 1 checkpoints in journal', done: true },
    { id: 'wt3', text: 'Achieve 5-day continuous streak in exercise habits', done: false }
  ]);
  const [newWeeklyInput, setNewWeeklyInput] = useState('');

  // Monthly Planner State
  const [monthlyMilestones, setMonthlyMilestones] = useState<{ id: string; text: string; done: boolean }[]>([
    { id: 'mt1', text: 'Conclude Stage 1 (Foundations) in Active Roadmap', done: false },
    { id: 'mt2', text: 'Increase overall productivity index to 75/100', done: false },
    { id: 'mt3', text: 'Synthesize first 20-page strategic learning log', done: true }
  ]);
  const [newMonthlyInput, setNewMonthlyInput] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];
  const dailyTasks = tasks.filter(t => t.date === todayStr);

  const handleAddTask = () => {
    if (!taskName.trim()) return;
    const newTask: Task = {
      id: `task_${Date.now()}`,
      title: taskName,
      completed: false,
      priority,
      date: todayStr,
      timeBlock: timeBlock || undefined
    };
    onAddTask(newTask);
    setTaskName('');
  };

  const handleAddWeekly = () => {
    if (!newWeeklyInput.trim()) return;
    setWeeklyTargets([...weeklyTargets, { id: `wt_${Date.now()}`, text: newWeeklyInput, done: false }]);
    setNewWeeklyInput('');
  };

  const handleAddMonthly = () => {
    if (!newMonthlyInput.trim()) return;
    setMonthlyMilestones([...monthlyMilestones, { id: `mt_${Date.now()}`, text: newMonthlyInput, done: false }]);
    setNewMonthlyInput('');
  };

  return (
    <div id="planner-tab" className="space-y-8">
      
      {/* Planner sub-navigation header */}
      <div className="flex bg-slate-900 p-1.5 rounded-xl border border-white/5 max-w-md gap-1">
        {[
          { tab: 'daily' as const, label: "Daily Planner", icon: Clock },
          { tab: 'weekly' as const, label: "Weekly Targets", icon: ListTodo },
          { tab: 'monthly' as const, label: "Monthly Reviews", icon: Calendar }
        ].map(item => (
          <button
            key={item.tab}
            id={`planner-subtab-${item.tab}`}
            onClick={() => setPlannerTab(item.tab)}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              plannerTab === item.tab 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Daily Planner Workspace */}
        {plannerTab === 'daily' && (
          <motion.div
            key="daily-workspace"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Task Creator sidebar */}
            <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-6 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/5">
                  <Clock className="w-5 h-5 text-indigo-400 animate-pulse" />
                  <h4 className="text-sm font-bold text-slate-100 uppercase tracking-widest font-mono">Time Block Planner</h4>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1.5 uppercase tracking-wider">Focus Task Title</label>
                    <input 
                      id="planner-task-name"
                      type="text" 
                      value={taskName}
                      onChange={(e) => setTaskName(e.target.value)}
                      placeholder="e.g., Code Stage 1 steps"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 text-white border border-white/10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm placeholder:text-slate-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 mb-1.5 uppercase tracking-wider">Priority Level</label>
                      <select 
                        id="planner-task-priority"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as Task['priority'])}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-955 text-sm bg-slate-950 text-white border border-white/10"
                      >
                        <option value="high">🔥 High</option>
                        <option value="medium">⚡ Medium</option>
                        <option value="low">💤 Low</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 mb-1.5 uppercase tracking-wider">Slot (Duration)</label>
                      <select 
                        id="planner-task-timeblock"
                        value={timeBlock}
                        onChange={(e) => setTimeBlock(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-955 text-sm bg-slate-950 text-white border border-white/10"
                      >
                        <option value="09:00 - 11:00">09:00 - 11:00</option>
                        <option value="11:30 - 13:00">11:30 - 13:00</option>
                        <option value="14:00 - 16:00">14:00 - 16:00</option>
                        <option value="17:00 - 18:30">17:00 - 18:30</option>
                        <option value="19:30 - 21:00">19:30 - 21:00</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <button
                id="create-task-btn"
                disabled={!taskName.trim()}
                onClick={handleAddTask}
                className="w-full mt-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-xs font-bold text-white uppercase tracking-wider transition-all shadow-lg shadow-indigo-500/10 cursor-pointer disabled:opacity-50 animate-shimmer"
              >
                Schedule Task Ring
              </button>
            </div>

            {/* Daily schedule rendering columns */}
            <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-slate-900/20 p-5 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <div>
                  <h4 className="font-bold text-sm text-slate-100">Schedule Agenda Timeblocks</h4>
                  <p className="text-[11px] text-slate-500">Day perspective checklist</p>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 bg-slate-950 border border-white/5 text-cyan-400 rounded-lg">{todayStr}</span>
              </div>

              <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                {dailyTasks.length === 0 ? (
                  <div className="text-center py-16">
                    <Clock className="w-10 h-10 text-slate-700 mx-auto mb-3 animate-pulse" />
                    <span className="font-semibold text-slate-500 block text-xs">No active plans scheduled for today</span>
                    <p className="text-[11.5px] text-slate-600 mt-1 max-w-xs mx-auto">Fill focus targets using our AI recommendation engine or timeblock slider.</p>
                  </div>
                ) : (
                  dailyTasks.map((t) => (
                    <div 
                      key={t.id} 
                      id={`planner-row-${t.id}`}
                      className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                        t.completed 
                          ? 'bg-slate-950/40 border-slate-900/50 opacity-60' 
                          : 'bg-slate-900 border-white/5 hover:border-indigo-500/15'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 flex-1 min-w-0">
                        <button
                          id={`planner-checkbox-${t.id}`}
                          onClick={() => onToggleTask(t.id)}
                          className={`p-1.5 rounded-lg border transition-all shrink-0 ${
                            t.completed ? 'bg-emerald-500 border-none text-slate-950' : 'bg-slate-950 border-white/10 hover:border-indigo-500 text-slate-500'
                          }`}
                        >
                          <CheckCircle2 className="w-4.5 h-4.5" />
                        </button>
                        
                        <div className="min-w-0">
                          <p className={`text-xs font-semibold ${t.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                            {t.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5 text-[9px] text-slate-500 font-mono">
                            <span className="bg-slate-950 border border-white/5 px-2 py-0.5 rounded uppercase font-bold text-slate-500">{t.priority}</span>
                            {t.timeBlock && (
                              <span className="text-cyan-400 bg-cyan-950/20 px-1.5 py-0.5 rounded flex items-center gap-0.5 border border-cyan-500/5">
                                <Clock className="w-3 h-3" /> {t.timeBlock}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        id={`delete-task-${t.id}`}
                        onClick={() => onDeleteTask(t.id)}
                        className="p-1 px-1.5 text-slate-600 hover:text-red-400 transition-colors"
                        title="Delete task option"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Weekly Planners panel */}
        {plannerTab === 'weekly' && (
          <motion.div
            key="weekly-workspace"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl border border-white/5 bg-slate-900/20 p-6 md:p-8 space-y-6"
          >
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <div>
                <h3 className="font-extrabold text-base text-slate-100">Weekly Target Tracker</h3>
                <p className="text-xs text-slate-500">Milestone parameters that accumulate productivity coefficients.</p>
              </div>
            </div>

            {/* Addition element */}
            <div className="flex gap-2">
              <input 
                id="weekly-input"
                type="text" 
                value={newWeeklyInput}
                onChange={(e) => setNewWeeklyInput(e.target.value)}
                placeholder="Log a custom target block for this week (e.g., Code stage 1 modules)"
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 text-white border border-white/10 focus:border-indigo-500 text-sm focus:outline-none placeholder:text-slate-600"
              />
              <button 
                id="add-weekly-btn"
                onClick={handleAddWeekly}
                className="px-5 rounded-xl bg-indigo-600 hover:bg-indigo-550 text-xs font-bold text-white uppercase tracking-wider font-mono cursor-pointer"
              >
                Log Target
              </button>
            </div>

            <div className="space-y-3">
              {weeklyTargets.map((item, idx) => (
                <div 
                  key={item.id} 
                  id={`weekly-row-${item.id}`}
                  onClick={() => {
                    const cloned = [...weeklyTargets];
                    cloned[idx].done = !cloned[idx].done;
                    setWeeklyTargets(cloned);
                  }}
                  className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer ${
                    item.done ? 'bg-slate-950/40 border-slate-900/40 opacity-60' : 'bg-slate-900 border-white/5 hover:border-slate-800'
                  }`}
                >
                  <input 
                    type="checkbox" 
                    checked={item.done}
                    onChange={() => {}} // handled by click callback
                    className="w-4 h-4 rounded text-indigo-500 bg-slate-950 border-white/10 pointer-events-none"
                  />
                  <span className={`text-xs font-semibold ${item.done ? 'line-through text-slate-500' : 'text-slate-200'}`}>{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Monthly Planners panel */}
        {plannerTab === 'monthly' && (
          <motion.div
            key="monthly-workspace"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl border border-white/5 bg-slate-900/20 p-6 md:p-8 space-y-6"
          >
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <div>
                <h3 className="font-extrabold text-base text-slate-100">Monthly Vision Review</h3>
                <p className="text-xs text-slate-500">Major targets influencing overall Growth and Balance indicators.</p>
              </div>
            </div>

            {/* Addition element */}
            <div className="flex gap-2">
              <input 
                id="monthly-input"
                type="text" 
                value={newMonthlyInput}
                onChange={(e) => setNewMonthlyInput(e.target.value)}
                placeholder="Log a custom monthly milestone"
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 text-white border border-white/10 focus:border-indigo-500 text-sm focus:outline-none placeholder:text-slate-600"
              />
              <button 
                id="add-monthly-btn"
                onClick={handleAddMonthly}
                className="px-5 rounded-xl bg-indigo-600 hover:bg-indigo-550 text-xs font-bold text-white uppercase tracking-wider font-mono cursor-pointer"
              >
                Log block
              </button>
            </div>

            <div className="space-y-3">
              {monthlyMilestones.map((item, idx) => (
                <div 
                  key={item.id} 
                  id={`monthly-row-${item.id}`}
                  onClick={() => {
                    const cloned = [...monthlyMilestones];
                    cloned[idx].done = !cloned[idx].done;
                    setMonthlyMilestones(cloned);
                  }}
                  className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer ${
                    item.done ? 'bg-slate-950/40 border-slate-900/40 opacity-60' : 'bg-slate-900 border-white/5 hover:border-slate-800'
                  }`}
                >
                  <input 
                    type="checkbox" 
                    checked={item.done}
                    onChange={() => {}} // handled by click callback
                    className="w-4 h-4 rounded text-indigo-500 bg-slate-950 border-white/10 pointer-events-none"
                  />
                  <span className={`text-xs font-semibold ${item.done ? 'line-through text-slate-500' : 'text-slate-200'}`}>{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
