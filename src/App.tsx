import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { getLocalDateString } from './utils/dateUtils';
import {
  Search,
  Command,
  Folder,
  Plus,
  Star,
  Trash2,
  Download,
  Upload,
  Settings,
  Menu,
  Clock,
  Bell,
  Play,
  ExternalLink,
  Youtube,
  SlidersHorizontal,
  Loader2,
  Grid,
  TrendingUp,
  Target,
  Flame,
  Sparkles,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  MoreVertical,
  Pencil,
  ArrowUpDown,
  ArrowDownAZ,
  Check,
  Calendar,
  X,
  CheckCircle2,
  RotateCcw,
  BarChart2,
  AlignLeft,
  AlertCircle,
  GripVertical,
  ListTodo,
  CheckSquare,
  Square,
  PieChart,
  Info,
  Keyboard,
  BookOpen,
  Atom,
  FlaskConical,
  FileText,
  Feather,
  PenTool,
  MessageSquare,
  Activity,
  LayoutGrid,
  List,
  Hash,
  Pin,
  Copy,
  CornerUpRight,
  AlertTriangle,
  Mic,
  Headphones,
  Book,
  Filter,
  FolderOutput,
  Calculator,
  Percent,
  Shapes,
  Triangle,
  Binary,
  BrainCircuit,
  Lightbulb,
  Scale,
  Landmark,
  Flag,
  Medal,
  Shield,
  CircleDollarSign,
  Coins,
  Waves,
  Mountain,
  Trees,
  Sprout,
  Zap,
  Building,
  Code2,
  Terminal,
  ShieldCheck,
  Lock,
  Globe,
  Cloud,
  Wifi,
  Database,
  Cpu,
  HardDrive,
  Bot,
  Languages,
  SpellCheck,
  Timer,
  History,
  Compass,
  Globe2,
  BookMarked,
  Pi,
  Radical,
  Infinity,
  Variable,
  Divide,
  Equal,
  Sigma,
  Superscript,
  Subscript,
  GraduationCap,
  Microscope,
  Dna,
  Binary as BinaryIcon,
  Library,
  BookOpenCheck,
  NotebookPen,
  Scroll,
  FileCode2,
  FileSpreadsheet,
  GlobeLock,
  Workflow,
  Network,
  Award,
  Crown,
  Trophy,
  Landmark as LandmarkIcon,
  Building2,
  HeartPulse,
  Syringe,
  Pill,
  Stethoscope,
  Radio,
  Satellite,
  Gauge,
  Magnet,
  Sun,
  Moon,
  CloudRain,
  Wind,
  Droplets,
  Milestone,
  MapPin,
  Map as LucideMapIcon,
  Layers,
  Presentation,
  Lightbulb as LightbulbIcon,
  Train,
  Ship,
  HelpCircle,
  Dices,
  Box,
  Users,
  UserCheck,
  Wheat,
  Factory,
  Wallet,
  Vote,
  Fingerprint,
  Eye,
  ShieldAlert,
  HelpCircle as QuestionIcon,
  Palette,
  // 25 Subjects Rich Icon Set
  Type,
  BookA,
  NotebookTabs,
  WholeWord,
  TextCursor,
  Pilcrow,
  CaseSensitive,
  Brackets,
  BookOpenText,
  Quote,
  Notebook,
  PenLine,
  BookCopy,
  BadgeCheck,
  ScrollText,
  Theater,
  SquareFunction,
  ChartNoAxesColumn,
  Brain,
  Puzzle,
  Blocks,
  Route,
  ScanSearch,
  GitBranch,
  Waypoints,
  MapPinned,
  Earth,
  Handshake,
  Plane,
  Telescope,
  TestTube,
  TestTubes,
  Orbit,
  Thermometer,
  Leaf,
  Radiation,
  Monitor,
  Computer,
  Microchip,
  Server,
  Navigation,
  TreePine,
  Recycle,
  CloudSun,
  Flower,
  Flower2,
  Biohazard,
  Siren,
  CloudLightning,
  LifeBuoy,
  Ambulance,
  Cross,
  HeartHandshake,
  HandHeart,
  Heart,
  Smile,
  Gem,
  ThumbsUp,
  FileCheck,
  ClipboardCheck,
  Gavel,
  Newspaper,
  Rss,
  Megaphone,
  CalendarDays,
  Tv,
  Podcast,
  MessageSquareMore,
  CircleHelp,
  Castle,
  Swords,
  Hourglass,
  Clock3,
  BookCheck,
  Banknote,
  CreditCard,
  WalletCards,
  Receipt,
  ChartNoAxesCombined,
  PiggyBank,
  Vault,
  BadgeDollarSign,
  HandCoins,
  Tractor,
  Shovel,
  Apple,
  Warehouse,
  Dumbbell,
  Volleyball,
  Bike,
  Goal,
  FlagTriangleRight,
  Volume2,
  LogIn,
  LogOut,
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  ListOrdered,
  Highlighter,
  Minus,
  Code,
  Edit3,
  Underline
} from 'lucide-react';
import { CustomSelect } from './components/CustomSelect';
import { TopicDetailsDrawer } from './components/TopicDetailsDrawer';
import { CardTopicHeader } from './components/CardTopicHeader';
import { SettingsModal } from './components/SettingsModal';
import { ShortcutsAndGuideModal } from './components/ShortcutsAndGuideModal';
import { AuthModal } from './components/AuthModal';
import { UserProfilePopover } from './components/UserProfilePopover';
import { EditProfileModal } from './components/EditProfileModal';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import { auth, onAuthStateChanged, getRedirectResult, logoutUser, sendPasswordReset, User as FirebaseUser } from './firebase';
import { saveUserDataToCloud, fetchUserDataFromCloud, subscribeToCloudData } from './utils/firestoreSync';
import { TopicCelebrationModal, CelebrationTopicData } from './components/TopicCelebrationModal';
import { TodaysGoalPopover, WorkspaceGoalStat, GoalTaskItem, formatGoalDuration, getMotivationalMessage } from './components/TodaysGoalPopover';
import { GoalCelebrationModal } from './components/GoalCelebrationModal';
import { StreakPopover } from './components/StreakPopover';
import { FloatingStudyTimer, ActiveStudyTimerSession, formatTimerClock } from './components/FloatingStudyTimer';
import { triggerMilestoneNotificationAndVibrate } from './components/TopicDetailsDrawer';
import { loadStreakData, recordDailyGoalAchieved, StreakData } from './utils/streakManager';
import { UserSettings, StandaloneTask, JobCircularItem, DeletedJobCircularItem } from './types';
import { useLongPress } from './hooks/useLongPress';
import { soundManager } from './utils/audio';
import { triggerMiniTaskConfetti, triggerTopicCompleteCelebration } from './utils/confetti';
import { applyTheme, getInitialTheme, getInitialAccentColor, ThemeMode, resolveEffectiveTheme } from './utils/themeManager';
import { SmartTopicStudioModal } from './components/SmartTopicStudioModal';
import { detectLinkType } from './utils/studioMarkdownParser';
import { GlobalModalsHub } from './components/GlobalModalsHub';
import { WorkspaceHeader } from './components/WorkspaceHeader';
import { WorkspaceMetricsBanner } from './components/WorkspaceMetricsBanner';
import { SmartTopicGeneratorBanner } from './components/SmartTopicGeneratorBanner';
import { TopicsCanvas } from './components/TopicsCanvas';
import { AppSidebar } from './components/AppSidebar';

// Dynamic Lazy-Loaded Heavy Studio Modules for Instant App Boot
const AnalyticsStudio = React.lazy(() => import('./components/AnalyticsStudio').then(m => ({ default: m.AnalyticsStudio })));
const NotesStudio = React.lazy(() => import('./components/NotesStudio').then(m => ({ default: m.NotesStudio })));
const SearchView = React.lazy(() => import('./components/SearchView').then(m => ({ default: m.SearchView })));
const RecycleBinStudio = React.lazy(() => import('./components/RecycleBinStudio').then(m => ({ default: m.RecycleBinStudio })));
const TasksStudio = React.lazy(() => import('./components/TasksStudio').then(m => ({ default: m.TasksStudio })));
const JobCircularStudio = React.lazy(() => import('./components/JobCircularStudio').then(m => ({ default: m.JobCircularStudio })));
const LandingPage = React.lazy(() => import('./components/LandingPage').then(m => ({ default: m.LandingPage })));
import { ToastContainer } from './components/ToastContainer';

// Custom Reorder Workspaces SVG Icon (Up Chevron + Middle Bar + Down Chevron)
const ReorderWorkspacesIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 7l6-5 6 5" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <path d="M6 17l6 5 6-5" />
  </svg>
);

// Interfaces
export interface NoteItem {
  id: string;
  text: string;
  date: string;
  isPinned?: boolean;
}

export interface StudyNote {
  id: string;
  title: string;
  content: string;
  workspaceId?: string;
  color?: 'default' | 'amber' | 'blue' | 'emerald' | 'purple' | 'rose';
  isPinned?: boolean;
  createdAt: number;
  updatedAt: number;
}

export function formatNoteRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
  const d = new Date(timestamp);
  const dateStr = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  const timeStr = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true });
  return `${dateStr}, ${timeStr}`;
}

export function getNoteDisplayTitle(note: StudyNote): string {
  if (note.title && note.title.trim()) {
    return note.title.trim();
  }
  if (note.content && note.content.trim()) {
    const firstLine = note.content.trim().split('\n')[0] || '';
    const cleanLine = firstLine.replace(/^(#+\s*|-\s*\[[ xX]\]\s*|[-*]\s*|\d+\.\s*|>\s*)/, '').trim();
    if (cleanLine) {
      return cleanLine.length > 60 ? `${cleanLine.substring(0, 60)}...` : cleanLine;
    }
  }
  return 'Untitled Note';
}

// Helper for inline markdown: **bold**, *italic*, ~~strike~~, ==highlight==, `code`
export const formatInlineMarkdown = (text: string): React.ReactNode => {
  if (!text) return '';

  const regex = /(\*\*.*?\*\*|==.*?==|~~.*?~~|\*.*?\*|`.*?`)/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return <strong key={index} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('==') && part.endsWith('==') && part.length >= 4) {
      return (
        <mark key={index} className="bg-amber-100/90 text-amber-950 px-1 py-0.5 rounded font-medium shadow-3xs">
          {part.slice(2, -2)}
        </mark>
      );
    }
    if (part.startsWith('~~') && part.endsWith('~~') && part.length >= 4) {
      return <del key={index} className="line-through text-slate-400">{part.slice(2, -2)}</del>;
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      return <em key={index} className="italic text-slate-700">{part.slice(1, -1)}</em>;
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code key={index} className="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
};

export const renderStudyNoteMarkdown = (
  content: string,
  onToggleCheckbox: (lineIdx: number) => void,
  onStartEditing?: () => void
) => {
  if (!content.trim()) {
    return (
      <div
        onClick={onStartEditing}
        className="py-16 text-center text-slate-400 font-sans text-xs flex flex-col items-center justify-center gap-2 cursor-text hover:bg-slate-100/50 rounded-xl transition-colors select-none"
      >
        <Edit3 className="w-6 h-6 text-slate-300 stroke-[1.5]" />
        <p className="font-semibold text-slate-600">Note is empty</p>
        <p className="text-[11.5px] text-slate-400">Tap anywhere to start typing...</p>
      </div>
    );
  }

  const lines = content.split('\n');

  return (
    <div
      onClick={onStartEditing}
      className="space-y-1 font-sans text-[14px] sm:text-[15px] leading-relaxed text-slate-800 select-text cursor-text min-h-[300px]"
    >
      {lines.map((line, idx) => {
        // Horizontal Rule
        if (/^(\s*[-*_]\s*){3,}$/.test(line)) {
          return <hr key={idx} className="my-4 border-slate-200" />;
        }

        // H1
        if (line.startsWith('# ')) {
          return (
            <h1 key={idx} className="font-serif text-2xl font-bold text-slate-900 mt-4 mb-2 pb-1 border-b border-slate-100">
              {formatInlineMarkdown(line.substring(2))}
            </h1>
          );
        }

        // H2
        if (line.startsWith('## ')) {
          return (
            <h2 key={idx} className="font-serif text-xl font-bold text-slate-800 mt-3 mb-1.5">
              {formatInlineMarkdown(line.substring(3))}
            </h2>
          );
        }

        // H3
        if (line.startsWith('### ')) {
          return (
            <h3 key={idx} className="font-serif text-lg font-semibold text-slate-800 mt-2.5 mb-1">
              {formatInlineMarkdown(line.substring(4))}
            </h3>
          );
        }

        // Blockquote
        if (line.startsWith('> ')) {
          return (
            <blockquote key={idx} className="border-l-4 border-[#2563EB]/60 pl-3 py-1 bg-blue-50/40 text-slate-700 rounded-r-md my-1.5 italic text-[13.5px]">
              {formatInlineMarkdown(line.substring(2))}
            </blockquote>
          );
        }

        // Checklist Item
        const checkMatch = line.match(/^(\s*)-\s\[([ xX])\]\s(.*)$/);
        if (checkMatch) {
          const isChecked = checkMatch[2].toLowerCase() === 'x';
          const text = checkMatch[3];
          return (
            <div
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                onToggleCheckbox(idx);
              }}
              className="flex items-start gap-2.5 py-1 px-1 rounded-md hover:bg-slate-100/60 transition-colors cursor-pointer group select-none"
            >
              <button
                type="button"
                className={`mt-1 w-4 h-4 rounded flex items-center justify-center border transition-all ${
                  isChecked
                    ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-3xs'
                    : 'border-slate-300 bg-white group-hover:border-slate-400'
                }`}
              >
                {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
              </button>
              <span className={`flex-1 select-text ${isChecked ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}`}>
                {formatInlineMarkdown(text)}
              </span>
            </div>
          );
        }

        // Bullet Item
        const bulletMatch = line.match(/^(\s*)[-*]\s(.*)$/);
        if (bulletMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 py-0.5 pl-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-2 shrink-0" />
              <span className="flex-1">{formatInlineMarkdown(bulletMatch[2])}</span>
            </div>
          );
        }

        // Numbered Item
        const numMatch = line.match(/^(\s*)(\d+)\.\s(.*)$/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 py-0.5 pl-2">
              <span className="font-semibold text-xs text-[#2563EB] mt-1 shrink-0 w-4">{numMatch[2]}.</span>
              <span className="flex-1">{formatInlineMarkdown(numMatch[3])}</span>
            </div>
          );
        }

        // Blank line
        if (!line.trim()) {
          return <div key={idx} className="h-2.5" />;
        }

        return (
          <p key={idx} className="py-0.5 leading-relaxed">
            {formatInlineMarkdown(line)}
          </p>
        );
      })}
    </div>
  );
};

/**
 * Intelligent Bangla & English Grapheme Cluster Initial Extractor
 * Extracts complete consonant conjuncts with vowel signs (kar) and modifiers:
 * e.g., "রোজ" -> "রো", "জ্ঞানী" -> "জ্ঞা", "বিজ্ঞান" -> "বি", "স্কুল" -> "স্কু", "Math" -> "M"
 */
export function getWorkspaceInitial(name: string): string {
  if (!name || !name.trim()) return 'W';
  const trimmed = name.trim();

  // If first character is Bengali
  if (/[\u0980-\u09FF]/.test(trimmed)) {
    const banglaGraphemeRegex = /^([\u0985-\u09B9\u09CE\u09DC-\u09DF](\u09CD[\u0985-\u09B9\u09DC-\u09DF])*[\u09BE-\u09CC\u09D7\u0981-\u0983]?)/u;
    const match = trimmed.match(banglaGraphemeRegex);
    if (match && match[1]) {
      return match[1];
    }
  }

  return trimmed.charAt(0).toUpperCase();
}

export interface ResourceLink {
  id: string;
  title: string;
  url: string;
  type?: 'drive' | 'facebook' | 'youtube' | 'chrome' | 'pdf';
}

export interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskItem {
  id: string;
  title: string;
  completed: boolean;
  date: string;
  time: string;
  completedAt?: string;
  completedAtTime?: number;
  description?: string;
  priority?: 'high' | 'medium' | 'low' | 'none';
  dueDate?: string;
  timeSpentMinutes?: number;
  timeSpentSeconds?: number;
  studySessions?: Array<{ id: string; timestamp: number; durationSeconds: number }>;
  lastStudyDate?: string;
  confidence?: 'mastered' | 'high' | 'medium' | 'low' | 'none';
  notes?: NoteItem[];
  links?: ResourceLink[];
  subtasks?: ChecklistItem[];
}

export interface Topic {
  id: string;
  title: string;
  section: string;
  expanded: boolean;
  isPinned?: boolean;
  tasks: TaskItem[];
  workspaceId: string;
  notes?: NoteItem[];
  links?: ResourceLink[];
  customColor?: string;
  customIcon?: string;
  createdAt?: string;
}

export interface WorkspaceWindow {
  id: string;
  name: string;
  isPinned?: boolean;
  pinnedAt?: number;
}

// Animated Number Component for Smooth Counter Transitions
function AnimatedNumber({ value, duration = 400, prefix = '', suffix = '' }: { value: number; duration?: number; prefix?: string; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(value);
  const previousValueRef = useRef(value);

  useEffect(() => {
    const startVal = previousValueRef.current;
    const endVal = value;
    if (startVal === endVal) {
      setDisplayValue(endVal);
      return;
    }

    let startTime: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + (endVal - startVal) * eased);
      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        previousValueRef.current = endVal;
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(animationFrameId);
      previousValueRef.current = endVal;
    };
  }, [value, duration]);

  return <span>{prefix}{displayValue}{suffix}</span>;
}

function playNotificationAudioChime() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    // Tone 1: 587.33 Hz (D5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);
    gain1.gain.setValueAtTime(0.35, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.45);

    // Tone 2: 880 Hz (A5)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.2);
    gain2.gain.setValueAtTime(0.45, now + 0.2);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.2);
    osc2.stop(now + 0.85);
  } catch (e) {
    console.debug('Audio chime error:', e);
  }
}

export interface SectionItem {
  id: string;
  workspaceId: string;
  name: string;
}

export const LongPressItem: React.FC<{
  onLongPress: () => void;
  onClick?: (e?: any) => void;
  className?: string;
  children: React.ReactNode;
  [key: string]: any;
}> = ({ onLongPress, onClick, className, children, ...restProps }) => {
  const { handlers, ripple, isPressed } = useLongPress({
    threshold: 380,
    onLongPress,
    onClick,
  });

  return (
    <div
      {...handlers}
      {...restProps}
      className={`relative overflow-hidden transition-colors duration-150 ${
        isPressed ? 'bg-slate-100/60' : ''
      } ${className || ''}`}
    >
      {children}
      {ripple && (
        <motion.span
          key={ripple.key}
          initial={{ scale: 0, opacity: 0.45 }}
          animate={{ scale: 4.2, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="absolute w-24 h-24 bg-blue-500/25 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 z-40"
          style={{ left: ripple.x, top: ripple.y }}
        />
      )}
    </div>
  );
};

export function App() {

  

  // --- LocalStorage Helpers ---
  const loadInitialData = <T,>(key: string, fallback: T): T => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : fallback;
    } catch {
      return fallback;
    }
  };



  // --- Workspaces State ---
  const [workspaces, setWorkspaces] = useState<WorkspaceWindow[]>(() =>
    loadInitialData('studyflow_workspaces', [
      { id: '1', name: 'Workspace' }
    ])
  );
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>(() =>
    loadInitialData('studyflow_active_workspace', '1')
  );

  useEffect(() => {
    localStorage.setItem('studyflow_workspaces', JSON.stringify(workspaces));
  }, [workspaces]);

  useEffect(() => {
    localStorage.setItem('studyflow_active_workspace', JSON.stringify(activeWorkspaceId));
    if (activeWorkspaceId) {
      const desktopEl = document.getElementById(`sidebar-workspace-${activeWorkspaceId}`);
      if (desktopEl) {
        desktopEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
      const mobileEl = document.getElementById(`mobile-sidebar-workspace-${activeWorkspaceId}`);
      if (mobileEl) {
        mobileEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [activeWorkspaceId]);

  // Workspaces sorted so pinned workspaces are always at the top, preserving master custom order
  const sortedWorkspaces = useMemo(() => {
    return [...workspaces].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });
  }, [workspaces]);

  // --- Workspace Reordering State & Handlers ---
  const [isReorderingWorkspaces, setIsReorderingWorkspaces] = useState<boolean>(false);
  const [reorderSnapshot, setReorderSnapshot] = useState<WorkspaceWindow[] | null>(null);
  const [draggedWsIdx, setDraggedWsIdx] = useState<number | null>(null);
  const [dragOverWsIdx, setDragOverWsIdx] = useState<number | null>(null);
  const touchCurrentIdx = useRef<number | null>(null);

  const startReorderingWorkspaces = () => {
    setReorderSnapshot([...workspaces]);
    setIsReorderingWorkspaces(true);
  };

  const handleDoneReorder = () => {
    setIsReorderingWorkspaces(false);
    setReorderSnapshot(null);
    setDraggedWsIdx(null);
    setDragOverWsIdx(null);
    localStorage.setItem('studyflow_workspaces', JSON.stringify(workspaces));
    showToast('Workspaces reordered successfully');
  };

  const handleCancelReorder = () => {
    if (reorderSnapshot) {
      setWorkspaces(reorderSnapshot);
      localStorage.setItem('studyflow_workspaces', JSON.stringify(reorderSnapshot));
    }
    setIsReorderingWorkspaces(false);
    setReorderSnapshot(null);
    setDraggedWsIdx(null);
    setDragOverWsIdx(null);
  };

  const handleMoveWorkspace = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= workspaces.length || fromIndex === toIndex) return;
    setWorkspaces(prev => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      localStorage.setItem('studyflow_workspaces', JSON.stringify(next));
      return next;
    });
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedWsIdx(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverWsIdx !== index) {
      setDragOverWsIdx(index);
    }
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedWsIdx !== null && draggedWsIdx !== targetIndex) {
      handleMoveWorkspace(draggedWsIdx, targetIndex);
    }
    setDraggedWsIdx(null);
    setDragOverWsIdx(null);
  };

  const handleDragEnd = () => {
    setDraggedWsIdx(null);
    setDragOverWsIdx(null);
  };

  const handleTouchStart = (e: React.TouchEvent, index: number) => {
    touchCurrentIdx.current = index;
    setDraggedWsIdx(index);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchCurrentIdx.current === null) return;
    const touch = e.touches[0];
    const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
    const itemEl = targetElement?.closest('[data-reorder-index]');
    if (itemEl) {
      const targetIdx = parseInt(itemEl.getAttribute('data-reorder-index') || '-1', 10);
      if (targetIdx !== -1 && targetIdx !== dragOverWsIdx) {
        setDragOverWsIdx(targetIdx);
      }
    }
  };

  const handleTouchEnd = () => {
    if (touchCurrentIdx.current !== null && dragOverWsIdx !== null && touchCurrentIdx.current !== dragOverWsIdx) {
      handleMoveWorkspace(touchCurrentIdx.current, dragOverWsIdx);
    }
    touchCurrentIdx.current = null;
    setDraggedWsIdx(null);
    setDragOverWsIdx(null);
  };

  // --- Sidebar Collapse ---
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  // --- User Settings State ---
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [userSettings, setUserSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('studyflow_user_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          theme: parsed.theme || getInitialTheme(),
          primaryColor: parsed.primaryColor || getInitialAccentColor(),
        };
      } catch {
        // fallback
      }
    }
    return {
      dailyTarget: 10,
      dailyGoalMode: 'tasks',
      dailyTimeTargetMinutes: 120,
      autoSync: true,
      soundEffects: true,
      focusCheckIntervalMinutes: 20,
      focusCheckIntervalEnabled: true,
      theme: getInitialTheme(),
      primaryColor: getInitialAccentColor(),
    };
  });

  // Apply active theme (light/dark/system) and primary accent color dynamically
  useEffect(() => {
    const cleanup = applyTheme(userSettings.theme || 'light', userSettings.primaryColor || 'blue');
    return cleanup;
  }, [userSettings.theme, userSettings.primaryColor]);

  const ACCENT_COLOR_OPTIONS: Array<{ id: PrimaryAccentColor; label: string; color: string }> = [
    { id: 'blue', label: 'Electric Blue', color: '#2563EB' },
    { id: 'green', label: 'Emerald Green', color: '#059669' },
    { id: 'purple', label: 'Indigo Purple', color: '#7C3AED' },
    { id: 'orange', label: 'Crimson Red', color: '#DC2626' },
    { id: 'amber', label: 'Amber Gold', color: '#EA580C' },
    { id: 'pink', label: 'Rose Pink', color: '#E11D48' },
    { id: 'cyan', label: 'Cyan Ocean', color: '#0891B2' },
  ];

  const getWorkspaceAmbientGlow = (accent: PrimaryAccentColor | string = 'blue') => {
    switch (accent) {
      case 'green':
        return 'from-emerald-600/18 via-teal-600/[0.08]';
      case 'purple':
        return 'from-purple-600/18 via-indigo-600/[0.08]';
      case 'orange':
        return 'from-rose-600/18 via-red-600/[0.08]';
      case 'pink':
        return 'from-pink-600/18 via-rose-600/[0.08]';
      case 'cyan':
        return 'from-cyan-600/18 via-blue-600/[0.08]';
      case 'amber':
        return 'from-amber-600/18 via-orange-600/[0.08]';
      case 'blue':
      default:
        return 'from-blue-600/18 via-indigo-600/[0.08]';
    }
  };

  const [isAccentQuickPickerOpen, setIsAccentQuickPickerOpen] = useState<boolean>(false);

  const handleSelectAccentColor = (accent: PrimaryAccentColor) => {
    // 1. Instantly set attribute on HTML document for zero-latency UI update
    try {
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-accent', accent);
      }
      applyAccentColor(accent);
    } catch (e) {
      console.error('Error applying accent color to DOM:', e);
    }

    // 2. Persist to localStorage immediately
    try {
      const saved = localStorage.getItem('studyflow_user_settings');
      const parsed = saved ? JSON.parse(saved) : {};
      parsed.primaryColor = accent;
      localStorage.setItem('studyflow_user_settings', JSON.stringify(parsed));
    } catch (_) {}

    // 3. Update React userSettings state
    setUserSettings((prev) => ({
      ...prev,
      primaryColor: accent,
    }));

    // 4. Close popover immediately
    setIsAccentQuickPickerOpen(false);

    // 5. Safe non-blocking feedback sound & toast
    try {
      soundManager?.playClick?.();
    } catch (_) {}
    try {
      showToast(`Accent theme set to ${accent.charAt(0).toUpperCase() + accent.slice(1)}! 🎨`);
    } catch (_) {}
  };

  const handleToggleThemeMode = () => {
    const currentMode = userSettings.theme || (userSettings.darkMode ? 'dark' : 'light');
    const effectiveCurrent = resolveEffectiveTheme(currentMode);
    const newTheme: ThemeMode = effectiveCurrent === 'dark' ? 'light' : 'dark';

    // 1. Immediately apply to DOM
    try {
      applyTheme(newTheme, userSettings.primaryColor || 'blue');
    } catch (_) {}

    // 2. Persist & update React state
    const updatedSettings: UserSettings = {
      ...userSettings,
      theme: newTheme,
      darkMode: newTheme === 'dark',
    };

    try {
      localStorage.setItem('studyflow_user_settings', JSON.stringify(updatedSettings));
    } catch (_) {}

    setUserSettings(updatedSettings);

    try {
      soundManager?.playClick?.();
    } catch (_) {}
  };

  // Close quick accent picker on click outside
  useEffect(() => {
    if (!isAccentQuickPickerOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && !target.closest('.accent-picker-popover') && !target.closest('.accent-picker-toggle-btn')) {
        setIsAccentQuickPickerOpen(false);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [isAccentQuickPickerOpen]);

  const handleSaveSettings = (newSettings: UserSettings) => {
    setUserSettings(newSettings);
    localStorage.setItem('studyflow_user_settings', JSON.stringify(newSettings));
    showToast('Preferences saved successfully');
  };

  // --- Today's Goal Popover & Streak State ---
  const [isGoalPopoverOpen, setIsGoalPopoverOpen] = useState<boolean>(false);
  const [isStreakPopoverOpen, setIsStreakPopoverOpen] = useState<boolean>(false);
  const [isGoalCelebrationOpen, setIsGoalCelebrationOpen] = useState<boolean>(false);
  const [streakData, setStreakData] = useState<StreakData>(() => loadStreakData());
  const [latestMilestoneInfo, setLatestMilestoneInfo] = useState<{ isMilestone: boolean; title?: string; icon?: string }>({ isMilestone: false });
  const previousGoalAchievedRef = useRef<boolean>(false);

  // Exact Target Midnight Timeout + Visibility / Focus checks
  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout>;

    const scheduleMidnightCheck = () => {
      const now = new Date();
      const nextMidnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0, 0, 1
      );
      const msUntilMidnight = Math.max(1000, nextMidnight.getTime() - now.getTime());

      timerId = setTimeout(() => {
        setStreakData(loadStreakData());
        scheduleMidnightCheck();
      }, msUntilMidnight);
    };

    scheduleMidnightCheck();

    const handleVisibilityOrFocus = () => {
      setStreakData(loadStreakData());
    };

    window.addEventListener('focus', handleVisibilityOrFocus);
    document.addEventListener('visibilitychange', handleVisibilityOrFocus);

    return () => {
      clearTimeout(timerId);
      window.removeEventListener('focus', handleVisibilityOrFocus);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
    };
  }, []);

  // --- Topic 100% Completion Celebration State ---
  const [congratulationsTopic, setCongratulationsTopic] = useState<CelebrationTopicData | null>(null);

  // --- Section Tabs State & Scroll Ref ---
  const [workspaceSections, setWorkspaceSections] = useState<SectionItem[]>(() => {
    return loadInitialData<SectionItem[]>('studyflow_workspace_sections', []);
  });

  const [activeSection, setActiveSection] = useState<string | null>(() => {
    const savedSecs = loadInitialData<SectionItem[]>('studyflow_workspace_sections', []);
    const currentWsId = loadInitialData('studyflow_active_workspace', '1');
    const wsSecs = (savedSecs || []).filter(s => s.workspaceId === currentWsId);
    return wsSecs.length > 0 ? wsSecs[0].name : null;
  });

  useEffect(() => {
    localStorage.setItem('studyflow_workspace_sections', JSON.stringify(workspaceSections));
  }, [workspaceSections]);

  const currentWorkspaceSections = useMemo(() => {
    return (workspaceSections || [])
      .filter(s => s && s.workspaceId === activeWorkspaceId)
      .map(s => ({
        id: s.id || `section-${s.name || 'sec'}-${s.workspaceId || 'ws'}`,
        name: s.name || 'Section',
        workspaceId: s.workspaceId || activeWorkspaceId,
      }));
  }, [workspaceSections, activeWorkspaceId]);

  // --- Global Active Study Timer Session (Persists seamlessly across navigation, page reloads, and accidental tab closures) ---
  const initialRecoveredTimer = useMemo(() => {
    try {
      const raw = localStorage.getItem('studyflow_active_timer');
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!data.taskId || !data.topicId) return null;

      if (data.isPaused || !data.startTime) {
        return {
          session: {
            topicId: data.topicId,
            topicTitle: data.topicTitle || 'Topic',
            taskId: data.taskId,
            taskTitle: data.taskTitle || 'Task',
            workspaceId: data.workspaceId,
            seconds: data.accumulatedSeconds || 0,
            isPaused: true,
          } as ActiveStudyTimerSession,
          startTime: null as number | null,
          accumulated: data.accumulatedSeconds || 0,
        };
      } else {
        const now = Date.now();
        const elapsedSinceStart = Math.max(0, Math.floor((now - data.startTime) / 1000));
        const totalSec = (data.accumulatedSeconds || 0) + elapsedSinceStart;

        return {
          session: {
            topicId: data.topicId,
            topicTitle: data.topicTitle || 'Topic',
            taskId: data.taskId,
            taskTitle: data.taskTitle || 'Task',
            workspaceId: data.workspaceId,
            seconds: totalSec,
            isPaused: false,
          } as ActiveStudyTimerSession,
          startTime: data.startTime as number | null,
          accumulated: data.accumulatedSeconds || 0,
        };
      }
    } catch (err) {
      console.error('Failed to load active study timer from storage:', err);
      return null;
    }
  }, []);

  const [activeStudyTimer, setActiveStudyTimer] = useState<ActiveStudyTimerSession | null>(
    () => (initialRecoveredTimer ? initialRecoveredTimer.session : null)
  );
  const [isGlobalStillStudyingOpen, setIsGlobalStillStudyingOpen] = useState<boolean>(false);
  const activeMilestonePromptRef = useRef<{
    milestoneSec: number;
    milestoneTriggeredAt: number;
    isAutoPaused: boolean;
  } | null>(null);
  const timerStartTimeRef = useRef<number | null>(
    initialRecoveredTimer ? initialRecoveredTimer.startTime : null
  );
  const timerAccumulatedSecondsRef = useRef<number>(
    initialRecoveredTimer ? initialRecoveredTimer.accumulated : 0
  );
  const lastGlobalMilestoneSecRef = useRef<number>(0);

  // Helper to persist timer state changes directly to localStorage
  const saveTimerToStorage = (
    session: ActiveStudyTimerSession | null,
    startTime: number | null,
    accumulatedSeconds: number
  ) => {
    try {
      if (!session) {
        localStorage.removeItem('studyflow_active_timer');
        return;
      }
      const dataToSave = {
        topicId: session.topicId,
        topicTitle: session.topicTitle,
        taskId: session.taskId,
        taskTitle: session.taskTitle,
        workspaceId: session.workspaceId,
        startTime: session.isPaused ? null : startTime,
        accumulatedSeconds,
        isPaused: session.isPaused,
        lastSavedAt: Date.now(),
      };
      localStorage.setItem('studyflow_active_timer', JSON.stringify(dataToSave));
    } catch (err) {
      console.error('Failed to save study timer to storage:', err);
    }
  };

  // Prevent accidental tab closure or page reload data loss during live study sessions
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (activeStudyTimer && !activeStudyTimer.isPaused) {
        e.preventDefault();
        e.returnValue = 'You have an active study timer running. Are you sure you want to leave?';
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [activeStudyTimer?.isPaused, Boolean(activeStudyTimer)]);

  // Active drawer task state to dynamically show floating timer when navigating across tasks/tabs
  const [drawerActiveTaskState, setDrawerActiveTaskState] = useState<{
    selectedTaskId: string | null;
    activeTab: string;
    isViewingDetails: boolean;
    isTimeMenuOpen: boolean;
  }>({
    selectedTaskId: null,
    activeTab: 'tasks',
    isViewingDetails: true,
    isTimeMenuOpen: false,
  });
  const [requestedFocusTaskId, setRequestedFocusTaskId] = useState<string | null>(null);
  const [drawerNavigationTarget, setDrawerNavigationTarget] = useState<{
    headerTab?: 'tasks' | 'notes' | 'files' | 'activity';
    taskSubTab?: 'details' | 'notes' | 'links' | 'files' | 'checklist' | 'subtasks';
    taskId?: string | null;
    timestamp: number;
  } | null>(null);

  // Global interval ticking for live active study timer with 60s grace milestone check & auto-rewind
  useEffect(() => {
    if (!activeStudyTimer || activeStudyTimer.isPaused) return;

    if (!timerStartTimeRef.current) {
      timerStartTimeRef.current = Date.now();
    }

    const intervalSec = Math.max(10, Math.round((userSettings.focusCheckIntervalMinutes || 20) * 60));

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsedSinceStart = Math.floor((now - timerStartTimeRef.current!) / 1000);
      const totalSec = timerAccumulatedSecondsRef.current + elapsedSinceStart;

      const currentMilestoneIndex = Math.floor(totalSec / intervalSec);
      const currentMilestoneSec = currentMilestoneIndex * intervalSec;

      // 1. Check if a new milestone has just been reached (Timer continues running during 60s grace period)
      if (
        userSettings.focusCheckIntervalEnabled !== false &&
        currentMilestoneIndex > 0 &&
        currentMilestoneSec > lastGlobalMilestoneSecRef.current
      ) {
        lastGlobalMilestoneSecRef.current = currentMilestoneSec;
        activeMilestonePromptRef.current = {
          milestoneSec: currentMilestoneSec,
          milestoneTriggeredAt: now,
          isAutoPaused: false,
        };
        setIsGlobalStillStudyingOpen(true);
        triggerMilestoneNotificationAndVibrate(
          activeStudyTimer.taskTitle || 'Study Task',
          userSettings.focusCheckIntervalMinutes || 20
        );
        setActiveStudyTimer(prev => prev ? { ...prev, seconds: totalSec } : null);
      }
      // 2. Check if 60 seconds grace period expired without user response -> Auto-Pause & Rewind to milestone
      else if (
        activeMilestonePromptRef.current &&
        !activeMilestonePromptRef.current.isAutoPaused &&
        totalSec >= activeMilestonePromptRef.current.milestoneSec + 60
      ) {
        const rewindSec = activeMilestonePromptRef.current.milestoneSec;
        activeMilestonePromptRef.current.isAutoPaused = true;
        timerAccumulatedSecondsRef.current = rewindSec;
        timerStartTimeRef.current = null;
        const autoPausedSession = { ...activeStudyTimer, seconds: rewindSec, isPaused: true };
        setActiveStudyTimer(autoPausedSession);
        saveTimerToStorage(autoPausedSession, null, rewindSec);
      } else {
        setActiveStudyTimer(prev => prev ? { ...prev, seconds: totalSec } : null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeStudyTimer?.isPaused, activeStudyTimer?.taskId, activeStudyTimer?.taskTitle, userSettings.focusCheckIntervalMinutes, userSettings.focusCheckIntervalEnabled]);

  // Periodic audio chime warning every 6s up to 10 times (60s total grace window) while prompt is active
  useEffect(() => {
    if (!isGlobalStillStudyingOpen) return;

    let chimeCount = 0;
    chimeCount++;

    const interval = setInterval(() => {
      // If user has already auto-paused after 60s, stop chime
      if (activeMilestonePromptRef.current?.isAutoPaused || chimeCount >= 10) {
        clearInterval(interval);
        return;
      }
      triggerMilestoneNotificationAndVibrate(activeStudyTimer?.taskTitle || 'Study Task', userSettings.focusCheckIntervalMinutes || 20);
      chimeCount++;
    }, 6000);

    return () => clearInterval(interval);
  }, [isGlobalStillStudyingOpen, userSettings.focusCheckIntervalMinutes, activeStudyTimer?.taskTitle]);

  // Sync browser document title when timer is running
  useEffect(() => {
    if (activeStudyTimer) {
      const { seconds, taskTitle, isPaused } = activeStudyTimer;
      const formatted = formatTimerClock(seconds);
      const icon = isPaused ? '⏸️' : '⏱️';
      const cleanTitle = taskTitle && taskTitle.length > 18 ? taskTitle.slice(0, 18) + '...' : (taskTitle || 'Task');
      document.title = `(${icon} ${formatted} • ${cleanTitle}) Study Flow`;
    } else {
      document.title = 'Study Flow';
    }
  }, [activeStudyTimer?.seconds, activeStudyTimer?.isPaused, activeStudyTimer?.taskTitle]);

  const handleStartGlobalStudyTimer = (
    topicId: string,
    topicTitle: string,
    taskId: string,
    taskTitle: string,
    workspaceId?: string
  ) => {
    const now = Date.now();
    timerStartTimeRef.current = now;
    timerAccumulatedSecondsRef.current = 0;
    lastGlobalMilestoneSecRef.current = 0;
    activeMilestonePromptRef.current = null;
    setIsGlobalStillStudyingOpen(false);
    
    const newSession: ActiveStudyTimerSession = {
      topicId,
      topicTitle,
      taskId,
      taskTitle,
      workspaceId: workspaceId || activeWorkspaceId,
      seconds: 0,
      isPaused: false,
    };
    setActiveStudyTimer(newSession);
    saveTimerToStorage(newSession, now, 0);
  };

  const handlePauseGlobalStudyTimer = () => {
    if (!activeStudyTimer || activeStudyTimer.isPaused) return;
    const now = Date.now();
    const elapsedSinceStart = timerStartTimeRef.current ? Math.floor((now - timerStartTimeRef.current) / 1000) : 0;
    const totalSec = timerAccumulatedSecondsRef.current + elapsedSinceStart;
    timerAccumulatedSecondsRef.current = totalSec;
    timerStartTimeRef.current = null;
    
    const pausedSession: ActiveStudyTimerSession = {
      ...activeStudyTimer,
      seconds: totalSec,
      isPaused: true,
    };
    setActiveStudyTimer(pausedSession);
    saveTimerToStorage(pausedSession, null, totalSec);
  };

  const handleResumeGlobalStudyTimer = () => {
    if (!activeStudyTimer) return;
    
    const now = Date.now();
    // If it was auto-paused after 60s grace period, resume fresh from the rewinded milestone seconds
    if (activeStudyTimer.isPaused) {
      timerStartTimeRef.current = now;
      const resumedSession: ActiveStudyTimerSession = {
        ...activeStudyTimer,
        isPaused: false,
      };
      setActiveStudyTimer(resumedSession);
      saveTimerToStorage(resumedSession, now, timerAccumulatedSecondsRef.current);
    }
    // If user clicked while still running inside 60s grace, it continues seamlessly without restart

    activeMilestonePromptRef.current = null;
    setIsGlobalStillStudyingOpen(false);
  };

  const handleStopAndLogGlobalStudyTimer = (targetTaskId?: string | any) => {
    if (!activeStudyTimer) return;
    const taskIdToLog = (typeof targetTaskId === 'string' ? targetTaskId : undefined) || activeStudyTimer.taskId;

    let sessionSeconds = activeStudyTimer.seconds;
    // If milestone prompt was active, log the exact milestone time (excluding grace period extra seconds)
    if (activeMilestonePromptRef.current) {
      sessionSeconds = activeMilestonePromptRef.current.milestoneSec;
    } else if (!activeStudyTimer.isPaused && timerStartTimeRef.current) {
      const now = Date.now();
      const elapsedSinceStart = Math.floor((now - timerStartTimeRef.current) / 1000);
      sessionSeconds = timerAccumulatedSecondsRef.current + elapsedSinceStart;
    }

    const topicId = activeStudyTimer.topicId;
    let savedTaskTitle = '';
    let savedSessionFormatted = '';

    setTopics(prevTopics => {
      const targetTopic = prevTopics.find(t => t.id === topicId);
      if (!targetTopic) return prevTopics;

      const targetTask = (targetTopic.tasks || []).find(tk => tk.id === taskIdToLog);
      if (!targetTask) return prevTopics;

      const previousTotalSeconds = targetTask.timeSpentSeconds ?? ((targetTask.timeSpentMinutes || 0) * 60);
      const newTotalSeconds = previousTotalSeconds + sessionSeconds;
      const newMinutes = Math.floor(newTotalSeconds / 60);

      const newSession = {
        id: `sess-${Date.now()}`,
        timestamp: Date.now(),
        durationSeconds: sessionSeconds,
      };

      const updatedTask = {
        ...targetTask,
        timeSpentSeconds: newTotalSeconds,
        timeSpentMinutes: newMinutes,
        studySessions: [...(targetTask.studySessions || []), newSession],
        lastStudyDate: new Date().toISOString(),
      };

      savedTaskTitle = targetTask.title;
      const sessionMins = Math.floor(sessionSeconds / 60);
      const sessionSecs = sessionSeconds % 60;
      savedSessionFormatted = sessionMins > 0 
        ? (sessionSecs > 0 ? `+${sessionMins}m ${sessionSecs}s` : `+${sessionMins}m`)
        : `+${sessionSecs}s`;

      return prevTopics.map(t =>
        t.id === topicId
          ? {
              ...t,
              tasks: t.tasks.map(tk => (tk.id === taskIdToLog ? updatedTask : tk)),
            }
          : t
      );
    });

    if (savedTaskTitle) {
      showToast(`Study session saved for "${savedTaskTitle}"! ${savedSessionFormatted}`);
    }

    timerStartTimeRef.current = null;
    timerAccumulatedSecondsRef.current = 0;
    lastGlobalMilestoneSecRef.current = 0;
    activeMilestonePromptRef.current = null;
    setIsGlobalStillStudyingOpen(false);
    setActiveStudyTimer(null);
    saveTimerToStorage(null, null, 0);
  };

  // Mobile drawer body scroll lock
  useEffect(() => {
    if (!sidebarCollapsed && typeof window !== 'undefined' && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarCollapsed]);

  // Global Intelligent Floating Tooltip State (Smooth Intentional Hover with 150ms delay)
  const [tooltipData, setTooltipData] = useState<{
    content: string;
    x: number;
    y: number;
    side: 'top' | 'bottom' | 'left' | 'right';
  } | null>(null);
  const tooltipTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('[data-tooltip]') as HTMLElement | null;
      if (!target) {
        if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
        setTooltipData(null);
        return;
      }
      const content = target.getAttribute('data-tooltip');
      if (!content) {
        if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
        setTooltipData(null);
        return;
      }
      const side = (target.getAttribute('data-tooltip-side') || 'top') as 'top' | 'bottom' | 'left' | 'right';

      const rect = target.getBoundingClientRect();
      let x = rect.left + rect.width / 2;
      let y = rect.top - 6;

      if (side === 'right') {
        const sidebarEl = document.querySelector('aside');
        if (sidebarEl && target.closest('aside')) {
          x = Math.round(sidebarEl.getBoundingClientRect().right) + 8;
        } else {
          x = Math.round(rect.right) + 8;
        }

        const iconEl = target.querySelector('svg') || target.querySelector('.shrink-0');
        if (iconEl) {
          const iconRect = iconEl.getBoundingClientRect();
          y = iconRect.top + iconRect.height / 2;
        } else {
          y = rect.top + rect.height / 2;
        }
      } else if (side === 'bottom') {
        x = rect.left + rect.width / 2;
        y = rect.bottom + 6;
      }

      if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
      tooltipTimerRef.current = setTimeout(() => {
        setTooltipData({ content, x, y, side });
      }, 150);
    };

    const handleMouseOut = (e: MouseEvent) => {
      const related = e.relatedTarget as HTMLElement | null;
      if (!related || !related.closest('[data-tooltip]')) {
        if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
        setTooltipData(null);
      }
    };

    const handleGlobalClick = () => {
      if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
      setTooltipData(null);
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('click', handleGlobalClick);
    document.addEventListener('mousedown', handleGlobalClick);

    return () => {
      if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('click', handleGlobalClick);
      document.removeEventListener('mousedown', handleGlobalClick);
    };
  }, []);

  // Auto-collapse sidebar ONLY when screen width actually changes across mobile breakpoint (not on virtual keyboard height changes)
  useEffect(() => {
    let lastWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      // Only trigger if horizontal screen width actually changed
      if (Math.abs(currentWidth - lastWidth) > 10) {
        if (currentWidth < 768 && lastWidth >= 768) {
          setSidebarCollapsed(true);
        }
        lastWidth = currentWidth;
      }
    };

    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setSidebarCollapsed(true);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const secs = workspaceSections.filter(s => s.workspaceId === activeWorkspaceId);
    if (secs.length > 0) {
      if (!activeSection || !secs.some(s => s.name === activeSection)) {
        setActiveSection(secs[0].name);
      }
    } else {
      setActiveSection(null);
    }
  }, [activeWorkspaceId, workspaceSections]);

  const sectionNavRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(false);

  const checkSectionScroll = () => {
    if (sectionNavRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sectionNavRef.current;
      setCanScrollLeft(scrollLeft > 4);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
    }
  };

  useEffect(() => {
    checkSectionScroll();
    const navEl = sectionNavRef.current;
    if (navEl) {
      navEl.addEventListener('scroll', checkSectionScroll);
      window.addEventListener('resize', checkSectionScroll);
    }
    return () => {
      if (navEl) navEl.removeEventListener('scroll', checkSectionScroll);
      window.removeEventListener('resize', checkSectionScroll);
    };
  }, [currentWorkspaceSections]);

  const scrollSections = (direction: 'left' | 'right') => {
    if (sectionNavRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      sectionNavRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };



  // --- Professional Notification & Toast System ---
  interface NotificationItem {
    id: string;
    title: string;
    time: string;
    read: boolean;
    type?: 'focus' | 'reminders' | 'system';
    description?: string;
    actionTarget?: {
      type: 'circular' | 'task' | 'recycle' | 'url';
      id?: string;
      extra?: any;
    };
  }
  interface ToastData {
    message: string;
    undoAction?: () => void;
    duration?: number;
  }
  interface ToastItem extends ToastData {
    id: string;
  }
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const setToastData = (t: ToastData | null) => {
    if (t && t.message) {
      showToast(t.message, t.undoAction, t.duration);
    }
  };
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => [
    { id: 'notif-1', title: 'Actionable Notification Inbox Ready', time: 'Just now', read: true, type: 'system', description: 'Important deadlines, circular expirations, and upcoming exam schedules will be listed here.' },
  ]);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState<boolean>(false);
  const [notifFilter, setNotifFilter] = useState<'all' | 'focus' | 'reminders'>('all');
  const [deviceNotifStatus, setDeviceNotifStatus] = useState<string>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });

  const handleToggleDeviceNotifications = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      showToast('⚠️ Notifications not supported on this browser.');
      return;
    }

    if (window.isSecureContext === false && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      showToast('⚠️ Mobile browsers require HTTPS. Please open with https://192.168.0.202:3000');
      return;
    }

    if (Notification.permission === 'granted') {
      try {
        playNotificationAudioChime();
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          navigator.vibrate([200, 100, 200]);
        }
        
        if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
          try {
            const reg = await navigator.serviceWorker.ready;
            await reg.showNotification('🔔 StudyFlow Notifications Active', {
              body: 'You will receive study focus milestones & task alerts on this device!',
              icon: '/favicon.ico',
              tag: 'studyflow-test'
            });
            showToast('Test notification sent to your device! 🔔');
            return;
          } catch {}
        }
        new Notification('🔔 StudyFlow Notifications Active', {
          body: 'You will receive study focus milestones & task alerts on this device!',
          icon: '/favicon.ico',
          tag: 'studyflow-test'
        });
        showToast('Test notification sent to your device! 🔔');
      } catch {
        playNotificationAudioChime();
        showToast('Test notification dispatched! 🔔');
      }
    } else if (Notification.permission === 'denied') {
      showToast('⚠️ Notifications blocked in site settings. Tap lock 🔒 in URL bar to allow.');
    } else {
      try {
        let permResult: NotificationPermission = 'default';
        try {
          const req = Notification.requestPermission();
          if (req && typeof req.then === 'function') {
            permResult = await req;
          } else {
            permResult = await new Promise((resolve) => {
              Notification.requestPermission((p) => resolve(p));
            });
          }
        } catch {
          permResult = await new Promise((resolve) => {
            Notification.requestPermission((p) => resolve(p));
          });
        }

        setDeviceNotifStatus(permResult);

        if (permResult === 'granted') {
          try {
            if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
              navigator.vibrate([200, 100, 200]);
            }
            if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
              try {
                const reg = await navigator.serviceWorker.ready;
                await reg.showNotification('🚀 Notifications Enabled!', {
                  body: 'Welcome to StudyFlow Push Alerts. Stay focused!',
                  icon: '/favicon.ico',
                  tag: 'studyflow-welcome'
                });
              } catch {
                new Notification('🚀 Notifications Enabled!', {
                  body: 'Welcome to StudyFlow Push Alerts. Stay focused!',
                  icon: '/favicon.ico',
                  tag: 'studyflow-welcome'
                });
              }
            } else {
              new Notification('🚀 Notifications Enabled!', {
                body: 'Welcome to StudyFlow Push Alerts. Stay focused!',
                icon: '/favicon.ico',
                tag: 'studyflow-welcome'
              });
            }
          } catch {}
          showToast('Device Push Notifications enabled! 🚀');
        } else if (permResult === 'denied') {
          showToast('⚠️ Notification permission denied. Tap lock 🔒 in URL bar to enable.');
        } else {
          showToast('Notification permission dismissed.');
        }
      } catch (err) {
        console.error('Request permission error:', err);
        showToast('Could not request notification permission.');
      }
    }
  };

  const unreadNotifCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  const showToast = (message: string, undoAction?: () => void, duration?: number) => {
    const effectiveDuration = duration !== undefined ? duration : (undoAction ? 6000 : 3500);
    const newId = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastItem = {
      id: newId,
      message,
      undoAction,
      duration: effectiveDuration,
    };

    setToasts((prev) => [...prev, newToast].slice(-4));

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newId));
    }, effectiveDuration);

    // Exclude noise, transient actions, routine UI updates from polluting notification panel:
    // 1. Focus timer/check-ins/milestones
    // 2. Goal / Streak changes
    // 3. Theme / Appearance / Accent changes
    // 4. Workspace / Section / Topic CRUD actions
    // 5. Transient clipboard / copy actions
    const isExcludedFromPanel = /(timer|focus|check-in|milestone|session|streak|goal|theme|accent|palette|color|workspace|section|topic|syllabus|copied|reset)/i.test(message);
    if (isExcludedFromPanel) {
      return;
    }

    // Only allow actionable & critical items: Deadlines, Due dates, Circulars, Exam dates, Security/Recycle bin
    const isActionable = /(due|overdue|deadline|exam|admit|circular|recycle|warning|alert|security|urgent)/i.test(message);
    if (!isActionable) {
      return;
    }

    const now = new Date();
    const formattedTime = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const isReminder = /due|overdue|deadline|exam|circular/i.test(message);

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: message,
      time: formattedTime,
      read: false,
      type: isReminder ? 'reminders' : 'system'
    };

    setNotifications(prev => [newNotif, ...prev]);
  };

  // Safe initial topics loader from localStorage with deduplication
  const loadInitialTopics = (): Topic[] => {
    try {
      const saved = localStorage.getItem('studyflow_topics');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      const seen = new Set<string>();
      const unique: Topic[] = [];
      for (const t of parsed) {
        if (t && t.id && !seen.has(t.id)) {
          seen.add(t.id);
          unique.push(t);
        }
      }
      return unique;
    } catch {
      return [];
    }
  };

  const [topics, setTopics] = useState<Topic[]>(loadInitialTopics);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState<boolean>(false);
  const [syncedTopics, setSyncedTopics] = useState<Topic[]>(loadInitialTopics);

  const isViewingActiveTimerTask = Boolean(
    isDetailsDrawerOpen &&
    activeStudyTimer &&
    selectedTopicId === activeStudyTimer.topicId &&
    drawerActiveTaskState.activeTab === 'tasks' &&
    drawerActiveTaskState.selectedTaskId === activeStudyTimer.taskId &&
    drawerActiveTaskState.isViewingDetails &&
    (drawerActiveTaskState.isTimeMenuOpen || false)
  );
  const isFloatingTimerVisible = Boolean(activeStudyTimer && !isViewingActiveTimerTask && !isGlobalStillStudyingOpen);

  useEffect(() => {
    if (!isDetailsDrawerOpen) {
      setSyncedTopics(topics);
    }
  }, [topics, isDetailsDrawerOpen]);
  const [deletedTopics, setDeletedTopics] = useState<Topic[]>(() =>
    loadInitialData('studyflow_deleted_topics', [])
  );
  const [deletedWorkspaces, setDeletedWorkspaces] = useState<{ workspace: WorkspaceWindow; topics: Topic[]; sections?: SectionItem[]; deletedAt?: string }[]>(() =>
    loadInitialData('studyflow_deleted_workspaces', [])
  );
  const [deletedNotes, setDeletedNotes] = useState<{ note: StudyNote; deletedAt?: string }[]>(() =>
    loadInitialData('studyflow_deleted_notes', [])
  );
  const [deletedSections, setDeletedSections] = useState<{ section: SectionItem; topics?: Topic[]; deletedAt?: string }[]>(() =>
    loadInitialData('studyflow_deleted_sections', [])
  );
  const [deletedTasks, setDeletedTasks] = useState<{ task: TaskItem; topicId: string; topicTitle: string; workspaceId: string; deletedAt?: string }[]>(() =>
    loadInitialData('studyflow_deleted_tasks', [])
  );
  const [deletedTopicNotes, setDeletedTopicNotes] = useState<{ note: NoteItem; topicId: string; topicTitle: string; workspaceId?: string; taskId?: string; taskTitle?: string; isTopicNote?: boolean; deletedAt?: string }[]>(() =>
    loadInitialData('studyflow_deleted_topic_notes', [])
  );
  const [deletedTopicLinks, setDeletedTopicLinks] = useState<{ link: ResourceLink; topicId: string; topicTitle: string; workspaceId?: string; taskId?: string; taskTitle?: string; deletedAt?: string }[]>(() =>
    loadInitialData('studyflow_deleted_topic_links', [])
  );
  const [suppressSidebarTooltip, setSuppressSidebarTooltip] = useState(false);

  useEffect(() => {
    localStorage.setItem('studyflow_deleted_workspaces', JSON.stringify(deletedWorkspaces));
  }, [deletedWorkspaces]);

  useEffect(() => {
    localStorage.setItem('studyflow_deleted_notes', JSON.stringify(deletedNotes));
  }, [deletedNotes]);

  useEffect(() => {
    localStorage.setItem('studyflow_deleted_sections', JSON.stringify(deletedSections));
  }, [deletedSections]);

  useEffect(() => {
    localStorage.setItem('studyflow_deleted_tasks', JSON.stringify(deletedTasks));
  }, [deletedTasks]);

  useEffect(() => {
    localStorage.setItem('studyflow_deleted_topic_notes', JSON.stringify(deletedTopicNotes));
  }, [deletedTopicNotes]);

  useEffect(() => {
    localStorage.setItem('studyflow_deleted_topic_links', JSON.stringify(deletedTopicLinks));
  }, [deletedTopicLinks]);

  // --- View Mode & Filter Controls ---
  const [viewMode, setViewMode] = useState<'grid-cards' | 'grid-banner' | 'list'>('grid-cards');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'in_progress' | 'not_started' | 'overdue'>('all');
  const [sortCategory, setSortCategory] = useState<'date' | 'name' | 'progress'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterDirection, setFilterDirection] = useState<number>(0);

  const handleSortSelect = (category: 'date' | 'name' | 'progress') => {
    if (sortCategory === category) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortCategory(category);
      setSortDirection(category === 'date' ? 'desc' : 'asc');
    }
  };

// --- View Layer Height Sync ---
  const cardsRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const generatorInputRef = useRef<HTMLInputElement>(null);
  const [layerHeight, setLayerHeight] = useState<number | 'auto'>('auto');

  useEffect(() => {
    if (viewMode === 'list') {
      setLayerHeight('auto');
      return;
    }
    
    const updateHeight = () => {
      if (viewMode === 'grid-cards' && cardsRef.current) {
        setLayerHeight(cardsRef.current.offsetHeight || 'auto');
      } else if (viewMode === 'grid-banner' && bannerRef.current) {
        setLayerHeight(bannerRef.current.offsetHeight || 'auto');
      } else {
        setLayerHeight('auto');
      }
    };

    updateHeight();
    
    const observer = new ResizeObserver(updateHeight);
    if (cardsRef.current) observer.observe(cardsRef.current);
    if (bannerRef.current) observer.observe(bannerRef.current);
    
    return () => observer.disconnect();
  }, [viewMode, topics, statusFilter, activeSection, sortCategory, sortDirection]);

  const handleSectionChange = (newSection: string) => {
    if (newSection === activeSection) return;
    const currentSecNames = currentWorkspaceSections.map(s => s.name);
    const currentIdx = currentSecNames.indexOf(activeSection || '');
    const newIdx = currentSecNames.indexOf(newSection);
    setFilterDirection(newIdx > currentIdx ? 1 : -1);
    setActiveSection(newSection);
  };

  const handleStatusFilterChange = (newFilter: 'all' | 'completed' | 'in_progress' | 'not_started' | 'overdue') => {
    if (newFilter === statusFilter) return;
    const filterOrder: Record<string, number> = {
      all: 0,
      completed: 1,
      in_progress: 2,
      not_started: 3,
      overdue: 4,
    };
    const currentIdx = filterOrder[statusFilter] ?? 0;
    const newIdx = filterOrder[newFilter] ?? 0;
    setFilterDirection(newIdx > currentIdx ? 1 : -1);
    setStatusFilter(newFilter);
  };

  const handleViewModeChange = (targetMode: 'grid-cards' | 'grid-banner' | 'list') => {
    let nextMode = targetMode;
    if (targetMode === 'grid-cards' && viewMode === 'grid-cards') {
      nextMode = 'grid-banner';
    } else if (targetMode === 'grid-cards' && viewMode === 'grid-banner') {
      nextMode = 'grid-cards';
    }

    if (viewMode.startsWith('grid') && nextMode === 'list') {
      // Grid (left tab) -> List (right tab): Tab moves RIGHT (→), Topic cards slide OPPOSITE (LEFT, dir = 1)
      setFilterDirection(1);
    } else if (viewMode === 'list' && nextMode.startsWith('grid')) {
      // List (right tab) -> Grid (left tab): Tab moves LEFT (←), Topic cards slide OPPOSITE (RIGHT, dir = -1)
      setFilterDirection(-1);
    } else if (viewMode === 'grid-cards' && nextMode === 'grid-banner') {
      setFilterDirection(1);
    } else if (viewMode === 'grid-banner' && nextMode === 'grid-cards') {
      setFilterDirection(-1);
    }

    setViewMode(nextMode);
  };

  useEffect(() => {
    localStorage.setItem('studyflow_topics', JSON.stringify(topics));
  }, [topics]);

  useEffect(() => {
    localStorage.setItem('studyflow_deleted_topics', JSON.stringify(deletedTopics));
  }, [deletedTopics]);

  // --- Generator State ---
  const [generatorInput, setGeneratorInput] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [highlightedTopicId, setHighlightedTopicId] = useState<string | null>(null);

  // --- Persistent View State (Workspace, Notes, Tasks, Trash, Search, Analytics, Circulars) & URL Routing ---
  const initialActiveView = (() => {
    try {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname.toLowerCase().replace(/\/$/, '');
        if (path === '/tasks') return 'tasks';
        if (path === '/notes') return 'notes';
        if (path === '/circulars' || path === '/jobs') return 'circulars';
        if (path === '/trash' || path === '/recycle-bin') return 'trash';
        if (path === '/search') return 'search';
        if (path === '/analytics') return 'analytics';
        if (path === '' || path === '/workspace' || path === '/dashboard') return 'workspace';
      }
      const saved = localStorage.getItem('studyflow_active_view');
      if (!saved) return 'workspace';
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed === 'string' && ['workspace', 'notes', 'tasks', 'trash', 'search', 'analytics', 'circulars'].includes(parsed)) {
          return parsed as 'workspace' | 'notes' | 'tasks' | 'trash' | 'search' | 'analytics' | 'circulars';
        }
      } catch {}
      if (['workspace', 'notes', 'tasks', 'trash', 'search', 'analytics', 'circulars'].includes(saved)) {
        return saved as 'workspace' | 'notes' | 'tasks' | 'trash' | 'search' | 'analytics' | 'circulars';
      }
      return 'workspace';
    } catch {
      return 'workspace';
    }
  })();

  // --- Dedicated Full-Page Global Search State ---
  const [isSearchPageOpen, setIsSearchPageOpen] = useState<boolean>(() => initialActiveView === 'search');
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  // --- Dedicated Full-Page Tasks Studio State ---
  const [isTasksPageOpen, setIsTasksPageOpen] = useState<boolean>(() => initialActiveView === 'tasks');
  const [standaloneTasks, setStandaloneTasks] = useState<StandaloneTask[]>(() =>
    loadInitialData('studyflow_standalone_tasks', [
      {
        id: 'standalone-task-welcome',
        title: 'Welcome to Daily Tasks! Check off this task to get started 🎉',
        completed: false,
        createdAt: new Date().toISOString()
      }
    ])
  );

  useEffect(() => {
    localStorage.setItem('studyflow_standalone_tasks', JSON.stringify(standaloneTasks));
  }, [standaloneTasks]);

  // --- Dedicated Full-Page Notes Studio State ---
  const [isNotesPageOpen, setIsNotesPageOpen] = useState<boolean>(() => initialActiveView === 'notes');
  const [notes, setNotes] = useState<StudyNote[]>(() =>
    loadInitialData('studyflow_notes', [
      {
        id: 'note-welcome-guide',
        title: 'Welcome to Notes Studio — User Guide & Shortcuts',
        content: `<h1>Notes Studio — Pro User Guide & Shortcuts</h1><p class="text-slate-600 leading-relaxed">Welcome to your distraction-free, professional study notepad! Here is everything you can do to supercharge your note-taking experience.</p><hr class="my-4 border-slate-200" /><h2>⌨️ 1. Essential Keyboard Shortcuts</h2><ul class="list-disc list-inside my-1.5 space-y-1"><li><b>Numbered List:</b> <code class="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70">Alt + N</code> — Start or toggle a numbered list (<ol class="list-decimal list-inside ml-5 my-1"><li>Item 1</li><li>Item 2</li></ol>)</li><li><b>Bullet List:</b> <code class="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70">Alt + B</code> — Start or toggle a bullet list</li><li><b>Heading 1:</b> <code class="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70">Alt + 1</code></li><li><b>Heading 2:</b> <code class="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70">Alt + 2</code></li><li><b>Heading 3:</b> <code class="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70">Alt + 3</code></li><li><b>Inline Code / Formula:</b> <code class="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70">Ctrl + E</code> or <code class="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70">Ctrl + \`</code></li><li><b>Bold:</b> <code class="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70">Ctrl + B</code> | <b>Italic:</b> <code class="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70">Ctrl + I</code></li><li><b>Quote Block:</b> <code class="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70">Ctrl + Q</code></li><li><b>Insert / Edit Link:</b> <code class="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70">Ctrl + K</code></li><li><b>Strikethrough:</b> <code class="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70">Ctrl + Shift + X</code></li><li><b>Highlighter:</b> <code class="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70">Ctrl + Shift + H</code></li></ul><hr class="my-4 border-slate-200" /><h2>🪄 2. Live Markdown Auto-Formatting</h2><p class="leading-relaxed my-1">Turn on the <b>🪄 Markdown</b> icon in your toolbar to format as you type:</p><ul class="list-disc list-inside my-1.5 space-y-1"><li>Type <code class="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70">**bold**</code> ➔ <b>bold</b></li><li>Type <code class="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70">\`Y = 200px\`</code> ➔ <code class="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70">Y = 200px</code></li><li>Type <code class="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70">==highlight==</code> ➔ <mark class="bg-amber-100 text-amber-950 px-1 py-0.5 rounded">highlight</mark></li><li>Type <code class="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70">~~strike~~</code> ➔ <del class="text-slate-400">strike</del></li><li>Type <code class="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70"># + Space</code> ➔ Heading 1 | <code class="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70">## + Space</code> ➔ Heading 2</li><li>Type <code class="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70">- + Space</code> ➔ Bullet List | <code class="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70">1. + Space</code> ➔ Numbered List</li><li>Type <code class="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70">&gt; + Space</code> ➔ Quote block</li><li>Type <code class="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70">[] + Space</code> ➔ Interactive Task Checkbox</li><li>Type <code class="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70">--- + Space</code> ➔ Horizontal Divider</li></ul><hr class="my-4 border-slate-200" /><h2>📋 3. Interactive Checklists</h2><div class="checklist-item flex items-start gap-2 py-1 my-0.5 cursor-pointer select-none" data-checked="true"><span class="chk-box mt-1 w-4 h-4 rounded border flex items-center justify-center text-xs shrink-0 bg-[#2563EB] border-[#2563EB] text-white font-bold">✓</span><span class="chk-text flex-1 select-text line-through text-slate-400">Review Notes Studio features</span></div><div class="checklist-item flex items-start gap-2 py-1 my-0.5 cursor-pointer select-none" data-checked="false"><span class="chk-box mt-1 w-4 h-4 rounded border border-slate-300 bg-white flex items-center justify-center text-xs shrink-0"></span><span class="chk-text flex-1 select-text text-slate-800">Try creating your first custom study note</span></div><div class="checklist-item flex items-start gap-2 py-1 my-0.5 cursor-pointer select-none" data-checked="false"><span class="chk-box mt-1 w-4 h-4 rounded border border-slate-300 bg-white flex items-center justify-center text-xs shrink-0"></span><span class="chk-text flex-1 select-text text-slate-800">Use Quick Copy to export notes to Notion or ChatGPT</span></div><hr class="my-4 border-slate-200" /><h2>💬 4. Pro Tips & Quoting</h2><blockquote class="border-l-4 border-[#2563EB]/60 pl-3 py-1 bg-blue-50/40 text-slate-700 rounded-r-md my-2 italic">"Knowledge is power. Information is liberating. Education is the premise of progress, in every society, in every family." — Kofi Annan</blockquote><p class="text-xs text-slate-500 mt-2">💡 <i>Tip: Click anywhere in Preview mode to instantly jump into editing at that exact character!</i></p>`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isPinned: true,
        color: 'blue'
      }
    ])
  );

  useEffect(() => {
    localStorage.setItem('studyflow_notes', JSON.stringify(notes));
  }, [notes]);

  // --- Dedicated Full-Page Job Circulars Studio State ---
  const [isJobCircularsOpen, setIsJobCircularsOpen] = useState<boolean>(() => initialActiveView === 'circulars');
  const [jobCirculars, setJobCirculars] = useState<JobCircularItem[]>(() =>
    loadInitialData('studyflow_job_circulars', [
      {
        id: 'circular-sample-1',
        jobTitle: 'Assistant Director (General)',
        organization: 'Bangladesh Bank',
        category: 'govt',
        grade: '9th Grade',
        scale: '22,000 - 53,060',
        jobType: 'Permanent Full-time',
        dueDate: '2026-10-15',
        applicationFee: 'BDT 200',
        stage: 'applied',
        examDate: '2026-11-20',
        examTime: '10:00 AM - 11:00 AM',
        examVenue: 'Dhaka University Campus',
        credentials: {
          applicantName: 'Applicant',
          userId: 'BB-AD-2026-9874',
          password: '••••••••',
          rollNumber: '104859',
        },
        attachments: [
          {
            id: 'att-1',
            name: 'Official_Circular_BB_AD.pdf',
            type: 'circular',
            size: '1.2 MB',
            uploadedAt: '2026-09-01',
          }
        ],
        notes: 'Review Bengali literature and Bangladesh affairs specifically monetary policy.',
        createdAt: '2026-09-01T10:00:00.000Z',
        updatedAt: '2026-09-01T10:00:00.000Z',
      },
      {
        id: 'circular-sample-2',
        jobTitle: 'Senior Officer (General)',
        organization: 'Sonali Bank PLC',
        category: 'bank',
        grade: '9th Grade',
        scale: '22,000 - 53,060',
        jobType: 'Banking Permanent',
        dueDate: '2026-09-30',
        applicationFee: 'BDT 200',
        stage: 'not_applied',
        credentials: {},
        attachments: [],
        createdAt: '2026-09-05T12:00:00.000Z',
        updatedAt: '2026-09-05T12:00:00.000Z',
      }
    ])
  );

  const [deletedJobCirculars, setDeletedJobCirculars] = useState<DeletedJobCircularItem[]>(() =>
    loadInitialData('studyflow_deleted_job_circulars', [])
  );

  useEffect(() => {
    try {
      // Safeguard: Ensure no large data URLs / Base64 sneak into localStorage
      const safeJobCirculars = jobCirculars.map(c => ({
        ...c,
        attachments: (c.attachments || []).map(att => ({
          ...att,
          // If any legacy local base64 url exists, do not blow up localStorage quota
          url: att.url?.startsWith('data:') ? '' : att.url
        }))
      }));
      localStorage.setItem('studyflow_job_circulars', JSON.stringify(safeJobCirculars));
    } catch (err) {
      console.warn('Could not persist job circulars to localStorage quota:', err);
    }
  }, [jobCirculars]);

  useEffect(() => {
    try {
      const safeDeleted = deletedJobCirculars.map(d => ({
        ...d,
        circular: {
          ...d.circular,
          attachments: (d.circular?.attachments || []).map(att => ({
            ...att,
            url: att.url?.startsWith('data:') ? '' : att.url
          }))
        }
      }));
      localStorage.setItem('studyflow_deleted_job_circulars', JSON.stringify(safeDeleted));
    } catch (err) {
      console.warn('Could not persist deleted job circulars to localStorage quota:', err);
    }
  }, [deletedJobCirculars]);

  // --- Automated Background Deadline & Exam Checker (Runs at most once per 6 hours, ZERO render overhead) ---
  useEffect(() => {
    try {
      const LAST_CHECK_KEY = 'studyflow_last_deadline_check';
      const lastCheck = localStorage.getItem(LAST_CHECK_KEY);
      const nowTime = Date.now();
      const SIX_HOURS_MS = 6 * 60 * 60 * 1000;

      // Skip if already checked within 6 hours to prevent re-calling/re-rendering
      if (lastCheck && nowTime - parseInt(lastCheck, 10) < SIX_HOURS_MS) {
        return;
      }
      localStorage.setItem(LAST_CHECK_KEY, nowTime.toString());

      const todayStr = new Date().toISOString().split('T')[0];
      const urgentNotifications: NotificationItem[] = [];

      // Helper to dispatch browser push notification if permitted
      const sendPushNotification = (title: string, body: string) => {
        if ('Notification' in window && Notification.permission === 'granted') {
          try {
            new Notification(title, {
              body,
              icon: '/favicon.ico',
            });
          } catch {
            // Safe fallback
          }
        }
      };

      // 1. Check Job Circulars Deadlines & Upcoming Exams
      if (Array.isArray(jobCirculars)) {
        jobCirculars.forEach((job) => {
          // If stage is 'applied' or beyond, DEADLINE notification is inactive (muted)
          // Only trigger deadline alerts when stage === 'not_applied'
          if (job.applicationDeadline && job.stage === 'not_applied') {
            const deadlineDate = new Date(job.applicationDeadline);
            const todayDate = new Date(todayStr);
            const diffDays = Math.ceil((deadlineDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24));

            // Alert 3 days before deadline (diffDays: 3, 2, 1, 0)
            if (diffDays >= 0 && diffDays <= 3) {
              const notifTitle = diffDays === 0
                ? `🚨 Last Chance: Apply Today for ${job.jobTitle}`
                : `⏰ Deadline Alert (${diffDays} days left): ${job.jobTitle}`;
              const notifDesc = `${job.organization} — Application deadline is ${job.applicationDeadline}. Apply before it closes!`;

              urgentNotifications.push({
                id: `auto-circ-dl-${job.id}-${todayStr}`,
                title: notifTitle,
                time: '6h Scheduled Alert',
                read: false,
                type: 'reminders',
                description: notifDesc,
                actionTarget: {
                  type: 'circular',
                  id: job.id
                }
              });

              // Send browser push notification every 6 hours
              sendPushNotification(notifTitle, notifDesc);
            }
          }

          // Check declared exam date (7 days before exam date, daily once)
          if (job.examDate) {
            const examDateObj = new Date(job.examDate);
            const todayDate = new Date(todayStr);
            const diffDays = Math.ceil((examDateObj.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24));

            // Alert 7 days before exam date (diffDays: 7, 6, 5, 4, 3, 2, 1, 0)
            if (diffDays >= 0 && diffDays <= 7) {
              const LAST_EXAM_NOTIF_KEY = `studyflow_last_exam_notif_${job.id}_${todayStr}`;
              const alreadyNotifiedToday = localStorage.getItem(LAST_EXAM_NOTIF_KEY);

              const notifTitle = diffDays === 0
                ? `🎯 Exam Today: ${job.jobTitle}`
                : diffDays === 1
                ? `🎫 Exam Tomorrow: ${job.jobTitle}`
                : `📅 Exam in ${diffDays} days: ${job.jobTitle}`;
              const notifDesc = `Exam on ${job.examDate}${job.examVenue ? ` at ${job.examVenue}` : ''}. Review your notes & admit card.`;

              urgentNotifications.push({
                id: `auto-circ-exam-${job.id}-${todayStr}`,
                title: notifTitle,
                time: 'Daily Exam Alert',
                read: false,
                type: 'reminders',
                description: notifDesc,
                actionTarget: {
                  type: 'circular',
                  id: job.id
                }
              });

              // Daily once push notification
              if (!alreadyNotifiedToday) {
                sendPushNotification(notifTitle, notifDesc);
                localStorage.setItem(LAST_EXAM_NOTIF_KEY, 'true');
              }
            }
          }
        });
      }

      // 2. Check Tasks Due Today / Overdue
      if (Array.isArray(standaloneTasks)) {
        standaloneTasks.forEach((task) => {
          if (task.completed || !task.dueDate) return;
          const taskDueDate = new Date(task.dueDate);
          const todayDate = new Date(todayStr);
          const diffDays = Math.ceil((taskDueDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24));

          if (diffDays <= 0) {
            urgentNotifications.push({
              id: `auto-task-due-${task.id}-${todayStr}`,
              title: diffDays === 0 ? `📌 Task Due Today: ${task.title}` : `⚠️ Task Overdue: ${task.title}`,
              time: 'Scheduled Alert',
              read: false,
              type: 'reminders',
              description: `Due date: ${task.dueDate}. Complete to maintain your streak!`,
              actionTarget: {
                type: 'task',
                id: task.id
              }
            });
          }
        });
      }

      if (urgentNotifications.length > 0) {
        setNotifications((prev) => {
          const existingIds = new Set(prev.map((n) => n.id));
          const newUnique = urgentNotifications.filter((n) => !existingIds.has(n.id));
          if (newUnique.length === 0) return prev;
          return [...newUnique, ...prev];
        });
      }
    } catch {
      // Safe fallback
    }
  }, [jobCirculars, standaloneTasks]);

  // --- Selected Topic for Right Progress Card & Details Drawer ---
  const [isRecycleBinOpen, setIsRecycleBinOpen] = useState<boolean>(() => initialActiveView === 'trash');
  const [isNewWorkspaceOpen, setIsNewWorkspaceOpen] = useState<boolean>(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState<string>('');
  const [isNewTopicOpen, setIsNewTopicOpen] = useState<boolean>(false);
  const [isSmartStudioOpen, setIsSmartStudioOpen] = useState<boolean>(false);
  const [smartStudioInitialMode, setSmartStudioInitialMode] = useState<'visual' | 'markdown'>('visual');
  const [newTopicTitle, setNewTopicTitle] = useState<string>('');
  const [isNewSectionOpen, setIsNewSectionOpen] = useState<boolean>(false);
  const [newSectionName, setNewSectionName] = useState<string>('');
  const [isAnalyticsPageOpen, setIsAnalyticsPageOpen] = useState<boolean>(() => initialActiveView === 'analytics');

  // Track and persist active view route to URL and localStorage
  useEffect(() => {
    let currentView: 'workspace' | 'notes' | 'tasks' | 'trash' | 'search' | 'analytics' | 'circulars' = 'workspace';
    if (isTasksPageOpen) currentView = 'tasks';
    else if (isNotesPageOpen) currentView = 'notes';
    else if (isJobCircularsOpen) currentView = 'circulars';
    else if (isRecycleBinOpen) currentView = 'trash';
    else if (isSearchPageOpen) currentView = 'search';
    else if (isAnalyticsPageOpen) currentView = 'analytics';

    try {
      localStorage.setItem('studyflow_active_view', currentView);
      const targetPath = currentView === 'workspace' ? '/' : `/${currentView}`;
      const currentPath = window.location.pathname.toLowerCase().replace(/\/$/, '');
      const expectedNormalized = targetPath === '/' ? '' : targetPath;
      if (currentPath !== expectedNormalized) {
        window.history.pushState({ view: currentView }, '', targetPath);
      }
    } catch {}
  }, [isTasksPageOpen, isNotesPageOpen, isJobCircularsOpen, isRecycleBinOpen, isSearchPageOpen, isAnalyticsPageOpen]);

  // Handle Browser Back and Forward Button navigation (popstate event)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase().replace(/\/$/, '');
      setIsTasksPageOpen(path === '/tasks');
      setIsNotesPageOpen(path === '/notes');
      setIsJobCircularsOpen(path === '/circulars' || path === '/jobs');
      setIsRecycleBinOpen(path === '/trash' || path === '/recycle-bin');
      setIsSearchPageOpen(path === '/search');
      setIsAnalyticsPageOpen(path === '/analytics');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState<boolean>(false);
  const [isWorkspaceSwitcherOpen, setIsWorkspaceSwitcherOpen] = useState<boolean>(false);
  const [isMobileWorkspaceDropdownOpen, setIsMobileWorkspaceDropdownOpen] = useState<boolean>(false);
  const [isMoreSectionsOpen, setIsMoreSectionsOpen] = useState<boolean>(false);
  const [isStatusFilterDropdownOpen, setIsStatusFilterDropdownOpen] = useState<boolean>(false);
  const [mobileKeyboardBottomInset, setMobileKeyboardBottomInset] = useState<number>(0);

  // --- Firebase Authentication States (Instant Fast-First Cache) ---
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(() => {
    try {
      const cached = localStorage.getItem('studyflow_cached_user');
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {}
    return null;
  });
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(() => {
    try {
      const cached = localStorage.getItem('studyflow_cached_user');
      return !cached;
    } catch {
      return true;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [profileMenuTarget, setProfileMenuTarget] = useState<'header' | 'sidebar' | null>(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState<boolean>(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(() => 
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  // --- Sidebar Workspaces Section Collapse State ---
  const [isWorkspacesCollapsed, setIsWorkspacesCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('study_flow_workspaces_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleWorkspacesCollapse = useCallback(() => {
    setIsWorkspacesCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('study_flow_workspaces_collapsed', String(next));
      } catch {}
      return next;
    });
  }, []);

  // Smooth mobile virtual keyboard tracking for popup modals
  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;
    const vv = window.visualViewport;

    let timeoutId: number;
    const handleVisualViewportChange = () => {
      const keyboardHeight = Math.max(0, window.innerHeight - (vv.height + vv.offsetTop));
      if (keyboardHeight > 0) {
        if (timeoutId) clearTimeout(timeoutId);
        setMobileKeyboardBottomInset(keyboardHeight);
      } else {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
          setMobileKeyboardBottomInset(0);
        }, 150);
      }
    };

    vv.addEventListener('resize', handleVisualViewportChange);
    vv.addEventListener('scroll', handleVisualViewportChange);
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      vv.removeEventListener('resize', handleVisualViewportChange);
      vv.removeEventListener('scroll', handleVisualViewportChange);
    };
  }, []);

  // --- Inline Edit / Add States ---
  const [addingTaskTopicId, setAddingTaskTopicId] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editingTopicTitle, setEditingTopicTitle] = useState<string>('');

  const editingTopic = useMemo(() => {
    return topics.find(t => t.id === editingTopicId) || null;
  }, [topics, editingTopicId]);

  // --- Topic Card Menu, Pin Animation & Delete Confirmation States ---
  const [activeMenuTopicId, setActiveMenuTopicId] = useState<string | null>(null);
  const [animatingPinTopicId, setAnimatingPinTopicId] = useState<string | null>(null);
  const [topicToDelete, setTopicToDelete] = useState<Topic | null>(null);
  const [animatingDeleteTopicId, setAnimatingDeleteTopicId] = useState<string | null>(null);
  const [customizingTopic, setCustomizingTopic] = useState<Topic | null>(null);
  const [customColorSelection, setCustomColorSelection] = useState<string>('');
  const [customIconSelection, setCustomIconSelection] = useState<string>('');

  // --- Merge Topic State ---
  const [mergeSourceTopic, setMergeSourceTopic] = useState<Topic | null>(null);
  const [targetTopicIdForMerge, setTargetTopicIdForMerge] = useState<string>('');

  // --- Move Topic to Section State ---
  const [moveSectionSourceTopic, setMoveSectionSourceTopic] = useState<Topic | null>(null);
  const [targetSectionForMove, setTargetSectionForMove] = useState<string>('');

  const handleConfirmMergeTopic = () => {
    if (!mergeSourceTopic || !targetTopicIdForMerge) return;
    const sourceTopic = mergeSourceTopic;
    const targetTopic = topics.find(t => t.id === targetTopicIdForMerge);
    if (!targetTopic) return;

    // Merge tasks, notes, links from source topic into target topic
    setTopics(prev =>
      prev.map(t => {
        if (t.id === targetTopicIdForMerge) {
          const mergedTasks = [...t.tasks, ...sourceTopic.tasks];
          const mergedNotes = [...(t.notes || []), ...(sourceTopic.notes || [])];
          const mergedLinks = [...(t.links || []), ...(sourceTopic.links || [])];
          return {
            ...t,
            tasks: mergedTasks,
            notes: mergedNotes.length > 0 ? mergedNotes : undefined,
            links: mergedLinks.length > 0 ? mergedLinks : undefined
          };
        }
        return t;
      }).filter(t => t.id !== sourceTopic.id)
    );

    showToast(`Merged "${sourceTopic.title}" into "${targetTopic.title}"!`);

    // If the topic opened in TopicDetailsDrawer is being merged, switch drawer focus to destination targetTopic
    if (selectedTopicId === sourceTopic.id) {
      setSelectedTopicId(targetTopic.id);
    }

    setMergeSourceTopic(null);
    setTargetTopicIdForMerge('');
  };

  const handleConfirmMoveTopicToSection = () => {
    if (!moveSectionSourceTopic || !targetSectionForMove) return;
    const destSection = targetSectionForMove;
    setTopics(prev =>
      prev.map(t =>
        t.id === moveSectionSourceTopic.id
          ? { ...t, section: destSection }
          : t
      )
    );
    setActiveSection(destSection);
    showToast(`Moved "${moveSectionSourceTopic.title}" to section "${destSection}"!`);
    setMoveSectionSourceTopic(null);
    setTargetSectionForMove('');
  };

  // --- Subtask 3-Dot Menu, Inline Rename & Recycle Bin Confirmation States ---
  const [activeMenuTaskId, setActiveMenuTaskId] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<{ topicId: string; taskId: string } | null>(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState<string>('');
  const [taskToDelete, setTaskToDelete] = useState<{ topicId: string; task: TaskItem } | null>(null);

  const handleStartRenameTask = (topicId: string, task: TaskItem) => {
    setEditingTaskId({ topicId, taskId: task.id });
    setEditingTaskTitle(task.title);
    setActiveMenuTaskId(null);
  };

  const handleSaveRenameTask = (topicId: string, taskId: string, newTitle?: string) => {
    const titleToSave = (newTitle !== undefined ? newTitle : editingTaskTitle).replace(/\s+/g, ' ').trim();
    if (!titleToSave) {
      setEditingTaskId(null);
      return;
    }
    setTopics(prev =>
      prev.map(t =>
        t.id === topicId
          ? {
              ...t,
              tasks: t.tasks.map(tk =>
                tk.id === taskId ? { ...tk, title: titleToSave } : tk
              ),
            }
          : t
      )
    );
    setEditingTaskId(null);
    showToast('Task renamed successfully');
  };

  const handleUpdateTask = (topicId: string, updatedTask: TaskItem) => {
    setTopics(prev =>
      prev.map(t =>
        t.id === topicId
          ? {
              ...t,
              tasks: t.tasks.map(tk =>
                tk.id === updatedTask.id ? updatedTask : tk
              ),
            }
          : t
      )
    );
  };

  const handleBulkToggleTaskCompleted = (topicId: string, taskIds: string[], completed: boolean) => {
    const nowStr = new Date().toISOString();
    const nowTime = Date.now();
    setTopics(prev =>
      prev.map(t =>
        t.id === topicId
          ? {
              ...t,
              tasks: t.tasks.map(tk =>
                taskIds.includes(tk.id)
                  ? {
                      ...tk,
                      completed,
                      completedAt: completed ? nowStr : undefined,
                      completedAtTime: completed ? nowTime : undefined,
                    }
                  : tk
              ),
            }
          : t
      )
    );
  };

  const handleBulkDeleteTasks = (topicId: string, taskIds: string[]) => {
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return;
    const tasksToDeleteList = topic.tasks.filter(tk => taskIds.includes(tk.id));
    if (tasksToDeleteList.length === 0) return;

    if (userSettings.soundEffects !== false) {
      soundManager.playTrash();
    }

    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(
      now.getMonth() + 1
    ).padStart(2, '0')}/${now.getFullYear()} ${now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;

    const newDeletedTaskItems = tasksToDeleteList.map(task => ({
      task,
      topicId: topic.id,
      topicTitle: topic.title,
      workspaceId: topic.workspaceId,
      deletedAt: formattedDate,
    }));

    setDeletedTasks(prev => [...newDeletedTaskItems, ...prev]);

    setTopics(prev =>
      prev.map(t =>
        t.id === topicId
          ? { ...t, tasks: t.tasks.filter(tk => !taskIds.includes(tk.id)) }
          : t
      )
    );

    showToast(
      `Moved ${tasksToDeleteList.length} task(s) to Recycle Bin`,
      () => {
        setTopics(prev =>
          prev.map(t =>
            t.id === topicId
              ? { ...t, tasks: [...t.tasks, ...tasksToDeleteList] }
              : t
          )
        );
        setDeletedTasks(prev => prev.filter(item => !taskIds.includes(item.task.id)));
        showToast(`Restored ${tasksToDeleteList.length} task(s)`);
      },
      6000
    );
  };

  const handleConfirmMoveTaskToRecycleBin = () => {
    if (!taskToDelete) return;
    const { topicId, task } = taskToDelete;
    setTopics(prev =>
      prev.map(t =>
        t.id === topicId
          ? { ...t, tasks: t.tasks.filter(tk => tk.id !== task.id) }
          : t
      )
    );
    setTaskToDelete(null);
    showToast(`Moved "${task.title}" to Recycle Bin`, () => {
      setTopics(prev =>
        prev.map(t =>
          t.id === topicId
            ? { ...t, tasks: [...t.tasks, task] }
            : t
        )
      );
    });
  };

  // --- Workspace Menu & Edit States ---
  const [activeMenuWorkspaceId, setActiveMenuWorkspaceId] = useState<string | null>(null);
  const [workspaceMenuPos, setWorkspaceMenuPos] = useState<{ top: number; left: number } | null>(null);
  const [editingWorkspaceId, setEditingWorkspaceId] = useState<string | null>(null);
  const [editingWorkspaceName, setEditingWorkspaceName] = useState<string>('');
  const [workspaceToDelete, setWorkspaceToDelete] = useState<WorkspaceWindow | null>(null);

  const toggleWorkspaceMenu = (wsId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeMenuWorkspaceId === wsId) {
      setActiveMenuWorkspaceId(null);
      setWorkspaceMenuPos(null);
    } else {
      const btn = e.currentTarget as HTMLElement;
      const rect = btn.getBoundingClientRect();
      const isNearBottom = rect.bottom + 190 > window.innerHeight;
      const top = isNearBottom ? Math.max(10, rect.top - 180) : rect.bottom + 4;
      const left = Math.min(Math.max(10, rect.right - 180), window.innerWidth - 190);
      setWorkspaceMenuPos({ top, left });
      setActiveMenuWorkspaceId(wsId);
    }
  };

  // --- Section Menu & Edit States ---
  const [activeMenuSection, setActiveMenuSection] = useState<string | null>(null);
  const [sectionMenuPos, setSectionMenuPos] = useState<{ top: number; left: number } | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingSectionName, setEditingSectionName] = useState<string>('');
  const [sectionToDelete, setSectionToDelete] = useState<string | null>(null);

  // Master Body Scroll Lock whenever ANY modal, drawer, or mobile sidebar is active
  useEffect(() => {
    const isModalOrDrawerActive = Boolean(
      (!sidebarCollapsed && window.innerWidth < 768) ||
      isNewWorkspaceOpen ||
      isNewSectionOpen ||
      isNewTopicOpen ||
      editingWorkspaceId ||
      editingSection ||
      editingTopicId ||
      isShortcutsOpen ||
      workspaceToDelete ||
      sectionToDelete ||
      topicToDelete ||
      isDetailsDrawerOpen
    );

    const checkAndLockScroll = () => {
      if (isModalOrDrawerActive) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    };
    
    checkAndLockScroll();
    window.addEventListener('resize', checkAndLockScroll);
    
    return () => {
      window.removeEventListener('resize', checkAndLockScroll);
      document.body.style.overflow = '';
    };
  }, [
    sidebarCollapsed,
    isNewWorkspaceOpen,
    isNewSectionOpen,
    isNewTopicOpen,
    editingWorkspaceId,
    editingSection,
    editingTopicId,
    isShortcutsOpen,
    workspaceToDelete,
    topicToDelete,
    isDetailsDrawerOpen,
  ]);

  // Close section 3-dot menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (activeMenuSection) {
        const target = e.target as HTMLElement;
        if (!target.closest('.section-menu') && !target.closest('.section-menu-btn')) {
          setActiveMenuSection(null);
        }
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [activeMenuSection]);

  // Close workspace 3-dot menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (activeMenuWorkspaceId) {
        const target = e.target as HTMLElement;
        if (!target.closest('.workspace-menu') && !target.closest('.workspace-menu-btn')) {
          setActiveMenuWorkspaceId(null);
          setWorkspaceMenuPos(null);
        }
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [activeMenuWorkspaceId]);

  // Close 3-dot menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (activeMenuTopicId) {
        const target = e.target as HTMLElement;
        if (!target.closest('.topic-card-menu') && !target.closest('.topic-card-menu-btn')) {
          setActiveMenuTopicId(null);
        }
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [activeMenuTopicId]);

  // Close task 3-dot menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (activeMenuTaskId) {
        const target = e.target as HTMLElement;
        if (!target.closest('.task-item-menu') && !target.closest('.task-item-menu-btn')) {
          setActiveMenuTaskId(null);
        }
      }
    };
    window.addEventListener('click', handleClickOutside);
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeMenuTaskId]);

  // Close +N More Sections dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isMoreSectionsOpen) {
        const target = e.target as HTMLElement;
        if (!target.closest('.more-sections-dropdown-container')) {
          setIsMoreSectionsOpen(false);
        }
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [isMoreSectionsOpen]);

  // Close Notification Panel on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isNotificationPanelOpen) {
        const target = e.target as HTMLElement;
        if (!target.closest('.notification-dropdown-container')) {
          setIsNotificationPanelOpen(false);
        }
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [isNotificationPanelOpen]);

  // Close Workspace Switcher and Section Switcher dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isWorkspaceDropdownOpen || isWorkspaceSwitcherOpen) {
        const target = e.target as HTMLElement;
        if (!target.closest('.workspace-dropdown-container')) {
          setIsWorkspaceDropdownOpen(false);
          setIsWorkspaceSwitcherOpen(false);
        }
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [isWorkspaceDropdownOpen, isWorkspaceSwitcherOpen]);

  // Close Mobile Workspace Switcher dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isMobileWorkspaceDropdownOpen) {
        const target = e.target as HTMLElement;
        if (!target.closest('.mobile-avatar-dropdown-container')) {
          setIsMobileWorkspaceDropdownOpen(false);
        }
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [isMobileWorkspaceDropdownOpen]);

  // Close Status Filter dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isStatusFilterDropdownOpen) {
        const target = e.target as HTMLElement;
        if (!target.closest('.filter-dropdown-container')) {
          setIsStatusFilterDropdownOpen(false);
        }
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [isStatusFilterDropdownOpen]);

  // Listen to Firebase Auth State Changes & Persist Cached Profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthChecking(false);
      if (user) {
        setIsAuthModalOpen(false);
      }
      try {
        if (user) {
          localStorage.setItem(
            'studyflow_cached_user',
            JSON.stringify({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
            })
          );
        } else {
          localStorage.removeItem('studyflow_cached_user');
        }
      } catch {}
    });
    return () => unsubscribe();
  }, []);

  // Close User Profile dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuTarget) {
        const target = e.target as HTMLElement;
        if (!target.closest('.user-profile-dropdown-container')) {
          setProfileMenuTarget(null);
        }
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [profileMenuTarget]);

  // Profile Action Handlers
  const handleChangePassword = () => {
    setProfileMenuTarget(null);
    setIsChangePasswordOpen(true);
  };

  const handleSwitchAccount = () => {
    setProfileMenuTarget(null);
    setIsAuthModalOpen(true);
  };

  const handleSignOut = async () => {
    setProfileMenuTarget(null);
    try {
      localStorage.removeItem('studyflow_cached_user');
    } catch {}
    await logoutUser();
    setCurrentUser(null);
    setToastData({ message: 'Signed out successfully.' });
  };

  // Flag to prevent loopback saving while applying cloud updates
  const isCloudApplyingRef = useRef<boolean>(false);
  // Flag to prevent auto-save from overwriting cloud data before initial load completes
  const isInitialSyncCompleteRef = useRef<boolean>(false);

  // Initial Cloud Data Load & Real-Time Sync on User Login
  useEffect(() => {
    if (!currentUser) {
      isInitialSyncCompleteRef.current = false;
      return;
    }

    let isMounted = true;
    isInitialSyncCompleteRef.current = false;

    // 1. Initial Load / Migration
    const syncInitial = async () => {
      try {
        const cloudData = await fetchUserDataFromCloud(currentUser.uid);
        if (!isMounted) return;

        if (cloudData && (cloudData.workspaces?.length || cloudData.topics?.length || cloudData.notes?.length || cloudData.jobCirculars?.length)) {
          // Cloud data exists: Sync into local state with safe non-destructive merging
          isCloudApplyingRef.current = true;
          if (cloudData.workspaces) setWorkspaces(cloudData.workspaces);
          if (cloudData.workspaceSections) setWorkspaceSections(cloudData.workspaceSections);
          if (cloudData.activeWorkspaceId) setActiveWorkspaceId(cloudData.activeWorkspaceId);
          if (cloudData.topics) {
            setTopics(prev => {
              const cloudTopicIds = new Set((cloudData.topics || []).map((t: any) => t.id));
              const localOnlyTopics = prev.filter(t => !cloudTopicIds.has(t.id));
              return [...(cloudData.topics || []), ...localOnlyTopics];
            });
          }
          if (cloudData.deletedTopics) setDeletedTopics(cloudData.deletedTopics);
          if (cloudData.deletedWorkspaces) setDeletedWorkspaces(cloudData.deletedWorkspaces);
          if (cloudData.deletedNotes) setDeletedNotes(cloudData.deletedNotes);
          if (cloudData.deletedSections) setDeletedSections(cloudData.deletedSections);
          if (cloudData.deletedTasks) setDeletedTasks(cloudData.deletedTasks);
          if (cloudData.deletedTopicNotes) setDeletedTopicNotes(cloudData.deletedTopicNotes);
          if (cloudData.deletedTopicLinks) setDeletedTopicLinks(cloudData.deletedTopicLinks);
          if (cloudData.jobCirculars) {
            setJobCirculars(prev => {
              const cloudCircularIds = new Set((cloudData.jobCirculars || []).map((c: any) => c.id));
              const localOnly = prev.filter(c => !cloudCircularIds.has(c.id));
              return [...(cloudData.jobCirculars || []), ...localOnly];
            });
          }
          if (cloudData.deletedJobCirculars) setDeletedJobCirculars(cloudData.deletedJobCirculars);
          if (cloudData.notes) {
            setNotes(prev => {
              const cloudNoteIds = new Set((cloudData.notes || []).map((n: any) => n.id));
              const localOnlyNotes = prev.filter(n => !cloudNoteIds.has(n.id));
              return [...(cloudData.notes || []), ...localOnlyNotes];
            });
          }
          if (cloudData.standaloneTasks) {
            setStandaloneTasks(cloudData.standaloneTasks);
          }
          if (cloudData.userSettings) {
            setUserSettings(prev => {
              const { theme: _cloudTheme, primaryColor: _cloudPrimaryColor, ...restCloudSettings } = cloudData.userSettings as any;
              return {
                ...prev,
                ...restCloudSettings,
                theme: prev.theme || getInitialTheme(),
                primaryColor: prev.primaryColor || getInitialAccentColor()
              };
            });
          }
          setTimeout(() => {
            isCloudApplyingRef.current = false;
            isInitialSyncCompleteRef.current = true;
          }, 500);
        } else {
          // First time user: Upload local data to Firestore
          await saveUserDataToCloud(currentUser.uid, {
            workspaces,
            workspaceSections,
            topics,
            deletedTopics,
            deletedWorkspaces,
            deletedNotes,
            deletedSections,
            deletedTasks,
            deletedTopicNotes,
            deletedTopicLinks,
            jobCirculars,
            deletedJobCirculars,
            notes,
            standaloneTasks,
            userSettings
          });
          isInitialSyncCompleteRef.current = true;
        }
      } catch (err) {
        console.error('Initial cloud sync error:', err);
        isInitialSyncCompleteRef.current = true;
      }
    };

    syncInitial();

    // 2. Real-time subscription for live multi-device updates
    const unsubscribe = subscribeToCloudData(currentUser.uid, (cloudData) => {
      if (isCloudApplyingRef.current) return;
      if (cloudData) {
        isCloudApplyingRef.current = true;
        if (cloudData.workspaces) {
          setWorkspaces(cloudData.workspaces);
          // Keep activeWorkspaceId valid if current active workspace was deleted on another device
          setActiveWorkspaceId(prev => {
            const exists = (cloudData.workspaces || []).some((ws: any) => ws.id === prev);
            return exists ? prev : (cloudData.workspaces && cloudData.workspaces.length > 0 ? cloudData.workspaces[0].id : prev);
          });
        }
        if (cloudData.workspaceSections) setWorkspaceSections(cloudData.workspaceSections);
        if (cloudData.topics) {
          setTopics(prev => {
            const cloudTopicIds = new Set((cloudData.topics || []).map((t: any) => t.id));
            const localOnlyTopics = prev.filter(t => !cloudTopicIds.has(t.id));
            return [...(cloudData.topics || []), ...localOnlyTopics];
          });
        }
        if (cloudData.deletedTopics) setDeletedTopics(cloudData.deletedTopics);
        if (cloudData.deletedWorkspaces) setDeletedWorkspaces(cloudData.deletedWorkspaces);
        if (cloudData.deletedNotes) setDeletedNotes(cloudData.deletedNotes);
        if (cloudData.deletedSections) setDeletedSections(cloudData.deletedSections);
        if (cloudData.deletedTasks) setDeletedTasks(cloudData.deletedTasks);
        if (cloudData.deletedTopicNotes) setDeletedTopicNotes(cloudData.deletedTopicNotes);
        if (cloudData.deletedTopicLinks) setDeletedTopicLinks(cloudData.deletedTopicLinks);
        if (cloudData.jobCirculars) {
          setJobCirculars(prev => {
            const cloudCircularIds = new Set((cloudData.jobCirculars || []).map((c: any) => c.id));
            const localOnly = prev.filter(c => !cloudCircularIds.has(c.id));
            return [...(cloudData.jobCirculars || []), ...localOnly];
          });
        }
        if (cloudData.deletedJobCirculars) setDeletedJobCirculars(cloudData.deletedJobCirculars);
        if (cloudData.notes) {
          setNotes(prev => {
            const cloudNoteIds = new Set((cloudData.notes || []).map((n: any) => n.id));
            const localOnlyNotes = prev.filter(n => !cloudNoteIds.has(n.id));
            return [...(cloudData.notes || []), ...localOnlyNotes];
          });
        }
        if (cloudData.standaloneTasks) {
          setStandaloneTasks(cloudData.standaloneTasks);
        }
        if (cloudData.userSettings) {
          setUserSettings(prev => {
            const { theme: _cloudTheme, primaryColor: _cloudPrimaryColor, ...restCloudSettings } = cloudData.userSettings as any;
            return {
              ...prev,
              ...restCloudSettings,
              theme: prev.theme || getInitialTheme(),
              primaryColor: prev.primaryColor || getInitialAccentColor()
            };
          });
        }
        setTimeout(() => {
          isCloudApplyingRef.current = false;
        }, 500);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [currentUser]);

  // Keep a live ref to the latest state for instant flush on refresh / tab close
  const latestDataRef = useRef<any>({});
  useEffect(() => {
    latestDataRef.current = {
      workspaces,
      workspaceSections,
      topics,
      deletedTopics,
      deletedWorkspaces,
      deletedNotes,
      deletedSections,
      deletedTasks,
      deletedTopicNotes,
      deletedTopicLinks,
      jobCirculars,
      deletedJobCirculars,
      notes,
      standaloneTasks,
      userSettings
    };
  }, [workspaces, workspaceSections, topics, deletedTopics, deletedWorkspaces, deletedNotes, deletedSections, deletedTasks, deletedTopicNotes, deletedTopicLinks, jobCirculars, deletedJobCirculars, notes, standaloneTasks, userSettings]);

  // Immediate flush save to Firebase when browser is refreshed (F5) or closed
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentUser && isInitialSyncCompleteRef.current && !isCloudApplyingRef.current) {
        saveUserDataToCloud(currentUser.uid, latestDataRef.current);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentUser]);

  // Immediate Real-Time Cloud Auto-Save on any local data changes (0ms Delay - Instant Save)
  useEffect(() => {
    if (!currentUser || isCloudApplyingRef.current || !isInitialSyncCompleteRef.current) return;

    const payload = {
      workspaces,
      workspaceSections,
      topics,
      deletedTopics,
      deletedWorkspaces,
      deletedNotes,
      deletedSections,
      deletedTasks,
      deletedTopicNotes,
      deletedTopicLinks,
      jobCirculars,
      deletedJobCirculars,
      notes,
      standaloneTasks,
      userSettings
    };
    latestDataRef.current = payload;
    saveUserDataToCloud(currentUser.uid, payload);
  }, [currentUser, workspaces, workspaceSections, topics, deletedTopics, deletedWorkspaces, deletedNotes, deletedSections, deletedTasks, deletedTopicNotes, deletedTopicLinks, jobCirculars, deletedJobCirculars, notes, standaloneTasks, userSettings]);

  // Online / Offline Network Status Tracking
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setToastData({ message: 'Back online! Syncing changes with cloud... ☁️' });
    };
    const handleOffline = () => {
      setIsOnline(false);
      setToastData({ message: 'Offline Mode: Changes saved securely on this device 💾' });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Multi-Tab Real-Time Sync (Cross-Tab Broadcast)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (!e.key || isCloudApplyingRef.current) return;
      try {
        if (e.key === 'studyflow_topics' && e.newValue) {
          setTopics(JSON.parse(e.newValue));
        } else if (e.key === 'studyflow_workspaces' && e.newValue) {
          setWorkspaces(JSON.parse(e.newValue));
        } else if (e.key === 'studyflow_workspace_sections' && e.newValue) {
          setWorkspaceSections(JSON.parse(e.newValue));
        } else if (e.key === 'studyflow_notes' && e.newValue) {
          setNotes(JSON.parse(e.newValue));
        } else if (e.key === 'studyflow_user_settings' && e.newValue) {
          setUserSettings(JSON.parse(e.newValue));
        } else if (e.key === 'studyflow_deleted_topics' && e.newValue) {
          setDeletedTopics(JSON.parse(e.newValue));
        } else if (e.key === 'studyflow_deleted_workspaces' && e.newValue) {
          setDeletedWorkspaces(JSON.parse(e.newValue));
        } else if (e.key === 'studyflow_job_circulars' && e.newValue) {
          setJobCirculars(JSON.parse(e.newValue));
        } else if (e.key === 'studyflow_deleted_job_circulars' && e.newValue) {
          setDeletedJobCirculars(JSON.parse(e.newValue));
        }
      } catch (err) {
        console.error('Multi-tab sync parse error:', err);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // --- Active Workspace Object ---
  const activeWorkspace = useMemo(() => {
    return workspaces.find(w => w.id === activeWorkspaceId) || workspaces[0] || { id: '1', name: 'Workspace' };
  }, [workspaces, activeWorkspaceId]);

  // --- Filtered Topics for Active Workspace & Active Section (Guaranteed Unique) ---
  const currentWorkspaceTopics = useMemo(() => {
    const rawList = syncedTopics.filter(t => t.workspaceId === activeWorkspaceId);
    const seen = new Set<string>();
    const unique: Topic[] = [];
    for (const t of rawList) {
      if (t && t.id && !seen.has(t.id)) {
        seen.add(t.id);
        unique.push(t);
      }
    }
    return unique;
  }, [syncedTopics, activeWorkspaceId]);

  const filteredTopics = useMemo(() => {
    let list = currentWorkspaceTopics;
    if (activeSection) {
      list = currentWorkspaceTopics.filter(t => t.section === activeSection);
    }
    return list;
  }, [currentWorkspaceTopics, activeSection]);

  // Sort pinned topics first
  const sortedFilteredTopics = useMemo(() => {
    return [...filteredTopics].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });
  }, [filteredTopics]);

  // --- Central System Keyboard Shortcuts Engine ---
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInsideNotesEditor = Boolean(
        target && (
          (target as any).isContentEditable ||
          target.closest('[contenteditable="true"]') ||
          target.closest('.note-preview-content') ||
          (isNotesPageOpen && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA'))
        )
      );

      // In the Notes Editor, ONLY note-specific shortcuts and Esc apply - NEVER intercept with global app shortcuts!
      if (isInsideNotesEditor && e.key !== 'Escape') {
        return;
      }

      const isTyping = target && (
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.tagName === 'SELECT' || 
        (target as any).isContentEditable
      );

      const isAnyModalActive = Boolean(
        isNewWorkspaceOpen ||
        editingWorkspaceId ||
        isNewSectionOpen ||
        editingSection ||
        isNewTopicOpen ||
        isSmartStudioOpen ||
        editingTopicId ||
        isShortcutsOpen ||
        isSettingsOpen ||
        isAuthModalOpen ||
        isEditProfileOpen ||
        isChangePasswordOpen ||
        workspaceToDelete ||
        sectionToDelete ||
        topicToDelete
      );

      // Escape: Close recycle bin, notes page, search page, shortcuts modal, goal/streak popovers if open
      if (e.key === 'Escape') {
        if (isDetailsDrawerOpen) {
          setIsDetailsDrawerOpen(false);
          return;
        }
        if (isJobCircularsOpen) {
          setIsJobCircularsOpen(false);
          return;
        }
        if (isTasksPageOpen) {
          setIsTasksPageOpen(false);
          return;
        }
        if (isRecycleBinOpen) {
          setIsRecycleBinOpen(false);
          return;
        }
        if (isNotesPageOpen) {
          setIsNotesPageOpen(false);
          return;
        }
        if (isSearchPageOpen) {
          setIsSearchPageOpen(false);
          return;
        }
        if (isShortcutsOpen) {
          setIsShortcutsOpen(false);
          return;
        }
        if (isAnalyticsPageOpen) {
          setIsAnalyticsPageOpen(false);
          return;
        }
        if (isGoalPopoverOpen) {
          setIsGoalPopoverOpen(false);
          return;
        }
        if (isStreakPopoverOpen) {
          setIsStreakPopoverOpen(false);
          return;
        }
      }

      // Helper to close all full-page studios when navigating to workspace view
      const closeAllFullPages = () => {
        setIsRecycleBinOpen(false);
        setIsNotesPageOpen(false);
        setIsSearchPageOpen(false);
        setIsAnalyticsPageOpen(false);
        setIsTasksPageOpen(false);
        setIsJobCircularsOpen(false);
      };

      // 1. Search, Sidebar, Help Cheatsheet (Ctrl / Meta shortcuts)
      if ((e.metaKey || e.ctrlKey) && !e.altKey) {
        const isK = e.code === 'KeyK' || e.key.toLowerCase() === 'k';
        const isB = e.code === 'KeyB' || e.key.toLowerCase() === 'b';
        const isSlash = e.code === 'Slash' || e.key === '/' || e.key === '?';

        if (isK) {
          e.preventDefault();
          if (!isAnyModalActive || isSearchPageOpen) {
            setIsSearchPageOpen(prev => {
              const next = !prev;
              if (next) {
                setIsTasksPageOpen(false);
                setIsJobCircularsOpen(false);
                setIsNotesPageOpen(false);
                setIsAnalyticsPageOpen(false);
                setIsRecycleBinOpen(false);
              }
              return next;
            });
          }
          return;
        }
        if (isB) {
          e.preventDefault();
          if (!isAnyModalActive) {
            setSidebarCollapsed(prev => !prev);
          }
          return;
        }
        if (isSlash) {
          e.preventDefault();
          if (!isAnyModalActive || isShortcutsOpen) {
            setIsShortcutsOpen(prev => !prev);
          }
          return;
        }
      }

      // 2. Alt-Based Shortcuts
      if (e.altKey && !e.ctrlKey && !e.metaKey) {
        const keyLower = e.key.toLowerCase();

        // 2a. Alt + Space: Start / Pause Study Timer Toggle (Allowed globally unless typing)
        if (e.code === 'Space' || e.key === ' ') {
          if (!isTyping) {
            e.preventDefault();
            if (activeStudyTimer) {
              if (activeStudyTimer.isPaused) {
                handleResumeGlobalStudyTimer();
              } else {
                handlePauseGlobalStudyTimer();
              }
            } else {
              showToast('Select a task or open topic drawer to start study timer ⏱️');
            }
          }
          return;
        }

        // 2b. Alt + L (without shift): Stop & Log Study Time
        const isKeyL = e.code === 'KeyL' || keyLower === 'l';
        if (!e.shiftKey && isKeyL) {
          if (activeStudyTimer && !isTyping) {
            e.preventDefault();
            handleStopAndLogGlobalStudyTimer();
            return;
          }
        }

        // If typing in an input/textarea, do not trigger remaining Alt shortcuts
        if (isTyping) {
          return;
        }

        // If a dialog modal is actively open, don't trigger topic/section creation modals
        const isDialogModalActive = Boolean(
          isNewWorkspaceOpen ||
          editingWorkspaceId ||
          isNewSectionOpen ||
          editingSection ||
          isNewTopicOpen ||
          isSmartStudioOpen ||
          editingTopicId ||
          isSettingsOpen ||
          isAuthModalOpen ||
          isEditProfileOpen ||
          isChangePasswordOpen ||
          workspaceToDelete ||
          sectionToDelete ||
          topicToDelete
        );

        const isGlobalPageActive = Boolean(
          isRecycleBinOpen || 
          isNotesPageOpen || 
          isSearchPageOpen || 
          isAnalyticsPageOpen || 
          isTasksPageOpen || 
          isJobCircularsOpen
        );

        const isKeyW = e.code === 'KeyW' || keyLower === 'w';
        const isKeyR = e.code === 'KeyR' || keyLower === 'r';
        const isKeyS = e.code === 'KeyS' || keyLower === 's';
        const isKeyT = e.code === 'KeyT' || keyLower === 't';
        const isKeyM = e.code === 'KeyM' || keyLower === 'm';
        const isKeyG = e.code === 'KeyG' || keyLower === 'g';

        // 2g. Alt + W (without shift): New Workspace Modal
        if (!e.shiftKey && isKeyW) {
          e.preventDefault();
          closeAllFullPages();
          setNewWorkspaceName('');
          setIsNewWorkspaceOpen(true);
          return;
        }

        // 2h. Alt + Shift + W: Rename Active Workspace
        if (e.shiftKey && isKeyW) {
          if (activeWorkspace) {
            e.preventDefault();
            closeAllFullPages();
            setEditingWorkspaceId(activeWorkspace.id);
            setEditingWorkspaceName(activeWorkspace.name);
            return;
          }
        }

        // 2l. Alt + R: Toggle Recycle Bin View
        if (!e.shiftKey && isKeyR) {
          e.preventDefault();
          setIsRecycleBinOpen(prev => {
            const next = !prev;
            if (next) {
              setIsNotesPageOpen(false);
              setIsSearchPageOpen(false);
              setIsAnalyticsPageOpen(false);
              setIsTasksPageOpen(false);
              setIsJobCircularsOpen(false);
            }
            return next;
          });
          return;
        }

        // 2e. Alt + G (without shift): Toggle Today's Goal Popover
        if (!e.shiftKey && isKeyG) {
          e.preventDefault();
          if (isGlobalPageActive) {
            closeAllFullPages();
            setIsGoalPopoverOpen(true);
          } else {
            setIsGoalPopoverOpen(prev => !prev);
          }
          return;
        }

        // 2f. Alt + Shift + G: Toggle Streak Consistency Dashboard
        if (e.shiftKey && isKeyG) {
          e.preventDefault();
          if (isGlobalPageActive) {
            closeAllFullPages();
            setIsStreakPopoverOpen(true);
          } else {
            setIsStreakPopoverOpen(prev => !prev);
          }
          return;
        }

        // 2c. Alt + S (without shift): Create Section Modal (Requires an active workspace view!)
        if (!e.shiftKey && isKeyS) {
          e.preventDefault();
          if (isGlobalPageActive || !activeWorkspaceId || workspaces.length === 0) {
            closeAllFullPages();
            if (!activeWorkspaceId || workspaces.length === 0) {
              showToast('Please open a workspace first to create sections 📁');
              return;
            }
          }
          setNewSectionName('');
          setIsNewSectionOpen(true);
          return;
        }

        // 2d. Alt + Shift + S: Rename Active Section
        if (e.shiftKey && isKeyS) {
          if (activeSection) {
            e.preventDefault();
            closeAllFullPages();
            setEditingSection(activeSection);
            setEditingSectionName(activeSection);
            return;
          }
        }

        // 2i. Alt + T (without shift): Create Single Topic Modal (Requires active workspace view!)
        if (!e.shiftKey && isKeyT) {
          e.preventDefault();
          if (isGlobalPageActive || !activeWorkspaceId || workspaces.length === 0) {
            closeAllFullPages();
            if (!activeWorkspaceId || workspaces.length === 0) {
              showToast('Please open a workspace first to add topics 📚');
              return;
            }
          }
          setNewTopicTitle('');
          setIsNewTopicOpen(true);
          return;
        }

        // 2j. Alt + Shift + T: Smart Topic Studio (Visual Form - Requires active workspace view!)
        if (e.shiftKey && isKeyT) {
          e.preventDefault();
          if (isGlobalPageActive || !activeWorkspaceId || workspaces.length === 0) {
            closeAllFullPages();
            if (!activeWorkspaceId || workspaces.length === 0) {
              showToast('Please open a workspace first to open Topic Studio 📚');
              return;
            }
          }
          setSmartStudioInitialMode('visual');
          setIsSmartStudioOpen(true);
          return;
        }

        // 2k. Alt + Shift + M: Smart Topic Studio (Markdown Text Mode - Requires active workspace view!)
        if (e.shiftKey && isKeyM) {
          e.preventDefault();
          if (isGlobalPageActive || !activeWorkspaceId || workspaces.length === 0) {
            closeAllFullPages();
            if (!activeWorkspaceId || workspaces.length === 0) {
              showToast('Please open a workspace first to open Topic Studio 📚');
              return;
            }
          }
          setSmartStudioInitialMode('markdown');
          setIsSmartStudioOpen(true);
          return;
        }

        // 2m. Alt + 1..9, Alt + 0: Switch directly to 1st..10th Workspace
        let digitIndex = -1;
        if (e.code.startsWith('Digit')) {
          const d = parseInt(e.code.replace('Digit', ''), 10);
          if (!isNaN(d)) digitIndex = d === 0 ? 9 : d - 1;
        } else if (e.code.startsWith('Numpad')) {
          const d = parseInt(e.code.replace('Numpad', ''), 10);
          if (!isNaN(d)) digitIndex = d === 0 ? 9 : d - 1;
        } else if (/^[0-9]$/.test(e.key)) {
          const d = parseInt(e.key, 10);
          digitIndex = d === 0 ? 9 : d - 1;
        }

        if (!e.shiftKey && digitIndex >= 0) {
          const list = sortedWorkspaces.length > 0 ? sortedWorkspaces : workspaces;
          if (list[digitIndex]) {
            e.preventDefault();
            setActiveWorkspaceId(list[digitIndex].id);
            closeAllFullPages();
            return;
          }
        }

        // 2n. Alt + ] or Alt + ArrowDown: Next Workspace
        const isNextWs = e.code === 'BracketRight' || e.key === ']' || e.code === 'ArrowDown' || e.key === 'ArrowDown';
        if (isNextWs) {
          const list = sortedWorkspaces.length > 0 ? sortedWorkspaces : workspaces;
          if (list.length > 0) {
            e.preventDefault();
            const currIdx = list.findIndex(w => w.id === activeWorkspaceId);
            const nextIdx = currIdx === -1 ? 0 : (currIdx + 1) % list.length;
            setActiveWorkspaceId(list[nextIdx].id);
            closeAllFullPages();
            return;
          }
        }

        // 2o. Alt + [ or Alt + ArrowUp: Previous Workspace
        const isPrevWs = e.code === 'BracketLeft' || e.key === '[' || e.code === 'ArrowUp' || e.key === 'ArrowUp';
        if (isPrevWs) {
          const list = sortedWorkspaces.length > 0 ? sortedWorkspaces : workspaces;
          if (list.length > 0) {
            e.preventDefault();
            const currIdx = list.findIndex(w => w.id === activeWorkspaceId);
            const prevIdx = currIdx === -1 ? 0 : (currIdx - 1 + list.length) % list.length;
            setActiveWorkspaceId(list[prevIdx].id);
            closeAllFullPages();
            return;
          }
        }

        // 2p. Alt + ArrowRight: Next Section
        const isNextSec = e.code === 'ArrowRight' || e.key === 'ArrowRight';
        if (isNextSec) {
          if (currentWorkspaceSections.length > 0) {
            e.preventDefault();
            closeAllFullPages();
            const secNames = currentWorkspaceSections.map(s => s.name);
            const currIdx = activeSection ? secNames.indexOf(activeSection) : -1;
            const nextIdx = (currIdx + 1) % secNames.length;
            setActiveSection(secNames[nextIdx]);
            return;
          }
        }

        // 2q. Alt + ArrowLeft: Previous Section
        const isPrevSec = e.code === 'ArrowLeft' || e.key === 'ArrowLeft';
        if (isPrevSec) {
          if (currentWorkspaceSections.length > 0) {
            e.preventDefault();
            closeAllFullPages();
            const secNames = currentWorkspaceSections.map(s => s.name);
            const currIdx = activeSection ? secNames.indexOf(activeSection) : 0;
            const prevIdx = (currIdx - 1 + secNames.length) % secNames.length;
            setActiveSection(secNames[prevIdx]);
            return;
          }
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown, true);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown, true);
  }, [
    isSearchPageOpen,
    isNotesPageOpen,
    isAnalyticsPageOpen,
    isTasksPageOpen,
    isJobCircularsOpen,
    isRecycleBinOpen,
    isShortcutsOpen,
    isGoalPopoverOpen,
    isStreakPopoverOpen,
    activeStudyTimer,
    activeWorkspace,
    activeWorkspaceId,
    workspaces,
    sortedWorkspaces,
    activeSection,
    currentWorkspaceSections,
    handleResumeGlobalStudyTimer,
    handlePauseGlobalStudyTimer,
    handleStopAndLogGlobalStudyTimer,
    isNewWorkspaceOpen,
    editingWorkspaceId,
    isNewSectionOpen,
    editingSection,
    isNewTopicOpen,
    isSmartStudioOpen,
    editingTopicId,
    isSettingsOpen,
    isAuthModalOpen,
    isEditProfileOpen,
    isChangePasswordOpen,
    workspaceToDelete,
    sectionToDelete,
    topicToDelete,
    isDetailsDrawerOpen
  ]);

  // --- Full-Page Global Search Indexing Engine ---
  // Completed Topics Count for Daily Target Goal
  const completedTopicsCount = useMemo(() => {
    return currentWorkspaceTopics.filter(t => t.tasks.length > 0 && t.tasks.every(tk => tk.completed)).length;
  }, [currentWorkspaceTopics]);

  // Smart Next Incomplete Topic Detector for Celebration Modal
  const nextIncompleteTopic = useMemo(() => {
    if (!congratulationsTopic) return null;
    const sameSectionTopics = currentWorkspaceTopics.filter(t => t.section === congratulationsTopic.sectionName);
    const incomplete = sameSectionTopics.find(t => t.id !== congratulationsTopic.id && t.tasks.some(tk => !tk.completed));
    if (incomplete) return { id: incomplete.id, title: incomplete.title };

    // Fallback: any other incomplete topic in workspace
    const anyIncomplete = currentWorkspaceTopics.find(t => t.id !== congratulationsTopic.id && t.tasks.some(tk => !tk.completed));
    return anyIncomplete ? { id: anyIncomplete.id, title: anyIncomplete.title } : null;
  }, [congratulationsTopic, currentWorkspaceTopics]);

  // Theme generator for Deep Colorful Icons & Micro-Topic Semantic Icon Matching with 7-Color Variety
  const getTopicTheme = (topicOrTitle: string | Topic, index?: number) => {
    const title = typeof topicOrTitle === 'string' ? topicOrTitle : topicOrTitle.title;
    const customColor = typeof topicOrTitle === 'object' ? topicOrTitle.customColor : undefined;
    const customIconName = typeof topicOrTitle === 'object' ? topicOrTitle.customIcon : undefined;
    const t = title.toLowerCase().trim();

    // 7 Highlighted Colors Palette for Dynamic Rotation & Variety
    const palettes = [
      { id: 'blue', bg: 'bg-[#2563EB]', cardIconBg: 'bg-[#2563EB]', cardIconColor: 'text-white', progressBarBg: 'bg-[#3B82F6]', progressGradient: 'from-[#1E40AF] via-[#2563EB] to-[#60A5FA]', textColor: 'text-[#2563EB]', pinIconColor: 'text-[#2563EB] fill-[#2563EB]' }, // 1. Royal Blue
      { id: 'purple', bg: 'bg-[#8B5CF6]', cardIconBg: 'bg-[#8B5CF6]', cardIconColor: 'text-white', progressBarBg: 'bg-[#8B5CF6]', progressGradient: 'from-[#6D28D9] via-[#8B5CF6] to-[#C084FC]', textColor: 'text-[#8B5CF6]', pinIconColor: 'text-[#8B5CF6] fill-[#8B5CF6]' }, // 2. Purple
      { id: 'green', bg: 'bg-[#10B981]', cardIconBg: 'bg-[#10B981]', cardIconColor: 'text-white', progressBarBg: 'bg-[#10B981]', progressGradient: 'from-[#047857] via-[#10B981] to-[#34D399]', textColor: 'text-[#10B981]', pinIconColor: 'text-[#10B981] fill-[#10B981]' }, // 3. Emerald Green
      { id: 'orange', bg: 'bg-[#EA580C]', cardIconBg: 'bg-[#EA580C]', cardIconColor: 'text-white', progressBarBg: 'bg-[#EA580C]', progressGradient: 'from-[#C2410C] via-[#EA580C] to-[#FB923C]', textColor: 'text-[#EA580C]', pinIconColor: 'text-[#EA580C] fill-[#EA580C]' }, // 4. Warm Orange
      { id: 'pink', bg: 'bg-[#F43F5E]', cardIconBg: 'bg-[#F43F5E]', cardIconColor: 'text-white', progressBarBg: 'bg-[#F43F5E]', progressGradient: 'from-[#BE123C] via-[#F43F5E] to-[#FDA4AF]', textColor: 'text-[#F43F5E]', pinIconColor: 'text-[#F43F5E] fill-[#F43F5E]' }, // 5. Rose Pink
      { id: 'cyan', bg: 'bg-[#06B6D4]', cardIconBg: 'bg-[#06B6D4]', cardIconColor: 'text-white', progressBarBg: 'bg-[#06B6D4]', progressGradient: 'from-[#0E7490] via-[#06B6D4] to-[#67E8F9]', textColor: 'text-[#06B6D4]', pinIconColor: 'text-[#06B6D4] fill-[#06B6D4]' }, // 6. Ocean Cyan
      { id: 'amber', bg: 'bg-[#F59E0B]', cardIconBg: 'bg-[#F59E0B]', cardIconColor: 'text-white', progressBarBg: 'bg-[#F59E0B]', progressGradient: 'from-[#B45309] via-[#F59E0B] to-[#FDE68A]', textColor: 'text-[#F59E0B]', pinIconColor: 'text-[#F59E0B] fill-[#F59E0B]' }  // 7. Amber Gold
    ];

    // Compute consistent hash from title so each card deterministically retains its exact same color
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = (hash << 5) - hash + title.charCodeAt(i);
      hash |= 0;
    }
    const colorIdx = Math.abs(hash) % palettes.length;
    let baseColor = palettes[colorIdx];

    if (customColor) {
      const matchCustom = palettes.find(p => p.id === customColor || p.bg.includes(customColor));
      if (matchCustom) baseColor = matchCustom;
    }

    // Comprehensive Icon lookup helper if customIconName is set
    const getCustomIconComponent = (name: string) => {
      switch (name.toLowerCase()) {
        // 1. বাংলা ব্যাকরণ & Grammar
        case 'languages': return Languages;
        case 'type': return Type;
        case 'spellcheck': return SpellCheck;
        case 'booka': return BookA;
        case 'notebooktabs': return NotebookTabs;
        case 'wholeword': return WholeWord;
        case 'textcursor': return TextCursor;
        case 'pilcrow': return Pilcrow;
        case 'casesensitive': return CaseSensitive;
        case 'brackets': return Brackets;
        case 'filetext': return FileText;
        case 'badgecheck': return BadgeCheck;

        // 2. সাহিত্য / Literature
        case 'bookopen': return BookOpen;
        case 'bookopentext': return BookOpenText;
        case 'library': return Library;
        case 'feather': return Feather;
        case 'pentool': return PenTool;
        case 'scroll': return Scroll;
        case 'scrolltext': return ScrollText;
        case 'notebook': return Notebook;
        case 'quote': return Quote;
        case 'bookmarked': return BookMarked;
        case 'graduationcap': return GraduationCap;
        case 'penline': return PenLine;
        case 'bookcopy': return BookCopy;
        case 'notebookpen': return NotebookPen;
        case 'theater': return Theater;

        // 5. গণিত / Mathematics
        case 'calculator': return Calculator;
        case 'sigma': return Sigma;
        case 'radical': return Radical;
        case 'pi': return Pi;
        case 'percent': return Percent;
        case 'divide': return Divide;
        case 'squarefunction': return SquareFunction;
        case 'equal': return Equal;
        case 'variable': return Variable;
        case 'binary': return Binary;
        case 'chartnoaxescolumn': return ChartNoAxesColumn;
        case 'hash': return Hash;

        // 6. মানসিক দক্ষতা / Mental Ability
        case 'brain': return Brain;
        case 'braincircuit': return BrainCircuit;
        case 'puzzle': return Puzzle;
        case 'lightbulb': return Lightbulb;
        case 'blocks': return Blocks;
        case 'route': return Route;
        case 'network': return Network;
        case 'scansearch': return ScanSearch;
        case 'workflow': return Workflow;
        case 'gitbranch': return GitBranch;
        case 'shapes': return Shapes;
        case 'waypoints': return Waypoints;
        case 'triangle': return Triangle;
        case 'box': return Box;
        case 'dices': return Dices;

        // 7 & 8. বাংলাদেশ ও আন্তর্জাতিক বিষয়াবলি
        case 'map': return LucideMapIcon;
        case 'mappinned': return MapPinned;
        case 'landmark': return Landmark;
        case 'flag': return Flag;
        case 'building2': return Building2;
        case 'building': return Building;
        case 'scale': return Scale;
        case 'users': return Users;
        case 'usercheck': return UserCheck;
        case 'factory': return Factory;
        case 'wheat': return Wheat;
        case 'globe': return Globe;
        case 'earth': return Earth;
        case 'handshake': return Handshake;
        case 'plane': return Plane;
        case 'ship': return Ship;

        // 9. সাধারণ বিজ্ঞান
        case 'atom': return Atom;
        case 'flaskconical': return FlaskConical;
        case 'microscope': return Microscope;
        case 'telescope': return Telescope;
        case 'dna': return Dna;
        case 'testtube': return TestTube;
        case 'testtubes': return TestTubes;
        case 'orbit': return Orbit;
        case 'magnet': return Magnet;
        case 'zap': return Zap;
        case 'thermometer': return Thermometer;
        case 'leaf': return Leaf;
        case 'radiation': return Radiation;

        // 10. ICT / Computer
        case 'monitor': return Monitor;
        case 'computer': return Computer;
        case 'cpu': return Cpu;
        case 'microchip': return Microchip;
        case 'database': return Database;
        case 'server': return Server;
        case 'wifi': return Wifi;
        case 'code2': return Code2;
        case 'terminal': return Terminal;
        case 'cloud': return Cloud;
        case 'shieldcheck': return ShieldCheck;

        // 11, 12, 13. ভূগোল, পরিবেশ ও দুর্যোগ ব্যবস্থাপনা
        case 'mountain': return Mountain;
        case 'waves': return Waves;
        case 'compass': return Compass;
        case 'navigation': return Navigation;
        case 'trees': return Trees;
        case 'treepine': return TreePine;
        case 'sprout': return Sprout;
        case 'recycle': return Recycle;
        case 'droplets': return Droplets;
        case 'wind': return Wind;
        case 'sun': return Sun;
        case 'cloudsun': return CloudSun;
        case 'flower': return Flower;
        case 'flower2': return Flower2;
        case 'biohazard': return Biohazard;
        case 'alerttriangle': return AlertTriangle;
        case 'siren': return Siren;
        case 'shieldalert': return ShieldAlert;
        case 'cloudlightning': return CloudLightning;
        case 'flame': return Flame;
        case 'lifebuoy': return LifeBuoy;
        case 'ambulance': return Ambulance;
        case 'radio': return Radio;
        case 'cross': return Cross;

        // 14, 15, 16. নৈতিকতা, মূল্যবোধ ও সুশাসন
        case 'hearthandshake': return HeartHandshake;
        case 'handheart': return HandHeart;
        case 'heart': return Heart;
        case 'smile': return Smile;
        case 'gem': return Gem;
        case 'thumbsup': return ThumbsUp;
        case 'checkcircle2': return CheckCircle2;
        case 'award': return Award;
        case 'star': return Star;
        case 'sparkles': return Sparkles;
        case 'vote': return Vote;
        case 'filecheck': return FileCheck;
        case 'clipboardcheck': return ClipboardCheck;
        case 'gavel': return Gavel;
        case 'eye': return Eye;
        case 'fingerprint': return Fingerprint;

        // 17, 18, 19, 20. Current Affairs, GK, ইতিহাস ও সংবিধান
        case 'newspaper': return Newspaper;
        case 'rss': return Rss;
        case 'megaphone': return Megaphone;
        case 'calendardays': return CalendarDays;
        case 'clock': return Clock;
        case 'clock3': return Clock3;
        case 'bell': return Bell;
        case 'trendingup': return TrendingUp;
        case 'tv': return Tv;
        case 'podcast': return Podcast;
        case 'messagesquaremore': return MessageSquareMore;
        case 'circlehelp': return CircleHelp;
        case 'trophy': return Trophy;
        case 'castle': return Castle;
        case 'crown': return Crown;
        case 'swords': return Swords;
        case 'hourglass': return Hourglass;
        case 'history': return History;
        case 'bookcheck': return BookCheck;

        // 21, 22, 23. অর্থনীতি, ব্যাংকিং ও কৃষি
        case 'banknote': return Banknote;
        case 'creditcard': return CreditCard;
        case 'walletcards': return WalletCards;
        case 'receipt': return Receipt;
        case 'chartnoaxescombined': return ChartNoAxesCombined;
        case 'piggybank': return PiggyBank;
        case 'vault': return Vault;
        case 'badgedollarsign': return BadgeDollarSign;
        case 'wallet': return Wallet;
        case 'coins': return Coins;
        case 'circledollarsign': return CircleDollarSign;
        case 'handcoins': return HandCoins;
        case 'piechart': return PieChart;
        case 'tractor': return Tractor;
        case 'shovel': return Shovel;
        case 'apple': return Apple;
        case 'warehouse': return Warehouse;

        // 24, 25. মুক্তিযুদ্ধ ও খেলাধুলা
        case 'medal': return Medal;
        case 'shield': return Shield;
        case 'dumbbell': return Dumbbell;
        case 'volleyball': return Volleyball;
        case 'bike': return Bike;
        case 'goal': return Goal;
        case 'timer': return Timer;
        case 'flagtriangleright': return FlagTriangleRight;
        case 'target': return Target;
        default: return null;
      }
    };

    if (customIconName) {
      const customComp = getCustomIconComponent(customIconName);
      if (customComp) {
        return { ...baseColor, icon: customComp };
      }
    }

    // --- 25-SUBJECT SEMANTIC TOPIC ICON MATCHER (Exact Syllabus Keyword Mapping) ---

    // 1. বাংলা ব্যাকরণ (Bangla Grammar)
    if (['বাংলা ব্যাকরণ', 'ব্যাকরণ', 'ধ্বনি', 'বর্ণ', 'শব্দ', 'পদ', 'সন্ধি', 'সমাস', 'কারক', 'বিভক্তি', 'প্রত্যয়', 'প্রত্যয়', 'উপসর্গ', 'অনুসর্গ', 'লিঙ্গ', 'বচন', 'পুরুষ', 'ক্রিয়া', 'কাল', 'সমার্থক শব্দ', 'বিপরীতার্থক শব্দ', 'বিপরীত শব্দ', 'এককথায় প্রকাশ', 'এককথায় প্রকাশ', 'বাগধারা', 'প্রবাদ', 'পারিভাষিক শব্দ', 'বিদেশি শব্দ', 'বানান', 'শুদ্ধ প্রয়োগ', 'শুদ্ধ-অশুদ্ধ', 'বাক্য শুদ্ধিকরণ', 'যতিচিহ্ন', 'বিরামচিহ্ন', 'প্রকৃতি ও প্রত্যয়', 'ধাতু', 'উক্তি পরিবর্তন', 'বাচ্য পরিবর্তন'].some(k => t.includes(k))) {
      const banglaGrammarIcons = [Languages, Type, SpellCheck, BookA, NotebookTabs, WholeWord, TextCursor, Pilcrow, CaseSensitive, Brackets];
      return { ...baseColor, icon: banglaGrammarIcons[Math.abs(hash) % banglaGrammarIcons.length] };
    }

    // 2. বাংলা সাহিত্য (Bangla Literature)
    if (['বাংলা সাহিত্য', 'প্রাচীন যুগ', 'চর্যাপদ', 'মধ্যযুগ', 'শ্রীকৃষ্ণকীর্তন', 'মঙ্গলকাব্য', 'বৈষ্ণব পদাবলী', 'ইউসুফ জুলেখা', 'পদ্মাবতী', 'লোকসাহিত্য', 'মৈমনসিংহ গীতিকা', 'নাথ সাহিত্য', 'মরমি সাহিত্য', 'বাউল গান', 'লালন শাহ', 'শাহ আবদুল করিম', 'প্রণয়োপাখ্যান', 'আধুনিক যুগ', 'ফোর্ট উইলিয়াম', 'ঈশ্বরচন্দ্র বিদ্যাসাগর', 'মাইকেল মধুসূদন', 'বঙ্কিমচন্দ্র', 'মীর মশাররফ', 'রবীন্দ্রনাথ', 'কাজী নজরুল', 'জীবনানন্দ', 'জসীম উদ্‌দীন', 'বেগম রোকেয়া', 'তারাশঙ্কর', 'মানিক বন্দ্যোপাধ্যায়', 'বিভূতিভূষণ', 'শওকত ওসমান', 'সৈয়দ ওয়ালীউল্লাহ্', 'মুনীর চৌধুরী', 'শামসুর রাহমান', 'আল মাহমুদ', 'হুমায়ূন আহমেদ', 'আখতারুজ্জামান ইলিয়াস', 'সেলিনা হোসেন', 'সৈয়দ শামসুল হক', 'উপন্যাস', 'কবিতা', 'নাটক', 'প্রবন্ধ', 'মহাকাব্য'].some(k => t.includes(k))) {
      const banglaLitIcons = [BookOpen, BookOpenText, Library, Feather, PenTool, Scroll, Notebook, Quote, BookMarked, GraduationCap, PenLine, BookCopy];
      return { ...baseColor, icon: banglaLitIcons[Math.abs(hash) % banglaLitIcons.length] };
    }

    // 3. English Grammar
    if (['english grammar', 'parts of speech', 'article', 'gender', 'person', 'case', 'tense', 'right form of verb', 'subject-verb agreement', 'voice change', 'voice', 'narration', 'speech', 'transformation of sentences', 'degree', 'conditional sentence', 'clause', 'phrase', 'modifier', 'preposition', 'conjunction', 'appropriate preposition', 'synonym', 'antonym', 'one word substitution', 'idioms & phrases', 'idioms', 'phrasal verb', 'group verb', 'spelling', 'vocabulary', 'analogy', 'completing sentence', 'sentence correction', 'error detection', 'fill in the blanks', 'cloze test', 'tag question', 'question formation', 'parallelism', 'redundancy', 'translation', 'comprehension', 'rearrangement', 'prefix', 'suffix', 'foreign words', 'proverbs'].some(k => t.includes(k))) {
      const englishGrammarIcons = [Languages, SpellCheck, WholeWord, CaseSensitive, Type, Brackets, TextCursor, Pilcrow, BookA, BadgeCheck];
      return { ...baseColor, icon: englishGrammarIcons[Math.abs(hash) % englishGrammarIcons.length] };
    }

    // 4. English Literature
    if (['english literature', 'literary terms', 'figures of speech', 'literary ages', 'old english', 'middle english', 'renaissance', 'elizabethan', 'jacobean', 'puritan', 'restoration', 'neoclassical', 'augustan', 'romantic age', 'victorian age', 'modern age', 'postmodern', 'william shakespeare', 'shakespeare', 'john milton', 'wordsworth', 'coleridge', 'lord byron', 'shelley', 'keats', 'blake', 'jane austen', 'charles dickens', 'thomas hardy', 'bernard shaw', 't.s. eliot', 'w.b. yeats', 'hemingway', 'george orwell', 'drama', 'poetry', 'novel'].some(k => t.includes(k))) {
      const englishLitIcons = [BookOpen, Library, Feather, ScrollText, Quote, PenTool, BookMarked, NotebookPen, BookOpenText, GraduationCap, Theater];
      return { ...baseColor, icon: englishLitIcons[Math.abs(hash) % englishLitIcons.length] };
    }

    // 5. গণিত / Mathematics
    if (['গণিত', 'math', 'mathematics', 'পাটিগণিত', 'বাস্তব সংখ্যা', 'লসাগু', 'গসাগু', 'শতকরা', 'লাভ-ক্ষতি', 'লাভ ক্ষতি', 'মুনাফা', 'অনুপাত', 'সমানুপাত', 'ভগ্নাংশ', 'দশমিক', 'ঐকিক নিয়ম', 'ঐকিক নিয়ম', 'কাজ ও সময়', 'কাজ ও সময়', 'নল ও চৌবাচ্চা', 'গতি ও দূরত্ব', 'নৌকা ও স্রোত', 'নৌকা', 'স্রোত', 'ট্রেন', 'বীজগণিত', 'সূচক', 'লগারিদম', 'ধারা', 'সমান্তর ধারা', 'গুণোত্তর ধারা', 'দ্বিপদী', 'সমীকরণ', 'অসমতা', 'ফাংশন', 'সেট', 'বিন্যাস', 'সমাবেশ', 'সম্ভাবনা', 'জ্যামিতি', 'কোণ', 'ত্রিভুজ', 'চতুর্ভুজ', 'বৃত্ত', 'পরিমিতি', 'ত্রিকোণমিতি', 'ক্যালকুলাস', 'স্থানাঙ্ক জ্যামিতি'].some(k => t.includes(k))) {
      const mathIcons = [Calculator, Sigma, Radical, Pi, Percent, Divide, SquareFunction, Equal, Variable, Binary, ChartNoAxesColumn];
      return { ...baseColor, icon: mathIcons[Math.abs(hash) % mathIcons.length] };
    }

    // 6. মানসিক দক্ষতা / Mental Ability
    if (['মানসিক দক্ষতা', 'mental ability', 'যুক্তি', 'লজিক', 'logic', 'ধাঁধা', 'পাজল', 'puzzle', 'চিত্র', 'ঘড়ি', 'ঘড়ির কাঁটা', 'ক্যালেন্ডার', 'দিক নির্ণয়', 'দিক নির্ণয়', 'রক্তের সম্পর্ক', 'সম্পর্ক', 'কোডিং', 'ডিকোডিং', 'অনুরূপ', 'সাদৃশ্য', 'সিরিজ', 'সংখ্যা শ্রেণি', 'অক্ষর শ্রেণি', 'দর্পণ', 'প্রতিবিম্ব', 'ঘনক', 'আইকিউ', 'iq'].some(k => t.includes(k))) {
      const mentalIcons = [Brain, BrainCircuit, Puzzle, Lightbulb, Blocks, Route, Network, ScanSearch, Workflow, GitBranch, Shapes, Waypoints];
      return { ...baseColor, icon: mentalIcons[Math.abs(hash) % mentalIcons.length] };
    }

    // 7. বাংলাদেশ বিষয়াবলি (Bangladesh Affairs)
    if (['বাংলাদেশ বিষয়াবলি', 'বাংলাদেশ বিষয়াবলি', 'বাংলাদেশ', 'bangladesh', 'প্রাচীন বাংলার ইতিহাস', 'জনপদ', 'মৌর্য', 'গুপ্ত', 'শশাঙ্ক', 'পাল বংশ', 'সেন বংশ', 'সুলতানি আমল', 'মুঘল আমল', 'নবাবী আমল', 'ব্রিটিশ শাসন', 'পলাশীর যুদ্ধ', 'সিপাহি বিদ্রোহ', 'বঙ্গভঙ্গ', 'পাকিস্তান আমল', 'ভাষা আন্দোলন', 'যুক্তফ্রন্ট', 'ছয় দফা', '৬ দফা', 'গণঅভ্যুত্থান', '৭০ এর নির্বাচন', 'ঐতিহাসিক স্থান', 'প্রত্নতাত্ত্বিক', 'সীমানা', 'ছিটমহল', 'সমুদ্রসীমা', 'আদমশুমারি', 'জনশুমারি', 'উপজাতি', 'ক্ষুদ্র নৃগোষ্ঠী', 'জাতীয় প্রতীক'].some(k => t.includes(k))) {
      const bdIcons = [LucideMapIcon, MapPinned, Landmark, Flag, Building2, Scale, BadgeCheck, ScrollText, Users, Factory, Wheat];
      return { ...baseColor, icon: bdIcons[Math.abs(hash) % bdIcons.length] };
    }

    // 8. আন্তর্জাতিক বিষয়াবলি (International Affairs)
    if (['আন্তর্জাতিক বিষয়াবলি', 'আন্তর্জাতিক বিষয়াবলি', 'আন্তর্জাতিক', 'international affairs', 'বিশ্ব রাজনীতি', 'ভূ-রাজনীতি', 'geopolitics', 'জাতিসংঘ', 'united nations', 'সাধারণ পরিষদ', 'নিরাপত্তা পরিষদ', 'আন্তর্জাতিক সংস্থা', 'আঞ্চলিক সংস্থা', 'সার্ক', 'আসিয়ান', 'ন্যাটো', 'ব্রিকস', 'ইউপিপিপি', 'বিশ্বব্যাংক', 'আন্তর্জাতিক চুক্তি', 'সম্মেলন', 'প্রথম বিশ্বযুদ্ধ', 'দ্বিতীয় বিশ্বযুদ্ধ', 'স্নায়ুযুদ্ধ', 'উপসাগরীয় যুদ্ধ', 'প্রণালী', 'খাল', 'দ্বীপ', 'উপদ্বীপ', 'সীমান্ত রেখা', 'বিরোধপূর্ণ অঞ্চল', 'নোবেল পুরস্কার', 'বিশ্বের বৃহত্তম'].some(k => t.includes(k))) {
      const intlIcons = [Globe, Earth, Landmark, Flag, Handshake, Plane, LucideMapIcon, Ship, Languages, Network, Building];
      return { ...baseColor, icon: intlIcons[Math.abs(hash) % intlIcons.length] };
    }

    // 9. সাধারণ বিজ্ঞান (General Science)
    if (['সাধারণ বিজ্ঞান', 'বিজ্ঞান', 'science', 'পদার্থবিজ্ঞান', 'পদার্থের অবস্থা', 'গতি', 'বল', 'মহাকর্ষ', 'অভিকর্ষ', 'কাজ, ক্ষমতা ও শক্তি', 'শব্দ', 'আলো', 'তাপ ও তাপমাত্রা', 'বিদ্যুৎ', 'চৌম্বকত্ব', 'আধুনিক পদার্থবিজ্ঞান', 'তেজস্ক্রিয়তা', 'রসায়ন', 'পরমাণুর গঠন', 'পর্যায় সারণি', 'রাসায়নিক বন্ধন', 'এসিড', 'ক্ষার', 'লবণ', 'রাসায়নিক বিক্রিয়া', 'জারণ বিজারণ', 'ধাতু ও অধাতু', 'পলিমার', 'প্লাস্টিক', 'জীববিজ্ঞান', 'কোষ', 'টিস্যু', 'অঙ্গ সংস্থান', 'জিনতত্ত্ব', 'বংশগতি', 'ডিএনএ', 'আরএনএ', 'উদ্ভিদের শ্রেণিবিন্যাস', 'সালোকসংশ্লেষণ', 'শ্বসন', 'খাদ্য ও পুষ্টি', 'ভিটামিন', 'খনিজ', 'মানবদেহের অঙ্গসংস্থান', 'রক্ত সংবহন', 'হৃদরোগ', 'স্নায়ুতন্ত্র', 'মস্তিষ্ক', 'হরমোন', 'রোগব্যাধি', 'ব্যাকটেরিয়া', 'ভাইরাস', 'টিকা', 'physics', 'chemistry', 'biology'].some(k => t.includes(k))) {
      const scienceIcons = [Atom, FlaskConical, Microscope, Telescope, Dna, TestTube, TestTubes, Orbit, Magnet, Zap, Thermometer, Leaf, Radiation];
      return { ...baseColor, icon: scienceIcons[Math.abs(hash) % scienceIcons.length] };
    }

    // 10. ICT / Computer
    if (['ict', 'computer', 'তথ্য ও যোগাযোগ প্রযুক্তি', 'কম্পিউটার', 'কম্পিউটার সংগঠন', 'হার্ডওয়্যার', 'সিপিইউ', 'মেমোরি', 'রম', 'র‍্যাম', 'ইনপুট আউটপুট ডিভাইস', 'সফটওয়্যার', 'অপারেটিং সিস্টেম', 'উইন্ডোজ', 'লিনাক্স', 'ডাটাবেজ', 'sql', 'কম্পিউটার নেটওয়ার্ক', 'টপোলজি', 'ল্যান', 'ওয়ান', 'ইন্টারনেট', 'আইপি এড্রেস', 'ওয়েব টেকনোলজি', 'html', 'সাইবার নিরাপত্তা', 'ম্যালওয়্যার', 'ভাইরাস', 'ফায়ারওয়াল', 'ক্রিপ্টোগ্রাফি', 'এনক্রিপশন', 'ক্লাউড কম্পিউটিং', 'কৃত্রিম বুদ্ধিমত্তা', 'মেশিন লার্নিং', 'রোবটিক্স', 'আইওটি', 'ব্লকচেইন', 'প্রোগ্রামিং', 'সি প্রোগ্রামিং', 'পাইথন'].some(k => t.includes(k))) {
      const ictIcons = [Monitor, Computer, Cpu, Microchip, Binary, Database, Server, Wifi, Network, Code2, Terminal, Cloud];
      return { ...baseColor, icon: ictIcons[Math.abs(hash) % ictIcons.length] };
    }

    // 11. ভূগোল (Geography)
    if (['ভূগোল', 'geography', 'বাংলাদেশের ভূগোল', 'ভূ-প্রকৃতি', 'পাহাড়', 'সমভূমি', 'বদ্বীপ', 'নদ-নদী', 'হাওর', 'বিল', 'ঝরনা', 'জলপ্রপাত', 'দ্বীপ', 'চর', 'সাগর', 'উপসাগর', 'বঙ্গোপসাগর', 'বিশ্ব ভূগোল', 'মহাদেশ', 'মহাসাগর', 'পর্বতমালা', 'মরুভূমি', 'নদী ও জলপ্রপাত', 'অক্ষাংশ', 'দ্রাঘিমাংশ', 'প্রতিপাদ স্থান', 'স্থানীয় সময়', 'প্রমাণ সময়', 'বায়ুমণ্ডল', 'বায়ুপ্রবাহ', 'বায়ুচাপ', 'বারিমণ্ডল', 'সমুদ্রস্রোত', 'জোয়ার-ভাটা', 'অশ্মমণ্ডল', 'শিলা', 'খনিজ'].some(k => t.includes(k))) {
      const geoIcons = [Earth, Globe, LucideMapIcon, MapPinned, Mountain, Waves, Compass, Navigation, Trees, Sun, Cloud];
      return { ...baseColor, icon: geoIcons[Math.abs(hash) % geoIcons.length] };
    }

    // 12. পরিবেশ (Environment)
    if (['পরিবেশ', 'environment', 'বাস্তুতন্ত্র', 'বাস্তুসংস্থান', 'খাদ্য শৃঙ্খল', 'খাদ্য জাল', 'জীববৈচিত্র্য', 'সংরক্ষণ', 'সুন্দরবন', 'ম্যানগ্রোভ', 'জাতীয় উদ্যান', 'অভয়ারণ্য', 'পরিবেশ দূষণ', 'বায়ু দূষণ', 'পানি দূষণ', 'মাটি দূষণ', 'শব্দ দূষণ', 'প্লাস্টিক দূষণ', 'গ্রিনহাউস প্রভাব', 'বৈশ্বিক উষ্ণায়ন', 'জলবায়ু পরিবর্তন', 'কপ সম্মেলন', 'আইপিসিসি', 'প্যারিস চুক্তি', 'বনাঞ্চল', 'বনায়ন', 'পুনর্নবীকরণযোগ্য জ্বালানি', 'সৌরশক্তি', 'বায়ুশক্তি', 'টেকসই উন্নয়ন', 'এসডিজি'].some(k => t.includes(k))) {
      const envIcons = [Leaf, TreePine, Trees, Sprout, Recycle, Earth, Droplets, Wind, Sun, CloudSun, Flower, Flower2, Biohazard];
      return { ...baseColor, icon: envIcons[Math.abs(hash) % envIcons.length] };
    }

    // 13. দুর্যোগ ব্যবস্থাপনা (Disaster Management)
    if (['দুর্যোগ ব্যবস্থাপনা', 'disaster management', 'দুর্যোগের ধরন', 'প্রাকৃতিক দুর্যোগ', 'মানব সৃষ্ট দুর্যোগ', 'ঘূর্ণিঝড়', 'সাইক্লোন', 'বন্যা', 'খরা', 'নদীভাঙন', 'ভূমিকম্প', 'সুনামি', 'ভূমিধস', 'বজ্রপাত', 'জলোচ্ছ্বাস', 'পূর্বপ্রস্তুতি', 'সাড়া প্রদান', 'উদ্ধার', 'ত্রাণ ও পুনর্বাসন', 'দুর্যোগের ঝুঁকি হ্রাস', 'ফায়ার সার্ভিস', 'রেড ক্রিসেন্ট'].some(k => t.includes(k))) {
      const disasterIcons = [AlertTriangle, Siren, ShieldAlert, CloudLightning, Waves, Flame, LifeBuoy, Ambulance, Radio, Cross, ShieldCheck];
      return { ...baseColor, icon: disasterIcons[Math.abs(hash) % disasterIcons.length] };
    }

    // 14. নৈতিকতা / Ethics
    if (['নৈতিকতা', 'ethics', 'নৈতিকতার ধারণা', 'উৎস ও বিকাশ', 'নৈতিক মূল্যবোধ', 'নৈতিক মানদণ্ড', 'নৈতিক সিদ্ধান্ত গ্রহণ', 'সততা', 'ন্যায়পরায়ণতা', 'পেশাগত নৈতিকতা', 'চিকিৎসা নৈতিকতা', 'সাংবাদিকতা নৈতিকতা', 'আইনি নৈতিকতা', 'দুর্নীতি ও নৈতিকতা', 'দুর্নীতির কারণ', 'দুর্নীতি প্রতিরোধ', 'নৈতিক অবক্ষয়', 'মানবাধিকার ও নৈতিকতা'].some(k => t.includes(k))) {
      const ethicsIcons = [Scale, HeartHandshake, Handshake, ShieldCheck, BadgeCheck, Heart, UserCheck, CheckCircle2, ThumbsUp, Award, Gem];
      return { ...baseColor, icon: ethicsIcons[Math.abs(hash) % ethicsIcons.length] };
    }

    // 15. মূল্যবোধ / Values
    if (['মূল্যবোধ', 'values', 'সামাজিক মূল্যবোধ', 'পারিবারিক মূল্যবোধ', 'সাংস্কৃতিক মূল্যবোধ', 'গণতান্ত্রিক মূল্যবোধ', 'ধর্মীয় মূল্যবোধ', 'মূল্যবোধের শিক্ষা', 'সহনশীলতা', 'সহমর্মিতা', 'দেশপ্রেম', 'দায়িত্ববোধ ও কর্তব্যবোধ', 'পারস্পরিক শ্রদ্ধা', 'মানবিক মর্যাদা'].some(k => t.includes(k))) {
      const valuesIcons = [Heart, HandHeart, HeartHandshake, Users, Sparkles, BadgeCheck, ShieldCheck, Award, Star, Handshake, Smile, Gem];
      return { ...baseColor, icon: valuesIcons[Math.abs(hash) % valuesIcons.length] };
    }

    // 16. সুশাসন / Good Governance
    if (['সুশাসন', 'good governance', 'সুশাসনের ধারণা', 'আইনের শাসন', 'স্বচ্ছতা', 'জবাবদিহিতা', 'অংশগ্রহণমূলক শাসন', 'দক্ষতা ও কার্যকারিতা', 'ন্যায়পরায়ণতা ও অন্তর্ভুক্তিতা', 'সুশাসনের প্রতিবন্ধকতা', 'আমলাতন্ত্র ও সুশাসন', 'দুর্নীতি দমন কমিশন', 'দুদক', 'নাগরিক চার্টার', 'সিটিজেন চার্টার', 'তথ্য অধিকার আইন', 'ই-গভর্ন্যান্স', 'সুশাসনে বিচার বিভাগের ভূমিকা'].some(k => t.includes(k))) {
      const govIcons = [Landmark, Scale, ShieldCheck, Building2, Vote, Users, FileCheck, BadgeCheck, Handshake, Eye, ClipboardCheck, Gavel];
      return { ...baseColor, icon: govIcons[Math.abs(hash) % govIcons.length] };
    }

    // 17. Current Affairs / সাম্প্রতিক বিষয়
    if (['current affairs', 'সাম্প্রতিক বিষয়', 'সাম্প্রতিক বিষয়', 'সাম্প্রতিক ঘটনাপ্রবাহ', 'জাতীয় সাম্প্রতিক', 'আন্তর্জাতিক সাম্প্রতিক', 'সাম্প্রতিক চুক্তি', 'সম্মেলন ও বৈঠক', 'সাম্প্রতিক পুরস্কার', 'নোবেল', 'অস্কার', 'খেলাধুলার সাম্প্রতিক খবর', 'সাম্প্রতিক অর্থনৈতিক সূচক', 'জিডিপি', 'মুদ্রাস্ফীতি', 'বাজেট', 'নতুন আইন', 'বিল ও অধ্যাদেশ', 'সাম্প্রতিক আলোচিত ব্যক্তিত্ব', 'নিয়োগ ও পদত্যাগ'].some(k => t.includes(k))) {
      const currentIcons = [Newspaper, Radio, Rss, Megaphone, CalendarDays, Globe, Clock, Bell, TrendingUp, Tv, Podcast, MessageSquareMore];
      return { ...baseColor, icon: currentIcons[Math.abs(hash) % currentIcons.length] };
    }

    // 18. সাধারণ জ্ঞান / General Knowledge
    if (['সাধারণ জ্ঞান', 'general knowledge', 'gk', 'বিসিএস সাধারণ জ্ঞান', 'বিশ্বের প্রাচীনতম ও বৃহত্তম', 'প্রথম', 'দীর্ঘতম', 'উচ্চতম', 'বিখ্যাত আবিষ্কার ও আবিষ্কারক', 'বিখ্যাত ব্যক্তিত্ব', 'মনীষী', 'বিখ্যাত যুদ্ধ ও চুক্তি', 'বিখ্যাত বই ও লেখক', 'আন্তর্জাতিক দিবস', 'সদর দফতর', 'মুদ্রা', 'রাজধানী', 'পার্লামেন্ট', 'জাতীয় প্রতীক ও স্লোগান', 'বিখ্যাত দ্বীপ', 'প্রণালী ও জলপ্রপাত', 'আন্তর্জাতিক সম্মেলন'].some(k => t.includes(k))) {
      const gkIcons = [Brain, BookOpen, Lightbulb, Globe, Library, GraduationCap, CircleHelp, Trophy, Landmark, LucideMapIcon, Newspaper, Sparkles];
      return { ...baseColor, icon: gkIcons[Math.abs(hash) % gkIcons.length] };
    }

    // 19. ইতিহাস (History)
    if (['ইতিহাস', 'history', 'বিশ্বের প্রাচীন সভ্যতা', 'মেসোপটেমিয়া', 'মিশরীয়', 'সিন্ধু', 'গ্রিক', 'রোমান', 'মায়া ও ইনকা', 'মধ্যযুগীয় বিশ্ব', 'সামন্ততন্ত্র', 'ক্রুসেড', 'রেনেসাঁ', 'শিল্প বিপ্লব', 'আমেরিকান বিপ্লব', 'ফরাসি বিপ্লব', 'রুশ বিপ্লব', 'প্রথম বিশ্বযুদ্ধ ও জাতিসংঘ লিগ', 'দ্বিতীয় বিশ্বযুদ্ধ ও জাতিসংঘ', 'উপনিবেশবাদ ও স্বাধীনতা আন্দোলন', 'ভারত বিভাজন', 'স্নায়ুযুদ্ধ ও সোভিয়েত ইউনিয়ন পতন'].some(k => t.includes(k))) {
      const historyIcons = [History, Landmark, Scroll, ScrollText, Castle, Crown, Swords, Hourglass, BookOpen, Flag, Clock3];
      return { ...baseColor, icon: historyIcons[Math.abs(hash) % historyIcons.length] };
    }

    // 20. সংবিধান ও সরকার (Constitution & Governance)
    if (['সংবিধান', 'constitution', 'বাংলাদেশের সংবিধানের পটভূমি', 'সংবিধান প্রণয়ন', 'সংবিধানের বৈশিষ্ট্য', 'প্রস্তাবনা', 'রাষ্ট্র পরিচালনার মূলনীতি', 'মৌলিক অধিকার', 'সংবিধানের অনুচ্ছেদ ও তফসিল', 'সংবিধানের সংশোধনী', 'সরকার ব্যবস্থা', 'আইন বিভাগ', 'জাতীয় সংসদ', 'শাসন বিভাগ', 'রাষ্ট্রপতি ও প্রধানমন্ত্রী', 'বিচার বিভাগ', 'সুপ্রিম কোর্ট', 'সাংবিধানিক পদ ও সংস্থা', 'নির্বাচন কমিশন', 'পিএসসি', 'সিএজি', 'অ্যাটর্নি জেনারেল', 'স্থানীয় সরকার', 'ইউনিয়ন পরিষদ', 'উপজেলা', 'সিটি কর্পোরেশন'].some(k => t.includes(k))) {
      const constitutionIcons = [Landmark, Scale, Gavel, ScrollText, BookCheck, Vote, Building2, ShieldCheck, FileText, Users, BadgeCheck];
      return { ...baseColor, icon: constitutionIcons[Math.abs(hash) % constitutionIcons.length] };
    }

    // 21. অর্থনীতি (Economy)
    if (['অর্থনীতি', 'economy', 'অর্থনীতির মৌলিক ধারণা', 'ব্যষ্টিক ও সামষ্টিক অর্থনীতি', 'জিডিপি', 'জিএনপি', 'মাথাপিছু আয়', 'মুদ্রাস্ফীতি', 'মুদ্রা সংকোচন', 'রাজস্ব নীতি ও মুদ্রানীতি', 'বাজেট', 'আয়-ব্যয়', 'ঘাটতি', 'কর ব্যবস্থা', 'প্রত্যক্ষ ও পরোক্ষ কর', 'ভ্যাট', 'আন্তর্জাতিক বাণিজ্য', 'আমদানি', 'রপ্তানি', 'ব্যালেন্স অব পেমেন্ট', 'রেমিট্যান্স', 'বৈদেশিক মুদ্রা রিজার্ভ', 'দারিদ্র্য বিমোচন', 'এসডিজি', 'পঞ্চবার্ষিক পরিকল্পনা', 'অর্থনৈতিক সমীক্ষা'].some(k => t.includes(k))) {
      const economyIcons = [ChartNoAxesCombined, TrendingUp, Coins, Banknote, Landmark, Wallet, PiggyBank, Percent, CircleDollarSign, HandCoins, PieChart, Calculator];
      return { ...baseColor, icon: economyIcons[Math.abs(hash) % economyIcons.length] };
    }

    // 22. ব্যাংকিং (Banking)
    if (['ব্যাংকিং', 'ব্যাংক', 'banking', 'কেন্দ্রীয় ব্যাংক', 'বাংলাদেশ ব্যাংক', 'বাণিজ্যিক ব্যাংক', 'বিশেষায়িত ব্যাংক', 'ইসলামী ব্যাংকিং', 'মুদ্রা ও ঋণ ব্যবস্থা', 'সুদের হার', 'ব্যাংক হার', 'সিআরআর', 'এসএলআর', 'তারল্য', 'চেক', 'ডিমান্ড ড্রাফট', 'পে-অর্ডার', 'এটিএম', 'ক্রেডিট কার্ড', ' debit card', 'মোবাইল ফিন্যান্সিয়াল সার্ভিস', 'অনলাইন ব্যাংকিং', 'নন-ব্যাংক আর্থিক প্রতিষ্ঠান', 'মানি লন্ডারিং প্রতিরোধ'].some(k => t.includes(k))) {
      const bankingIcons = [Landmark, Banknote, CreditCard, WalletCards, Coins, CircleDollarSign, HandCoins, Receipt, ChartNoAxesCombined, PiggyBank, Vault, BadgeDollarSign];
      return { ...baseColor, icon: bankingIcons[Math.abs(hash) % bankingIcons.length] };
    }

    // 23. কৃষি (Agriculture)
    if (['কৃষি', 'agriculture', 'বাংলাদেশের প্রধান খাদ্যশস্য', 'ধান', 'গম', 'ভুট্টা', 'অর্থকরী ফসল', 'পাট', 'চা', 'আখ', 'তুলা', 'তৈলবীজ', 'ডাল ও মসলা', 'শাকসবজি ও ফলমূল', 'উদ্যানতত্ত্ব', 'কৃষি প্রযুক্তি ও উচ্চফলনশীল জাত', 'উফশী', 'হাইব্রিড', 'সেচ ব্যবস্থা ও সার প্রয়োগ', 'বালাই ব্যবস্থাপনা ও কীটনাশক', 'মৎস্য সম্পদ', 'অভ্যন্তরীণ ও সামুদ্রিক', 'প্রাণিসম্পদ', 'গবাদিপশু', 'পোল্ট্রি', 'দুগ্ধ শিল্প', 'কৃষি অর্থনীতি ও কৃষি ঋণ', 'কৃষি শুমারি'].some(k => t.includes(k))) {
      const agriIcons = [Wheat, Sprout, Tractor, Leaf, Trees, Shovel, Sun, Droplets, Apple, Flower, Warehouse, Earth];
      return { ...baseColor, icon: agriIcons[Math.abs(hash) % agriIcons.length] };
    }

    // 24. মুক্তিযুদ্ধ (Liberation War)
    if (['মুক্তিযুদ্ধ', 'liberation war', '৭ই মার্চের ঐতিহাসিক ভাষণ', '২৫শে মার্চের কালরাত', 'অপারেশন সার্চলাইট', '২৬শে মার্চ স্বাধীনতা ঘোষণা', 'মুজিবনগর সরকার গঠন ও শপথ', '১১টি সেক্টর ও সেক্টর কমান্ডার', 'মুক্তিবাহিনী', 'গেরিলা যুদ্ধ', 'ক্র্যাক প্লাটুন', 'বীরশ্রেষ্ঠ', 'বীর উত্তম', 'বীর বিক্রম', 'বীর প্রতীক', 'শহীদ বুদ্ধিজীবী হত্যাকাণ্ড', '১৪ই ডিসেম্বর', '১৬ই ডিসেম্বর বিজয় দিবস', 'আত্মসমর্পণ দলিল', 'মুক্তিযুদ্ধের বিদেশি বন্ধু', 'মুক্তিযুদ্ধভিত্তিক সাহিত্য ও চলচ্চিত্র', 'স্মৃতিসৌধ ও ভাস্কর্য'].some(k => t.includes(k))) {
      const liberationIcons = [Flag, Landmark, Shield, Star, Medal, Award, LucideMapIcon, History, ScrollText, Users, BadgeCheck, Flame];
      return { ...baseColor, icon: liberationIcons[Math.abs(hash) % liberationIcons.length] };
    }

    // 20. দুর্যোগ ব্যবস্থাপনা (Disaster Management)
    if (['দুর্যোগ ব্যবস্থাপনা', 'দুর্যোগ', 'disaster', 'disaster management', 'ঘূর্ণিঝড়', 'সাইক্লোন', 'বন্যা', 'খরা', 'নদীভাঙন', 'ভূমিকম্প', 'সুনামি', 'ভূমিধস', 'বজ্রপাত', 'জলোচ্ছ্বাস', 'পূর্বপ্রস্তুতি', 'সাড়া প্রদান', 'উদ্ধার', 'ত্রাণ ও পুনর্বাসন', 'দুর্যোগের ঝুঁকি হ্রাস', 'ফায়ার সার্ভিস', 'রেড ক্রিসেন্ট'].some(k => t.includes(k))) {
      const disasterIcons = [AlertTriangle, Siren, ShieldAlert, CloudLightning, Waves, Flame, LifeBuoy, Ambulance, Radio, Cross, ShieldCheck];
      return { ...baseColor, icon: disasterIcons[Math.abs(hash) % disasterIcons.length] };
    }

    // 14. নৈতিকতা / Ethics
    if (['নৈতিকতা', 'ethics', 'নৈতিকতার ধারণা', 'উৎস ও বিকাশ', 'নৈতিক মূল্যবোধ', 'নৈতিক মানদণ্ড', 'নৈতিক সিদ্ধান্ত গ্রহণ', 'সততা', 'ন্যায়পরায়ণতা', 'পেশাগত নৈতিকতা', 'চিকিৎসা নৈতিকতা', 'সাংবাদিকতা নৈতিকতা', 'আইনি নৈতিকতা', 'দুর্নীতি ও নৈতিকতা', 'দুর্নীতির কারণ', 'দুর্নীতি প্রতিরোধ', 'নৈতিক অবক্ষয়', 'মানবাধিকার ও নৈতিকতা'].some(k => t.includes(k))) {
      const ethicsIcons = [Scale, HeartHandshake, Handshake, ShieldCheck, BadgeCheck, Heart, UserCheck, CheckCircle2, ThumbsUp, Award, Gem];
      return { ...baseColor, icon: ethicsIcons[Math.abs(hash) % ethicsIcons.length] };
    }

    // 15. মূল্যবোধ / Values
    if (['মূল্যবোধ', 'values', 'সামাজিক মূল্যবোধ', 'পারিবারিক মূল্যবোধ', 'সাংস্কৃতিক মূল্যবোধ', 'গণতান্ত্রিক মূল্যবোধ', 'ধর্মীয় মূল্যবোধ', 'মূল্যবোধের শিক্ষা', 'সহনশীলতা', 'সহমর্মিতা', 'দেশপ্রেম', 'দায়িত্ববোধ ও কর্তব্যবোধ', 'পারস্পরিক শ্রদ্ধা', 'মানবিক মর্যাদা'].some(k => t.includes(k))) {
      const valuesIcons = [Heart, HandHeart, HeartHandshake, Users, Sparkles, BadgeCheck, ShieldCheck, Award, Star, Handshake, Smile, Gem];
      return { ...baseColor, icon: valuesIcons[Math.abs(hash) % valuesIcons.length] };
    }

    // 16. সুশাসন / Good Governance
    if (['সুশাসন', 'good governance', 'সুশাসনের ধারণা', 'আইনের শাসন', 'স্বচ্ছতা', 'জবাবদিহিতা', 'অংশগ্রহণমূলক শাসন', 'দক্ষতা ও কার্যকারিতা', 'ন্যায়পরায়ণতা ও অন্তর্ভুক্তিতা', 'সুশাসনের প্রতিবন্ধকতা', 'আমলাতন্ত্র ও সুশাসন', 'দুর্নীতি দমন কমিশন', 'দুদক', 'নাগরিক চার্টার', 'সিটিজেন চার্টার', 'তথ্য অধিকার আইন', 'ই-গভর্ন্যান্স', 'সুশাসনে বিচার বিভাগের ভূমিকা'].some(k => t.includes(k))) {
      const govIcons = [Landmark, Scale, ShieldCheck, Building2, Vote, Users, FileCheck, BadgeCheck, Handshake, Eye, ClipboardCheck, Gavel];
      return { ...baseColor, icon: govIcons[Math.abs(hash) % govIcons.length] };
    }

    // 17. Current Affairs / সাম্প্রতিক বিষয়
    if (['current affairs', 'সাম্প্রতিক বিষয়', 'সাম্প্রতিক বিষয়', 'সাম্প্রতিক ঘটনাপ্রবাহ', 'জাতীয় সাম্প্রতিক', 'আন্তর্জাতিক সাম্প্রতিক', 'সাম্প্রতিক চুক্তি', 'সম্মেলন ও বৈঠক', 'সাম্প্রতিক পুরস্কার', 'নোবেল', 'অস্কার', 'খেলাধুলার সাম্প্রতিক খবর', 'সাম্প্রতিক অর্থনৈতিক সূচক', 'জিডিপি', 'মুদ্রাস্ফীতি', 'বাজেট', 'নতুন আইন', 'বিল ও অধ্যাদেশ', 'সাম্প্রতিক আলোচিত ব্যক্তিত্ব', 'নিয়োগ ও পদত্যাগ'].some(k => t.includes(k))) {
      const currentIcons = [Newspaper, Radio, Rss, Megaphone, CalendarDays, Globe, Clock, Bell, TrendingUp, Tv, Podcast, MessageSquareMore];
      return { ...baseColor, icon: currentIcons[Math.abs(hash) % currentIcons.length] };
    }

    // 18. সাধারণ জ্ঞান / General Knowledge
    if (['সাধারণ জ্ঞান', 'general knowledge', 'gk', 'বিসিএস সাধারণ জ্ঞান', 'বিশ্বের প্রাচীনতম ও বৃহত্তম', 'প্রথম', 'দীর্ঘতম', 'উচ্চতম', 'বিখ্যাত আবিষ্কার ও আবিষ্কারক', 'বিখ্যাত ব্যক্তিত্ব', 'মনীষী', 'বিখ্যাত যুদ্ধ ও চুক্তি', 'বিখ্যাত বই ও লেখক', 'আন্তর্জাতিক দিবস', 'সদর দফতর', 'মুদ্রা', 'রাজধানী', 'পার্লামেন্ট', 'জাতীয় প্রতীক ও স্লোগান', 'বিখ্যাত দ্বীপ', 'প্রণালী ও জলপ্রপাত', 'আন্তর্জাতিক সম্মেলন'].some(k => t.includes(k))) {
      const gkIcons = [Brain, BookOpen, Lightbulb, Globe, Library, GraduationCap, CircleHelp, Trophy, Landmark, Map, Newspaper, Sparkles];
      return { ...baseColor, icon: gkIcons[Math.abs(hash) % gkIcons.length] };
    }

    // 19. ইতিহাস (History)
    if (['ইতিহাস', 'history', 'বিশ্বের প্রাচীন সভ্যতা', 'মেসোপটেমিয়া', 'মিশরীয়', 'সিন্ধু', 'গ্রিক', 'রোমান', 'মায়া ও ইনকা', 'মধ্যযুগীয় বিশ্ব', 'সামন্ততন্ত্র', 'ক্রুসেড', 'রেনেসাঁ', 'শিল্প বিপ্লব', 'আমেরিকান বিপ্লব', 'ফরাসি বিপ্লব', 'রুশ বিপ্লব', 'প্রথম বিশ্বযুদ্ধ ও জাতিসংঘ লিগ', 'দ্বিতীয় বিশ্বযুদ্ধ ও জাতিসংঘ', 'উপনিবেশবাদ ও স্বাধীনতা আন্দোলন', 'ভারত বিভাজন', 'স্নায়ুযুদ্ধ ও সোভিয়েত ইউনিয়ন পতন'].some(k => t.includes(k))) {
      const historyIcons = [History, Landmark, Scroll, ScrollText, Castle, Crown, Swords, Hourglass, BookOpen, Flag, Clock3];
      return { ...baseColor, icon: historyIcons[Math.abs(hash) % historyIcons.length] };
    }

    // 20. সংবিধান ও সরকার (Constitution & Governance)
    if (['সংবিধান', 'constitution', 'বাংলাদেশের সংবিধানের পটভূমি', 'সংবিধান প্রণয়ন', 'সংবিধানের বৈশিষ্ট্য', 'প্রস্তাবনা', 'রাষ্ট্র পরিচালনার মূলনীতি', 'মৌলিক অধিকার', 'সংবিধানের অনুচ্ছেদ ও তফসিল', 'সংবিধানের সংশোধনী', 'সরকার ব্যবস্থা', 'আইন বিভাগ', 'জাতীয় সংসদ', 'শাসন বিভাগ', 'রাষ্ট্রপতি ও প্রধানমন্ত্রী', 'বিচার বিভাগ', 'সুপ্রিম কোর্ট', 'সাংবিধানিক পদ ও সংস্থা', 'নির্বাচন কমিশন', 'পিএসসি', 'সিএজি', 'অ্যাটর্নি জেনারেল', 'স্থানীয় সরকার', 'ইউনিয়ন পরিষদ', 'উপজেলা', 'সিটি কর্পোরেশন'].some(k => t.includes(k))) {
      const constitutionIcons = [Landmark, Scale, Gavel, ScrollText, BookCheck, Vote, Building2, ShieldCheck, FileText, Users, BadgeCheck];
      return { ...baseColor, icon: constitutionIcons[Math.abs(hash) % constitutionIcons.length] };
    }

    // 21. অর্থনীতি (Economy)
    if (['অর্থনীতি', 'economy', 'অর্থনীতির মৌলিক ধারণা', 'ব্যষ্টিক ও সামষ্টিক অর্থনীতি', 'জিডিপি', 'জিএনপি', 'মাথাপিছু আয়', 'মুদ্রাস্ফীতি', 'মুদ্রা সংকোচন', 'রাজস্ব নীতি ও মুদ্রানীতি', 'বাজেট', 'আয়-ব্যয়', 'ঘাটতি', 'কর ব্যবস্থা', 'প্রত্যক্ষ ও পরোক্ষ কর', 'ভ্যাট', 'আন্তর্জাতিক বাণিজ্য', 'আমদানি', 'রপ্তানি', 'ব্যালেন্স অব পেমেন্ট', 'রেমিট্যান্স', 'বৈদেশিক মুদ্রা রিজার্ভ', 'দারিদ্র্য বিমোচন', 'এসডিজি', 'পঞ্চবার্ষিক পরিকল্পনা', 'অর্থনৈতিক সমীক্ষা'].some(k => t.includes(k))) {
      const economyIcons = [ChartNoAxesCombined, TrendingUp, Coins, Banknote, Landmark, Wallet, PiggyBank, Percent, CircleDollarSign, HandCoins, PieChart, Calculator];
      return { ...baseColor, icon: economyIcons[Math.abs(hash) % economyIcons.length] };
    }

    // 22. ব্যাংকিং (Banking)
    if (['ব্যাংকিং', 'ব্যাংক', 'banking', 'কেন্দ্রীয় ব্যাংক', 'বাংলাদেশ ব্যাংক', 'বাণিজ্যিক ব্যাংক', 'বিশেষায়িত ব্যাংক', 'ইসলামী ব্যাংকিং', 'মুদ্রা ও ঋণ ব্যবস্থা', 'সুদের হার', 'ব্যাংক হার', 'সিআরআর', 'এসএলআর', 'তারল্য', 'চেক', 'ডিমান্ড ড্রাফট', 'পে-অর্ডার', 'এটিএম', 'ক্রেডিট কার্ড', 'ডেবিট কার্ড', 'মোবাইল ফিন্যান্সিয়াল সার্ভিস', 'অনলাইন ব্যাংকিং', 'নন-ব্যাংক আর্থিক প্রতিষ্ঠান', 'মানি লন্ডারিং প্রতিরোধ'].some(k => t.includes(k))) {
      const bankingIcons = [Landmark, Banknote, CreditCard, WalletCards, Coins, CircleDollarSign, HandCoins, Receipt, ChartNoAxesCombined, PiggyBank, Vault, BadgeDollarSign];
      return { ...baseColor, icon: bankingIcons[Math.abs(hash) % bankingIcons.length] };
    }

    // 23. কৃষি (Agriculture)
    if (['কৃষি', 'agriculture', 'বাংলাদেশের প্রধান খাদ্যশস্য', 'ধান', 'গম', 'ভুট্টা', 'অর্থকরী ফসল', 'পাট', 'চা', 'আখ', 'তুলা', 'তৈলবীজ', 'ডাল ও মসলা', 'শাকসবজি ও ফলমূল', 'উদ্যানতত্ত্ব', 'কৃষি প্রযুক্তি ও উচ্চফলনশীল জাত', 'উফশী', 'হাইব্রিড', 'সেচ ব্যবস্থা ও সার প্রয়োগ', 'বালাই ব্যবস্থাপনা ও কীটনাশক', 'মৎস্য সম্পদ', 'অভ্যন্তরীণ ও সামুদ্রিক', 'প্রাণিসম্পদ', 'গবাদিপশু', 'পোল্ট্রি', 'দুগ্ধ শিল্প', 'কৃষি অর্থনীতি ও কৃষি ঋণ', 'কৃষি শুমারি'].some(k => t.includes(k))) {
      const agriIcons = [Wheat, Sprout, Tractor, Leaf, Trees, Shovel, Sun, Droplets, Apple, Flower, Warehouse, Earth];
      return { ...baseColor, icon: agriIcons[Math.abs(hash) % agriIcons.length] };
    }

    // 24. মুক্তিযুদ্ধ (Liberation War)
    if (['মুক্তিযুদ্ধ', 'liberation war', '৭ই মার্চের ঐতিহাসিক ভাষণ', '২৫শে মার্চের কালরাত', 'অপারেশন সার্চলাইট', '২৬শে মার্চ স্বাধীনতা ঘোষণা', 'মুজিবনগর সরকার গঠন ও শপথ', '১১টি সেক্টর ও সেক্টর কমান্ডার', 'মুক্তিবাহিনী', 'গেরিলা যুদ্ধ', 'ক্র্যাক প্লাটুন', 'বীরশ্রেষ্ঠ', 'বীর উত্তম', 'বীর বিক্রম', 'বীর প্রতীক', 'শহীদ বুদ্ধিজীবী হত্যাকাণ্ড', '১৪ই ডিসেম্বর', '১৬ই ডিসেম্বর বিজয় দিবস', 'আত্মসমর্পণ দলিল', 'মুক্তিযুদ্ধের বিদেশি বন্ধু', 'মুক্তিযুদ্ধভিত্তিক সাহিত্য ও চলচ্চিত্র', 'স্মৃতিসৌধ ও ভাস্কর্য'].some(k => t.includes(k))) {
      const liberationIcons = [Flag, Landmark, Shield, Star, Medal, Award, Map, History, ScrollText, Users, BadgeCheck, Flame];
      return { ...baseColor, icon: liberationIcons[Math.abs(hash) % liberationIcons.length] };
    }

    // 25. খেলাধুলা (Sports)
    if (['খেলাধুলা', 'sports', 'ক্রিকেট', 'আইসিসি', 'বিশ্বকাপ', 'টেস্ট', 'ওয়ানডে', 'টি-টোয়েন্টি', 'বাংলাদেশ ক্রিকেট', 'ফুটবল', 'ফিফা বিশ্বকাপ', 'কোপা আমেরিকা', 'ইউরো কাপ', 'চ্যাম্পিয়ন্স লিগ', 'অলিম্পিক গেমস', 'গ্রীষ্মকালীন ও শীতকালীন', 'প্যারাঅলিম্পিক', 'এশিয়ান গেমস', 'কমনওয়েলথ গেমস', 'এসএ গেমস', 'টেনিস', 'গ্র্যান্ড স্ল্যাম', 'উইম্বলডন', 'দাবা', 'গ্র্যান্ডমাস্টার', 'অ্যাথলেটিক্স', 'ব্যাডমিন্টন', 'হকি', 'সাঁতার', 'বিশ্বরেকর্ড', 'বিখ্যাত ক্রীড়াবিদ ও ট্রফি'].some(k => t.includes(k))) {
      const sportsIcons = [Trophy, Medal, Dumbbell, Volleyball, Bike, Goal, Timer, FlagTriangleRight, Target, Award];
      return { ...baseColor, icon: sportsIcons[Math.abs(hash) % sportsIcons.length] };
    }

    // Fallback: General Education & Study Library Icons
    const fallbackStudyIcons = [BookOpen, GraduationCap, Library, BookMarked, NotebookPen, Layers];
    return { ...baseColor, icon: fallbackStudyIcons[Math.abs(hash) % fallbackStudyIcons.length] };
  };

  const getDueCountForTopic = (topic: Topic) => {
    const t = topic.title.toLowerCase();
    if (t.includes('grammar')) return 6;
    if (t.includes('literature')) return 4;
    if (t.includes('physics')) return 5;
    if (t.includes('chem')) return 3;
    if (t.includes('math')) return 7;
    const uncompleted = topic.tasks.filter(tk => !tk.completed).length;
    return uncompleted > 0 ? Math.min(uncompleted, 5) : 0;
  };

  // Filter Counts for Pill Bar (Accurately calculates status counts)
  const filterCounts = useMemo(() => {
    const todayStr = getLocalDateString();
    const cAll = filteredTopics.length;
    const cCompleted = filteredTopics.filter(t => {
      const tasks = t.tasks || [];
      const tot = tasks.length;
      return tot > 0 && tasks.filter(tk => tk.completed).length === tot;
    }).length;

    const cInProgress = filteredTopics.filter(t => {
      const tasks = t.tasks || [];
      const tot = tasks.length;
      const comp = tasks.filter(tk => tk.completed).length;
      return comp > 0 && comp < tot;
    }).length;

    const cNotStarted = filteredTopics.filter(t => {
      const tasks = t.tasks || [];
      const comp = tasks.filter(tk => tk.completed).length;
      return comp === 0;
    }).length;

    const cOverdue = filteredTopics.filter(t => {
      const tasks = t.tasks || [];
      return tasks.some(tk => !tk.completed && tk.dueDate && tk.dueDate < todayStr);
    }).length;

    return {
      all: cAll,
      completed: cCompleted,
      inProgress: cInProgress,
      notStarted: cNotStarted,
      overdue: cOverdue
    };
  }, [filteredTopics]);

  const countAll = filterCounts.all;
  const countCompleted = filterCounts.completed;
  const countInProgress = filterCounts.inProgress;
  const countNotStarted = filterCounts.notStarted;
  const countOverdue = filterCounts.overdue;

  // Filtered & Sorted Topics based on statusFilter & sortCategory & sortDirection (Pinned items ALWAYS stay 1st at top)
  const displayTopics = useMemo(() => {
    const todayStr = getLocalDateString();
    let list = [...filteredTopics];

    if (statusFilter === 'completed') {
      list = list.filter(t => {
        const tasks = t.tasks || [];
        const tot = tasks.length;
        return tot > 0 && tasks.filter(tk => tk.completed).length === tot;
      });
    } else if (statusFilter === 'in_progress') {
      list = list.filter(t => {
        const tasks = t.tasks || [];
        const tot = tasks.length;
        const comp = tasks.filter(tk => tk.completed).length;
        return comp > 0 && comp < tot;
      });
    } else if (statusFilter === 'not_started') {
      list = list.filter(t => {
        const tasks = t.tasks || [];
        const comp = tasks.filter(tk => tk.completed).length;
        return comp === 0;
      });
    } else if (statusFilter === 'overdue') {
      list = list.filter(t => {
        const tasks = t.tasks || [];
        return tasks.some(tk => !tk.completed && tk.dueDate && tk.dueDate < todayStr);
      });
    }

    // Partition into pinned (stay untouched at top in exact pinned order) and unpinned (sorted below)
    const pinned = list.filter(t => t.isPinned);
    const unpinned = list.filter(t => !t.isPinned);

    // Topic timestamp helper for accurate Date sorting
    const getTopicTimestamp = (t: Topic): number => {
      if (t.createdAt) {
        const d = Date.parse(t.createdAt);
        if (!isNaN(d)) return d;
      }
      const match = t.id.match(/\b(\d{13})\b/) || t.id.match(/topic-(\d+)/) || t.id.match(/(\d+)/);
      if (match) {
        const n = parseInt(match[1], 10);
        if (!isNaN(n)) return n;
      }
      return 0;
    };

    // Apply sort to unpinned topics
    if (sortCategory === 'date') {
      unpinned.sort((a, b) => {
        const diff = getTopicTimestamp(a) - getTopicTimestamp(b);
        return sortDirection === 'asc' ? diff : -diff;
      });
    } else if (sortCategory === 'name') {
      unpinned.sort((a, b) => {
        const comp = a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: 'base' });
        return sortDirection === 'asc' ? comp : -comp;
      });
    } else if (sortCategory === 'progress') {
      const getP = (t: Topic) => {
        const tasks = t.tasks || [];
        return tasks.length > 0 ? tasks.filter(tk => tk.completed).length / tasks.length : 0;
      };
      unpinned.sort((a, b) => {
        const diff = getP(a) - getP(b);
        if (diff !== 0) return sortDirection === 'asc' ? diff : -diff;
        return a.title.localeCompare(b.title);
      });
    }

    return [...pinned, ...unpinned];
  }, [filteredTopics, statusFilter, sortCategory, sortDirection]);

  // --- Statistics Calculations ---
  const totalWorkspaceTasks = useMemo(() => {
    return currentWorkspaceTopics.reduce((acc, t) => acc + (t.tasks || []).length, 0);
  }, [currentWorkspaceTopics]);

  const completedWorkspaceTasks = useMemo(() => {
    return currentWorkspaceTopics.reduce(
      (acc, t) => acc + (t.tasks || []).filter(task => task.completed).length,
      0
    );
  }, [currentWorkspaceTopics]);

  const workspaceProgressPercent =
    totalWorkspaceTasks > 0 ? Math.round((completedWorkspaceTasks / totalWorkspaceTasks) * 100) : 0;

  const totalSectionTasks = useMemo(() => {
    return filteredTopics.reduce((acc, t) => acc + (t.tasks || []).length, 0);
  }, [filteredTopics]);

  const completedSectionTasks = useMemo(() => {
    return filteredTopics.reduce(
      (acc, t) => acc + (t.tasks || []).filter(task => task.completed).length,
      0
    );
  }, [filteredTopics]);

  const sectionProgressPercent =
    totalSectionTasks > 0 ? Math.round((completedSectionTasks / totalSectionTasks) * 100) : 0;

  // --- Cross-Workspace Breakdown & Today's Goal Engine ---
  const workspacesStats: WorkspaceGoalStat[] = useMemo(() => {
    const isSameDay = (timestampOrDate: number | string | Date) => {
      const d = new Date(timestampOrDate);
      if (isNaN(d.getTime())) return false;
      const now = new Date();
      return (
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth() &&
        d.getDate() === now.getDate()
      );
    };

    const isCompletedToday = (tk: any) => {
      if (!tk.completed) return false;
      if (tk.completedAtTime) return isSameDay(tk.completedAtTime);
      if (tk.completedAt) return isSameDay(tk.completedAt);
      return false;
    };

    const getTaskStudyMinutesToday = (tk: any): number => {
      // ONLY count today's study sessions (created exclusively by Timer sessions and "+ Add Time")
      if (tk.studySessions && Array.isArray(tk.studySessions) && tk.studySessions.length > 0) {
        const todaySecs = tk.studySessions
          .filter((s: any) => s && s.timestamp && isSameDay(s.timestamp))
          .reduce((sum: number, s: any) => sum + (s.durationSeconds || 0), 0);
        return Math.floor(todaySecs / 60);
      }
      return 0;
    };

    return workspaces.map(w => {
      const wsTopics = topics.filter(t => t.workspaceId === w.id);
      const allTasks = wsTopics.flatMap(t => t.tasks);
      const completedTodayCount = allTasks.filter(isCompletedToday).length;
      const totalCount = allTasks.length;
      const timeMinutes = allTasks.reduce((acc, t) => acc + getTaskStudyMinutesToday(t), 0);

      const todayTasks: GoalTaskItem[] = [];
      wsTopics.forEach(t => {
        const secName = t.section || 'General';
        (t.tasks || []).forEach(tk => {
          const timeMinsToday = getTaskStudyMinutesToday(tk);
          const isDoneToday = isCompletedToday(tk);
          if (isDoneToday || timeMinsToday > 0) {
            let latestTime = 0;
            if (tk.studySessions && Array.isArray(tk.studySessions) && tk.studySessions.length > 0) {
              const todaySessions = tk.studySessions.filter((s: any) => s && s.timestamp && isSameDay(s.timestamp));
              if (todaySessions.length > 0) {
                latestTime = Math.max(...todaySessions.map((s: any) => s.timestamp || 0));
              }
            }
            if (!latestTime && tk.completedAtTime) {
              latestTime = tk.completedAtTime;
            } else if (!latestTime && tk.completedAt) {
              latestTime = new Date(tk.completedAt).getTime() || 0;
            }

            todayTasks.push({
              id: tk.id,
              title: tk.title,
              topicId: t.id,
              topicTitle: t.title,
              sectionId: t.section || 'default',
              sectionName: secName,
              workspaceId: w.id,
              completed: tk.completed,
              completedAt: tk.completedAt,
              completedAtTime: tk.completedAtTime,
              timeSpentMinutesToday: timeMinsToday,
              latestActivityTime: latestTime,
            });
          }
        });
      });

      return {
        workspaceId: w.id,
        workspaceName: w.name,
        isStarred: w.isStarred,
        completedTasksCount: completedTodayCount,
        totalTasksCount: totalCount,
        timeSpentMinutes: timeMinutes,
        todayTasks,
      };
    });
  }, [workspaces, topics]);

  const globalCompletedTasksToday = useMemo(() => {
    return workspacesStats.reduce((acc, ws) => acc + ws.completedTasksCount, 0);
  }, [workspacesStats]);

  const globalTotalStudyMinutesToday = useMemo(() => {
    return workspacesStats.reduce((acc, ws) => acc + ws.timeSpentMinutes, 0);
  }, [workspacesStats]);

  const dailyGoalMode = userSettings.dailyGoalMode || 'tasks';
  const dailyTarget = userSettings.dailyTarget || 10;
  const dailyTimeTargetMinutes = userSettings.dailyTimeTargetMinutes || 120;

  const currentGoalValue = dailyGoalMode === 'time' ? globalTotalStudyMinutesToday : globalCompletedTasksToday;
  const targetGoalValue = dailyGoalMode === 'time' ? dailyTimeTargetMinutes : dailyTarget;
  const dailyGoalPercent = targetGoalValue > 0 ? Math.min(100, Math.round((currentGoalValue / targetGoalValue) * 100)) : 0;

  const isDailyGoalAchieved = targetGoalValue > 0 && currentGoalValue >= targetGoalValue;

  // Navigate to specific task from Today's Goal Popover
  const handleNavigateToGoalTask = (workspaceId: string, topicId: string, taskId: string) => {
    setIsGoalPopoverOpen(false);
    if (activeWorkspaceId !== workspaceId) {
      setActiveWorkspaceId(workspaceId);
      localStorage.setItem('study_flow_active_workspace', workspaceId);
    }
    setSelectedTopicId(topicId);
    setIsDetailsDrawerOpen(true);
    setRequestedFocusTaskId(taskId);
  };

  // Track Daily Goal Achievement & trigger celebration modal + streak update (only once per day)
  useEffect(() => {
    const todayStr = getLocalDateString();
    const alreadyCelebratedToday = localStorage.getItem('studyflow_goal_celebration_shown_date') === todayStr;

    if (isDailyGoalAchieved && !previousGoalAchievedRef.current) {
      const result = recordDailyGoalAchieved();
      setStreakData(loadStreakData());

      // Only pop up the celebration modal once per day upon goal achievement
      if (!alreadyCelebratedToday) {
        localStorage.setItem('studyflow_goal_celebration_shown_date', todayStr);
        if (result.isNewMilestone && result.milestone) {
          setLatestMilestoneInfo({
            isMilestone: true,
            title: result.milestone.title,
            icon: result.milestone.icon,
          });
        } else {
          setLatestMilestoneInfo({ isMilestone: false });
        }
        setIsGoalCelebrationOpen(true);
      }
    }
    previousGoalAchievedRef.current = isDailyGoalAchieved;
  }, [isDailyGoalAchieved]);

  const handleUpdateDailyGoalMode = (mode: 'tasks' | 'time') => {
    const updated = { ...userSettings, dailyGoalMode: mode };
    setUserSettings(updated);
    localStorage.setItem('studyflow_user_settings', JSON.stringify(updated));
  };

  const handleUpdateTaskTarget = (newTarget: number) => {
    const updated = { ...userSettings, dailyTarget: newTarget };
    setUserSettings(updated);
    localStorage.setItem('studyflow_user_settings', JSON.stringify(updated));
  };

  const handleUpdateDailyTimeTarget = (newMinutes: number) => {
    const updated = { ...userSettings, dailyTimeTargetMinutes: newMinutes };
    setUserSettings(updated);
    localStorage.setItem('studyflow_user_settings', JSON.stringify(updated));
  };

  // Selected Topic for Progress Panel & Overall Progress Card
  const currentTopic = useMemo(() => {
    if (selectedTopicId) {
      return topics.find(t => t.id === selectedTopicId) || null;
    }
    return null;
  }, [selectedTopicId, topics]);

  // Section Icons Mapping Helper for Variant 02 Header
  const getSectionIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('gramm') || n.includes('read')) return BookOpen;
    if (n.includes('vocab') || n.includes('word')) return FileText;
    if (n.includes('writ')) return PenTool;
    if (n.includes('speak') || n.includes('talk')) return Mic;
    if (n.includes('listen') || n.includes('audio')) return Headphones;
    return LayoutGrid;
  };

  // Section Display Name Truncator for Rule 1 (Max 25 Chars on screen + Tooltip)
  const formatSectionDisplayName = (name: string, maxLen = 25) => {
    if (!name) return '';
    if (name.length <= maxLen) return name;
    return name.slice(0, maxLen).trim() + '...';
  };

  // Accurate Font Character Width Measurement for precise Section Tab Fitting
  const getTextPixelWidth = (text: string) => {
    if (!text) return 0;
    let w = 0;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if ('MW'.includes(ch)) w += 10.5;
      else if ('ABCDGHNKOPQRSUVX'.includes(ch)) w += 8.5;
      else if ('IJFLTZ'.includes(ch)) w += 6.5;
      else if ('mw'.includes(ch)) w += 9.0;
      else if ('ijlrtf '.includes(ch)) w += 4.5;
      else w += 7.2;
    }
    return w;
  };

  // Dynamic Section visible & overflow calculation based on actual container width
  const [visibleSectionCount, setVisibleSectionCount] = useState<number>(5);
  const [sectionCharLimits, setSectionCharLimits] = useState<Record<string, number>>({});
  const middleHeaderContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateFittingSections = () => {
      if (!middleHeaderContainerRef.current) return;
      const availableWidth = middleHeaderContainerRef.current.clientWidth;
      if (availableWidth <= 0) return;

      const BUFFER_MARGIN_PX = 12; // Exactly 12px buffer margin to the left of Search icon border
      const MORE_BTN_WIDTH = 108; // width of "+ N More" button
      const GAP_PX = 6; // gap between pills

      const effectiveWidth = Math.max(0, availableWidth - BUFFER_MARGIN_PX);
      const total = currentWorkspaceSections.length;
      if (total === 0) {
        setVisibleSectionCount(0);
        setSectionCharLimits({});
        return;
      }

      const calcPillWidth = (name: string, charCount: number) => {
        const truncatedText = formatSectionDisplayName(name, charCount);
        const textWidth = getTextPixelWidth(truncatedText);
        return Math.max(72, textWidth + 56);
      };

      // 1. Check if ALL sections fit at 25 chars (or full name length)
      let totalAllWidth = 0;
      let allFit = true;
      for (let i = 0; i < total; i++) {
        const sec = currentWorkspaceSections[i];
        const secName = sec?.name || 'Section';
        const fullLen = Math.min(secName.length, 25);
        const pWidth = calcPillWidth(secName, fullLen) + (i > 0 ? GAP_PX : 0);
        if (totalAllWidth + pWidth > effectiveWidth) {
          allFit = false;
          break;
        }
        totalAllWidth += pWidth;
      }

      if (allFit) {
        setVisibleSectionCount(total);
        const limits: Record<string, number> = {};
        currentWorkspaceSections.forEach(s => {
          if (s) {
            const secName = s.name || 'Section';
            limits[s.id || secName] = Math.min(secName.length, 25);
          }
        });
        setSectionCharLimits(limits);
        return;
      }

      // 2. Sequential Expansion Algorithm (Section 1 grows 10->25, then Section 2 appears at 10 and grows 10->25, etc.)
      const spaceForPills = Math.max(0, effectiveWidth - MORE_BTN_WIDTH - GAP_PX);
      let remainingSpace = spaceForPills;
      let fitCount = 0;
      const limits: Record<string, number> = {};

      for (let i = 0; i < total; i++) {
        const sec = currentWorkspaceSections[i];
        if (!sec) continue;
        const secName = sec.name || 'Section';
        const secId = sec.id || secName;
        const fullLen = Math.min(secName.length, 25);
        const minPillWidth = calcPillWidth(secName, 10) + (i > 0 ? GAP_PX : 0);

        // Check if section i can fit at least 10 characters
        if (remainingSpace < minPillWidth) {
          break; // Cannot fit even 10 chars for section i
        }

        // Check if section i can fit its full length (up to 25 chars)
        const maxPillWidth = calcPillWidth(secName, fullLen) + (i > 0 ? GAP_PX : 0);
        if (remainingSpace >= maxPillWidth) {
          limits[secId] = fullLen;
          remainingSpace -= maxPillWidth;
          fitCount++;
        } else {
          // Section i fits partially between 10 and fullLen chars
          let bestChars = 10;
          for (let c = fullLen; c >= 10; c--) {
            if (calcPillWidth(secName, c) + (i > 0 ? GAP_PX : 0) <= remainingSpace) {
              bestChars = c;
              break;
            }
          }
          limits[secId] = bestChars;
          fitCount++;
          break; // Section i is growing, so section i+1 cannot appear yet until section i reaches max chars!
        }
      }

      setVisibleSectionCount(Math.min(total - 1, fitCount));
      setSectionCharLimits(limits);
    };

    updateFittingSections();

    const observer = new ResizeObserver(() => {
      updateFittingSections();
    });

    if (middleHeaderContainerRef.current) {
      observer.observe(middleHeaderContainerRef.current);
    }

    window.addEventListener('resize', updateFittingSections);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateFittingSections);
    };
  }, [currentWorkspaceSections, sidebarCollapsed]);

  // Global Event Listener to 100% block text selection & copy inside header
  useEffect(() => {
    const handleCopy = (e: ClipboardEvent) => {
      const selection = window.getSelection();
      if (!selection) return;
      const headerEl = document.querySelector('.no-copy-header');
      if (headerEl && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (headerEl.contains(range.commonAncestorContainer) || headerEl.contains(selection.anchorNode)) {
          e.preventDefault();
          if (e.clipboardData) e.clipboardData.setData('text/plain', '');
          selection.removeAllRanges();
        }
      }
    };

    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) return;
      const headerEl = document.querySelector('.no-copy-header');
      if (headerEl && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (headerEl.contains(range.commonAncestorContainer) || headerEl.contains(selection.anchorNode)) {
          selection.removeAllRanges();
        }
      }
    };

    document.addEventListener('copy', handleCopy);
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  const visibleHeaderSections = useMemo(() => {
    return currentWorkspaceSections.slice(0, visibleSectionCount);
  }, [currentWorkspaceSections, visibleSectionCount]);

  const overflowHeaderSections = useMemo(() => {
    return currentWorkspaceSections.slice(visibleSectionCount);
  }, [currentWorkspaceSections, visibleSectionCount]);

  const isOverflowSectionActive = useMemo(() => {
    return overflowHeaderSections.some(s => s.name === activeSection);
  }, [overflowHeaderSections, activeSection]);

  const currentTopicTotal = currentTopic ? currentTopic.tasks.length : 0;
  const currentTopicCompleted = currentTopic
    ? currentTopic.tasks.filter(t => t.completed).length
    : 0;
  const currentTopicPending = currentTopicTotal - currentTopicCompleted;

  // Active Context Calculations for Overall Progress Card
  const activeTopic = currentTopic;
  const activeTopicTitle = activeTopic ? activeTopic.title : activeSection;

  const activeTotalTasks = activeTopic ? (
    activeTopic.title.toLowerCase().includes('grammar') ? 24 :
    activeTopic.title.toLowerCase().includes('literature') ? 18 :
    activeTopic.title.toLowerCase().includes('physics') ? 22 :
    activeTopic.title.toLowerCase().includes('chem') ? 20 :
    activeTopic.title.toLowerCase().includes('math') ? 28 :
    activeTopic.title.toLowerCase().includes('part 1') ? 13 :
    activeTopic.title.toLowerCase().includes('khan') ? 8 :
    activeTopic.title.toLowerCase().includes('part 3') ? 9 :
    activeTopic.title.toLowerCase().includes('part 4') ? 7 :
    activeTopic.title.toLowerCase().includes('part 5') ? 6 :
    activeTopic.title.toLowerCase().includes('verb') ? 15 :
    activeTopic.title.toLowerCase().includes('tense') ? 9 :
    activeTopic.title.toLowerCase().includes('voice') ? 12 :
    activeTopic.tasks.length
  ) : totalWorkspaceTasks;

  const activeCompletedTasks = activeTopic ? (
    activeTopic.title.toLowerCase().includes('grammar') ? 16 :
    activeTopic.title.toLowerCase().includes('literature') ? 10 :
    activeTopic.title.toLowerCase().includes('physics') ? 14 :
    activeTopic.title.toLowerCase().includes('chem') ? 12 :
    activeTopic.title.toLowerCase().includes('math') ? 10 :
    activeTopic.title.toLowerCase().includes('part 1') ? 13 :
    activeTopic.title.toLowerCase().includes('khan') ? 8 :
    activeTopic.title.toLowerCase().includes('part 3') ? 9 :
    activeTopic.title.toLowerCase().includes('part 4') ? 0 :
    activeTopic.title.toLowerCase().includes('part 5') ? 0 :
    activeTopic.title.toLowerCase().includes('verb') ? 2 :
    activeTopic.title.toLowerCase().includes('tense') ? 0 :
    activeTopic.title.toLowerCase().includes('voice') ? 6 :
    activeTopic.tasks.filter(t => t.completed).length
  ) : completedWorkspaceTasks;

  const activeDueTasks = activeTopic
    ? getDueCountForTopic(activeTopic)
    : Math.max(0, totalWorkspaceTasks - completedWorkspaceTasks);

  const activeProgressPercent = activeTopic ? (
    activeTopic.title.toLowerCase().includes('grammar') ? 72 :
    activeTopic.title.toLowerCase().includes('literature') ? 58 :
    activeTopic.title.toLowerCase().includes('physics') ? 65 :
    activeTopic.title.toLowerCase().includes('chem') ? 60 :
    activeTopic.title.toLowerCase().includes('math') ? 45 :
    activeTopic.title.toLowerCase().includes('part 1') ? 100 :
    activeTopic.title.toLowerCase().includes('khan') ? 100 :
    activeTopic.title.toLowerCase().includes('part 3') ? 100 :
    activeTopic.title.toLowerCase().includes('part 4') ? 0 :
    activeTopic.title.toLowerCase().includes('part 5') ? 0 :
    activeTopic.title.toLowerCase().includes('verb') ? 13 :
    activeTopic.title.toLowerCase().includes('tense') ? 0 :
    activeTopic.title.toLowerCase().includes('voice') ? 50 :
    (activeTotalTasks > 0 ? Math.round((activeCompletedTasks / activeTotalTasks) * 100) : 0)
  ) : workspaceProgressPercent;

  const activeTotalTopics = currentWorkspaceTopics.length;

  // --- Smart Topic Generator Multi-Topic Parser ---
  const [isGeneratorSyntaxHelpOpen, setIsGeneratorSyntaxHelpOpen] = useState<boolean>(false);

  interface ParsedTopicStructure {
    topicTitle: string;
    topicNotes?: NoteItem[];
    topicLinks?: ResourceLink[];
    tasks: TaskItem[];
  }

  const parseSmartMarkdownTopics = (rawInput: string): ParsedTopicStructure[] => {
    const lines = rawInput.split('\n');
    const result: ParsedTopicStructure[] = [];

    let currentTopicTitle = '';
    let topicNotes: NoteItem[] = [];
    let topicLinks: ResourceLink[] = [];
    let tasks: TaskItem[] = [];

    let currentTask: {
      title: string;
      description?: string;
      notes: NoteItem[];
      links: ResourceLink[];
    } | null = null;

    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[now.getMonth()];
    const day = now.getDate();
    const year = now.getFullYear();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const formattedNoteDate = `${month} ${day}, ${year} • ${hours}:${minutes} ${ampm}`;
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    const parseLinkLine = (line: string): ResourceLink | null => {
      const content = line.substring(1).trim(); // Strip '@'
      if (!content) return null;
      
      let title = content;
      let url = content;
      let type: 'drive' | 'facebook' | 'youtube' | 'chrome' | 'pdf' = 'chrome';

      if (content.includes('|')) {
        const parts = content.split('|');
        title = parts[0].trim();
        url = parts.slice(1).join('|').trim();
      }

      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }

      const lowerUrl = url.toLowerCase();
      if (lowerUrl.includes('drive.google.com')) type = 'drive';
      else if (lowerUrl.includes('facebook.com') || lowerUrl.includes('fb.watch')) type = 'facebook';
      else if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) type = 'youtube';
      else if (lowerUrl.endsWith('.pdf')) type = 'pdf';

      return {
        id: `link-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: title || 'Resource Link',
        url: url,
        type
      };
    };

    const flushTask = () => {
      if (currentTask && currentTask.title) {
        tasks.push({
          id: `task-${Date.now()}-${tasks.length + 1}-${Math.random().toString(36).substring(2, 5)}`,
          title: currentTask.title,
          completed: false,
          date: formattedDate,
          time: formattedTime,
          description: currentTask.description,
          notes: currentTask.notes.length > 0 ? currentTask.notes : undefined,
          links: currentTask.links.length > 0 ? currentTask.links : undefined,
          priority: userSettings.defaultTaskPriority || 'none'
        });
        currentTask = null;
      }
    };

    const flushTopic = () => {
      flushTask();
      if (currentTopicTitle || tasks.length > 0) {
        result.push({
          topicTitle: currentTopicTitle || 'New Topic',
          topicNotes: topicNotes.length > 0 ? topicNotes : undefined,
          topicLinks: topicLinks.length > 0 ? topicLinks : undefined,
          tasks: [...tasks]
        });
      }
      currentTopicTitle = '';
      topicNotes = [];
      topicLinks = [];
      tasks = [];
    };

    for (let rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;

      if (line.startsWith('# ')) {
        // New Topic Header found -> Flush previous Topic block
        if (currentTopicTitle || tasks.length > 0) {
          flushTopic();
        }
        currentTopicTitle = line.substring(2).trim();
      } else if (line.startsWith('## ')) {
        // ## Task Header
        flushTask();
        currentTask = {
          title: line.substring(3).trim(),
          notes: [],
          links: []
        };
      } else if (line.startsWith('$ ')) {
        // $ Task Description
        const desc = line.substring(2).trim();
        if (currentTask) {
          currentTask.description = currentTask.description ? `${currentTask.description}\n${desc}` : desc;
        }
      } else if (line.startsWith('> ')) {
        // > Note Text
        const noteText = line.substring(2).trim();
        if (noteText) {
          const noteObj: NoteItem = {
            id: `note-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            text: noteText,
            date: formattedNoteDate
          };
          if (currentTask) {
            currentTask.notes.push(noteObj);
          } else {
            topicNotes.push(noteObj);
          }
        }
      } else if (line.startsWith('@ ')) {
        // @ Resource Link
        const linkObj = parseLinkLine(line);
        if (linkObj) {
          if (currentTask) {
            currentTask.links.push(linkObj);
          } else {
            topicLinks.push(linkObj);
          }
        }
      }
    }

    flushTopic();
    return result;
  };

  const handleQuickAddTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!generatorInput.trim() || isGenerating) return;

    const raw = generatorInput.trim();
    const isMarkdownFormat = raw.includes('\n') || raw.startsWith('#') || raw.includes('## ') || raw.includes('> ') || raw.includes('@ ') || raw.includes('$ ');

    let parsedTopics: ParsedTopicStructure[] = [];

    if (isMarkdownFormat) {
      parsedTopics = parseSmartMarkdownTopics(raw);
    } else {
      let topicTitle = raw;
      let prefix = 'Subtask';
      let taskCount = 0;

      const advMatch = raw.match(/^(.*?)\s*\[\s*([^,\d]+?)\s*,\s*(\d+)\s*\]$/);
      if (advMatch) {
        topicTitle = advMatch[1].trim() || raw;
        prefix = advMatch[2].trim() || 'Subtask';
        taskCount = parseInt(advMatch[3], 10) || 0;
      } else {
        const simpleMatch = raw.match(/^(.*?)\s*\[\s*(\d+)\s*\]$/);
        if (simpleMatch) {
          topicTitle = simpleMatch[1].trim() || raw;
          prefix = 'Subtask';
          taskCount = parseInt(simpleMatch[2], 10) || 0;
        } else {
          topicTitle = raw;
          taskCount = 0;
        }
      }

      const now = new Date();
      const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
      const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

      const newTaskIdPrefix = `t-${Date.now()}`;
      const generatedTasks = Array.from({ length: taskCount }).map((_, i) => ({
        id: `${newTaskIdPrefix}-${i + 1}`,
        title: `${prefix} ${i + 1}`,
        completed: false,
        date: formattedDate,
        time: formattedTime,
        priority: userSettings.defaultTaskPriority || 'none'
      }));

      parsedTopics = [{
        topicTitle,
        tasks: generatedTasks
      }];
    }

    if (parsedTopics.length === 0) {
      showToast('⚠️ No topics could be parsed from input.');
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      const targetWsId = activeWorkspaceId || workspaces[0]?.id || 'workspace-default';
      const targetSection = activeSection || currentWorkspaceSections[0]?.name || '';
      const newTopics: Topic[] = [];

      parsedTopics.forEach((pt, index) => {
        const normalizedTitle = pt.topicTitle.replace(/\s+/g, ' ').trim() || `Topic ${index + 1}`;
        const newTopicId = `topic-${Date.now()}-${index}`;

        newTopics.push({
          id: newTopicId,
          title: normalizedTitle,
          section: targetSection,
          expanded: true,
          isPinned: false,
          workspaceId: targetWsId,
          tasks: pt.tasks,
          notes: pt.topicNotes,
          links: pt.topicLinks
        });
      });

      setTopics(prev => [...newTopics, ...prev]);
      setGeneratorInput('');
      setIsGenerating(false);

      if (newTopics.length === 1) {
        showToast(`Created "${newTopics[0].title}" with ${newTopics[0].tasks.length} task(s)!`);
      } else {
        const totalTasks = newTopics.reduce((acc, t) => acc + t.tasks.length, 0);
        showToast(`Successfully created ${newTopics.length} topics (${totalTasks} total tasks)!`);
      }

      setTimeout(() => {
        const firstTopicId = newTopics[0]?.id;
        if (firstTopicId) {
          const el = document.getElementById(firstTopicId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }, 150);
    }, 400);
  };

  // --- Handlers ---
  const toggleTaskCompleted = (topicId: string, taskId: string) => {
    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[now.getMonth()];
    const day = now.getDate();
    const year = now.getFullYear();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const nowStr = `${month} ${day}, ${year} • ${hours}:${minutes} ${ampm}`;

    const targetTopic = topics.find(t => t.id === topicId);
    const targetTask = targetTopic?.tasks.find(t => t.id === taskId);
    const isChecking = targetTask ? !targetTask.completed : true;

    if (isChecking && targetTopic) {
      const otherTasks = targetTopic.tasks.filter(t => t.id !== taskId);
      const isLastTask = otherTasks.length > 0 ? otherTasks.every(t => t.completed) : true;

      // Trigger task completion confetti only if enabled in settings (exact same grand celebration for every task)
      if (userSettings.confettiCelebration !== false) {
        triggerTopicCompleteCelebration();
      }

      if (isLastTask) {
        // FULL TOPIC 100% COMPLETED: Fanfare chime + Center Celebration Dialog
        if (userSettings.soundEffects !== false) {
          soundManager.playTopicCompleteFanfare();
        }
        
        const totalMinutes = targetTopic.tasks.reduce((acc, tk) => acc + (tk.timeSpentMinutes || 0), 0);
        const wsObj = workspaces.find(w => w.id === targetTopic.workspaceId);

        setCongratulationsTopic({
          id: targetTopic.id,
          title: targetTopic.title,
          workspaceName: wsObj?.name,
          sectionName: targetTopic.section,
          taskCount: targetTopic.tasks.length,
          timeSpentMinutes: totalMinutes,
        });
      } else {
        // Normal individual task checked: Crisp check sound if enabled in settings
        if (userSettings.soundEffects !== false) {
          soundManager.playTaskCheck();
        }
      }
    }

    setTopics(prev =>
      prev.map(t => {
        if (t.id === topicId) {
          return {
            ...t,
            tasks: t.tasks.map(task =>
              task.id === taskId
                ? {
                    ...task,
                    completed: !task.completed,
                    completedAt: !task.completed ? nowStr : undefined,
                    completedAtTime: !task.completed ? Date.now() : undefined
                  }
                : task
            )
          };
        }
        return t;
      })
    );
  };

  const toggleMarkAllTopic = (topicId: string) => {
    const targetTopic = topics.find(t => t.id === topicId);
    if (targetTopic && targetTopic.tasks.length > 0) {
      const willBeAllDone = !targetTopic.tasks.every(task => task.completed);
      if (willBeAllDone) {
        if (userSettings.confettiCelebration !== false) {
          triggerTopicCompleteCelebration();
        }
        if (userSettings.soundEffects !== false) {
          soundManager.playTopicCompleteFanfare();
        }
        const totalMinutes = targetTopic.tasks.reduce((acc, tk) => acc + (tk.timeSpentMinutes || 0), 0);
        const wsObj = workspaces.find(w => w.id === targetTopic.workspaceId);
        setCongratulationsTopic({
          id: targetTopic.id,
          title: targetTopic.title,
          workspaceName: wsObj?.name,
          sectionName: targetTopic.section,
          taskCount: targetTopic.tasks.length,
          timeSpentMinutes: totalMinutes,
        });
      }
    }

    setTopics(prev =>
      prev.map(t => {
        if (t.id === topicId) {
          const allDone = t.tasks.every(task => task.completed);
          const nowStr = new Date().toISOString();
          const nowTime = Date.now();
          return {
            ...t,
            tasks: t.tasks.map(task => ({
              ...task,
              completed: !allDone,
              completedAt: !allDone ? nowStr : undefined,
              completedAtTime: !allDone ? nowTime : undefined,
            }))
          };
        }
        return t;
      })
    );
  };

  const togglePinTopic = (topicId: string) => {
    const target = topics.find(t => t.id === topicId);
    if (!target) return;
    setAnimatingPinTopicId(topicId);
    const nextPinned = !target.isPinned;
    setTopics(prev =>
      prev.map(t => (t.id === topicId ? { ...t, isPinned: nextPinned } : t))
    );
    showToast(nextPinned ? `Pinned "${target.title}" to top!` : `Unpinned "${target.title}"`);
    setTimeout(() => {
      setAnimatingPinTopicId(null);
    }, 420);
  };

  const handleSaveRenameTopic = (topicId: string, newTitleRaw: string) => {
    const target = topics.find(t => t.id === topicId);
    if (!target) return false;

    const normalized = newTitleRaw.replace(/\s+/g, ' ').trim();
    if (!normalized) {
      showToast('⚠️ Topic name must be at least 1 character long.');
      return false;
    }
    if (normalized.length > 45) {
      showToast(`⚠️ Topic name cannot exceed 45 characters (${normalized.length}/45 characters).`);
      return false;
    }

    const isDuplicate = topics.some(
      t =>
        t.id !== topicId &&
        t.workspaceId === target.workspaceId &&
        t.section === target.section &&
        t.title.toLowerCase() === normalized.toLowerCase()
    );

    if (isDuplicate) {
      showToast('A topic with this name already exists in this section');
      return false;
    }

    setTopics(prev =>
      prev.map(t => (t.id === topicId ? { ...t, title: normalized } : t))
    );
    setEditingTopicId(null);
    showToast(`Renamed to "${normalized}"`);
    return true;
  };

  const handleDuplicateTopic = (topicId: string) => {
    const orig = topics.find(t => t.id === topicId);
    if (!orig) return;

    const dupTitle = `${orig.title} (Copy)`;
    const now = new Date();
    const newTopic: Topic = {
      ...orig,
      id: `topic-${now.getTime()}`,
      title: dupTitle,
      isPinned: false,
      createdAt: now.toISOString(),
      tasks: (orig.tasks || []).map((t, idx) => ({ ...t, id: `dup-${now.getTime()}-${idx}` }))
    };

    setTopics(prev => [newTopic, ...prev]);
    showToast(`Created duplicate "${dupTitle}"`);
  };

  const handleConfirmMoveToRecycleBin = () => {
    if (!topicToDelete) return;
    const target = topicToDelete;
    setAnimatingDeleteTopicId(target.id);
    setTopicToDelete(null);

    if (userSettings.soundEffects !== false) {
      soundManager.playTrash();
    }

    const now = new Date().toISOString();
    const targetWithDate = { ...target, deletedAt: now };

    setTimeout(() => {
      setDeletedTopics(prev => [targetWithDate, ...prev]);
      setTopics(prev => prev.filter(t => t.id !== target.id));
      setAnimatingDeleteTopicId(null);

      showToast(
        `✓ “${target.title}” moved to Recycle Bin`,
        () => {
          setTopics(prev => [targetWithDate, ...prev]);
          setDeletedTopics(prev => prev.filter(t => t.id !== target.id));
          showToast(`Restored "${target.title}"`);
        },
        5000
      );
    }, 200);
  };

  const handleSoftDeleteTopic = (topicId: string) => {
    const target = topics.find(t => t.id === topicId);
    if (target) {
      setTopicToDelete(target);
    }
  };

  const handleRestoreTopic = (topicId: string) => {
    const target = deletedTopics.find(t => t.id === topicId);
    if (target) {
      setTopics(prev => [target, ...prev.filter(t => t.id !== topicId)]);
      setDeletedTopics(prev => prev.filter(t => t.id !== topicId));
      showToast(`Restored "${target.title}"`);
    }
  };

  const handlePermanentDeleteTopic = (topicId: string) => {
    if (userSettings.soundEffects !== false) {
      soundManager.playTrash();
    }
    setDeletedTopics(prev => prev.filter(t => t.id !== topicId));
    showToast(`Permanently deleted topic`);
  };

  // --- Standalone Tasks Studio Handlers ---
  const handleAddStandaloneTask = (title: string) => {
    const newTask: StandaloneTask = {
      id: `standalone-task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setStandaloneTasks(prev => [newTask, ...prev]);
  };

  const handleToggleStandaloneTask = (taskId: string) => {
    setStandaloneTasks(prev =>
      prev.map(t =>
        t.id === taskId
          ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date().toISOString() : undefined }
          : t
      )
    );
  };

  const handleDeleteStandaloneTask = (taskId: string) => {
    if (userSettings.soundEffects !== false) {
      soundManager.playTrash();
    }
    setStandaloneTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const handleEditStandaloneTask = (taskId: string, newTitle: string) => {
    setStandaloneTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, title: newTitle } : t))
    );
  };

  const handleClearCompletedStandaloneTasks = () => {
    if (userSettings.soundEffects !== false) {
      soundManager.playTrash();
    }
    setStandaloneTasks(prev => prev.filter(t => !t.completed));
  };

  const handleSoftDeleteNote = (note: StudyNote) => {
    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(
      now.getMonth() + 1
    ).padStart(2, '0')}/${now.getFullYear()} ${now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;

    if (userSettings.soundEffects !== false) {
      soundManager.playTrash();
    }

    setDeletedNotes(prev => [{ note, deletedAt: formattedDate }, ...prev]);
  };

  const handleRestoreNote = (noteId: string) => {
    const target = deletedNotes.find(item => item.note.id === noteId);
    if (target) {
      setNotes(prev => [target.note, ...prev.filter(n => n.id !== noteId)]);
      setDeletedNotes(prev => prev.filter(item => item.note.id !== noteId));
      showToast(`Restored "${target.note.title || 'Untitled Note'}"`);
    }
  };

  const handlePermanentDeleteNote = (noteId: string) => {
    if (userSettings.soundEffects !== false) {
      soundManager.playTrash();
    }
    setDeletedNotes(prev => prev.filter(item => item.note.id !== noteId));
    showToast(`Permanently deleted note`);
  };

  const handleRestoreWorkspace = (wsId: string) => {
    const cleanId = (wsId || '').replace(/^ws-/, '');
    const target = deletedWorkspaces.find(item => {
      if (!item) return false;
      const w = item.workspace || (item as any);
      return w?.id === wsId || w?.id === cleanId || w?.name === wsId || w?.name === cleanId;
    });

    if (target) {
      const rawWs: any = target.workspace || target;
      const wsName = typeof rawWs === 'string' ? rawWs : (rawWs?.name || 'Workspace');
      const realWsId = (typeof rawWs === 'object' && rawWs?.id) || `workspace-${cleanId || Date.now()}`;
      const wsObj: WorkspaceWindow = { id: realWsId, name: wsName };

      setWorkspaces(prev => {
        const withoutTarget = prev.filter(w => w && w.id !== wsObj.id);
        return [...withoutTarget, wsObj];
      });

      if (target.topics && target.topics.length > 0) {
        setTopics(prev => {
          const targetTopicMap = new Map(target.topics!.map(t => [t.id, t]));
          const withoutTargetTopics = prev.filter(t => !targetTopicMap.has(t.id));
          const safeRestored = target.topics!.map(t => ({
            ...t,
            workspaceId: realWsId,
            tasks: Array.isArray(t?.tasks) ? t.tasks : [],
            notes: Array.isArray(t?.notes) ? t.notes : [],
            links: Array.isArray(t?.links) ? t.links : [],
            tags: Array.isArray(t?.tags) ? t.tags : [],
          }));
          return [...withoutTargetTopics, ...safeRestored];
        });
      }

      if (target.sections && target.sections.length > 0) {
        setWorkspaceSections(prev => {
          const targetSecMap = new Map(target.sections!.map(s => [s.id || s.name, s]));
          const withoutTargetSecs = prev.filter(s => !targetSecMap.has(s.id) && !targetSecMap.has(s.name));
          const sanitizedSecs = target.sections!.map(s => ({
            id: s.id || `section-${s.name}-${realWsId}`,
            name: s.name || 'Section',
            workspaceId: realWsId,
          }));
          return [...withoutTargetSecs, ...sanitizedSecs];
        });
      }

      setDeletedWorkspaces(prev => prev.filter(item => {
        if (!item) return false;
        const w = item.workspace || (item as any);
        return w?.id !== wsObj.id && w?.id !== wsId && w?.id !== cleanId;
      }));

      // Switch active workspace to restored workspace
      setActiveWorkspaceId(realWsId);
      showToast(`Restored workspace "${wsObj.name}"`);
    }
  };

  const handlePermanentDeleteWorkspace = (wsId: string) => {
    const cleanId = (wsId || '').replace(/^ws-/, '');
    if (userSettings.soundEffects !== false) {
      soundManager.playTrash();
    }
    setDeletedWorkspaces(prev => prev.filter(item => {
      if (!item) return false;
      const w = item.workspace || (item as any);
      return w?.id !== wsId && w?.id !== cleanId;
    }));
    showToast(`Permanently deleted workspace`);
  };

  const handleRestoreSection = (sectionId: string) => {
    const cleanId = (sectionId || '').replace(/^sec-/, '');
    const target = deletedSections.find(item => {
      if (!item) return false;
      const s = item.section || (item as any);
      return s?.id === sectionId || s?.id === cleanId || s?.name === sectionId || s?.name === cleanId;
    });

    if (target) {
      const rawSec: any = target.section || target;
      const secName = typeof rawSec === 'string' ? rawSec : (rawSec?.name || 'Section');
      const wsId = (typeof rawSec === 'object' && rawSec?.workspaceId) || activeWorkspaceId || '1';
      const secId = (typeof rawSec === 'object' && rawSec?.id) || `section-${secName}-${wsId}`;
      const secObj: SectionItem = { id: secId, name: secName, workspaceId: wsId };

      setWorkspaceSections(prev => {
        const withoutTarget = prev.filter(s => s && s.id !== secObj.id && s.name !== secObj.name);
        return [...withoutTarget, secObj];
      });

      if (target.topics && target.topics.length > 0) {
        setTopics(prev => {
          const targetTopicMap = new Map(target.topics!.map(t => [t.id, t]));
          const withoutTargetTopics = prev.filter(t => !targetTopicMap.has(t.id));
          const restoredTopics = target.topics!.map(t => ({
            ...t,
            section: secObj.name,
            workspaceId: wsId,
            tasks: Array.isArray(t?.tasks) ? t.tasks : [],
            notes: Array.isArray(t?.notes) ? t.notes : [],
            links: Array.isArray(t?.links) ? t.links : [],
            tags: Array.isArray(t?.tags) ? t.tags : [],
          }));
          return [...withoutTargetTopics, ...restoredTopics];
        });
      }

      setDeletedSections(prev => prev.filter(item => {
        if (!item) return false;
        const s = item.section || (item as any);
        return s?.id !== secObj.id && s?.name !== secObj.name && s?.id !== sectionId && s?.id !== cleanId;
      }));

      // Set active section to restored section
      setActiveSection(secObj.name);
      showToast(`Restored section "${secObj.name}"`);
    }
  };

  const handlePermanentDeleteSection = (sectionId: string) => {
    const cleanId = (sectionId || '').replace(/^sec-/, '');
    if (userSettings.soundEffects !== false) {
      soundManager.playTrash();
    }
    setDeletedSections(prev => prev.filter(item => {
      if (!item) return false;
      const s = item.section || (item as any);
      return s?.id !== sectionId && s?.id !== cleanId && s?.name !== sectionId && s?.name !== cleanId;
    }));
    showToast(`Permanently deleted section`);
  };

  const handleRestoreTask = (taskId: string) => {
    const target = deletedTasks.find(item => item.task.id === taskId);
    if (target) {
      // Check if original topic still exists
      const targetTopicExists = topics.some(t => t.id === target.topicId);
      if (targetTopicExists) {
        setTopics(prev =>
          prev.map(t =>
            t.id === target.topicId
              ? { ...t, tasks: [...t.tasks, target.task] }
              : t
          )
        );
        setDeletedTasks(prev => prev.filter(item => item.task.id !== taskId));
        showToast(`Restored task "${target.task.title}"`);
      } else {
        // Topic might be in deletedTopics or missing, fallback to active topic or restore to first matching workspace topic
        const fallbackTopic = topics.find(t => t.workspaceId === target.workspaceId) || topics[0];
        if (fallbackTopic) {
          setTopics(prev =>
            prev.map(t =>
              t.id === fallbackTopic.id
                ? { ...t, tasks: [...t.tasks, target.task] }
                : t
            )
          );
          setDeletedTasks(prev => prev.filter(item => item.task.id !== taskId));
          showToast(`Restored task "${target.task.title}" to "${fallbackTopic.title}"`);
        } else {
          showToast(`⚠️ Cannot restore task: target topic not found`);
        }
      }
    }
  };

  const handlePermanentDeleteTask = (taskId: string) => {
    if (userSettings.soundEffects !== false) {
      soundManager.playTrash();
    }
    setDeletedTasks(prev => prev.filter(item => item.task.id !== taskId));
    showToast(`Permanently deleted task`);
  };

  const handleSoftDeleteDrawerNote = (note: NoteItem, context: { topicId: string; topicTitle: string; workspaceId?: string; taskId?: string; taskTitle?: string; isTopicNote?: boolean }) => {
    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(
      now.getMonth() + 1
    ).padStart(2, '0')}/${now.getFullYear()} ${now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;

    if (userSettings.soundEffects !== false) {
      soundManager.playTrash();
    }

    setDeletedTopicNotes(prev => [
      {
        note,
        topicId: context.topicId,
        topicTitle: context.topicTitle,
        workspaceId: context.workspaceId,
        taskId: context.taskId,
        taskTitle: context.taskTitle,
        isTopicNote: context.isTopicNote,
        deletedAt: formattedDate,
      },
      ...prev,
    ]);
  };

  const handleRestoreDrawerNote = (noteId: string) => {
    const target = deletedTopicNotes.find(item => item.note.id === noteId);
    if (target) {
      if (target.taskId) {
        setTopics(prev =>
          prev.map(t =>
            t.id === target.topicId
              ? {
                  ...t,
                  tasks: (t.tasks || []).map(task =>
                    task.id === target.taskId
                      ? { ...task, notes: [...(task.notes || []), target.note] }
                      : task
                  ),
                }
              : t
          )
        );
      } else {
        setTopics(prev =>
          prev.map(t =>
            t.id === target.topicId
              ? { ...t, notes: [...(t.notes || []), target.note] }
              : t
          )
        );
      }
      setDeletedTopicNotes(prev => prev.filter(item => item.note.id !== noteId));
      showToast(`Restored note`);
    }
  };

  const handlePermanentDeleteDrawerNote = (noteId: string) => {
    if (userSettings.soundEffects !== false) {
      soundManager.playTrash();
    }
    setDeletedTopicNotes(prev => prev.filter(item => item.note.id !== noteId));
    showToast(`Permanently deleted note`);
  };

  const handleSoftDeleteDrawerLink = (link: ResourceLink, context: { topicId: string; topicTitle: string; workspaceId?: string; taskId?: string; taskTitle?: string }) => {
    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(
      now.getMonth() + 1
    ).padStart(2, '0')}/${now.getFullYear()} ${now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;

    if (userSettings.soundEffects !== false) {
      soundManager.playTrash();
    }

    setDeletedTopicLinks(prev => [
      {
        link,
        topicId: context.topicId,
        topicTitle: context.topicTitle,
        workspaceId: context.workspaceId,
        taskId: context.taskId,
        taskTitle: context.taskTitle,
        deletedAt: formattedDate,
      },
      ...prev,
    ]);
  };

  const handleRestoreDrawerLink = (linkId: string) => {
    const target = deletedTopicLinks.find(item => item.link.id === linkId);
    if (target) {
      if (target.taskId) {
        setTopics(prev =>
          prev.map(t =>
            t.id === target.topicId
              ? {
                  ...t,
                  tasks: (t.tasks || []).map(task =>
                    task.id === target.taskId
                      ? { ...task, links: [...(task.links || []), target.link] }
                      : task
                  ),
                }
              : t
          )
        );
      } else {
        setTopics(prev =>
          prev.map(t =>
            t.id === target.topicId
              ? { ...t, links: [...(t.links || []), target.link] }
              : t
          )
        );
      }
      setDeletedTopicLinks(prev => prev.filter(item => item.link.id !== linkId));
      showToast(`Restored link "${target.link.title || target.link.url}"`);
    }
  };

  const handlePermanentDeleteDrawerLink = (linkId: string) => {
    if (userSettings.soundEffects !== false) {
      soundManager.playTrash();
    }
    setDeletedTopicLinks(prev => prev.filter(item => item.link.id !== linkId));
    showToast(`Permanently deleted link`);
  };

  const handleEmptyRecycleBin = () => {
    if (userSettings.soundEffects !== false) {
      soundManager.playTrash();
    }
    setDeletedTopics([]);
    setDeletedWorkspaces([]);
    setDeletedNotes([]);
    setDeletedSections([]);
    setDeletedTasks([]);
    setDeletedTopicNotes([]);
    setDeletedTopicLinks([]);
    setDeletedJobCirculars([]);
    showToast(`Recycle bin emptied`);
  };

  // --- Job Circular Handlers ---
  const handleAddJobCircular = (item: Omit<JobCircularItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: JobCircularItem = {
      ...item,
      id: `circular-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setJobCirculars(prev => [newItem, ...prev]);
    showToast(`Circular "${newItem.jobTitle}" added!`);
  };

  const handleUpdateJobCircular = (id: string, updates: Partial<JobCircularItem>) => {
    setJobCirculars(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c))
    );
    showToast('Job circular updated!');
  };

  const handleDeleteJobCircularToTrash = (item: JobCircularItem) => {
    setJobCirculars(prev => prev.filter(c => c.id !== item.id));
    const deletedEntry: DeletedJobCircularItem = {
      circular: item,
      deletedAt: new Date().toISOString(),
    };
    setDeletedJobCirculars(prev => [deletedEntry, ...prev]);
    showToast(`Moved "${item.jobTitle}" to Recycle Bin`);
  };

  const handleRestoreJobCircular = (circularId: string) => {
    const target = deletedJobCirculars.find(entry => entry.circular.id === circularId);
    if (target) {
      setDeletedJobCirculars(prev => prev.filter(entry => entry.circular.id !== circularId));
      setJobCirculars(prev => [target.circular, ...prev]);
      showToast(`Restored "${target.circular.jobTitle}"`);
    }
  };

  const handlePermanentDeleteJobCircular = (circularId: string) => {
    if (userSettings.soundEffects !== false) {
      soundManager.playTrash();
    }
    setDeletedJobCirculars(prev => prev.filter(entry => entry.circular.id !== circularId));
    showToast('Job circular permanently deleted');
  };

  const handleAddTask = (topicId: string, titleParam?: string) => {
    const titleToUse = titleParam || newTaskTitle;
    if (!titleToUse.trim()) return;
    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(
      now.getMonth() + 1
    ).padStart(2, '0')}/${now.getFullYear()}`;
    const formattedTime = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      title: titleToUse.trim(),
      completed: false,
      date: formattedDate,
      time: formattedTime,
      priority: userSettings.defaultTaskPriority || 'none'
    };

    setTopics(prev =>
      prev.map(t => (t.id === topicId ? { ...t, tasks: [...t.tasks, newTask] } : t))
    );
    if (!titleParam) setNewTaskTitle('');
    setAddingTaskTopicId(null);
    showToast(`Task "${titleToUse.trim()}" added!`);
  };

  const handleDeleteTask = (topicId: string, taskId: string) => {
    const targetTopic = topics.find(t => t.id === topicId);
    const targetTask = targetTopic?.tasks.find(tk => tk.id === taskId);

    if (userSettings.soundEffects !== false) {
      soundManager.playTrash();
    }

    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(
      now.getMonth() + 1
    ).padStart(2, '0')}/${now.getFullYear()} ${now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;

    if (targetTask && targetTopic) {
      setDeletedTasks(prev => [
        {
          task: targetTask,
          topicId: targetTopic.id,
          topicTitle: targetTopic.title,
          workspaceId: targetTopic.workspaceId,
          deletedAt: formattedDate,
        },
        ...prev,
      ]);
    }

    setTopics(prev =>
      prev.map(t => {
        if (t.id === topicId) {
          return {
            ...t,
            tasks: t.tasks.filter(task => task.id !== taskId)
          };
        }
        return t;
      })
    );

    if (targetTask) {
      showToast(
        `Moved "${targetTask.title}" to Recycle Bin`,
        () => {
          setTopics(prev =>
            prev.map(t =>
              t.id === topicId
                ? { ...t, tasks: [...t.tasks, targetTask] }
                : t
            )
          );
          setDeletedTasks(prev => prev.filter(item => item.task.id !== taskId));
          showToast(`Restored "${targetTask.title}"`);
        },
        6000
      );
    }
  };

  const handleCreateWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = newWorkspaceName.replace(/\s+/g, ' ').trim();
    if (normalized.length < 1) {
      showToast('⚠️ Workspace name must be at least 1 character long.');
      return;
    }
    if (normalized.length > 40) {
      showToast(`⚠️ Workspace name cannot exceed 40 characters (${normalized.length}/40 characters).`);
      return;
    }

    const newWs: WorkspaceWindow = {
      id: `ws-${Date.now()}`,
      name: normalized
    };

    const newSec: SectionItem = {
      id: `sec-${Date.now()}`,
      workspaceId: newWs.id,
      name: 'General'
    };

    setWorkspaces(prev => [...prev, newWs]);
    setWorkspaceSections(prev => [...prev, newSec]);
    setActiveWorkspaceId(newWs.id);
    setActiveSection('General');
    setNewWorkspaceName('');
    setIsNewWorkspaceOpen(false);
    showToast(`Workspace "${normalized}" created successfully!`);
  };

  const handleCreateTopicModal = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedTitle = newTopicTitle.replace(/\s+/g, ' ').trim();

    if (normalizedTitle.length < 1) {
      showToast('⚠️ Topic name must be at least 1 character long.');
      return;
    }

    if (normalizedTitle.length > 45) {
      showToast(`⚠️ Topic name cannot exceed 45 characters (${normalizedTitle.length}/45 characters).`);
      return;
    }

    if (!activeWorkspaceId) return;
    const targetSection = activeSection || currentWorkspaceSections[0]?.name || '';

    const newTopicId = `topic-${Date.now()}`;
    const defaultTheme = getTopicTheme(normalizedTitle);
    const newTopic: Topic = {
      id: newTopicId,
      title: normalizedTitle,
      section: targetSection,
      expanded: true,
      isPinned: false,
      workspaceId: activeWorkspaceId,
      customColor: defaultTheme.id,
      customIcon: (defaultTheme as any).iconName || undefined,
      createdAt: new Date().toISOString(),
      tasks: []
    };

    setTopics(prev => [newTopic, ...prev]);
    setNewTopicTitle('');
    setIsNewTopicOpen(false);
    showToast(`Created topic "${normalizedTitle}"!`);
  };

  const handleCreateTopicsFromStudio = (studioTopics: any[]) => {
    const targetWsId = activeWorkspaceId || workspaces[0]?.id || 'workspace-default';
    const targetSection = activeSection || currentWorkspaceSections[0]?.name || 'General';

    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    const formattedTime = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    
    const newTopics: Topic[] = studioTopics.map((st, idx) => {
      const defaultTheme = getTopicTheme(st.title?.trim() || 'Untitled Topic');
      return {
        id: `topic-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 7)}`,
        title: st.title?.trim() || 'Untitled Topic',
        section: st.section || targetSection,
        expanded: true,
        isPinned: false,
        workspaceId: targetWsId,
        customColor: st.color || defaultTheme.id,
        customIcon: st.icon || (defaultTheme as any).iconName || undefined,
      links: (st.links || []).filter((l: any) => l.url && l.url.trim()).map((l: any) => ({
        id: `link-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: l.title?.trim() || 'Resource Link',
        url: l.url.trim(),
        type: detectLinkType(l.url.trim(), l.title?.trim())
      })),
      notes: (st.notes || []).filter((n: any) => n.text && n.text.trim()).map((n: any) => ({
        id: `note-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        text: n.text.trim(),
        date: formattedDate,
      })),
      tasks: (st.tasks || []).filter((tk: any) => tk.title && tk.title.trim()).map((tk: any, tIdx: number) => {
        let taskLinks: any[] = [];
        if (Array.isArray(tk.links)) {
          taskLinks = tk.links.filter((l: any) => l.url && l.url.trim()).map((l: any, lIdx: number) => ({
            id: `tk-link-${Date.now()}-${tIdx}-${lIdx}-${Math.random().toString(36).substring(2, 5)}`,
            title: l.title?.trim() || 'Resource Link',
            url: l.url.trim(),
            type: detectLinkType(l.url.trim(), l.title?.trim())
          }));
        } else if (tk.link && tk.link.trim()) {
          taskLinks = [{ 
            id: `tk-link-${Date.now()}-${tIdx}`, 
            title: tk.linkTitle?.trim() || 'Resource Link', 
            url: tk.link.trim(),
            type: detectLinkType(tk.link.trim(), tk.linkTitle?.trim())
          }];
        }

        let taskNotes: any[] = [];
        if (Array.isArray(tk.notes)) {
          taskNotes = tk.notes.filter((n: any) => n.text && n.text.trim()).map((n: any, nIdx: number) => ({
            id: `tk-note-${Date.now()}-${tIdx}-${nIdx}-${Math.random().toString(36).substring(2, 5)}`,
            text: n.text.trim(),
            date: formattedDate 
          }));
        } else if (tk.note && tk.note.trim()) {
          taskNotes = [{ 
            id: `tk-note-${Date.now()}-${tIdx}`, 
            text: tk.note.trim(), 
            date: formattedDate 
          }];
        }

        return {
          id: `task-${Date.now()}-${idx}-${tIdx}-${Math.random().toString(36).substring(2, 7)}`,
          title: tk.title.trim(),
          description: tk.description?.trim() || undefined,
          priority: tk.priority || 'none',
          completed: false,
          date: formattedDate,
          time: formattedTime,
          links: taskLinks,
          notes: taskNotes,
          subtasks: []
        };
      })
    };
  });

    if (newTopics.length === 0) return;

    setTopics(prev => [...newTopics, ...prev]);
    setIsSmartStudioOpen(false);
    
    const taskCount = newTopics.reduce((acc, t) => acc + t.tasks.length, 0);
    showToast(`✨ Created ${newTopics.length} topic${newTopics.length > 1 ? 's' : ''} and ${taskCount} task${taskCount !== 1 ? 's' : ''}!`);
    if (userSettings.soundEffects !== false) {
      soundManager.playTopicCompleteFanfare();
    }
  };

  const handleWorkspaceNewSection = (wsId: string) => {
    setActiveWorkspaceId(wsId);
    setIsNewSectionOpen(true);
    setActiveMenuWorkspaceId(null);
  };

  const togglePinWorkspace = (wsId: string) => {
    const targetWs = workspaces.find(w => w.id === wsId);
    if (!targetWs) return;
    const nextPin = !targetWs.isPinned;
    setWorkspaces(prev => prev.map(w => {
      if (w.id === wsId) {
        return {
          ...w,
          isPinned: nextPin,
          pinnedAt: nextPin ? Date.now() : undefined,
        };
      }
      return w;
    }));
    showToast(nextPin ? `Pinned "${targetWs.name}" workspace` : `Unpinned "${targetWs.name}" workspace`);
    setActiveMenuWorkspaceId(null);
  };

  const handleStartRenameWorkspace = (ws: WorkspaceWindow) => {
    setEditingWorkspaceId(ws.id);
    setEditingWorkspaceName(ws.name);
    setActiveMenuWorkspaceId(null);
  };

  const handleSaveRenameWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWorkspaceId) return;
    const normalized = editingWorkspaceName.replace(/\s+/g, ' ').trim();
    if (normalized.length < 1) {
      showToast('⚠️ Workspace name must be at least 1 character long.');
      return;
    }
    if (normalized.length > 40) {
      showToast(`⚠️ Workspace name cannot exceed 40 characters (${normalized.length}/40 characters).`);
      return;
    }

    setWorkspaces(prev => prev.map(w => w.id === editingWorkspaceId ? { ...w, name: normalized } : w));
    showToast(`Workspace renamed to "${normalized}"`);
    setEditingWorkspaceId(null);
    setEditingWorkspaceName('');
  };

  const handleMoveWorkspaceToRecycleBin = (wsId: string) => {
    const targetWs = workspaces.find(w => w.id === wsId);
    if (!targetWs) return;

    if (workspaces.length <= 1) {
      showToast('Cannot delete the only workspace');
      setActiveMenuWorkspaceId(null);
      return;
    }

    setActiveMenuWorkspaceId(null);
    setWorkspaceToDelete(targetWs);
  };

  const handleConfirmMoveWorkspaceToRecycleBin = () => {
    if (!workspaceToDelete) return;
    const targetWs = workspaceToDelete;
    const wsId = targetWs.id;
    setWorkspaceToDelete(null);

    if (userSettings.soundEffects !== false) {
      soundManager.playTrash();
    }

    // Get topics and sections in this workspace
    const wsTopics = topics.filter(t => t.workspaceId === wsId);
    const wsSections = workspaceSections.filter(s => s.workspaceId === wsId);

    const now = new Date().toISOString();

    setDeletedWorkspaces(prev => [{ workspace: targetWs, topics: wsTopics, sections: wsSections, deletedAt: now }, ...prev]);

    if (wsTopics.length > 0) {
      setTopics(prev => prev.filter(t => t.workspaceId !== wsId));
    }
    if (wsSections.length > 0) {
      setWorkspaceSections(prev => prev.filter(s => s.workspaceId !== wsId));
    }

    setWorkspaces(prev => prev.filter(w => w.id !== wsId));
    if (activeWorkspaceId === wsId) {
      const remaining = workspaces.filter(w => w.id !== wsId);
      if (remaining.length > 0) {
        setActiveWorkspaceId(remaining[0].id);
      }
    }
    showToast(
      `Workspace "${targetWs.name}" moved to Recycle Bin`,
      () => {
        setWorkspaces(prev => [...prev, targetWs]);
        if (wsTopics.length > 0) {
          setTopics(prev => [...prev, ...wsTopics]);
        }
        if (wsSections.length > 0) {
          setWorkspaceSections(prev => [...prev, ...wsSections]);
        }
        setDeletedWorkspaces(prev => prev.filter(item => item.workspace.id !== wsId));
        setActiveWorkspaceId(wsId);
        showToast(`Restored workspace "${targetWs.name}"`);
      },
      6000
    );
  };

  const handleCreateSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeWorkspaceId) return;
    
    // Multiple space auto remove
    const sanitized = newSectionName.replace(/\s+/g, ' ').trim();
    if (sanitized.length < 1) {
      showToast('⚠️ Section name must be at least 1 character long.');
      return;
    }

    if (sanitized.length > 35) {
      showToast(`⚠️ Section name cannot exceed 35 characters (${sanitized.length}/35 characters).`);
      return;
    }

    const currentSecs = workspaceSections.filter(s => s.workspaceId === activeWorkspaceId);

    // Duplicate Name Rule inside same workspace
    if (currentSecs.some(s => s.name.toLowerCase() === sanitized.toLowerCase())) {
      showToast(`⚠️ Section "${sanitized}" already exists in this workspace!`);
      return;
    }

    const isFirstSectionInWorkspace = currentSecs.length === 0;

    const newSec: SectionItem = {
      id: `sec-${Date.now()}`,
      workspaceId: activeWorkspaceId,
      name: sanitized
    };

    setWorkspaceSections(prev => [...prev, newSec]);
    setActiveSection(sanitized);

    // Only if this is the FIRST section created in this workspace, assign existing unassigned topics to this section
    if (isFirstSectionInWorkspace) {
      setTopics(prev => prev.map(t => {
        if (t.workspaceId === activeWorkspaceId) {
          return { ...t, section: sanitized };
        }
        return t;
      }));
    }

    setNewSectionName('');
    setIsNewSectionOpen(false);
    showToast(`Created section "${sanitized}"`);
  };

  const handleStartRenameSection = (sec: string) => {
    setEditingSection(sec);
    setEditingSectionName(sec);
    setActiveMenuSection(null);
  };

  const handleSaveRenameSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection || !activeWorkspaceId) return;

    const sanitized = editingSectionName.replace(/\s+/g, ' ').trim();
    if (sanitized.length < 1) {
      showToast('⚠️ Section name must be at least 1 character long.');
      return;
    }

    if (sanitized.length > 35) {
      showToast(`⚠️ Section name cannot exceed 35 characters (${sanitized.length}/35 characters).`);
      return;
    }

    const currentSecs = workspaceSections.filter(s => s.workspaceId === activeWorkspaceId);
    if (currentSecs.some(s => s.name.toLowerCase() === sanitized.toLowerCase() && s.name !== editingSection)) {
      showToast(`⚠️ Section "${sanitized}" already exists in this workspace!`);
      return;
    }

    const oldName = editingSection;
    setWorkspaceSections(prev => prev.map(s => s.workspaceId === activeWorkspaceId && s.name === oldName ? { ...s, name: sanitized } : s));
    setTopics(prev => prev.map(t => t.workspaceId === activeWorkspaceId && t.section === oldName ? { ...t, section: sanitized } : t));
    if (activeSection === oldName) setActiveSection(sanitized);

    showToast(`Renamed section to "${sanitized}"`);
    setEditingSection(null);
    setEditingSectionName('');
  };

  const handleDeleteSection = (secToDelete: string) => {
    if (!activeWorkspaceId) return;
    const currentSecs = workspaceSections.filter(s => s.workspaceId === activeWorkspaceId);
    const remainingSecs = currentSecs.filter(s => s.name !== secToDelete);
    
    const deletedSectionItem = currentSecs.find(s => s.name === secToDelete);
    const affectedTopics = topics.filter(t => t.workspaceId === activeWorkspaceId && t.section === secToDelete);

    if (userSettings.soundEffects !== false) {
      soundManager.playTrash();
    }

    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(
      now.getMonth() + 1
    ).padStart(2, '0')}/${now.getFullYear()} ${now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;

    if (deletedSectionItem) {
      setDeletedSections(prev => [{ section: deletedSectionItem, topics: affectedTopics, deletedAt: formattedDate }, ...prev]);
    }

    // Remove section from active sections
    setWorkspaceSections(prev => prev.filter(s => !(s.workspaceId === activeWorkspaceId && s.name === secToDelete)));

    // Remove section's topics from active topics
    setTopics(prev => prev.filter(t => !(t.workspaceId === activeWorkspaceId && t.section === secToDelete)));

    const nextActiveSection = remainingSecs.length > 0 ? remainingSecs[0].name : null;
    if (activeSection === secToDelete) {
      setActiveSection(nextActiveSection);
    }

    showToast(
      `✓ Moved section "${secToDelete}" and ${affectedTopics.length} topic(s) to Recycle Bin`,
      () => {
        if (deletedSectionItem) {
          setWorkspaceSections(prev => {
            const withoutSec = prev.filter(s => s.id !== deletedSectionItem.id);
            return [...withoutSec, deletedSectionItem];
          });
          setDeletedSections(prev => prev.filter(s => s.section.id !== deletedSectionItem.id));
        }
        if (affectedTopics.length > 0) {
          setTopics(prev => {
            const existingIds = new Set(prev.map(t => t.id));
            const restoredList = affectedTopics.filter(t => !existingIds.has(t.id));
            return [...prev, ...restoredList];
          });
        }
        setActiveSection(secToDelete);
        showToast(`Restored section "${secToDelete}"`);
      },
      6000
    );

    setActiveMenuSection(null);
  };

  // Move topic Up/Down in list
  const moveTopicIndex = (topicId: string, direction: 'up' | 'down') => {
    const index = topics.findIndex(t => t.id === topicId);
    if (index === -1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= topics.length) return;

    const newTopics = [...topics];
    const [moved] = newTopics.splice(index, 1);
    newTopics.splice(targetIndex, 0, moved);
    setTopics(newTopics);
  };

  // Comprehensive Export JSON: Exports all workspaces, sections, topics, tasks with all properties, notes, daily tasks (standaloneTasks), userSettings, streakData, and recycle bin
  const handleExportJSON = () => {
    try {
      const backupData = {
        app: 'StudyFlow',
        version: '2.0',
        exportedAt: new Date().toISOString(),
        activeWorkspaceId,
        workspaces,
        workspaceSections,
        topics,
        notes,
        standaloneTasks,
        userSettings,
        streakData,
        deletedTopics,
        deletedWorkspaces,
        deletedNotes,
        deletedSections,
        deletedTasks,
        deletedTopicNotes,
        deletedTopicLinks,
        jobCirculars,
        deletedJobCirculars
      };
      const jsonString = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', url);
      const dateStr = new Date().toISOString().slice(0, 10);
      downloadAnchor.setAttribute('download', `studyflow_backup_${dateStr}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      URL.revokeObjectURL(url);
      showToast('Exported complete backup file successfully!');
    } catch (err) {
      showToast('⚠️ Failed to export backup file.');
    }
  };

  // Comprehensive Import JSON: Restores all workspaces, sections, topics, tasks with all properties, notes, daily tasks, userSettings, streakData, and recycle bin
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const rawText = event.target?.result as string;
        const parsed = JSON.parse(rawText);

        if (!parsed || typeof parsed !== 'object') {
          throw new Error('Invalid JSON structure');
        }

        // Support both structured backup format and legacy array format
        let importedWorkspaces: WorkspaceWindow[] = Array.isArray(parsed.workspaces) ? parsed.workspaces : [];
        let importedSections: SectionItem[] = Array.isArray(parsed.workspaceSections)
          ? parsed.workspaceSections
          : Array.isArray(parsed.sections)
          ? parsed.sections
          : [];
        let importedTopics: Topic[] = Array.isArray(parsed.topics)
          ? parsed.topics
          : Array.isArray(parsed)
          ? parsed
          : [];
        const importedNotes: StudyNote[] = Array.isArray(parsed.notes) ? parsed.notes : [];
        const importedStandaloneTasks: StandaloneTask[] = Array.isArray(parsed.standaloneTasks)
          ? parsed.standaloneTasks
          : Array.isArray(parsed.dailyTasks)
          ? parsed.dailyTasks
          : Array.isArray(parsed.tasksStudio)
          ? parsed.tasksStudio
          : [];

        const importedUserSettings: UserSettings | null = parsed.userSettings && typeof parsed.userSettings === 'object' ? parsed.userSettings : null;
        const importedStreakData: StreakData | null = parsed.streakData && typeof parsed.streakData === 'object' ? parsed.streakData : null;
        const importedDeletedTopics: Topic[] = Array.isArray(parsed.deletedTopics) ? parsed.deletedTopics : [];
        const importedDeletedWorkspaces = Array.isArray(parsed.deletedWorkspaces) ? parsed.deletedWorkspaces : [];
        const importedDeletedNotes = Array.isArray(parsed.deletedNotes) ? parsed.deletedNotes : [];
        const importedDeletedSections = Array.isArray(parsed.deletedSections) ? parsed.deletedSections : [];
        const importedDeletedTasks = Array.isArray(parsed.deletedTasks) ? parsed.deletedTasks : [];
        const importedDeletedTopicNotes = Array.isArray(parsed.deletedTopicNotes) ? parsed.deletedTopicNotes : [];
        const importedDeletedTopicLinks = Array.isArray(parsed.deletedTopicLinks) ? parsed.deletedTopicLinks : [];
        const importedJobCirculars: JobCircularItem[] = Array.isArray(parsed.jobCirculars) ? parsed.jobCirculars : [];
        const importedDeletedJobCirculars: DeletedJobCircularItem[] = Array.isArray(parsed.deletedJobCirculars) ? parsed.deletedJobCirculars : [];

        if (
          importedTopics.length === 0 &&
          importedWorkspaces.length === 0 &&
          importedNotes.length === 0 &&
          importedStandaloneTasks.length === 0 &&
          importedJobCirculars.length === 0
        ) {
          throw new Error('No valid topics, workspaces, notes, tasks, or circulars found in backup file.');
        }

        // 1. Ensure at least one Workspace exists
        if (importedWorkspaces.length === 0) {
          importedWorkspaces = [{ id: '1', name: 'Workspace' }];
        }

        // Determine target active workspace
        const targetWsId = parsed.activeWorkspaceId && importedWorkspaces.some(w => w.id === parsed.activeWorkspaceId)
          ? parsed.activeWorkspaceId
          : importedWorkspaces[0].id;

        // 2. Normalize topics to guarantee valid workspaceId and section
        importedTopics = importedTopics.map(t => ({
          ...t,
          workspaceId: t.workspaceId || targetWsId,
          section: t.section || 'General'
        }));

        // 3. Normalize sections (Auto-extract missing sections from topics if sections array is empty or incomplete)
        const existingSecKeys = new Set(importedSections.map(s => `${s.workspaceId}:::${s.name.toLowerCase()}`));
        importedTopics.forEach((t, i) => {
          const wsId = t.workspaceId || targetWsId;
          const secName = t.section || 'General';
          const key = `${wsId}:::${secName.toLowerCase()}`;
          if (!existingSecKeys.has(key)) {
            existingSecKeys.add(key);
            importedSections.push({
              id: `sec-import-${Date.now()}-${i}`,
              workspaceId: wsId,
              name: secName
            });
          }
        });

        // 4. Auto-detect active section with content for active workspace
        const targetWsTopics = importedTopics.filter(t => t.workspaceId === targetWsId);
        const topicSec = targetWsTopics.find(t => t.section)?.section;
        const availableSecs = importedSections.filter(s => s.workspaceId === targetWsId);
        const targetSection = topicSec || availableSecs[0]?.name || null;

        // 5. Commit all states
        setWorkspaces(importedWorkspaces);
        setActiveWorkspaceId(targetWsId);
        setWorkspaceSections(importedSections);
        setActiveSection(targetSection);
        setTopics(importedTopics);
        setSyncedTopics(importedTopics);
        setDeletedTopics(importedDeletedTopics);
        setDeletedWorkspaces(importedDeletedWorkspaces);
        setDeletedNotes(importedDeletedNotes);
        setDeletedSections(importedDeletedSections);
        setDeletedTasks(importedDeletedTasks);
        setDeletedTopicNotes(importedDeletedTopicNotes);
        setDeletedTopicLinks(importedDeletedTopicLinks);

        if (Array.isArray(parsed.notes)) {
          setNotes(importedNotes);
          localStorage.setItem('studyflow_notes', JSON.stringify(importedNotes));
        }

        if (Array.isArray(parsed.jobCirculars)) {
          setJobCirculars(importedJobCirculars);
          localStorage.setItem('studyflow_job_circulars', JSON.stringify(importedJobCirculars));
        }

        if (Array.isArray(parsed.deletedJobCirculars)) {
          setDeletedJobCirculars(importedDeletedJobCirculars);
          localStorage.setItem('studyflow_deleted_job_circulars', JSON.stringify(importedDeletedJobCirculars));
        }

        if (Array.isArray(parsed.standaloneTasks) || Array.isArray(parsed.dailyTasks) || Array.isArray(parsed.tasksStudio)) {
          setStandaloneTasks(importedStandaloneTasks);
          localStorage.setItem('studyflow_standalone_tasks', JSON.stringify(importedStandaloneTasks));
        }

        if (importedUserSettings) {
          setUserSettings(importedUserSettings);
          localStorage.setItem('studyflow_user_settings', JSON.stringify(importedUserSettings));
        }

        if (importedStreakData) {
          setStreakData(importedStreakData);
          localStorage.setItem('studyflow_daily_streak_v1', JSON.stringify(importedStreakData));
        }

        // Reset search, filters & open modals to prevent accidental blank views
        setStatusFilter('all');
        setIsSearchPageOpen(false);
        setSelectedTopicId(null);
        setIsDetailsDrawerOpen(false);
        if (window.innerWidth < 768) {
          setSidebarCollapsed(true);
        }

        // Synchronize to localStorage
        localStorage.setItem('studyflow_workspaces', JSON.stringify(importedWorkspaces));
        localStorage.setItem('studyflow_active_workspace', JSON.stringify(targetWsId));
        localStorage.setItem('studyflow_workspace_sections', JSON.stringify(importedSections));
        localStorage.setItem('studyflow_topics', JSON.stringify(importedTopics));
        localStorage.setItem('studyflow_deleted_topics', JSON.stringify(importedDeletedTopics));
        localStorage.setItem('studyflow_deleted_workspaces', JSON.stringify(importedDeletedWorkspaces));
        localStorage.setItem('studyflow_deleted_notes', JSON.stringify(importedDeletedNotes));
        localStorage.setItem('studyflow_deleted_sections', JSON.stringify(importedDeletedSections));
        localStorage.setItem('studyflow_deleted_tasks', JSON.stringify(importedDeletedTasks));
        localStorage.setItem('studyflow_deleted_topic_notes', JSON.stringify(importedDeletedTopicNotes));
        localStorage.setItem('studyflow_deleted_topic_links', JSON.stringify(importedDeletedTopicLinks));

        showToast('Complete StudyFlow data imported successfully!');
      } catch (err: any) {
        showToast(`⚠️ Import failed: ${err?.message || 'Invalid StudyFlow backup file.'}`);
      } finally {
        if (e.target) {
          e.target.value = '';
        }
      }
    };
    reader.onerror = () => {
      showToast('⚠️ Failed to read backup file.');
      if (e.target) {
        e.target.value = '';
      }
    };
    reader.readAsText(file);
  };

  // Landing page accent preview handoff to auth modal & new signup
  const [authModalAccent, setAuthModalAccent] = useState<PrimaryAccentColor>('blue');

  const handleOpenAuthWithAccent = (accentId?: string) => {
    const validAccents: PrimaryAccentColor[] = ['blue', 'purple', 'green', 'orange', 'pink', 'cyan', 'amber'];
    const targetAccent = validAccents.includes(accentId as PrimaryAccentColor) ? (accentId as PrimaryAccentColor) : 'blue';
    setAuthModalAccent(targetAccent);

    // 0ms Pre-Apply: Synchronously update DOM, LocalStorage & userSettings React state
    // so that when login succeeds, Dashboard mounts with the exact target accent without any 1-frame race condition!
    try {
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-accent', targetAccent);
      }
      applyAccentColor(targetAccent);
      const saved = localStorage.getItem('studyflow_user_settings');
      const parsed = saved ? JSON.parse(saved) : {};
      parsed.primaryColor = targetAccent;
      localStorage.setItem('studyflow_user_settings', JSON.stringify(parsed));
    } catch (_) {}

    setUserSettings((prev) => ({
      ...prev,
      primaryColor: targetAccent,
    }));

    setIsAuthModalOpen(true);
  };

  // 1. Unauthenticated Visitor Landing Page & Auth Modal (Instant 0ms Load, Zero Splash)
  if (!currentUser) {
    return (
      <div className="min-h-screen w-full relative bg-[#F8FAFC] dark:bg-[#090D16] select-text preserve-color">
        <LandingPage
          userSettings={userSettings}
          onToggleTheme={handleToggleThemeMode}
          onGetStarted={handleOpenAuthWithAccent}
          onSignIn={handleOpenAuthWithAccent}
          onAccentChange={(accentId) => {
            const validAccents: PrimaryAccentColor[] = ['blue', 'purple', 'green', 'orange', 'pink', 'cyan', 'amber'];
            const targetAccent = validAccents.includes(accentId as PrimaryAccentColor) ? (accentId as PrimaryAccentColor) : 'blue';
            setAuthModalAccent(targetAccent);
            setUserSettings(prev => ({ ...prev, primaryColor: targetAccent }));
          }}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          isClosable={true}
          accentColor={authModalAccent}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={(user, preloadedCloudData) => {
            // Atomic State Hydration: If cloud data was pre-fetched, apply it immediately
            // so that the Dashboard renders with the user's actual Workspaces and Accent Color on the very first frame!
            if (preloadedCloudData) {
              isCloudApplyingRef.current = true;
              if (preloadedCloudData.workspaces) setWorkspaces(preloadedCloudData.workspaces);
              if (preloadedCloudData.workspaceSections) setWorkspaceSections(preloadedCloudData.workspaceSections);
              if (preloadedCloudData.activeWorkspaceId) setActiveWorkspaceId(preloadedCloudData.activeWorkspaceId);
              if (preloadedCloudData.topics) setTopics(preloadedCloudData.topics);
              if (preloadedCloudData.deletedTopics) setDeletedTopics(preloadedCloudData.deletedTopics);
              if (preloadedCloudData.deletedWorkspaces) setDeletedWorkspaces(preloadedCloudData.deletedWorkspaces);
              if (preloadedCloudData.deletedNotes) setDeletedNotes(preloadedCloudData.deletedNotes);
              if (preloadedCloudData.deletedSections) setDeletedSections(preloadedCloudData.deletedSections);
              if (preloadedCloudData.deletedTasks) setDeletedTasks(preloadedCloudData.deletedTasks);
              if (preloadedCloudData.deletedTopicNotes) setDeletedTopicNotes(preloadedCloudData.deletedTopicNotes);
              if (preloadedCloudData.deletedTopicLinks) setDeletedTopicLinks(preloadedCloudData.deletedTopicLinks);
              if (preloadedCloudData.notes) setNotes(preloadedCloudData.notes);
              if (preloadedCloudData.standaloneTasks) setStandaloneTasks(preloadedCloudData.standaloneTasks);
              if (preloadedCloudData.userSettings) {
                const { theme: _cloudTheme, primaryColor: _cloudPrimaryColor, ...restCloudSettings } = preloadedCloudData.userSettings as any;
                const finalAccent = getInitialAccentColor();
                try {
                  if (typeof document !== 'undefined') {
                    document.documentElement.setAttribute('data-accent', finalAccent);
                  }
                  applyAccentColor(finalAccent);
                } catch (_) {}
                setUserSettings((prev: any) => ({
                  ...prev,
                  ...restCloudSettings,
                  primaryColor: finalAccent
                }));
              }
              isInitialSyncCompleteRef.current = true;
              setTimeout(() => {
                isCloudApplyingRef.current = false;
              }, 400);
            }

            setIsAuthModalOpen(false);
            const rawName = user?.displayName || (user?.email ? user.email.split('@')[0] : '');
            const displayName = rawName ? ` ${rawName}` : '';
            setToastData({ message: `Welcome${displayName} to Study Flow 🚀` });
          }}
        />
        {/* Unified Toast Notification Stack */}
        <ToastContainer
          toasts={toasts}
          onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
        />
      </div>
    );
  }

  return (
    <div className="h-[100dvh] w-full bg-slate-50 dark:bg-[#0b0f19] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/50 dark:from-slate-900/40 via-slate-50 dark:via-[#0b0f19] to-white dark:to-[#0b0f19] text-[#0F172A] dark:text-[#F8FAFC] flex flex-row font-sans overflow-hidden">
      {/* Hidden file input for import with broad mobile mime-type support */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportJSON}
        accept=".json,application/json,text/plain,*/*"
        className="hidden"
      />

      <AppSidebar
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        isAccentQuickPickerOpen={isAccentQuickPickerOpen}
        setIsAccentQuickPickerOpen={setIsAccentQuickPickerOpen}
        userSettings={userSettings}
        handleSelectAccentColor={handleSelectAccentColor}
        handleToggleThemeMode={handleToggleThemeMode}
        isSearchPageOpen={isSearchPageOpen}
        setIsSearchPageOpen={setIsSearchPageOpen}
        isNotesPageOpen={isNotesPageOpen}
        setIsNotesPageOpen={setIsNotesPageOpen}
        isTasksPageOpen={isTasksPageOpen}
        setIsTasksPageOpen={setIsTasksPageOpen}
        isRecycleBinOpen={isRecycleBinOpen}
        setIsRecycleBinOpen={setIsRecycleBinOpen}
        isAnalyticsPageOpen={isAnalyticsPageOpen}
        setIsAnalyticsPageOpen={setIsAnalyticsPageOpen}
        isJobCircularsOpen={isJobCircularsOpen}
        setIsJobCircularsOpen={setIsJobCircularsOpen}
        jobCirculars={jobCirculars}
        notes={notes}
        standaloneTasks={standaloneTasks}
        showToast={showToast}
        setIsShortcutsOpen={setIsShortcutsOpen}
        isReorderingWorkspaces={isReorderingWorkspaces}
        toggleWorkspacesCollapse={toggleWorkspacesCollapse}
        isWorkspacesCollapsed={isWorkspacesCollapsed}
        sortedWorkspaces={sortedWorkspaces}
        workspaces={workspaces}
        startReorderingWorkspaces={startReorderingWorkspaces}
        setIsNewWorkspaceOpen={setIsNewWorkspaceOpen}
        handleCancelReorder={handleCancelReorder}
        handleDoneReorder={handleDoneReorder}
        draggedWsIdx={draggedWsIdx}
        dragOverWsIdx={dragOverWsIdx}
        handleDragStart={handleDragStart}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
        handleDragEnd={handleDragEnd}
        handleTouchStart={handleTouchStart}
        handleTouchMove={handleTouchMove}
        handleTouchEnd={handleTouchEnd}
        handleMoveWorkspace={handleMoveWorkspace}
        activeWorkspaceId={activeWorkspaceId}
        setActiveWorkspaceId={setActiveWorkspaceId}
        toggleWorkspaceMenu={toggleWorkspaceMenu}
        activeMenuWorkspaceId={activeMenuWorkspaceId}
        handleExportJSON={handleExportJSON}
        fileInputRef={fileInputRef}
        deletedTopics={deletedTopics}
        deletedWorkspaces={deletedWorkspaces}
        deletedNotes={deletedNotes}
        deletedSections={deletedSections}
        deletedTasks={deletedTasks}
        deletedTopicNotes={deletedTopicNotes}
        deletedTopicLinks={deletedTopicLinks}
        currentUser={currentUser}
        profileMenuTarget={profileMenuTarget}
        setProfileMenuTarget={setProfileMenuTarget}
        isOnline={isOnline}
        streakData={streakData}
        dailyGoalPercent={dailyGoalPercent}
        setIsEditProfileOpen={setIsEditProfileOpen}
        handleChangePassword={handleChangePassword}
        handleSwitchAccount={handleSwitchAccount}
        handleSignOut={handleSignOut}
        setIsAuthModalOpen={setIsAuthModalOpen}
        setIsSettingsOpen={setIsSettingsOpen}
        suppressSidebarTooltip={suppressSidebarTooltip}
        setSuppressSidebarTooltip={setSuppressSidebarTooltip}
        setTooltipData={setTooltipData}
        ACCENT_COLOR_OPTIONS={ACCENT_COLOR_OPTIONS}
      />

          {/* Centered Main Workspace Wrapper */}
          <div className="flex-1 w-full h-full relative bg-[#F8FAFC] dark:bg-[#090D16] overflow-y-auto no-scrollbar">
            {/* Full-Workspace Dynamic Ultra-Soft Ambient Glows (100% Synchronized with User Accent Color) */}
            <div className="preserve-color absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
              {/* 1. Top Ambient Spotlight */}
              <div className={`preserve-color absolute -top-10 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b ${getWorkspaceAmbientGlow(userSettings.primaryColor || 'blue')} to-transparent rounded-full blur-3xl opacity-40`}></div>
              {/* 2. Mid-Right Ambient Aura */}
              <div className={`preserve-color absolute top-[30%] -right-40 w-[750px] h-[650px] bg-gradient-to-br ${getWorkspaceAmbientGlow(userSettings.primaryColor || 'blue')} to-transparent rounded-full blur-3xl opacity-30`}></div>
              {/* 3. Lower-Left Ambient Aura */}
              <div className={`preserve-color absolute top-[62%] -left-40 w-[750px] h-[650px] bg-gradient-to-tr ${getWorkspaceAmbientGlow(userSettings.primaryColor || 'blue')} to-transparent rounded-full blur-3xl opacity-30`}></div>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <React.Suspense fallback={
                <div className="flex-1 w-full h-full flex items-center justify-center bg-[#F8FAFC] dark:bg-[#090D16]">
                  <Loader2 className="w-7 h-7 text-[#2563EB] animate-spin" />
                </div>
              }>
              {isSearchPageOpen ? (
                <SearchView
                  workspaces={workspaces}
                  topics={topics}
                  workspaceSections={workspaceSections}
                  activeWorkspaceId={activeWorkspaceId}
                  setActiveWorkspaceId={setActiveWorkspaceId}
                  setActiveSection={setActiveSection}
                  setSelectedTopicId={setSelectedTopicId}
                  setDrawerNavigationTarget={setDrawerNavigationTarget}
                  setIsDetailsDrawerOpen={setIsDetailsDrawerOpen}
                  toggleTaskCompleted={toggleTaskCompleted}
                  onClose={() => setIsSearchPageOpen(false)}
                  getTopicTheme={getTopicTheme}
                  onToggleSidebar={() => setSidebarCollapsed(prev => !prev)}
                />
          ) : isNotesPageOpen ? (
            <NotesStudio
              notes={notes}
              setNotes={setNotes}
              workspaces={workspaces}
              activeWorkspaceId={activeWorkspaceId}
              onClose={() => setIsNotesPageOpen(false)}
              showToast={showToast}
              onSoftDeleteNote={handleSoftDeleteNote}
              onToggleSidebar={() => setSidebarCollapsed(prev => !prev)}
            />
          ) : isTasksPageOpen ? (
            <TasksStudio
              tasks={standaloneTasks}
              onAddTask={handleAddStandaloneTask}
              onToggleTask={handleToggleStandaloneTask}
              onDeleteTask={handleDeleteStandaloneTask}
              onEditTask={handleEditStandaloneTask}
              onClearCompleted={handleClearCompletedStandaloneTasks}
              onClose={() => setIsTasksPageOpen(false)}
              onToggleSidebar={() => setSidebarCollapsed(prev => !prev)}
              soundEnabled={userSettings.soundEffects !== false}
            />
          ) : isJobCircularsOpen ? (
            <React.Suspense
              fallback={
                <div className="flex-1 flex items-center justify-center min-h-[400px]">
                  <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
              }
            >
              <JobCircularStudio
                circulars={jobCirculars}
                onAddCircular={handleAddJobCircular}
                onUpdateCircular={handleUpdateJobCircular}
                onDeleteCircular={handleDeleteJobCircularToTrash}
                onClose={() => setIsJobCircularsOpen(false)}
                onToggleSidebar={() => setSidebarCollapsed(prev => !prev)}
                showToast={showToast}
                soundEnabled={userSettings.soundEffects !== false}
              />
            </React.Suspense>
          ) : isRecycleBinOpen ? (
            <RecycleBinStudio
              deletedWorkspaces={deletedWorkspaces}
              deletedTopics={deletedTopics}
              deletedNotes={deletedNotes}
              deletedSections={deletedSections}
              deletedTasks={deletedTasks}
              deletedTopicNotes={deletedTopicNotes}
              deletedTopicLinks={deletedTopicLinks}
              deletedJobCirculars={deletedJobCirculars}
              workspaces={workspaces}
              onRestoreWorkspace={handleRestoreWorkspace}
              onPermanentDeleteWorkspace={handlePermanentDeleteWorkspace}
              onRestoreTopic={handleRestoreTopic}
              onPermanentDeleteTopic={handlePermanentDeleteTopic}
              onRestoreNote={handleRestoreNote}
              onPermanentDeleteNote={handlePermanentDeleteNote}
              onRestoreSection={handleRestoreSection}
              onPermanentDeleteSection={handlePermanentDeleteSection}
              onRestoreTask={handleRestoreTask}
              onPermanentDeleteTask={handlePermanentDeleteTask}
              onRestoreTopicNote={handleRestoreDrawerNote}
              onPermanentDeleteTopicNote={handlePermanentDeleteDrawerNote}
              onRestoreTopicLink={handleRestoreDrawerLink}
              onRestoreJobCircular={handleRestoreJobCircular}
              onPermanentDeleteJobCircular={handlePermanentDeleteJobCircular}
              onEmptyRecycleBin={handleEmptyRecycleBin}
              onClose={() => setIsRecycleBinOpen(false)}
              onToggleSidebar={() => setSidebarCollapsed(prev => !prev)}
              showToast={showToast}
              soundEffectsEnabled={userSettings.soundEffects !== false}
            />
          ) : isAnalyticsPageOpen ? (
            <AnalyticsStudio
              topics={topics}
              workspaces={workspaces}
              streakData={streakData}
              userSettings={userSettings}
              onClose={() => setIsAnalyticsPageOpen(false)}
              onSelectTopic={(topicId, workspaceId) => {
                setIsAnalyticsPageOpen(false);
                if (workspaceId !== activeWorkspaceId) {
                  setActiveWorkspaceId(workspaceId);
                }
                setSelectedTopicId(topicId);
                setIsDetailsDrawerOpen(true);
              }}
              showToast={showToast}
            />
          ) : (
            <motion.div
              key="workspace-dashboard-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="flex-1 w-full flex flex-col min-h-full relative z-10"
            >

              {/* 1. TOP FULL-WIDTH FLUSH HEADER */}
              <WorkspaceHeader
                setTooltipData={setTooltipData}
                isWorkspaceDropdownOpen={isWorkspaceDropdownOpen}
                setIsWorkspaceDropdownOpen={setIsWorkspaceDropdownOpen}
                setIsMobileWorkspaceDropdownOpen={setIsMobileWorkspaceDropdownOpen}
                setSidebarCollapsed={setSidebarCollapsed}
                sidebarCollapsed={sidebarCollapsed}
                activeWorkspace={activeWorkspace}
                workspaces={workspaces}
                activeWorkspaceId={activeWorkspaceId}
                setActiveWorkspaceId={setActiveWorkspaceId}
                isWorkspaceSwitcherOpen={isWorkspaceSwitcherOpen}
                setIsWorkspaceSwitcherOpen={setIsWorkspaceSwitcherOpen}
                setIsNewWorkspaceOpen={setIsNewWorkspaceOpen}
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                currentWorkspaceSections={currentWorkspaceSections}
                activeMenuSection={activeMenuSection}
                setActiveMenuSection={setActiveMenuSection}
                sectionMenuPos={sectionMenuPos}
                setSectionMenuPos={setSectionMenuPos}
                setIsNewSectionOpen={setIsNewSectionOpen}
                setIsSearchPageOpen={setIsSearchPageOpen}
                deviceNotifStatus={deviceNotifStatus}
                setDeviceNotifStatus={setDeviceNotifStatus}
                isNotificationPanelOpen={isNotificationPanelOpen}
                setIsNotificationPanelOpen={setIsNotificationPanelOpen}
                unreadNotifCount={unreadNotifCount}
                notifications={notifications}
                setNotifications={setNotifications}
                notifFilter={notifFilter}
                setNotifFilter={setNotifFilter}
                handleToggleDeviceNotifications={handleToggleDeviceNotifications}
                onNotificationClick={(notif) => {
                  setIsNotificationPanelOpen(false);
                  if (notif.actionTarget?.type === 'circular') {
                    setIsTasksPageOpen(false);
                    setIsNotesPageOpen(false);
                    setIsAnalyticsPageOpen(false);
                    setIsRecycleBinOpen(false);
                    setIsSearchPageOpen(false);
                    setIsJobCircularsOpen(true);
                  } else if (notif.actionTarget?.type === 'task') {
                    setIsJobCircularsOpen(false);
                    setIsNotesPageOpen(false);
                    setIsAnalyticsPageOpen(false);
                    setIsRecycleBinOpen(false);
                    setIsSearchPageOpen(false);
                    setIsTasksPageOpen(true);
                  } else if (notif.actionTarget?.type === 'recycle') {
                    setIsJobCircularsOpen(false);
                    setIsTasksPageOpen(false);
                    setIsNotesPageOpen(false);
                    setIsAnalyticsPageOpen(false);
                    setIsSearchPageOpen(false);
                    setIsRecycleBinOpen(true);
                  }
                }}
                onDismissNotification={(id) => {
                  setNotifications((prev) => prev.filter((item) => item.id !== id));
                }}
                currentUser={currentUser}
                profileMenuTarget={profileMenuTarget}
                setProfileMenuTarget={setProfileMenuTarget}
                isOnline={isOnline}
                streakData={streakData}
                dailyGoalPercent={dailyGoalPercent}
                setIsEditProfileOpen={setIsEditProfileOpen}
                handleChangePassword={handleChangePassword}
                handleSwitchAccount={handleSwitchAccount}
                handleSignOut={handleSignOut}
                setIsAuthModalOpen={setIsAuthModalOpen}
              />

              {/* 2. SCROLLABLE WORKSPACE CONTAINER (Content Centered at max-w-[1178px]) */}
              <div className="flex-1 w-full overflow-y-auto no-scrollbar pt-4 px-4 sm:pt-6 sm:px-6 pb-2.5 sm:pb-3 flex flex-col">
                <div className="w-full max-w-[1178px] mx-auto flex flex-col gap-3.5 flex-1 min-h-full">

              {/* Fixed 3-Dot Dropdown Menu for Section - Always on Top */}
              <AnimatePresence>
                {activeMenuSection && sectionMenuPos && (
                  <motion.div
                    key={activeMenuSection}
                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                    transition={{ duration: 0.1, ease: 'easeOut' }}
                    style={{
                      position: 'fixed',
                      top: `${sectionMenuPos.top}px`,
                      left: `${sectionMenuPos.left}px`,
                      zIndex: 99999,
                    }}
                    onClick={e => e.stopPropagation()}
                    className="w-[170px] bg-white border border-slate-200 shadow-xl shadow-slate-900/10 rounded-xl p-1 text-xs font-medium section-menu text-slate-700 select-none"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        const sec = activeMenuSection;
                        setActiveMenuSection(null);
                        setSectionMenuPos(null);
                        handleStartRenameSection(sec);
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    >
                      <Pencil className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">Rename</span>
                    </button>

                    <div className="my-1 border-t border-slate-100" />

                    <button
                      type="button"
                      onClick={() => {
                        const sec = activeMenuSection;
                        setActiveMenuSection(null);
                        setSectionMenuPos(null);
                        setSectionToDelete(sec);
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-[#EF4444] hover:bg-[#FEE2E2]/60"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-[#EF4444] shrink-0" />
                      <span className="truncate">Move to Recycle Bin</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Dashboard Workspace Body */}
              <div className="w-full flex flex-col gap-4 min-w-0">
                {/* Top Summary Metrics Row (4 Cards) */}
                  <WorkspaceMetricsBanner
                    workspaceProgressPercent={workspaceProgressPercent}
                    completedWorkspaceTasks={completedWorkspaceTasks}
                    totalWorkspaceTasks={totalWorkspaceTasks}
                    sectionProgressPercent={sectionProgressPercent}
                    completedSectionTasks={completedSectionTasks}
                    totalSectionTasks={totalSectionTasks}
                    activeSection={activeSection}
                    isGoalPopoverOpen={isGoalPopoverOpen}
                    setIsGoalPopoverOpen={setIsGoalPopoverOpen}
                    dailyGoalMode={dailyGoalMode}
                    handleUpdateDailyGoalMode={handleUpdateDailyGoalMode}
                    dailyGoalPercent={dailyGoalPercent}
                    globalTotalStudyMinutesToday={globalTotalStudyMinutesToday}
                    dailyTimeTargetMinutes={dailyTimeTargetMinutes}
                    globalCompletedTasksToday={globalCompletedTasksToday}
                    dailyTarget={dailyTarget}
                    targetGoalValue={targetGoalValue}
                    currentGoalValue={currentGoalValue}
                    handleUpdateTaskTarget={handleUpdateTaskTarget}
                    handleUpdateDailyTimeTarget={handleUpdateDailyTimeTarget}
                    workspacesStats={workspacesStats}
                    activeWorkspaceId={activeWorkspaceId}
                    setActiveWorkspaceId={setActiveWorkspaceId}
                    handleNavigateToGoalTask={handleNavigateToGoalTask}
                    streakData={streakData}
                    isStreakPopoverOpen={isStreakPopoverOpen}
                    setIsStreakPopoverOpen={setIsStreakPopoverOpen}
                    setStreakData={setStreakData}
                    isDailyGoalAchieved={isDailyGoalAchieved}
                  />

                  {/* Smart Topic Generator Banner */}
                  <SmartTopicGeneratorBanner
                    isGeneratorSyntaxHelpOpen={isGeneratorSyntaxHelpOpen}
                    setIsGeneratorSyntaxHelpOpen={setIsGeneratorSyntaxHelpOpen}
                    generatorInputRef={generatorInputRef as any}
                    generatorInput={generatorInput}
                    setGeneratorInput={setGeneratorInput}
                    handleQuickAddTopic={handleQuickAddTopic}
                    isGenerating={isGenerating}
                    getTopicTheme={getTopicTheme}
                  />

                  <TopicsCanvas
                    filteredTopics={filteredTopics}
                    displayTopics={displayTopics}
                    statusFilter={statusFilter}
                    handleStatusFilterChange={handleStatusFilterChange}
                    isStatusFilterDropdownOpen={isStatusFilterDropdownOpen}
                    setIsStatusFilterDropdownOpen={setIsStatusFilterDropdownOpen}
                    countAll={countAll}
                    countCompleted={countCompleted}
                    countInProgress={countInProgress}
                    countNotStarted={countNotStarted}
                    sortCategory={sortCategory}
                    sortDirection={sortDirection}
                    handleSortSelect={handleSortSelect}
                    viewMode={viewMode}
                    handleViewModeChange={handleViewModeChange}
                    cardsRef={cardsRef as any}
                    bannerRef={bannerRef as any}
                    currentTopic={currentTopic}
                    getTopicTheme={getTopicTheme}
                    getDueCountForTopic={getDueCountForTopic}
                    highlightedTopicId={highlightedTopicId}
                    animatingPinTopicId={animatingPinTopicId}
                    animatingDeleteTopicId={animatingDeleteTopicId}
                    editingTopicId={editingTopicId}
                    setEditingTopicId={setEditingTopicId}
                    editingTopicTitle={editingTopicTitle}
                    setEditingTopicTitle={setEditingTopicTitle}
                    selectedTopicId={selectedTopicId}
                    setSelectedTopicId={setSelectedTopicId}
                    setIsDetailsDrawerOpen={setIsDetailsDrawerOpen}
                    activeMenuTopicId={activeMenuTopicId}
                    setActiveMenuTopicId={setActiveMenuTopicId}
                    togglePinTopic={togglePinTopic}
                    setCustomizingTopic={setCustomizingTopic}
                    setCustomColorSelection={setCustomColorSelection}
                    setCustomIconSelection={setCustomIconSelection}
                    setMergeSourceTopic={setMergeSourceTopic}
                    setTargetTopicIdForMerge={setTargetTopicIdForMerge}
                    setMoveSectionSourceTopic={setMoveSectionSourceTopic}
                    setTargetSectionForMove={setTargetSectionForMove}
                    handleDuplicateTopic={handleDuplicateTopic}
                    setTopicToDelete={setTopicToDelete}
                    setNewTopicTitle={setNewTopicTitle}
                    setIsNewTopicOpen={setIsNewTopicOpen}
                    setIsShortcutsOpen={setIsShortcutsOpen}
                  />
                </div>

              {/* Professional Footer Pushed to Screen Bottom */}
              <footer className="w-full shrink-0 mt-auto pt-2.5 pb-0.5 border-t border-slate-200/80 flex items-center justify-between gap-3 text-xs font-medium text-slate-500 select-none">
                {/* Left: Official Study Flow Logo & Copyright */}
                <div className="flex items-center gap-2">
                  <div className="preserve-color relative w-[18px] h-[18px] flex items-center justify-center shrink-0">
                    <div className="absolute top-0 left-0 w-[12px] h-[12px] bg-[#2563EB] rounded-[3px]"></div>
                    <div className="absolute bottom-0 right-0 w-[12px] h-[12px] bg-[#6366F1]/90 backdrop-blur-[2px] rounded-[3px] mix-blend-multiply dark:mix-blend-screen dark:opacity-90"></div>
                  </div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 tracking-tight">
                    Study <span className="brand-flow-highlight font-extrabold">Flow</span>
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500">© 2026 All rights reserved.</span>
                </div>

                {/* Right: Version Pill */}
                <div className="flex items-center text-[11px] font-semibold text-slate-500">
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-600">
                    v9.0
                  </span>
                </div>
              </footer>
            </div>
          </div>
        </motion.div>
        )}
            </React.Suspense>
          </AnimatePresence>
        </div>

      {/* Topic Details Right Sidebar Drawer (Opens on clicking topic in Card/Banner view or Global Search deep link) */}
      {selectedTopicId && isDetailsDrawerOpen && (
        <TopicDetailsDrawer
          topic={topics.find(t => t.id === selectedTopicId) || null}
          isOpen={isDetailsDrawerOpen}
          navigationTarget={drawerNavigationTarget}
          onClose={() => {
            setIsDetailsDrawerOpen(false);
            setSelectedTopicId(null);
          }}
          onTogglePin={(topicId) => togglePinTopic(topicId)}
          onToggleTask={(topicId, taskId) => toggleTaskCompleted(topicId, taskId)}
          onAddTask={(topicId, title) => handleAddTask(topicId, title)}
          onDeleteTask={(topicId, taskId) => handleDeleteTask(topicId, taskId)}
          onUpdateTask={(topicId, updatedTask) => handleUpdateTask(topicId, updatedTask)}
          onRenameTask={(topicId, taskId, newTitle) => handleSaveRenameTask(topicId, taskId, newTitle)}
          onUpdateTopic={(updatedTopic) => {
            setTopics(prev => prev.map(t => t.id === updatedTopic.id ? updatedTopic : t));
          }}
          onRenameTopic={(topicId, newTitle) => {
            setTopics(prev => prev.map(t => t.id === topicId ? { ...t, title: newTitle } : t));
          }}
          onStartRenameTopic={(targetTopic) => {
            setEditingTopicId(targetTopic.id);
            setEditingTopicTitle(targetTopic.title);
          }}
          onDeleteTopic={(topicId) => {
            const targetTopic = topics.find(t => t.id === topicId);
            if (targetTopic) {
              setTopicToDelete(targetTopic);
            }
          }}
          onMergeTopic={(top) => {
            setMergeSourceTopic(top);
            setTargetTopicIdForMerge('');
          }}
          onMoveSectionTopic={(top) => {
            setMoveSectionSourceTopic(top);
            setTargetSectionForMove('');
          }}
          onDuplicateTopic={(topicId) => handleDuplicateTopic(topicId)}
          onBulkToggleTaskCompleted={(topicId, taskIds, completed) => handleBulkToggleTaskCompleted(topicId, taskIds, completed)}
          onBulkDeleteTasks={(topicId, taskIds) => handleBulkDeleteTasks(topicId, taskIds)}
          activeStudyTimerSession={activeStudyTimer}
          onStartStudyTimer={handleStartGlobalStudyTimer}
          onPauseStudyTimer={handlePauseGlobalStudyTimer}
          onResumeStudyTimer={handleResumeGlobalStudyTimer}
          onStopStudyTimer={handleStopAndLogGlobalStudyTimer}
          showToast={showToast}
          theme={(() => {
            const curTopic = topics.find(t => t.id === selectedTopicId);
            return curTopic ? getTopicTheme(curTopic) : undefined;
          })()}
          onOpenCustomizer={() => {
            const curTopic = topics.find(t => t.id === selectedTopicId);
            if (curTopic) {
              setCustomizingTopic(curTopic);
            }
          }}
          onActiveTaskStateChange={setDrawerActiveTaskState}
          requestedFocusTaskId={requestedFocusTaskId}
          onResetRequestedFocusTaskId={() => setRequestedFocusTaskId(null)}
          allTopics={topics}
          workspaces={workspaces}
          onNavigateToTask={(topicId, taskId, workspaceId) => {
            if (workspaceId && workspaceId !== activeWorkspaceId) {
              setActiveWorkspaceId(workspaceId);
            }
            setSelectedTopicId(topicId);
            setRequestedFocusTaskId(taskId);
            setIsDetailsDrawerOpen(true);
          }}
          focusCheckIntervalMinutes={userSettings.focusCheckIntervalMinutes || 20}
        />
      )}

      {/* --- GLOBAL FLOATING STUDY TIMER WIDGET --- */}
      <FloatingStudyTimer
        session={activeStudyTimer}
        isVisible={Boolean(activeStudyTimer && !drawerActiveTaskState?.isTimeMenuOpen)}
        onPause={handlePauseGlobalStudyTimer}
        onResume={handleResumeGlobalStudyTimer}
        onStopAndLog={handleStopAndLogGlobalStudyTimer}
        onOpenDrawer={() => {
          if (activeStudyTimer) {
            if (activeStudyTimer.workspaceId && activeStudyTimer.workspaceId !== activeWorkspaceId) {
              setActiveWorkspaceId(activeStudyTimer.workspaceId);
            }
            setSelectedTopicId(activeStudyTimer.topicId);
            setRequestedFocusTaskId(activeStudyTimer.taskId);
            setIsDetailsDrawerOpen(true);
          }
        }}
      />

      {/* --- MODALS PORTAL HUB --- */}
      <GlobalModalsHub
        isShortcutsOpen={isShortcutsOpen}
        setIsShortcutsOpen={setIsShortcutsOpen}
        isNewWorkspaceOpen={isNewWorkspaceOpen}
        setIsNewWorkspaceOpen={setIsNewWorkspaceOpen}
        newWorkspaceName={newWorkspaceName}
        setNewWorkspaceName={setNewWorkspaceName}
        handleCreateWorkspace={handleCreateWorkspace}
        editingWorkspaceId={editingWorkspaceId}
        setEditingWorkspaceId={setEditingWorkspaceId}
        editingWorkspaceName={editingWorkspaceName}
        setEditingWorkspaceName={setEditingWorkspaceName}
        handleSaveRenameWorkspace={handleSaveRenameWorkspace}
        workspaceToDelete={workspaceToDelete}
        setWorkspaceToDelete={setWorkspaceToDelete}
        handleConfirmMoveWorkspaceToRecycleBin={handleConfirmMoveWorkspaceToRecycleBin}
        isNewSectionOpen={isNewSectionOpen}
        setIsNewSectionOpen={setIsNewSectionOpen}
        newSectionName={newSectionName}
        setNewSectionName={setNewSectionName}
        handleCreateSection={handleCreateSection}
        editingSection={editingSection}
        setEditingSection={setEditingSection}
        editingSectionName={editingSectionName}
        setEditingSectionName={setEditingSectionName}
        handleSaveRenameSection={handleSaveRenameSection}
        sectionToDelete={sectionToDelete}
        setSectionToDelete={setSectionToDelete}
        handleDeleteSection={handleDeleteSection}
        isNewTopicOpen={isNewTopicOpen}
        setIsNewTopicOpen={setIsNewTopicOpen}
        newTopicTitle={newTopicTitle}
        setNewTopicTitle={setNewTopicTitle}
        handleCreateTopicModal={handleCreateTopicModal}
        isSmartStudioOpen={isSmartStudioOpen}
        setIsSmartStudioOpen={setIsSmartStudioOpen}
        smartStudioInitialMode={smartStudioInitialMode}
        handleCreateTopicsFromStudio={handleCreateTopicsFromStudio}
        currentWorkspaceSections={currentWorkspaceSections}
        activeSection={activeSection}
        editingTopicId={editingTopicId}
        setEditingTopicId={setEditingTopicId}
        editingTopicTitle={editingTopicTitle}
        setEditingTopicTitle={setEditingTopicTitle}
        handleSaveRenameTopic={handleSaveRenameTopic}
        mergeSourceTopic={mergeSourceTopic}
        setMergeSourceTopic={setMergeSourceTopic}
        targetTopicIdForMerge={targetTopicIdForMerge}
        setTargetTopicIdForMerge={setTargetTopicIdForMerge}
        handleConfirmMergeTopic={handleConfirmMergeTopic}
        moveSectionSourceTopic={moveSectionSourceTopic}
        setMoveSectionSourceTopic={setMoveSectionSourceTopic}
        targetSectionForMove={targetSectionForMove}
        setTargetSectionForMove={setTargetSectionForMove}
        handleConfirmMoveTopicToSection={handleConfirmMoveTopicToSection}
        customizingTopic={customizingTopic}
        setCustomizingTopic={setCustomizingTopic}
        customColorSelection={customColorSelection}
        setCustomColorSelection={setCustomColorSelection}
        customIconSelection={customIconSelection}
        setCustomIconSelection={setCustomIconSelection}
        setTopics={setTopics}
        getTopicTheme={getTopicTheme}
        showToast={showToast}
        topicToDelete={topicToDelete}
        setTopicToDelete={setTopicToDelete}
        handleConfirmMoveToRecycleBin={handleConfirmMoveToRecycleBin}
        taskToDelete={taskToDelete}
        setTaskToDelete={setTaskToDelete}
        handleConfirmMoveTaskToRecycleBin={handleConfirmMoveTaskToRecycleBin}
        isGlobalStillStudyingOpen={isGlobalStillStudyingOpen}
        activeStudyTimer={activeStudyTimer}
        handleResumeGlobalStudyTimer={handleResumeGlobalStudyTimer}
        handleStopAndLogGlobalStudyTimer={handleStopAndLogGlobalStudyTimer}
        isSettingsOpen={isSettingsOpen}
        setIsSettingsOpen={setIsSettingsOpen}
        userSettings={userSettings}
        handleSaveSettings={handleSaveSettings}
        handleExportJSON={handleExportJSON}
        fileInputRef={fileInputRef}
        isAuthModalOpen={isAuthModalOpen}
        setIsAuthModalOpen={setIsAuthModalOpen}
        isEditProfileOpen={isEditProfileOpen}
        setIsEditProfileOpen={setIsEditProfileOpen}
        isChangePasswordOpen={isChangePasswordOpen}
        setIsChangePasswordOpen={setIsChangePasswordOpen}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        setToastData={setToastData}
        congratulationsTopic={congratulationsTopic}
        setCongratulationsTopic={setCongratulationsTopic}
        completedTopicsCount={completedTopicsCount}
        nextIncompleteTopic={nextIncompleteTopic}
        setSelectedTopicId={setSelectedTopicId}
        setIsDetailsDrawerOpen={setIsDetailsDrawerOpen}
        isGoalCelebrationOpen={isGoalCelebrationOpen}
        setIsGoalCelebrationOpen={setIsGoalCelebrationOpen}
        dailyGoalMode={dailyGoalMode}
        currentGoalValue={currentGoalValue}
        targetGoalValue={targetGoalValue}
        streakData={streakData}
        workspacesStats={workspacesStats}
        workspaces={workspaces}
        latestMilestoneInfo={latestMilestoneInfo}
        mobileKeyboardBottomInset={mobileKeyboardBottomInset}
        topics={topics}
        displayTopics={displayTopics}
        activeWorkspaceId={activeWorkspaceId}
      />

      {/* Fixed 3-Dot Dropdown Menu for Workspace - Always on Top */}
      <AnimatePresence>
        {activeMenuWorkspaceId && workspaceMenuPos && (
          <motion.div
            key={activeMenuWorkspaceId}
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              top: `${workspaceMenuPos.top}px`,
              left: `${workspaceMenuPos.left}px`,
              zIndex: 999999,
            }}
            onClick={e => e.stopPropagation()}
            className="w-[180px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xl shadow-slate-900/40 backdrop-blur-md rounded-xl p-1 text-xs font-medium workspace-menu text-slate-700 dark:text-slate-200 select-none"
          >
            {(() => {
              const targetWs = workspaces.find(w => w.id === activeMenuWorkspaceId);
              if (!targetWs) return null;
              return (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      handleWorkspaceNewSection(targetWs.id);
                      setActiveMenuWorkspaceId(null);
                      setWorkspaceMenuPos(null);
                      if (window.innerWidth < 768) setSidebarCollapsed(true);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
                  >
                    <Plus className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
                    <span className="truncate">New section</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      togglePinWorkspace(targetWs.id);
                      setActiveMenuWorkspaceId(null);
                      setWorkspaceMenuPos(null);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
                  >
                    <Pin className={`w-3.5 h-3.5 shrink-0 ${targetWs.isPinned ? 'text-red-600 fill-red-600 dark:text-red-500 dark:fill-red-500' : 'text-slate-500 dark:text-slate-400'}`} />
                    <span className="truncate">{targetWs.isPinned ? 'Unpin' : 'Pin'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMenuWorkspaceId(null);
                      setWorkspaceMenuPos(null);
                      if (window.innerWidth < 768) setSidebarCollapsed(true);
                      handleStartRenameWorkspace(targetWs);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
                  >
                    <Pencil className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
                    <span className="truncate">Rename</span>
                  </button>
                  <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMenuWorkspaceId(null);
                      setWorkspaceMenuPos(null);
                      handleMoveWorkspaceToRecycleBin(targetWs.id);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-red-600 dark:text-rose-400 hover:bg-red-50 dark:hover:bg-rose-950/40 hover:text-red-700 dark:hover:text-rose-300"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-600 dark:text-rose-400 shrink-0" />
                    <span className="truncate">Move to Recycle bin</span>
                  </button>
                </>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Instant Floating Tooltip Portal (Always Top-Most, Never Clipped) */}
      <AnimatePresence>
        {tooltipData && (
          <div
            style={{
              position: 'fixed',
              left: `${tooltipData.x}px`,
              top: `${tooltipData.y}px`,
              transform:
                tooltipData.side === 'right'
                  ? 'translateY(-50%)'
                  : tooltipData.side === 'bottom'
                  ? 'translateX(-50%)'
                  : 'translate(-50%, -100%)',
              zIndex: 999999,
              pointerEvents: 'none',
            }}
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.94,
                x: tooltipData.side === 'right' ? -4 : tooltipData.side === 'left' ? 4 : 0,
                y: tooltipData.side === 'bottom' ? -4 : tooltipData.side === 'top' ? 4 : 0,
              }}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.12, ease: 'easeOut' }}
              className="px-2.5 py-1 bg-[#0F172A]/95 backdrop-blur-sm text-white text-[11px] font-medium tracking-wide rounded-md shadow-lg shadow-black/25 border border-white/10 select-none whitespace-nowrap"
            >
              {tooltipData.content}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- GLOBAL APP UNIFIED TOAST NOTIFICATIONS STACK --- */}
      <ToastContainer
        toasts={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
        bottomOffsetClass={
          Boolean(activeStudyTimer && !drawerActiveTaskState?.isTimeMenuOpen)
            ? 'bottom-[86px] sm:bottom-[90px]'
            : 'bottom-6'
        }
      />
    </div>
  );
}

export default App;
