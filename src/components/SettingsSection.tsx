import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Sparkles, Check, Database, Star, ShoppingBag, ShieldCheck, Mail, Globe, UserCheck, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SettingsSectionProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onExportData: () => void;
}

// Only utilizing default basic plan layout in current production baseline

export default function SettingsSection({ profile, onUpdateProfile, onExportData }: SettingsSectionProps) {
  const [name, setName] = useState(profile.fullName);
  const [occupation, setOccupation] = useState(profile.occupation);
  const [country, setCountry] = useState(profile.country);
  const [time, setTime] = useState(profile.availableTime);
  const [isSaved, setIsSaved] = useState(false);
  // Subscription parameters retired to maintain a clean local basic sandbox

  const handleSaveProfile = () => {
    const updated = {
      ...profile,
      fullName: name,
      occupation,
      country,
      availableTime: time
    };
    onUpdateProfile(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  // Plan upgrades inactive in current local schema configuration

  return (
    <div id="settings-tab" className="space-y-8">
      
      {/* Profile Modification Editor card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Details Edit Form */}
        <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-6 space-y-4 lg:col-span-2 shadow-xl">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/5">
            <UserCheck className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-widest font-mono">Personal Core Baseline Parameters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono text-slate-400 mb-1.5 uppercase tracking-wider">Full Name</label>
              <input 
                id="settings-fullname-input"
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 text-white border border-white/10 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-slate-400 mb-1.5 uppercase tracking-wider">occupation</label>
              <input 
                id="settings-occupation-input"
                type="text" 
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 text-white border border-white/10 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono text-slate-400 mb-1.5 uppercase tracking-wider">Country Location</label>
              <div className="relative">
                <Globe className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input 
                  id="settings-country-input"
                  type="text" 
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 text-white border border-white/10 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-slate-400 mb-1.5 uppercase tracking-wider">Daily Hours buffer Allocation</label>
              <input 
                id="settings-hours-input"
                type="number" 
                min={1}
                max={12}
                value={time}
                onChange={(e) => setTime(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 text-white border border-white/10 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex justify-end gap-3 items-center">
            {isSaved && (
              <span className="text-xs text-emerald-400 font-mono font-bold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Local index updated!
              </span>
            )}
            <button
              id="save-profile-btn"
              onClick={handleSaveProfile}
              className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-550 text-xs font-bold text-white uppercase tracking-wider font-mono cursor-pointer transition-colors"
            >
              Sync parameters
            </button>
          </div>
        </div>

        {/* Data Utilities backups */}
        <div className="rounded-2xl border border-white/5 bg-slate-900/20 p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-2 pb-1 border-b border-white/5">
              <Database className="w-4 h-4 text-cyan-400" />
              <h4 className="text-sm font-bold text-slate-200 font-mono uppercase tracking-widest text-[10px]">Data & Backups</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mt-2">
              All goals, roadmap completions, habit heatmaps, and achievements are stored directly in your secure client local sandbox. Backup periodically.
            </p>
          </div>

          <div>
            <button
              id="export-data-btn"
              onClick={onExportData}
              className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-xs font-bold text-slate-300 uppercase tracking-wider border border-white/10 cursor-pointer transition-colors"
            >
              Export System backup
            </button>
            <p className="text-[10px] text-slate-600 font-mono text-center mt-2">Generates a standard localized JSON dump file.</p>
          </div>
        </div>
      </div>

      {/* Account Membership & Active Plan status */}
      <div className="rounded-2xl border border-white/5 bg-slate-900/10 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest block">Account Workspace Plan</span>
            <h4 className="text-base font-bold text-slate-100 tracking-tight">Standard LifeMap AI Sandbox</h4>
            <p className="text-xs text-slate-400 max-w-lg leading-relaxed font-sans">
              You are currently utilizing the standard local workspace plan. All core modules—including premium AI Coaching, Goal Reflection, Predictive Forecasting, and Roadmaps—are active, fully stored on-device, and 100% free.
            </p>
          </div>
          <div className="shrink-0 text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono">
              <Check className="w-3.5 h-3.5 text-indigo-400" /> Basic Plan Active
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
