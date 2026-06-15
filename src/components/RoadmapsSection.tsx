import React from 'react';
import { Roadmap, UserProfile } from '../types';
import { Compass, Sparkles, CheckSquare, Layers, HelpCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface RoadmapsSectionProps {
  profile: UserProfile;
  roadmaps: Roadmap[];
  onToggleStep: (roadmapId: string, stageTitle: string, stepId: string) => void;
  onSetStageActive: (roadmapId: string, stageIndex: number) => void;
}

export default function RoadmapsSection({ profile, roadmaps, onToggleStep, onSetStageActive }: RoadmapsSectionProps) {
  return (
    <div id="roadmaps-tab" className="space-y-8">
      
      {/* Intro details */}
      <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-indigo-950/10 via-slate-900/40 to-cyan-950/25 p-6 flex flex-col justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-400/10 border border-cyan-500/20 text-[10px] font-bold text-cyan-400 uppercase tracking-wider font-mono mb-3">
            <Sparkles className="w-3.5 h-3.5" /> STAGE-BY-STAGE PROGRESS MATRIX
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight leading-none">
            Dynamic Roadmap Visualizer
          </h2>
          <p className="text-xs text-slate-400 mt-2 max-w-2xl leading-relaxed">
            Your active life goals have been compiled into multi-stage learning sprints. Complete all steps inside your current stage block to unlock advanced simulation multipliers and trigger level promotions.
          </p>
        </div>
      </div>

      {roadmaps.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-white/5 bg-slate-900/10">
          <Compass className="w-12 h-12 text-slate-700 mx-auto mb-3 animate-spin [animation-duration:8s]" />
          <span className="font-bold text-slate-400 block">No Roadmaps Active</span>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">Please enter an ambition in the Goal Planner. The Gemini compiler will automatically structure a custom 4-stage interactive roadmap here!</p>
        </div>
      ) : (
        <div className="space-y-10">
          {roadmaps.map((roadmap) => {
            // Calculate overall steps completed
            let totalSteps = 0;
            let finishedSteps = 0;
            roadmap.stages.forEach(s => {
              s.steps.forEach(st => {
                totalSteps++;
                if (st.done) finishedSteps++;
              });
            });
            const percent = totalSteps > 0 ? Math.round((finishedSteps / totalSteps) * 100) : 0;

            return (
              <div key={roadmap.id} id={`roadmap-container-${roadmap.id}`} className="rounded-2xl border border-white/5 bg-slate-900/20 p-6 md:p-8 space-y-6 shadow-xl">
                
                {/* Roadmap Header info */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-white/5">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-1">SYSTEM VECTOR PATHWAY</span>
                    <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">{roadmap.title}</h3>
                  </div>
                  
                  <div className="flex items-center gap-4 bg-slate-950 p-3 rounded-xl border border-white/5">
                    <div>
                      <span className="text-[9px] font-mono text-slate-500 block uppercase">Steps complete</span>
                      <span className="text-sm font-black font-mono text-slate-200">{finishedSteps} / {totalSteps}</span>
                    </div>
                    <div className="h-8 w-[1px] bg-white/5" />
                    <div>
                      <span className="text-[9px] font-mono text-slate-500 block uppercase">Progress</span>
                      <span className="text-sm font-black font-mono text-indigo-400">{percent}%</span>
                    </div>
                  </div>
                </div>

                {/* Horizontal Progress bar */}
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-white/5 p-[1px]">
                  <div className="bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-300" style={{ width: `${percent}%` }} />
                </div>

                {/* Stages Visual Nodes Flex/Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {roadmap.stages.map((stage, sIdx) => {
                    const isActive = roadmap.activeStageIndex === sIdx;
                    const isUpcoming = sIdx > roadmap.activeStageIndex;
                    const isCompleted = sIdx < roadmap.activeStageIndex;

                    return (
                      <div 
                        key={sIdx} 
                        id={`roadmap-${roadmap.id}-stage-${sIdx}`}
                        className={`rounded-xl border p-4.5 flex flex-col justify-between transition-all ${
                          isActive 
                            ? 'bg-indigo-950/20 border-indigo-500/50 ring-1 ring-indigo-500' 
                            : isCompleted 
                              ? 'bg-slate-950 border-emerald-500/20' 
                              : 'bg-slate-950 border-white/5 opacity-55'
                        }`}
                      >
                        {/* Stage Node header */}
                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-[10px] uppercase font-mono font-bold text-slate-500">Stage {sIdx + 1}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase font-mono ${
                              isActive ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 animate-pulse' :
                              isCompleted ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/10' :
                              'bg-slate-800 text-slate-500'
                            }`}>
                              {isActive ? "ACTIVE" : isCompleted ? "UNLOCKED" : "LOCKED"}
                            </span>
                          </div>

                          <span className="font-bold text-sm text-slate-200 block mb-4 truncate" title={stage.title}>
                            {stage.title}
                          </span>

                          {/* List checklist inside card */}
                          <div className="space-y-2.5">
                            {stage.steps.map((step) => (
                              <button
                                key={step.id}
                                id={`step-btn-${step.id}`}
                                disabled={isUpcoming}
                                onClick={() => onToggleStep(roadmap.id, stage.title, step.id)}
                                className={`w-full text-left p-2.5 rounded-lg border transition-all text-[11px] flex items-start gap-2 ${
                                  step.done 
                                    ? 'bg-slate-950 border-emerald-600/30 text-slate-500 font-medium' 
                                    : isUpcoming
                                      ? 'bg-slate-950/20 border-white/5 text-slate-600 cursor-not-allowed'
                                      : 'bg-slate-900 border-white/5 hover:border-indigo-500/20 text-slate-300 font-semibold cursor-pointer'
                                }`}
                              >
                                <input 
                                  type="checkbox" 
                                  checked={step.done}
                                  disabled={isUpcoming}
                                  onChange={() => {}} // handled by button
                                  className="w-3 md:w-3.5 h-3 md:h-3.5 rounded text-indigo-500 border-white/10 shrink-0 mt-0.5 pointer-events-none"
                                />
                                <span className={step.done ? 'line-through' : ''}>
                                  {step.title}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Interactive toggle block for Stage */}
                        {isActive ? (
                          <div className="mt-4 pt-3 border-t border-indigo-500/10 flex items-center gap-1.5 text-[9px] text-indigo-400 font-bold uppercase tracking-wider">
                            <Layers className="w-3.5 h-3.5" /> Currently Active Target
                          </div>
                        ) : isUpcoming ? (
                          <button
                            id={`activate-stage-${sIdx}`}
                            onClick={() => onSetStageActive(roadmap.id, sIdx)}
                            className="w-full mt-4 py-1 rounded bg-slate-900 hover:bg-slate-800 text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400 text-center border border-white/5 cursor-pointer"
                          >
                            Set Active Mode
                          </button>
                        ) : (
                          <div className="mt-4 pt-3 border-t border-emerald-500/10 text-[9px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" /> Stage Complete
                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>

                {/* Micro-Interaction advice */}
                <div className="bg-slate-950 p-3 rounded-xl border border-white/5 flex items-center gap-2">
                  <span className="text-cyan-400 font-mono font-bold text-xs uppercase shrink-0">Roadmap Strategy:</span>
                  <p className="text-[11px] text-slate-400">
                    Sustaining consistency increases success probabilities. Unlocking Stage 3 adds a permanent 15% passive daily focus index bonus.
                  </p>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
