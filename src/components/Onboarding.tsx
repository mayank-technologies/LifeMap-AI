import React, { useState } from 'react';
import { UserProfile, GoalCategory, SkillLevel, EducationLevel } from '../types';
import { Target, Sparkles, User, Brain, Hourglass, Award, Compass, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const INTERESTS_OPTIONS = [
  'Technology', 'Fitness', 'Business', 'Education', 'Content Creation', 
  'Gaming', 'Arts & Design', 'Finance', 'Science', 'Writing', 'Languages'
];

const GOAL_OPTIONS: { value: GoalCategory; label: string; desc: string }[] = [
  { value: 'career', label: 'Career Growth', desc: 'Accelerate professional standing & job targets' },
  { value: 'business', label: 'Business & Startups', desc: 'Build ventures or launch side projects' },
  { value: 'health', label: 'Health & Fitness', desc: 'Optimize body, diet, sleep & mental performance' },
  { value: 'learning', label: 'Skill Mastery', desc: 'Learn programming, languages, sciences or crafts' },
  { value: 'finance', label: 'Wealth Building', desc: 'Secure financial independence & high-yield plans' },
  { value: 'personal_growth', label: 'Personal Growth', desc: 'Cultivate habits, reading, meditation & daily output' },
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState('Male');
  const [country, setCountry] = useState('India');
  const [occupation, setOccupation] = useState('');
  const [education, setEducation] = useState<EducationLevel>('college_student');
  const [selectedGoals, setSelectedGoals] = useState<GoalCategory[]>([]);
  const [availableTime, setAvailableTime] = useState(3); // Daily hours
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [skillLevel, setSkillLevel] = useState<SkillLevel>('intermediate');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [onboardingProgressMessage, setOnboardingProgressMessage] = useState('');

  const toggleGoal = (cat: GoalCategory) => {
    if (selectedGoals.includes(cat)) {
      setSelectedGoals(selectedGoals.filter(g => g !== cat));
    } else {
      setSelectedGoals([...selectedGoals, cat]);
    }
  };

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const triggerOnboardingAnalysis = async () => {
    setIsAnalyzing(true);
    
    const messages = [
      "Securing safe connection to Mayank Technologies Cloud...",
      "Parsing demographic records & available time metrics...",
      "Analyzing focus coefficient against interests...",
      "Computing baseline balance vector indices...",
      "Synthesizing customized AI Life Profile..."
    ];

    for (let i = 0; i < messages.length; i++) {
      setOnboardingProgressMessage(messages[i]);
      await new Promise(r => setTimeout(r, 900));
    }

    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName, age, gender, country, occupation, education,
          lifeGoals: selectedGoals, availableTime, interests: selectedInterests, skillLevel
        })
      });
      const data = await response.json();
      
      const newProfile: UserProfile = {
        isOnboarded: true,
        fullName,
        age,
        gender,
        country,
        occupation,
        education,
        lifeGoals: selectedGoals,
        availableTime,
        interests: selectedInterests,
        skillLevel,
        xp: 150, // Starting bonus
        level: 1,
        scores: {
          growth: data.growthScore || 70,
          productivity: data.productivityScore || 65,
          learning: data.learningScore || 75,
          health: data.healthScore || 80,
          goal: data.goalScore || 60,
          balanceIndex: data.balanceIndex || 68
        },
        aiProfileAnalysis: data.analysis || "Onboarding analyzed! Ready to design your target roadmap.",
        createdAt: new Date().toISOString()
      };
      
      onComplete(newProfile);
    } catch (e) {
      console.error(e);
      // Hard fallback
      const fallbackProfile: UserProfile = {
        isOnboarded: true,
        fullName,
        age,
        gender,
        country,
        occupation,
        education,
        lifeGoals: selectedGoals,
        availableTime,
        interests: selectedInterests,
        skillLevel,
        xp: 150,
        level: 1,
        scores: {
          growth: 72,
          productivity: 68,
          learning: 74,
          health: 70,
          goal: 65,
          balanceIndex: 69
        },
        aiProfileAnalysis: `Welcome ${fullName}. Armed with ${availableTime} available hours per day, you possess immense power to compound growth in ${selectedGoals.join(", ")}. Let's configure custom roadmaps now.`,
        createdAt: new Date().toISOString()
      };
      onComplete(fallbackProfile);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div id="onboarding-viewport" className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Background radial effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan-950/20 rounded-full blur-[100px] pointer-events-none" />

      <AnimatePresence mode="wait">
        {isAnalyzing ? (
          <motion.div 
            key="analyzing-state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="w-full max-w-md p-8 rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl text-center flex flex-col items-center shadow-2xl"
          >
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-500/10" />
              <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
              <div className="absolute inset-2 rounded-full border-4 border-cyan-400 border-b-transparent animate-spin [animation-duration:1.5s]" />
              <Sparkles className="absolute inset-0 m-auto text-cyan-400 w-8 h-8 animate-pulse" />
            </div>
            
            <h3 className="text-xl font-medium tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-2">
              Generating Future Engine™
            </h3>
            <p className="text-xs text-slate-400 font-mono italic max-h-[40px] px-4">
              {onboardingProgressMessage}
            </p>
          </motion.div>
        ) : (
          <motion.div 
            key={`step-${step}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-xl p-8 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-xl shadow-2xl flex flex-col min-h-[450px]"
          >
            {/* Header progress info */}
            <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
              <div className="flex items-center gap-2">
                <div className="bg-indigo-600/20 p-1.5 rounded-lg border border-indigo-500/20">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                </div>
                <span className="font-semibold text-sm tracking-wide uppercase text-indigo-400">LifeMap AI</span>
              </div>
              <span className="text-xs font-mono text-slate-500">Step {step} of 4</span>
            </div>

            {/* Step 1: Base Demographic info */}
            {step === 1 && (
              <div className="flex-1 flex flex-col">
                <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Let's design your profile</h2>
                <p className="text-sm text-slate-400 mb-6">Configure basic baseline data to feed predictions into the Life Simulation engine.</p>
                
                <div className="space-y-4 flex-1">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                      <input 
                        id="onboarding-fullname"
                        type="text" 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Mayank Sharma" 
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 text-white border border-white/10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm placeholder:text-slate-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Age</label>
                      <input 
                        id="onboarding-age"
                        type="number" 
                        value={age}
                        onChange={(e) => setAge(Number(e.target.value))}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 text-white border border-white/10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Country</label>
                      <input 
                        id="onboarding-country"
                        type="text" 
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 text-white border border-white/10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Gender</label>
                      <select 
                        id="onboarding-gender"
                        value={gender} 
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 text-white border border-white/10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                      >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Non-binary</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Education Level</label>
                      <select 
                        id="onboarding-education"
                        value={education} 
                        onChange={(e) => setEducation(e.target.value as EducationLevel)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 text-white border border-white/10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                      >
                        <option value="school_student">School Student</option>
                        <option value="college_student">College Student</option>
                        <option value="graduate">Graduate Degree</option>
                        <option value="professional">Working Professional</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Current Occupation / Role</label>
                    <input 
                      id="onboarding-occupation"
                      type="text" 
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      placeholder="Software Intern, Content Creator, Student..." 
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 text-white border border-white/10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex justify-end">
                  <button 
                    id="onboarding-step1-next"
                    disabled={!fullName || !occupation}
                    onClick={() => setStep(2)}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-xs font-semibold uppercase tracking-wider transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Choose Life Goals */}
            {step === 2 && (
              <div className="flex-1 flex flex-col">
                <h2 className="text-2xl font-bold tracking-tight text-white mb-1">Select key life objectives</h2>
                <p className="text-sm text-slate-400 mb-6">These categories form structural channels inside your Life Operating System.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 overflow-y-auto max-h-[280px] pr-2">
                  {GOAL_OPTIONS.map((g) => {
                    const isSelected = selectedGoals.includes(g.value);
                    return (
                      <button 
                        key={g.value}
                        id={`onboarding-goal-${g.value}`}
                        onClick={() => toggleGoal(g.value)}
                        className={`text-left p-4 rounded-xl border transition-all flex flex-col gap-1 cursor-pointer ${
                          isSelected 
                            ? 'bg-indigo-900/30 border-indigo-500 ring-1 ring-indigo-500' 
                            : 'bg-slate-950 border-white/15 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm">{g.label}</span>
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            readOnly
                            className="w-3.5 h-3.5 rounded bg-slate-900 border-white/10 text-indigo-500 focus:ring-0 pointer-events-none"
                          />
                        </div>
                        <span className="text-[11px] text-slate-400 leading-tight">{g.desc}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-6 border-t border-white/5 flex justify-between items-center mt-4">
                  <button 
                    id="onboarding-step2-back"
                    onClick={() => setStep(1)}
                    className="text-slate-400 hover:text-white text-xs font-semibold uppercase tracking-wider"
                  >
                    Back
                  </button>
                  <button 
                    id="onboarding-step2-next"
                    disabled={selectedGoals.length === 0}
                    onClick={() => setStep(3)}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-xs font-semibold uppercase tracking-wider transition-all"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Allocated Time & Mastery baseline */}
            {step === 3 && (
              <div className="flex-1 flex flex-col">
                <h2 className="text-2xl font-bold tracking-tight text-white mb-1">Time allocation & current skills</h2>
                <p className="text-sm text-slate-400 mb-6">How much daily hour reserve can you secure for direct self-investment?</p>
                
                <div className="space-y-6 flex-1">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">Daily Available Hours</span>
                      <span className="text-sm font-mono font-bold text-cyan-400">{availableTime} Hours / day</span>
                    </div>
                    <input 
                      id="onboarding-time-slider"
                      type="range"
                      min={1}
                      max={12}
                      value={availableTime}
                      onChange={(e) => setAvailableTime(Number(e.target.value))}
                      className="w-full accent-cyan-400 bg-slate-900 rounded-lg appearance-none h-2 cursor-pointer border border-white/5"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                      <span>1 hr (Minimal focus)</span>
                      <span>6 hrs (Vigorous focus)</span>
                      <span>12 hrs (Absolute mastery)</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Overall Skill Level</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['beginner', 'intermediate', 'advanced'] as SkillLevel[]).map((lvl) => {
                        const isMatch = skillLevel === lvl;
                        return (
                          <button
                            key={lvl}
                            id={`onboarding-skill-${lvl}`}
                            onClick={() => setSkillLevel(lvl)}
                            className={`py-3.5 px-4 rounded-xl border text-sm font-semibold capitalize transition-all cursor-pointer ${
                              isMatch 
                                ? 'bg-cyan-950/40 border-cyan-400 text-cyan-300 ring-1 ring-cyan-400' 
                                : 'bg-slate-950 border-white/10 hover:border-slate-700 text-slate-400'
                            }`}
                          >
                            {lvl}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2 font-serif text-center italic">
                      "Beginner targets smaller milestones, Intermediate tackles robust multi-month stacks, Advanced challenges fully optimized sprints."
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex justify-between items-center mt-4">
                  <button 
                    id="onboarding-step3-back"
                    onClick={() => setStep(2)}
                    className="text-slate-400 hover:text-white text-xs font-semibold uppercase tracking-wider"
                  >
                    Back
                  </button>
                  <button 
                    id="onboarding-step3-next"
                    onClick={() => setStep(4)}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold uppercase tracking-wider transition-all"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Core Interests Selection */}
            {step === 4 && (
              <div className="flex-1 flex flex-col">
                <h2 className="text-2xl font-bold tracking-tight text-white mb-1">Tailor personal interests</h2>
                <p className="text-sm text-slate-400 mb-6">These tags refine notifications, daily motivation, and schedule recommendations.</p>
                
                <div className="flex flex-wrap gap-2.5 flex-1 content-start overflow-y-auto max-h-[220px] pr-2">
                  {INTERESTS_OPTIONS.map((item) => {
                    const isSelected = selectedInterests.includes(item);
                    return (
                      <button
                        key={item}
                        id={`onboarding-interest-${item.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={() => toggleInterest(item)}
                        className={`text-xs px-4 py-2.5 rounded-full border transition-all cursor-pointer font-medium ${
                          isSelected 
                            ? 'bg-indigo-600 text-white border-transparent shadow-lg shadow-indigo-500/20' 
                            : 'bg-slate-950 border-white/10 hover:border-slate-700 text-slate-400'
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-6 border-t border-white/5 flex justify-between items-center mt-4">
                  <button 
                    id="onboarding-step4-back"
                    onClick={() => setStep(3)}
                    className="text-slate-400 hover:text-white text-xs font-semibold uppercase tracking-wider"
                  >
                    Back
                  </button>
                  <button 
                    id="onboarding-finish-btn"
                    onClick={triggerOnboardingAnalysis}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-xs font-bold text-white uppercase tracking-wider transition-all shadow-lg shadow-indigo-500/10 flex items-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4" /> Synthesize OS
                  </button>
                </div>
              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
