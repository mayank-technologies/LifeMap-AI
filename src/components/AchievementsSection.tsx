import React, { useState } from 'react';
import { UserProfile, Achievement, Badge } from '../types';
import { Award, Star, Flame, Trophy, Lock, CheckCircle2, Moon, Palette, Crown } from 'lucide-react';
import { motion } from 'motion/react';

interface AchievementsSectionProps {
  profile: UserProfile;
  achievements: Achievement[];
  badges: Badge[];
}

export default function AchievementsSection({ profile, achievements, badges }: AchievementsSectionProps) {
  const [selectedThemePreview, setSelectedThemePreview] = useState('cosmic-deep');

  return (
    <div id="achievements-tab" className="space-y-8 animate-fade-in">
      
      {/* XP Level Showcase */}
      <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-indigo-950/20 via-slate-900/60 to-cyan-950/20 p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-5">
          <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-5 rounded-2xl shadow-lg border border-orange-500/10 shrink-0">
            <Trophy className="w-10 h-10 text-slate-950 shrink-0" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-black text-white font-mono tracking-tight">Level {profile.level}</span>
              <span className="text-xs bg-amber-500/10 text-amber-400 font-bold border border-amber-500/10 px-2 py-0.5 rounded font-mono uppercase">
                {profile.level < 10 ? 'Beginner Athlete' : profile.level < 50 ? 'Consistency Warrior' : 'Life Master'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">Every completed task, checklist tick, and habit logged accumulates XP to forge higher capacity levels.</p>
          </div>
        </div>

        <div className="w-full md:w-64">
          <div className="flex justify-between text-[11px] font-mono mb-1.5 text-slate-400">
            <span>XP COMPONENT BAR</span>
            <span className="text-amber-400 font-bold">{profile.xp} / {profile.level * 500} XP</span>
          </div>
          <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-white/5">
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full" style={{ width: `${Math.min(100, (profile.xp / (profile.level * 500)) * 100)}%` }} />
          </div>
        </div>
      </div>

      {/* Badges & Medals Row */}
      <div>
        <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
          <Crown className="w-5 h-5 text-amber-400" /> Crown Badges Unlocked
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((badge) => (
            <div 
              key={badge.id} 
              id={`badge-card-${badge.id}`}
              className={`rounded-xl border p-4 text-center flex flex-col items-center justify-between shadow-lg relative overflow-hidden transition-all ${
                badge.unlocked 
                  ? 'bg-slate-900/30 border-amber-500/20 ring-1 ring-amber-500/10' 
                  : 'bg-slate-950 border-white/5 opacity-55'
              }`}
            >
              <div className="space-y-2 flex flex-col items-center">
                <div className={`p-3 rounded-full ${
                  badge.unlocked 
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/10' 
                    : 'bg-slate-900 text-slate-600'
                }`}>
                  <Star className="w-6 h-6 shrink-0" fill={badge.unlocked ? 'black' : 'none'} />
                </div>

                <div>
                  <span className="font-extrabold text-xs text-slate-100 block">{badge.title}</span>
                  <span className="text-[10px] text-slate-500 font-serif leading-tight mt-1 mb-2 block">{badge.description}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 w-full mt-2 flex items-center justify-center gap-1 text-[9px] font-mono leading-none">
                {badge.unlocked ? (
                  <span className="text-amber-400 font-black uppercase flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> OWNER
                  </span>
                ) : (
                  <span className="text-slate-600 flex items-center gap-1 uppercase">
                    <Lock className="w-3 h-3" /> Locked Index
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements milestones checklists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Achievements checklists */}
        <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-slate-900/20 p-6 space-y-4">
          <h4 className="font-bold text-sm text-slate-200">System Achievement Records</h4>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {achievements.map((item) => (
              <div 
                key={item.id} 
                id={`achievement-row-${item.id}`}
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                  item.unlocked 
                    ? 'bg-slate-900 border-amber-500/10' 
                    : 'bg-slate-950 border-white/5 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    item.unlocked ? 'bg-amber-400 text-slate-950' : 'bg-slate-905 bg-slate-900 text-slate-600'
                  }`}>
                    <Trophy className="w-4 h-4 shrink-0" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-slate-200 block">{item.title}</span>
                    <span className="text-[11px] text-slate-500 leading-tight block">{item.description}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="block text-xs font-mono font-bold text-amber-400">+{item.xpAwarded} XP</span>
                  <span className="text-[9px] font-mono text-slate-500 block uppercase mt-0.5">
                    {item.unlocked ? 'Unlocked' : 'Locked'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Level Themes Unlocks widget preview */}
        <div className="rounded-2xl border border-white/5 bg-slate-900/20 p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 pb-1 border-b border-white/5">
              <Palette className="w-4 h-4 text-cyan-400" />
              <h4 className="text-sm font-bold text-slate-200">Reward Custom Themes</h4>
            </div>
            <p className="text-xs text-slate-400">Previews custom visual designs secure by completing high consistency milestones.</p>

            <div className="space-y-2 text-xs mt-4">
              {[
                { id: 'cosmic-deep', label: "Amethyst Deep Space Theme", unlocked: true },
                { id: 'matrix-neon', label: "Digital Matrix Neon Theme", unlocked: false, lvl: 10 },
                { id: 'amber-trophy', label: "Prestige Golden Sand Amber Theme", unlocked: false, lvl: 50 }
              ].map((theme) => (
                <button
                  key={theme.id}
                  id={`theme-btn-${theme.id}`}
                  onClick={() => {
                    if (theme.unlocked || profile.level >= (theme.lvl || 0)) {
                      setSelectedThemePreview(theme.id);
                    }
                  }}
                  className={`w-full p-3.5 rounded-xl border text-left flex justify-between items-center transition-all cursor-pointer ${
                    selectedThemePreview === theme.id 
                      ? 'bg-slate-950 border-indigo-500 text-indigo-400' 
                      : 'bg-slate-950/60 border-white/5 text-slate-400 hover:border-slate-800'
                  }`}
                >
                  <span className="font-semibold">{theme.label}</span>
                  {theme.unlocked ? (
                    <span className="text-[9px] bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded font-bold">ACTIVE</span>
                  ) : (
                    <span className="text-[9px] bg-slate-900 text-slate-500 px-1.5 py-0.5 rounded flex items-center gap-1 font-bold">
                      <Lock className="w-3 h-3" /> Lv. {theme.lvl}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 text-[10px] text-slate-500 font-serif italic text-center leading-relaxed">
            "Previews selected visual skins dynamically inside Level 100 master frames."
          </div>
        </div>

      </div>

    </div>
  );
}
