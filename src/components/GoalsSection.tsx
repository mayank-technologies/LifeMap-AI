import React, { useState } from 'react';
import { Goal, GoalCategory, Milestone, UserProfile } from '../types';
import { Target, Sparkles, Plus, Trash2, Calendar, ShieldCheck, CheckSquare, Gamepad2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GoalsSectionProps {
  profile: UserProfile;
  goals: Goal[];
  onAddGoal: (newGoal: Goal) => void;
  onDeleteGoal: (goalId: string) => void;
  onToggleMilestone: (goalId: string, milestoneId: string) => void;
  onTriggerRoadmapForGoal: (goalTitle: string, category: GoalCategory, goalId: string) => Promise<void>;
  onNavigate: (tab: string) => void;
}

const CATEGORY_ICONS: Record<GoalCategory, string> = {
  career: '💼',
  business: '🚀',
  health: '❤️',
  learning: '🎓',
  finance: '💰',
  personal_growth: '⭐'
};

const CATEGORIES: { value: GoalCategory; label: string }[] = [
  { value: 'career', label: 'Career Growth' },
  { value: 'business', label: 'Business & Startup' },
  { value: 'health', label: 'Health & Fitness' },
  { value: 'learning', label: 'Skill Mastery' },
  { value: 'finance', label: 'Financial Freedom' },
  { value: 'personal_growth', label: 'Personal Growth' }
];

export default function GoalsSection({ profile, goals, onAddGoal, onDeleteGoal, onToggleMilestone, onTriggerRoadmapForGoal, onNavigate }: GoalsSectionProps) {
  const [goalInput, setGoalInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GoalCategory>('career');
  const [targetDate, setTargetDate] = useState('2026-12-31');
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const presetExamples = [
    { title: "Become a Software Engineer", cat: "career" as GoalCategory },
    { title: "Crack UPSC Examination", cat: "learning" as GoalCategory },
    { title: "Start my own YouTube Channel", cat: "business" as GoalCategory },
    { title: "Lose 10kg & optimize body fat", cat: "health" as GoalCategory }
  ];

  const handleCreateAIPlan = async (customTitle?: string, customCat?: GoalCategory) => {
    const finalTitle = customTitle || goalInput;
    const finalCat = customCat || selectedCategory;

    if (!finalTitle.trim()) return;
    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goalTitle: finalTitle,
          category: finalCat,
          availableTime: profile.availableTime,
          skillLevel: profile.skillLevel
        })
      });
      const data = await response.json();

      const newGoalId = `goal_${Date.now()}`;
      
      // Map AI stages steps to initial Goal milestones
      const milestones: Milestone[] = [];
      let stepCounter = 1;
      data.stages?.forEach((stage: any, sIdx: number) => {
        stage.steps?.forEach((step: any, stepIdx: number) => {
          milestones.push({
            id: `ml_${newGoalId}_${stepCounter++}`,
            title: `[Stage ${sIdx + 1}] ${step.title}`,
            done: false,
            targetWeek: `Week ${sIdx * 4 + (stepIdx + 1) * 2}`
          });
        });
      });

      // If no milestones generated
      if (milestones.length === 0) {
        milestones.push({ id: `ml_${newGoalId}_1`, title: "Research and outline core fundamentals", done: false, targetWeek: "Week 2" });
        milestones.push({ id: `ml_${newGoalId}_2`, title: "Execute basic project layouts", done: false, targetWeek: "Week 6" });
        milestones.push({ id: `ml_${newGoalId}_3`, title: "Audit setup, speed check, and showcase", done: false, targetWeek: "Week 12" });
      }

      const generatedGoal: Goal = {
        id: newGoalId,
        title: finalTitle,
        category: finalCat,
        description: description || `AI structured goal setup aiming for ${finalTitle}`,
        status: 'active',
        targetDate,
        milestones,
        monthlyPlan: data.monthlyPlanSummary || "Complete core baseline concepts and set up 1hr Focus Blocks.",
        weeklyPlan: data.weeklyPlanSummary || "Log initial practices, complete checkpoint milestones.",
        dailyTasks: data.dailyRecommendedTasks || ["Allocate 45 minutes of work to Stage targets"],
        successProbability: data.successProbability || 75,
        collisionWarnings: [],
        createdAt: new Date().toISOString()
      };

      onAddGoal(generatedGoal);

      // Trigger automatic Roadmap compilation
      await onTriggerRoadmapForGoal(finalTitle, finalCat, newGoalId);

      setGoalInput('');
      setDescription('');
    } catch (e) {
      console.error(e);
      // Construct rich offline default
      const defaultGoal: Goal = {
        id: `goal_${Date.now()}`,
        title: finalTitle,
        category: finalCat,
        description: description || `Self-structured goal targeting ${finalTitle}`,
        status: 'active',
        targetDate,
        milestones: [
          { id: `ml_${Date.now()}_1`, title: "Acquire basic manuals, tools, and build checklists", done: false, targetWeek: "Week 2" },
          { id: `ml_cl2`, title: "Execute 2 fundamental baseline projects", done: false, targetWeek: "Week 6" },
          { id: `ml_cl3`, title: "Execute advanced audit sprint & publish", done: false, targetWeek: "Week 12" }
        ],
        successProbability: 72,
        createdAt: new Date().toISOString()
      };
      onAddGoal(defaultGoal);
      await onTriggerRoadmapForGoal(finalTitle, finalCat, defaultGoal.id);
      setGoalInput('');
      setDescription('');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div id="goals-tab" className="space-y-8">
      
      {/* Top Planner Form card */}
      <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-6 md:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/20">
            <Sparkles className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">AI Goal Planner & Compiler</h3>
            <p className="text-xs text-slate-500">Input your vision. Gemini compiles steps, milestones, and daily schedule items.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-[10px] font-mono text-slate-400 mb-1.5 uppercase tracking-wider">What is your ultimate objective?</label>
              <input 
                id="goals-new-title"
                type="text" 
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                placeholder="e.g., Become a Senior Software Engineer, Lose 15kg in 6 months, Start YouTube Creator network"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 text-white border border-white/10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm placeholder:text-slate-600"
              />
            </div>

            <div className="w-full md:w-56">
              <label className="block text-[10px] font-mono text-slate-400 mb-1.5 uppercase tracking-wider">Life OS Category</label>
              <select 
                id="goals-new-category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as GoalCategory)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-955 text-sm bg-slate-950 text-white border border-white/10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-[10px] font-mono text-slate-400 mb-1.5 uppercase tracking-wider">Provide brief details / requirements (Optional)</label>
              <input 
                id="goals-new-desc"
                type="text" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Particular tech stack desired, physical baseline info, target certification limits..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-955 text-sm bg-slate-950 text-white border border-white/10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-600"
              />
            </div>

            <div className="w-full md:w-56">
              <label className="block text-[10px] font-mono text-slate-400 mb-1.5 uppercase tracking-wider">Target Date</label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input 
                  id="goals-new-date"
                  type="date" 
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.2 rounded-xl bg-slate-950 text-white border border-white/10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-[10px] text-slate-500 font-mono">Quick load presets:</span>
            {presetExamples.map((item, idx) => (
              <button
                key={idx}
                id={`preset-btn-${idx}`}
                onClick={() => handleCreateAIPlan(item.title, item.cat)}
                className="text-[11px] px-2.5 py-1 rounded bg-slate-950 hover:bg-indigo-950/40 border border-white/5 text-slate-300 transition-colors cursor-pointer hover:border-indigo-500/20"
              >
                {CATEGORY_ICONS[item.cat]} {item.title}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-white/5 flex justify-end">
            <button
              id="compile-goal-btn"
              disabled={isGenerating || !goalInput.trim()}
              onClick={() => handleCreateAIPlan()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-xs font-bold text-white uppercase tracking-wider transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-indigo-500/10"
            >
              {isGenerating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Compiling Milestones...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Synthesize Plan</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Goal Cards Grid View */}
      <div>
        <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-400" /> Active Life Milestones
        </h3>

        {goals.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-white/5 bg-slate-900/10">
            <Target className="w-12 h-12 text-slate-700 mx-auto mb-3" />
            <span className="font-bold text-slate-400 block">No Active Goals Configured</span>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">Use the planner above to generate your first milestone. AI will compile a visually beautiful interactive roadmap instantly!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.map((g) => {
              const completedMilestones = g.milestones.filter(m => m.done).length;
              const percent = g.milestones.length > 0 ? Math.round((completedMilestones / g.milestones.length) * 100) : 0;
              
              return (
                <div key={g.id} id={`goal-card-${g.id}`} className="rounded-xl border border-white/5 bg-slate-900/20 p-5 flex flex-col justify-between hover:border-white/10 transition-all shadow-xl">
                  
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg p-1.5 rounded-lg bg-slate-950 border border-white/5 leading-none">
                          {CATEGORY_ICONS[g.category]}
                        </span>
                        <span className="text-xs bg-slate-950 font-semibold px-2 py-0.5 rounded text-indigo-400 font-mono uppercase border border-white/5">
                          {g.category.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <button 
                        id={`delete-goal-${g.id}`}
                        onClick={() => onDeleteGoal(g.id)}
                        className="p-1 px-1.5 text-slate-600 hover:text-red-400 transition-colors"
                        title="Delete Goal"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h4 className="text-base font-black text-slate-100 tracking-tight">{g.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{g.description}</p>

                    {/* Meta stats */}
                    <div className="grid grid-cols-2 gap-3 my-4 bg-slate-950/60 p-2.5 rounded-lg border border-white/5">
                      <div>
                        <span className="text-[9px] uppercase font-mono text-slate-500">Estimate success</span>
                        <div className="flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                          <span className="text-xs font-bold text-slate-200 font-mono">{g.successProbability || 75}%</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-mono text-slate-500">Target Completion</span>
                        <p className="text-xs font-bold text-slate-200 font-mono truncate">{g.targetDate}</p>
                      </div>
                    </div>

                    {/* Milestones checklist */}
                    <div className="space-y-2 mt-4 pt-4 border-t border-white/5">
                      <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block">Quarters / Sub-Milestones Checklist</span>
                      <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                        {g.milestones.map((m) => (
                          <div 
                            key={m.id} 
                            id={`milestone-item-${m.id}`}
                            onClick={() => onToggleMilestone(g.id, m.id)}
                            className={`flex items-center gap-2 p-1.5 rounded hover:bg-slate-950/30 cursor-pointer ${
                              m.done ? 'opacity-65' : ''
                            }`}
                          >
                            <input 
                              type="checkbox" 
                              checked={m.done}
                              onChange={() => {}} // handled by row click
                              className="w-3.5 h-3.5 rounded text-indigo-500 bg-slate-950 border-white/10 pointer-events-none"
                            />
                            <div className="flex-1 min-w-0">
                              <span className={`text-[11px] block truncate ${m.done ? 'line-through text-slate-600 font-medium' : 'text-slate-300 font-semibold'}`}>
                                {m.title}
                              </span>
                            </div>
                            <span className="text-[8px] font-mono text-slate-500 px-1 py-0.5 bg-slate-950 rounded uppercase">
                              {m.targetWeek}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Progress bar container */}
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <div className="flex justify-between items-center text-xs font-mono mb-1 text-slate-400">
                      <span>Vision complete</span>
                      <span>{percent}%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden border border-white/5">
                      <div className="bg-indigo-500 h-full rounded-full transition-all duration-300" style={{ width: `${percent}%` }} />
                    </div>

                    <div className="mt-3.5 flex justify-between items-center bg-indigo-500/5 px-2.5 py-1.5 rounded-lg border border-indigo-500/10">
                      <span className="text-[10px] text-indigo-400 font-bold flex items-center gap-1">
                        <Gamepad2 className="w-3.5 h-3.5 animate-bounce" /> +100 XP per milestone
                      </span>
                      <button 
                        id={`view-roadmap-for-${g.id}`}
                        onClick={() => onNavigate('roadmaps')}
                        className="text-[10px] text-cyan-400 hover:underline font-mono uppercase font-bold flex items-center gap-0.5"
                      >
                        Visual Roadmap <ArrowRight className="w-3" />
                      </button>
                    </div>
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
