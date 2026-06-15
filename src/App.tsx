import React, { useState, useEffect } from 'react';
import { UserProfile, Goal, Habit, Task, Roadmap, Achievement, Badge, GoalCategory } from './types';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import GoalsSection from './components/GoalsSection';
import RoadmapsSection from './components/RoadmapsSection';
import HabitsSection from './components/HabitsSection';
import PlannerSection from './components/PlannerSection';
import AnalyticsSection from './components/AnalyticsSection';
import AICoachSection from './components/AICoachSection';
import AchievementsSection from './components/AchievementsSection';
import ReportsSection from './components/ReportsSection';
import SettingsSection from './components/SettingsSection';
import { 
  Compass, LayoutDashboard, Target, Flame, Calendar, BarChart3, 
  Brain, Award, ShieldAlert, FileText, Settings, Sparkles, LogOut, Menu, X, CheckCircle,
  Eye, EyeOff, Lock, Shield, Search, Users, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// STUB/SEED DATA FOR A HIGH-FIDELITY INITIAL STATE
const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'ac_1', title: "First Anchor Placed", description: "Inject your ultimate ambition inside the Goal Planner", unlocked: true, xpAwarded: 200, category: 'goals', icon: 'Target' },
  { id: 'ac_2', title: "Daily Consistency Loop", description: "Log 3 habits in a single 24-hour cycle", unlocked: false, xpAwarded: 300, category: 'streaks', icon: 'Flame' },
  { id: 'ac_3', title: "Foundations Complete", description: "Finish all checklist steps in Stage 1 of any active roadmap", unlocked: false, xpAwarded: 500, category: 'goals', icon: 'Compass' },
  { id: 'ac_4', title: "Productivity Pinnacle", description: "Maintain a 100% completed daily planner schedule agenda", unlocked: false, xpAwarded: 350, category: 'tasks', icon: 'Calendar' }
];

const INITIAL_BADGES: Badge[] = [
  { id: 'bd_1', title: "Consistency King", description: "Unlocked at Level 5 master consistency", unlocked: true, category: 'consistency' },
  { id: 'bd_2', title: "Productivity Hero", description: "Earned for executing 10 scheduled blocks", unlocked: false, category: 'productivity' },
  { id: 'bd_3', title: "Learning Champion", description: "Secured by concluding Stage 2 requirements", unlocked: false, category: 'learning' },
  { id: 'bd_4', title: "Goal Master", description: "Secured by level up to 10", unlocked: false, category: 'customization' }
];


const INITIAL_HABITS: Habit[] = [
  { id: 'h_1', name: "Study coding concepts", category: "study", streak: 3, maxStreak: 5, logs: { '2026-06-14': true, '2026-06-13': true, '2026-06-12': true }, frequency: 'daily' },
  { id: 'h_2', name: "Morning Cardio training", category: "exercise", streak: 2, maxStreak: 3, logs: { '2026-06-14': true, '2026-06-13': true }, frequency: 'daily' },
  { id: 'h_3', name: "Diaphragmatic Breathing", category: "meditation", streak: 1, maxStreak: 1, logs: { '2026-06-14': true }, frequency: 'daily' }
];

const INITIAL_TASKS: Task[] = [
  { id: 't_1', title: "Review React & Express micro-architecture", completed: true, priority: "high", date: new Date().toISOString().split('T')[0], timeBlock: "09:00 - 11:00" },
  { id: 't_2', title: "Structure dynamic SQL schemas", completed: false, priority: "medium", date: new Date().toISOString().split('T')[0], timeBlock: "11:30 - 13:00" },
  { id: 't_3', title: "Daily fitness run (5K)", completed: false, priority: "low", date: new Date().toISOString().split('T')[0], timeBlock: "17:00 - 18:30" }
];

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Mobile responsive sidebar toggle
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Global Focus Mode state
  const [focusMode, setFocusMode] = useState<boolean>(() => localStorage.getItem('lifemap_focus_mode') === 'true');

  const toggleFocusMode = () => {
    setFocusMode(prev => {
      const next = !prev;
      localStorage.setItem('lifemap_focus_mode', String(next));
      if (next) {
        if (['analytics', 'coaching', 'achievements', 'reports', 'settings'].includes(activeTab)) {
          setActiveTab('dashboard');
        }
      }
      return next;
    });
  };

  // Level up alert state
  const [showLevelAlert, setShowLevelAlert] = useState(false);
  const [levelUpMsg, setLevelUpMsg] = useState('');

  // Admin Backdoor Panel state
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [adminError, setAdminError] = useState('');
  const [isAdminAuthed, setIsAdminAuthed] = useState(false);
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminSearch, setAdminSearch] = useState('');
  const [adminKeyVisible, setAdminKeyVisible] = useState(false);

  const registerUserOnServer = async (userProfile: any) => {
    try {
      await fetch('/api/admin/sync-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userProfile)
      });
    } catch (err) {
      console.warn("Failed to sync registered user metadata with primary express cloud cache:", err);
    }
  };

  const fetchAdminUsers = async (submittedKey: string) => {
    setAdminLoading(true);
    setAdminError('');
    try {
      const response = await fetch(`/api/admin/users?key=${encodeURIComponent(submittedKey)}`);
      const data = await response.json();
      if (response.ok && data.success) {
        setAdminUsers(data.users);
        setIsAdminAuthed(true);
      } else {
        setAdminError(data.error || "Verification failed: Could not fetch users.");
      }
    } catch (err) {
      setAdminError("Network failure connecting to administrative nodes.");
    } finally {
      setAdminLoading(false);
    }
  };

  const handleLogoDoubleClick = () => {
    setShowAdminModal(true);
    setAdminError('');
    if (isAdminAuthed && adminKey) {
      fetchAdminUsers(adminKey);
    }
  };

  const verifyAdminCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKey.trim()) {
      setAdminError("Please enter the administrator access key.");
      return;
    }
    fetchAdminUsers(adminKey);
  };

  // 1. Initial State Hydrator
  useEffect(() => {
    const savedProfile = localStorage.getItem('lifemap_profile');
    const savedGoals = localStorage.getItem('lifemap_goals');
    const savedRoadmaps = localStorage.getItem('lifemap_roadmaps');
    const savedHabits = localStorage.getItem('lifemap_habits');
    const savedTasks = localStorage.getItem('lifemap_tasks');

    if (savedProfile) {
      const parsedPr = JSON.parse(savedProfile);
      setProfile(parsedPr);
      registerUserOnServer(parsedPr); // Sync profile with server list
    }
    if (savedGoals) setGoals(JSON.parse(savedGoals));
    if (savedRoadmaps) setRoadmaps(JSON.parse(savedRoadmaps));
    if (savedHabits) setHabits(JSON.parse(savedHabits));
    if (savedTasks) setTasks(JSON.parse(savedTasks));
  }, []);

  // 2. Local Storage Sync loops
  const syncProfile = (updated: UserProfile) => {
    setProfile(updated);
    localStorage.setItem('lifemap_profile', JSON.stringify(updated));
    registerUserOnServer(updated); // Sync evolved profile with server
  };

  const syncGoals = (updated: Goal[]) => {
    setGoals(updated);
    localStorage.setItem('lifemap_goals', JSON.stringify(updated));
  };

  const syncRoadmaps = (updated: Roadmap[]) => {
    setRoadmaps(updated);
    localStorage.setItem('lifemap_roadmaps', JSON.stringify(updated));
  };

  const syncHabits = (updated: Habit[]) => {
    setHabits(updated);
    localStorage.setItem('lifemap_habits', JSON.stringify(updated));
  };

  const syncTasks = (updated: Task[]) => {
    setTasks(updated);
    localStorage.setItem('lifemap_tasks', JSON.stringify(updated));
  };

  // 3. Gamification XP Incrementor
  const earnXP = (amount: number) => {
    if (!profile) return;
    const newXP = profile.xp + amount;
    const prevLevel = profile.level;
    // Standard level equation: level is calculated at thresholds of (level * 500) XP
    const threshold = prevLevel * 500;
    
    let updatedLevel = prevLevel;
    let finalXP = newXP;

    if (finalXP >= threshold) {
      updatedLevel = prevLevel + 1;
      finalXP = finalXP - threshold;
      
      setLevelUpMsg(`Level up! You integrated massive consistency cycles to earn Grade ${updatedLevel}!`);
      setShowLevelAlert(true);
      setTimeout(() => setShowLevelAlert(false), 3500);

      // Dynamically unlock badges on leveling
      if (updatedLevel >= 5) {
        setBadges(prev => prev.map(b => b.id === 'bd_1' ? { ...b, unlocked: true } : b));
      }
      if (updatedLevel >= 10) {
        setBadges(prev => prev.map(b => b.id === 'bd_4' ? { ...b, unlocked: true } : b));
      }
    }

    const updatedProfile: UserProfile = {
      ...profile,
      xp: finalXP,
      level: updatedLevel,
      scores: {
        ...profile.scores,
        productivity: Math.min(100, profile.scores.productivity + 2)
      }
    };
    syncProfile(updatedProfile);
  };

  // 4. Onboarding complete callback
  const handleOnboardingComplete = (newProfile: UserProfile) => {
    syncProfile(newProfile);
    
    // Seed initial goal & roadmap to make workspace immediately rich
    const initialGoal: Goal = {
      id: "goal_seed",
      title: "Become a Full-Stack AI Engineer",
      category: "career",
      description: "Secure baseline skills in React, TypeScript, Node.js and Gemini SDKs.",
      status: "active",
      targetDate: "2026-12-31",
      milestones: [
        { id: "ml_seed_1", title: "[Stage 1] Study modern React hooks, types, Express API routes", done: false, targetWeek: "Week 2" },
        { id: "ml_seed_2", title: "[Stage 2] Integrate Gemini API, handle model streams", done: false, targetWeek: "Week 6" },
        { id: "ml_seed_3", title: "[Stage 3] Deploy container images to scalable Cloud Run", done: false, targetWeek: "Week 12" }
      ],
      successProbability: 84,
      monthlyPlan: "Master core state components, build 2 small proxy applications.",
      weeklyPlan: "Read through Google GenAI SDK specs, complete Stage 1 tasks.",
      dailyTasks: ["Spend 45 minutes coding core files"],
      createdAt: new Date().toISOString()
    };

    const initialRoadmap: Roadmap = {
      id: "rm_seed",
      goalId: "goal_seed",
      title: "Become a Full-Stack AI Engineer Roadmap",
      stages: [
        {
          title: "Foundations of React & Types",
          steps: [
            { id: "step_s1", title: "Compile custom hooks, manage React 19 render side-effects", done: false },
            { id: "step_s2", title: "Write unified interfaces, configure safe types", done: false }
          ]
        },
        {
          title: "Full-Stack Server & APIs",
          steps: [
            { id: "step_s3", title: "Setup Express router, structure error handling and body parsers", done: false },
            { id: "step_s4", title: "Configure local dotenv, isolate secret keys on backend", done: false }
          ]
        },
        {
          title: "Gemini Integration Sprint",
          steps: [
            { id: "step_s5", title: "Initiate GoogleGenAI client with correct build user-agent headers", done: false },
            { id: "step_s6", title: "Implement token streams and stream text chunks back to frontend", done: false }
          ]
        },
        {
          title: "Deployment & Scale check",
          steps: [
            { id: "step_s7", title: "Build self-contained CommonJS target utilizing ESBuild bundler", done: false },
            { id: "step_s8", title: "Verify memory usage, check local file read rules inside production", done: false }
          ]
        }
      ],
      activeStageIndex: 0,
      createdAt: new Date().toISOString()
    };

    syncGoals([initialGoal]);
    syncRoadmaps([initialRoadmap]);
  };

  // 5. Actions: Goals Section
  const handleAddGoal = (newGoal: Goal) => {
    const updated = [newGoal, ...goals];
    syncGoals(updated);
    earnXP(200); // 1st Goal Achievement XP boost
    setAchievements(prev => prev.map(ac => ac.id === 'ac_1' ? { ...ac, unlocked: true } : ac));
  };

  const handleDeleteGoal = (goalId: string) => {
    syncGoals(goals.filter(g => g.id !== goalId));
    syncRoadmaps(roadmaps.filter(r => r.goalId !== goalId));
  };

  const handleToggleMilestone = (goalId: string, milestoneId: string) => {
    const updated = goals.map(g => {
      if (g.id !== goalId) return g;
      const updatedMilestones = g.milestones.map(m => {
        if (m.id !== milestoneId) return m;
        const currentStatus = !m.done;
        if (currentStatus) earnXP(150); // XP rewards for sub-milestone completions
        return { ...m, done: currentStatus };
      });
      return { ...g, milestones: updatedMilestones };
    });
    syncGoals(updated);
  };

  // Automatically invokes the compiled Roadmap for goal titles
  const handleTriggerRoadmapForGoal = async (goalTitle: string, category: GoalCategory, goalId: string) => {
    try {
      const response = await fetch('/api/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goalTitle,
          category,
          availableTime: profile?.availableTime || 4,
          skillLevel: profile?.skillLevel || 'intermediate'
        })
      });
      const data = await response.json();
      
      const stages = data.stages?.map((stage: any) => ({
        title: stage.title || "Foundation milestones",
        steps: stage.steps?.map((step: any, sIdx: number) => ({
          id: `step_${goalId}_${Date.now()}_${sIdx}`,
          title: step.title || "Study core specs",
          done: false
        })) || []
      })) || [
        {
          title: "Foundations & Manuals",
          steps: [
            { id: `step_${goalId}_1`, title: "Research core manuals first week", done: false },
            { id: `step_${goalId}_2`, title: "Execute basic project scaffold setups", done: false }
          ]
        },
        {
          title: "Executing Prototypes",
          steps: [
            { id: `step_${goalId}_3`, title: "Run initial prototype test matrices", done: false },
            { id: `step_${goalId}_4`, title: "Refine speed performance bottlenecks", done: false }
          ]
        },
        {
          title: "Advanced Iterations",
          steps: [
            { id: `step_${goalId}_5`, title: "Implement production level audits", done: false },
            { id: `step_${goalId}_6`, title: "Incorporate robust checks", done: false }
          ]
        },
        {
          title: "Launches & Retros",
          steps: [
            { id: `step_${goalId}_7`, title: "Final launch audit checking list", done: false },
            { id: `step_${goalId}_8`, title: "Execute future projections analysis", done: false }
          ]
        }
      ];

      const newRoadmap: Roadmap = {
        id: `rm_${goalId}`,
        goalId,
        title: `${goalTitle} Compiled Roadmap`,
        stages,
        activeStageIndex: 0,
        createdAt: new Date().toISOString()
      };

      syncRoadmaps([newRoadmap, ...roadmaps]);
    } catch (e) {
      console.error(e);
      // Construct rich offline default roadmap
      const defaultRoadmap: Roadmap = {
        id: `rm_${goalId}`,
        goalId,
        title: `${goalTitle} Compiled Roadmap`,
        stages: [
          {
            title: "Foundations & Manuals",
            steps: [
              { id: `step_${goalId}_1`, title: "Research core manuals first week", done: false },
              { id: `step_${goalId}_2`, title: "Execute basic project scaffold setups", done: false }
            ]
          },
          {
            title: "Executing Prototypes",
            steps: [
              { id: `step_${goalId}_3`, title: "Run initial prototype test matrices", done: false },
              { id: `step_${goalId}_4`, title: "Refine speed performance bottlenecks", done: false }
            ]
          },
          {
            title: "Advanced Iterations",
            steps: [
              { id: `step_${goalId}_5`, title: "Implement production level audits", done: false },
              { id: `step_${goalId}_6`, title: "Incorporate robust checks", done: false }
            ]
          },
          {
            title: "Launches & Retros",
            steps: [
              { id: `step_${goalId}_7`, title: "Final launch audit checking list", done: false },
              { id: `step_${goalId}_8`, title: "Execute future projections analysis", done: false }
            ]
          }
        ],
        activeStageIndex: 0,
        createdAt: new Date().toISOString()
      };
      syncRoadmaps([defaultRoadmap, ...roadmaps]);
    }
  };

  // 6. Actions: Roadmaps Section
  const handleToggleStep = (roadmapId: string, stageTitle: string, stepId: string) => {
    let earnedBonus = false;
    const updated = roadmaps.map(r => {
      if (r.id !== roadmapId) return r;
      const updatedStages = r.stages.map(st => {
        if (st.title !== stageTitle) return st;
        const updatedSteps = st.steps.map(step => {
          if (step.id !== stepId) return step;
          const targetState = !step.done;
          if (targetState) {
            earnXP(100); // 100 XP per step
            earnedBonus = true;
          }
          return { ...step, done: targetState };
        });
        return { ...st, steps: updatedSteps };
      });
      return { ...r, stages: updatedStages };
    });
    syncRoadmaps(updated);

    // Achievement unlock: If all steps in Stage 1 completed
    const targetRoadmap = updated.find(r => r.id === roadmapId);
    if (targetRoadmap && targetRoadmap.stages[0].steps.every(s => s.done)) {
      setAchievements(prev => prev.map(ac => ac.id === 'ac_3' ? { ...ac, unlocked: true } : ac));
    }
  };

  const handleSetStageActive = (roadmapId: string, stageIndex: number) => {
    const updated = roadmaps.map(r => {
      if (r.id !== roadmapId) return r;
      return { ...r, activeStageIndex: stageIndex };
    });
    syncRoadmaps(updated);
    earnXP(50);
  };

  // 7. Actions: Habits Section
  const handleAddHabit = (newHabit: Habit) => {
    syncHabits([newHabit, ...habits]);
  };

  const handleToggleHabit = (habitId: string, dateKey: string) => {
    const updated = habits.map(h => {
      if (h.id !== habitId) return h;
      const checked = !h.logs[dateKey];
      const newLogs = { ...h.logs, [dateKey]: checked };
      
      // Calculate active streak
      let currentStreak = h.streak;
      if (checked) {
        currentStreak += 1;
        earnXP(100); // habit logging gains XP
      } else {
        currentStreak = Math.max(0, currentStreak - 1);
      }

      // Achievement unlock checking: log 3 habits in one 24-hour cycle
      const allDoneToday = habits.filter(ha => ha.id !== habitId && ha.logs[dateKey]).length >= 2;
      if (checked && allDoneToday) {
        setAchievements(prev => prev.map(ac => ac.id === 'ac_2' ? { ...ac, unlocked: true } : ac));
      }

      return {
        ...h,
        logs: newLogs,
        streak: currentStreak,
        maxStreak: Math.max(h.maxStreak || 0, currentStreak)
      };
    });
    syncHabits(updated);
  };

  const handleDeleteHabit = (habitId: string) => {
    syncHabits(habits.filter(h => h.id !== habitId));
  };

  // 8. Actions: Planner Section
  const handleAddTask = (newTask: Task) => {
    syncTasks([newTask, ...tasks]);
  };

  const handleToggleTask = (taskId: string) => {
    const updated = tasks.map(t => {
      if (t.id !== taskId) return t;
      const status = !t.completed;
      if (status) {
        earnXP(80); // completing scheduled planner tasks
      }
      return { ...t, completed: status };
    });
    syncTasks(updated);

    // If 100% completed today
    const todayStr = new Date().toISOString().split('T')[0];
    const todays = updated.filter(t => t.date === todayStr);
    if (todays.length > 0 && todays.every(t => t.completed)) {
      setAchievements(prev => prev.map(ac => ac.id === 'ac_4' ? { ...ac, unlocked: true } : ac));
    }
  };

  const handleDeleteTask = (taskId: string) => {
    syncTasks(tasks.filter(t => t.id !== taskId));
  };

  // 9. Actions: Settings Section
  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    syncProfile(updatedProfile);
  };

  const handleExportDataAsJSON = () => {
    const dump = {
      profile,
      goals,
      roadmaps,
      habits,
      tasks,
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lifemap_backup_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Log out reset handler
  const handleLogOutReset = () => {
    localStorage.removeItem('lifemap_profile');
    localStorage.removeItem('lifemap_goals');
    localStorage.removeItem('lifemap_roadmaps');
    localStorage.removeItem('lifemap_habits');
    localStorage.removeItem('lifemap_tasks');
    setProfile(null);
    setGoals([]);
    setRoadmaps([]);
    setHabits(INITIAL_HABITS);
    setTasks(INITIAL_TASKS);
    setActiveTab('dashboard');
  };

  // Unregistered state router: Onboarding flow
  if (!profile) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // Visual Navigation Configuration map
  const NAV_ITEMS = [
    { tab: 'dashboard', label: "Control Center", icon: LayoutDashboard },
    { tab: 'goals', label: "Goal Planner", icon: Target },
    { tab: 'roadmaps', label: "Interactive Roadmaps", icon: Compass },
    { tab: 'habits', label: "Habit Anchors", icon: Flame },
    { tab: 'planner', label: "Focus Planner", icon: Calendar },
    { tab: 'analytics', label: "Performance Intelligence", icon: BarChart3 },
    { tab: 'coaching', label: "AI Coach Strategist", icon: Brain },
    { tab: 'achievements', label: "Gamified Badges", icon: Award },
    { tab: 'reports', label: "Executive Reports", icon: FileText },
    { tab: 'settings', label: "System Control", icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* Dynamic top bar for small screens */}
      <div className="md:hidden flex h-16 items-center justify-between px-6 bg-slate-950/80 border-b border-white/5 backdrop-blur-md sticky top-0 z-40">
        <div 
          className="flex items-center gap-2 cursor-pointer select-none active:scale-95 transition-transform"
          onDoubleClick={handleLogoDoubleClick}
          title="Double click to reveal system status"
        >
          <img 
            src="https://i.ibb.co/ymVg7B7g/Life-Map-AI.png" 
            alt="Life-Map-AI Logo" 
            className="w-7 h-7 rounded-lg object-contain shrink-0" 
            referrerPolicy="no-referrer"
          />
          <span className="font-sans font-black tracking-tight text-white text-sm">LifeMap OS</span>
        </div>
        <button 
          id="toggle-sidebar-mobile"
          onClick={() => setSidebarOpen(!sidebarOpen)} 
          className="p-1 px-1.5 text-slate-400 hover:text-white"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile sidebar overlay backdrop */}
      {sidebarOpen && (
        <div 
          id="mobile-sidebar-backdrop"
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-20 md:hidden transition-all duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Primary Left Rail Navigation layout */}
      <aside 
        id="applet-sidebar"
        className={`fixed md:sticky top-16 md:top-0 left-0 h-[calc(100vh-4rem)] md:h-screen w-64 border-r border-white/5 bg-slate-950/95 md:bg-slate-950/40 backdrop-blur-xl md:backdrop-blur-none p-5 shrink-0 z-30 transition-all duration-300 flex flex-col justify-between ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Main design logo header */}
          <div 
            className="flex items-center gap-2.5 pb-2 border-b border-white/5 cursor-pointer select-none hover:bg-white/5 p-1 rounded-xl transition-all"
            onDoubleClick={handleLogoDoubleClick}
            title="Double click for Administrative Console"
          >
            <img 
              src="https://i.ibb.co/ymVg7B7g/Life-Map-AI.png" 
              alt="Life-Map-AI Logo" 
              className="w-8 h-8 rounded-lg object-contain shrink-0" 
              referrerPolicy="no-referrer"
            />
            <div>
              <span className="font-sans font-black tracking-tight text-white text-sm block">LifeMap OS</span>
              <span className="text-[10px] font-mono text-slate-500 uppercase block tracking-wider leading-none">By Mayank Technologies</span>
            </div>
          </div>

          {/* Quick status widget inside rail */}
          {!focusMode && (
            <div className="bg-slate-950 p-3.5 rounded-xl border border-white/5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-mono">PILOT RANK:</span>
                <span className="text-[10px] bg-amber-500/10 text-amber-400 font-mono font-bold px-1.5 py-0.5 rounded">LEVEL {profile.level}</span>
              </div>
              <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full" style={{ width: `${(profile.xp / (profile.level * 500)) * 100}%` }} />
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-400">
                <span className="font-semibold text-slate-200 truncate pr-2 max-w-[120px]">{profile.fullName}</span>
                <span className="font-mono text-[9px] text-indigo-400 shrink-0 font-bold">{profile.xp} XP</span>
              </div>
            </div>
          )}

          {/* Global Focus Mode Toggle Widget */}
          <div className={`p-4 rounded-xl border transition-all ${
            focusMode 
              ? 'border-indigo-500/30 bg-indigo-950/20 shadow-lg shadow-indigo-500/5' 
              : 'border-white/5 bg-slate-900/10 hover:border-white/10'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg transition-colors ${
                  focusMode ? 'bg-indigo-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  <EyeOff className="w-4 h-4 shrink-0" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-100 block leading-tight">Focus Mode</span>
                  <span className="text-[9px] text-slate-500 font-mono tracking-wide uppercase leading-none font-bold">
                    {focusMode ? "ACTIVE" : "OFF"}
                  </span>
                </div>
              </div>
              
              <button
                id="focus-mode-toggle-btn"
                onClick={toggleFocusMode}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  focusMode ? 'bg-indigo-600' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    focusMode ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            {focusMode && (
              <div className="mt-2.5 pt-2 border-t border-indigo-500/15">
                <p className="text-[10px] text-slate-400 leading-normal font-sans italic">
                  "Non-essential interfaces hidden. Breathe and complete your active targets."
                </p>
              </div>
            )}
          </div>

          {/* Navigation Action Links */}
          <nav className="space-y-1.5">
            {NAV_ITEMS.filter(item => !focusMode || ['dashboard', 'goals', 'roadmaps', 'habits', 'planner'].includes(item.tab)).map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.tab;
              return (
                <button
                  key={item.tab}
                  id={`nav-link-${item.tab}`}
                  onClick={() => {
                    setActiveTab(item.tab);
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-between group cursor-pointer ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow shadow-indigo-600/15 font-black' 
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Rail Footer actions: Clear indices session reset */}
        <div className="pt-4 border-t border-white/5 space-y-2.5">
          {!focusMode ? (
            <div className="flex items-center gap-1.5 justify-center py-1 bg-cyan-500/5 px-2.5 rounded-lg border border-cyan-500/10">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
              <span className="text-[10px] text-cyan-400 font-mono tracking-wide uppercase font-bold text-center leading-none">Security Active</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 justify-center py-1 bg-indigo-500/5 px-2.5 rounded-lg border border-indigo-500/10 animate-pulse">
              <EyeOff className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[10px] text-indigo-400 font-mono tracking-wide uppercase font-bold text-center leading-none">Focus Lock Active</span>
            </div>
          )}

          <button
            id="reset-profile-btn"
            onClick={handleLogOutReset}
            className="w-full py-2 px-3 rounded-lg text-slate-500 hover:bg-red-950/20 hover:text-red-400 text-xs font-bold transition-colors text-left flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Switch Pilot profile</span>
          </button>
        </div>
      </aside>

      {/* Main viewport area layout */}
      <main id="applet-main-viewport" className="flex-1 p-6 md:p-10 space-y-8 overflow-x-hidden pt-6 md:pt-10">
        
        {/* Dynamic Alert Banner: Level Up notifications */}
        <AnimatePresence>
          {showLevelAlert && (
            <motion.div
              initial={{ rotateX: -90, opacity: 0 }}
              animate={{ rotateX: 0, opacity: 1 }}
              exit={{ rotateX: -90, opacity: 0 }}
              className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-4.5 border border-amber-400/20 text-slate-950 flex items-center gap-3.5 shadow-xl relative overflow-hidden"
            >
              <div className="p-2.5 bg-slate-950/20 rounded-xl">
                <Award className="w-5 h-5 text-slate-950 animate-bounce" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase font-black tracking-widest text-slate-950 block">PROMOTION COMMITTED!</span>
                <p className="text-xs font-black tracking-wide leading-tight mt-0.5">{levelUpMsg}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Routing Router Swapper */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === 'dashboard' && (
              <Dashboard 
                profile={profile} 
                goals={goals} 
                habits={habits} 
                tasks={tasks} 
                onToggleHabit={handleToggleHabit} 
                onToggleTask={handleToggleTask}
                onNavigate={setActiveTab}
                xpHistory={profile.xp}
                focusMode={focusMode}
              />
            )}

            {activeTab === 'goals' && (
              <GoalsSection 
                profile={profile} 
                goals={goals} 
                onAddGoal={handleAddGoal} 
                onDeleteGoal={handleDeleteGoal} 
                onToggleMilestone={handleToggleMilestone}
                onTriggerRoadmapForGoal={handleTriggerRoadmapForGoal}
                onNavigate={setActiveTab}
              />
            )}

            {activeTab === 'roadmaps' && (
              <RoadmapsSection 
                profile={profile} 
                roadmaps={roadmaps} 
                onToggleStep={handleToggleStep} 
                onSetStageActive={handleSetStageActive} 
              />
            )}

            {activeTab === 'habits' && (
              <HabitsSection 
                profile={profile} 
                habits={habits} 
                onAddHabit={handleAddHabit} 
                onToggleHabit={handleToggleHabit} 
                onDeleteHabit={handleDeleteHabit} 
              />
            )}

            {activeTab === 'planner' && (
              <PlannerSection 
                tasks={tasks} 
                onAddTask={handleAddTask} 
                onToggleTask={handleToggleTask} 
                onDeleteTask={handleDeleteTask} 
              />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsSection 
                profile={profile} 
                goals={goals} 
                habits={habits} 
                tasks={tasks} 
              />
            )}

            {activeTab === 'coaching' && (
              <AICoachSection 
                profile={profile} 
                goals={goals} 
                habits={habits} 
                tasks={tasks} 
                onNavigate={setActiveTab}
              />
            )}

            {activeTab === 'achievements' && (
              <AchievementsSection 
                profile={profile} 
                achievements={achievements} 
                badges={badges} 
              />
            )}

            {activeTab === 'reports' && (
              <ReportsSection 
                profile={profile} 
                goals={goals} 
                habits={habits} 
                tasks={tasks} 
              />
            )}

            {activeTab === 'settings' && (
              <SettingsSection 
                profile={profile} 
                onUpdateProfile={handleUpdateProfile} 
                onExportData={handleExportDataAsJSON} 
              />
            )}
          </motion.div>
        </AnimatePresence>

      </main>

      {/* ==========================================
          ADMIN WORKSPACE BACKDOOR CONTROL PANEL
          ========================================== */}
      <AnimatePresence>
        {showAdminModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowAdminModal(false);
                if (!isAdminAuthed) setAdminKey('');
              }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative w-full max-w-4xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl shadow-indigo-500/10 overflow-hidden flex flex-col max-h-[85vh] z-10 font-sans"
            >
              {/* Header */}
              <div className="p-5 border-b border-white/5 bg-slate-950 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/10">
                    <Shield className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h2 className="font-sans font-black tracking-tight text-white text-base">Administrative Command Center</h2>
                    <p className="text-[10px] font-mono text-slate-400">MAYANK os GATEWAY SECURITY INTEGRITY</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowAdminModal(false);
                    if (!isAdminAuthed) setAdminKey('');
                  }}
                  className="p-1.5 hover:bg-white/5 text-slate-400 hover:text-white rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content Panel */}
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                {!isAdminAuthed ? (
                  // Authorization Phase
                  <div className="max-w-md mx-auto py-8 space-y-6 text-center">
                    <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-2 border border-indigo-500/20">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-white font-sans font-bold text-lg">Identity Verification Required</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Please provide your secure administrator passcode to establish a connection with the registered client records cloud.
                      </p>
                    </div>

                    <form onSubmit={verifyAdminCredentials} className="space-y-4 text-left">
                      <div className="space-y-1.5 relative">
                        <label className="text-[10px] font-mono text-slate-400 block tracking-wider uppercase">ADMIN ACCESS PASSCODE</label>
                        <div className="relative">
                          <input
                            type={adminKeyVisible ? "text" : "password"}
                            value={adminKey}
                            onChange={(e) => setAdminKey(e.target.value)}
                            placeholder="Enter Mayank Technologies secure key..."
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 pl-10 pr-10 text-sm font-mono text-indigo-300 focus:outline-none focus:border-indigo-500/40 transition-colors"
                            autoFocus
                          />
                          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                            <Lock className="w-4 h-4" />
                          </div>
                          <button
                            type="button"
                            onClick={() => setAdminKeyVisible(!adminKeyVisible)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                          >
                            {adminKeyVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {adminError && (
                        <p className="text-xs text-rose-400 font-mono flex items-center gap-1.5 bg-rose-500/5 p-2.5 rounded-lg border border-rose-500/10">
                          <ShieldAlert className="w-4 h-4 shrink-0" />
                          {adminError}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={adminLoading}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-sm py-3 px-4 rounded-xl transition-colors shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
                      >
                        {adminLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            Establishing Secure Handshake...
                          </>
                        ) : (
                          "Authorize Connection"
                        )}
                      </button>
                    </form>
                  </div>
                ) : (
                  // Authorized User Auditing Dashboard
                  <div className="space-y-6">
                    {/* Summary Stat Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-slate-950 p-4 border border-white/5 rounded-xl space-y-1">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">ACTIVE NETWORK CLIENTS</span>
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-indigo-400" />
                          <span className="text-2xl font-black font-sans text-white">{adminUsers.length}</span>
                        </div>
                        <p className="text-[10px] text-indigo-400/80 font-mono">Synced on local session variables</p>
                      </div>

                      <div className="bg-slate-950 p-4 border border-white/5 rounded-xl space-y-1">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">ADMIN STATUS</span>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                          <span className="text-sm font-bold font-mono text-emerald-400">SESSION AUTHENTICATED</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono">Mayank technologies master account</p>
                      </div>

                      <div className="bg-slate-950 p-4 border border-white/5 rounded-xl space-y-1">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">CLOUD STORAGE SYNC</span>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-indigo-400 font-mono">SECURE LIVE READ</span>
                          <button
                            type="button"
                            onClick={() => fetchAdminUsers(adminKey)}
                            disabled={adminLoading}
                            className="bg-indigo-600/10 border border-indigo-500/15 hover:bg-indigo-600/20 text-indigo-400 p-1.5 rounded-lg transition-all cursor-pointer"
                            title="Force Refresh Data"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${adminLoading ? 'animate-spin' : ''}`} />
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono">Query delay: ~1ms</p>
                      </div>
                    </div>

                    {/* Filter search box */}
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search users by name, country, occupation or skill level..."
                        value={adminSearch}
                        onChange={(e) => setAdminSearch(e.target.value)}
                        className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2.5 pl-10 text-xs focus:outline-none focus:border-indigo-500/30 text-white transition-colors"
                      />
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                        <Search className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Registered Users List */}
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">
                        Client Accounts Registered ({adminUsers.filter(u => 
                          u.fullName.toLowerCase().includes(adminSearch.toLowerCase()) ||
                          u.country.toLowerCase().includes(adminSearch.toLowerCase()) ||
                          (u.occupation && u.occupation.toLowerCase().includes(adminSearch.toLowerCase())) ||
                          (u.skillLevel && u.skillLevel.toLowerCase().includes(adminSearch.toLowerCase()))
                        ).length})
                      </h4>

                      <div className="space-y-3">
                        {adminUsers.filter(u => 
                          u.fullName.toLowerCase().includes(adminSearch.toLowerCase()) ||
                          u.country.toLowerCase().includes(adminSearch.toLowerCase()) ||
                          (u.occupation && u.occupation.toLowerCase().includes(adminSearch.toLowerCase())) ||
                          (u.skillLevel && u.skillLevel.toLowerCase().includes(adminSearch.toLowerCase()))
                        ).map((u, i) => {
                          const initials = u.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
                          const isSeedAdmin = u.fullName.toLowerCase() === "mayank sharma";
                          return (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.05 }}
                              key={u.id || i}
                              className={`bg-slate-950 border p-4.5 rounded-xl transition-all space-y-4 ${
                                isSeedAdmin ? 'border-amber-500/20 shadow-lg shadow-amber-500/5 bg-gradient-to-r from-slate-950 to-amber-950/20' : 'border-white/5 hover:border-white/10'
                              }`}
                            >
                              {/* Top row Avatar, name, location, date */}
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm tracking-widest leading-none shrink-0 ${
                                    isSeedAdmin ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/15'
                                  }`}>
                                    {initials}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h5 className="font-sans font-extrabold text-sm text-white">{u.fullName}</h5>
                                      {isSeedAdmin && (
                                        <span className="text-[9px] bg-amber-500/10 text-amber-400 font-mono font-bold px-1.5 py-0.5 rounded border border-amber-500/20">
                                          PRIMARY ADMIN
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-mono">
                                      {u.occupation} · <span className="text-indigo-400">{u.education || "No Education set"}</span>
                                    </p>
                                  </div>
                                </div>
                                <div className="text-left sm:text-right font-mono shrink-0">
                                  <span className="text-[10px] bg-white/5 border border-white/5 text-slate-300 px-2 py-0.5 rounded-md block sm:inline-block">
                                    {u.country}
                                  </span>
                                  <span className="text-[9px] text-slate-500 block mt-1">
                                    Registered: {new Date(u.registeredAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>

                              {/* Details section */}
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-3 bg-slate-900/60 rounded-xl border border-white/5 text-[11px] font-mono">
                                <div className="space-y-0.5">
                                  <span className="text-[9px] text-slate-500 block uppercase tracking-wider">AGE/GENDER</span>
                                  <span className="text-slate-300 font-bold">{u.age} · {u.gender}</span>
                                </div>
                                <div className="space-y-0.5">
                                  <span className="text-[9px] text-slate-500 block uppercase tracking-wider">SKILL LEVEL</span>
                                  <span className="text-amber-400 font-bold">{u.skillLevel || "N/A"}</span>
                                </div>
                                <div className="space-y-0.5">
                                  <span className="text-[9px] text-slate-500 block uppercase tracking-wider">HRS / DAY ALLOT</span>
                                  <span className="text-indigo-300 font-bold">{u.availableTime} Hrs</span>
                                </div>
                                <div className="space-y-0.5">
                                  <span className="text-[9px] text-slate-500 block uppercase tracking-wider font-bold">CLIENT SYSTEM ID</span>
                                  <span className="text-slate-400 text-[9px] break-all select-all font-mono font-normal">{(u.id || '').substring(0, 15)}...</span>
                                </div>
                              </div>

                              {/* Additional Lists (Goals, Interests) */}
                              <div className="space-y-3 text-xs">
                                {u.lifeGoals && u.lifeGoals.length > 0 && (
                                  <div className="space-y-1">
                                    <span className="text-[9px] font-mono text-slate-500 uppercase block tracking-wider">Core Life Goals ({u.lifeGoals.length})</span>
                                    <div className="flex flex-wrap gap-1.5">
                                      {u.lifeGoals.map((g: string, idx: number) => (
                                        <span key={idx} className="bg-indigo-500/5 text-indigo-400/90 text-[10px] border border-indigo-500/10 px-2.5 py-0.5 rounded-md font-sans">
                                          🎯 {g}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {u.interests && u.interests.length > 0 && (
                                  <div className="space-y-1">
                                    <span className="text-[9px] font-mono text-slate-500 uppercase block tracking-wider">Interests & Hobbies</span>
                                    <div className="flex flex-wrap gap-1.5">
                                      {u.interests.map((it: string, idx: number) => (
                                        <span key={idx} className="bg-slate-900 border border-white/5 text-slate-400 text-[9px] px-2 py-0.5 rounded">
                                          #{it}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}

                        {adminUsers.filter(u => 
                          u.fullName.toLowerCase().includes(adminSearch.toLowerCase()) ||
                          u.country.toLowerCase().includes(adminSearch.toLowerCase()) ||
                          (u.occupation && u.occupation.toLowerCase().includes(adminSearch.toLowerCase())) ||
                          (u.skillLevel && u.skillLevel.toLowerCase().includes(adminSearch.toLowerCase()))
                        ).length === 0 && (
                          <div className="text-center py-10 bg-slate-950 rounded-xl border border-white/5 font-mono text-slate-500 text-xs">
                            No clients match the queries.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action buttons footer */}
              <div className="p-4 bg-slate-950 border-t border-white/5 flex flex-col sm:flex-row gap-3 sm:items-center justify-between shrink-0">
                <span className="text-[9px] font-mono text-slate-500 uppercase">Mayank OS Integrity Secured</span>
                <div className="flex gap-2">
                  {isAdminAuthed && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsAdminAuthed(false);
                        setAdminKey('');
                        setAdminUsers([]);
                      }}
                      className="bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-400 font-mono font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
                    >
                      Deauthorize Session
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setShowAdminModal(false);
                      if (!isAdminAuthed) setAdminKey('');
                    }}
                    className="bg-indigo-600/15 border border-indigo-500/25 hover:bg-indigo-600/30 text-indigo-400 font-sans font-bold text-xs px-5 py-2 rounded-xl transition-all cursor-pointer"
                  >
                    Close console
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
