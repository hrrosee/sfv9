import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  BookOpen,
  Flame,
  BarChart2,
  Layers,
  ChevronDown,
  Sun,
  Moon,
  Menu,
  X,
  Play,
  Pause,
  Cloud,
  Check,
  NotebookPen,
  RotateCcw,
  Shield,
  Zap,
  Palette,
  Command,
  FolderTree,
  Calendar,
  CheckSquare,
  Volume2,
  Lock,
  Target,
  Code2,
  FileText,
  Award,
  LogIn
} from 'lucide-react';

import { UserSettings } from '../types';
import { getInitialTheme, resolveEffectiveTheme, ThemeMode, getInitialAccentColor, applyAccentColor } from '../utils/themeManager';

export interface LandingPageProps {
  onGetStarted: (accentId?: string) => void;
  onSignIn: (accentId?: string) => void;
  userSettings?: UserSettings;
  onToggleTheme?: () => void;
  onAccentChange?: (accentId: string) => void;
}

/* ==========================================================================
   1. CONSTANTS & DATA CONFIGURATIONS
   ========================================================================== */
// Ultra-Soft & Gentle Accent Theme Glow Presets (100% Theme Synchronized)
export const ACCENT_PRESETS = [
  { id: 'blue', name: 'Electric Blue', hex: '#2563EB', grad: 'from-blue-600 to-indigo-600', ring: 'ring-blue-500', glow: 'from-blue-600/18 via-indigo-600/[0.08]', shadow: 'shadow-blue-600/25' },
  { id: 'green', name: 'Emerald Green', hex: '#059669', grad: 'from-emerald-600 to-teal-600', ring: 'ring-emerald-500', glow: 'from-emerald-600/18 via-teal-600/[0.08]', shadow: 'shadow-emerald-600/25' },
  { id: 'purple', name: 'Indigo Purple', hex: '#7C3AED', grad: 'from-purple-600 to-indigo-600', ring: 'ring-purple-500', glow: 'from-purple-600/18 via-indigo-600/[0.08]', shadow: 'shadow-purple-600/25' },
  { id: 'orange', name: 'Crimson Red', hex: '#DC2626', grad: 'from-rose-600 to-red-600', ring: 'ring-rose-500', glow: 'from-rose-600/18 via-red-600/[0.08]', shadow: 'shadow-rose-600/25' },
  { id: 'amber', name: 'Amber Gold', hex: '#D97706', grad: 'from-amber-600 to-orange-600', ring: 'ring-amber-500', glow: 'from-amber-600/18 via-orange-600/[0.08]', shadow: 'shadow-amber-600/25' },
  { id: 'pink', name: 'Rose Pink', hex: '#E11D48', grad: 'from-pink-600 to-rose-600', ring: 'ring-pink-500', glow: 'from-pink-600/18 via-rose-600/[0.08]', shadow: 'shadow-pink-600/25' },
  { id: 'cyan', name: 'Cyan Ocean', hex: '#0891B2', grad: 'from-cyan-600 to-blue-600', ring: 'ring-cyan-500', glow: 'from-cyan-600/18 via-blue-600/[0.08]', shadow: 'shadow-cyan-600/25' },
];

const NAV_ITEMS = [
  { id: 'features', label: 'Features' },
  { id: 'generator', label: 'Smart Studio' },
  { id: 'themes', label: 'Accent Themes' },
  { id: 'syllabus', label: '25-Subject Syllabus' },
  { id: 'faq', label: 'FAQ' },
];

/* ==========================================================================
   MAIN COMPONENT: LandingPage
   ========================================================================== */
export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onSignIn, userSettings, onToggleTheme, onAccentChange }) => {

  const computeEffectiveDark = (): boolean => {
    if (typeof document !== 'undefined' && document.documentElement.classList.contains('dark')) {
      return true;
    }
    const currentTheme: ThemeMode = userSettings?.theme || getInitialTheme();
    return resolveEffectiveTheme(currentTheme) === 'dark';
  };

  // Theme Toggle (Dark / Light)
  const [isDark, setIsDark] = useState<boolean>(computeEffectiveDark);

  useEffect(() => {
    setIsDark(computeEffectiveDark());
  }, [userSettings?.theme]);

  // Interactive 7 Accent Theme Selection (LocalStorage Sync & Persistence)
  const [activeAccent, setActiveAccent] = useState(() => {
    const savedAccent = getInitialAccentColor();
    return ACCENT_PRESETS.find(p => p.id === savedAccent) || ACCENT_PRESETS[0];
  });

  const handleSelectAccent = (preset: typeof ACCENT_PRESETS[0]) => {
    setActiveAccent(preset);
    try {
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-accent', preset.id);
      }
      applyAccentColor(preset.id as any);
      const saved = localStorage.getItem('studyflow_user_settings');
      const parsed = saved ? JSON.parse(saved) : {};
      parsed.primaryColor = preset.id;
      localStorage.setItem('studyflow_user_settings', JSON.stringify(parsed));
      if (onAccentChange) {
        onAccentChange(preset.id);
      }
    } catch (_) {}
  };

  // Active Scrollspy Navbar Section State & Sticky Scrolled State
  const [activeNavSection, setActiveNavSection] = useState<string>('hero');
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const isManualScrollingRef = useRef<boolean>(false);
  const scrollLockTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 3D Perspective Mouse Hover Tilt State for Hero Mockup
  const [mouseTilt, setMouseTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMockupMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to +0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to +0.5
    setMouseTilt({ x: x * 10, y: -y * 10 });
  };

  const handleMockupMouseLeave = () => {
    setMouseTilt({ x: 0, y: 0 });
  };

  // Scrollspy observer & sticky scroll elevation tracker on the window (with manual scroll lock)
  useEffect(() => {
    const sectionIds = ['features', 'generator', 'themes', 'syllabus', 'faq'];
    const handleScroll = () => {
      const scrollPosition = window.scrollY || document.documentElement.scrollTop || 0;
      setIsScrolled(scrollPosition > 20);

      // If user just clicked a nav button, do not blink through intermediate sections during smooth scroll
      if (isManualScrollingRef.current) return;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 240) {
            setActiveNavSection(id);
            return;
          }
        }
      }
      if (scrollPosition < 300) {
        setActiveNavSection('hero');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleTheme = () => {
    if (onToggleTheme) {
      onToggleTheme();
      return;
    }
    setIsDark((prev) => {
      const next = !prev;
      if (typeof document !== 'undefined') {
        const root = document.documentElement;
        if (next) {
          root.classList.add('dark');
          root.style.colorScheme = 'dark';
        } else {
          root.classList.remove('dark');
          root.style.colorScheme = 'light';
        }

        // Persist theme mode so it seamlessly syncs with the main app
        try {
          const raw = localStorage.getItem('studyflow_user_settings');
          const current = raw ? JSON.parse(raw) : {};
          const updated = {
            ...current,
            theme: next ? 'dark' : 'light',
            darkMode: next,
          };
          localStorage.setItem('studyflow_user_settings', JSON.stringify(updated));
        } catch (_) {}
      }
      return next;
    });
  };

  // Mobile menu open state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Live Stopwatch / Focus Timer Demo State
  const [demoTimerSeconds, setDemoTimerSeconds] = useState<number>(1500); // 25:00 default
  const [isDemoTimerRunning, setIsDemoTimerRunning] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isDemoTimerRunning) {
      interval = setInterval(() => {
        setDemoTimerSeconds((prev) => (prev > 0 ? prev - 1 : 1500));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isDemoTimerRunning]);

  const formatDemoTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Interactive Batch Markdown Simulator State
  const [syntaxSimOutput, setSyntaxSimOutput] = useState<boolean>(false);

  // Smooth scroll helper with instant lock against intermediate flickering
  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    setActiveNavSection(id);
    isManualScrollingRef.current = true;
    if (scrollLockTimerRef.current) clearTimeout(scrollLockTimerRef.current);
    scrollLockTimerRef.current = setTimeout(() => {
      isManualScrollingRef.current = false;
    }, 850);

    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // FAQ Accordion Open States
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Pre-configured Syllabus Tab Selector
  const [activeSyllabusTab, setActiveSyllabusTab] = useState<'bcs' | 'bank' | 'academic'>('bcs');

  const SYLLABUS_DATA = {
    bcs: [
      { name: 'বাংলা ভাষা ও সাহিত্য', topics: '৩৫টি টপিক', tasks: '১৪০টি টাস্ক', progress: 85, color: 'from-blue-500 to-indigo-600' },
      { name: 'English Language & Literature', topics: '৩২টি টপিক', tasks: '১২৮টি টাস্ক', progress: 70, color: 'from-purple-500 to-indigo-600' },
      { name: 'বাংলাদেশ বিষয়াবলী', topics: '৪০টি টপিক', tasks: '১৬০টি টাস্ক', progress: 90, color: 'from-emerald-500 to-teal-600' },
      { name: 'আন্তর্জাতিক বিষয়াবলী', topics: '২৫টি টপিক', tasks: '১০০টি টাস্ক', progress: 60, color: 'from-amber-500 to-orange-600' },
      { name: 'গাণিতিক যুক্তি ও মানসিক দক্ষতা', topics: '২৮টি টপিক', tasks: '১১২টি টাস্ক', progress: 75, color: 'from-rose-500 to-pink-600' },
      { name: 'সাধারণ বিজ্ঞান ও আইসিটি', topics: '৩০টি টপিক', tasks: '১২০টি টাস্ক', progress: 80, color: 'from-cyan-500 to-blue-600' },
    ],
    bank: [
      { name: 'Quantitative Aptitude & Math', topics: '২৪টি টপিক', tasks: '৯৬টি টাস্ক', progress: 80, color: 'from-blue-500 to-indigo-600' },
      { name: 'English Verbal Ability', topics: '২৬টি টপিক', tasks: '১০৪টি টাস্ক', progress: 85, color: 'from-purple-500 to-indigo-600' },
      { name: 'Banking & Financial Affairs', topics: '১৮টি টপিক', tasks: '৭২টি টাস্ক', progress: 65, color: 'from-emerald-500 to-teal-600' },
      { name: 'Analytical Reasoning & Data', topics: '২০টি টপিক', tasks: '৮০টি টাস্ক', progress: 70, color: 'from-amber-500 to-orange-600' },
      { name: 'Computer & IT Knowledge', topics: '১৫টি টপিক', tasks: '৬০টি টাস্ক', progress: 90, color: 'from-cyan-500 to-blue-600' },
    ],
    academic: [
      { name: 'Higher Mathematics', topics: '২০টি অধ্যায়', tasks: '৮০টি অনুশীলন', progress: 75, color: 'from-blue-500 to-indigo-600' },
      { name: 'Physics & Astronomy', topics: '১৮টি অধ্যায়', tasks: '৭২টি অনুশীলন', progress: 80, color: 'from-purple-500 to-indigo-600' },
      { name: 'Chemistry & Reactions', topics: '২২টি অধ্যায়', tasks: '৮৮টি অনুশীলন', progress: 60, color: 'from-emerald-500 to-teal-600' },
      { name: 'Biology & Genetics', topics: '১৬টি অধ্যায়', tasks: '৬৪টি অনুশীলন', progress: 85, color: 'from-amber-500 to-orange-600' },
      { name: 'ICT & Programming', topics: '১২টি অধ্যায়', tasks: '৪৮টি প্রজেক্ট', progress: 95, color: 'from-cyan-500 to-blue-600' },
    ],
  };

  const FAQS = [
    {
      q: 'Study Flow কি সম্পূর্ণ ফ্রিতে ব্যবহার করা যাবে?',
      a: 'হ্যাঁ, Study Flow ১০০% সম্পূর্ণ ফ্রি। কোনো সাবস্ক্রিপশন ফি বা ক্রেডিট কার্ডের প্রয়োজন নেই। আপনি যত খুশি বিষয়, টপিক, টাস্ক ও নোটস তৈরি করতে পারবেন।',
    },
    {
      q: 'ইন্টারনেট কানেকশন ছাড়া অফলাইনে কাজ করবে কি?',
      a: 'অবশ্যই! এটি একটি পূর্ণাঙ্গ Offline-First অ্যাপ। ইন্টারনেট না থাকলেও আপনার পড়ার ডেটা নিরাপদে ব্রাউজারে সংরক্ষিত থাকবে এবং নেট পেলেই স্বয়ংক্রিয়ভাবে ক্লাউডে সিঙ্ক হয়ে যাবে।',
    },
    {
      q: 'স্টাডি স্টপওয়াচ ও ফোকাস টাইমার কীভাবে কাজ করে?',
      a: 'প্রতিটি টপিক পড়ার সময় আপনি স্টপওয়াচ চালু রাখতে পারেন। পড়ার মাঝে নিয়মিত বিরতিতে হালকা সিন্থেসাইজার সাউন্ড কাইম বাজবে এবং ৬০ সেকেন্ড রেসপন্স না করলে স্বয়ংক্রিয়ভাবে পজ হয়ে যাবে।',
    },
    {
      q: 'আমার পড়ার অগ্রগতি ও নোটস কি সুরক্ষিত থাকবে?',
      a: 'হ্যাঁ, গুগল ফায়ারবেস ক্লাউডের মাধ্যমে আপনার সমস্ত ডেটা রিয়েল-টাইম এনক্রিপ্ট হয়ে থাকে। ফোন, ল্যাপটপ বা যেকোনো কম্পিউটার থেকে লগইন করে নিজের অগ্রগতি ফিরে পাওয়া যাবে।',
    },
  ];

  // Staggered Cascade Variants (Very visible and pronounced rising motion)
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.09,
        delayChildren: 0.05,
      },
    },
  };

  const itemRiseSpring = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 220,
        damping: 20,
      },
    },
  };

  const popRiseSpring = {
    hidden: { opacity: 0, y: 35, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 240,
        damping: 18,
      },
    },
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] dark:bg-[#090D16] text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-500 selection:text-white transition-colors duration-300 relative preserve-color">
      {/* Full-Page Dynamic Ultra-Soft Ambient Glows (100% Synchronized with Active Accent Theme) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
        {/* 1. Top Hero Soft Ambient Glow */}
        <div className={`absolute -top-10 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b ${activeAccent.glow} to-transparent rounded-full blur-3xl opacity-60 transition-all duration-700`}></div>
        
        {/* 2. Mid Section (Features & Studio) Soft Accent Glow (Right side) */}
        <div className={`absolute top-[28%] -right-48 w-[800px] h-[700px] bg-gradient-to-br ${activeAccent.glow} to-transparent rounded-full blur-3xl opacity-40 transition-all duration-700`}></div>
        
        {/* 3. Lower Section (Syllabus & Shortcuts) Soft Accent Glow (Left side) */}
        <div className={`absolute top-[58%] -left-48 w-[800px] h-[700px] bg-gradient-to-tr ${activeAccent.glow} to-transparent rounded-full blur-3xl opacity-40 transition-all duration-700`}></div>

        {/* 4. Bottom Section (FAQ & Grand CTA) Ambient Glow (Center Soft Spread) */}
        <div className={`absolute top-[82%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-t ${activeAccent.glow} to-transparent rounded-full blur-3xl opacity-45 transition-all duration-700`}></div>
      </div>

      {/* ==========================================================================
         SECTION 1: STICKY FROSTED GLASS NAVBAR
         ========================================================================== */}
      <header className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled
          ? 'border-b border-slate-200/90 dark:border-white/[0.12] bg-white/90 dark:bg-[#090D16]/90 backdrop-blur-xl shadow-md'
          : 'border-b border-slate-200/70 dark:border-white/[0.06] bg-white/80 dark:bg-[#090D16]/80 backdrop-blur-md shadow-none'
      }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5 sm:gap-3 select-none cursor-pointer shrink-0" onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setActiveNavSection('hero'); }}>
            <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/10 flex items-center justify-center shadow-md shadow-blue-500/5 relative overflow-hidden shrink-0">
              <div className="preserve-color relative w-[20px] sm:w-[22px] h-[20px] sm:h-[22px] flex items-center justify-center shrink-0">
                <div className="absolute top-0 left-0 w-[12px] sm:w-[14px] h-[12px] sm:h-[14px] bg-[#2563EB] rounded-[3px] sm:rounded-[3.5px] shadow-3xs"></div>
                <div className="absolute bottom-0 right-0 w-[12px] sm:w-[14px] h-[12px] sm:h-[14px] bg-[#6366F1]/90 backdrop-blur-[1px] rounded-[3px] sm:rounded-[3.5px] mix-blend-multiply dark:mix-blend-screen shadow-3xs"></div>
              </div>
            </div>
            <span className="font-extrabold text-base sm:text-lg lg:text-xl tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
              Study <span className="text-[#2563EB] dark:text-blue-400">Flow</span>
            </span>
          </div>

          {/* Desktop Nav Links with 0-Blink Sliding Spring Pill */}
          <nav className="hidden lg:flex items-center gap-1 p-1 rounded-2xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-white/5 backdrop-blur-md shrink-0 select-none">
            {NAV_ITEMS.map((item) => {
              const isActive = activeNavSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className={`relative px-3 py-1.5 rounded-xl text-xs font-bold transition-colors duration-150 cursor-pointer whitespace-nowrap outline-none ${
                    isActive
                      ? 'text-[#2563EB] dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="landingNavActivePill"
                      className="absolute inset-0 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200/80 dark:border-white/10"
                      transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Actions Group (Theme Toggle, Sign In, Get Started, Mobile Menu) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-white/10 transition-all cursor-pointer min-w-[38px] sm:min-w-[42px] min-h-[38px] sm:min-h-[42px] flex items-center justify-center shrink-0"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Filled Tactile Pill Sign In Button (Desktop & Tablet) */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSignIn(activeAccent.id)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200/90 dark:hover:bg-slate-700/90 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-white/10 shadow-xs backdrop-blur-md transition-all cursor-pointer whitespace-nowrap shrink-0 min-h-[38px] sm:min-h-[42px]"
            >
              <LogIn className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Sign In</span>
            </motion.button>

            {/* Primary CTA Button (Compact, No Wrap, Responsive Padding) */}
            <button
              type="button"
              onClick={() => onGetStarted(activeAccent.id)}
              className={`relative overflow-hidden inline-flex items-center gap-1.5 px-3.5 sm:px-4.5 py-2 rounded-xl bg-gradient-to-r ${activeAccent.grad} text-white font-bold text-xs sm:text-sm shadow-md ${activeAccent.shadow} active:scale-95 transition-all cursor-pointer group whitespace-nowrap shrink-0 min-h-[38px] sm:min-h-[42px]`}
            >
              {/* Moving Shimmer Light Beam */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none"></span>
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Mobile / Tablet Animated Hamburger Menu Button */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.92 }}
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer min-w-[38px] min-h-[38px] flex items-center justify-center shrink-0 border border-slate-200/60 dark:border-white/10"
              aria-label="Toggle navigation menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isMobileMenuOpen ? (
                  <motion.div
                    key="closeIcon"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menuIcon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Butter-Smooth Accordion Mobile Drawer (Smooth Open & Smooth Collapse Exit) */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              key="landingMobileDrawer"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden border-b border-slate-200/90 dark:border-white/10 bg-white/95 dark:bg-[#090D16]/95 backdrop-blur-xl px-4 py-4 space-y-1.5 shadow-2xl overflow-hidden"
            >
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className={`block w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold min-h-[44px] transition-colors ${
                    activeNavSection === item.id
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400 font-bold'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => { setIsMobileMenuOpen(false); onSignIn(activeAccent.id); }}
                  className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-bold text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-white/10 flex items-center justify-center gap-2 min-h-[44px] transition-colors cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span>Sign In</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setIsMobileMenuOpen(false); onGetStarted(activeAccent.id); }}
                  className={`w-full py-3 rounded-xl bg-gradient-to-r ${activeAccent.grad} text-white text-sm font-bold shadow-md ${activeAccent.shadow} min-h-[44px] transition-all cursor-pointer`}
                >
                  Get Started Free 🚀
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ==========================================================================
         SECTION 2: HERO SECTION & LIVE ACCENT PREVIEW
         ========================================================================== */}
      <section className="relative z-10 pt-12 pb-14 sm:pt-18 sm:pb-20 lg:pt-24 lg:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center flex flex-col items-center">
        {/* Hero Main Headline with Dual Gradient Text */}
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 20 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl leading-[1.2] sm:leading-[1.14] text-slate-900 dark:text-white"
        >
          Master Your Studies & Exams with{' '}
          <span className={`bg-gradient-to-r ${activeAccent.grad} bg-clip-text text-transparent transition-all duration-500`}>
            Precision & Focus
          </span>
        </motion.h1>

        {/* Subtitle Description */}
        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 20, delay: 0.08 }}
          className="mt-6 text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-2xl font-normal leading-relaxed"
        >
          বিসিএস, ব্যাংক জব ও বিশ্ববিদ্যালয় পরীক্ষার সম্পূর্ণ প্রস্তুতি এক ড্যাশবোর্ডে। 
          স্মার্ট সিলেবাস জেনারেটর, ডিপ স্টাডি স্টপওয়াচ, ও মার্কডাউন নোটস স্টুডিও।
        </motion.p>

        {/* Interactive 7 Accent Theme Selector Dots in Hero (Instant 1-Step Spring Pop) */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 20, delay: 0.14 }}
          className="mt-6 flex items-center gap-2 p-1.5 rounded-full bg-white/80 dark:bg-slate-900/70 border border-slate-200/80 dark:border-white/10 backdrop-blur-md shadow-xs select-none"
        >
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 pl-2.5 pr-1 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-slate-400" /> Live Theme:
          </span>
          <div className="flex items-center gap-1.5 pr-1.5">
            {ACCENT_PRESETS.map((p) => {
              const isActive = activeAccent.id === p.id;
              return (
                <motion.button
                  key={p.id}
                  type="button"
                  whileHover={{ scale: isActive ? 1.25 : 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  animate={{ scale: isActive ? 1.25 : 1 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                  onClick={() => handleSelectAccent(p)}
                  style={{ backgroundColor: p.hex }}
                  className={`w-6 h-6 rounded-full cursor-pointer min-w-[24px] shrink-0 outline-none ${
                    isActive
                      ? 'ring-2 ring-offset-2 ring-slate-400 dark:ring-white dark:ring-offset-slate-900 shadow-md'
                      : 'opacity-75 hover:opacity-100'
                  }`}
                  title={`Switch to ${p.name}`}
                />
              );
            })}
          </div>
        </motion.div>

        {/* Hero CTA Action Group */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 20, delay: 0.2 }}
          className="mt-8 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto"
        >
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onGetStarted(activeAccent.id)}
            className={`relative overflow-hidden w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r ${activeAccent.grad} text-white font-bold text-sm sm:text-base shadow-xl ${activeAccent.shadow} transition-all cursor-pointer flex items-center justify-center gap-2 group min-h-[48px]`}
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none"></span>
            <span>Start Free Today</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => scrollToSection('features')}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl border border-slate-200 dark:border-white/15 bg-white/70 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200 font-bold text-sm sm:text-base backdrop-blur-md transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[48px]"
          >
            <BookOpen className="w-4 h-4 text-blue-500" />
            <span>Explore Features</span>
          </motion.button>
        </motion.div>

        {/* Guarantees Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.26 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 select-none"
        >
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> No credit card required</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% Offline-Ready</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Multi-device Cloud Sync</span>
        </motion.div>

        {/* 3D FLOATING DASHBOARD MOCKUP PREVIEW WITH 3D MOUSE TILT */}
        <div
          className="mt-12 sm:mt-16 w-full max-w-5xl relative [perspective:1000px]"
          onMouseMove={handleMockupMouseMove}
          onMouseLeave={handleMockupMouseLeave}
        >
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.96 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              rotateX: mouseTilt.y,
              rotateY: mouseTilt.x,
            }}
            transition={{ type: 'spring', stiffness: 220, damping: 20, delay: 0.2 }}
            className="w-full relative [transform-style:preserve-3d]"
          >
            <div className="rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-white/15 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl shadow-2xl overflow-hidden text-left p-3 sm:p-5 lg:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                  </div>
                  <span className="ml-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                    Study Flow Workspace • BCS & Government Job Prep
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 flex items-center gap-1.5 shadow-xs">
                    <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" /> 14 Day Streak
                    <Shield className="w-3 h-3 text-blue-500 fill-blue-500/30" title="Freeze Shield Active" />
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Syllabus Progress</span>
                    <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                      78% <span className="text-xs font-semibold text-emerald-500">+12% this week</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full border-4 border-blue-500/20 border-t-blue-600 flex items-center justify-center text-xs font-extrabold text-blue-600 dark:text-blue-400">78%</div>
                </div>

                <div className="p-3.5 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200/80 dark:border-blue-800/50 flex items-center justify-between relative overflow-hidden">
                  <div>
                    <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Study Stopwatch
                    </span>
                    <div className="text-xl sm:text-2xl font-mono font-extrabold text-blue-950 dark:text-blue-200 mt-0.5">{formatDemoTimer(demoTimerSeconds)}</div>
                  </div>
                  <div className="flex items-center gap-1.5 relative z-10">
                    <button
                      type="button"
                      onClick={() => setIsDemoTimerRunning((prev) => !prev)}
                      className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-white transition-all cursor-pointer shadow-md ${isDemoTimerRunning ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20' : 'bg-[#2563EB] hover:bg-blue-600 shadow-blue-500/25'}`}
                      title={isDemoTimerRunning ? 'Pause Stopwatch' : 'Start Stopwatch'}
                    >
                      {isDemoTimerRunning ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setIsDemoTimerRunning(false); setDemoTimerSeconds(1500); }}
                      className="h-9 w-9 rounded-xl flex items-center justify-center bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
                      title="Reset Stopwatch"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Today's Tasks</span>
                    <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">8 / 10 <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">80% Done</span></div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400"><Check className="w-5 h-5 stroke-[2.5]" /></div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-white/10 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between"><span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400">পাটিগণিত</span><span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">100% Mastered</span></div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">শতকরা ও লাভ-ক্ষতি</h4>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden"><div className="bg-emerald-500 h-full rounded-full w-full"></div></div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium"><span>5/5 Tasks</span><span>⏱️ 2h 40m studied</span></div>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-white/10 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between"><span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">বাংলাদেশ বিষয়াবলী</span><span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">60% In Progress</span></div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">সংবিধানের মূলনীতি ও অনুচ্ছেদ</h4>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden"><div className={`bg-gradient-to-r ${activeAccent.grad} h-full rounded-full w-3/5`}></div></div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium"><span>3/5 Tasks</span><span>⏱️ 1h 20m studied</span></div>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-white/10 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between"><span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">English Literature</span><span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">Due Tomorrow</span></div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Shakespearean Tragedies</h4>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden"><div className="bg-amber-500 h-full rounded-full w-2/5"></div></div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium"><span>2/5 Tasks</span><span>⏱️ 45m studied</span></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==========================================================================
         SECTION 3: METRICS STRIP BANNER
         ========================================================================== */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ type: 'spring', stiffness: 220, damping: 20 }}
        className="border-y border-slate-200/80 dark:border-white/[0.08] bg-white/60 dark:bg-slate-900/40 backdrop-blur-md py-8 select-none"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div><div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">25+</div><div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Pre-configured Syllabi</div></div>
          <div><div className="text-2xl sm:text-3xl font-extrabold text-[#2563EB] dark:text-blue-400">Mindful</div><div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Study Stopwatch & Chimes</div></div>
          <div><div className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400">7 Colors</div><div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Dynamic Accent Themes</div></div>
          <div><div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">365 Days</div><div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Consistency Heatmap</div></div>
        </div>
      </motion.section>

      {/* ==========================================================================
         SECTION 4: 8-CORE DEDICATED FEATURE SUITE
         ========================================================================== */}
      <section id="features" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ type: 'spring', stiffness: 220, damping: 20 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-xs sm:text-sm font-bold text-[#2563EB] dark:text-blue-400 uppercase tracking-widest">Engineered For High Performance</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-2 text-slate-900 dark:text-white">Everything you need to conquer your syllabus</h2>
          <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-400">প্রতিটি ফিচার এমনভাবে তৈরি যা পড়ার চাপ কমিয়ে ধারাবাহিকতা ও গভীর মনোযোগ নিশ্চিত করে।</p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7"
        >
          {/* Feature 1: Multi-Batch Smart Generator */}
          <motion.div
            variants={itemRiseSpring}
            whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 15 } }}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 shadow-xl shadow-slate-900/5 hover:border-blue-400 dark:hover:border-blue-700 transition-all group flex flex-col justify-between cursor-default"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mb-5 shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6 fill-white/20 stroke-[2.2]" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">মাল্টি-ব্যাচ সিলেবাস জেনারেটর</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">এক ক্লিকে সম্পূর্ণ বিষয়ের ২৫টি রেডিমেড সিলেবাস থেকে টপিক ও মাইক্রো-টাস্ক তৈরি করুন।</p>
            </div>
          </motion.div>

          {/* Feature 2: Daily Task Manager */}
          <motion.div
            variants={itemRiseSpring}
            whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 15 } }}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 shadow-xl shadow-slate-900/5 hover:border-emerald-400 dark:hover:border-emerald-700 transition-all group flex flex-col justify-between cursor-default"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center mb-5 shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform">
                <CheckSquare className="w-6 h-6 fill-white/20 stroke-[2.2]" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Daily Task Manager & Priorities</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">মাইক্রো-টাস্ক চেকলিস্ট, হাই/মিডিয়াম প্রায়োরিটি ট্যাগ ও রিলেティブ ডিউ ডেট কাউন্টডাউন।</p>
            </div>
          </motion.div>

          {/* Feature 3: Mindful Deep Stopwatch */}
          <motion.div
            variants={itemRiseSpring}
            whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 15 } }}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 shadow-xl shadow-slate-900/5 hover:border-indigo-400 dark:hover:border-indigo-700 transition-all group flex flex-col justify-between cursor-default"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center mb-5 shadow-lg shadow-indigo-500/25 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6 fill-white/20 stroke-[2.2]" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">ডিপ স্টাডি স্টপওয়াচ</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">টপিকভিত্তিক সময় গণনা, কাস্টমাইজেবল মাইলস্টোন অডিও কাইম ও অটো-পজ গ্রেস উইন্ডো।</p>
            </div>
          </motion.div>

          {/* Feature 4: 7 Dynamic Accent Colors */}
          <motion.div
            variants={itemRiseSpring}
            whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 15 } }}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 shadow-xl shadow-slate-900/5 hover:border-pink-400 dark:hover:border-pink-700 transition-all group flex flex-col justify-between cursor-default"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-pink-600 to-rose-600 text-white flex items-center justify-center mb-5 shadow-lg shadow-pink-500/25 group-hover:scale-110 transition-transform">
                <Palette className="w-6 h-6 fill-white/20 stroke-[2.2]" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">৭টি কাস্টম অ্যাকসেন্ট কালার</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Electric Blue, Emerald, Purple, Red, Amber সহ ৭টি থিম ও ডার্ক/লাইট মোড।</p>
            </div>
          </motion.div>

          {/* Feature 5: Notion Markdown Notes */}
          <motion.div
            variants={itemRiseSpring}
            whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 15 } }}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 shadow-xl shadow-slate-900/5 hover:border-amber-400 dark:hover:border-amber-700 transition-all group flex flex-col justify-between cursor-default"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center mb-5 shadow-lg shadow-amber-500/25 group-hover:scale-110 transition-transform">
                <NotebookPen className="w-6 h-6 fill-white/20 stroke-[2.2]" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">মার্কডাউন নোটস স্টুডিও</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Notion স্টাইল ক্লিক-টু-এডিট, রিচ মার্কডাউন ও ১.০ সেকেন্ড নিরাপদ অটো-সেভ।</p>
            </div>
          </motion.div>

          {/* Feature 6: Streak & Freeze */}
          <motion.div
            variants={itemRiseSpring}
            whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 15 } }}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 shadow-xl shadow-slate-900/5 hover:border-orange-400 dark:hover:border-orange-700 transition-all group flex flex-col justify-between cursor-default"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-orange-500 to-red-600 text-white flex items-center justify-center mb-5 shadow-lg shadow-orange-500/25 group-hover:scale-110 transition-transform">
                <Flame className="w-6 h-6 fill-white/20 stroke-[2.2]" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">স্ট্রিক ফ্লেম ও ফ্রিজ শিল্ড</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">ধারাবাহিকতার ফায়ার স্ট্রিক, টুডেস গোল পূরণে কনফেটি ও স্ট্রিক ফ্রিজ সুবিধা।</p>
            </div>
          </motion.div>

          {/* Feature 7: 365 Days Heatmap */}
          <motion.div
            variants={itemRiseSpring}
            whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 15 } }}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 shadow-xl shadow-slate-900/5 hover:border-cyan-400 dark:hover:border-cyan-700 transition-all group flex flex-col justify-between cursor-default"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-600 text-white flex items-center justify-center mb-5 shadow-lg shadow-cyan-500/25 group-hover:scale-110 transition-transform">
                <BarChart2 className="w-6 h-6 fill-white/20 stroke-[2.2]" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">৩৬৫-দিনের হিটম্যাপ</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">গিটহাব-স্টাইল স্টাডি গ্রিড, উইকলি চার্ট ও ১ ক্লিকে এআই রিপোর্ট কপি করার বাটন।</p>
            </div>
          </motion.div>

          {/* Feature 8: Multi-Workspace */}
          <motion.div
            variants={itemRiseSpring}
            whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 15 } }}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 shadow-xl shadow-slate-900/5 hover:border-purple-400 dark:hover:border-purple-700 transition-all group flex flex-col justify-between cursor-default"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-600 text-white flex items-center justify-center mb-5 shadow-lg shadow-purple-500/25 group-hover:scale-110 transition-transform">
                <FolderTree className="w-6 h-6 fill-white/20 stroke-[2.2]" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">মাল্টি-ওয়ার্কস্পেস ও সেকশন</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">বিষয়ভিত্তিক ওয়ার্কস্পেস, অধ্যায় ট্যাব, ড্র্যাগ অ্যান্ড ড্রপ ও সফট ডিলিট রিস্টোর।</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ==========================================================================
         SECTION 5: INTERACTIVE SMART BATCH MARKDOWN GENERATOR STUDIO
         ========================================================================== */}
      <section id="generator" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto scroll-mt-24">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ type: 'spring', stiffness: 220, damping: 20 }}
          className="text-center max-w-2xl mx-auto mb-10"
        >
          <span className="text-xs sm:text-sm font-bold text-[#2563EB] dark:text-blue-400 uppercase tracking-widest">Lightning Fast Setup</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-2 text-slate-900 dark:text-white">Multi-Batch Smart Topic Studio</h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">সহজ মার্কডাউন সিনট্যাক্স দিয়ে এক ক্লিকে সম্পূর্ণ বিষয় ও অধ্যায়ের টাস্ক জেনারেট করুন।</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 35, scale: 0.94 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          className="rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-slate-900/90 p-5 sm:p-7 shadow-xl shadow-slate-900/5 space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
            <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-blue-500" /> Batch Markdown Syntax Input
            </span>
            <button
              type="button"
              onClick={() => setSyntaxSimOutput((prev) => !prev)}
              className="px-4 py-1.5 rounded-lg bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer min-h-[40px]"
            >
              {syntaxSimOutput ? 'Reset Demo' : '⚡ Generate Topics & Tasks'}
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto select-all">
            <p className="text-blue-400 font-semibold">// Type topic name followed by {">"} and comma-separated subtasks:</p>
            <p className="mt-2 text-emerald-300">বাংলা সাহিত্য &gt; চর্যাপদ ও মঙ্গলকাব্য, মধ্যযুগীয় সাহিত্য, আধুনিক কবিতা</p>
            <p className="text-amber-300">গাণিতিক যুক্তি &gt; শতকরা ও লাভ-ক্ষতি, সুদকষা, অনুপাত ও সমানুপাত</p>
            <p className="text-purple-300">বাংলাদেশ বিষয়াবলী &gt; প্রাচীন বাংলার ইতিহাস, মুক্তিযুদ্ধ ও সংবিধান</p>
          </div>

          <AnimatePresence>
            {syntaxSimOutput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="pt-3 border-t border-slate-100 dark:border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3"
              >
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50">
                  <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300">✨ বাংলা সাহিত্য</div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 space-y-0.5">
                    <div>• চর্যাপদ ও মঙ্গলকাব্য</div>
                    <div>• মধ্যযুগীয় সাহিত্য</div>
                    <div>• আধুনিক কবিতা</div>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50">
                  <div className="text-xs font-bold text-amber-800 dark:text-amber-300">✨ গাণিতিক যুক্তি</div>
                  <div className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 space-y-0.5">
                    <div>• শতকরা ও লাভ-ক্ষতি</div>
                    <div>• সুদকষা</div>
                    <div>• অনুপাত ও সমানুপাত</div>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/50">
                  <div className="text-xs font-bold text-purple-800 dark:text-purple-300">✨ বাংলাদেশ বিষয়াবলী</div>
                  <div className="text-[11px] text-purple-600 dark:text-purple-400 mt-1 space-y-0.5">
                    <div>• প্রাচীন বাংলার ইতিহাস</div>
                    <div>• মুক্তিযুদ্ধ ও সংবিধান</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ==========================================================================
         SECTION 6: DEDICATED 7-ACCENT THEMES SHOWCASE
         ========================================================================== */}
      <section id="themes" className="py-16 sm:py-24 border-y border-slate-200/80 dark:border-white/[0.08] bg-white/70 dark:bg-slate-900/50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <span className="text-xs sm:text-sm font-bold text-[#2563EB] dark:text-blue-400 uppercase tracking-widest">Visual Personalization</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-2 text-slate-900 dark:text-white">৭টি স্পন্দনশীল অ্যাকসেন্ট কালার প্যালেট</h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">নিজের পছন্দের রঙে সাজিয়ে নিন আপনার সম্পূর্ণ স্টাডি স্পেস।</p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4"
          >
            {ACCENT_PRESETS.map((preset) => (
              <motion.button
                key={preset.id}
                variants={popRiseSpring}
                type="button"
                whileHover={{ y: -6, scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => setActiveAccent(preset)}
                className={`p-4 rounded-2xl border text-center cursor-pointer flex flex-col items-center gap-2.5 outline-none ${
                  activeAccent.id === preset.id
                    ? 'border-slate-400 dark:border-white bg-slate-50 dark:bg-slate-800 shadow-md ring-2 ring-blue-500/30'
                    : 'border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-900'
                }`}
              >
                <div className={`w-8 h-8 rounded-full shadow-md`} style={{ backgroundColor: preset.hex }}></div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{preset.name}</span>
                {activeAccent.id === preset.id && (
                  <span className="text-[10px] font-extrabold text-[#2563EB] dark:text-blue-400">Active</span>
                )}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==========================================================================
         SECTION 7: 25-SUBJECT SYLLABUS SHOWCASE HUB
         ========================================================================== */}
      <section id="syllabus" className="py-16 sm:py-24 border-b border-slate-200/80 dark:border-white/[0.08] bg-slate-50/50 dark:bg-slate-900/30 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <span className="text-xs sm:text-sm font-bold text-[#2563EB] dark:text-blue-400 uppercase tracking-widest">Curated Syllabus Hub</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-2 text-slate-900 dark:text-white">যে পরীক্ষার জন্যই পড়ুন, সিলেবাস রেডি আছে</h2>
          </motion.div>

          <div className="flex justify-center mb-8">
            <div className="p-1.5 rounded-2xl bg-slate-200/70 dark:bg-slate-800 border border-slate-300/60 dark:border-white/10 inline-flex gap-1 flex-wrap justify-center select-none">
              <button
                type="button"
                onClick={() => setActiveSyllabusTab('bcs')}
                className={`relative px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer min-h-[44px] ${
                  activeSyllabusTab === 'bcs' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {activeSyllabusTab === 'bcs' && (
                  <motion.div layoutId="syllabusTabPill" className="absolute inset-0 rounded-xl bg-white dark:bg-slate-900 shadow-xs border border-slate-200/60 dark:border-white/10" transition={{ type: 'spring', stiffness: 450, damping: 30 }} />
                )}
                <span className="relative z-10">🇧🇩 BCS Preliminary & Written</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveSyllabusTab('bank')}
                className={`relative px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer min-h-[44px] ${
                  activeSyllabusTab === 'bank' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {activeSyllabusTab === 'bank' && (
                  <motion.div layoutId="syllabusTabPill" className="absolute inset-0 rounded-xl bg-white dark:bg-slate-900 shadow-xs border border-slate-200/60 dark:border-white/10" transition={{ type: 'spring', stiffness: 450, damping: 30 }} />
                )}
                <span className="relative z-10">🏦 Bank Job Exam</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveSyllabusTab('academic')}
                className={`relative px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer min-h-[44px] ${
                  activeSyllabusTab === 'academic' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {activeSyllabusTab === 'academic' && (
                  <motion.div layoutId="syllabusTabPill" className="absolute inset-0 rounded-xl bg-white dark:bg-slate-900 shadow-xs border border-slate-200/60 dark:border-white/10" transition={{ type: 'spring', stiffness: 450, damping: 30 }} />
                )}
                <span className="relative z-10">🎓 University & Academic</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SYLLABUS_DATA[activeSyllabusTab].map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-xs flex items-center justify-between cursor-default hover:scale-[1.02] transition-transform duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-10 rounded-full bg-gradient-to-b ${item.color}`}></div>
                  <div><h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{item.name}</h4><span className="text-xs text-slate-500 dark:text-slate-400">{item.topics} • {item.tasks}</span></div>
                </div>
                <div className="text-right"><span className="text-xs font-extrabold text-[#2563EB] dark:text-blue-400">অটো-জেনারেটর</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================================================
         SECTION 8: 3-STEP PROGRESSIVE ONBOARDING
         ========================================================================== */}
      <section className="py-16 sm:py-24 border-b border-slate-200/80 dark:border-white/[0.08] bg-slate-50/60 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
            className="text-center max-w-2xl mx-auto mb-14"
          >
            <span className="text-xs sm:text-sm font-bold text-[#2563EB] dark:text-blue-400 uppercase tracking-widest">Simple & Effective</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-2 text-slate-900 dark:text-white">মাত্র ৩ ধাপে শুরু করুন</h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={itemRiseSpring} whileHover={{ y: -6 }} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 text-center space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950 text-[#2563EB] dark:text-blue-400 font-extrabold flex items-center justify-center mx-auto text-sm">1</div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">সিলেবাস নির্বাচন</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">২৫টি বিষয়ের রেডিমেড সিলেবাস থেকে সিলেক্ট করুন অথবা এক ক্লিকে নিজের টাস্ক যোগ করুন।</p>
            </motion.div>
            <motion.div variants={itemRiseSpring} whileHover={{ y: -6 }} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 text-center space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 font-extrabold flex items-center justify-center mx-auto text-sm">2</div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">ফোকাস স্টাডি সেশন</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">স্টপওয়াচ চালু করে পড়ুন, মাইলস্টোন সাউন্ড উপভোগ করুন ও রিচ নোটস লিখুন।</p>
            </motion.div>
            <motion.div variants={itemRiseSpring} whileHover={{ y: -6 }} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 text-center space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center justify-center mx-auto text-sm">3</div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">ধারাবাহিকতা ট্র্যাকিং</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">স্ট্রিক ফ্লেম ও ৩৬৫-দিনের হিটম্যাপে নিজের প্রতিদিনের পড়ার অগ্রগতি দেখতে থাকুন।</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ==========================================================================
         SECTION 9: POWER USER KEYBOARD SHORTCUTS
         ========================================================================== */}
      <motion.section
        initial={{ opacity: 0, y: 28, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ type: 'spring', stiffness: 220, damping: 20 }}
        className="py-10 max-w-5xl mx-auto px-4 sm:px-6 select-none"
      >
        <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 p-4 sm:p-5 flex flex-wrap items-center justify-around gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300 backdrop-blur-md shadow-xs">
          <div className="flex items-center gap-2"><kbd className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-[11px]">Ctrl + K</kbd><span>Global Search</span></div>
          <div className="flex items-center gap-2"><kbd className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-[11px]">Ctrl + Z</kbd><span>Instant Undo</span></div>
          <div className="flex items-center gap-2"><kbd className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-[11px]">Enter</kbd><span>Quick Add Task</span></div>
          <div className="flex items-center gap-2"><kbd className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-[11px]">Space</kbd><span>Toggle Stopwatch</span></div>
        </div>
      </motion.section>

      {/* ==========================================================================
         SECTION 10: FAQ ACCORDION SECTION
         ========================================================================== */}
      <section id="faq" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto scroll-mt-24">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ type: 'spring', stiffness: 220, damping: 20 }}
          className="text-center mb-12"
        >
          <span className="text-xs sm:text-sm font-bold text-[#2563EB] dark:text-blue-400 uppercase tracking-widest">Frequently Asked Questions</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-2 text-slate-900 dark:text-white">সাধারণ কিছু প্রশ্নের উত্তর</h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="space-y-3.5"
        >
          {FAQS.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <motion.div
                key={index}
                variants={itemRiseSpring}
                className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-900/80 overflow-hidden transition-colors"
              >
                <button type="button" onClick={() => setOpenFaqIndex(isOpen ? null : index)} className="w-full p-4 sm:p-5 text-left font-bold text-base sm:text-lg flex items-center justify-between gap-4 text-slate-900 dark:text-white cursor-pointer select-none min-h-[48px]">
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-blue-500' : ''}`} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="px-4 pb-5 sm:px-5 sm:pb-5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-white/5 pt-3">
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ==========================================================================
         SECTION 11: GRAND CTA BANNER
         ========================================================================== */}
      <motion.section
        initial={{ opacity: 0, y: 40, scale: 0.94 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ type: 'spring', stiffness: 190, damping: 22 }}
        className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
      >
        <div className={`relative rounded-3xl bg-gradient-to-r ${activeAccent.grad} p-8 sm:p-12 lg:p-16 text-center text-white overflow-hidden shadow-2xl ${activeAccent.shadow} transition-all duration-500`}>
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/10 blur-2xl"></div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight max-w-2xl mx-auto leading-tight">আজই শুরু হোক আপনার সুশৃঙ্খল পড়ার যাত্রা</h2>
          <p className="mt-4 text-sm sm:text-base text-white/90 max-w-xl mx-auto">হাজারো শিক্ষার্থীর মতো নিজের সিলেবাস ও পড়ার সময়কে সম্পূর্ণ নিয়ন্ত্রণে রাখুন। ১০০% ফ্রি ও সুরক্ষিত।</p>
          <div className="mt-8 flex justify-center">
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onGetStarted(activeAccent.id)}
              className="relative overflow-hidden px-8 py-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-sm sm:text-base shadow-xl active:scale-95 transition-all cursor-pointer flex items-center gap-2 group min-h-[48px]"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-blue-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none"></span>
              <span>Get Started Free Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </div>
      </motion.section>

      {/* ==========================================================================
         SECTION 12: FOOTER
         ========================================================================== */}
      <footer className="border-t border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#070A10] py-10 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
            <span>Study Flow</span><span>•</span><span className="text-slate-400">© 2026 All rights reserved.</span>
          </div>
          <div className="flex items-center gap-5 text-xs font-semibold">
            <button type="button" onClick={() => scrollToSection('features')} className="hover:text-blue-500 cursor-pointer min-h-[44px]">Features</button>
            <button type="button" onClick={() => scrollToSection('generator')} className="hover:text-blue-500 cursor-pointer min-h-[44px]">Smart Studio</button>
            <button type="button" onClick={() => scrollToSection('themes')} className="hover:text-blue-500 cursor-pointer min-h-[44px]">Themes</button>
            <button type="button" onClick={() => scrollToSection('syllabus')} className="hover:text-blue-500 cursor-pointer min-h-[44px]">Syllabus</button>
            <button type="button" onClick={() => scrollToSection('faq')} className="hover:text-blue-500 cursor-pointer min-h-[44px]">FAQ</button>
            <button type="button" onClick={() => onSignIn(activeAccent.id)} className="hover:text-blue-500 cursor-pointer min-h-[44px]">Login</button>
          </div>
        </div>
      </footer>
    </div>
  );
};