import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Plus,
  Trash2,
  CornerUpRight,
  FolderOutput,
  Palette,
  Check,
  ChevronDown,
  AlertCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Bell,
  Play,
  Languages,
  Type,
  SpellCheck,
  BookA,
  NotebookTabs,
  WholeWord,
  TextCursor,
  Pilcrow,
  CaseSensitive,
  Brackets,
  BookOpen,
  BookOpenText,
  Library,
  Feather,
  PenTool,
  Scroll,
  ScrollText,
  Notebook,
  Quote,
  BookMarked,
  GraduationCap,
  PenLine,
  BookCopy,
  Theater,
  Calculator,
  Sigma,
  Radical,
  Pi,
  Percent,
  Divide,
  SquareFunction,
  Equal,
  Variable,
  Binary,
  ChartNoAxesColumn,
  Brain,
  BrainCircuit,
  Puzzle,
  Lightbulb,
  Blocks,
  Route,
  Network,
  ScanSearch,
  Workflow,
  GitBranch,
  Shapes,
  Waypoints,
  Map,
  MapPinned,
  Landmark,
  Flag,
  Building2,
  Scale,
  BadgeCheck,
  Globe,
  Earth,
  Handshake,
  Plane,
  Ship,
  Atom,
  FlaskConical,
  Microscope,
  Telescope,
  Dna,
  TestTube,
  Orbit,
  Magnet,
  Zap,
  Thermometer,
  Radiation,
  Monitor,
  Computer,
  Cpu,
  Microchip,
  Database,
  Server,
  Wifi,
  Code2,
  Terminal,
  Cloud,
  Mountain,
  Waves,
  Compass,
  Navigation,
  Trees,
  TreePine,
  Leaf,
  Sprout,
  Recycle,
  Droplets,
  Wind,
  Sun,
  CloudSun,
  Flower,
  Biohazard,
  Siren,
  ShieldAlert,
  CloudLightning,
  Flame,
  LifeBuoy,
  Ambulance,
  Radio,
  Cross,
  HeartHandshake,
  HandHeart,
  Heart,
  Smile,
  Gem,
  ThumbsUp,
  UserCheck,
  CheckCircle2,
  Star,
  Vote,
  FileCheck,
  ClipboardCheck,
  Gavel,
  Eye,
  Newspaper,
  Rss,
  Megaphone,
  CalendarDays,
  Clock,
  TrendingUp,
  Tv,
  Podcast,
  CircleHelp,
  Trophy,
  Castle,
  Crown,
  Swords,
  Hourglass,
  History,
  BookCheck,
  Banknote,
  CreditCard,
  WalletCards,
  Receipt,
  ChartNoAxesCombined,
  PiggyBank,
  Vault,
  BadgeDollarSign,
  Wallet,
  Coins,
  CircleDollarSign,
  HandCoins,
  Wheat,
  Tractor,
  Shovel,
  Apple,
  Warehouse,
  Medal,
  Award,
  Shield,
  Dumbbell,
  Volleyball,
  Bike,
  Goal,
  Timer,
  FlagTriangleRight,
  Target,
} from 'lucide-react';
import { ShortcutsAndGuideModal } from './ShortcutsAndGuideModal';
import { SmartTopicStudioModal } from './SmartTopicStudioModal';
import { SettingsModal } from './SettingsModal';
import { AuthModal } from './AuthModal';
import { EditProfileModal } from './EditProfileModal';
import { ChangePasswordModal } from './ChangePasswordModal';
import { TopicCelebrationModal, CelebrationTopicData } from './TopicCelebrationModal';
import { GoalCelebrationModal } from './GoalCelebrationModal';
import { auth } from '../firebase';
import {
  Topic,
  TaskItem,
  UserSettings,
  SectionItem,
  WorkspaceItem,
  ActiveStudyTimerSession,
} from '../types';

export interface GlobalModalsHubProps {
  // Shortcuts
  isShortcutsOpen: boolean;
  setIsShortcutsOpen: (open: boolean) => void;

  // New Workspace
  isNewWorkspaceOpen: boolean;
  setIsNewWorkspaceOpen: (open: boolean) => void;
  newWorkspaceName: string;
  setNewWorkspaceName: (name: string) => void;
  handleCreateWorkspace: (e?: any) => void;

  // Rename Workspace
  editingWorkspaceId: string | null;
  setEditingWorkspaceId: (id: string | null) => void;
  editingWorkspaceName: string;
  setEditingWorkspaceName: (name: string) => void;
  handleSaveRenameWorkspace: (e?: any) => void;

  // Delete Workspace
  workspaceToDelete: WorkspaceItem | null;
  setWorkspaceToDelete: (ws: WorkspaceItem | null) => void;
  handleConfirmMoveWorkspaceToRecycleBin: () => void;

  // New Section
  isNewSectionOpen: boolean;
  setIsNewSectionOpen: (open: boolean) => void;
  newSectionName: string;
  setNewSectionName: (name: string) => void;
  handleCreateSection: (e?: any) => void;

  // Rename Section
  editingSection: SectionItem | null;
  setEditingSection: (sec: SectionItem | null) => void;
  editingSectionName: string;
  setEditingSectionName: (name: string) => void;
  handleSaveRenameSection: (e?: any) => void;

  // Delete Section
  sectionToDelete: string | null;
  setSectionToDelete: (name: string | null) => void;
  handleDeleteSection: (name: string) => void;

  // New Topic
  isNewTopicOpen: boolean;
  setIsNewTopicOpen: (open: boolean) => void;
  newTopicTitle: string;
  setNewTopicTitle: (title: string) => void;
  handleCreateTopicModal: (e?: any) => void;

  // Smart Studio
  isSmartStudioOpen: boolean;
  setIsSmartStudioOpen: (open: boolean) => void;
  smartStudioInitialMode: 'visual' | 'markdown';
  handleCreateTopicsFromStudio: (topics: any[]) => void;
  currentWorkspaceSections: SectionItem[];
  activeSection: string | null;

  // Rename Topic
  editingTopicId: string | null;
  setEditingTopicId: (id: string | null) => void;
  editingTopicTitle: string;
  setEditingTopicTitle: (title: string) => void;
  handleSaveRenameTopic: (topicId: string, title: string) => void;

  // Merge Topic
  mergeSourceTopic: Topic | null;
  setMergeSourceTopic: (topic: Topic | null) => void;
  targetTopicIdForMerge: string;
  setTargetTopicIdForMerge: (id: string) => void;
  handleConfirmMergeTopic: () => void;

  // Move Topic to Section
  moveSectionSourceTopic: Topic | null;
  setMoveSectionSourceTopic: (topic: Topic | null) => void;
  targetSectionForMove: string;
  setTargetSectionForMove: (section: string) => void;
  handleConfirmMoveTopicToSection: () => void;

  // Topic Customizer
  customizingTopic: Topic | null;
  setCustomizingTopic: (topic: Topic | null) => void;
  customColorSelection: string;
  setCustomColorSelection: (color: string) => void;
  customIconSelection: string;
  setCustomIconSelection: (icon: string) => void;
  setTopics: React.Dispatch<React.SetStateAction<Topic[]>>;
  getTopicTheme: (topicOrTitle: string | Topic, index?: number) => any;
  showToast: (msg: string) => void;

  // Delete Topic
  topicToDelete: Topic | null;
  setTopicToDelete: (topic: Topic | null) => void;
  handleConfirmMoveToRecycleBin: () => void;

  // Delete Task
  taskToDelete: { topicId: string; task: TaskItem } | null;
  setTaskToDelete: (item: { topicId: string; task: TaskItem } | null) => void;
  handleConfirmMoveTaskToRecycleBin: () => void;

  // Still Studying Check
  isGlobalStillStudyingOpen: boolean;
  activeStudyTimer: ActiveStudyTimerSession | null;
  handleResumeGlobalStudyTimer: () => void;
  handleStopAndLogGlobalStudyTimer: () => void;

  // Settings
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  userSettings: UserSettings;
  handleSaveSettings: (settings: UserSettings) => void;
  handleExportJSON: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;

  // Auth & Profile
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isEditProfileOpen: boolean;
  setIsEditProfileOpen: (open: boolean) => void;
  isChangePasswordOpen: boolean;
  setIsChangePasswordOpen: (open: boolean) => void;
  currentUser: any;
  setCurrentUser: (user: any) => void;
  setToastData: (toast: any) => void;

  // Celebrations
  congratulationsTopic: CelebrationTopicData | null;
  setCongratulationsTopic: (topic: CelebrationTopicData | null) => void;
  completedTopicsCount: number;
  nextIncompleteTopic: Topic | null;
  setSelectedTopicId: (id: string | null) => void;
  setIsDetailsDrawerOpen: (open: boolean) => void;
  isGoalCelebrationOpen: boolean;
  setIsGoalCelebrationOpen: (open: boolean) => void;
  dailyGoalMode: 'tasks' | 'time';
  currentGoalValue: number;
  targetGoalValue: number;
  streakData: { currentStreak: number; bestStreak: number };
  workspacesStats: any[];
  workspaces: WorkspaceItem[];
  latestMilestoneInfo: { isMilestone: boolean; title?: string; icon?: string };

  // Context & UI
  mobileKeyboardBottomInset: number;
  topics: Topic[];
  displayTopics?: Topic[];
  activeWorkspaceId: string;
}

const TOPIC_CUSTOMIZER_PALETTES = [
  { id: 'blue', name: 'Royal Blue', color: '#2563EB', bgClass: 'bg-[#2563EB]' },
  { id: 'purple', name: 'Purple', color: '#8B5CF6', bgClass: 'bg-[#8B5CF6]' },
  { id: 'green', name: 'Emerald', color: '#10B981', bgClass: 'bg-[#10B981]' },
  { id: 'orange', name: 'Orange', color: '#EA580C', bgClass: 'bg-[#EA580C]' },
  { id: 'pink', name: 'Rose Pink', color: '#F43F5E', bgClass: 'bg-[#F43F5E]' },
  { id: 'cyan', name: 'Cyan', color: '#06B6D4', bgClass: 'bg-[#06B6D4]' },
  { id: 'amber', name: 'Gold', color: '#F59E0B', bgClass: 'bg-[#F59E0B]' },
];

const TOPIC_CUSTOMIZER_ICONS = [
  { id: 'languages', comp: Languages, label: 'Languages' },
  { id: 'type', comp: Type, label: 'Type' },
  { id: 'spellcheck', comp: SpellCheck, label: 'Spell Check' },
  { id: 'booka', comp: BookA, label: 'Book A' },
  { id: 'notebooktabs', comp: NotebookTabs, label: 'Notebook Tabs' },
  { id: 'wholeword', comp: WholeWord, label: 'Whole Word' },
  { id: 'textcursor', comp: TextCursor, label: 'Text Cursor' },
  { id: 'pilcrow', comp: Pilcrow, label: 'Pilcrow' },
  { id: 'casesensitive', comp: CaseSensitive, label: 'Case Sensitive' },
  { id: 'brackets', comp: Brackets, label: 'Brackets' },
  { id: 'bookopen', comp: BookOpen, label: 'Book Open' },
  { id: 'bookopentext', comp: BookOpenText, label: 'Book Text' },
  { id: 'library', comp: Library, label: 'Library' },
  { id: 'feather', comp: Feather, label: 'Feather' },
  { id: 'pentool', comp: PenTool, label: 'Pen Tool' },
  { id: 'scroll', comp: Scroll, label: 'Scroll' },
  { id: 'scrolltext', comp: ScrollText, label: 'Scroll Text' },
  { id: 'notebook', comp: Notebook, label: 'Notebook' },
  { id: 'quote', comp: Quote, label: 'Quote' },
  { id: 'bookmarked', comp: BookMarked, label: 'Bookmark' },
  { id: 'graduationcap', comp: GraduationCap, label: 'Graduation' },
  { id: 'penline', comp: PenLine, label: 'Writing' },
  { id: 'bookcopy', comp: BookCopy, label: 'Books' },
  { id: 'theater', comp: Theater, label: 'Drama' },
  { id: 'calculator', comp: Calculator, label: 'Calculator' },
  { id: 'sigma', comp: Sigma, label: 'Sigma' },
  { id: 'radical', comp: Radical, label: 'Radical' },
  { id: 'pi', comp: Pi, label: 'Pi' },
  { id: 'percent', comp: Percent, label: 'Percent' },
  { id: 'divide', comp: Divide, label: 'Divide' },
  { id: 'squarefunction', comp: SquareFunction, label: 'Square Function' },
  { id: 'equal', comp: Equal, label: 'Equal' },
  { id: 'variable', comp: Variable, label: 'Variable' },
  { id: 'binary', comp: Binary, label: 'Binary' },
  { id: 'chartnoaxescolumn', comp: ChartNoAxesColumn, label: 'Bar Chart' },
  { id: 'brain', comp: Brain, label: 'Brain' },
  { id: 'braincircuit', comp: BrainCircuit, label: 'Brain Circuit' },
  { id: 'puzzle', comp: Puzzle, label: 'Puzzle' },
  { id: 'lightbulb', comp: Lightbulb, label: 'Idea' },
  { id: 'blocks', comp: Blocks, label: 'Blocks' },
  { id: 'route', comp: Route, label: 'Route' },
  { id: 'network', comp: Network, label: 'Network' },
  { id: 'scansearch', comp: ScanSearch, label: 'Scan Search' },
  { id: 'workflow', comp: Workflow, label: 'Workflow' },
  { id: 'gitbranch', comp: GitBranch, label: 'Git Branch' },
  { id: 'shapes', comp: Shapes, label: 'Shapes' },
  { id: 'waypoints', comp: Waypoints, label: 'Waypoints' },
  { id: 'map', comp: Map, label: 'Map' },
  { id: 'mappinned', comp: MapPinned, label: 'Map Pin' },
  { id: 'landmark', comp: Landmark, label: 'Landmark' },
  { id: 'flag', comp: Flag, label: 'Flag' },
  { id: 'building2', comp: Building2, label: 'Building' },
  { id: 'scale', comp: Scale, label: 'Scale' },
  { id: 'badgecheck', comp: BadgeCheck, label: 'Badge' },
  { id: 'globe', comp: Globe, label: 'Globe' },
  { id: 'earth', comp: Earth, label: 'Earth' },
  { id: 'handshake', comp: Handshake, label: 'Handshake' },
  { id: 'plane', comp: Plane, label: 'Plane' },
  { id: 'ship', comp: Ship, label: 'Ship' },
  { id: 'atom', comp: Atom, label: 'Atom' },
  { id: 'flaskconical', comp: FlaskConical, label: 'Flask' },
  { id: 'microscope', comp: Microscope, label: 'Microscope' },
  { id: 'telescope', comp: Telescope, label: 'Telescope' },
  { id: 'dna', comp: Dna, label: 'DNA' },
  { id: 'testtube', comp: TestTube, label: 'Test Tube' },
  { id: 'orbit', comp: Orbit, label: 'Orbit' },
  { id: 'magnet', comp: Magnet, label: 'Magnet' },
  { id: 'zap', comp: Zap, label: 'Electricity' },
  { id: 'thermometer', comp: Thermometer, label: 'Thermometer' },
  { id: 'radiation', comp: Radiation, label: 'Radiation' },
  { id: 'monitor', comp: Monitor, label: 'Monitor' },
  { id: 'computer', comp: Computer, label: 'Computer' },
  { id: 'cpu', comp: Cpu, label: 'CPU' },
  { id: 'microchip', comp: Microchip, label: 'Microchip' },
  { id: 'database', comp: Database, label: 'Database' },
  { id: 'server', comp: Server, label: 'Server' },
  { id: 'wifi', comp: Wifi, label: 'Wifi' },
  { id: 'code2', comp: Code2, label: 'Code' },
  { id: 'terminal', comp: Terminal, label: 'Terminal' },
  { id: 'cloud', comp: Cloud, label: 'Cloud' },
  { id: 'mountain', comp: Mountain, label: 'Mountain' },
  { id: 'waves', comp: Waves, label: 'Waves' },
  { id: 'compass', comp: Compass, label: 'Compass' },
  { id: 'navigation', comp: Navigation, label: 'Navigation' },
  { id: 'trees', comp: Trees, label: 'Trees' },
  { id: 'treepine', comp: TreePine, label: 'Pine Tree' },
  { id: 'leaf', comp: Leaf, label: 'Leaf' },
  { id: 'sprout', comp: Sprout, label: 'Sprout' },
  { id: 'recycle', comp: Recycle, label: 'Recycle' },
  { id: 'droplets', comp: Droplets, label: 'Droplets' },
  { id: 'wind', comp: Wind, label: 'Wind' },
  { id: 'sun', comp: Sun, label: 'Sun' },
  { id: 'cloudsun', comp: CloudSun, label: 'Cloud Sun' },
  { id: 'flower', comp: Flower, label: 'Flower' },
  { id: 'biohazard', comp: Biohazard, label: 'Biohazard' },
  { id: 'alerttriangle', comp: AlertTriangle, label: 'Warning' },
  { id: 'siren', comp: Siren, label: 'Siren' },
  { id: 'shieldalert', comp: ShieldAlert, label: 'Shield Alert' },
  { id: 'cloudlightning', comp: CloudLightning, label: 'Lightning' },
  { id: 'flame', comp: Flame, label: 'Flame' },
  { id: 'lifebuoy', comp: LifeBuoy, label: 'Life Buoy' },
  { id: 'ambulance', comp: Ambulance, label: 'Ambulance' },
  { id: 'radio', comp: Radio, label: 'Radio' },
  { id: 'cross', comp: Cross, label: 'Cross' },
  { id: 'hearthandshake', comp: HeartHandshake, label: 'Heart Handshake' },
  { id: 'handheart', comp: HandHeart, label: 'Hand Heart' },
  { id: 'heart', comp: Heart, label: 'Heart' },
  { id: 'smile', comp: Smile, label: 'Smile' },
  { id: 'gem', comp: Gem, label: 'Gem' },
  { id: 'thumbsup', comp: ThumbsUp, label: 'Thumbs Up' },
  { id: 'usercheck', comp: UserCheck, label: 'User Check' },
  { id: 'checkcircle2', comp: CheckCircle2, label: 'Check Circle' },
  { id: 'star', comp: Star, label: 'Star' },
  { id: 'sparkles', comp: Sparkles, label: 'Sparkles' },
  { id: 'vote', comp: Vote, label: 'Vote' },
  { id: 'filecheck', comp: FileCheck, label: 'File Check' },
  { id: 'clipboardcheck', comp: ClipboardCheck, label: 'Clipboard' },
  { id: 'gavel', comp: Gavel, label: 'Gavel' },
  { id: 'eye', comp: Eye, label: 'Eye' },
  { id: 'newspaper', comp: Newspaper, label: 'Newspaper' },
  { id: 'rss', comp: Rss, label: 'RSS' },
  { id: 'megaphone', comp: Megaphone, label: 'Megaphone' },
  { id: 'calendardays', comp: CalendarDays, label: 'Calendar' },
  { id: 'clock', comp: Clock, label: 'Clock' },
  { id: 'trendingup', comp: TrendingUp, label: 'Trending' },
  { id: 'tv', comp: Tv, label: 'TV' },
  { id: 'podcast', comp: Podcast, label: 'Podcast' },
  { id: 'circlehelp', comp: CircleHelp, label: 'Help' },
  { id: 'trophy', comp: Trophy, label: 'Trophy' },
  { id: 'castle', comp: Castle, label: 'Castle' },
  { id: 'crown', comp: Crown, label: 'Crown' },
  { id: 'swords', comp: Swords, label: 'Swords' },
  { id: 'hourglass', comp: Hourglass, label: 'Hourglass' },
  { id: 'history', comp: History, label: 'History' },
  { id: 'bookcheck', comp: BookCheck, label: 'Book Check' },
  { id: 'banknote', comp: Banknote, label: 'Banknote' },
  { id: 'creditcard', comp: CreditCard, label: 'Credit Card' },
  { id: 'walletcards', comp: WalletCards, label: 'Wallet Cards' },
  { id: 'receipt', comp: Receipt, label: 'Receipt' },
  { id: 'chartnoaxescombined', comp: ChartNoAxesCombined, label: 'Chart' },
  { id: 'piggybank', comp: PiggyBank, label: 'Piggy Bank' },
  { id: 'vault', comp: Vault, label: 'Vault' },
  { id: 'badgedollarsign', comp: BadgeDollarSign, label: 'Dollar Badge' },
  { id: 'wallet', comp: Wallet, label: 'Wallet' },
  { id: 'coins', comp: Coins, label: 'Coins' },
  { id: 'circledollarsign', comp: CircleDollarSign, label: 'Dollar' },
  { id: 'handcoins', comp: HandCoins, label: 'Hand Coins' },
  { id: 'wheat', comp: Wheat, label: 'Wheat' },
  { id: 'tractor', comp: Tractor, label: 'Tractor' },
  { id: 'shovel', comp: Shovel, label: 'Shovel' },
  { id: 'apple', comp: Apple, label: 'Apple' },
  { id: 'warehouse', comp: Warehouse, label: 'Warehouse' },
  { id: 'medal', comp: Medal, label: 'Medal' },
  { id: 'award', comp: Award, label: 'Award' },
  { id: 'shield', comp: Shield, label: 'Shield' },
  { id: 'dumbbell', comp: Dumbbell, label: 'Dumbbell' },
  { id: 'volleyball', comp: Volleyball, label: 'Volleyball' },
  { id: 'bike', comp: Bike, label: 'Bike' },
  { id: 'goal', comp: Goal, label: 'Goal' },
  { id: 'timer', comp: Timer, label: 'Timer' },
  { id: 'flagtriangleright', comp: FlagTriangleRight, label: 'Flag Triangle' },
  { id: 'target', comp: Target, label: 'Target' },
];

export function GlobalModalsHub({
  isShortcutsOpen,
  setIsShortcutsOpen,
  isNewWorkspaceOpen,
  setIsNewWorkspaceOpen,
  newWorkspaceName,
  setNewWorkspaceName,
  handleCreateWorkspace,
  editingWorkspaceId,
  setEditingWorkspaceId,
  editingWorkspaceName,
  setEditingWorkspaceName,
  handleSaveRenameWorkspace,
  workspaceToDelete,
  setWorkspaceToDelete,
  handleConfirmMoveWorkspaceToRecycleBin,
  isNewSectionOpen,
  setIsNewSectionOpen,
  newSectionName,
  setNewSectionName,
  handleCreateSection,
  editingSection,
  setEditingSection,
  editingSectionName,
  setEditingSectionName,
  handleSaveRenameSection,
  sectionToDelete,
  setSectionToDelete,
  handleDeleteSection,
  isNewTopicOpen,
  setIsNewTopicOpen,
  newTopicTitle,
  setNewTopicTitle,
  handleCreateTopicModal,
  isSmartStudioOpen,
  setIsSmartStudioOpen,
  smartStudioInitialMode,
  handleCreateTopicsFromStudio,
  currentWorkspaceSections,
  activeSection,
  editingTopicId,
  setEditingTopicId,
  editingTopicTitle,
  setEditingTopicTitle,
  handleSaveRenameTopic,
  mergeSourceTopic,
  setMergeSourceTopic,
  targetTopicIdForMerge,
  setTargetTopicIdForMerge,
  handleConfirmMergeTopic,
  moveSectionSourceTopic,
  setMoveSectionSourceTopic,
  targetSectionForMove,
  setTargetSectionForMove,
  handleConfirmMoveTopicToSection,
  customizingTopic,
  setCustomizingTopic,
  customColorSelection,
  setCustomColorSelection,
  customIconSelection,
  setCustomIconSelection,
  setTopics,
  getTopicTheme,
  showToast,
  topicToDelete,
  setTopicToDelete,
  handleConfirmMoveToRecycleBin,
  taskToDelete,
  setTaskToDelete,
  handleConfirmMoveTaskToRecycleBin,
  isGlobalStillStudyingOpen,
  activeStudyTimer,
  handleResumeGlobalStudyTimer,
  handleStopAndLogGlobalStudyTimer,
  isSettingsOpen,
  setIsSettingsOpen,
  userSettings,
  handleSaveSettings,
  handleExportJSON,
  fileInputRef,
  isAuthModalOpen,
  setIsAuthModalOpen,
  isEditProfileOpen,
  setIsEditProfileOpen,
  isChangePasswordOpen,
  setIsChangePasswordOpen,
  currentUser,
  setCurrentUser,
  setToastData,
  congratulationsTopic,
  setCongratulationsTopic,
  completedTopicsCount,
  nextIncompleteTopic,
  setSelectedTopicId,
  setIsDetailsDrawerOpen,
  isGoalCelebrationOpen,
  setIsGoalCelebrationOpen,
  dailyGoalMode,
  currentGoalValue,
  targetGoalValue,
  streakData,
  workspacesStats,
  workspaces,
  latestMilestoneInfo,
  mobileKeyboardBottomInset,
  topics,
  displayTopics,
  activeWorkspaceId,
}: GlobalModalsHubProps) {
  const editingTopic = editingTopicId ? topics.find((t) => t.id === editingTopicId) : null;

  const [initialColor, setInitialColor] = React.useState<string>('');
  const [initialIcon, setInitialIcon] = React.useState<string>('');

  React.useEffect(() => {
    if (customizingTopic) {
      const baseTheme = getTopicTheme(customizingTopic);
      const resolvedColor = customizingTopic.customColor || baseTheme?.id || 'blue';
      let resolvedIcon = customizingTopic.customIcon || '';
      if (!resolvedIcon && baseTheme?.icon) {
        const matched = TOPIC_CUSTOMIZER_ICONS.find((ic) => ic.comp === baseTheme.icon);
        resolvedIcon = matched ? matched.id : 'bookopen';
      }
      setCustomColorSelection(resolvedColor);
      setCustomIconSelection(resolvedIcon);
      setInitialColor(resolvedColor);
      setInitialIcon(resolvedIcon);
    }
  }, [customizingTopic?.id]);

  const isCustomizerChanged = Boolean(
    customizingTopic &&
      (customColorSelection !== initialColor || customIconSelection !== initialIcon)
  );

  // Target topics for merge ordered exactly according to present topic canvas display order
  const mergeTargetTopics = React.useMemo(() => {
    if (!mergeSourceTopic) return [];
    const validTopics = topics.filter(
      (t) => t.id !== mergeSourceTopic.id && t.section === mergeSourceTopic.section
    );

    if (displayTopics && displayTopics.length > 0) {
      const displayOrderMap: Record<string, number> = {};
      displayTopics.forEach((t, idx) => {
        displayOrderMap[t.id] = idx;
      });

      return [...validTopics].sort((a, b) => {
        const orderA = a.id in displayOrderMap ? displayOrderMap[a.id] : 999999;
        const orderB = b.id in displayOrderMap ? displayOrderMap[b.id] : 999999;
        return orderA - orderB;
      });
    }

    return validTopics;
  }, [mergeSourceTopic, topics, displayTopics]);

  const [isMergeDropdownOpen, setIsMergeDropdownOpen] = React.useState(false);
  const mergeDropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        mergeDropdownRef.current &&
        !mergeDropdownRef.current.contains(e.target as Node)
      ) {
        setIsMergeDropdownOpen(false);
      }
    };
    if (isMergeDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMergeDropdownOpen]);

  React.useEffect(() => {
    setIsMergeDropdownOpen(false);
  }, [mergeSourceTopic]);

  const selectedTargetTopic = React.useMemo(() => {
    return mergeTargetTopics.find((t) => t.id === targetTopicIdForMerge);
  }, [mergeTargetTopics, targetTopicIdForMerge]);

  return (
    <>
      {/* Keyboard Shortcuts & Feature Guide Modal */}
      <ShortcutsAndGuideModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* 3. New Workspace Modal */}
      <AnimatePresence>
        {isNewWorkspaceOpen && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.15, ease: 'easeOut' } }}
              exit={{ opacity: 0, transition: { duration: 0.12, ease: 'easeIn' } }}
              className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-xs transform-gpu cursor-pointer"
              onClick={() => setIsNewWorkspaceOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{
                opacity: 1,
                scale: 1,
                y:
                  mobileKeyboardBottomInset > 0
                    ? -Math.max(10, Math.round(mobileKeyboardBottomInset / 2) - 8)
                    : 0,
                transition: {
                  type: 'spring',
                  damping: 32,
                  stiffness: 340,
                  mass: 0.85,
                },
              }}
              exit={{ opacity: 0, scale: 0.95, y: 6, transition: { duration: 0.12, ease: 'easeIn' } }}
              className="relative z-10 bg-white rounded-xl max-w-[460px] w-full p-6 shadow-2xl shadow-slate-900/15 border border-slate-200/80 overflow-hidden transform-gpu"
            >
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    Create new workspace
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-normal">
                    Organize your projects, sections, and topics in one place.
                  </p>
                </div>
                <button
                  onClick={() => setIsNewWorkspaceOpen(false)}
                  className="p-1.5 -mr-1 -mt-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-900">Workspace name</label>
                    <span
                      className={`text-[11px] font-semibold ${
                        newWorkspaceName.replace(/\s+/g, ' ').trim().length > 40
                          ? 'text-red-500 font-bold'
                          : 'text-slate-400'
                      }`}
                    >
                      {newWorkspaceName.replace(/\s+/g, ' ').trim().length}/40
                    </span>
                  </div>
                  <input
                    type="search"
                    id="new-workspace-name-input"
                    name="workspace-name-search"
                    autoComplete="off"
                    autoCorrect="on"
                    autoCapitalize="words"
                    spellCheck="false"
                    inputMode="search"
                    data-form-type="other"
                    data-lpignore="true"
                    data-1p-ignore="true"
                    maxLength={40}
                    value={newWorkspaceName}
                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCreateWorkspace(e);
                      }
                    }}
                    placeholder="e.g. English Literature"
                    autoFocus
                    className={`w-full h-[36px] bg-slate-50 border rounded-lg font-serif text-[14px] font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none transition-colors px-3.5 ${
                      newWorkspaceName.replace(/\s+/g, ' ').trim().length > 40
                        ? 'border-red-500'
                        : 'border-slate-200 focus:border-[#176BFF]'
                    }`}
                  />
                  {newWorkspaceName.replace(/\s+/g, ' ').trim().length > 40 && (
                    <p className="text-[11px] font-medium text-red-500 flex items-center gap-1 mt-0.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      Workspace name cannot exceed 40 characters (multiple spaces count as 1).
                    </p>
                  )}
                </div>
                <div className="w-full flex items-center justify-end gap-2.5 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsNewWorkspaceOpen(false)}
                    className="h-[36px] px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateWorkspace}
                    className="h-[36px] px-4 text-xs font-bold text-white bg-[#176BFF] hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    Create Workspace
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create New Topic Modal */}
      <AnimatePresence>
        {isNewTopicOpen && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.15, ease: 'easeOut' } }}
              exit={{ opacity: 0, transition: { duration: 0.12, ease: 'easeIn' } }}
              className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-xs transform-gpu cursor-pointer"
              onClick={() => setIsNewTopicOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{
                opacity: 1,
                scale: 1,
                y:
                  mobileKeyboardBottomInset > 0
                    ? -Math.max(10, Math.round(mobileKeyboardBottomInset / 2) - 8)
                    : 0,
                transition: {
                  type: 'spring',
                  damping: 32,
                  stiffness: 340,
                  mass: 0.85,
                },
              }}
              exit={{ opacity: 0, scale: 0.95, y: 6, transition: { duration: 0.12, ease: 'easeIn' } }}
              className="relative z-10 bg-white rounded-xl max-w-[460px] w-full p-6 shadow-2xl shadow-slate-900/15 border border-slate-200/80 overflow-hidden transform-gpu"
            >
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">Create new topic</h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-normal">
                    Add a new topic to organize your learning tasks and notes.
                  </p>
                </div>
                <button
                  onClick={() => setIsNewTopicOpen(false)}
                  className="p-1.5 -mr-1 -mt-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-900">Topic title</label>
                    <span
                      className={`text-[11px] font-semibold ${
                        newTopicTitle.replace(/\s+/g, ' ').trim().length > 45
                          ? 'text-red-500 font-bold'
                          : 'text-slate-400'
                      }`}
                    >
                      {newTopicTitle.replace(/\s+/g, ' ').trim().length}/45
                    </span>
                  </div>
                  <input
                    type="search"
                    id="new-topic-title-input"
                    name="topic-title-search"
                    autoComplete="off"
                    autoCorrect="on"
                    autoCapitalize="words"
                    spellCheck="false"
                    inputMode="search"
                    data-form-type="other"
                    data-lpignore="true"
                    data-1p-ignore="true"
                    maxLength={45}
                    value={newTopicTitle}
                    onChange={(e) => setNewTopicTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCreateTopicModal(e);
                      }
                    }}
                    placeholder="e.g. Quantum Mechanics, Organic Chemistry..."
                    autoFocus
                    className={`w-full h-[36px] bg-slate-50 border rounded-lg font-serif text-[14px] font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none transition-colors px-3.5 ${
                      newTopicTitle.replace(/\s+/g, ' ').trim().length > 45
                        ? 'border-red-500'
                        : 'border-slate-200 focus:border-[#176BFF]'
                    }`}
                  />
                  {newTopicTitle.replace(/\s+/g, ' ').trim().length > 45 && (
                    <p className="text-[11px] font-medium text-red-500 flex items-center gap-1 mt-0.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      Topic name cannot exceed 45 characters (multiple spaces count as 1).
                    </p>
                  )}
                </div>
                <div className="w-full flex items-center justify-between mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsNewTopicOpen(false);
                      setIsSmartStudioOpen(true);
                    }}
                    className="h-[36px] px-4 text-xs font-bold text-white bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1742BF] rounded-lg shadow-sm shadow-blue-500/25 active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                    <span className="hidden sm:inline">Studio Mode</span>
                  </button>
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setIsNewTopicOpen(false)}
                      className="h-[36px] px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleCreateTopicModal}
                      className="h-[36px] px-4 text-xs font-bold text-white bg-[#176BFF] hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                    >
                      Create Topic
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <SmartTopicStudioModal
        isOpen={isSmartStudioOpen}
        onClose={() => setIsSmartStudioOpen(false)}
        onSave={handleCreateTopicsFromStudio}
        sections={currentWorkspaceSections.map((s) => s.name)}
        activeSectionName={activeSection || currentWorkspaceSections[0]?.name || ''}
        initialMode={smartStudioInitialMode}
      />

      {/* Rename Workspace Modal */}
      <AnimatePresence>
        {editingWorkspaceId && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.15, ease: 'easeOut' } }}
              exit={{ opacity: 0, transition: { duration: 0.12, ease: 'easeIn' } }}
              className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-xs transform-gpu cursor-pointer"
              onClick={() => setEditingWorkspaceId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{
                opacity: 1,
                scale: 1,
                y:
                  mobileKeyboardBottomInset > 0
                    ? -Math.max(10, Math.round(mobileKeyboardBottomInset / 2) - 8)
                    : 0,
                transition: {
                  type: 'spring',
                  damping: 32,
                  stiffness: 340,
                  mass: 0.85,
                },
              }}
              exit={{ opacity: 0, scale: 0.95, y: 6, transition: { duration: 0.12, ease: 'easeIn' } }}
              className="relative z-10 bg-white rounded-xl max-w-[460px] w-full p-6 shadow-2xl shadow-slate-900/15 border border-slate-200/80 overflow-hidden transform-gpu"
            >
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    Rename workspace
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-normal">
                    Rename your workspace to better organize your subjects.
                  </p>
                </div>
                <button
                  onClick={() => setEditingWorkspaceId(null)}
                  className="p-1.5 -mr-1 -mt-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-900">Workspace name</label>
                    <span
                      className={`text-[11px] font-semibold ${
                        editingWorkspaceName.replace(/\s+/g, ' ').trim().length > 40
                          ? 'text-red-500 font-bold'
                          : 'text-slate-400'
                      }`}
                    >
                      {editingWorkspaceName.replace(/\s+/g, ' ').trim().length}/40
                    </span>
                  </div>
                  <input
                    type="search"
                    id="rename-workspace-input"
                    autoComplete="one-time-code"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    aria-autocomplete="none"
                    data-form-type="other"
                    data-lpignore="true"
                    data-1p-ignore="true"
                    data-bwignore="true"
                    maxLength={40}
                    value={editingWorkspaceName}
                    onChange={(e) => setEditingWorkspaceName(e.target.value)}
                    ref={(el) => {
                      if (el && !el.dataset.initSelected) {
                        el.dataset.initSelected = 'true';
                        setTimeout(() => el.select(), 20);
                      }
                    }}
                    onClick={(e) => {
                      const input = e.currentTarget;
                      if (
                        input.selectionStart === 0 &&
                        input.selectionEnd === input.value.length &&
                        input.value.length > 0
                      ) {
                        const len = input.value.length;
                        input.setSelectionRange(len, len);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSaveRenameWorkspace(e);
                      }
                    }}
                    placeholder="e.g. Premium Workspace, HSC 2026..."
                    autoFocus
                    className={`w-full h-[36px] bg-slate-50 border rounded-lg font-serif text-[14px] font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none transition-colors px-3.5 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden ${
                      editingWorkspaceName.replace(/\s+/g, ' ').trim().length > 40
                        ? 'border-red-500'
                        : 'border-slate-200 focus:border-[#176BFF]'
                    }`}
                  />
                  {editingWorkspaceName.replace(/\s+/g, ' ').trim().length > 40 && (
                    <p className="text-[11px] font-medium text-red-500 flex items-center gap-1 mt-0.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      Workspace name cannot exceed 40 characters (multiple spaces count as 1).
                    </p>
                  )}
                </div>
                <div className="w-full flex items-center justify-end gap-2.5 mt-6">
                  <button
                    type="button"
                    onClick={() => setEditingWorkspaceId(null)}
                    className="h-[36px] px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveRenameWorkspace}
                    className="h-[36px] px-4 text-xs font-bold text-white bg-[#176BFF] hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    Save Workspace
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Rename Section Modal */}
      <AnimatePresence>
        {editingSection && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.15, ease: 'easeOut' } }}
              exit={{ opacity: 0, transition: { duration: 0.12, ease: 'easeIn' } }}
              className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-xs transform-gpu cursor-pointer"
              onClick={() => setEditingSection(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{
                opacity: 1,
                scale: 1,
                y:
                  mobileKeyboardBottomInset > 0
                    ? -Math.max(10, Math.round(mobileKeyboardBottomInset / 2) - 8)
                    : 0,
                transition: {
                  type: 'spring',
                  damping: 32,
                  stiffness: 340,
                  mass: 0.85,
                },
              }}
              exit={{ opacity: 0, scale: 0.95, y: 6, transition: { duration: 0.12, ease: 'easeIn' } }}
              className="relative z-10 bg-white rounded-xl max-w-[460px] w-full p-6 shadow-2xl shadow-slate-900/15 border border-slate-200/80 overflow-hidden transform-gpu"
            >
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">Rename section</h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-normal">
                    Rename this section tab in your workspace.
                  </p>
                </div>
                <button
                  onClick={() => setEditingSection(null)}
                  className="p-1.5 -mr-1 -mt-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-900">Section name</label>
                    <span
                      className={`text-[11px] font-semibold ${
                        editingSectionName.replace(/\s+/g, ' ').trim().length > 35
                          ? 'text-red-500 font-bold'
                          : 'text-slate-400'
                      }`}
                    >
                      {editingSectionName.replace(/\s+/g, ' ').trim().length}/35
                    </span>
                  </div>
                  <input
                    type="search"
                    id="rename-section-input"
                    autoComplete="one-time-code"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    aria-autocomplete="none"
                    data-form-type="other"
                    data-lpignore="true"
                    data-1p-ignore="true"
                    data-bwignore="true"
                    maxLength={35}
                    value={editingSectionName}
                    onChange={(e) => setEditingSectionName(e.target.value)}
                    ref={(el) => {
                      if (el && !el.dataset.initSelected) {
                        el.dataset.initSelected = 'true';
                        setTimeout(() => el.select(), 20);
                      }
                    }}
                    onClick={(e) => {
                      const input = e.currentTarget;
                      if (
                        input.selectionStart === 0 &&
                        input.selectionEnd === input.value.length &&
                        input.value.length > 0
                      ) {
                        const len = input.value.length;
                        input.setSelectionRange(len, len);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSaveRenameSection(e);
                      }
                    }}
                    placeholder="e.g. Grammar, Physics, Math..."
                    autoFocus
                    className={`w-full h-[36px] bg-slate-50 border rounded-lg font-serif text-[14px] font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none transition-colors px-3.5 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden ${
                      editingSectionName.replace(/\s+/g, ' ').trim().length > 35
                        ? 'border-red-500'
                        : 'border-slate-200 focus:border-[#176BFF]'
                    }`}
                  />
                  {editingSectionName.replace(/\s+/g, ' ').trim().length > 35 && (
                    <p className="text-[11px] font-medium text-red-500 flex items-center gap-1 mt-0.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      Section name cannot exceed 35 characters (multiple spaces count as 1).
                    </p>
                  )}
                </div>
                <div className="w-full flex items-center justify-end gap-2.5 mt-6">
                  <button
                    type="button"
                    onClick={() => setEditingSection(null)}
                    className="h-[36px] px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveRenameSection}
                    className="h-[36px] px-4 text-xs font-bold text-white bg-[#176BFF] hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    Save Section
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. New Section Modal */}
      <AnimatePresence>
        {isNewSectionOpen && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.15, ease: 'easeOut' } }}
              exit={{ opacity: 0, transition: { duration: 0.12, ease: 'easeIn' } }}
              className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-xs transform-gpu cursor-pointer"
              onClick={() => setIsNewSectionOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{
                opacity: 1,
                scale: 1,
                y:
                  mobileKeyboardBottomInset > 0
                    ? -Math.max(10, Math.round(mobileKeyboardBottomInset / 2) - 8)
                    : 0,
                transition: {
                  type: 'spring',
                  damping: 32,
                  stiffness: 340,
                  mass: 0.85,
                },
              }}
              exit={{ opacity: 0, scale: 0.95, y: 6, transition: { duration: 0.12, ease: 'easeIn' } }}
              className="relative z-10 bg-white rounded-xl max-w-[460px] w-full p-6 shadow-2xl shadow-slate-900/15 border border-slate-200/80 overflow-hidden transform-gpu"
            >
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    Create new section
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-normal">
                    Add a new section tab to group related topics in your workspace.
                  </p>
                </div>
                <button
                  onClick={() => setIsNewSectionOpen(false)}
                  className="p-1.5 -mr-1 -mt-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-900">Section name</label>
                    <span
                      className={`text-[11px] font-semibold ${
                        newSectionName.replace(/\s+/g, ' ').trim().length > 35
                          ? 'text-red-500 font-bold'
                          : 'text-slate-400'
                      }`}
                    >
                      {newSectionName.replace(/\s+/g, ' ').trim().length}/35
                    </span>
                  </div>
                  <input
                    type="search"
                    id="new-section-input"
                    name="new-section-search"
                    autoComplete="off"
                    autoCorrect="on"
                    autoCapitalize="words"
                    spellCheck="false"
                    inputMode="search"
                    data-form-type="other"
                    data-lpignore="true"
                    data-1p-ignore="true"
                    maxLength={35}
                    value={newSectionName}
                    onChange={(e) => setNewSectionName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCreateSection(e);
                      }
                    }}
                    placeholder="e.g. Grammar, Vocabulary, Physics..."
                    autoFocus
                    className={`w-full h-[36px] bg-slate-50 border rounded-lg font-serif text-[14px] font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none transition-colors px-3.5 ${
                      newSectionName.replace(/\s+/g, ' ').trim().length > 35
                        ? 'border-red-500'
                        : 'border-slate-200 focus:border-[#176BFF]'
                    }`}
                  />
                  {newSectionName.replace(/\s+/g, ' ').trim().length > 35 && (
                    <p className="text-[11px] font-medium text-red-500 flex items-center gap-1 mt-0.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      Section name cannot exceed 35 characters (multiple spaces count as 1).
                    </p>
                  )}
                </div>
                <div className="w-full flex items-center justify-end gap-2.5 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsNewSectionOpen(false)}
                    className="h-[36px] px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateSection}
                    className="h-[36px] px-4 text-xs font-bold text-white bg-[#176BFF] hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    Create Section
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Focus-Mode Topic Rename Modal */}
      <AnimatePresence>
        {editingTopic && (
          <div className="fixed inset-0 z-[99999999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.1, ease: 'easeOut' } }}
              exit={{ opacity: 0, transition: { duration: 0.08, ease: 'easeIn' } }}
              className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-xs cursor-pointer"
              onClick={() => setEditingTopicId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1, transition: { duration: 0.11, ease: [0.16, 1, 0.3, 1] } }}
              exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.08, ease: 'easeIn' } }}
              className="relative z-10 bg-white rounded-xl max-w-[460px] w-full p-6 shadow-2xl shadow-slate-900/15 border border-slate-200/80 overflow-hidden"
            >
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">Rename topic</h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-normal">
                    Rename your topic to keep your learning tasks organized.
                  </p>
                </div>
                <button
                  onClick={() => setEditingTopicId(null)}
                  className="p-1.5 -mr-1 -mt-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-900">Topic title</label>
                    <span
                      className={`text-[11px] font-semibold ${
                        editingTopicTitle.replace(/\s+/g, ' ').trim().length > 45
                          ? 'text-red-500 font-bold'
                          : 'text-slate-400'
                      }`}
                    >
                      {editingTopicTitle.replace(/\s+/g, ' ').trim().length}/45
                    </span>
                  </div>
                  <input
                    type="search"
                    autoComplete="one-time-code"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    aria-autocomplete="none"
                    data-form-type="other"
                    data-lpignore="true"
                    data-1p-ignore="true"
                    data-bwignore="true"
                    maxLength={45}
                    value={editingTopicTitle}
                    onChange={(e) => setEditingTopicTitle(e.target.value)}
                    ref={(el) => {
                      if (el && !el.dataset.initSelected) {
                        el.dataset.initSelected = 'true';
                        setTimeout(() => el.select(), 20);
                      }
                    }}
                    onClick={(e) => {
                      const input = e.currentTarget;
                      if (
                        input.selectionStart === 0 &&
                        input.selectionEnd === input.value.length &&
                        input.value.length > 0
                      ) {
                        const len = input.value.length;
                        input.setSelectionRange(len, len);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSaveRenameTopic(editingTopic.id, editingTopicTitle);
                      } else if (e.key === 'Escape') {
                        e.preventDefault();
                        setEditingTopicId(null);
                      }
                    }}
                    autoFocus
                    placeholder="Enter topic name..."
                    className={`w-full h-[36px] bg-slate-50 border rounded-lg font-serif text-[14px] font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none transition-colors px-3.5 ${
                      editingTopicTitle.replace(/\s+/g, ' ').trim().length > 45
                        ? 'border-red-500'
                        : 'border-slate-200 focus:border-[#176BFF]'
                    }`}
                  />
                  {editingTopicTitle.replace(/\s+/g, ' ').trim().length > 45 && (
                    <p className="text-[11px] font-medium text-red-500 flex items-center gap-1 mt-0.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      Topic name cannot exceed 45 characters (multiple spaces count as 1).
                    </p>
                  )}
                </div>
                <div className="w-full flex items-center justify-end gap-2.5 mt-6">
                  <button
                    type="button"
                    onClick={() => setEditingTopicId(null)}
                    className="h-[36px] px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveRenameTopic(editingTopic.id, editingTopicTitle)}
                    className="h-[36px] px-4 text-xs font-bold text-white bg-[#176BFF] hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    Save Topic
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Merge Topic Modal */}
      <AnimatePresence>
        {mergeSourceTopic && (
          <div className="fixed inset-0 z-[99999999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.2, ease: 'easeOut' } }}
              exit={{ opacity: 0, transition: { duration: 0.15, ease: 'easeIn' } }}
              className="fixed inset-0 bg-[#0F172A]/50 backdrop-blur-xs transform-gpu cursor-pointer"
              onClick={() => setMergeSourceTopic(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] } }}
              exit={{ opacity: 0, scale: 0.94, y: 6, transition: { duration: 0.15, ease: [0.4, 0, 1, 1] } }}
              className="relative z-10 bg-white dark:bg-[#0F172A] rounded-xl max-w-[460px] w-full p-6 shadow-2xl shadow-slate-900/25 border border-slate-200/80 dark:border-slate-800 overflow-visible transform-gpu flex flex-col gap-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Merge Topic</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-normal">
                    Move all tasks, notes & links from “<span className="font-bold text-slate-800 dark:text-slate-100">{mergeSourceTopic.title}</span>” into another topic.
                  </p>
                </div>
                <button
                  onClick={() => setMergeSourceTopic(null)}
                  className="p-1.5 -mr-1 -mt-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-lg text-xs flex items-center justify-between preserve-color">
                <span className="text-slate-900 dark:text-white font-semibold">Tasks to transfer:</span>
                <span className="font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-2xs">
                  {mergeSourceTopic.tasks.length} {mergeSourceTopic.tasks.length === 1 ? 'task' : 'tasks'}
                </span>
              </div>

              <div className="flex flex-col gap-1.5 relative" ref={mergeDropdownRef}>
                <label className="text-xs font-bold text-slate-900 dark:text-white">Select Target Topic</label>
                
                {/* Premium Custom Trigger */}
                <button
                  type="button"
                  disabled={mergeTargetTopics.length === 0}
                  onClick={() => setIsMergeDropdownOpen((prev) => !prev)}
                  className={`w-full min-h-[42px] px-3.5 py-2 bg-slate-50/80 dark:bg-slate-900/80 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 border ${
                    isMergeDropdownOpen
                      ? 'border-[#176BFF] ring-3 ring-[#176BFF]/15 bg-white dark:bg-slate-900'
                      : 'border-slate-200/90 dark:border-slate-800'
                  } rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 transition-all shadow-xs cursor-pointer select-none flex items-center justify-between gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  {selectedTargetTopic ? (
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {(() => {
                        const theme = getTopicTheme?.(selectedTargetTopic);
                        const IconComp = theme?.icon || BookOpen;
                        return (
                          <div
                            className={`w-6 h-6 rounded-lg ${
                              theme?.cardIconBg || 'bg-[#2563EB]'
                            } flex items-center justify-center text-white shrink-0 shadow-2xs preserve-color`}
                          >
                            <IconComp className="w-3.5 h-3.5" />
                          </div>
                        );
                      })()}
                      <span className="truncate text-slate-900 dark:text-white font-bold text-left">
                        {selectedTargetTopic.title}
                      </span>
                      <span className="ml-auto text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-200/70 dark:bg-slate-800 px-2 py-0.5 rounded-full shrink-0">
                        {selectedTargetTopic.tasks.length} {selectedTargetTopic.tasks.length === 1 ? 'task' : 'tasks'}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-slate-400 dark:text-slate-400 font-medium">
                      <BookOpen className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                      <span>Select destination topic...</span>
                    </div>
                  )}
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 dark:text-slate-400 transition-transform duration-200 shrink-0 ${
                      isMergeDropdownOpen ? 'rotate-180 text-[#176BFF]' : ''
                    }`}
                  />
                </button>

                {/* Animated Dropdown Menu Popover */}
                <AnimatePresence>
                  {isMergeDropdownOpen && mergeTargetTopics.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -4, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.98 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute top-[calc(100%+4px)] left-0 right-0 z-[9999] bg-white dark:bg-[#1E293B] border border-slate-200/90 dark:border-slate-700/80 rounded-xl shadow-2xl shadow-slate-900/30 overflow-hidden max-h-[220px] overflow-y-auto p-1.5 flex flex-col gap-1"
                    >
                      {mergeTargetTopics.map((t) => {
                        const theme = getTopicTheme?.(t);
                        const IconComp = theme?.icon || BookOpen;
                        const isSelected = targetTopicIdForMerge === t.id;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => {
                              setTargetTopicIdForMerge(t.id);
                              setIsMergeDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer text-left select-none ${
                              isSelected
                                ? 'bg-blue-50/90 dark:bg-blue-600/20 text-[#2563EB] dark:text-blue-400 font-bold border border-blue-200/60 dark:border-blue-500/30'
                                : 'text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                              <div
                                className={`w-6 h-6 rounded-lg ${
                                  theme?.cardIconBg || 'bg-[#2563EB]'
                                } flex items-center justify-center text-white shrink-0 shadow-2xs preserve-color`}
                              >
                                <IconComp className="w-3.5 h-3.5" />
                              </div>
                              <span className="truncate font-semibold">{t.title}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[10.5px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                                {t.tasks.length} {t.tasks.length === 1 ? 'task' : 'tasks'}
                              </span>
                              {isSelected && (
                                <Check className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400 stroke-[3]" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>

                {mergeTargetTopics.length === 0 && (
                  <p className="text-[11px] font-medium text-amber-600 dark:text-amber-400 mt-0.5">
                    ⚠️ No other topics available in current section ({mergeSourceTopic.section || 'Default'}) to merge into.
                  </p>
                )}
              </div>

              <div className="w-full flex items-center justify-end gap-2.5 mt-2">
                <button
                  type="button"
                  onClick={() => setMergeSourceTopic(null)}
                  className="h-[36px] px-4 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!targetTopicIdForMerge}
                  onClick={handleConfirmMergeTopic}
                  className="h-[36px] px-4 text-xs font-bold text-white bg-[#176BFF] hover:bg-blue-700 disabled:opacity-40 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <CornerUpRight className="w-3.5 h-3.5" />
                  <span>Merge Topics</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Move Topic to Section Modal */}
      <AnimatePresence>
        {moveSectionSourceTopic && (
          <div className="fixed inset-0 z-[99999999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.2, ease: 'easeOut' } }}
              exit={{ opacity: 0, transition: { duration: 0.15, ease: 'easeIn' } }}
              className="fixed inset-0 bg-[#0F172A]/50 backdrop-blur-xs transform-gpu cursor-pointer"
              onClick={() => setMoveSectionSourceTopic(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] } }}
              exit={{ opacity: 0, scale: 0.94, y: 6, transition: { duration: 0.15, ease: [0.4, 0, 1, 1] } }}
              className="relative z-10 bg-white rounded-xl max-w-[460px] w-full p-6 shadow-2xl shadow-slate-900/25 border border-slate-200/80 overflow-hidden transform-gpu flex flex-col gap-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">Move Topic to Section</h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-normal">
                    Transfer “<span className="font-bold text-slate-800">{moveSectionSourceTopic.title}</span>” to another section in this workspace.
                  </p>
                </div>
                <button
                  onClick={() => setMoveSectionSourceTopic(null)}
                  className="p-1.5 -mr-1 -mt-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg text-xs flex items-center justify-between preserve-color">
                <span className="text-slate-900 font-semibold">Current section:</span>
                <span className="font-bold text-slate-900 bg-white px-2.5 py-0.5 rounded-full border border-slate-200 shadow-2xs">
                  {moveSectionSourceTopic.section || 'Default'}
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-900">Select Target Section</label>
                <select
                  value={targetSectionForMove}
                  onChange={(e) => setTargetSectionForMove(e.target.value)}
                  className="w-full bg-slate-50/70 border border-slate-200/90 rounded-lg text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#176BFF] focus:ring-3 focus:ring-[#176BFF]/10 transition-all px-3.5 py-2.5 shadow-xs cursor-pointer"
                >
                  <option value="" disabled>
                    -- Select destination section --
                  </option>
                  {currentWorkspaceSections
                    .filter((s) => s.name !== moveSectionSourceTopic.section)
                    .map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                </select>
                {currentWorkspaceSections.filter((s) => s.name !== moveSectionSourceTopic.section).length === 0 && (
                  <p className="text-[11px] font-medium text-amber-600 mt-0.5">
                    ⚠️ No other sections available in this workspace. Create a new section first!
                  </p>
                )}
              </div>

              <div className="w-full flex items-center justify-end gap-2.5 mt-2">
                <button
                  type="button"
                  onClick={() => setMoveSectionSourceTopic(null)}
                  className="h-[36px] px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!targetSectionForMove}
                  onClick={handleConfirmMoveTopicToSection}
                  className="h-[36px] px-4 text-xs font-bold text-white bg-[#176BFF] hover:bg-blue-700 disabled:opacity-40 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <FolderOutput className="w-3.5 h-3.5" />
                  <span>Move Topic</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Topic Customizer Modal: Custom Icon & Color Picker */}
      <AnimatePresence>
        {customizingTopic && (
          <div className="fixed inset-0 z-[99999999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.2, ease: 'easeOut' } }}
              exit={{ opacity: 0, transition: { duration: 0.15, ease: 'easeIn' } }}
              className="fixed inset-0 bg-[#0F172A]/50 backdrop-blur-xs transform-gpu cursor-pointer"
              onClick={() => setCustomizingTopic(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] } }}
              exit={{ opacity: 0, scale: 0.95, y: 6, transition: { duration: 0.15, ease: [0.4, 0, 1, 1] } }}
              className="relative z-10 bg-white rounded-2xl max-w-[500px] w-full p-6 shadow-2xl shadow-slate-900/25 border border-slate-200/80 overflow-hidden transform-gpu flex flex-col gap-4.5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <Palette className="w-4 h-4 text-[#2563EB]" />
                    <span>Customize Topic Icon & Color</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-normal">
                    Personalize “<span className="font-semibold text-slate-800">{customizingTopic.title}</span>” with a custom palette and icon.
                  </p>
                </div>
                <button
                  onClick={() => setCustomizingTopic(null)}
                  className="p-1.5 -mr-1 -mt-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 1. Palette Selector */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-900">
                  Choose Accent Color (7 Highlighted Palettes)
                </label>
                <div className="grid grid-cols-7 gap-2">
                  {TOPIC_CUSTOMIZER_PALETTES.map((p) => {
                    const isSelected = customColorSelection === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setCustomColorSelection(p.id)}
                        style={{ backgroundColor: p.color }}
                        className={`h-9 rounded-xl ${p.bgClass} preserve-color flex items-center justify-center text-white transition-all cursor-pointer shadow-xs ${
                          isSelected ? 'scale-105 shadow-md brightness-105' : 'hover:opacity-90 hover:scale-102'
                        }`}
                        title={p.name}
                      >
                        {isSelected && <Check className="w-5 h-5 stroke-[3.5] preserve-color" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Topic Icons Grid */}
              {(() => {
                const activePalette =
                  TOPIC_CUSTOMIZER_PALETTES.find((p) => p.id === customColorSelection) ||
                  TOPIC_CUSTOMIZER_PALETTES[0];
                return (
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-900">Choose Topic Icon</label>
                    <div className="grid grid-cols-7 sm:grid-cols-8 gap-2 max-h-[250px] overflow-y-auto p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                      {TOPIC_CUSTOMIZER_ICONS.map((ic) => {
                        const Comp = ic.comp;
                        const isSelected = customIconSelection === ic.id;
                        return (
                          <button
                            key={ic.id}
                            type="button"
                            onClick={() => setCustomIconSelection(ic.id)}
                            style={isSelected ? { backgroundColor: activePalette.color } : undefined}
                            className={`h-10 w-10 sm:h-11 sm:w-11 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                              isSelected
                                ? `${activePalette.bgClass} preserve-color text-white shadow-md scale-105`
                                : 'bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-100 hover:scale-105 shadow-2xs'
                            }`}
                            title={ic.label}
                          >
                            <Comp className="w-5 h-5 stroke-[2.2] preserve-color" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              <div className="w-full flex items-center justify-between gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  disabled={!isCustomizerChanged}
                  onClick={() => {
                    setCustomColorSelection(initialColor);
                    setCustomIconSelection(initialIcon);
                  }}
                  className={`text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isCustomizerChanged
                      ? 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer active:scale-95'
                      : 'text-slate-300 dark:text-slate-600 cursor-not-allowed opacity-50 pointer-events-none'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset all</span>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCustomizingTopic(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!customizingTopic) return;
                      const updated = {
                        ...customizingTopic,
                        customColor: customColorSelection || undefined,
                        customIcon: customIconSelection || undefined,
                      };
                      setTopics((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
                      setCustomizingTopic(null);
                      showToast(`Updated custom style for "${customizingTopic.title}"!`);
                    }}
                    className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1742BF] rounded-lg shadow-sm shadow-blue-500/25 active:scale-[0.98] transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Apply</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Move Task to Recycle Bin Confirmation Modal */}
      <AnimatePresence>
        {taskToDelete && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.1, ease: 'easeOut' } }}
              exit={{ opacity: 0, transition: { duration: 0.08, ease: 'easeIn' } }}
              className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-xs cursor-pointer"
              onClick={() => setTaskToDelete(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1, transition: { duration: 0.11, ease: [0.16, 1, 0.3, 1] } }}
              exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.08, ease: 'easeIn' } }}
              className="relative z-10 bg-white rounded-xl max-w-[420px] w-full p-6 shadow-2xl shadow-slate-900/15 border border-slate-200/80 flex flex-col items-center text-center overflow-hidden"
            >
              <button
                onClick={() => setTaskToDelete(null)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4 shrink-0">
                <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
              </div>

              <h3 className="text-base font-bold text-slate-900">
                Move task to Recycle Bin?
              </h3>

              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-[340px]">
                “<span className="font-semibold text-slate-800">{taskToDelete.task.title}</span>” will be moved to the Recycle Bin. You can undo this action immediately.
              </p>

              <div className="w-full flex items-center justify-end gap-2.5 mt-6">
                <button
                  autoFocus
                  type="button"
                  onClick={() => setTaskToDelete(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmMoveTaskToRecycleBin}
                  className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  Move to Recycle Bin
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Move Topic to Recycle Bin Confirmation Modal */}
      <AnimatePresence>
        {topicToDelete && (
          <div className="fixed inset-0 z-[99999999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.1, ease: 'easeOut' } }}
              exit={{ opacity: 0, transition: { duration: 0.08, ease: 'easeIn' } }}
              className="fixed inset-0 bg-[#0F172A]/50 backdrop-blur-xs cursor-pointer"
              onClick={() => setTopicToDelete(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.14, ease: [0.16, 1, 0.3, 1] } }}
              exit={{ opacity: 0, scale: 0.96, y: 4, transition: { duration: 0.08, ease: 'easeIn' } }}
              className="relative z-10 bg-white rounded-2xl max-w-[440px] w-full pt-4 px-6 pb-5 shadow-2xl shadow-slate-900/20 border border-slate-200/90 flex flex-col items-center text-center overflow-hidden"
            >
              <div className="relative mb-2 -mt-1 flex items-center justify-center select-none pointer-events-none">
                <svg
                  width="128"
                  height="94"
                  viewBox="0 0 140 102"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="overflow-visible"
                >
                  <ellipse cx="70" cy="94" rx="46" ry="4" fill="#FFE2E7" />
                  <path d="M102 16V24M98 20H106" stroke="#E11D48" strokeWidth="2.4" strokeLinecap="round" />
                  <path d="M35 38V46M31 42H39" stroke="#E11D48" strokeWidth="2.4" strokeLinecap="round" />
                  <path d="M22 71V79M18 75H26" stroke="#E11D48" strokeWidth="2.4" strokeLinecap="round" />
                  <circle cx="65" cy="18" r="2.4" fill="#E11D48" />
                  <circle cx="108" cy="69" r="3.2" stroke="#E11D48" strokeWidth="2" fill="none" />
                  <circle cx="98" cy="90" r="2.4" fill="#E11D48" />
                  <g transform="rotate(-8.5 70 34)">
                    <path d="M62 20C62 17.2 64.2 15 67 15H73C75.8 15 78 17.2 78 20V26H62V20Z" fill="#E11D48" />
                    <path d="M65.5 20.5C65.5 19.5 66.2 18.5 67.5 18.5H72.5C73.8 18.5 74.5 19.5 74.5 20.5V26H65.5V20.5Z" fill="white" />
                    <rect x="46" y="25" width="48" height="11" rx="5.5" fill="#E11D48" />
                  </g>
                  <path d="M49 41.5H91L87 78.5C86.6 82.5 83.2 85.5 79.2 85.5H60.8C56.8 85.5 53.4 82.5 53 78.5L49 41.5Z" fill="#E11D48" />
                  <rect x="56.5" y="47.5" width="4.5" height="28" rx="2.25" fill="white" />
                  <rect x="67.75" y="47.5" width="4.5" height="28" rx="2.25" fill="white" />
                  <rect x="79" y="47.5" width="4.5" height="28" rx="2.25" fill="white" />
                </svg>
              </div>

              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Move Topic to Recycle Bin?
              </h3>

              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-[360px]">
                Are you sure? Topic “<span className="font-semibold text-slate-800">{topicToDelete.title}</span>” and its {topicToDelete.tasks?.length || 0} {topicToDelete.tasks?.length === 1 ? 'task' : 'tasks'} will be moved to the Recycle Bin.
              </p>

              <div className="w-full flex items-center justify-end gap-2.5 mt-5">
                <button
                  autoFocus
                  type="button"
                  onClick={() => setTopicToDelete(null)}
                  className="h-[36px] px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmMoveToRecycleBin}
                  className="h-[36px] px-4 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-[0.98] rounded-lg shadow-xs shadow-rose-600/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5 stroke-[2.2]" />
                  <span>Move to Recycle Bin</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Move Workspace to Recycle Bin Confirmation Modal */}
      <AnimatePresence>
        {workspaceToDelete && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.12, ease: 'easeOut' } }}
              exit={{ opacity: 0, transition: { duration: 0.08, ease: 'easeIn' } }}
              className="fixed inset-0 bg-[#0F172A]/45 backdrop-blur-xs cursor-pointer"
              onClick={() => setWorkspaceToDelete(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.14, ease: [0.16, 1, 0.3, 1] } }}
              exit={{ opacity: 0, scale: 0.96, y: 4, transition: { duration: 0.08, ease: 'easeIn' } }}
              className="relative z-10 bg-white rounded-2xl max-w-[440px] w-full pt-4 px-6 pb-5 shadow-2xl shadow-slate-900/20 border border-slate-200/90 flex flex-col items-center text-center overflow-hidden"
            >
              <div className="relative mb-2 -mt-1 flex items-center justify-center select-none pointer-events-none">
                <svg
                  width="128"
                  height="94"
                  viewBox="0 0 140 102"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="overflow-visible"
                >
                  <ellipse cx="70" cy="94" rx="46" ry="4" fill="#FFE2E7" />
                  <path d="M102 16V24M98 20H106" stroke="#E11D48" strokeWidth="2.4" strokeLinecap="round" />
                  <path d="M35 38V46M31 42H39" stroke="#E11D48" strokeWidth="2.4" strokeLinecap="round" />
                  <path d="M22 71V79M18 75H26" stroke="#E11D48" strokeWidth="2.4" strokeLinecap="round" />
                  <circle cx="65" cy="18" r="2.4" fill="#E11D48" />
                  <circle cx="108" cy="69" r="3.2" stroke="#E11D48" strokeWidth="2" fill="none" />
                  <circle cx="98" cy="90" r="2.4" fill="#E11D48" />
                  <g transform="rotate(-8.5 70 34)">
                    <path d="M62 20C62 17.2 64.2 15 67 15H73C75.8 15 78 17.2 78 20V26H62V20Z" fill="#E11D48" />
                    <path d="M65.5 20.5C65.5 19.5 66.2 18.5 67.5 18.5H72.5C73.8 18.5 74.5 19.5 74.5 20.5V26H65.5V20.5Z" fill="white" />
                    <rect x="46" y="25" width="48" height="11" rx="5.5" fill="#E11D48" />
                  </g>
                  <path d="M49 41.5H91L87 78.5C86.6 82.5 83.2 85.5 79.2 85.5H60.8C56.8 85.5 53.4 82.5 53 78.5L49 41.5Z" fill="#E11D48" />
                  <rect x="56.5" y="47.5" width="4.5" height="28" rx="2.25" fill="white" />
                  <rect x="67.75" y="47.5" width="4.5" height="28" rx="2.25" fill="white" />
                  <rect x="79" y="47.5" width="4.5" height="28" rx="2.25" fill="white" />
                </svg>
              </div>

              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Move workspace to Recycle Bin?
              </h3>

              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-[360px]">
                Are you sure? Workspace “<span className="font-semibold text-slate-800">{workspaceToDelete.name}</span>” and all of its contents will be moved to the Recycle Bin.
              </p>

              {(() => {
                const wsTopics = topics.filter((t) => t.workspaceId === workspaceToDelete.id);
                const totalTasks = wsTopics.reduce(
                  (acc, t) => acc + (t.tasks ? t.tasks.length : 0),
                  0
                );
                const completedTasks = wsTopics.reduce(
                  (acc, t) => acc + (t.tasks ? t.tasks.filter((tk) => tk.completed).length : 0),
                  0
                );
                const progressPct =
                  totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

                return (
                  <div className="w-full mt-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 p-3">
                    <div className="grid grid-cols-3 divide-x divide-slate-200/80 text-center">
                      <div className="flex flex-col px-2">
                        <span className="text-[10.5px] font-medium text-slate-400 uppercase tracking-wider">
                          Topics
                        </span>
                        <span className="text-sm font-bold text-slate-800 mt-0.5">
                          {wsTopics.length}
                        </span>
                      </div>
                      <div className="flex flex-col px-2">
                        <span className="text-[10.5px] font-medium text-slate-400 uppercase tracking-wider">
                          Tasks
                        </span>
                        <span className="text-sm font-bold text-slate-800 mt-0.5">
                          {totalTasks}
                        </span>
                      </div>
                      <div className="flex flex-col px-2">
                        <span className="text-[10.5px] font-medium text-slate-400 uppercase tracking-wider">
                          Progress
                        </span>
                        <span className="text-sm font-bold text-[#176BFF] mt-0.5">
                          {progressPct}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="w-full flex items-center justify-end gap-2.5 mt-4.5">
                <button
                  autoFocus
                  type="button"
                  onClick={() => setWorkspaceToDelete(null)}
                  className="h-[36px] px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmMoveWorkspaceToRecycleBin}
                  className="h-[36px] px-4 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-[0.98] rounded-lg shadow-xs shadow-rose-600/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5 stroke-[2.2]" />
                  <span>Move to Recycle Bin</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Move Section to Recycle Bin Confirmation Modal */}
      <AnimatePresence>
        {sectionToDelete && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.12, ease: 'easeOut' } }}
              exit={{ opacity: 0, transition: { duration: 0.08, ease: 'easeIn' } }}
              className="fixed inset-0 bg-[#0F172A]/45 backdrop-blur-xs cursor-pointer"
              onClick={() => setSectionToDelete(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.14, ease: [0.16, 1, 0.3, 1] } }}
              exit={{ opacity: 0, scale: 0.96, y: 4, transition: { duration: 0.08, ease: 'easeIn' } }}
              className="relative z-10 bg-white rounded-2xl max-w-[440px] w-full pt-4 px-6 pb-5 shadow-2xl shadow-slate-900/20 border border-slate-200/90 flex flex-col items-center text-center overflow-hidden"
            >
              <div className="relative mb-2 -mt-1 flex items-center justify-center select-none pointer-events-none">
                <svg
                  width="128"
                  height="94"
                  viewBox="0 0 140 102"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="overflow-visible"
                >
                  <ellipse cx="70" cy="94" rx="46" ry="4" fill="#FFE2E7" />
                  <path d="M102 16V24M98 20H106" stroke="#E11D48" strokeWidth="2.4" strokeLinecap="round" />
                  <path d="M35 38V46M31 42H39" stroke="#E11D48" strokeWidth="2.4" strokeLinecap="round" />
                  <path d="M22 71V79M18 75H26" stroke="#E11D48" strokeWidth="2.4" strokeLinecap="round" />
                  <circle cx="65" cy="18" r="2.4" fill="#E11D48" />
                  <circle cx="108" cy="69" r="3.2" stroke="#E11D48" strokeWidth="2" fill="none" />
                  <circle cx="98" cy="90" r="2.4" fill="#E11D48" />
                  <g transform="rotate(-8.5 70 34)">
                    <path d="M62 20C62 17.2 64.2 15 67 15H73C75.8 15 78 17.2 78 20V26H62V20Z" fill="#E11D48" />
                    <path d="M65.5 20.5C65.5 19.5 66.2 18.5 67.5 18.5H72.5C73.8 18.5 74.5 19.5 74.5 20.5V26H65.5V20.5Z" fill="white" />
                    <rect x="46" y="25" width="48" height="11" rx="5.5" fill="#E11D48" />
                  </g>
                  <path d="M49 41.5H91L87 78.5C86.6 82.5 83.2 85.5 79.2 85.5H60.8C56.8 85.5 53.4 82.5 53 78.5L49 41.5Z" fill="#E11D48" />
                  <rect x="56.5" y="47.5" width="4.5" height="28" rx="2.25" fill="white" />
                  <rect x="67.75" y="47.5" width="4.5" height="28" rx="2.25" fill="white" />
                  <rect x="79" y="47.5" width="4.5" height="28" rx="2.25" fill="white" />
                </svg>
              </div>

              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Move section to Recycle Bin?
              </h3>

              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-[360px]">
                Are you sure? Section “<span className="font-semibold text-slate-800">{sectionToDelete}</span>” and all of its topics will be moved to the Recycle Bin.
              </p>

              {(() => {
                const secTopics = topics.filter(
                  (t) => t.workspaceId === activeWorkspaceId && t.section === sectionToDelete
                );
                const totalTasks = secTopics.reduce(
                  (acc, t) => acc + (t.tasks ? t.tasks.length : 0),
                  0
                );
                const completedTasks = secTopics.reduce(
                  (acc, t) => acc + (t.tasks ? t.tasks.filter((tk) => tk.completed).length : 0),
                  0
                );
                const progressPct =
                  totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

                return (
                  <div className="w-full mt-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 p-3">
                    <div className="grid grid-cols-3 divide-x divide-slate-200/80 text-center">
                      <div className="flex flex-col px-2">
                        <span className="text-[10.5px] font-medium text-slate-400 uppercase tracking-wider">
                          Topics
                        </span>
                        <span className="text-sm font-bold text-slate-800 mt-0.5">
                          {secTopics.length}
                        </span>
                      </div>
                      <div className="flex flex-col px-2">
                        <span className="text-[10.5px] font-medium text-slate-400 uppercase tracking-wider">
                          Tasks
                        </span>
                        <span className="text-sm font-bold text-slate-800 mt-0.5">
                          {totalTasks}
                        </span>
                      </div>
                      <div className="flex flex-col px-2">
                        <span className="text-[10.5px] font-medium text-slate-400 uppercase tracking-wider">
                          Progress
                        </span>
                        <span className="text-sm font-bold text-[#176BFF] mt-0.5">
                          {progressPct}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="w-full flex items-center justify-end gap-2.5 mt-4.5">
                <button
                  autoFocus
                  type="button"
                  onClick={() => setSectionToDelete(null)}
                  className="h-[36px] px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (sectionToDelete) {
                      const sec = sectionToDelete;
                      setSectionToDelete(null);
                      handleDeleteSection(sec);
                    }
                  }}
                  className="h-[36px] px-4 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-[0.98] rounded-lg shadow-xs shadow-rose-600/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5 stroke-[2.2]" />
                  <span>Move to Recycle Bin</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Still Studying Presence Check Modal */}
      <AnimatePresence>
        {isGlobalStillStudyingOpen && activeStudyTimer && (
          <div className="fixed inset-0 z-[999999999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="fixed inset-0 bg-[#0F172A]/50 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="relative z-10 bg-white dark:bg-slate-900 rounded-3xl max-w-[380px] w-full p-6 shadow-2xl shadow-slate-900/25 border border-slate-200/90 dark:border-slate-800 flex flex-col items-center text-center overflow-hidden"
            >
              <div
                className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-[#176BFF] border border-blue-200/80 dark:border-blue-800/60 flex items-center justify-center mb-3.5 shrink-0 shadow-sm animate-bounce"
                style={{ animationDuration: '2s' }}
              >
                <Bell className="w-7 h-7 stroke-[2.3]" />
              </div>

              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                Still Studying? 📖
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed max-w-[310px]">
                You reached your{' '}
                <b>
                  {(userSettings.focusCheckIntervalMinutes || 20) === 0.5
                    ? '30-second'
                    : `${userSettings.focusCheckIntervalMinutes || 20}-minute`}
                </b>{' '}
                focus milestone for “
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {activeStudyTimer.taskTitle || 'this task'}
                </span>
                ”!
              </p>

              <div className="w-full flex flex-col gap-2 mt-6">
                <button
                  autoFocus
                  type="button"
                  onClick={handleResumeGlobalStudyTimer}
                  className="w-full py-2.5 px-4 text-xs font-bold text-white bg-[#176BFF] hover:bg-blue-600 rounded-xl shadow-md shadow-blue-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-white" /> Yes, Keep Studying!
                </button>
                <button
                  type="button"
                  onClick={handleStopAndLogGlobalStudyTimer}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                >
                  Take a Break & Save
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <SettingsModal
            key={`settings-modal-${userSettings.primaryColor || 'blue'}-${userSettings.theme || 'light'}`}
            settings={userSettings}
            onSaveSettings={handleSaveSettings}
            onClose={() => setIsSettingsOpen(false)}
            onExportJSON={handleExportJSON}
            onImportTrigger={() => fileInputRef.current?.click()}
          />
        )}
      </AnimatePresence>

      {/* Firebase Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(user) => {
          setIsAuthModalOpen(false);
          const rawName = user?.displayName || (user?.email ? user.email.split('@')[0] : '');
          const displayName = rawName ? ` ${rawName}` : '';
          setToastData({ message: `Welcome${displayName} to Study Flow 🚀` });
        }}
      />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        currentUser={currentUser}
        onProfileUpdated={(newName) => {
          setToastData({ message: 'Display name updated successfully! ✨' });
          if (auth.currentUser) {
            setCurrentUser({ ...auth.currentUser, displayName: newName });
          }
        }}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        userEmail={currentUser?.email}
        onSuccess={() => {
          setToastData({ message: 'Password updated successfully! 🔒' });
        }}
      />

      {/* Celebratory Center Screen Topic 100% Complete Milestone Dialog */}
      <AnimatePresence>
        {congratulationsTopic && (
          <TopicCelebrationModal
            topic={congratulationsTopic}
            dailyGoal={{
              completed: completedTopicsCount,
              target: userSettings.dailyTarget || 10,
            }}
            nextTopic={nextIncompleteTopic}
            onStartNextTopic={(nextTopicId) => {
              setCongratulationsTopic(null);
              setSelectedTopicId(nextTopicId);
              setIsDetailsDrawerOpen(true);
              setTimeout(() => {
                const el = document.getElementById(nextTopicId);
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }, 150);
            }}
            onClose={() => setCongratulationsTopic(null)}
          />
        )}
      </AnimatePresence>

      {/* Global Today's Goal 100% Achieved Celebration Modal */}
      <GoalCelebrationModal
        isOpen={isGoalCelebrationOpen}
        onClose={() => setIsGoalCelebrationOpen(false)}
        mode={dailyGoalMode}
        completedAmount={currentGoalValue}
        targetAmount={targetGoalValue}
        streakDays={streakData.currentStreak}
        workspaceCount={
          workspacesStats.filter((w) => w.completedTasksCount > 0 || w.timeSpentMinutes > 0)
            .length || workspaces.length
        }
        soundEnabled={userSettings.soundEffects !== false}
        confettiEnabled={userSettings.confettiCelebration !== false}
        isMilestone={latestMilestoneInfo.isMilestone}
        milestoneTitle={latestMilestoneInfo.title}
        milestoneIcon={latestMilestoneInfo.icon}
      />
    </>
  );
}
