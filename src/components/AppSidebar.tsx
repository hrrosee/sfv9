import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Command,
  NotebookPen,
  ListTodo,
  Star,
  Keyboard,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Plus,
  Check,
  GripVertical,
  Pin,
  BookOpen,
  MoreVertical,
  Download,
  Upload,
  Trash2,
  Settings,
  LogIn,
  Sun,
  Moon,
  ChevronLeft,
  X,
  Briefcase,
} from 'lucide-react';
import { UserProfilePopover } from './UserProfilePopover';
import { UserAvatar } from './UserAvatar';
import { WorkspaceItem, UserSettings, PrimaryAccentColor, StudyNote, TaskItem, JobCircularItem } from '../types';
import { resolveEffectiveTheme } from '../utils/themeManager';

// Custom Reorder Workspaces SVG Icon
const ReorderWorkspacesIcon = ({ className = 'w-3.5 h-3.5' }: { className?: string }) => (
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

export interface AppSidebarProps {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  isAccentQuickPickerOpen: boolean;
  setIsAccentQuickPickerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userSettings: UserSettings;
  handleSelectAccentColor: (color: PrimaryAccentColor) => void;
  handleToggleThemeMode: () => void;
  isSearchPageOpen: boolean;
  setIsSearchPageOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  isNotesPageOpen: boolean;
  setIsNotesPageOpen: (open: boolean) => void;
  isTasksPageOpen: boolean;
  setIsTasksPageOpen: (open: boolean) => void;
  isRecycleBinOpen: boolean;
  setIsRecycleBinOpen: (open: boolean) => void;
  isAnalyticsPageOpen: boolean;
  setIsAnalyticsPageOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  isJobCircularsOpen?: boolean;
  setIsJobCircularsOpen?: (open: boolean) => void;
  jobCirculars?: JobCircularItem[];
  notes: StudyNote[];
  standaloneTasks: TaskItem[];
  showToast: (msg: string) => void;
  setIsShortcutsOpen: (open: boolean) => void;
  isReorderingWorkspaces: boolean;
  toggleWorkspacesCollapse: () => void;
  isWorkspacesCollapsed: boolean;
  sortedWorkspaces: WorkspaceItem[];
  workspaces: WorkspaceItem[];
  startReorderingWorkspaces: () => void;
  setIsNewWorkspaceOpen: (open: boolean) => void;
  handleCancelReorder: () => void;
  handleDoneReorder: () => void;
  draggedWsIdx: number | null;
  dragOverWsIdx: number | null;
  handleDragStart: (e: React.DragEvent, index: number) => void;
  handleDragOver: (e: React.DragEvent, index: number) => void;
  handleDrop: (e: React.DragEvent, index: number) => void;
  handleDragEnd: () => void;
  handleTouchStart: (e: React.TouchEvent, index: number) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: () => void;
  handleMoveWorkspace: (from: number, to: number) => void;
  activeWorkspaceId: string;
  setActiveWorkspaceId: (id: string) => void;
  toggleWorkspaceMenu: (wsId: string, e: React.MouseEvent) => void;
  activeMenuWorkspaceId: string | null;
  handleExportJSON: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  deletedTopics: any[];
  deletedWorkspaces: any[];
  deletedNotes: any[];
  deletedSections: any[];
  deletedTasks: any[];
  deletedTopicNotes: any[];
  deletedTopicLinks: any[];
  currentUser: any;
  profileMenuTarget: string | null;
  setProfileMenuTarget: React.Dispatch<React.SetStateAction<string | null>>;
  isOnline: boolean;
  streakData: { currentStreak: number; bestStreak: number };
  dailyGoalPercent: number;
  setIsEditProfileOpen: (open: boolean) => void;
  handleChangePassword: () => void;
  handleSwitchAccount: () => void;
  handleSignOut: () => void;
  setIsAuthModalOpen: (open: boolean) => void;
  setIsSettingsOpen: (open: boolean) => void;
  suppressSidebarTooltip: boolean;
  setSuppressSidebarTooltip: (suppress: boolean) => void;
  setTooltipData: (data: any) => void;
  ACCENT_COLOR_OPTIONS: Array<{ id: PrimaryAccentColor; label: string; color: string }>;
}

export function AppSidebar({
  sidebarCollapsed,
  setSidebarCollapsed,
  isAccentQuickPickerOpen,
  setIsAccentQuickPickerOpen,
  userSettings,
  handleSelectAccentColor,
  handleToggleThemeMode,
  isSearchPageOpen,
  setIsSearchPageOpen,
  isNotesPageOpen,
  setIsNotesPageOpen,
  isTasksPageOpen,
  setIsTasksPageOpen,
  isRecycleBinOpen,
  setIsRecycleBinOpen,
  isAnalyticsPageOpen,
  setIsAnalyticsPageOpen,
  isJobCircularsOpen = false,
  setIsJobCircularsOpen = () => {},
  jobCirculars = [],
  notes,
  standaloneTasks,
  showToast,
  setIsShortcutsOpen,
  isReorderingWorkspaces,
  toggleWorkspacesCollapse,
  isWorkspacesCollapsed,
  sortedWorkspaces,
  workspaces,
  startReorderingWorkspaces,
  setIsNewWorkspaceOpen,
  handleCancelReorder,
  handleDoneReorder,
  draggedWsIdx,
  dragOverWsIdx,
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleDragEnd,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  handleMoveWorkspace,
  activeWorkspaceId,
  setActiveWorkspaceId,
  toggleWorkspaceMenu,
  activeMenuWorkspaceId,
  handleExportJSON,
  fileInputRef,
  deletedTopics,
  deletedWorkspaces,
  deletedNotes,
  deletedSections,
  deletedTasks,
  deletedTopicNotes,
  deletedTopicLinks,
  currentUser,
  profileMenuTarget,
  setProfileMenuTarget,
  isOnline,
  streakData,
  dailyGoalPercent,
  setIsEditProfileOpen,
  handleChangePassword,
  handleSwitchAccount,
  handleSignOut,
  setIsAuthModalOpen,
  setIsSettingsOpen,
  suppressSidebarTooltip,
  setSuppressSidebarTooltip,
  setTooltipData,
  ACCENT_COLOR_OPTIONS,
}: AppSidebarProps) {
  const totalDeletedCount =
    (deletedTopics || []).length +
    (deletedWorkspaces || []).length +
    (deletedNotes || []).length +
    (deletedSections || []).length +
    (deletedTasks || []).length +
    (deletedTopicNotes || []).length +
    (deletedTopicLinks || []).length;

  return (
    <>
      {/* Mobile Left Drawer Backdrop (Instant Fade) */}
      <AnimatePresence>
        {!sidebarCollapsed && (
          <div className="md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              onClick={() => setSidebarCollapsed(true)}
              className="md:hidden fixed inset-0 bg-slate-950/45 backdrop-blur-[2px] z-[99998] cursor-pointer"
            />

            {/* Smooth Spring Gliding Mobile Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 32, stiffness: 380, mass: 0.75 }}
              className="md:hidden fixed inset-y-0 left-0 w-[275px] max-w-[85vw] h-[100dvh] z-[99999] bg-white/85 dark:bg-[#090D16]/85 backdrop-blur-[20px] border-r border-slate-200/70 dark:border-white/[0.06] shadow-2xl shadow-slate-950/25 flex flex-col select-none font-sans"
              style={{ height: '100dvh' }}
            >
              {/* Brand Header with Close Button (Exact 56px matching main header) */}
              <div className="h-[56px] sm:h-[60px] px-3.5 flex items-center justify-between shrink-0 border-b border-slate-200/80 dark:border-slate-800 relative z-50 overflow-visible">
                <div className="flex items-center gap-2.5">
                    <div className="preserve-color relative w-[23px] h-[23px] flex items-center justify-center shrink-0">
                      <div className="absolute top-0 left-0 w-[16px] h-[16px] bg-[#2563EB] rounded-[4px] shadow-3xs"></div>
                      <div className="absolute bottom-0 right-0 w-[16px] h-[16px] bg-[#6366F1]/90 backdrop-blur-[2px] rounded-[4px] mix-blend-multiply dark:mix-blend-screen dark:opacity-90 shadow-3xs"></div>
                    </div>
                  <div className="relative" data-accent-picker-container="mobile">
                    <span className="font-[700] text-[16px] text-[#101828] dark:text-slate-100 tracking-tight flex items-center">
                      Study&nbsp;
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsAccentQuickPickerOpen((prev) => !prev);
                        }}
                        className="accent-picker-toggle-btn brand-flow-highlight font-extrabold cursor-pointer hover:opacity-80 active:scale-95 transition-all inline-flex items-center rounded-md px-1 py-0.5 -mx-1 hover:bg-slate-100 dark:hover:bg-slate-800"
                        style={{ color: 'var(--primary)' }}
                        title="Click to choose accent color"
                      >
                        Flow
                      </button>
                    </span>

                    <AnimatePresence>
                      {isAccentQuickPickerOpen && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.92, y: 4 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.92, y: 4 }}
                          transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                          className="accent-picker-popover absolute left-0 top-full mt-2.5 z-[99999] p-2.5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-950/20 flex flex-col gap-2 min-w-[210px]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-between px-1 text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            <span>Accent Color</span>
                            <button
                              type="button"
                              onClick={() => setIsAccentQuickPickerOpen(false)}
                              className="p-0.5 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between gap-1.5 px-0.5">
                            {ACCENT_COLOR_OPTIONS.map((opt) => {
                              const isSelected = (userSettings.primaryColor || 'blue') === opt.id;
                              return (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onPointerDown={(e) => {
                                    e.stopPropagation();
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelectAccentColor(opt.id);
                                  }}
                                  className={`preserve-color relative w-6 h-6 rounded-full flex items-center justify-center transition-all hover:scale-115 active:scale-95 cursor-pointer shadow-xs ${
                                    isSelected
                                      ? 'ring-2 ring-offset-2 ring-slate-400 dark:ring-offset-slate-900 scale-110'
                                      : 'hover:opacity-90'
                                  }`}
                                  style={{ backgroundColor: opt.color }}
                                  title={opt.label}
                                >
                                  {isSelected && (
                                    <Check className="w-3.5 h-3.5 stroke-[3] text-white drop-shadow-xs" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleThemeMode();
                    }}
                    className="w-7 h-7 flex items-center justify-center border border-slate-200/70 dark:border-white/[0.08] rounded-[8px] text-[#667085] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-150 shrink-0 cursor-pointer active:scale-95"
                    title={
                      resolveEffectiveTheme(
                        userSettings.theme || (userSettings.darkMode ? 'dark' : 'light')
                      ) === 'dark'
                        ? 'Switch to Light Mode'
                        : 'Switch to Dark Mode'
                    }
                  >
                    {resolveEffectiveTheme(
                      userSettings.theme || (userSettings.darkMode ? 'dark' : 'light')
                    ) === 'dark' ? (
                      <Sun className="w-3.5 h-3.5 text-amber-400 stroke-[2.2]" />
                    ) : (
                      <Moon className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300 stroke-[2.2]" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setSidebarCollapsed(true)}
                    className="w-7 h-7 flex items-center justify-center border border-slate-200/70 dark:border-white/[0.08] rounded-[8px] text-[#667085] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-150 shrink-0 cursor-pointer active:scale-95"
                    title="Collapse sidebar"
                  >
                    <ChevronLeft className="w-4 h-4" strokeWidth={1.75} />
                  </button>
                </div>
              </div>

              {/* Mobile Drawer Main Content Container (No whole-sidebar scroll) */}
              <div className="flex-1 min-h-0 px-2 flex flex-col pt-1.5 pb-2 overflow-hidden">
                {/* Section 1: Views (Fixed at top) */}
                <div className="flex flex-col gap-[2px] shrink-0">
                  <div className="px-2 h-6 flex items-center text-[10.5px] font-bold text-slate-400 uppercase tracking-[0.08em] select-none">
                    Views
                  </div>

                  {/* Mobile Search Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSearchPageOpen(true);
                      setIsNotesPageOpen(false);
                      setIsTasksPageOpen(false);
                      setIsJobCircularsOpen(false);
                      setIsRecycleBinOpen(false);
                      setIsAnalyticsPageOpen(false);
                      setSidebarCollapsed(true);
                    }}
                    className={`w-full h-[32px] px-2 rounded-md flex items-center justify-between transition-colors cursor-pointer shrink-0 ${
                      isSearchPageOpen
                        ? 'bg-[#2563EB] text-white shadow-sm shadow-blue-500/25'
                        : 'text-[#334155] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Search
                        className={`w-[17px] h-[17px] shrink-0 ${
                          isSearchPageOpen ? 'text-white stroke-[2]' : 'text-slate-500 dark:text-slate-400'
                        }`}
                        strokeWidth={1.75}
                      />
                      <span
                        className={`truncate font-serif text-[13px] leading-tight ${
                          isSearchPageOpen
                            ? 'font-semibold text-white'
                            : 'font-medium text-[#334155] dark:text-slate-200'
                        }`}
                      >
                        Search
                      </span>
                    </div>
                    <kbd
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 h-[19px] rounded-[4px] border leading-none select-none shrink-0 transition-colors ${
                        isSearchPageOpen
                          ? 'bg-white/20 border-white/30 text-white'
                          : 'bg-slate-100/90 dark:bg-slate-800 border-slate-200/90 dark:border-slate-700 text-slate-500 dark:text-slate-400 shadow-3xs'
                      }`}
                    >
                      <Command
                        className={`w-[10.5px] h-[10.5px] stroke-[2.3] shrink-0 ${
                          isSearchPageOpen ? 'text-white' : 'text-slate-500 dark:text-slate-400'
                        }`}
                      />
                      <span
                        className={`text-[10px] font-bold leading-none ${
                          isSearchPageOpen ? 'text-white' : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        K
                      </span>
                    </kbd>
                  </button>

                  {/* Mobile Notes Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsNotesPageOpen(true);
                      setIsTasksPageOpen(false);
                      setIsJobCircularsOpen(false);
                      setIsSearchPageOpen(false);
                      setIsRecycleBinOpen(false);
                      setIsAnalyticsPageOpen(false);
                      setSidebarCollapsed(true);
                    }}
                    className={`w-full h-[32px] px-2 rounded-md flex items-center justify-between transition-colors cursor-pointer shrink-0 ${
                      isNotesPageOpen
                        ? 'bg-[#2563EB] text-white shadow-sm shadow-blue-500/25'
                        : 'text-[#334155] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <NotebookPen
                        className={`w-[17px] h-[17px] shrink-0 ${
                          isNotesPageOpen ? 'text-white stroke-[2]' : 'text-slate-500 dark:text-slate-400'
                        }`}
                        strokeWidth={1.75}
                      />
                      <span
                        className={`truncate font-serif text-[13px] leading-tight ${
                          isNotesPageOpen
                            ? 'font-semibold text-white'
                            : 'font-medium text-[#334155] dark:text-slate-200'
                        }`}
                      >
                        Notes
                      </span>
                    </div>
                    {notes.length > 0 && (
                      <span
                        className={`text-[9.5px] font-semibold px-1 min-w-[17px] h-[15px] flex items-center justify-center rounded-full border shrink-0 leading-none transition-colors ${
                          isNotesPageOpen
                            ? 'bg-white/20 border-white/30 text-white'
                            : 'bg-slate-100/90 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200/60 dark:border-slate-700/60'
                        }`}
                      >
                        {notes.length}
                      </span>
                    )}
                  </button>

                  {/* Mobile Tasks Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsTasksPageOpen(true);
                      setIsNotesPageOpen(false);
                      setIsJobCircularsOpen(false);
                      setIsSearchPageOpen(false);
                      setIsRecycleBinOpen(false);
                      setIsAnalyticsPageOpen(false);
                      setSidebarCollapsed(true);
                    }}
                    className={`w-full h-[32px] px-2 rounded-md flex items-center justify-between transition-colors cursor-pointer shrink-0 ${
                      isTasksPageOpen
                        ? 'bg-[#2563EB] text-white shadow-sm shadow-blue-500/25'
                        : 'text-[#334155] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <ListTodo
                        className={`w-[17px] h-[17px] shrink-0 ${
                          isTasksPageOpen ? 'text-white stroke-[2]' : 'text-slate-500 dark:text-slate-400'
                        }`}
                        strokeWidth={1.75}
                      />
                      <span
                        className={`truncate font-serif text-[13px] leading-tight ${
                          isTasksPageOpen
                            ? 'font-semibold text-white'
                            : 'font-medium text-[#334155] dark:text-slate-200'
                        }`}
                      >
                        Tasks
                      </span>
                    </div>
                    {standaloneTasks.filter((t) => !t.completed).length > 0 && (
                      <span
                        className={`text-[9.5px] font-semibold px-1 min-w-[17px] h-[15px] flex items-center justify-center rounded-full border shrink-0 leading-none transition-colors ${
                          isTasksPageOpen
                            ? 'bg-white/20 border-white/30 text-white'
                            : 'bg-slate-100/90 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200/60 dark:border-slate-700/60'
                        }`}
                      >
                        {standaloneTasks.filter((t) => !t.completed).length}
                      </span>
                    )}
                  </button>

                  {/* Mobile Circulars Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsJobCircularsOpen(true);
                      setIsTasksPageOpen(false);
                      setIsNotesPageOpen(false);
                      setIsSearchPageOpen(false);
                      setIsRecycleBinOpen(false);
                      setIsAnalyticsPageOpen(false);
                      setSidebarCollapsed(true);
                    }}
                    className={`w-full h-[32px] px-2 rounded-md flex items-center justify-between transition-colors cursor-pointer shrink-0 ${
                      isJobCircularsOpen
                        ? 'bg-[#2563EB] text-white shadow-sm shadow-blue-500/25'
                        : 'text-[#334155] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Briefcase
                        className={`w-[17px] h-[17px] shrink-0 ${
                          isJobCircularsOpen ? 'text-white stroke-[2]' : 'text-slate-500 dark:text-slate-400'
                        }`}
                        strokeWidth={1.75}
                      />
                      <span
                        className={`truncate font-serif text-[13px] leading-tight ${
                          isJobCircularsOpen
                            ? 'font-semibold text-white'
                            : 'font-medium text-[#334155] dark:text-slate-200'
                        }`}
                      >
                        Circulars
                      </span>
                    </div>
                    {jobCirculars.length > 0 && (
                      <span
                        className={`text-[9.5px] font-semibold px-1 min-w-[17px] h-[15px] flex items-center justify-center rounded-full border shrink-0 leading-none transition-colors ${
                          isJobCircularsOpen
                            ? 'bg-white/20 border-white/30 text-white'
                            : 'bg-slate-100/90 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200/60 dark:border-slate-700/60'
                        }`}
                      >
                        {jobCirculars.length}
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      showToast('Showing starred topics');
                      setSidebarCollapsed(true);
                    }}
                    className="w-full h-[32px] px-2 rounded-md flex items-center gap-2 text-slate-700 hover:bg-slate-100 hover:text-slate-950 transition-colors cursor-pointer shrink-0"
                  >
                    <Star className="w-[17px] h-[17px] shrink-0 text-slate-500" strokeWidth={1.75} />
                    <span className="truncate font-serif text-[13px] leading-tight font-medium text-[#334155]">
                      Starred
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsShortcutsOpen(true);
                      setSidebarCollapsed(true);
                    }}
                    className="w-full h-[32px] px-2 rounded-md flex items-center gap-2 text-slate-700 hover:bg-slate-100 hover:text-slate-950 transition-colors cursor-pointer shrink-0"
                  >
                    <Keyboard className="w-[17px] h-[17px] shrink-0 text-slate-500" strokeWidth={1.75} />
                    <span className="truncate font-serif text-[13px] leading-tight font-medium text-[#334155]">
                      Shortcuts
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsAnalyticsPageOpen(true);
                      setIsTasksPageOpen(false);
                      setIsJobCircularsOpen(false);
                      setIsSearchPageOpen(false);
                      setIsNotesPageOpen(false);
                      setIsRecycleBinOpen(false);
                      setSidebarCollapsed(true);
                    }}
                    className={`w-full h-[32px] px-2 rounded-md flex items-center justify-between transition-colors cursor-pointer shrink-0 ${
                      isAnalyticsPageOpen
                        ? 'bg-[#2563EB] text-white shadow-sm shadow-blue-500/25'
                        : 'text-[#334155] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <TrendingUp
                        className={`w-[17px] h-[17px] shrink-0 ${
                          isAnalyticsPageOpen ? 'text-white stroke-[2]' : 'text-slate-500 dark:text-slate-400'
                        }`}
                        strokeWidth={1.75}
                      />
                      <span
                        className={`truncate font-serif text-[13px] leading-tight ${
                          isAnalyticsPageOpen
                            ? 'font-semibold text-white'
                            : 'font-medium text-[#334155] dark:text-slate-200'
                        }`}
                      >
                        Analytics
                      </span>
                    </div>
                  </button>
                </div>

                {/* Section 2: Workspaces Header (Fixed) */}
                <div className="h-2 shrink-0" />
                <div
                  onClick={() => {
                    if (!isReorderingWorkspaces) {
                      toggleWorkspacesCollapse();
                    }
                  }}
                  className={`relative group/ws-header w-full h-6 flex items-center justify-between text-[10.5px] font-bold text-slate-400 uppercase tracking-[0.08em] select-none transition-colors shrink-0 px-1.5 ${
                    !isReorderingWorkspaces ? 'cursor-pointer hover:text-slate-600' : 'cursor-default'
                  }`}
                >
                  <div className="flex items-center gap-1.5 min-w-0 pr-14">
                    {isReorderingWorkspaces ? (
                      <span className="text-[#2563EB] font-extrabold flex items-center gap-1.5">
                        <ReorderWorkspacesIcon className="w-3.5 h-3.5" />
                        <span>Reorder</span>
                      </span>
                    ) : (
                      <>
                        <span>Workspaces</span>
                        <span className="text-[9.5px] font-semibold px-1 min-w-[17px] h-[15px] flex items-center justify-center rounded-full bg-slate-100/90 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60 leading-none">
                          {sortedWorkspaces.length}
                        </span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            isWorkspacesCollapsed ? '-rotate-90 text-slate-400' : 'rotate-0 text-slate-500 hover:text-slate-700'
                          }`}
                        />
                      </>
                    )}
                  </div>

                  {!isReorderingWorkspaces ? (
                    <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 shrink-0 z-10">
                      {workspaces.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            startReorderingWorkspaces();
                          }}
                          className="w-6 h-6 flex items-center justify-center rounded-md text-slate-400 hover:text-[#2563EB] hover:bg-blue-50 transition-all cursor-pointer"
                          title="Reorder Workspaces"
                        >
                          <ReorderWorkspacesIcon className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsNewWorkspaceOpen(true);
                          setSidebarCollapsed(true);
                        }}
                        className="w-6 h-6 flex items-center justify-center rounded-md text-slate-400 hover:text-[#2563EB] hover:bg-blue-50 transition-all cursor-pointer"
                        title="New Workspace"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1 shrink-0 z-10">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancelReorder();
                        }}
                        className="px-1.5 py-0.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-[11px] font-medium transition-all cursor-pointer"
                        title="Cancel Reordering"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDoneReorder();
                        }}
                        className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-[#2563EB] text-white hover:bg-blue-700 text-[11px] font-bold transition-all cursor-pointer shadow-3xs"
                        title="Done Reordering"
                      >
                        <Check className="w-3 h-3 stroke-[2.5]" />
                        <span>Done</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Workspaces Scrollable Section (SCROLL IS STRICTLY LIMITED HERE) */}
                <div
                  className={`flex-1 min-h-0 flex flex-col transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    !isWorkspacesCollapsed ? 'opacity-100' : 'opacity-0 pointer-events-none max-h-0'
                  }`}
                >
                  {isReorderingWorkspaces ? (
                    <div
                      className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain custom-scrollbar flex flex-col gap-[2px] py-0.5 touch-pan-y"
                      style={{ WebkitOverflowScrolling: 'touch' }}
                    >
                      {workspaces.map((ws, idx) => {
                        const isDragging = draggedWsIdx === idx;
                        const isDragOver = dragOverWsIdx === idx && draggedWsIdx !== idx;
                        const isDragBelow = draggedWsIdx !== null && draggedWsIdx < idx;
                        return (
                          <div
                            key={ws.id}
                            data-reorder-index={idx}
                            draggable
                            onDragStart={(e) => handleDragStart(e, idx)}
                            onDragOver={(e) => handleDragOver(e, idx)}
                            onDrop={(e) => handleDrop(e, idx)}
                            onDragEnd={handleDragEnd}
                            className={`relative group w-full h-[32px] min-h-[32px] shrink-0 flex items-center justify-between rounded-md px-1.5 gap-1.5 transition-all duration-150 select-none outline-none focus:outline-none focus:ring-0 ${
                              isDragging
                                ? 'opacity-40 scale-[0.98] bg-blue-50/80 dark:bg-blue-950/40 border border-blue-300 dark:border-blue-700'
                                : 'hover:bg-slate-100/80 dark:hover:bg-slate-800/60 active:bg-slate-200/60 dark:active:bg-slate-700/60'
                            }`}
                          >
                            {isDragOver && (
                              <div
                                className={`absolute left-1 right-1 h-[2px] bg-[#2563EB] dark:bg-blue-500 rounded-full shadow-sm shadow-blue-500/50 z-30 pointer-events-none ${
                                  isDragBelow ? '-bottom-[2px]' : '-top-[2px]'
                                }`}
                              />
                            )}

                            <div className="flex items-center gap-1.5 min-w-0 flex-1">
                              <div
                                onTouchStart={(e) => handleTouchStart(e, idx)}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                                className="p-0.5 -ml-0.5 cursor-grab active:cursor-grabbing touch-none flex items-center"
                                title="Drag to reorder"
                              >
                                <GripVertical className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-200 shrink-0" />
                              </div>
                              {ws.isPinned ? (
                                <Pin className="w-[15px] h-[15px] text-red-600 fill-red-600 dark:text-red-500 dark:fill-red-500 shrink-0" />
                              ) : (
                                <BookOpen
                                  className="w-[15px] h-[15px] text-slate-500 dark:text-slate-400 shrink-0"
                                  strokeWidth={1.75}
                                />
                              )}
                              <span className="truncate font-serif text-[13px] font-medium text-slate-800 dark:text-slate-200 leading-tight">
                                {ws.name}
                              </span>
                            </div>

                            {/* Up/Down Move Buttons */}
                            <div className="flex items-center gap-0.5 shrink-0">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => handleMoveWorkspace(idx, idx - 1)}
                                className={`p-1 rounded text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/80 dark:hover:bg-slate-700 active:bg-slate-200 dark:active:bg-slate-700 transition-colors outline-none focus:outline-none focus:ring-0 ${
                                  idx === 0 ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'
                                }`}
                                title="Move up"
                              >
                                <ChevronUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === workspaces.length - 1}
                                onClick={() => handleMoveWorkspace(idx, idx + 1)}
                                className={`p-1 rounded text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/80 dark:hover:bg-slate-700 active:bg-slate-200 dark:active:bg-slate-700 transition-colors outline-none focus:outline-none focus:ring-0 ${
                                  idx === workspaces.length - 1 ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'
                                }`}
                                title="Move down"
                              >
                                <ChevronDown className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div
                      className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain custom-scrollbar flex flex-col gap-[2px] py-0.5 touch-pan-y"
                      style={{ WebkitOverflowScrolling: 'touch' }}
                    >
                      {sortedWorkspaces.map((ws) => {
                        const isActive =
                          ws.id === activeWorkspaceId &&
                          !isSearchPageOpen &&
                          !isNotesPageOpen &&
                          !isTasksPageOpen &&
                          !isJobCircularsOpen &&
                          !isRecycleBinOpen &&
                          !isAnalyticsPageOpen;
                        return (
                          <div
                            key={ws.id}
                            id={`mobile-sidebar-workspace-${ws.id}`}
                            className={`relative group w-full h-[32px] min-h-[32px] shrink-0 flex items-center justify-between rounded-md transition-all duration-150 ${
                              isActive
                                ? 'bg-[#2563EB] text-white shadow-sm shadow-blue-500/25'
                                : 'text-[#334155] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            <div
                              onClick={() => {
                                setActiveWorkspaceId(ws.id);
                                setIsSearchPageOpen(false);
                                setIsNotesPageOpen(false);
                                setIsTasksPageOpen(false);
                                setIsJobCircularsOpen(false);
                                setIsAnalyticsPageOpen(false);
                                setIsRecycleBinOpen(false);
                                setSidebarCollapsed(true);
                              }}
                              className="flex-1 h-[32px] px-2 flex items-center gap-2 truncate min-w-0 cursor-pointer pr-2"
                            >
                              {ws.isPinned ? (
                                <Pin
                                  className={`w-[15px] h-[15px] shrink-0 ${
                                    isActive
                                      ? 'text-white fill-white'
                                      : 'text-red-600 fill-red-600 dark:text-red-500 dark:fill-red-500'
                                  }`}
                                />
                              ) : (
                                <BookOpen
                                  className={`w-[17px] h-[17px] shrink-0 ${
                                    isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'
                                  }`}
                                  strokeWidth={1.75}
                                />
                              )}
                              <span
                                className={`truncate font-serif text-[13px] leading-tight ${
                                  isActive
                                    ? 'font-semibold text-white'
                                    : 'font-medium text-[#334155] dark:text-slate-200'
                                }`}
                              >
                                {ws.name}
                              </span>
                            </div>

                            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 z-30 transition-all duration-150 shrink-0">
                              <button
                                type="button"
                                onClick={(e) => toggleWorkspaceMenu(ws.id, e)}
                                className={`w-6 h-6 flex items-center justify-center rounded-md transition-colors cursor-pointer workspace-menu-btn ${
                                  isActive
                                    ? activeMenuWorkspaceId === ws.id
                                      ? 'bg-white/25 text-white'
                                      : 'text-white/90 hover:text-white hover:bg-white/20'
                                    : activeMenuWorkspaceId === ws.id
                                    ? 'bg-slate-200/70 text-[#0F172A]'
                                    : 'text-[#64748B] hover:text-[#0F172A] hover:bg-slate-200/60'
                                }`}
                                title="Options"
                              >
                                <MoreVertical className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Section 3: Bottom Preferences & Profile (Fixed Footer) */}
              <div className="px-2 pb-2 pt-1 flex flex-col gap-[2px] shrink-0 bg-transparent border-t border-slate-200/70 dark:border-white/[0.06]">
                <div className="px-2 h-6 flex items-center text-[10.5px] font-bold text-slate-400 uppercase tracking-[0.08em] select-none">
                  Preferences
                </div>

                <button
                  type="button"
                  onClick={() => {
                    handleExportJSON();
                    setSidebarCollapsed(true);
                  }}
                  className="w-full h-[32px] px-2 rounded-md flex items-center gap-2 text-slate-700 hover:bg-slate-100 hover:text-slate-950 transition-colors cursor-pointer shrink-0"
                >
                  <Download className="w-[17px] h-[17px] shrink-0 text-slate-500" strokeWidth={1.75} />
                  <span className="truncate font-serif text-[13px] leading-tight font-medium text-[#334155]">
                    Export
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    fileInputRef.current?.click();
                    setSidebarCollapsed(true);
                  }}
                  className="w-full h-[32px] px-2 rounded-md flex items-center gap-2 text-slate-700 hover:bg-slate-100 hover:text-slate-950 transition-colors cursor-pointer shrink-0"
                >
                  <Upload className="w-[17px] h-[17px] shrink-0 text-slate-500" strokeWidth={1.75} />
                  <span className="truncate font-serif text-[13px] leading-tight font-medium text-[#334155]">
                    Import
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsRecycleBinOpen(true);
                    setIsTasksPageOpen(false);
                    setIsJobCircularsOpen(false);
                    setIsNotesPageOpen(false);
                    setIsSearchPageOpen(false);
                    setIsAnalyticsPageOpen(false);
                    setSidebarCollapsed(true);
                  }}
                  className={`w-full h-[32px] px-2 rounded-md flex items-center justify-between transition-colors cursor-pointer shrink-0 ${
                    isRecycleBinOpen
                      ? 'bg-[#2563EB] text-white shadow-sm shadow-blue-500/25'
                      : 'text-[#334155] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Trash2
                      className={`w-[17px] h-[17px] shrink-0 ${
                        isRecycleBinOpen ? 'text-white stroke-[2]' : 'text-slate-500 dark:text-slate-400'
                      }`}
                      strokeWidth={1.75}
                    />
                    <span
                      className={`truncate font-serif text-[13px] leading-tight ${
                        isRecycleBinOpen
                          ? 'font-semibold text-white'
                          : 'font-medium text-[#334155] dark:text-slate-200'
                      }`}
                    >
                      Trash
                    </span>
                  </div>
                  {totalDeletedCount > 0 && (
                    <span
                      className={`px-1 min-w-[17px] h-[15px] flex items-center justify-center rounded-full text-[9.5px] font-semibold shrink-0 leading-none transition-colors border ${
                        isRecycleBinOpen
                          ? 'bg-white/20 border-white/30 text-white'
                          : 'bg-slate-100/90 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200/60 dark:border-slate-700/60'
                      }`}
                    >
                      {totalDeletedCount}
                    </span>
                  )}
                </button>

                <div className="h-2 shrink-0" />

                {/* Mobile Drawer Bottom Minimal 2-Line User Profile + Settings Gear */}
                <div className="relative user-profile-dropdown-container flex items-center gap-2 w-full">
                  {currentUser && (
                    <UserProfilePopover
                      isOpen={profileMenuTarget === 'sidebar'}
                      onClose={() => setProfileMenuTarget(null)}
                      currentUser={currentUser}
                      isOnline={isOnline}
                      currentStreak={streakData.currentStreak}
                      dailyGoalPercent={dailyGoalPercent}
                      onOpenEditProfile={() => setIsEditProfileOpen(true)}
                      onChangePassword={handleChangePassword}
                      onSwitchAccount={handleSwitchAccount}
                      onSignOut={handleSignOut}
                      position="sidebar"
                    />
                  )}

                  {currentUser ? (
                    <div
                      onClick={() => {
                        setProfileMenuTarget((prev) => (prev === 'sidebar' ? null : 'sidebar'));
                      }}
                      className="flex-1 min-w-0 px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center gap-2 select-none cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className="relative w-7 h-7 shrink-0">
                        <UserAvatar
                          photoURL={currentUser.photoURL}
                          displayName={currentUser.displayName}
                          email={currentUser.email}
                          textClassName="text-[11px]"
                          className="border border-slate-200/90 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
                        />
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ring-2 ring-white dark:ring-slate-900 shadow-3xs pointer-events-none transition-colors ${
                            isOnline ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                          title={isOnline ? 'Cloud Synced' : 'Offline Mode (Local Cache)'}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[11.5px] font-bold text-slate-800 dark:text-slate-200 truncate leading-tight">
                          {currentUser.displayName || 'Study Flow User'}
                        </div>
                        <div className="text-[9px] text-slate-400 dark:text-slate-400 truncate leading-tight mt-0.5">
                          {currentUser.email || (isOnline ? 'Cloud Synced' : 'Offline')}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setIsAuthModalOpen(true);
                        setSidebarCollapsed(true);
                      }}
                      className="flex-1 h-[32px] px-2 rounded-md bg-blue-50/90 text-[#2563EB] text-[12.5px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer hover:bg-blue-100 transition-colors"
                    >
                      <LogIn className="w-[17px] h-[17px]" strokeWidth={1.75} />
                      <span>Sign In</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setIsSettingsOpen(true);
                      setSidebarCollapsed(true);
                    }}
                    className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer shrink-0"
                    title="Settings"
                  >
                    <Settings className="w-[17px] h-[17px]" strokeWidth={1.75} />
                  </button>
                </div>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Desktop Left Sidebar (255px / 56px) - Frosted Glass Aesthetic matching Header */}
      <aside
        className={`hidden md:flex flex-col shrink-0 select-none font-sans static z-20 border-r border-slate-200/70 dark:border-white/[0.06] bg-white/85 dark:bg-[#090D16]/85 backdrop-blur-[20px] h-[100vh] transition-[width] duration-280 ease-[cubic-bezier(0.2,0,0,1)] ${
          sidebarCollapsed ? 'w-[56px] overflow-hidden' : 'w-[255px]'
        }`}
        style={{ height: '100vh' }}
      >
        {/* Brand Header (72px height) */}
        <div className="h-[72px] px-2 flex items-center shrink-0 relative z-50 overflow-visible">
          <div
            className={`w-full h-[36px] flex items-center select-none rounded-lg transition-colors group relative ${
              sidebarCollapsed
                ? 'justify-center px-0 hover:bg-slate-200/75 dark:hover:bg-slate-800/80 cursor-pointer'
                : 'px-1.5 cursor-default'
            }`}
            onClick={() => {
              if (sidebarCollapsed) {
                setTooltipData(null);
                setSidebarCollapsed(false);
              }
            }}
            data-tooltip={sidebarCollapsed && !suppressSidebarTooltip ? 'Expand sidebar' : undefined}
            data-tooltip-side="right"
          >
            <div
              className={`flex items-center ${
                sidebarCollapsed ? 'justify-center' : 'gap-2.5 min-w-0 flex-1 pr-16'
              }`}
            >
              {/* Brand logo icon: 100% stationary anchor */}
                <div className="preserve-color relative w-[23px] h-[23px] flex items-center justify-center shrink-0">
                  <div className="absolute top-0 left-0 w-[16px] h-[16px] bg-[#2563EB] rounded-[4px] shadow-3xs"></div>
                  <div className="absolute bottom-0 right-0 w-[16px] h-[16px] bg-[#6366F1]/90 backdrop-blur-[2px] rounded-[4px] mix-blend-multiply dark:mix-blend-screen dark:opacity-90 shadow-3xs"></div>
                </div>

              {/* Brand title - Gemini style overflow reveal */}
              <div className="relative" data-accent-picker-container="desktop">
                <span
                  className={`font-[700] text-[16px] leading-[22px] text-[#101828] dark:text-slate-100 tracking-tight whitespace-nowrap transition-opacity duration-200 ease-out flex items-center ${
                    sidebarCollapsed ? 'w-0 opacity-0 pointer-events-none' : 'opacity-100'
                  }`}
                >
                  Study&nbsp;
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsAccentQuickPickerOpen((prev) => !prev);
                    }}
                    className="accent-picker-toggle-btn brand-flow-highlight font-extrabold cursor-pointer hover:opacity-80 active:scale-95 transition-all inline-flex items-center rounded-md px-1 py-0.5 -mx-1 hover:bg-slate-100 dark:hover:bg-slate-800"
                    style={{ color: 'var(--primary)' }}
                    title="Click to choose accent color"
                  >
                    Flow
                  </button>
                </span>

                <AnimatePresence>
                  {isAccentQuickPickerOpen && !sidebarCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.92, y: 4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.92, y: 4 }}
                      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                      className="accent-picker-popover absolute left-0 top-full mt-2.5 z-[99999] p-2.5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-950/20 flex flex-col gap-2 min-w-[210px]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-between px-1 text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        <span>Accent Color</span>
                        <button
                          type="button"
                          onClick={() => setIsAccentQuickPickerOpen(false)}
                          className="p-0.5 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between gap-1.5 px-0.5">
                        {ACCENT_COLOR_OPTIONS.map((opt) => {
                          const isSelected = (userSettings.primaryColor || 'blue') === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onPointerDown={(e) => {
                                e.stopPropagation();
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectAccentColor(opt.id);
                              }}
                              className={`preserve-color relative w-6 h-6 rounded-full flex items-center justify-center transition-all hover:scale-115 active:scale-95 cursor-pointer shadow-xs ${
                                isSelected
                                  ? 'ring-2 ring-offset-2 ring-slate-400 dark:ring-offset-slate-900 scale-110'
                                  : 'hover:opacity-90'
                              }`}
                              style={{ backgroundColor: opt.color }}
                              title={opt.label}
                            >
                              {isSelected && (
                                <Check className="w-3.5 h-3.5 stroke-[3] text-white drop-shadow-xs" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Dark / Light Mode Switch button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleThemeMode();
              }}
              data-tooltip={
                resolveEffectiveTheme(
                  userSettings.theme || (userSettings.darkMode ? 'dark' : 'light')
                ) === 'dark'
                  ? 'Switch to Light Mode'
                  : 'Switch to Dark Mode'
              }
              data-tooltip-side="bottom"
              className={`absolute right-9.5 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center border border-slate-200/70 dark:border-white/[0.08] rounded-[8px] text-[#667085] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-150 shrink-0 cursor-pointer ${
                sidebarCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            >
              {resolveEffectiveTheme(
                userSettings.theme || (userSettings.darkMode ? 'dark' : 'light')
              ) === 'dark' ? (
                <Sun className="w-3.5 h-3.5 text-amber-400 stroke-[2.2]" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300 stroke-[2.2]" />
              )}
            </button>

            {/* Collapse button positioned absolutely to preserve 0-shift on the logo */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setTooltipData(null);
                setSuppressSidebarTooltip(true);
                setSidebarCollapsed(true);
                setTimeout(() => setSuppressSidebarTooltip(false), 400);
              }}
              data-tooltip="Collapse sidebar"
              data-tooltip-side="bottom"
              className={`absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center border border-slate-200/70 dark:border-white/[0.08] rounded-[8px] text-[#667085] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-150 shrink-0 cursor-pointer ${
                sidebarCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={1.75} />
            </button>
          </div>
        </div>

        {/* Main Navigation Container (Fixed Views + Scrollable Workspace List only) */}
        <div className="flex-1 min-h-0 px-2 flex flex-col pt-1 pb-2 overflow-hidden">
          {/* Section 1: VIEWS / QUICK ACCESS (Fixed at top) */}
          <div className="flex flex-col gap-[2px] shrink-0">
            <div
              className={`px-1.5 h-6 flex items-center text-[10.5px] font-bold text-slate-400 uppercase tracking-[0.08em] select-none overflow-hidden whitespace-nowrap transition-opacity duration-200 ${
                sidebarCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            >
              Views
            </div>

            {/* Search View Button */}
            <button
              onClick={() => {
                setIsSearchPageOpen((prev) => {
                  const next = typeof prev === 'function' ? (prev as any)(isSearchPageOpen) : !prev;
                  if (next) {
                    setIsTasksPageOpen(false);
                    setIsJobCircularsOpen(false);
                    setIsNotesPageOpen(false);
                    setIsRecycleBinOpen(false);
                    setIsAnalyticsPageOpen(false);
                  }
                  return next;
                });
              }}
              data-tooltip={sidebarCollapsed ? 'Search' : undefined}
              data-tooltip-side="right"
              className={`group w-full h-[32px] rounded-md flex items-center px-1.5 gap-1.5 ${
                isSearchPageOpen
                  ? sidebarCollapsed
                    ? ''
                    : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm shadow-blue-500/25'
                  : 'hover:bg-slate-200/75 dark:hover:bg-slate-800/80 text-[#334155] dark:text-slate-200'
              } transition-all duration-150 cursor-pointer shrink-0`}
            >
              <div
                className={`w-7 h-7 flex items-center justify-center shrink-0 transition-all duration-150 ${
                  isSearchPageOpen && sidebarCollapsed
                    ? 'rounded-md bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm shadow-blue-500/25'
                    : ''
                }`}
              >
                <Search
                  className={`w-[17px] h-[17px] ${
                    isSearchPageOpen
                      ? 'text-white stroke-[2]'
                      : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                  } transition-colors duration-150`}
                  strokeWidth={1.75}
                />
              </div>
              <span
                className={`truncate leading-tight block font-serif text-[13px] ${
                  isSearchPageOpen
                    ? 'text-white font-[600]'
                    : 'font-[500] text-[#334155] dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white'
                } whitespace-nowrap transition-all duration-150 ease-out flex-1 text-left ${
                  sidebarCollapsed ? 'w-0 opacity-0 pointer-events-none' : 'opacity-100'
                }`}
              >
                Search
              </span>
              {!sidebarCollapsed && (
                <kbd
                  className={`hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 h-[19px] rounded-[4px] border leading-none select-none shrink-0 transition-colors ${
                    isSearchPageOpen
                      ? 'bg-white/20 border-white/30 text-white shadow-none'
                      : 'bg-slate-100/90 dark:bg-slate-800 border-slate-200/90 dark:border-slate-700 text-slate-500 dark:text-slate-400 shadow-3xs group-hover:border-slate-300 dark:group-hover:border-slate-600'
                  }`}
                >
                  <Command
                    className={`w-[10.5px] h-[10.5px] stroke-[2.3] shrink-0 ${
                      isSearchPageOpen ? 'text-white' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  />
                  <span
                    className={`text-[10px] font-bold leading-none ${
                      isSearchPageOpen ? 'text-white' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    K
                  </span>
                </kbd>
              )}
            </button>

            {/* Notes View Button */}
            <button
              onClick={() => {
                setIsNotesPageOpen(true);
                setIsTasksPageOpen(false);
                setIsJobCircularsOpen(false);
                setIsSearchPageOpen(false);
                setIsRecycleBinOpen(false);
                setIsAnalyticsPageOpen(false);
              }}
              data-tooltip={sidebarCollapsed ? 'Notes' : undefined}
              data-tooltip-side="right"
              className={`group w-full h-[32px] rounded-md flex items-center px-1.5 gap-1.5 ${
                isNotesPageOpen
                  ? sidebarCollapsed
                    ? ''
                    : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm shadow-blue-500/25'
                  : 'hover:bg-slate-200/75 dark:hover:bg-slate-800/80 text-[#334155] dark:text-slate-200'
              } transition-all duration-150 cursor-pointer shrink-0`}
            >
              <div
                className={`w-7 h-7 flex items-center justify-center shrink-0 transition-all duration-150 ${
                  isNotesPageOpen && sidebarCollapsed
                    ? 'rounded-md bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm shadow-blue-500/25'
                    : ''
                }`}
              >
                <NotebookPen
                  className={`w-[17px] h-[17px] ${
                    isNotesPageOpen
                      ? 'text-white stroke-[2]'
                      : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                  } transition-colors duration-150`}
                  strokeWidth={1.75}
                />
              </div>
              <span
                className={`truncate leading-tight block font-serif text-[13px] ${
                  isNotesPageOpen
                    ? 'text-white font-[600]'
                    : 'font-[500] text-[#334155] dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white'
                } whitespace-nowrap transition-all duration-150 ease-out flex-1 text-left ${
                  sidebarCollapsed ? 'w-0 opacity-0 pointer-events-none' : 'opacity-100'
                }`}
              >
                Notes
              </span>
              {notes.length > 0 && !sidebarCollapsed && (
                <span
                  className={`text-[9.5px] font-semibold px-1 min-w-[17px] h-[15px] flex items-center justify-center rounded-full border shrink-0 leading-none transition-colors ${
                    isNotesPageOpen
                      ? 'bg-white/20 border-white/30 text-white'
                      : 'bg-slate-100/90 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200/60 dark:border-slate-700/60'
                  }`}
                >
                  {notes.length}
                </span>
              )}
            </button>

            {/* Tasks View Button */}
            <button
              onClick={() => {
                setIsTasksPageOpen(true);
                setIsNotesPageOpen(false);
                setIsJobCircularsOpen(false);
                setIsSearchPageOpen(false);
                setIsRecycleBinOpen(false);
                setIsAnalyticsPageOpen(false);
              }}
              data-tooltip={sidebarCollapsed ? 'Tasks' : undefined}
              data-tooltip-side="right"
              className={`group w-full h-[32px] rounded-md flex items-center px-1.5 gap-1.5 ${
                isTasksPageOpen
                  ? sidebarCollapsed
                    ? ''
                    : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm shadow-blue-500/25'
                  : 'hover:bg-slate-200/75 dark:hover:bg-slate-800/80 text-[#334155] dark:text-slate-200'
              } transition-all duration-150 cursor-pointer shrink-0`}
            >
              <div
                className={`w-7 h-7 flex items-center justify-center shrink-0 transition-all duration-150 ${
                  isTasksPageOpen && sidebarCollapsed
                    ? 'rounded-md bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm shadow-blue-500/25'
                    : ''
                }`}
              >
                <ListTodo
                  className={`w-[17px] h-[17px] ${
                    isTasksPageOpen
                      ? 'text-white stroke-[2]'
                      : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                  } transition-colors duration-150`}
                  strokeWidth={1.75}
                />
              </div>
              <span
                className={`truncate leading-tight block font-serif text-[13px] ${
                  isTasksPageOpen
                    ? 'text-white font-[600]'
                    : 'font-[500] text-[#334155] dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white'
                } whitespace-nowrap transition-all duration-150 ease-out flex-1 text-left ${
                  sidebarCollapsed ? 'w-0 opacity-0 pointer-events-none' : 'opacity-100'
                }`}
              >
                Tasks
              </span>
              {standaloneTasks.filter((t) => !t.completed).length > 0 && !sidebarCollapsed && (
                <span
                  className={`text-[9.5px] font-semibold px-1 min-w-[17px] h-[15px] flex items-center justify-center rounded-full border shrink-0 leading-none transition-colors ${
                    isTasksPageOpen
                      ? 'bg-white/20 border-white/30 text-white'
                      : 'bg-slate-100/90 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200/60 dark:border-slate-700/60'
                  }`}
                >
                  {standaloneTasks.filter((t) => !t.completed).length}
                </span>
              )}
            </button>

            {/* Circulars View Button */}
            <button
              onClick={() => {
                setIsJobCircularsOpen(true);
                setIsTasksPageOpen(false);
                setIsNotesPageOpen(false);
                setIsSearchPageOpen(false);
                setIsRecycleBinOpen(false);
                setIsAnalyticsPageOpen(false);
              }}
              data-tooltip={sidebarCollapsed ? 'Job Circulars' : undefined}
              data-tooltip-side="right"
              className={`group w-full h-[32px] rounded-md flex items-center px-1.5 gap-1.5 ${
                isJobCircularsOpen
                  ? sidebarCollapsed
                    ? ''
                    : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm shadow-blue-500/25'
                  : 'hover:bg-slate-200/75 dark:hover:bg-slate-800/80 text-[#334155] dark:text-slate-200'
              } transition-all duration-150 cursor-pointer shrink-0`}
            >
              <div
                className={`w-7 h-7 flex items-center justify-center shrink-0 transition-all duration-150 ${
                  isJobCircularsOpen && sidebarCollapsed
                    ? 'rounded-md bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm shadow-blue-500/25'
                    : ''
                }`}
              >
                <Briefcase
                  className={`w-[17px] h-[17px] ${
                    isJobCircularsOpen
                      ? 'text-white stroke-[2]'
                      : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                  } transition-colors duration-150`}
                  strokeWidth={1.75}
                />
              </div>
              <span
                className={`truncate leading-tight block font-serif text-[13px] ${
                  isJobCircularsOpen
                    ? 'text-white font-[600]'
                    : 'font-[500] text-[#334155] dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white'
                } whitespace-nowrap transition-all duration-150 ease-out flex-1 text-left ${
                  sidebarCollapsed ? 'w-0 opacity-0 pointer-events-none' : 'opacity-100'
                }`}
              >
                Circulars
              </span>
              {jobCirculars.length > 0 && !sidebarCollapsed && (
                <span
                  className={`text-[9.5px] font-semibold px-1 min-w-[17px] h-[15px] flex items-center justify-center rounded-full border shrink-0 leading-none transition-colors ${
                    isJobCircularsOpen
                      ? 'bg-white/20 border-white/30 text-white'
                      : 'bg-slate-100/90 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200/60 dark:border-slate-700/60'
                  }`}
                >
                  {jobCirculars.length}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                showToast('Showing starred topics');
              }}
              data-tooltip={sidebarCollapsed ? 'Starred' : undefined}
              data-tooltip-side="right"
              className="group w-full h-[32px] rounded-md flex items-center px-1.5 gap-1.5 hover:bg-slate-200/75 dark:hover:bg-slate-800/80 text-[#334155] dark:text-slate-200 transition-all duration-150 cursor-pointer shrink-0"
            >
              <div className="w-7 h-7 flex items-center justify-center shrink-0">
                <Star
                  className="w-[17px] h-[17px] text-slate-500 dark:text-slate-400 group-hover:text-amber-500 group-hover:fill-amber-500 transition-colors duration-150"
                  strokeWidth={1.75}
                />
              </div>
              <span
                className={`truncate leading-tight block font-serif text-[13px] font-[500] text-[#334155] dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white whitespace-nowrap transition-all duration-150 ease-out flex-1 text-left ${
                  sidebarCollapsed ? 'w-0 opacity-0 pointer-events-none' : 'opacity-100'
                }`}
              >
                Starred
              </span>
            </button>

            <button
              onClick={() => setIsShortcutsOpen(true)}
              data-tooltip={sidebarCollapsed ? 'Shortcut & Guide' : undefined}
              data-tooltip-side="right"
              className="group w-full h-[32px] rounded-md flex items-center px-1.5 gap-1.5 hover:bg-slate-200/75 dark:hover:bg-slate-800/80 text-[#334155] dark:text-slate-200 transition-all duration-150 cursor-pointer shrink-0"
            >
              <div className="w-7 h-7 flex items-center justify-center shrink-0">
                <Keyboard
                  className="w-[17px] h-[17px] text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-150"
                  strokeWidth={1.75}
                />
              </div>
              <span
                className={`truncate leading-tight block font-serif text-[13px] font-[500] text-[#334155] dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white whitespace-nowrap transition-all duration-150 ease-out flex-1 text-left ${
                  sidebarCollapsed ? 'w-0 opacity-0 pointer-events-none' : 'opacity-100'
                }`}
              >
                Shortcut & Guide
              </span>
            </button>

            <button
              onClick={() => {
                setIsAnalyticsPageOpen((prev) => {
                  const next = typeof prev === 'function' ? (prev as any)(isAnalyticsPageOpen) : !prev;
                  if (next) {
                    setIsTasksPageOpen(false);
                    setIsJobCircularsOpen(false);
                    setIsSearchPageOpen(false);
                    setIsNotesPageOpen(false);
                    setIsRecycleBinOpen(false);
                  }
                  return next;
                });
              }}
              data-tooltip={sidebarCollapsed ? 'Analytics' : undefined}
              data-tooltip-side="right"
              className={`group w-full h-[32px] rounded-md flex items-center px-1.5 gap-1.5 ${
                isAnalyticsPageOpen
                  ? sidebarCollapsed
                    ? ''
                    : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm shadow-blue-500/25'
                  : 'hover:bg-slate-200/75 dark:hover:bg-slate-800/80 text-[#334155] dark:text-slate-200'
              } transition-all duration-150 cursor-pointer shrink-0`}
            >
              <div
                className={`w-7 h-7 flex items-center justify-center shrink-0 transition-all duration-150 ${
                  isAnalyticsPageOpen && sidebarCollapsed
                    ? 'rounded-md bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm shadow-blue-500/25'
                    : ''
                }`}
              >
                <TrendingUp
                  className={`w-[17px] h-[17px] ${
                    isAnalyticsPageOpen
                      ? 'text-white stroke-[2]'
                      : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                  } transition-colors duration-150`}
                  strokeWidth={1.75}
                />
              </div>
              <span
                className={`truncate leading-tight block font-serif text-[13px] ${
                  isAnalyticsPageOpen
                    ? 'text-white font-[600]'
                    : 'font-[500] text-[#334155] dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white'
                } whitespace-nowrap transition-all duration-150 ease-out flex-1 text-left ${
                  sidebarCollapsed ? 'w-0 opacity-0 pointer-events-none' : 'opacity-100'
                }`}
              >
                Analytics
              </span>
            </button>
          </div>

          {/* Section 2: WORKSPACES Header (Fixed) */}
          <div className="h-2 shrink-0" />

          <div
            onClick={() => {
              if (!sidebarCollapsed && !isReorderingWorkspaces) {
                toggleWorkspacesCollapse();
              }
            }}
            className={`relative group/ws-header w-full h-6 flex items-center justify-between text-[10.5px] font-bold text-slate-400 uppercase tracking-[0.08em] select-none overflow-hidden whitespace-nowrap transition-opacity duration-200 shrink-0 px-1.5 ${
              sidebarCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
            } ${!isReorderingWorkspaces ? 'cursor-pointer hover:text-slate-600' : 'cursor-default'}`}
          >
            <div className="flex items-center gap-1.5 min-w-0 pr-14">
              {isReorderingWorkspaces ? (
                <span className="text-[#2563EB] font-extrabold flex items-center gap-1.5">
                  <ReorderWorkspacesIcon className="w-3.5 h-3.5" />
                  <span>Reorder</span>
                </span>
              ) : (
                <>
                  <span>Workspaces</span>
                  <span className="text-[9.5px] font-semibold px-1 min-w-[17px] h-[15px] flex items-center justify-center rounded-full bg-slate-100/90 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60 leading-none">
                    {sortedWorkspaces.length}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isWorkspacesCollapsed ? '-rotate-90 text-slate-400' : 'rotate-0 text-slate-400 group-hover/ws-header:text-slate-600'
                    }`}
                  />
                </>
              )}
            </div>

            {!isReorderingWorkspaces ? (
              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 opacity-0 group-hover/ws-header:opacity-100 transition-opacity shrink-0 z-10">
                {workspaces.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      startReorderingWorkspaces();
                    }}
                    className="w-6 h-6 flex items-center justify-center rounded-md text-slate-400 hover:text-[#2563EB] hover:bg-blue-50 transition-all cursor-pointer"
                    title="Reorder Workspaces"
                  >
                    <ReorderWorkspacesIcon className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsNewWorkspaceOpen(true);
                  }}
                  className="w-6 h-6 flex items-center justify-center rounded-md text-slate-400 hover:text-[#2563EB] hover:bg-blue-50 transition-all cursor-pointer"
                  title="New Workspace"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1 shrink-0 z-10">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCancelReorder();
                  }}
                  className="px-1.5 py-0.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-[11px] font-medium transition-all cursor-pointer"
                  title="Cancel Reordering"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDoneReorder();
                  }}
                  className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-[#2563EB] text-white hover:bg-blue-700 text-[11px] font-bold transition-all cursor-pointer shadow-3xs"
                  title="Done Reordering"
                >
                  <Check className="w-3 h-3 stroke-[2.5]" />
                  <span>Done</span>
                </button>
              </div>
            )}
          </div>

          {/* Workspaces Scrollable Section */}
          <div
            className={`flex-1 min-h-0 flex flex-col transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              !isWorkspacesCollapsed || sidebarCollapsed ? 'opacity-100' : 'opacity-0 pointer-events-none max-h-0'
            }`}
          >
            {isReorderingWorkspaces && !sidebarCollapsed ? (
              <div className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain custom-scrollbar flex flex-col gap-[2px] py-0.5">
                {workspaces.map((ws, idx) => {
                  const isDragging = draggedWsIdx === idx;
                  const isDragOver = dragOverWsIdx === idx && draggedWsIdx !== idx;
                  const isDragBelow = draggedWsIdx !== null && draggedWsIdx < idx;
                  return (
                    <div
                      key={ws.id}
                      data-reorder-index={idx}
                      draggable
                      onDragStart={(e) => handleDragStart(e, idx)}
                      onDragOver={(e) => handleDragOver(e, idx)}
                      onDrop={(e) => handleDrop(e, idx)}
                      onDragEnd={handleDragEnd}
                      className={`relative group w-full h-[32px] min-h-[32px] shrink-0 flex items-center justify-between rounded-md px-1.5 gap-1.5 transition-all duration-150 select-none outline-none focus:outline-none focus:ring-0 ${
                        isDragging
                          ? 'opacity-40 scale-[0.98] bg-blue-50/80 dark:bg-blue-950/40 border border-blue-300 dark:border-blue-700'
                          : 'hover:bg-slate-100/80 dark:hover:bg-slate-800/60 active:bg-slate-200/60 dark:active:bg-slate-700/60'
                      }`}
                    >
                      {isDragOver && (
                        <div
                          className={`absolute left-1 right-1 h-[2px] bg-[#2563EB] dark:bg-blue-500 rounded-full shadow-sm shadow-blue-500/50 z-30 pointer-events-none ${
                            isDragBelow ? '-bottom-[2px]' : '-top-[2px]'
                          }`}
                        />
                      )}

                      <div className="flex items-center gap-1.5 min-w-0 flex-1">
                        <div
                          onTouchStart={(e) => handleTouchStart(e, idx)}
                          onTouchMove={handleTouchMove}
                          onTouchEnd={handleTouchEnd}
                          className="p-0.5 -ml-0.5 cursor-grab active:cursor-grabbing touch-none flex items-center"
                          title="Drag to reorder"
                        >
                          <GripVertical className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-200 shrink-0" />
                        </div>
                        <BookOpen className="w-[15px] h-[15px] text-slate-500 dark:text-slate-400 shrink-0" strokeWidth={1.75} />
                        <span className="truncate font-serif text-[13px] font-medium text-slate-800 dark:text-slate-200 leading-tight">
                          {ws.name}
                        </span>
                        {ws.isPinned && (
                          <Pin
                            className="w-3 h-3 text-red-600 fill-red-600 dark:text-red-500 dark:fill-red-500 shrink-0 ml-0.5"
                            title="Pinned"
                          />
                        )}
                      </div>

                      {/* Quick Up/Down Buttons for Desktop precision */}
                      <div className="flex items-center gap-0.5 shrink-0 opacity-80 group-hover:opacity-100">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveWorkspace(idx, idx - 1)}
                          className={`p-0.5 rounded text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/80 dark:hover:bg-slate-700 active:bg-slate-200 dark:active:bg-slate-700 transition-colors outline-none focus:outline-none focus:ring-0 ${
                            idx === 0 ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'
                          }`}
                          title="Move up"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === workspaces.length - 1}
                          onClick={() => handleMoveWorkspace(idx, idx + 1)}
                          className={`p-0.5 rounded text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/80 dark:hover:bg-slate-700 active:bg-slate-200 dark:active:bg-slate-700 transition-colors outline-none focus:outline-none focus:ring-0 ${
                            idx === workspaces.length - 1 ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'
                          }`}
                          title="Move down"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain custom-scrollbar flex flex-col gap-[2px] py-0.5">
                {sortedWorkspaces.map((ws) => {
                  const isActive =
                    ws.id === activeWorkspaceId &&
                    !isSearchPageOpen &&
                    !isNotesPageOpen &&
                    !isTasksPageOpen &&
                    !isJobCircularsOpen &&
                    !isRecycleBinOpen &&
                    !isAnalyticsPageOpen;
                  const initialChar = getWorkspaceInitial(ws.name);
                  const isBangla = /[\u0980-\u09FF]/.test(initialChar);
                  const initialFontSize = isBangla
                    ? initialChar.length > 2
                      ? 'text-[11px] leading-none'
                      : initialChar.length > 1
                      ? 'text-[12px] leading-none tracking-tight'
                      : 'text-[12.5px] leading-none'
                    : 'text-[12.5px] leading-none';

                  return (
                    <div
                      key={ws.id}
                      id={`sidebar-workspace-${ws.id}`}
                      className={`relative group w-full h-[32px] min-h-[32px] shrink-0 flex items-center justify-between rounded-md transition-all duration-150 ${
                        activeMenuWorkspaceId === ws.id ? 'z-[100]' : 'z-10'
                      } ${!isActive && !sidebarCollapsed ? 'hover:bg-slate-200/75 dark:hover:bg-slate-800/80' : ''}`}
                    >
                      {/* Smooth sliding background pill */}
                      {isActive && !sidebarCollapsed && (
                        <motion.div
                          layoutId="workspace-active-pill"
                          transition={{ type: 'spring', stiffness: 450, damping: 34, mass: 0.6 }}
                          className="absolute inset-0 rounded-md bg-[#2563EB] group-hover:bg-[#1D4ED8] shadow-sm shadow-blue-500/25 transition-colors duration-150 pointer-events-none"
                          style={{ zIndex: 0 }}
                        />
                      )}

                      <div
                        onClick={() => {
                          setActiveWorkspaceId(ws.id);
                          setIsSearchPageOpen(false);
                          setIsNotesPageOpen(false);
                          setIsTasksPageOpen(false);
                          setIsJobCircularsOpen(false);
                          setIsAnalyticsPageOpen(false);
                          setIsRecycleBinOpen(false);
                        }}
                        data-tooltip={sidebarCollapsed || ws.name.length > 15 ? ws.name : undefined}
                        data-tooltip-side={sidebarCollapsed ? 'right' : 'bottom'}
                        className="relative z-10 w-full h-full rounded-md flex items-center px-1.5 cursor-pointer select-none transition-all duration-150"
                      >
                        <div className="flex items-center gap-1.5 min-w-0 flex-1 overflow-hidden">
                          {/* Fixed Icon Anchor */}
                          <div className="w-7 h-7 flex items-center justify-center shrink-0 relative">
                            {/* Collapsed Initial Letter Avatar */}
                            <div
                              className={`absolute inset-0 rounded-md flex items-center justify-center font-serif font-bold ${initialFontSize} transition-all duration-150 ease-out select-none ${
                                sidebarCollapsed ? 'opacity-100' : 'opacity-0 pointer-events-none'
                              } ${
                                isActive
                                  ? 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm shadow-blue-500/25'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-950 dark:hover:text-white'
                              }`}
                            >
                              {ws.isPinned ? (
                                <Pin
                                  className={`w-3 h-3 ${
                                    isActive
                                      ? 'text-white fill-white'
                                      : 'text-red-600 fill-red-600 dark:text-red-500 dark:fill-red-500'
                                  }`}
                                />
                              ) : (
                                initialChar
                              )}
                            </div>

                            {/* Expanded Folder / Pin Icon */}
                            <div
                              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ease-out ${
                                sidebarCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
                              }`}
                            >
                              {ws.isPinned ? (
                                <Pin
                                  className={`w-[15px] h-[15px] shrink-0 transition-colors duration-150 ${
                                    isActive
                                      ? 'text-white fill-white'
                                      : 'text-red-600 fill-red-600 dark:text-red-500 dark:fill-red-500'
                                  }`}
                                />
                              ) : (
                                <BookOpen
                                  className={`w-[17px] h-[17px] shrink-0 transition-colors duration-150 ${
                                    isActive
                                      ? 'text-white fill-transparent'
                                      : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                                  }`}
                                  strokeWidth={1.75}
                                />
                              )}
                            </div>
                          </div>

                          {/* Full-width text reveal */}
                          <span
                            className={`truncate leading-tight font-serif text-[13px] transition-all duration-150 ease-out flex-1 text-left ${
                              sidebarCollapsed
                                ? 'w-0 opacity-0 pointer-events-none hidden'
                                : 'min-w-0 flex-1 whitespace-nowrap opacity-100 block'
                            } ${
                              isActive
                                ? 'font-[600] text-white'
                                : 'font-[500] text-[#334155] dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white'
                            }`}
                          >
                            {ws.name}
                          </span>
                        </div>
                      </div>

                      {/* Google Antigravity Style Floating Action Overlay (3-Dot Menu) */}
                      {!sidebarCollapsed && (
                        <div
                          className={`absolute right-1.5 top-1/2 -translate-y-1/2 shrink-0 flex items-center gap-0.5 z-30 transition-all duration-150 ${
                            activeMenuWorkspaceId === ws.id
                              ? 'opacity-100 pointer-events-auto'
                              : 'opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={(e) => toggleWorkspaceMenu(ws.id, e)}
                            className={`w-6 h-6 flex items-center justify-center rounded-md transition-all cursor-pointer workspace-menu-btn ${
                              isActive
                                ? activeMenuWorkspaceId === ws.id
                                  ? 'opacity-100 bg-white/25 text-white'
                                  : 'text-white/80 hover:text-white hover:bg-white/20 opacity-0 group-hover:opacity-100'
                                : activeMenuWorkspaceId === ws.id
                                ? 'opacity-100 bg-slate-300/80 dark:bg-slate-700 text-[#0F172A] dark:text-white'
                                : 'text-[#64748B] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-300/80 dark:hover:bg-slate-700 opacity-0 group-hover:opacity-100'
                            }`}
                            data-tooltip="Options"
                            data-tooltip-side="top"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Bottom Preferences & Data */}
        <div className="px-2 pt-2 pb-1 flex flex-col gap-[2px] shrink-0 bg-transparent border-t border-slate-200/70 dark:border-white/[0.06]">
          <div
            className={`px-1.5 h-6 flex items-center text-[10.5px] font-bold text-slate-400 uppercase tracking-[0.08em] select-none overflow-hidden whitespace-nowrap transition-opacity duration-200 ${
              sidebarCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          >
            Preferences
          </div>

          <button
            onClick={handleExportJSON}
            data-tooltip={sidebarCollapsed ? 'Export' : undefined}
            data-tooltip-side="right"
            className="group w-full h-[32px] rounded-md flex items-center px-1.5 gap-1.5 hover:bg-slate-200/75 dark:hover:bg-slate-800/80 text-[#334155] dark:text-slate-200 transition-all duration-150 cursor-pointer shrink-0"
          >
            <div className="w-7 h-7 flex items-center justify-center shrink-0">
              <Download
                className="w-[17px] h-[17px] text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-150"
                strokeWidth={1.75}
              />
            </div>
            <span
              className={`truncate leading-tight block font-serif text-[13px] font-[500] text-[#334155] dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white whitespace-nowrap transition-all duration-150 ease-out flex-1 text-left ${
                sidebarCollapsed ? 'w-0 opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            >
              Export
            </span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            data-tooltip={sidebarCollapsed ? 'Import' : undefined}
            data-tooltip-side="right"
            className="group w-full h-[32px] rounded-md flex items-center px-1.5 gap-1.5 hover:bg-slate-200/75 dark:hover:bg-slate-800/80 text-[#334155] dark:text-slate-200 transition-all duration-150 cursor-pointer shrink-0"
          >
            <div className="w-7 h-7 flex items-center justify-center shrink-0">
              <Upload
                className="w-[17px] h-[17px] text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-150"
                strokeWidth={1.75}
              />
            </div>
            <span
              className={`truncate leading-tight block font-serif text-[13px] font-[500] text-[#334155] dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white whitespace-nowrap transition-all duration-150 ease-out flex-1 text-left ${
                sidebarCollapsed ? 'w-0 opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            >
              Import
            </span>
          </button>

          <button
            onClick={() => {
              setIsRecycleBinOpen(true);
              setIsTasksPageOpen(false);
              setIsJobCircularsOpen(false);
              setIsNotesPageOpen(false);
              setIsSearchPageOpen(false);
              setIsAnalyticsPageOpen(false);
            }}
            data-tooltip={sidebarCollapsed ? 'Trash' : undefined}
            data-tooltip-side="right"
            className={`group w-full h-[32px] rounded-md flex items-center px-1.5 gap-1.5 ${
              isRecycleBinOpen
                ? sidebarCollapsed
                  ? ''
                  : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm shadow-blue-500/25'
                : 'hover:bg-slate-200/75 dark:hover:bg-slate-800/80 text-[#334155] dark:text-slate-200'
            } transition-all duration-150 cursor-pointer shrink-0`}
          >
            <div
              className={`w-7 h-7 flex items-center justify-center shrink-0 transition-all duration-150 ${
                isRecycleBinOpen && sidebarCollapsed
                  ? 'rounded-md bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm shadow-blue-500/25'
                  : ''
              }`}
            >
              <Trash2
                className={`w-[17px] h-[17px] transition-colors duration-150 ${
                  isRecycleBinOpen ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-red-500'
                }`}
                strokeWidth={1.75}
              />
            </div>
            <span
              className={`truncate leading-tight block font-serif text-[13px] ${
                isRecycleBinOpen
                  ? 'font-[600] text-white'
                  : 'font-[500] text-[#334155] dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white'
              } whitespace-nowrap transition-all duration-150 ease-out flex-1 text-left ${
                sidebarCollapsed ? 'w-0 opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            >
              Trash
            </span>
            {totalDeletedCount > 0 && !sidebarCollapsed && (
              <span
                className={`text-[9.5px] font-semibold px-1 min-w-[17px] h-[15px] flex items-center justify-center rounded-full border shrink-0 leading-none transition-colors ${
                  isRecycleBinOpen
                    ? 'bg-white/20 border-white/30 text-white'
                    : 'bg-slate-100/90 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200/60 dark:border-slate-700/60'
                }`}
              >
                {totalDeletedCount}
              </span>
            )}
          </button>
        </div>

        {/* Section 4: Minimalist User Profile + Settings Bottom Row */}
        <div className="relative user-profile-dropdown-container px-2 pt-1 pb-2 flex flex-col shrink-0 bg-transparent">
          {currentUser && (
            <UserProfilePopover
              isOpen={profileMenuTarget === 'sidebar'}
              onClose={() => setProfileMenuTarget(null)}
              currentUser={currentUser}
              isOnline={isOnline}
              currentStreak={streakData.currentStreak}
              dailyGoalPercent={dailyGoalPercent}
              onOpenEditProfile={() => setIsEditProfileOpen(true)}
              onChangePassword={handleChangePassword}
              onSwitchAccount={handleSwitchAccount}
              onSignOut={handleSignOut}
              position="desktop-sidebar"
              isCollapsed={sidebarCollapsed}
            />
          )}

          {currentUser ? (
            <div
              className={`w-full flex items-center ${
                sidebarCollapsed ? 'flex-col-reverse gap-1.5' : 'gap-1'
              }`}
            >
              <button
                type="button"
                onClick={() => setProfileMenuTarget((prev) => (prev === 'sidebar' ? null : 'sidebar'))}
                data-tooltip={
                  sidebarCollapsed ? currentUser.displayName || currentUser.email || 'Profile' : undefined
                }
                data-tooltip-side="right"
                className="group w-full h-[32px] rounded-md flex items-center px-1.5 gap-2.5 hover:bg-slate-200/75 dark:hover:bg-slate-800/80 transition-all duration-150 cursor-pointer select-none text-left"
              >
                <div className="w-7 h-7 flex items-center justify-center shrink-0">
                  <div className="relative w-[24px] h-[24px]">
                    <UserAvatar
                      photoURL={currentUser.photoURL}
                      displayName={currentUser.displayName}
                      email={currentUser.email}
                      textClassName="text-[11px]"
                      className="border border-slate-200/90 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
                    />
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ring-2 ring-white dark:ring-slate-900 shadow-3xs pointer-events-none transition-colors ${
                        isOnline ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      title={isOnline ? 'Cloud Synced' : 'Offline Mode (Local Cache)'}
                    />
                  </div>
                </div>

                <div
                  className={`min-w-0 flex-1 transition-opacity duration-150 ${
                    sidebarCollapsed ? 'w-0 opacity-0 pointer-events-none' : 'opacity-100'
                  }`}
                >
                  <div className="text-[11.5px] font-bold text-slate-800 dark:text-slate-200 truncate leading-tight group-hover:text-slate-950 dark:group-hover:text-white">
                    {currentUser.displayName || 'Study Flow User'}
                  </div>
                  <div className="text-[9px] text-slate-400 dark:text-slate-400 truncate leading-tight mt-0.5">
                    {currentUser.email || (isOnline ? 'Cloud Synced' : 'Offline')}
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                data-tooltip={sidebarCollapsed ? 'Settings' : undefined}
                data-tooltip-side="right"
                className="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/75 dark:hover:bg-slate-800/80 transition-colors cursor-pointer shrink-0"
                title="Settings"
              >
                <div className="w-7 h-7 flex items-center justify-center shrink-0">
                  <Settings className="w-[17px] h-[17px]" strokeWidth={1.75} />
                </div>
              </button>
            </div>
          ) : (
            <div
              className={`w-full flex items-center ${
                sidebarCollapsed ? 'flex-col-reverse gap-1.5' : 'gap-1'
              }`}
            >
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                data-tooltip={sidebarCollapsed ? 'Sign In' : undefined}
                data-tooltip-side="right"
                className="group w-full h-[32px] rounded-md flex items-center px-1.5 gap-2.5 hover:bg-blue-50/80 text-[#2563EB] transition-all duration-150 cursor-pointer select-none text-left"
              >
                <div className="w-7 h-7 flex items-center justify-center shrink-0">
                  <LogIn className="w-[17px] h-[17px] text-[#2563EB]" strokeWidth={1.75} />
                </div>
                <span
                  className={`text-[12.5px] leading-tight font-semibold text-[#2563EB] whitespace-nowrap truncate transition-opacity duration-150 ${
                    sidebarCollapsed ? 'w-0 opacity-0 pointer-events-none' : 'opacity-100'
                  }`}
                >
                  Sign In
                </span>
              </button>

              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                data-tooltip={sidebarCollapsed ? 'Settings' : undefined}
                data-tooltip-side="right"
                className="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-200/75 transition-colors cursor-pointer shrink-0"
                title="Settings"
              >
                <div className="w-7 h-7 flex items-center justify-center shrink-0">
                  <Settings className="w-[17px] h-[17px]" strokeWidth={1.75} />
                </div>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
