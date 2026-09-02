import React from 'react';
import {
  BookOpen,
  Folder,
  Target,
  Flame,
} from 'lucide-react';
import { TodaysGoalPopover, WorkspaceGoalStat, formatGoalDuration } from './TodaysGoalPopover';
import { StreakPopover } from './StreakPopover';

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

export interface WorkspaceMetricsBannerProps {
  workspaceProgressPercent: number;
  completedWorkspaceTasks: number;
  totalWorkspaceTasks: number;
  sectionProgressPercent: number;
  completedSectionTasks: number;
  totalSectionTasks: number;
  activeSection: string;
  isGoalPopoverOpen: boolean;
  setIsGoalPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dailyGoalMode: 'time' | 'tasks';
  handleUpdateDailyGoalMode: (mode: 'time' | 'tasks') => void;
  dailyGoalPercent: number;
  globalTotalStudyMinutesToday: number;
  dailyTimeTargetMinutes: number;
  globalCompletedTasksToday: number;
  dailyTarget: number;
  targetGoalValue: number;
  currentGoalValue: number;
  handleUpdateTaskTarget: (val: number) => void;
  handleUpdateDailyTimeTarget: (val: number) => void;
  workspacesStats: WorkspaceGoalStat[];
  activeWorkspaceId: string;
  setActiveWorkspaceId: (id: string) => void;
  handleNavigateToGoalTask: (topicId: string, taskId: string, wsId?: string) => void;
  streakData: { currentStreak: number; bestStreak: number };
  isStreakPopoverOpen: boolean;
  setIsStreakPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setStreakData: React.Dispatch<React.SetStateAction<{ currentStreak: number; bestStreak: number }>>;
  isDailyGoalAchieved: boolean;
}

export function WorkspaceMetricsBanner({
  workspaceProgressPercent,
  completedWorkspaceTasks,
  totalWorkspaceTasks,
  sectionProgressPercent,
  completedSectionTasks,
  totalSectionTasks,
  activeSection,
  isGoalPopoverOpen,
  setIsGoalPopoverOpen,
  dailyGoalMode,
  handleUpdateDailyGoalMode,
  dailyGoalPercent,
  globalTotalStudyMinutesToday,
  dailyTimeTargetMinutes,
  globalCompletedTasksToday,
  dailyTarget,
  targetGoalValue,
  currentGoalValue,
  handleUpdateTaskTarget,
  handleUpdateDailyTimeTarget,
  workspacesStats,
  activeWorkspaceId,
  setActiveWorkspaceId,
  handleNavigateToGoalTask,
  streakData,
  isStreakPopoverOpen,
  setIsStreakPopoverOpen,
  setStreakData,
  isDailyGoalAchieved,
}: WorkspaceMetricsBannerProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {/* Metric 1: Workspace Progress (Dynamic Accent Color) */}
      <div className="p-3.5 bg-white/70 dark:bg-[#090D16]/70 backdrop-blur-xl border border-slate-200/70 dark:border-white/[0.06] rounded-[8px] flex items-center gap-3 shadow-sm shadow-slate-900/5 hover:shadow-md dark:hover:border-white/15 hover:-translate-y-0.5 group">
        <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-[6px] flex items-center justify-center shrink-0 shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
          <BookOpen className="w-5 h-5 stroke-[2.2] text-white" />
        </div>
        <div className="flex-1 flex flex-col gap-1 min-w-0">
          <span className="text-xs font-bold text-[#0F172A] dark:text-slate-100 truncate">
            Workspace Progress
          </span>
          <div className="flex items-center justify-between text-xs font-bold gap-2">
            <div className="w-full bg-slate-100/90 dark:bg-slate-800/80 h-2 rounded-full overflow-hidden">
              <div
                style={{ 
                  width: `${workspaceProgressPercent}%`,
                  background: 'linear-gradient(to right, var(--primary-grad-start), var(--primary-grad-end))'
                }}
                className="h-full rounded-full transition-[width] duration-300 ease-in-out"
              />
            </div>
            <span 
              style={{ color: 'var(--primary)' }}
              className="font-bold shrink-0"
            >
              {workspaceProgressPercent}%
            </span>
          </div>
          <span className="text-[11px] font-medium text-[#94A3B8] dark:text-slate-400 truncate">
            <AnimatedNumber value={completedWorkspaceTasks} /> / <AnimatedNumber value={totalWorkspaceTasks} /> Tasks Completed
          </span>
        </div>
      </div>

      {/* Metric 2: Section Progress */}
      <div className="p-3.5 bg-white/70 dark:bg-[#090D16]/70 backdrop-blur-xl border border-slate-200/70 dark:border-white/[0.06] rounded-[8px] flex items-center gap-3 shadow-sm shadow-slate-900/5 hover:shadow-md hover:border-purple-300 dark:hover:border-white/15 hover:-translate-y-0.5 group">
        <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-indigo-600 text-white rounded-[6px] flex items-center justify-center shrink-0 shadow-md shadow-purple-500/25 group-hover:scale-105 transition-transform">
          <Folder className="w-5 h-5 stroke-[2.2] text-white" />
        </div>
        <div className="flex-1 flex flex-col gap-1 min-w-0">
          <span className="text-xs font-bold text-[#0F172A] dark:text-slate-100 truncate">
            Section Progress
          </span>
          <div className="flex items-center justify-between text-xs font-bold gap-2">
            <div className="w-full bg-slate-100/90 dark:bg-slate-800/80 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#7C36F5] via-[#9333EA] to-[#C084FC] h-full rounded-full transition-[width] duration-300 ease-in-out"
                style={{ width: `${sectionProgressPercent}%` }}
              />
            </div>
            <span className="text-[#9333EA] dark:text-purple-400 font-bold shrink-0">
              {sectionProgressPercent}%
            </span>
          </div>
          <span className="text-[11px] font-medium text-[#94A3B8] dark:text-slate-400 truncate">
            <AnimatedNumber value={completedSectionTasks} /> / <AnimatedNumber value={totalSectionTasks} /> Tasks ({activeSection})
          </span>
        </div>
      </div>

      {/* Metric 3: Today's Goal (Interactive Popover Trigger) */}
      <div className="relative">
        <div
          data-goal-card="true"
          onClick={() => setIsGoalPopoverOpen((prev) => !prev)}
          className="p-3.5 bg-white/70 dark:bg-[#090D16]/70 backdrop-blur-xl border border-slate-200/70 dark:border-white/[0.06] rounded-[8px] flex items-center gap-3 shadow-sm shadow-slate-900/5 hover:shadow-md hover:border-emerald-300 dark:hover:border-white/15 hover:-translate-y-0.5 cursor-pointer select-none group"
          title="Click to view Today's Goal breakdown & settings"
        >
          <div className="w-10 h-10 bg-gradient-to-tr from-emerald-600 to-teal-600 text-white rounded-[6px] flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/25 group-hover:scale-105 transition-transform">
            <Target className="w-5 h-5 stroke-[2.4] text-white" />
          </div>
          <div className="flex-1 flex flex-col gap-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs font-bold text-[#0F172A] dark:text-slate-100 truncate">
                Today's Goal
              </span>
              <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-slate-100/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-white/5 shrink-0">
                {dailyGoalMode === 'time' ? '⏱️ Time' : '🎯 Tasks'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs font-bold gap-2">
              <div className="w-full bg-slate-100/90 dark:bg-slate-800/80 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#059669] via-[#10B981] to-[#34D399] h-full rounded-full transition-[width] duration-300 ease-in-out"
                  style={{ width: `${dailyGoalPercent}%` }}
                />
              </div>
              <span className="text-[#10B981] dark:text-emerald-400 font-bold shrink-0">
                {dailyGoalPercent}%
              </span>
            </div>
            <div className="flex items-center justify-between gap-1 text-[11px] font-medium text-[#94A3B8] dark:text-slate-400 truncate">
              <span className="truncate">
                {dailyGoalMode === 'time' ? (
                  `${formatGoalDuration(globalTotalStudyMinutesToday)} / ${formatGoalDuration(dailyTimeTargetMinutes)}`
                ) : (
                  <>
                    <AnimatedNumber value={globalCompletedTasksToday} /> / {dailyTarget} Tasks
                  </>
                )}
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold shrink-0">
                {dailyGoalPercent >= 100 ? 'Achieved 🏆' : `${Math.max(0, targetGoalValue - currentGoalValue)} left`}
              </span>
            </div>
          </div>
        </div>

        <TodaysGoalPopover
          isOpen={isGoalPopoverOpen}
          onClose={() => setIsGoalPopoverOpen(false)}
          currentMode={dailyGoalMode}
          onToggleMode={handleUpdateDailyGoalMode}
          completedTasksToday={globalCompletedTasksToday}
          dailyTaskTarget={dailyTarget}
          onUpdateTaskTarget={handleUpdateTaskTarget}
          totalStudyMinutesToday={globalTotalStudyMinutesToday}
          dailyTimeTargetMinutes={dailyTimeTargetMinutes}
          onUpdateDailyTimeTarget={handleUpdateDailyTimeTarget}
          workspacesStats={workspacesStats}
          activeWorkspaceId={activeWorkspaceId}
          onSelectWorkspace={(wsId) => setActiveWorkspaceId(wsId)}
          onNavigateToTask={handleNavigateToGoalTask}
          streakDays={streakData.currentStreak}
        />
      </div>

      {/* Metric 4: Streak (Interactive Popover Trigger) */}
      <div className="relative">
        <div
          data-streak-card="true"
          onClick={() => setIsStreakPopoverOpen((prev) => !prev)}
          title="Click to view Streak Dashboard & Freezes"
          className="p-3.5 bg-white/70 dark:bg-[#090D16]/70 backdrop-blur-xl border border-slate-200/70 dark:border-white/[0.06] rounded-[8px] flex items-center gap-3 shadow-sm shadow-slate-900/5 hover:shadow-md hover:border-orange-300 dark:hover:border-white/15 hover:-translate-y-0.5 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 bg-gradient-to-tr from-amber-500 to-orange-600 text-white rounded-[6px] flex items-center justify-center shrink-0 shadow-md shadow-orange-500/25 group-hover:scale-105 transition-transform">
            <Flame className="w-5 h-5 fill-white" />
          </div>
          <div className="flex-1 flex flex-col gap-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs font-bold text-[#0F172A] dark:text-slate-100 truncate">Streak</span>
              <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-orange-50/90 dark:bg-orange-950/40 text-[#EA580C] dark:text-orange-400 border border-orange-200/80 dark:border-orange-800/40 shrink-0">
                {streakData.currentStreak > 0 ? '🔥 Active' : '⚡ Inactive'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs font-bold gap-2">
              <div className="w-full bg-slate-100/90 dark:bg-slate-800/80 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#EA580C] via-[#F97316] to-[#FDBA74] h-full rounded-full transition-[width] duration-300 ease-in-out"
                  style={{
                    width: `${
                      streakData.currentStreak > 0
                        ? Math.min(100, Math.max(15, ((streakData.currentStreak % 7 || 7) / 7) * 100))
                        : 0
                    }%`,
                  }}
                />
              </div>
              <span className="text-[#EA580C] dark:text-orange-400 font-bold shrink-0 text-xs">
                {streakData.currentStreak} {streakData.currentStreak === 1 ? 'Day' : 'Days'}
              </span>
            </div>
            <div className="flex items-center justify-between gap-1 text-[11px] font-medium text-[#94A3B8] dark:text-slate-400 truncate">
              <span className="truncate">
                {streakData.currentStreak > 0 ? 'Keep it up! 🔥' : 'Start your streak! ⚡'}
              </span>
              {streakData.bestStreak > 0 && (
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold shrink-0">
                  Best: {streakData.bestStreak}d
                </span>
              )}
            </div>
          </div>
        </div>

        <StreakPopover
          isOpen={isStreakPopoverOpen}
          onClose={() => setIsStreakPopoverOpen(false)}
          streakData={streakData}
          onStreakUpdate={(updated) => setStreakData(updated)}
          isTodayGoalAchieved={isDailyGoalAchieved}
        />
      </div>
    </div>
  );
}
