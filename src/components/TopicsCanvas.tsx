import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Plus,
  Target,
  Filter,
  ChevronDown,
  Calendar,
  ArrowUpDown,
  BarChart2,
  LayoutGrid,
  List,
  MoreVertical,
  Pin,
  Pencil,
  Palette,
  CornerUpRight,
  FolderOutput,
  Copy,
  Trash2,
  Check,
  RotateCcw,
  CheckSquare,
  Square,
  Sparkles as SparklesIcon,
  AlignLeft,
  ChevronUp,
  FileText,
  Clock,
  Play,
  GripVertical,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { CustomSelect } from './CustomSelect';
import { CardTopicHeader } from './CardTopicHeader';
import { Topic, TaskItem } from '../types';

function AnimatedNumber({
  value,
  duration = 400,
  prefix = '',
  suffix = '',
}: {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}) {
  const [displayValue, setDisplayValue] = React.useState(value);
  const prevValueRef = React.useRef(value);

  React.useEffect(() => {
    const startVal = prevValueRef.current;
    const endVal = value;
    if (startVal === endVal) return;

    let startTimestamp: number | null = null;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.round(startVal + (endVal - startVal) * easeProgress);

      setDisplayValue(currentVal);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        prevValueRef.current = endVal;
      }
    };

    window.requestAnimationFrame(step);
  }, [value, duration]);

  return (
    <span>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}

export interface TopicsCanvasProps {
  filteredTopics: Topic[];
  displayTopics: Topic[];
  statusFilter: 'all' | 'completed' | 'in_progress' | 'not_started';
  handleStatusFilterChange: (status: any) => void;
  isStatusFilterDropdownOpen: boolean;
  setIsStatusFilterDropdownOpen: (open: boolean) => void;
  countAll: number;
  countCompleted: number;
  countInProgress: number;
  countNotStarted: number;
  sortCategory: 'date' | 'name' | 'progress';
  sortDirection: 'asc' | 'desc';
  handleSortSelect: (val: any) => void;
  viewMode: 'grid-cards' | 'grid-banner' | 'list';
  handleViewModeChange: (mode: any) => void;
  cardsRef: React.RefObject<HTMLDivElement | null>;
  bannerRef: React.RefObject<HTMLDivElement | null>;
  currentTopic: Topic | null;
  getTopicTheme: (topic: any) => any;
  getDueCountForTopic: (topic: any) => number;
  highlightedTopicId: string | null;
  animatingPinTopicId: string | null;
  animatingDeleteTopicId: string | null;
  editingTopicId: string | null;
  setEditingTopicId: (id: string | null) => void;
  editingTopicTitle: string;
  setEditingTopicTitle: (title: string) => void;
  selectedTopicId: string | null;
  setSelectedTopicId: (id: string | null) => void;
  setIsDetailsDrawerOpen: (open: boolean) => void;
  activeMenuTopicId: string | null;
  setActiveMenuTopicId: (id: string | null) => void;
  togglePinTopic: (topicId: string) => void;
  setCustomizingTopic: (topic: any) => void;
  setCustomColorSelection: (color: string) => void;
  setCustomIconSelection: (icon: string) => void;
  setMergeSourceTopic: (topic: any) => void;
  setTargetTopicIdForMerge: (id: string) => void;
  setMoveSectionSourceTopic: (topic: any) => void;
  setTargetSectionForMove: (sec: string) => void;
  handleDuplicateTopic: (topicId: string) => void;
  setTopicToDelete: (topic: any) => void;
  setNewTopicTitle: (title: string) => void;
  setIsNewTopicOpen: (open: boolean) => void;
  setIsShortcutsOpen: (open: boolean) => void;
}

export function TopicsCanvas({
  filteredTopics,
  displayTopics,
  statusFilter,
  handleStatusFilterChange,
  isStatusFilterDropdownOpen,
  setIsStatusFilterDropdownOpen,
  countAll,
  countCompleted,
  countInProgress,
  countNotStarted,
  sortCategory,
  sortDirection,
  handleSortSelect,
  viewMode,
  handleViewModeChange,
  cardsRef,
  bannerRef,
  currentTopic,
  getTopicTheme,
  getDueCountForTopic,
  highlightedTopicId,
  animatingPinTopicId,
  animatingDeleteTopicId,
  editingTopicId,
  setEditingTopicId,
  editingTopicTitle,
  setEditingTopicTitle,
  selectedTopicId,
  setSelectedTopicId,
  setIsDetailsDrawerOpen,
  activeMenuTopicId,
  setActiveMenuTopicId,
  togglePinTopic,
  setCustomizingTopic,
  setCustomColorSelection,
  setCustomIconSelection,
  setMergeSourceTopic,
  setTargetTopicIdForMerge,
  setMoveSectionSourceTopic,
  setTargetSectionForMove,
  handleDuplicateTopic,
  setTopicToDelete,
  setNewTopicTitle,
  setIsNewTopicOpen,
  setIsShortcutsOpen,
}: TopicsCanvasProps) {
  const isAnyPinAnimating = Boolean(animatingPinTopicId);

  return (
    <>
      {/* --- UNIFIED MASTER TOPICS CANVAS CONTAINER / EMPTY STATE --- */}
                  {filteredTopics.length === 0 ? (
                    <div className="w-full border-2 border-dashed border-[#E2E8F0] dark:border-slate-800 rounded-2xl bg-white/60 dark:bg-slate-900/60 py-6 sm:py-8 md:py-9 px-6 flex flex-col items-center justify-center text-center relative select-none">
                      {/* Illustration Graphic */}
                      <div className="relative w-[112px] h-[112px] flex items-center justify-center mb-4 shrink-0">
                        {/* Background Aura */}
                        <div 
                          className="absolute inset-0 rounded-full border shadow-inner transition-colors duration-300" 
                          style={{
                            backgroundColor: 'var(--folder-aura-bg, rgba(238, 244, 255, 0.8))',
                            borderColor: 'var(--folder-aura-border, rgba(219, 234, 254, 0.5))'
                          }}
                        />
                        
                        {/* Floating Sparkles & Accent Shapes */}
                        <div className="absolute top-0 right-2 w-2.5 h-2.5 bg-pink-300/80 rotate-45 rounded-[2px] animate-pulse" />
                        <div className="absolute top-4 left-2 w-2 h-2 bg-pink-300/70 rotate-45 rounded-[2px]" />
                        <div className="absolute bottom-4 right-3 w-2.5 h-2.5 bg-orange-300/80 rotate-45 rounded-[2px]" />
                        <div className="absolute bottom-5 left-2 w-2 h-2 bg-purple-300/70 rotate-45 rounded-[2px]" />

                        {/* 3D Soft Folder Graphic with document pages */}
                        <div className="relative z-10 flex flex-col items-center transform hover:scale-105 transition-transform duration-300">
                          <div 
                            className="relative w-[72px] h-[54px] rounded-xl flex items-center justify-center transition-all duration-300"
                            style={{
                              backgroundImage: 'var(--folder-back-grad, linear-gradient(to top right, #3B82F6, #60A5FA, #93C5FD))',
                              boxShadow: '0 10px 15px -3px var(--folder-shadow, rgba(37, 99, 235, 0.25))'
                            }}
                          >
                            {/* Top Folder Tab */}
                            <div 
                              className="absolute -top-2 left-2 w-7 h-2.5 rounded-t-md transition-colors duration-300" 
                              style={{
                                backgroundColor: 'var(--folder-tab-color, #60A5FA)'
                              }}
                            />
                            
                            {/* Paper sheet popping out */}
                            <div className="absolute -top-3 w-10 h-9 bg-white dark:bg-slate-800 rounded-t-lg shadow-xs border border-slate-100 dark:border-slate-700 flex flex-col p-1 gap-0.5 transform -rotate-3">
                              <div className="w-7 h-1 bg-slate-200 dark:bg-slate-700 rounded-full" />
                              <div className="w-5 h-1 bg-slate-200 dark:bg-slate-700 rounded-full" />
                              <div 
                                className="w-6 h-1 rounded-full transition-colors duration-300" 
                                style={{
                                  backgroundColor: 'var(--folder-line-color, #93C5FD)'
                                }}
                              />
                            </div>

                            {/* Front Flap */}
                            <div 
                              className="absolute inset-0 rounded-xl flex items-center justify-center opacity-95 border-t border-white/30 transition-all duration-300"
                              style={{
                                backgroundImage: 'var(--folder-front-grad, linear-gradient(to top right, #2563EB, #60A5FA))'
                              }}
                            >
                              <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-2xs">
                                <div className="w-2 h-2 rounded-full bg-white/90" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Text Info */}
                      <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] dark:text-slate-100 tracking-tight">
                        No topics found yet
                      </h3>
                      
                      <p className="text-xs text-[#64748B] dark:text-slate-300 font-medium mt-1.5 max-w-xl text-center leading-relaxed">
                        You haven't created any topics in this section. Create your first topic to get started and keep your learning organized.
                      </p>

                      {/* Primary Action Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setNewTopicTitle('');
                          setIsNewTopicOpen(true);
                        }}
                        className="h-[36px] px-6 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1742BF] text-white text-xs font-bold rounded-[6px] shadow-sm shadow-blue-500/25 active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 mt-5 shrink-0"
                      >
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                        <span>Add New Topic</span>
                      </button>

                      {/* Secondary Link Button */}
                      <button
                        type="button"
                        onClick={() => setIsShortcutsOpen(true)}
                        className="text-xs font-bold text-[#2563EB] dark:text-blue-400 hover:text-[#1D4ED8] dark:hover:text-blue-300 transition-colors cursor-pointer flex items-center gap-1.5 mt-2.5 py-1 px-2 rounded-md hover:bg-blue-50/50 dark:hover:bg-blue-950/50"
                      >
                        <Target className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400" />
                        <span>Learn how topics work</span>
                        <span className="text-sm">→</span>
                      </button>
                    </div>
                  ) : (
                    <div className="w-full bg-white dark:bg-[#0F172A]/80 border border-[#E2E8F0] dark:border-slate-800/80 rounded-[10px] shadow-[0_2px_12px_rgba(15,23,42,0.03)] overflow-visible">
                      {/* Integrated Docked Toolbar Header (Mac Glass & Strict 32px Symmetrical Height) */}
                      <div className="flex items-center justify-between gap-2 px-2.5 py-2 sm:px-3.5 sm:py-2 bg-slate-50/80 dark:bg-slate-900/60 backdrop-blur-xs border-b border-slate-200/90 dark:border-slate-800 rounded-t-[9px] relative z-30 select-none">
                      
                      {/* DESKTOP: Status Pill Filters (Connected Segmented Control) */}
                      <div className="hidden min-[660px]:inline-flex items-center p-0.5 bg-slate-200/50 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/60 rounded-lg relative shrink-0 h-8 max-w-full overflow-x-auto no-scrollbar">
                        {/* Option: All */}
                        <button
                          onClick={() => handleStatusFilterChange('all')}
                          className={`relative px-2.5 h-full rounded-md text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 z-10 ${
                            statusFilter === 'all' ? 'text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          {statusFilter === 'all' && (
                            <motion.div
                              layoutId="activeStatusFilterTab"
                              className="absolute inset-0 bg-[#2563EB] rounded-md shadow-2xs z-0"
                              transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
                            />
                          )}
                          <span className="relative z-10 flex items-center gap-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${statusFilter === 'all' ? 'bg-white' : 'bg-slate-900 dark:bg-slate-300'}`} />
                            <span>All</span>
                          </span>
                          <span className={`relative z-10 px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none ${statusFilter === 'all' ? 'bg-white/25 text-white' : 'bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                            <AnimatedNumber value={countAll} />
                          </span>
                        </button>

                        {/* Option: Completed */}
                        <button
                          onClick={() => handleStatusFilterChange('completed')}
                          className={`relative px-2.5 h-full rounded-md text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 z-10 ${
                            statusFilter === 'completed' ? 'text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          {statusFilter === 'completed' && (
                            <motion.div
                              layoutId="activeStatusFilterTab"
                              className="absolute inset-0 bg-[#10B981] rounded-md shadow-2xs z-0"
                              transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
                            />
                          )}
                          <span className="relative z-10 flex items-center gap-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${statusFilter === 'completed' ? 'bg-white' : 'bg-[#10B981]'}`} />
                            Completed
                          </span>
                          <span className={`relative z-10 px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none ${statusFilter === 'completed' ? 'bg-white/25 text-white' : 'bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                            <AnimatedNumber value={countCompleted} />
                          </span>
                        </button>

                        {/* Option: In Progress */}
                        <button
                          onClick={() => handleStatusFilterChange('in_progress')}
                          className={`relative px-2.5 h-full rounded-md text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 z-10 ${
                            statusFilter === 'in_progress' ? 'text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          {statusFilter === 'in_progress' && (
                            <motion.div
                              layoutId="activeStatusFilterTab"
                              className="absolute inset-0 bg-[#2563EB] rounded-md shadow-2xs z-0"
                              transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
                            />
                          )}
                          <span className="relative z-10 flex items-center gap-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${statusFilter === 'in_progress' ? 'bg-white' : 'bg-[#2563EB]'}`} />
                            In Progress
                          </span>
                          <span className={`relative z-10 px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none ${statusFilter === 'in_progress' ? 'bg-white/25 text-white' : 'bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                            <AnimatedNumber value={countInProgress} />
                          </span>
                        </button>

                        {/* Option: Not Started */}
                        <button
                          onClick={() => handleStatusFilterChange('not_started')}
                          className={`relative px-2.5 h-full rounded-md text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 z-10 ${
                            statusFilter === 'not_started' ? 'text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          {statusFilter === 'not_started' && (
                            <motion.div
                              layoutId="activeStatusFilterTab"
                              className="absolute inset-0 bg-[#64748B] rounded-md shadow-2xs z-0"
                              transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
                            />
                          )}
                          <span className="relative z-10 flex items-center gap-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${statusFilter === 'not_started' ? 'bg-white' : 'bg-[#64748B]'}`} />
                            Not Started
                          </span>
                          <span className={`relative z-10 px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none ${statusFilter === 'not_started' ? 'bg-white/25 text-white' : 'bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                            <AnimatedNumber value={countNotStarted} />
                          </span>
                        </button>
                      </div>

                      {/* MOBILE: Smart Status Filter Dropdown Button */}
                      <div className="relative min-[660px]:hidden filter-dropdown-container">
                        <button
                          type="button"
                          onClick={() => setIsStatusFilterDropdownOpen(!isStatusFilterDropdownOpen)}
                          className={`h-8 px-2.5 rounded-lg border flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                            isStatusFilterDropdownOpen
                              ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700 text-[#2563EB] dark:text-blue-400 ring-2 ring-blue-500/15'
                              : statusFilter !== 'all'
                                ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-300 dark:border-blue-700 text-[#2563EB] dark:text-blue-400'
                                : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          <Filter className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400 shrink-0" />
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="truncate">
                              {statusFilter === 'all'
                                ? 'Filter'
                                : statusFilter === 'completed'
                                  ? 'Completed'
                                  : statusFilter === 'in_progress'
                                    ? 'In Progress'
                                    : 'Not Started'}
                            </span>
                            {statusFilter !== 'all' && (
                              <span
                                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                  statusFilter === 'completed'
                                    ? 'bg-[#10B981]'
                                    : statusFilter === 'in_progress'
                                      ? 'bg-[#2563EB]'
                                      : 'bg-[#64748B]'
                                }`}
                              />
                            )}
                          </div>
                          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${isStatusFilterDropdownOpen ? 'rotate-180 text-[#2563EB] dark:text-blue-400' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        <AnimatePresence>
                          {isStatusFilterDropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -4 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -4 }}
                              transition={{ duration: 0.12, ease: 'easeOut' }}
                              className="absolute left-0 top-full mt-1.5 w-[200px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-900/10 dark:shadow-black/50 rounded-xl p-1 z-50 text-xs font-medium filter-dropdown text-slate-700 dark:text-slate-200 select-none"
                            >
                              <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                Filter Status
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  handleStatusFilterChange('all');
                                  setIsStatusFilterDropdownOpen(false);
                                }}
                                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs font-semibold transition-colors cursor-pointer my-0.5 ${
                                  statusFilter === 'all' ? 'bg-blue-50 dark:bg-blue-950/40 text-[#2563EB] dark:text-blue-400 font-bold' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                                }`}
                              >
                                <div className="flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-900 dark:bg-slate-200" />
                                  <span>All</span>
                                </div>
                                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                  {countAll}
                                </span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  handleStatusFilterChange('completed');
                                  setIsStatusFilterDropdownOpen(false);
                                }}
                                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs font-semibold transition-colors cursor-pointer my-0.5 ${
                                  statusFilter === 'completed' ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                                }`}
                              >
                                <div className="flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                  <span>Completed</span>
                                </div>
                                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                  {countCompleted}
                                </span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  handleStatusFilterChange('in_progress');
                                  setIsStatusFilterDropdownOpen(false);
                                }}
                                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs font-semibold transition-colors cursor-pointer my-0.5 ${
                                  statusFilter === 'in_progress' ? 'bg-blue-50 dark:bg-blue-950/40 text-[#2563EB] dark:text-blue-400 font-bold' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                                }`}
                              >
                                <div className="flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                                  <span>In Progress</span>
                                </div>
                                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                  {countInProgress}
                                </span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  handleStatusFilterChange('not_started');
                                  setIsStatusFilterDropdownOpen(false);
                                }}
                                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs font-semibold transition-colors cursor-pointer my-0.5 ${
                                  statusFilter === 'not_started' ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                                }`}
                              >
                                <div className="flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                                  <span>Not Started</span>
                                </div>
                                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                  {countNotStarted}
                                </span>
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* View Controls & Sort (Right-aligned with strict 32px height) */}
                      <div className="flex items-center gap-2 shrink-0 ml-auto">
                        <CustomSelect<'date' | 'name' | 'progress'>
                          value={sortCategory}
                          onChange={(val) => handleSortSelect(val)}
                          labelPrefix="Sort: "
                          options={[
                            {
                              value: 'date',
                              label: sortCategory === 'date'
                                ? (sortDirection === 'desc' ? 'Date (New → Old)' : 'Date (Old → New)')
                                : 'Date',
                              icon: <Calendar className="w-3.5 h-3.5 text-slate-500" />
                            },
                            {
                              value: 'name',
                              label: sortCategory === 'name'
                                ? (sortDirection === 'asc' ? 'Name (A → Z)' : 'Name (Z → A)')
                                : 'Name',
                              icon: <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                            },
                            {
                              value: 'progress',
                              label: sortCategory === 'progress'
                                ? (sortDirection === 'desc' ? 'Progress (High → Low)' : 'Progress (Low → High)')
                                : 'Progress',
                              icon: <BarChart2 className="w-3.5 h-3.5 text-slate-500" />
                            },
                          ]}
                        />

                        <div className="flex items-center p-0.5 bg-slate-200/50 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/60 rounded-lg relative shrink-0 h-8">
                          <button
                            type="button"
                            onClick={() => handleViewModeChange('grid-cards')}
                            className={`relative w-7 h-7 min-[800px]:w-auto min-[800px]:h-7 px-0 min-[800px]:px-2.5 rounded-md transition-colors cursor-pointer flex items-center justify-center min-[800px]:justify-start gap-0 min-[800px]:gap-1.5 z-10 ${
                              viewMode.startsWith('grid')
                                ? 'text-white font-bold'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold'
                            }`}
                            title={viewMode === 'grid-cards' ? 'Current: 4-Col Image Grid (Click for Banner Grid)' : 'Current: Banner Grid (Click for 4-Col Image Grid)'}
                          >
                            {viewMode.startsWith('grid') && (
                              <motion.div
                                layoutId="activeViewTab"
                                className="absolute inset-0 bg-[#2563EB] rounded-md shadow-2xs z-0"
                                transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
                              />
                            )}
                            <LayoutGrid className="w-3.5 h-3.5 relative z-10 shrink-0" />
                            <span className="text-[11px] hidden min-[800px]:inline relative z-10">
                              <span className="hidden min-[1200px]:inline">{viewMode === 'grid-cards' ? 'Grid (Cards)' : viewMode === 'grid-banner' ? 'Grid (Banner)' : 'Grid'}</span>
                              <span className="hidden min-[800px]:inline min-[1200px]:hidden">Grid</span>
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleViewModeChange('list')}
                            className={`relative w-7 h-7 min-[800px]:w-auto min-[800px]:h-7 px-0 min-[800px]:px-2.5 rounded-md transition-colors cursor-pointer flex items-center justify-center min-[800px]:justify-start gap-0 min-[800px]:gap-1.5 z-10 ${
                              viewMode === 'list'
                                ? 'text-white font-bold'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold'
                            }`}
                            title="List View"
                          >
                            {viewMode === 'list' && (
                              <motion.div
                                layoutId="activeViewTab"
                                className="absolute inset-0 bg-[#2563EB] rounded-md shadow-2xs z-0"
                                transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
                              />
                            )}
                            <List className="w-3.5 h-3.5 relative z-10 shrink-0" />
                            <span className="text-[11px] hidden min-[800px]:inline relative z-10">
                              List
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>

                      {/* Unified Topics Content Body (Canvas) */}
                      <div className="p-3 sm:p-4 w-full min-w-0">
                        {displayTopics.length === 0 ? (
                          <div className="w-full my-3 border-2 border-dashed border-[#E2E8F0] dark:border-slate-800 rounded-2xl bg-white/60 dark:bg-slate-900/60 py-6 sm:py-8 md:py-9 px-6 flex flex-col items-center justify-center text-center relative select-none">
                            <h3 className="text-base font-bold text-[#0F172A] dark:text-slate-100">No topics found</h3>
                            <p className="text-xs text-[#64748B] dark:text-slate-300 mt-1">No topics match the selected status filter.</p>
                            <button
                              type="button"
                              onClick={() => handleStatusFilterChange('all')}
                              className="mt-3 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
                            >
                              Show All Topics
                            </button>
                          </div>
                    ) : viewMode !== 'list' ? (
                      <div className="w-full">
                        {/* Cards View Layer */}
                        <div
                          ref={cardsRef}
                          className={`w-full ${viewMode === 'grid-cards' ? 'block' : 'hidden'}`}
                        >
                          {/* --- 4-COLUMN IMAGE CARD GRID VIEW (Exact Attached Reference Image Replica) --- */}
                          <div
                            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full min-w-0 ${
                              isAnyPinAnimating ? 'pointer-events-none select-none' : ''
                            }`}
                          >
                        {displayTopics.map((topic, index) => {
                          const topicTasks = topic.tasks || [];
                          const totalTasks = topicTasks.length;
                          const completedTasks = topicTasks.filter(t => t.completed).length;
                          
                          const displayPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
                          const isCompleted = totalTasks > 0 && completedTasks === totalTasks;
                          const isNotStarted = completedTasks === 0;

                          const isSelected = currentTopic?.id === topic.id;
                          const theme = getTopicTheme(topic);
                          const IconComp = theme.icon;
                          const iconText = (theme as any).iconText;
                          const dueCount = getDueCountForTopic(topic);

                          const countText = `${totalTasks} ${totalTasks === 1 ? 'Task' : 'Tasks'}`;
                          const completedRatioText = `${completedTasks}/${totalTasks} Completed`;

                          const isHighlighted = highlightedTopicId === topic.id;
                          const isPinAnimating = animatingPinTopicId === topic.id;
                          const isDeleting = animatingDeleteTopicId === topic.id;
                          const isNearBottom = index >= Math.max(0, displayTopics.length - 4);

                          return (
                            <motion.div
                              layout
                              key={topic.id}
                              id={topic.id}
                              onClick={() => {
                                if (editingTopicId !== topic.id) {
                                  setSelectedTopicId(topic.id);
                                  setIsDetailsDrawerOpen(true);
                                }
                              }}
                              initial={false}
                              animate={{
                                opacity: isDeleting ? 0 : 1,
                                scale: isDeleting ? 0.95 : isPinAnimating ? 1.03 : 1,
                                zIndex: isPinAnimating ? 30 : activeMenuTopicId === topic.id ? 100 : 1,
                              }}
                              whileHover={isAnyPinAnimating ? undefined : { y: -2 }}
                              exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.15 } }}
                              transition={{
                                layout: {
                                  type: 'spring',
                                  stiffness: 350,
                                  damping: 28,
                                  mass: 0.85
                                },
                                scale: { duration: 0.2 },
                                opacity: { duration: 0.2 },
                                y: { duration: 0.15 }
                              }}
                              className={`border border-slate-200/70 dark:border-white/[0.06] rounded-xl p-3 sm:p-3.5 flex flex-col justify-between group cursor-pointer relative min-h-[120px] bg-white/70 dark:bg-[#090D16]/70 backdrop-blur-xl ${
                                isPinAnimating
                                  ? 'ring-2 ring-[#2563EB]/40 bg-blue-50/60 dark:bg-blue-950/60 shadow-xl shadow-blue-500/20'
                                  : activeMenuTopicId === topic.id
                                      ? 'shadow-md'
                                      : topic.isPinned
                                        ? 'bg-slate-50/40 dark:bg-slate-900/40 shadow-2xs'
                                        : isAnyPinAnimating
                                          ? 'shadow-sm shadow-slate-900/5'
                                          : 'shadow-sm shadow-slate-900/5 hover:shadow-md'
                              }`}
                            >
                              {/* Left Edge Vertical Inline Accent Indicator Bar (Clips flush to card inner boundary, matches topic Icon Color) */}
                              <div className="absolute inset-0 rounded-[11px] overflow-hidden pointer-events-none z-0">
                                <div
                                  className={`absolute left-0 top-0 bottom-0 w-[3.5px] ${theme.bg || theme.cardIconBg || 'bg-[#2563EB]'} preserve-color`}
                                />
                              </div>

                              {/* Card Header Row: Dynamic Title Header + 3-Dot Trigger */}
                              <div className="flex items-start justify-between gap-2 z-10">
                                <CardTopicHeader
                                  topic={topic}
                                  theme={theme}
                                  iconText={iconText}
                                  IconComp={IconComp}
                                  countText={countText}
                                />

                                {/* Right: Sleek 3-Dot Action Menu Button */}
                                {editingTopicId !== topic.id && (
                                  <div className="relative topic-card-menu-container shrink-0 -mr-1">
                                    <button
                                      onClick={e => {
                                        e.stopPropagation();
                                        setActiveMenuTopicId(activeMenuTopicId === topic.id ? null : topic.id);
                                      }}
                                      className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer topic-card-menu-btn ${
                                        activeMenuTopicId === topic.id ? 'opacity-100 bg-slate-100 text-slate-900 shadow-2xs' : 'opacity-100 group-hover:opacity-100'
                                      }`}
                                      title="Topic options"
                                    >
                                      <MoreVertical className="w-3.5 h-3.5" />
                                    </button>

                                    <AnimatePresence>
                                      {activeMenuTopicId === topic.id && (
                                        <motion.div
                                          initial={{ opacity: 0, scale: 0.95, y: isNearBottom ? 4 : -4 }}
                                          animate={{ opacity: 1, scale: 1, y: 0 }}
                                          exit={{ opacity: 0, scale: 0.95, y: isNearBottom ? 4 : -4 }}
                                          transition={{ duration: 0.15, ease: 'easeOut' }}
                                          onClick={e => e.stopPropagation()}
                                          className={`absolute right-0 ${
                                            isNearBottom ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
                                          } w-[190px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-900/15 dark:shadow-black/50 backdrop-blur-md rounded-xl p-1 z-[999] text-xs font-medium topic-card-menu text-slate-700 dark:text-slate-200 select-none`}
                                        >
                                          {/* Pin to top */}
                                          <button
                                            onClick={() => {
                                              setActiveMenuTopicId(null);
                                              togglePinTopic(topic.id);
                                            }}
                                            className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
                                          >
                                            <Pin className={`w-3.5 h-3.5 shrink-0 ${topic.isPinned ? 'fill-[#2563EB] text-[#2563EB]' : 'text-slate-500 dark:text-slate-400'} preserve-color`} />
                                            <span className="truncate">{topic.isPinned ? 'Unpin from top' : 'Pin to top'}</span>
                                          </button>

                                          {/* 2. Rename */}
                                          <button
                                            onClick={() => {
                                              setActiveMenuTopicId(null);
                                              setEditingTopicId(topic.id);
                                              setEditingTopicTitle(topic.title);
                                            }}
                                            className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
                                          >
                                            <Pencil className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
                                            <span className="truncate">Rename</span>
                                          </button>

                                          {/* 2.5 Customize Icon & Color */}
                                          <button
                                            onClick={() => {
                                              setActiveMenuTopicId(null);
                                              setCustomizingTopic(topic);
                                              setCustomColorSelection(topic.customColor || '');
                                              setCustomIconSelection(topic.customIcon || '');
                                            }}
                                            className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
                                          >
                                            <Palette className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                                            <span className="truncate">Customize Icon & Color</span>
                                          </button>

                                          {/* 3. Merge Topic */}
                                          <button
                                            onClick={() => {
                                              setActiveMenuTopicId(null);
                                              setMergeSourceTopic(topic);
                                              setTargetTopicIdForMerge('');
                                            }}
                                            className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
                                          >
                                            <CornerUpRight className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
                                            <span className="truncate">Merge Topic</span>
                                          </button>

                                          {/* 4. Move to section */}
                                          <button
                                            onClick={() => {
                                              setActiveMenuTopicId(null);
                                              setMoveSectionSourceTopic(topic);
                                              setTargetSectionForMove('');
                                            }}
                                            className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
                                          >
                                            <FolderOutput className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
                                            <span className="truncate">Move to section</span>
                                          </button>

                                          {/* 5. Duplicate */}
                                          <button
                                            onClick={() => {
                                              setActiveMenuTopicId(null);
                                              handleDuplicateTopic(topic.id);
                                            }}
                                            className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
                                          >
                                            <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
                                            <span className="truncate">Duplicate</span>
                                          </button>

                                          <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                                          {/* 5. Move to Recycle Bin */}
                                          <button
                                            onClick={() => {
                                              setActiveMenuTopicId(null);
                                              setTopicToDelete(topic);
                                            }}
                                            className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-700 dark:hover:text-red-300"
                                          >
                                            <Trash2 className="w-3.5 h-3.5 text-red-600 dark:text-red-400 shrink-0" />
                                            <span className="truncate">Move to Recycle Bin</span>
                                          </button>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                )}
                              </div>

                              {/* Card Middle: Progress Line & Percentage (Minimal whitespace) */}
                              <div className="flex items-center gap-2 my-1.5">
                                <div className="w-full bg-[#E9EDF3] h-1.5 rounded-full overflow-hidden flex-1">
                                  <div
                                    style={{ width: `${displayPercent}%` }}
                                    className={`h-full rounded-full bg-gradient-to-r ${theme.progressGradient} preserve-color transition-[width] duration-300 ease-in-out`}
                                  />
                                </div>
                                <span className={`text-[10.5px] font-bold shrink-0 min-w-[28px] text-right preserve-color ${
                                  isCompleted ? theme.textColor : isNotStarted ? 'text-slate-400' : 'text-slate-700'
                                }`}>
                                  {displayPercent}%
                                </span>
                              </div>

                              {/* Card Footer: 3 Standardized Status Indicators */}
                              <div className="flex items-center justify-between text-xs font-semibold pt-1.5 border-t border-slate-100">
                                {isCompleted ? (
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <div className="w-4 h-4 rounded-full bg-[#10B981] text-white flex items-center justify-center shrink-0 shadow-2xs">
                                      <Check className="w-2.5 h-2.5 stroke-[3.5]" />
                                    </div>
                                    <span className="text-xs font-semibold text-slate-700 truncate">
                                      Completed
                                    </span>
                                  </div>
                                ) : isNotStarted ? (
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center shrink-0">
                                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                    </div>
                                    <span className="text-xs font-semibold text-slate-400 truncate">
                                      Not Started
                                    </span>
                                  </div>
                                ) : (
                                  <>
                                    <div className="flex items-center gap-1.5 min-w-0">
                                      <div className="w-4 h-4 rounded-full bg-[#10B981] text-white flex items-center justify-center shrink-0 shadow-2xs">
                                        <Check className="w-2.5 h-2.5 stroke-[3.5]" />
                                      </div>
                                      <span className="text-xs font-semibold text-slate-700 truncate">
                                        {completedRatioText}
                                      </span>
                                    </div>

                                    {dueCount > 0 && (
                                      <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                                        <div className="w-4 h-4 rounded-full border-[1.5px] border-[#EF4444] flex items-center justify-center shrink-0">
                                          <div className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                                        </div>
                                        <span className="text-xs font-semibold text-slate-700">
                                          {dueCount} Due
                                        </span>
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}

                        {/* Add New Topic Dashed Card */}
                        <div
                          onClick={() => {
                            setNewTopicTitle('');
                            setIsNewTopicOpen(true);
                          }}
                          className="bg-white dark:bg-slate-900/60 border-2 border-dashed border-[#CBD5E1] dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 rounded-xl p-3 sm:p-3.5 flex items-center justify-center gap-3 cursor-pointer min-h-[120px] group hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                        >
                          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                            <Plus className="w-4 h-4 stroke-[2.5]" />
                          </div>
                          <div className="flex flex-col">
                            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Add New Topic</h4>
                            <span className="text-[11px] font-normal text-slate-400 dark:text-slate-500 mt-0.5">Create a new topic</span>
                          </div>
                        </div>
                      </div>
                      </div>
                      
                      {/* Banner View Layer */}
                      <div
                        ref={bannerRef}
                        className={`w-full ${viewMode === 'grid-banner' ? 'block' : 'hidden'}`}
                      >
                        {/* --- GRID BANNER VIEW MODE --- */}
                        <div
                          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4 w-full min-w-0 ${
                            isAnyPinAnimating ? 'pointer-events-none select-none' : ''
                          }`}
                        >
                        {displayTopics.map((topic, index) => {
                          const topicTasks = topic.tasks || [];
                          const totalTasks = topicTasks.length;
                          const completedTasks = topicTasks.filter(t => t.completed).length;
                          const percent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
                          const isCompleted = totalTasks > 0 && completedTasks === totalTasks;
                          const isNotStarted = completedTasks === 0;
                          const dueCount = getDueCountForTopic(topic);
                          
                          const countText = `${totalTasks} ${totalTasks === 1 ? 'Task' : 'Tasks'}`;
                          const completedRatioText = `${completedTasks}/${totalTasks} Completed`;
                          
                          const isSelected = currentTopic?.id === topic.id;
                          const isPinAnimating = animatingPinTopicId === topic.id;
                          const isDeleting = animatingDeleteTopicId === topic.id;
                          const isNearBottom = index >= Math.max(0, displayTopics.length - 3);
                          const theme = getTopicTheme(topic);
                          const IconComp = theme.icon;
                          const iconText = (theme as any).iconText;

                          return (
                            <motion.div
                              layout
                              key={topic.id}
                              id={topic.id}
                              onClick={() => {
                                if (editingTopicId !== topic.id) {
                                  setSelectedTopicId(topic.id);
                                  setIsDetailsDrawerOpen(true);
                                }
                              }}
                              initial={false}
                              animate={{
                                opacity: isDeleting ? 0 : 1,
                                scale: isDeleting ? 0.95 : isPinAnimating ? 1.03 : 1,
                                zIndex: isPinAnimating ? 30 : activeMenuTopicId === topic.id ? 100 : 1,
                              }}
                              whileHover={isAnyPinAnimating ? undefined : { y: -2 }}
                              exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.15 } }}
                              transition={{
                                layout: {
                                  type: 'spring',
                                  stiffness: 350,
                                  damping: 28,
                                  mass: 0.85
                                },
                                scale: { duration: 0.2 },
                                opacity: { duration: 0.2 },
                                y: { duration: 0.15 }
                              }}
                              className={`bg-white dark:bg-slate-900 border rounded-[16px] overflow-visible flex flex-col justify-between group cursor-pointer relative shadow-sm ${
                                isPinAnimating
                                  ? 'border-[#2563EB] ring-2 ring-[#2563EB]/40 shadow-xl shadow-blue-500/20'
                                  : activeMenuTopicId === topic.id
                                      ? 'border-[#E2E8F0] dark:border-slate-700 shadow-md'
                                      : topic.isPinned
                                        ? 'border-slate-200/90 dark:border-slate-700 shadow-2xs'
                                        : isAnyPinAnimating
                                          ? 'border-[#E2E8F0] dark:border-slate-700'
                                          : 'border-[#E2E8F0] dark:border-slate-700 hover:border-[#CBD5E1] dark:hover:border-slate-600 hover:shadow-md'
                              }`}
                            >
                              {/* Top Banner Header */}
                              <div className={`relative h-32 p-4 flex flex-col justify-between rounded-t-[15px]`}>
                                {/* Watermark & Glow (with overflow-hidden) */}
                                <div className={`absolute inset-0 rounded-t-[15px] overflow-hidden ${theme.bg} preserve-color`}>
                                  <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-white/10 blur-xl pointer-events-none" />
                                  <div className="absolute right-3 top-3 opacity-15 pointer-events-none">
                                    <IconComp className="w-20 h-20 text-white stroke-[1.2] preserve-color" />
                                  </div>
                                </div>

                                {/* Top Row: Icon + Floating Pin Badge on Left, 3-Dot Menu on Right */}
                                <div className="flex items-center justify-between relative z-20">
                                  {/* Icon box + floating pin badge */}
                                  <div className="relative">
                                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs border border-white/30 flex items-center justify-center text-white shadow-xs preserve-color">
                                      {iconText ? (
                                        <span className="text-white text-xs font-black font-serif leading-none preserve-color">{iconText}</span>
                                      ) : (
                                        <IconComp className="w-5 h-5 text-white stroke-[2.2] preserve-color" />
                                      )}
                                    </div>

                                    {/* Requirement 2: Pin icon floating on top-right of topic icon box */}
                                    <AnimatePresence>
                                      {topic.isPinned && (
                                        <motion.div
                                          initial={{ scale: 0, opacity: 0 }}
                                          animate={{ scale: 1, opacity: 1 }}
                                          exit={{ scale: 0, opacity: 0 }}
                                          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                          className="absolute -top-3.5 -right-3.5 w-6 h-6 bg-white rounded-full border-[1.5px] shadow-sm flex items-center justify-center z-20"
                                          style={{ borderColor: theme.bg?.match(/\[(.*?)\]/)?.[1] || '#2563EB' }}
                                          title="Pinned to top"
                                        >
                                          <Pin className={`w-3.5 h-3.5 ${theme.pinIconColor || 'text-[#2563EB] fill-[#2563EB]'} preserve-color rotate-45`} />
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>

                                  {/* Requirement 1: Top right corner e JUST 3 dot menu */}
                                  <div className="relative topic-card-menu-container">
                                    <button
                                      onClick={e => {
                                        e.stopPropagation();
                                        setActiveMenuTopicId(activeMenuTopicId === topic.id ? null : topic.id);
                                      }}
                                      className={`p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer topic-card-menu-btn ${
                                        activeMenuTopicId === topic.id ? 'opacity-100 bg-white/25 text-white' : 'max-md:opacity-100 opacity-80 group-hover:opacity-100'
                                      }`}
                                      title="Topic options"
                                    >
                                      <MoreVertical className="w-4 h-4 stroke-[2.2]" />
                                    </button>

                                    {/* Dropdown Menu (Card View Style) */}
                                    <AnimatePresence>
                                      {activeMenuTopicId === topic.id && (
                                        <motion.div
                                          initial={{ opacity: 0, scale: 0.95, y: isNearBottom ? 4 : -4 }}
                                          animate={{ opacity: 1, scale: 1, y: 0 }}
                                          exit={{ opacity: 0, scale: 0.95, y: isNearBottom ? 4 : -4 }}
                                          transition={{ duration: 0.15, ease: 'easeOut' }}
                                          onClick={e => e.stopPropagation()}
                                          className={`absolute right-0 ${
                                            isNearBottom ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
                                          } w-[190px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-900/15 dark:shadow-black/50 backdrop-blur-md rounded-xl p-1 z-[999] text-xs font-medium topic-card-menu text-slate-700 dark:text-slate-200 select-none`}
                                        >
                                          {/* 1. Pin to top / Unpin */}
                                          <button
                                            onClick={() => {
                                              setActiveMenuTopicId(null);
                                              togglePinTopic(topic.id);
                                            }}
                                            className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
                                          >
                                            <Pin className={`w-3.5 h-3.5 shrink-0 ${topic.isPinned ? 'fill-[#2563EB] text-[#2563EB]' : 'text-slate-500 dark:text-slate-400'} preserve-color`} />
                                            <span className="truncate">{topic.isPinned ? 'Unpin from top' : 'Pin to top'}</span>
                                          </button>

                                          {/* 2. Rename */}
                                          <button
                                            onClick={() => {
                                              setActiveMenuTopicId(null);
                                              setEditingTopicId(topic.id);
                                              setEditingTopicTitle(topic.title);
                                            }}
                                            className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
                                          >
                                            <Pencil className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
                                            <span className="truncate">Rename</span>
                                          </button>

                                          {/* 3. Merge Topic */}
                                          <button
                                            onClick={() => {
                                              setActiveMenuTopicId(null);
                                              setMergeSourceTopic(topic);
                                              setTargetTopicIdForMerge('');
                                            }}
                                            className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
                                          >
                                            <CornerUpRight className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
                                            <span className="truncate">Merge Topic</span>
                                          </button>

                                          {/* 4. Move to section */}
                                          <button
                                            onClick={() => {
                                              setActiveMenuTopicId(null);
                                              setMoveSectionSourceTopic(topic);
                                              setTargetSectionForMove('');
                                            }}
                                            className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
                                          >
                                            <FolderOutput className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
                                            <span className="truncate">Move to section</span>
                                          </button>

                                          {/* 5. Duplicate */}
                                          <button
                                            onClick={() => {
                                              setActiveMenuTopicId(null);
                                              handleDuplicateTopic(topic.id);
                                            }}
                                            className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
                                          >
                                            <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
                                            <span className="truncate">Duplicate</span>
                                          </button>

                                          <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                                          {/* 5. Move to Recycle Bin */}
                                          <button
                                            onClick={() => {
                                              setActiveMenuTopicId(null);
                                              setTopicToDelete(topic);
                                            }}
                                            className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-700 dark:hover:text-red-300"
                                          >
                                            <Trash2 className="w-3.5 h-3.5 text-red-600 dark:text-red-400 shrink-0" />
                                            <span className="truncate">Move to Recycle Bin</span>
                                          </button>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                </div>

                                {/* Requirement 3: Topic Title & Subtopic count inside Banner */}
                                <div className="relative z-10 min-w-0 pr-2">
                                  <h3 className="text-base font-semibold font-serif text-white tracking-tight leading-snug truncate drop-shadow-xs">
                                    {topic.title}
                                  </h3>
                                  <p className="text-xs font-medium text-white/85 mt-0.5 truncate">
                                    {countText}
                                  </p>
                                </div>
                              </div>

                              {/* Requirement 4: Topic progress dependent on task count */}
                              <div className="p-4 flex flex-col gap-3 bg-white rounded-b-[15px]">
                                {/* Progress Bar */}
                                <div className="flex flex-col gap-1.5">
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="font-semibold text-slate-500">Progress</span>
                                    <span className={`font-bold ${theme.textColor} preserve-color`}>
                                      {percent}%
                                    </span>
                                  </div>
                                  <div className="w-full bg-[#F1F5F9] h-2 rounded-full overflow-hidden">
                                    <div
                                      style={{ width: `${percent}%` }}
                                      className={`h-full rounded-full bg-gradient-to-r ${theme.progressGradient} preserve-color transition-[width] duration-300 ease-in-out`}
                                    />
                                  </div>
                                       {/* Status & Completed Tasks */}
                                <div className="flex items-center justify-between pt-1.5 border-t border-slate-100/80 text-xs font-semibold">
                                  {isCompleted ? (
                                    <div className="flex items-center gap-1.5">
                                      <div className="w-4 h-4 rounded-full bg-[#10B981] text-white flex items-center justify-center shrink-0 shadow-2xs">
                                        <Check className="w-2.5 h-2.5 stroke-[3.5]" />
                                      </div>
                                      <span className="text-xs font-semibold text-slate-700">Completed</span>
                                    </div>
                                  ) : isNotStarted ? (
                                    <div className="flex items-center gap-1.5">
                                      <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center shrink-0">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                      </div>
                                      <span className="text-xs font-semibold text-slate-400">Not Started</span>
                                    </div>
                                  ) : (
                                    <>
                                      <div className="flex items-center gap-1.5">
                                        <div className="w-4 h-4 rounded-full bg-[#10B981] text-white flex items-center justify-center shrink-0 shadow-2xs">
                                          <Check className="w-2.5 h-2.5 stroke-[3.5]" />
                                        </div>
                                        <span className="text-xs font-semibold text-slate-700">{completedRatioText}</span>
                                      </div>

                                      {dueCount > 0 && (
                                        <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                                          <div className="w-4 h-4 rounded-full border-[1.5px] border-[#EF4444] flex items-center justify-center shrink-0">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                                          </div>
                                          <span className="text-xs font-semibold text-slate-700">
                                            {dueCount} Due
                                          </span>
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>                            </div>
                              </div>
                            </motion.div>
                          );
                        })}

                        {/* Add New Topic Dashed Card for Banner View */}
                        <div
                          onClick={() => {
                            setNewTopicTitle('');
                            setIsNewTopicOpen(true);
                          }}
                          className="bg-white dark:bg-slate-900/60 border-2 border-dashed border-[#CBD5E1] dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 rounded-[16px] p-5 flex flex-col items-center justify-center gap-3 cursor-pointer min-h-[160px] group hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                        >
                          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                            <Plus className="w-5 h-5 stroke-[2.5]" />
                          </div>
                          <div className="flex flex-col text-center">
                            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Add New Topic</h4>
                            <span className="text-[11px] font-normal text-slate-400 dark:text-slate-500 mt-0.5">Create a new topic</span>
                          </div>
                        </div>
                      </div>
                      </div>

                      </div>
                    ) : (
                      <div className="w-full">
                        {/* List View Layer */}
                        {/* --- LIST VIEW MODE (Accordion List) --- */}
                        <div
                          className={`space-y-2.5 ${isAnyPinAnimating ? 'pointer-events-none select-none' : ''}`}
                        >
                        {displayTopics.map((topic, index) => {
                          const topicTasks = topic.tasks || [];
                          const totalTasks = topicTasks.length;
                          const completedTasks = topicTasks.filter(t => t.completed).length;
                          const percent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
                          const allDone = totalTasks > 0 && completedTasks === totalTasks;
                          const isSelected = currentTopic?.id === topic.id;
                          const isPinAnimating = animatingPinTopicId === topic.id;
                          const theme = getTopicTheme(topic);
                          const isNearBottom = index >= Math.max(0, displayTopics.length - 3);
                          const IconComp = theme.icon;
                          const iconText = (theme as any).iconText;

                          return (
                            <motion.div
                              layout
                              key={topic.id}
                              id={topic.id}
                              onClick={() => setSelectedTopicId(topic.id)}
                              initial={false}
                              animate={{
                                scale: isPinAnimating ? 1.015 : 1,
                                zIndex: isPinAnimating ? 30 : activeMenuTopicId === topic.id ? 100 : 1,
                              }}
                              whileHover={isAnyPinAnimating ? undefined : { y: -1 }}
                              transition={{
                                layout: {
                                  type: 'spring',
                                  stiffness: 350,
                                  damping: 28,
                                  mass: 0.85
                                },
                                scale: { duration: 0.2 },
                                y: { duration: 0.15 }
                              }}
                              className={`bg-white dark:bg-slate-900 border rounded-[8px] overflow-visible relative ${
                                isPinAnimating
                                  ? 'border-[#2563EB] ring-2 ring-[#2563EB]/40 shadow-xl shadow-blue-500/20'
                                  : activeMenuTopicId === topic.id
                                      ? 'border-[#E2E8F0] dark:border-slate-700 shadow-md'
                                      : topic.isPinned
                                        ? 'border-slate-200/90 dark:border-slate-700 shadow-2xs'
                                        : isSelected
                                          ? 'border-[#E2E8F0] dark:border-slate-700'
                                          : isAnyPinAnimating
                                            ? 'border-[#E2E8F0] dark:border-slate-700 shadow-[0_2px_8px_rgba(15,23,42,0.02)]'
                                            : 'border-[#E2E8F0] dark:border-slate-700 hover:border-[#CBD5E1] dark:hover:border-slate-600 shadow-[0_2px_8px_rgba(15,23,42,0.02)] hover:shadow-[0_6px_18px_rgba(15,23,42,0.05)]'
                              }`}
                            >
                            {/* Topic Accordion Header */}
                            <div
                              onClick={() => {
                                setTopics(prev =>
                                  prev.map(t =>
                                    t.id === topic.id ? { ...t, expanded: !t.expanded } : t
                                  )
                                );
                              }}
                              className="px-5 h-[42px] flex items-center justify-between border-b border-[#E2E8F0] dark:border-slate-700 gap-3 bg-white dark:bg-slate-900 cursor-pointer select-none"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="relative shrink-0">
                                  <div className={`w-6 h-6 rounded-md ${theme.cardIconBg} flex items-center justify-center text-white shadow-2xs`}>
                                    {iconText ? (
                                      <span className="text-white text-[10px] font-black font-serif leading-none">{iconText}</span>
                                    ) : (
                                      <IconComp className={`w-3 h-3 ${theme.cardIconColor} stroke-[2.2]`} />
                                    )}
                                  </div>

                                  <AnimatePresence>
                                    {topic.isPinned && (
                                      <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                        className="absolute -top-1 -right-1 w-4 h-4 bg-white dark:bg-slate-900 rounded-full border-[1.5px] shadow-xs flex items-center justify-center z-10"
                                        style={{ borderColor: theme.bg?.match(/\[(.*?)\]/)?.[1] || '#2563EB' }}
                                        title="Pinned to top"
                                      >
                                        <Pin className={`w-2.5 h-2.5 ${theme.pinIconColor || 'text-[#2563EB] fill-[#2563EB]'} rotate-45`} />
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>

                                <span className="font-bold text-sm text-[#0F172A] dark:text-slate-100 truncate">
                                  {topic.title}
                                </span>

                                {/* Progress Percentage Badge */}
                                <span className="inline-flex items-center justify-center h-[22px] min-w-[40px] px-2.5 bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white text-[11px] font-extrabold rounded-full ml-1 shadow-2xs leading-none text-center select-none">
                                  {percent}%
                                </span>

                                {/* Mark All Checkbox & Label */}
                                <label
                                  className="flex items-center gap-2 text-xs font-semibold text-[#475569] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-slate-200 cursor-pointer ml-4 select-none"
                                  onClick={e => e.stopPropagation()}
                                >
                                  <input
                                    type="checkbox"
                                    checked={allDone}
                                    onChange={() => toggleMarkAllTopic(topic.id)}
                                    className="w-4 h-4 border border-[#CBD5E1] dark:border-slate-600 rounded-[4px] accent-[#2563EB] cursor-pointer"
                                  />
                                  <span>Mark All</span>
                                </label>
                              </div>

                              {/* Header Action Buttons matching screenshot */}
                              <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                <button
                                  onClick={() => {
                                    setAddingTaskTopicId(
                                      addingTaskTopicId === topic.id ? null : topic.id
                                    );
                                  }}
                                  className="p-1.5 text-[#475569] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-slate-200 hover:bg-[#F1F5F9] dark:hover:bg-slate-800 rounded-[5px] transition-colors cursor-pointer"
                                  title="Add Subtask"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => {
                                    setEditingTopicId(topic.id);
                                    setEditingTopicTitle(topic.title);
                                  }}
                                  className="p-1.5 text-[#475569] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-slate-200 hover:bg-[#F1F5F9] dark:hover:bg-slate-800 rounded-[5px] transition-colors cursor-pointer"
                                  title="Edit Topic"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => moveTopicIndex(topic.id, 'up')}
                                  className="p-1.5 text-[#475569] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-slate-200 hover:bg-[#F1F5F9] dark:hover:bg-slate-800 rounded-[5px] transition-colors cursor-pointer"
                                  title="Reorder Topic"
                                >
                                  <ArrowUpDown className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => showToast(`Notifications enabled for "${topic.title}"`)}
                                  className="p-1.5 text-[#475569] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-slate-200 hover:bg-[#F1F5F9] dark:hover:bg-slate-800 rounded-[5px] transition-colors cursor-pointer"
                                  title="Topic Notifications"
                                >
                                  <Bell className="w-4 h-4" />
                                </button>
                                <div className="relative topic-card-menu-container">
                                  <button
                                     onClick={e => {
                                       e.stopPropagation();
                                       setActiveMenuTopicId(activeMenuTopicId === topic.id ? null : topic.id);
                                     }}
                                     className={`p-1.5 rounded-md text-[#475569] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-slate-200 hover:bg-[#F1F5F9] dark:hover:bg-slate-800 transition-colors cursor-pointer topic-card-menu-btn ${
                                       activeMenuTopicId === topic.id ? 'bg-[#F1F5F9] dark:bg-slate-800 text-[#0F172A] dark:text-white' : ''
                                     }`}
                                     title="More Options"
                                   >
                                    <MoreVertical className="w-4 h-4" />
                                  </button>

                                  <AnimatePresence>
                                    {activeMenuTopicId === topic.id && (
                                      <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: -4 }}
                                        transition={{ duration: 0.15, ease: 'easeOut' }}
                                        onClick={e => e.stopPropagation()}
                                        className={`absolute right-0 ${
                                          isNearBottom ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
                                        } w-[190px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-900/15 backdrop-blur-md rounded-xl p-1 z-[999] text-xs font-medium topic-card-menu text-slate-700 dark:text-slate-200 select-none`}
                                      >
                                        {/* Pin to top */}
                                        <button
                                          onClick={() => {
                                            setActiveMenuTopicId(null);
                                            togglePinTopic(topic.id);
                                          }}
                                          className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
                                        >
                                          <Pin className={`w-3.5 h-3.5 shrink-0 ${topic.isPinned ? 'fill-[#2563EB] text-[#2563EB]' : 'text-slate-500 dark:text-slate-400'}`} />
                                          <span className="truncate">{topic.isPinned ? 'Unpin from top' : 'Pin to top'}</span>
                                        </button>

                                        {/* Rename */}
                                        <button
                                          onClick={() => {
                                            setActiveMenuTopicId(null);
                                            setEditingTopicId(topic.id);
                                            setEditingTopicTitle(topic.title);
                                          }}
                                          className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
                                        >
                                          <Pencil className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
                                          <span className="truncate">Rename</span>
                                        </button>

                                        {/* Merge Topic */}
                                        <button
                                          onClick={() => {
                                            setActiveMenuTopicId(null);
                                            setMergeSourceTopic(topic);
                                            setTargetTopicIdForMerge('');
                                          }}
                                          className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
                                        >
                                          <CornerUpRight className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
                                          <span className="truncate">Merge Topic</span>
                                        </button>

                                        {/* Move to section */}
                                        <button
                                          onClick={() => {
                                            setActiveMenuTopicId(null);
                                            setMoveSectionSourceTopic(topic);
                                            setTargetSectionForMove('');
                                          }}
                                          className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
                                        >
                                          <FolderOutput className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
                                          <span className="truncate">Move to section</span>
                                        </button>

                                        {/* Duplicate */}
                                        <button
                                          onClick={() => {
                                            setActiveMenuTopicId(null);
                                            handleDuplicateTopic(topic.id);
                                          }}
                                          className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
                                        >
                                          <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
                                          <span className="truncate">Duplicate</span>
                                        </button>

                                        <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                                        {/* Move to Recycle Bin */}
                                        <button
                                          onClick={() => {
                                            setActiveMenuTopicId(null);
                                            setTopicToDelete(topic);
                                          }}
                                          className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-700 dark:hover:text-red-300"
                                        >
                                          <Trash2 className="w-3.5 h-3.5 text-red-600 dark:text-red-400 shrink-0" />
                                          <span className="truncate">Move to Recycle Bin</span>
                                        </button>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              </div>
                            </div>

                            {/* Accordion Content Body */}
                            <AnimatePresence>
                              {topic.expanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="flex flex-col bg-white overflow-hidden"
                                >
                                  {/* Add Task Input Row */}
                                  {addingTaskTopicId === topic.id && (
                                    <div className="flex items-center gap-2 p-3 bg-[#F8FAFC] border-b border-[#E2E8F0]">
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
                                        value={newTaskTitle}
                                        onChange={e => setNewTaskTitle(e.target.value)}
                                        onKeyDown={e => {
                                          if (e.key === 'Enter') handleAddTask(topic.id);
                                        }}
                                        placeholder="Subtask title..."
                                        autoFocus
                                        className="flex-1 text-xs bg-white border border-[#E2E8F0] px-3 py-1.5 rounded-[6px] focus:outline-hidden focus:border-[#2563EB] [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => handleAddTask(topic.id)}
                                        className="px-3 py-1.5 bg-[#2563EB] text-white text-xs font-bold rounded-[6px] hover:bg-[#1D4ED8] cursor-pointer"
                                      >
                                        Add
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setAddingTaskTopicId(null)}
                                        className="p-1.5 text-[#64748B] hover:bg-[#E2E8F0] rounded-[6px] cursor-pointer"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </div>
                                  )}

                                  {/* Task Items List matching screenshot */}
                                  {(topic.tasks || []).length === 0 ? (
                                    <div className="py-6 text-center text-xs text-[#94A3B8]">
                                      No subtasks created yet. Click "+" to add one.
                                    </div>
                                  ) : (
                                    (topic.tasks || []).map(task => {
                                      const isEditingThisTask = editingTaskId?.topicId === topic.id && editingTaskId?.taskId === task.id;
                                      const isMenuOpenThisTask = activeMenuTaskId === `${topic.id}-${task.id}`;

                                      return (
                                        <div
                                          key={task.id}
                                          className={`group px-5 h-[40px] flex items-center justify-between border-b border-[#F1F5F9] last:border-b-0 hover:bg-[#FAFBFD] transition-colors relative ${
                                            isMenuOpenThisTask ? 'z-[99999] bg-white' : 'z-0'
                                          }`}
                                        >
                                          <div className="flex items-center gap-3.5 min-w-0 flex-1 mr-3">
                                            <GripVertical className="w-4 h-4 text-[#94A3B8] cursor-grab shrink-0" />
                                            <div
                                              onClick={() => toggleTaskCompleted(topic.id, task.id)}
                                              className="cursor-pointer shrink-0"
                                            >
                                              {task.completed ? (
                                                <div className="w-4 h-4 bg-[#2563EB] rounded-[4px] flex items-center justify-center text-white">
                                                  <Check className="w-3 h-3 stroke-[3]" />
                                                </div>
                                              ) : (
                                                <div className="w-4 h-4 border border-[#CBD5E1] rounded-[4px] bg-white hover:border-[#2563EB]" />
                                              )}
                                            </div>

                                            {/* Inline Task Rename or Static Title */}
                                            {isEditingThisTask ? (
                                              <div className="flex items-center gap-1.5 flex-1" onClick={e => e.stopPropagation()}>
                                                <input
                                                  type="text"
                                                  value={editingTaskTitle}
                                                  onChange={e => setEditingTaskTitle(e.target.value)}
                                                  onKeyDown={e => {
                                                    if (e.key === 'Enter') {
                                                      e.preventDefault();
                                                      handleSaveRenameTask(topic.id, task.id);
                                                    } else if (e.key === 'Escape') {
                                                      e.preventDefault();
                                                      setEditingTaskId(null);
                                                    }
                                                  }}
                                                  autoFocus
                                                  className="flex-1 text-[13px] font-medium text-[#0F172A] bg-white border border-[#2563EB] rounded px-2 py-0.5 outline-none"
                                                />
                                                {/* Save Button */}
                                                <button
                                                  type="button"
                                                  onMouseDown={e => {
                                                    e.preventDefault();
                                                    handleSaveRenameTask(topic.id, task.id);
                                                  }}
                                                  className="text-[#2563EB] hover:text-[#1D4ED8] transition-colors shrink-0 cursor-pointer"
                                                  title="Save (Enter)"
                                                >
                                                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                                </button>
                                                {/* Cancel Button */}
                                                <button
                                                  type="button"
                                                  onMouseDown={e => {
                                                    e.preventDefault();
                                                    setEditingTaskId(null);
                                                  }}
                                                  className="text-slate-400 hover:text-slate-600 transition-colors shrink-0 cursor-pointer"
                                                  title="Cancel (Esc)"
                                                >
                                                  <X className="w-3.5 h-3.5" />
                                                </button>
                                              </div>
                                            ) : (
                                              <span className="text-[13px] font-normal text-[#0F172A] truncate">
                                                {task.title}
                                              </span>
                                            )}
                                          </div>

                                          {/* Task Metadata & Action matching screenshot */}
                                          <div className="flex items-center shrink-0">
                                            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#475569] mr-6">
                                              <Calendar className="w-4 h-4 text-[#64748B]" />
                                              <span>{task.date}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#475569] mr-6">
                                              <Clock className="w-4 h-4 text-[#64748B]" />
                                              <span>{task.time}</span>
                                            </div>

                                            {/* 3-Dot Dropdown Options */}
                                            <div className={`relative ${isMenuOpenThisTask ? 'z-[99999]' : 'z-10'}`}>
                                              <button
                                                onClick={e => {
                                                  e.stopPropagation();
                                                  setActiveMenuTaskId(isMenuOpenThisTask ? null : `${topic.id}-${task.id}`);
                                                }}
                                                className={`p-1 rounded-[4px] transition-colors cursor-pointer task-item-menu-btn ${
                                                  isMenuOpenThisTask ? 'bg-[#F1F5F9] text-[#0F172A]' : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
                                                }`}
                                                title="Task options"
                                              >
                                                <MoreVertical className="w-4 h-4" />
                                              </button>

                                              <AnimatePresence>
                                                {isMenuOpenThisTask && (
                                                  <motion.div
                                                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                                                    transition={{ duration: 0.12, ease: 'easeOut' }}
                                                    onClick={e => e.stopPropagation()}
                                                    className="absolute right-0 top-full mt-1 w-[185px] whitespace-nowrap bg-white border border-slate-200/90 shadow-2xl shadow-slate-900/20 backdrop-blur-md rounded-xl p-1 z-[999999] text-xs font-medium task-item-menu text-slate-700 select-none"
                                                  >
                                                    {/* 1. Rename */}
                                                    <button
                                                      onClick={() => handleStartRenameTask(topic.id, task)}
                                                      className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
                                                    >
                                                      <Pencil className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                                      <span className="truncate">Rename</span>
                                                    </button>


                                                    {/* 2. Edit (Placeholder) */}
                                                    <button
                                                      onClick={() => {
                                                        setActiveMenuTaskId(null);
                                                        showToast('Task details edit coming soon');
                                                      }}
                                                      className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
                                                    >
                                                      <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                                      <span className="truncate">Edit</span>
                                                    </button>

                                                    <div className="my-1 border-t border-slate-100" />

                                                    {/* 3. Move to Recycle Bin */}
                                                    <button
                                                      onClick={() => {
                                                        setActiveMenuTaskId(null);
                                                        setTaskToDelete({ topicId: topic.id, task });
                                                      }}
                                                      className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-red-600 hover:bg-red-50 hover:text-red-700"
                                                    >
                                                      <Trash2 className="w-3.5 h-3.5 text-red-600 shrink-0" />
                                                      <span className="truncate">Move to Recycle Bin</span>
                                                    </button>
                                                  </motion.div>
                                                )}
                                              </AnimatePresence>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                            </motion.div>
                          );
                        })}
                      </div>
                      </div>
                    )}
                    </div>
                  </div>
                )}
              </>
  );
}
