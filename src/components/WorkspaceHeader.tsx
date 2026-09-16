import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  ChevronRight,
  Check,
  Plus,
  Search,
  Command,
  Bell,
  X,
  CheckCircle2,
  Timer,
  CalendarDays,
  Sparkles,
  Volume2,
  LogIn,
  MoreVertical,
  Palette,
  Target,
  Flame,
  FileText,
  BookOpen,
  Trash2,
  ListTodo,
} from 'lucide-react';
import { UserProfilePopover } from './UserProfilePopover';
import { UserAvatar } from './UserAvatar';
import { WorkspaceItem, SectionItem } from '../types';

export interface NotificationItem {
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

export interface WorkspaceHeaderProps {
  setTooltipData: (data: any) => void;
  isWorkspaceDropdownOpen: boolean;
  setIsWorkspaceDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMobileWorkspaceDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  sidebarCollapsed: boolean;
  activeWorkspace: WorkspaceItem;
  workspaces: WorkspaceItem[];
  activeWorkspaceId: string;
  setActiveWorkspaceId: (id: string) => void;
  isWorkspaceSwitcherOpen: boolean;
  setIsWorkspaceSwitcherOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsNewWorkspaceOpen: (open: boolean) => void;
  activeSection: string | null;
  setActiveSection: (section: string) => void;
  currentWorkspaceSections: SectionItem[];
  activeMenuSection: string | null;
  setActiveMenuSection: (sec: string | null) => void;
  sectionMenuPos: { top: number; left: number } | null;
  setSectionMenuPos: (pos: { top: number; left: number } | null) => void;
  setIsNewSectionOpen: (open: boolean) => void;
  setIsSearchPageOpen: (open: boolean) => void;
  deviceNotifStatus: NotificationPermission | string;
  setDeviceNotifStatus: (status: any) => void;
  isNotificationPanelOpen: boolean;
  setIsNotificationPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  unreadNotifCount: number;
  notifications: NotificationItem[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
  notifFilter: 'all' | 'focus' | 'reminders';
  setNotifFilter: (filter: 'all' | 'focus' | 'reminders') => void;
  handleToggleDeviceNotifications: () => void;
  onNotificationClick?: (notification: NotificationItem) => void;
  onDismissNotification?: (id: string) => void;
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
}

export function WorkspaceHeader({
  setTooltipData,
  isWorkspaceDropdownOpen,
  setIsWorkspaceDropdownOpen,
  setIsMobileWorkspaceDropdownOpen,
  setSidebarCollapsed,
  sidebarCollapsed,
  activeWorkspace,
  workspaces,
  activeWorkspaceId,
  setActiveWorkspaceId,
  isWorkspaceSwitcherOpen,
  setIsWorkspaceSwitcherOpen,
  setIsNewWorkspaceOpen,
  activeSection,
  setActiveSection,
  currentWorkspaceSections,
  activeMenuSection,
  setActiveMenuSection,
  sectionMenuPos,
  setSectionMenuPos,
  setIsNewSectionOpen,
  setIsSearchPageOpen,
  deviceNotifStatus,
  setDeviceNotifStatus,
  isNotificationPanelOpen,
  setIsNotificationPanelOpen,
  unreadNotifCount,
  notifications,
  setNotifications,
  notifFilter,
  setNotifFilter,
  handleToggleDeviceNotifications,
  onNotificationClick,
  onDismissNotification,
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
}: WorkspaceHeaderProps) {
  return (
    <header
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
      onSelectStart={(e) => e.preventDefault()}
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
      }}
      className="no-copy-header sticky top-0 z-40 shrink-0 h-[56px] sm:h-[60px] min-h-[56px] px-3.5 sm:px-6 bg-white/85 dark:bg-[#090D16]/85 backdrop-blur-[20px] border-b border-slate-200/70 dark:border-white/[0.06] flex items-center justify-between gap-2 sm:gap-4 select-none w-full [&_*]:select-none"
    >
      {/* LEFT: Mobile Hamburger + Premium Minimalist Text Breadcrumb */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 workspace-dropdown-container relative z-20">
        {/* Mobile Hamburger Menu Button (md:hidden with Border & Clean Box) */}
        <button
          type="button"
          onClick={() => {
            setTooltipData(null);
            setIsWorkspaceDropdownOpen(false);
            setIsMobileWorkspaceDropdownOpen(false);
            setSidebarCollapsed((prev) => !prev);
          }}
          className="md:hidden w-[32px] h-[32px] rounded-lg border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shadow-3xs transition-all cursor-pointer select-none shrink-0 mr-0.5"
          title={sidebarCollapsed ? 'Open sidebar' : 'Close sidebar'}
        >
          <Menu className="w-4 h-4 text-slate-700 dark:text-slate-300 stroke-[2.3]" />
        </button>

        {/* Inline Breadcrumb Segment: Workspace Name › Section Name */}
        <div className="flex items-center gap-0.5 min-w-0">
          {/* 1. Workspace Name Segment (Click to switch workspace) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setTooltipData(null);
                setIsWorkspaceDropdownOpen(false);
                setIsWorkspaceSwitcherOpen((prev) => !prev);
              }}
              className={`px-1.5 py-0.5 rounded-md text-[13px] sm:text-[13.5px] font-semibold transition-all cursor-pointer truncate max-w-[110px] min-[400px]:max-w-[140px] sm:max-w-[180px] lg:max-w-[220px] focus:outline-none ${
                isWorkspaceSwitcherOpen
                  ? 'bg-[#2563EB] text-white shadow-3xs'
                  : 'text-slate-700 dark:text-slate-200 hover:text-white dark:hover:text-white hover:bg-[#2563EB] active:bg-blue-700'
              }`}
              title="Switch workspace"
            >
              {activeWorkspace?.name || 'Workspace'}
            </button>

            {/* Workspace Switcher Popover Dropdown */}
            <AnimatePresence>
              {isWorkspaceSwitcherOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.95 }}
                  transition={{ duration: 0.12, ease: 'easeOut' }}
                  className="absolute left-0 top-full mt-2 w-[210px] sm:w-[230px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-white/10 shadow-2xl shadow-slate-900/10 rounded-xl p-1.5 z-50 text-xs select-none"
                >
                  <div className="px-2 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Switch Workspace
                  </div>
                  {workspaces.map((ws) => (
                    <div
                      key={ws.id}
                      className={`w-full rounded-lg flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer group ${
                        ws.id === activeWorkspaceId ? 'bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                      onClick={() => {
                        setActiveWorkspaceId(ws.id);
                        setIsWorkspaceSwitcherOpen(false);
                      }}
                    >
                      <span className="truncate">{ws.name}</span>
                      {ws.id === activeWorkspaceId && <Check className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400 shrink-0" />}
                    </div>
                  ))}
                  <div className="my-1 border-t border-slate-100 dark:border-white/10" />
                  <button
                    type="button"
                    onClick={() => {
                      setIsWorkspaceSwitcherOpen(false);
                      setIsNewWorkspaceOpen(true);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-xs font-semibold text-[#2563EB] dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 shrink-0" />
                    <span>Create Workspace</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 2. Micro Chevron Divider (Tight Natural Spacing) */}
          <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-500 stroke-[2.2] shrink-0 -mx-0.5" />

          {/* 3. Section Switcher Ghost Pill Segment (Pure text, no down arrow) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsWorkspaceSwitcherOpen(false);
                setIsWorkspaceDropdownOpen((prev) => !prev);
              }}
              className={`px-1.5 py-0.5 rounded-md text-[13px] sm:text-[13.5px] font-semibold transition-all cursor-pointer focus:outline-none select-none ${
                isWorkspaceDropdownOpen
                  ? 'bg-[#2563EB] text-white shadow-3xs'
                  : 'text-slate-700 dark:text-slate-200 hover:text-white dark:hover:text-white hover:bg-[#2563EB] active:bg-blue-700'
              }`}
              title="Switch section"
            >
              <span className="truncate max-w-[90px] min-[400px]:max-w-[120px] sm:max-w-[160px] leading-tight">
                {activeSection || 'Select Section'}
              </span>
            </button>

            {/* Section Switcher Dropdown */}
            <AnimatePresence>
              {isWorkspaceDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.95 }}
                  transition={{ duration: 0.12, ease: 'easeOut' }}
                  className="absolute left-0 top-full mt-2 w-[210px] sm:w-[230px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-white/10 shadow-2xl shadow-slate-900/10 rounded-xl p-1.5 z-50 text-xs select-none"
                >
                  <div className="px-2 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Switch Section
                  </div>
                  {currentWorkspaceSections.length === 0 ? (
                    <div className="px-2.5 py-2 text-xs text-slate-400 dark:text-slate-500 italic font-medium">
                      No sections created yet
                    </div>
                  ) : (
                    currentWorkspaceSections.map((sec) => (
                      <div
                        key={sec.id || sec.name}
                        className={`w-full rounded-lg flex items-center justify-between px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer group ${
                          sec.name === activeSection ? 'bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                        onClick={() => {
                          setActiveSection(sec.name);
                          setIsWorkspaceDropdownOpen(false);
                        }}
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className="truncate">{sec.name}</span>
                          {sec.name === activeSection && <Check className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400 shrink-0" />}
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (activeMenuSection === sec.name) {
                              setActiveMenuSection(null);
                              setSectionMenuPos(null);
                            } else {
                              const rect = e.currentTarget.getBoundingClientRect();
                              setSectionMenuPos({
                                top: rect.bottom + 4,
                                left: Math.min(rect.left, window.innerWidth - 180),
                              });
                              setActiveMenuSection(sec.name);
                            }
                          }}
                          className={`p-1 rounded-md transition-colors cursor-pointer shrink-0 ml-1 ${
                            activeMenuSection === sec.name
                              ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100'
                              : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                          }`}
                          title="Section options"
                        >
                          <MoreVertical className="w-3.5 h-3.5 stroke-[2]" />
                        </button>
                      </div>
                    ))
                  )}
                  <div className="my-1 border-t border-slate-100 dark:border-white/10" />
                  <button
                    type="button"
                    onClick={() => {
                      setIsWorkspaceDropdownOpen(false);
                      setIsNewSectionOpen(true);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-xs font-semibold text-[#2563EB] dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 shrink-0" />
                    <span>Create Section</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* CENTER: Desktop & Tablet Quick-Search Bar (Centered) */}
      <div className="hidden sm:flex flex-1 items-center justify-center max-w-[380px] md:max-w-[420px] lg:max-w-[460px] mx-auto px-2 z-10">
        <button
          type="button"
          onClick={() => setIsSearchPageOpen(true)}
          className="h-[34px] w-full px-3 rounded-lg border border-slate-200/80 dark:border-white/10 bg-slate-100/70 dark:bg-slate-800/60 hover:bg-slate-200/70 dark:hover:bg-slate-700/70 text-slate-700 dark:text-slate-200 flex items-center justify-between backdrop-blur-md transition-all cursor-pointer shadow-3xs group"
          title="Search workspace (⌘K)"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 stroke-[2.2] shrink-0 transition-colors" />
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium group-hover:text-slate-600 dark:group-hover:text-slate-300 truncate">
              Search topics, tasks, notes...
            </span>
          </div>
          {/* Modern Pill Shortcut Badge */}
          <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 h-[19px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/10 rounded-[5px] text-slate-500 dark:text-slate-400 text-[10.5px] font-bold leading-none shadow-3xs select-none shrink-0 ml-2">
            <Command className="w-[9px] h-[9px] text-slate-500 dark:text-slate-400 stroke-[2.3]" />
            <span>K</span>
          </kbd>
        </button>
      </div>

      {/* RIGHT: Search Icon (Mobile Only), Bell, Plus Action */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 ml-auto sm:ml-0 z-10">
        {/* Mobile Search Icon Button */}
        <button
          type="button"
          onClick={() => setIsSearchPageOpen(true)}
          className="hidden w-[26px] h-[26px] rounded-[6px] border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 flex items-center justify-center text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-2xs"
          title="Search (⌘K)"
        >
          <Search className="w-3.5 h-3.5 text-slate-800 dark:text-slate-200 stroke-[2.2]" />
        </button>

        {/* Bell Notification Button */}
        <div className="relative notification-dropdown-container">
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined' && 'Notification' in window) {
                setDeviceNotifStatus(Notification.permission);
              }
              setIsNotificationPanelOpen(!isNotificationPanelOpen);
            }}
            className="flex w-[30px] h-[30px] sm:w-[34px] sm:h-[34px] rounded-lg border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 items-center justify-center text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-2xs relative group active:scale-95"
            title="Notifications"
          >
            <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-800 dark:text-slate-300 group-hover:text-slate-950 dark:group-hover:text-white stroke-[2.2]" />
            {unreadNotifCount > 0 && (
              <span
                className={`absolute -top-1.5 -right-1.5 h-[18px] rounded-full bg-[#EF4444] text-white text-[10px] font-extrabold flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-xs leading-none text-center select-none ${
                  unreadNotifCount > 9 ? 'min-w-[20px] px-1' : 'w-[18px] p-0'
                }`}
              >
                <span className="leading-none flex items-center justify-center text-center">
                  {unreadNotifCount > 9 ? '9+' : unreadNotifCount}
                </span>
              </span>
            )}
          </button>

          {/* Professional & Premium Notification Panel Dropdown */}
          <AnimatePresence>
            {isNotificationPanelOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.96 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="fixed inset-x-0 top-[62px] bottom-0 w-full h-[calc(100dvh-62px)] sm:absolute sm:inset-auto sm:top-full sm:right-0 sm:mt-2 sm:w-[420px] sm:h-auto sm:max-h-[560px] bg-white/95 dark:bg-[#090D16]/95 backdrop-blur-xl border-t sm:border border-slate-200/90 dark:border-white/10 shadow-2xl rounded-none sm:rounded-2xl p-0 z-[99999] overflow-hidden text-xs select-none flex flex-col"
              >
                {/* Header */}
                <div className="px-4 py-3.5 bg-slate-50/90 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsNotificationPanelOpen(false)}
                      className="sm:hidden p-1 -ml-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-md transition-colors cursor-pointer"
                      title="Close notifications"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="w-6 h-6 rounded-lg bg-[var(--primary-light)] dark:bg-[var(--primary-dark-bg)] text-[var(--primary)] dark:text-[var(--primary-dark-text)] flex items-center justify-center">
                      <Bell className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm tracking-tight">
                      Notifications
                    </span>
                    {unreadNotifCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-[var(--primary-light)] dark:bg-[var(--primary-dark-bg)] text-[var(--primary)] dark:text-[var(--primary-dark-text)] border border-[var(--primary-border)] dark:border-[var(--primary-dark-border)] text-[10px] font-bold">
                        {unreadNotifCount} unread
                      </span>
                    )}
                  </div>
                  {unreadNotifCount > 0 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
                      }}
                      className="text-[11px] font-bold text-[var(--primary)] dark:text-[var(--primary-dark-text)] hover:underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                {/* Device & Lockscreen Push Alert Banner Card */}
                {deviceNotifStatus !== 'granted' && (
                  <div className="p-3 bg-gradient-to-r from-[var(--primary-light)]/40 via-slate-50/70 dark:via-slate-900/70 to-[var(--primary-light)]/30 dark:from-[var(--primary-dark-bg)]/40 dark:to-[var(--primary-dark-bg)]/30 border-b border-slate-200/80 dark:border-white/10 shrink-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center shrink-0 shadow-md shadow-slate-900/10 mt-0.5">
                          <Bell className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-slate-900 dark:text-slate-100 text-[11.5px] truncate">
                            Device & Lockscreen Alerts
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                            Receive background study milestone alarms & task due date reminders.
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleToggleDeviceNotifications}
                        className="px-2.5 py-1.5 rounded-lg bg-[var(--primary)] hover:opacity-90 text-white font-bold text-[10.5px] transition-all cursor-pointer shadow-xs shrink-0 flex items-center gap-1 active:scale-95"
                      >
                        <Bell className="w-3 h-3" /> Enable Push
                      </button>
                    </div>
                  </div>
                )}

                {/* Filter Tabs */}
                <div className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-white/5 shrink-0 overflow-x-auto no-scrollbar">
                  {[
                    { id: 'all', label: 'All', count: notifications.length },
                    {
                      id: 'reminders',
                      label: 'Deadlines & Reminders ⏰',
                      count: notifications.filter((n) => n.type === 'reminders').length,
                    },
                    {
                      id: 'focus',
                      label: 'System & Alerts 🛡️',
                      count: notifications.filter((n) => n.type === 'system').length,
                    },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setNotifFilter(tab.id as any)}
                      className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        notifFilter === tab.id
                          ? 'bg-[var(--primary)] text-white shadow-xs'
                          : 'bg-slate-100/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`text-[9px] px-1 py-0.2 rounded-md ${
                          notifFilter === tab.id ? 'bg-white/25 text-white font-bold' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>

                {/* List */}
                <div className="flex-1 sm:max-h-[300px] overflow-y-auto divide-y divide-slate-100 dark:divide-white/5">
                  {(() => {
                    const filteredList = notifications.filter((n) => {
                      if (notifFilter === 'reminders') return n.type === 'reminders';
                      if (notifFilter === 'focus') return n.type === 'system' || n.type === 'focus';
                      return true;
                    });

                    if (filteredList.length === 0) {
                      return (
                        <div className="py-12 text-center text-slate-400 dark:text-slate-500">
                          <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600 stroke-[1.5]" />
                          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">No notifications in this tab</p>
                          <p className="text-[10.5px] text-slate-400 dark:text-slate-500 mt-0.5">
                            Study check-ins and due dates will appear here
                          </p>
                        </div>
                      );
                    }

                    return filteredList.map((n) => {
                      const text = `${n.title} ${n.description || ''}`.toLowerCase();
                      let IconComponent = Sparkles;
                      let badgeStyle = 'bg-[var(--primary-light)] dark:bg-[var(--primary-dark-bg)] text-[var(--primary)] dark:text-[var(--primary-dark-text)]';

                      if (text.includes('theme') || text.includes('accent') || text.includes('palette') || text.includes('color')) {
                        IconComponent = Palette;
                        if (text.includes('cyan')) badgeStyle = 'bg-cyan-100 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400';
                        else if (text.includes('purple')) badgeStyle = 'bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400';
                        else if (text.includes('green') || text.includes('emerald')) badgeStyle = 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400';
                        else if (text.includes('red') || text.includes('crimson') || text.includes('orange')) badgeStyle = 'bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400';
                        else if (text.includes('amber') || text.includes('gold')) badgeStyle = 'bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400';
                        else if (text.includes('pink') || text.includes('rose')) badgeStyle = 'bg-pink-100 dark:bg-pink-950/80 text-pink-600 dark:text-pink-400';
                        else if (text.includes('blue')) badgeStyle = 'bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400';
                      } else if (text.includes('streak') || text.includes('flame') || text.includes('fire')) {
                        IconComponent = Flame;
                        badgeStyle = 'bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400';
                      } else if (text.includes('goal') || text.includes('target') || text.includes('achiev')) {
                        IconComponent = Target;
                        badgeStyle = 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400';
                      } else if (n.type === 'focus' || text.includes('timer') || text.includes('focus') || text.includes('stopwatch') || text.includes('milestone') || text.includes('study')) {
                        IconComponent = Timer;
                        badgeStyle = 'bg-[var(--primary-light)] dark:bg-[var(--primary-dark-bg)] text-[var(--primary)] dark:text-[var(--primary-dark-text)]';
                      } else if (text.includes('task') || text.includes('todo') || text.includes('checklist') || text.includes('completed')) {
                        IconComponent = ListTodo;
                        badgeStyle = 'bg-blue-100 dark:bg-blue-950/80 text-[#2563EB] dark:text-blue-400';
                      } else if (text.includes('note') || text.includes('writing') || text.includes('draft')) {
                        IconComponent = FileText;
                        badgeStyle = 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400';
                      } else if (text.includes('workspace') || text.includes('section') || text.includes('topic') || text.includes('syllabus')) {
                        IconComponent = BookOpen;
                        badgeStyle = 'bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400';
                      } else if (text.includes('trash') || text.includes('delete') || text.includes('recycle') || text.includes('remove') || text.includes('restore')) {
                        IconComponent = Trash2;
                        badgeStyle = 'bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400';
                      } else if (n.type === 'reminders' || text.includes('due') || text.includes('deadline') || text.includes('calendar') || text.includes('remind')) {
                        IconComponent = CalendarDays;
                        badgeStyle = 'bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400';
                      }

                      return (
                        <div
                          key={n.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setNotifications((prev) =>
                              prev.map((item) => (item.id === n.id ? { ...item, read: true } : item))
                            );
                            if (onNotificationClick) {
                              onNotificationClick(n);
                            }
                          }}
                          className={`p-3.5 sm:p-3 flex items-start gap-3 transition-all cursor-pointer relative group ${
                            !n.read ? 'bg-[var(--primary-light)]/40 dark:bg-[var(--primary-dark-bg)]/40 hover:bg-[var(--primary-light)]/70 dark:hover:bg-[var(--primary-dark-bg)]/70' : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                          }`}
                        >
                          <div className={`mt-0.5 p-2 rounded-xl shrink-0 ${badgeStyle}`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0 pr-6">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <p
                                className={`text-xs leading-snug ${
                                  !n.read ? 'font-bold text-slate-900 dark:text-slate-100' : 'font-medium text-slate-600 dark:text-slate-400'
                                }`}
                              >
                                {n.title}
                              </p>
                              {n.actionTarget && (
                                <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400">
                                  Jump to ➔
                                </span>
                              )}
                            </div>
                            {n.description && (
                              <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                                {n.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[9.5px] font-medium text-slate-400 dark:text-slate-500 font-mono">
                                {n.time}
                              </span>
                              {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] shrink-0" />}
                            </div>
                          </div>

                          {/* Dismiss Single Notification Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onDismissNotification) {
                                onDismissNotification(n.id);
                              } else {
                                setNotifications((prev) => prev.filter((item) => item.id !== n.id));
                              }
                            }}
                            className="absolute right-2.5 top-2.5 p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 opacity-70 sm:opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Dismiss notification"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    });
                  })()}
                </div>

                {/* Footer */}
                <div className="p-3 sm:p-2 bg-slate-50/80 dark:bg-slate-900/80 border-t border-slate-100 dark:border-white/5 flex items-center justify-between px-4 shrink-0">
                  {deviceNotifStatus === 'granted' ? (
                    <button
                      type="button"
                      onClick={handleToggleDeviceNotifications}
                      className="px-2 py-1 rounded-lg bg-[var(--primary-light)] dark:bg-[var(--primary-dark-bg)] hover:bg-[var(--primary-light-hover)] text-[var(--primary)] dark:text-[var(--primary-dark-text)] border border-[var(--primary-border)] dark:border-[var(--primary-dark-border)] text-[10.5px] font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-95 shadow-2xs"
                      title="Play test audio chime and send test notification"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-[var(--primary)] dark:text-[var(--primary-dark-text)]" />
                      <span>Test Push</span>
                    </button>
                  ) : (
                    <div />
                  )}
                  {notifications.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setNotifications([]);
                        setIsNotificationPanelOpen(false);
                      }}
                      className="text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 transition-colors cursor-pointer"
                    >
                      Clear all notifications
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile / Auth Button */}
        <div className="relative user-profile-dropdown-container">
          {currentUser ? (
            <>
              <button
                type="button"
                onClick={() => setProfileMenuTarget((prev) => (prev === 'header' ? null : 'header'))}
                className="relative w-[26px] h-[26px] sm:w-[34px] sm:h-[34px] rounded-full border border-slate-200/90 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 bg-slate-50 dark:bg-slate-900 flex items-center justify-center hover:ring-2 hover:ring-blue-500/25 active:scale-95 transition-all cursor-pointer shadow-xs group shrink-0"
                title={currentUser.displayName || currentUser.email || 'User profile'}
              >
                <UserAvatar
                  photoURL={currentUser.photoURL}
                  displayName={currentUser.displayName}
                  email={currentUser.email}
                  textClassName="text-[11px] sm:text-xs"
                />

                {/* Live Cloud Sync Indicator Dot */}
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ring-2 ring-white dark:ring-slate-900 shadow-3xs pointer-events-none transition-colors ${
                    isOnline ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                  title={isOnline ? 'Cloud Synced' : 'Offline Mode (Local Cache)'}
                />
              </button>

              {/* User Profile Popover */}
              <UserProfilePopover
                isOpen={profileMenuTarget === 'header'}
                onClose={() => setProfileMenuTarget(null)}
                currentUser={currentUser}
                isOnline={isOnline}
                currentStreak={streakData.currentStreak}
                dailyGoalPercent={dailyGoalPercent}
                onOpenEditProfile={() => setIsEditProfileOpen(true)}
                onChangePassword={handleChangePassword}
                onSwitchAccount={handleSwitchAccount}
                onSignOut={handleSignOut}
                position="header"
              />
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              className="h-[26px] sm:h-[34px] px-2.5 sm:px-3.5 rounded-[6px] sm:rounded-lg bg-gradient-to-tr from-[#3B82F6] via-[#2563EB] to-[#1D4ED8] hover:opacity-95 active:scale-95 text-white text-[11.5px] sm:text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/20 transition-all shrink-0"
              title="Sign in with Google or Email"
            >
              <LogIn className="w-3.5 h-3.5 shrink-0 stroke-[2.4]" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
