import React, { useState, useEffect } from 'react';
import { UserProfile, Goal, Habit, Task, AIRecommendation } from '../types';
import { Sparkles, Brain, Scale, ShieldAlert, Award, Compass, ArrowRight, Play, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AICoachSectionProps {
  profile: UserProfile;
  goals: Goal[];
  habits: Habit[];
  tasks: Task[];
  onNavigate: (tab: string) => void;
}

export default function AICoachSection({ profile, goals, habits, tasks, onNavigate }: AICoachSectionProps) {
  const [activeCoachSubtab, setActiveCoachSubtab] = useState<'strategist' | 'simulator' | 'tools'>('strategist');

  // Loading states
  const [coachingLoading, setCoachingLoading] = useState(false);
  const [simulatorLoading, setSimulatorLoading] = useState(false);
  const [decisionLoading, setDecisionLoading] = useState(false);
  const [collisionLoading, setCollisionLoading] = useState(false);

  // States for outputs
  const [coachMsg, setCoachMsg] = useState('Initiating connection with your Life Strategist. Analyzing daily hours and goal checklists...');
  const [recs, setRecs] = useState<AIRecommendation[]>([
    { id: 'rec_1', category: 'schedule', text: 'Securing Golden Hour block (07:00-09:00) during morning clarity peaks prevents attention switches.' },
    { id: 'rec_2', category: 'routine', text: 'We recommend anchoring your water intake log directly next to your physical exercise block.' },
    { id: 'rec_3', category: 'learning', text: 'You possess Level 1 skill ranks. Introduce a 20-minute daily reading block to trigger level promotions.' }
  ]);

  // Future self letter state
  const [futureLetter, setFutureLetter] = useState<string>('');

  // Life Simulation States
  const [simResults, setSimResults] = useState<{ path: string; summary: string; score: number }[] | null>(null);

  // Decision Assistant form inputs & outputs
  const [optA, setOptA] = useState('Learn Software Development');
  const [optB, setOptB] = useState('Build Video Editing Agency');
  const [decisionOutput, setDecisionOutput] = useState<any | null>(null);

  // Goal Collision inputs & outputs
  const [colGoalA, setColGoalA] = useState('Launch Web Startup');
  const [colGoalB, setColGoalB] = useState('Gaming 6 hours on weekdays');
  const [collisionOutput, setCollisionOutput] = useState<any | null>(null);

  // Load baseline coaching suggestions from Express
  const fetchCoachingSuggestions = async (forceRefresh = false) => {
    // Generate cache key based on today's date, active goals and completed tasks count
    const today = new Date().toISOString().split('T')[0];
    const goalsHash = goals ? goals.map(g => g.id).join('_') : '';
    const completedTasksCount = tasks.filter(t => t.completed).length;
    const cacheKey = `lifemap_coaching_${today}_${goalsHash}_${completedTasksCount}`;

    if (!forceRefresh) {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.coachMessage && parsed.recommendations) {
            setCoachMsg(parsed.coachMessage);
            setRecs(parsed.recommendations);
            return;
          }
        } catch (e) {
          console.error("Failed to parse cached coaching suggestions:", e);
        }
      }
    }

    setCoachingLoading(true);
    try {
      const response = await fetch('/api/ai-coaching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          goals,
          habits,
          completedTasksCount
        })
      });
      const data = await response.json();
      if (data.coachMessage) setCoachMsg(data.coachMessage);
      if (data.recommendations) setRecs(data.recommendations);

      // Cache the result
      if (data && data.coachMessage && data.recommendations) {
        localStorage.setItem(cacheKey, JSON.stringify(data));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCoachingLoading(false);
    }
  };

  useEffect(() => {
    fetchCoachingSuggestions(false);
  }, []);

  // Fetch /api/future-projection to extract the future letter
  const generateFutureSelfLetter = async () => {
    setCoachingLoading(true);
    try {
      // Calculate overall habit rate
      const completedToday = habits.filter(h => h.logs[new Date().toISOString().split('T')[0]]).length;
      const rate = habits.length > 0 ? (completedToday / habits.length) * 100 : 50;

      const response = await fetch('/api/future-projection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          activeGoals: goals,
          habitSuccessRate: rate || 50
        })
      });
      const data = await response.json();
      if (data.futureLetter) setFutureLetter(data.futureLetter);
    } catch (e) {
      console.error(e);
      setFutureLetter(`Dear Self,\n\nI am speaking to you from 6 months in the future. Armed with the available ${profile.availableTime} daily hours, you made the incredible choice to keep tracking goals in LifeMap AI. Those checkboxes we ticked? They compounded into true freedom. Keep maintaining your habit loops.\n\nRespectfully,\nYour Future Self`);
    } finally {
      setCoachingLoading(false);
    }
  };

  // Run Life path Simulation comparative calculations
  const runLifeSimulation = async () => {
    setSimulatorLoading(true);
    await new Promise(r => setTimeout(r, 1500)); // Simulate AI calculation
    
    // Formulate paths comparison
    const results = [
      {
        path: "Path A: High Intensity Engineering Mastery",
        summary: "Focusing daily hours solely on programming basics, data structures, and roadmap milestones compiles a high structural stability multiplier. You secure placement inside leading networks within 9 months.",
        score: 91
      },
      {
        path: "Path B: Digital Content Agency Creator",
        summary: "Leveraging video creation and marketing builds immediate individual agency and passive compounding revenue loops, but presents shorter-term volatility depending on active algorithm configurations.",
        score: 79
      },
      {
        path: "Path C: Balanced Portfolio Developer",
        summary: "Splitting gold focus blocks half between code architecture and half on fitness routine establishes maximum health outlook metrics and reduces burnout peaks, but extends project timeline metrics by 3 months.",
        score: 86
      }
    ];
    setSimResults(results);
    setSimulatorLoading(false);
  };

  // Run Decision Assistant comparison API
  const runDecisionAssistant = async () => {
    if (!optA.trim() || !optB.trim()) return;
    setDecisionLoading(true);
    try {
      const response = await fetch('/api/decision-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionA: optA, optionB: optB })
      });
      const data = await response.json();
      setDecisionOutput(data);
    } catch (e) {
      console.error(e);
    } finally {
      setDecisionLoading(false);
    }
  };

  // Run Goal collision calculations API
  const runCollisionDetector = async () => {
    if (!colGoalA.trim() || !colGoalB.trim()) return;
    setCollisionLoading(true);
    try {
      const response = await fetch('/api/goal-collision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goalA: colGoalA, goalB: colGoalB })
      });
      const data = await response.json();
      setCollisionOutput(data);
    } catch (e) {
      console.error(e);
    } finally {
      setCollisionLoading(false);
    }
  };

  return (
    <div id="ai-coach-tab" className="space-y-8">
      
      {/* Sub menu tabs inside AI Coach section */}
      <div className="flex bg-slate-900 p-1.5 rounded-xl border border-white/5 max-w-lg gap-1">
        {[
          { tab: 'strategist' as const, label: "AI Life Strategist", icon: Brain },
          { tab: 'simulator' as const, label: "Life Simulation™", icon: Compass },
          { tab: 'tools' as const, label: "Strategic Assistant Tools", icon: Scale }
        ].map(item => (
          <button
            key={item.tab}
            id={`coach-tab-${item.tab}`}
            onClick={() => setActiveCoachSubtab(item.tab)}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeCoachSubtab === item.tab 
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
        
        {/* TAB 1: AI Coach Strategist suggests */}
        {activeCoachSubtab === 'strategist' && (
          <motion.div
            key="strategist-pane"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Coach speech card */}
            <div className="rounded-2xl border border-indigo-500/10 bg-slate-900/15 p-6 md:p-8 flex items-start gap-4 shadow-xl">
              <div className="p-3 bg-indigo-500/15 border border-indigo-500/20 rounded-2xl shrink-0">
                <Brain className="w-6 h-6 text-indigo-400 animate-pulse" />
              </div>

              <div>
                <span className="text-[10px] font-mono text-indigo-400 font-bold block uppercase tracking-wider">AI Strategist Daily Audit</span>
                <p className="text-sm text-slate-200 font-serif italic leading-relaxed mt-2.5">
                  "{coachMsg}"
                </p>
                <div className="flex items-center gap-3 mt-4">
                  <button 
                    id="refresh-coaching-btn"
                    onClick={() => fetchCoachingSuggestions(true)}
                    className="text-xs font-mono font-bold text-indigo-400 flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    {coachingLoading ? "Auditing profile..." : "Sync Coach Suggestions \u21BB"}
                  </button>
                </div>
              </div>
            </div>

            {/* AI suggestions container */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {recs.map((item, idx) => (
                <div key={item.id} className="p-5 rounded-xl border border-white/5 bg-slate-950 flex flex-col justify-between shadow">
                  <div>
                    <span className="text-[10px] bg-slate-900 border border-white/5 px-2 py-0.5 rounded text-indigo-400 font-mono tracking-wide uppercase font-bold">
                      {item.category} advice
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed mt-3">{item.text}</p>
                  </div>
                  
                  <div className="pt-3 border-t border-white/5 mt-4 text-[10px] font-mono text-slate-500 flex items-center gap-1 uppercase">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Active Optimization
                  </div>
                </div>
              ))}
            </div>

            {/* Future Self Letter™ sub-widget */}
            <div className="rounded-2xl border border-white/5 bg-slate-905 p-6 md:p-8 space-y-4 bg-slate-950">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-100 uppercase tracking-widest font-mono">Future Self Letter™ Generator</h4>
                  <p className="text-[11px] text-slate-500">Synthesize motivational metrics from your compiled wiser future state.</p>
                </div>
                <button
                  id="future-letter-btn"
                  onClick={generateFutureSelfLetter}
                  disabled={coachingLoading}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-[10px] uppercase font-mono tracking-wider font-extrabold text-white shadow shadow-indigo-500/10 cursor-pointer"
                >
                  {coachingLoading ? "Synthesizing Letter..." : "Generate Future Letter"}
                </button>
              </div>

              {futureLetter && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-5 rounded-xl border border-indigo-500/10 bg-slate-900/20 whitespace-pre-line text-xs font-serif italic text-slate-300 leading-relaxed"
                >
                  {futureLetter}
                </motion.div>
              )}
            </div>

          </motion.div>
        )}

        {/* TAB 2: Life Simulation™ comparisons */}
        {activeCoachSubtab === 'simulator' && (
          <motion.div
            key="simulator-pane"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow">
              <div className="max-w-xl">
                <span className="text-[10px] uppercase font-mono font-bold text-cyan-400 tracking-wider">PREDICTIVE STABILITY</span>
                <h3 className="text-lg md:text-xl font-black text-slate-100 tracking-tight block">Life Simulation Sandbox™</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Compare theoretical choices against current baseline metrics (available time allotment & skills) to forecast 5-year growth values and identify bottlenecks.
                </p>
              </div>
              
              <button
                id="simulator-launch-btn"
                disabled={simulatorLoading}
                onClick={runLifeSimulation}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 text-xs font-bold text-white uppercase tracking-wider font-mono shadow-md shadow-cyan-500/10 cursor-pointer"
              >
                {simulatorLoading ? "Modeling calculations..." : "Synthesize Paths"}
              </button>
            </div>

            {simResults && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {simResults.map((sim, idx) => (
                  <div key={idx} className="p-5 rounded-xl border border-white/5 bg-slate-950 flex flex-col justify-between shadow-xl">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-black text-slate-200 mt-1">{sim.path}</span>
                        <span className="text-xs font-mono font-bold text-indigo-400">{sim.score}% yield</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed font-serif italic">
                        "{sim.summary}"
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[9px] uppercase font-mono text-slate-500 block">Yield probability</span>
                      <div className="w-24 bg-slate-900 h-1 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${sim.score}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 3: Decision assistant & collision checkers */}
        {activeCoachSubtab === 'tools' && (
          <motion.div
            key="tools-pane"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Sub-tool 1: Decision assistant */}
            <div className="rounded-2xl border border-white/5 bg-slate-900/20 p-6 flex flex-col justify-between shadow shadow-indigo-550/5">
              <div>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/5">
                  <Scale className="w-5 h-5 text-indigo-400" />
                  <h4 className="text-sm font-bold text-slate-100 uppercase tracking-widest font-mono">Decision Assistant™</h4>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-mono text-slate-400 mb-1.5 uppercase tracking-wider">Option A Path</label>
                      <input 
                        id="decision-opt-a"
                        type="text" 
                        value={optA}
                        onChange={(e) => setOptA(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 text-white border border-white/10 text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono text-slate-400 mb-1.5 uppercase tracking-wider">Option B Path</label>
                      <input 
                        id="decision-opt-b"
                        type="text" 
                        value={optB}
                        onChange={(e) => setOptB(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 text-white border border-white/10 text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    id="decision-trigger-btn"
                    disabled={decisionLoading}
                    onClick={runDecisionAssistant}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white uppercase tracking-wider font-mono cursor-pointer"
                  >
                    {decisionLoading ? "Evaluating pros/cons..." : "Compare Paths"}
                  </button>
                </div>

                {decisionOutput && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 space-y-4 text-xs select-text bg-slate-950 p-4 border border-white/10 rounded-xl"
                  >
                    <div className="grid grid-cols-2 gap-4 pb-2 border-b border-white/5">
                      <div>
                        <span className="font-extrabold text-indigo-400 block mb-1">A: {decisionOutput.optionA}</span>
                        <ul className="list-disc pl-3 text-[11px] text-slate-400 space-y-1">
                          {decisionOutput.prosA?.map((p: string, idx: number) => <li key={idx}>{p}</li>)}
                        </ul>
                      </div>
                      <div>
                        <span className="font-extrabold text-cyan-400 block mb-1">B: {decisionOutput.optionB}</span>
                        <ul className="list-disc pl-3 text-[11px] text-slate-400 space-y-1">
                          {decisionOutput.prosB?.map((p: string, idx: number) => <li key={idx}>{p}</li>)}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <span className="font-bold text-slate-300 block mb-1 font-mono uppercase tracking-widest text-[9px]">Market Demand Dynamics</span>
                      <div className="grid grid-cols-2 gap-4">
                        <p className="text-[11px] text-slate-400 leading-tight"><b>A:</b> {decisionOutput.marketDemandA}</p>
                        <p className="text-[11px] text-slate-400 leading-tight"><b>B:</b> {decisionOutput.marketDemandB}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/5">
                      <span className="font-bold text-indigo-400 block mb-0.5 font-mono uppercase tracking-widest text-[9px]">Verdict Recommendation</span>
                      <p className="text-[11px] text-slate-300 leading-relaxed font-serif italic">"{decisionOutput.verdict}"</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Sub-tool 2: Goal Collision checker */}
            <div className="rounded-2xl border border-white/5 bg-slate-900/20 p-6 flex flex-col justify-between shadow shadow-cyan-550/5">
              <div>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/5">
                  <ShieldAlert className="w-5 h-5 text-cyan-400" />
                  <h4 className="text-sm font-bold text-slate-100 uppercase tracking-widest font-mono">Goal Collision Detector™</h4>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-mono text-slate-400 mb-1.5 uppercase tracking-wider">Goal Focus A</label>
                      <input 
                        id="collision-goal-a"
                        type="text" 
                        value={colGoalA}
                        onChange={(e) => setColGoalA(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 text-white border border-white/10 text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono text-slate-400 mb-1.5 uppercase tracking-wider">Goal Focus B</label>
                      <input 
                        id="collision-goal-b"
                        type="text" 
                        value={colGoalB}
                        onChange={(e) => setColGoalB(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 text-white border border-white/10 text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    id="collision-trigger-btn"
                    disabled={collisionLoading}
                    onClick={runCollisionDetector}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white uppercase tracking-wider font-mono cursor-pointer"
                  >
                    {collisionLoading ? "Auditing active schedules..." : "Inspect Collisions"}
                  </button>
                </div>

                {collisionOutput && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 space-y-4 text-xs select-text bg-slate-950 p-4 border border-white/10 rounded-xl"
                  >
                    <div className="flex justify-between items-center pb-2 border-b border-white/5">
                      <span className="font-bold text-slate-300 font-mono uppercase text-[9px]">Friction Index Matrix</span>
                      <span className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                        collisionOutput.impactScore > 65 ? 'bg-red-500/10 text-red-400 border border-red-500/10' : 'bg-slate-800 text-slate-400'
                      }`}>
                        Score: {collisionOutput.impactScore}/100
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <span className="font-bold text-red-400 block font-mono uppercase tracking-widest text-[9px]">System Conflicts Detected</span>
                      {collisionOutput.warnings?.map((w: string, idx: number) => (
                        <p key={idx} className="text-[11px] text-slate-400 pl-2 border-l border-red-500/20 leading-tight">
                          {w}
                        </p>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-white/5 space-y-1.5">
                      <span className="font-bold text-cyan-400 block font-mono uppercase tracking-widest text-[9px]">Scheduling Advice</span>
                      {collisionOutput.adviceList?.map((adv: string, idx: number) => (
                        <p key={idx} className="text-[11px] text-slate-300 leading-relaxed font-serif italic">
                          "{adv}"
                        </p>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
