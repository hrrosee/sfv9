import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { loadStreakData, recordDailyGoalAchieved, StreakData } from '../utils/streakManager';
import { getLocalDateString } from '../utils/dateUtils';
import { UserSettings } from '../types';

interface UseStreakTrackerProps {
  workspaces: any[];
  topics: any[];
  userSettings: UserSettings;
  setUserSettings: React.Dispatch<React.SetStateAction<UserSettings>>;
}

export function useStreakTracker({
  workspaces,
  topics,
  userSettings,
  setUserSettings,
}: UseStreakTrackerProps) {
  const [isGoalPopoverOpen, setIsGoalPopoverOpen] = useState<boolean>(false);
  const [isStreakPopoverOpen, setIsStreakPopoverOpen] = useState<boolean>(false);
  const [isGoalCelebrationOpen, setIsGoalCelebrationOpen] = useState<boolean>(false);
  const [streakData, setStreakData] = useState<StreakData>(() => loadStreakData());
  const [latestMilestoneInfo, setLatestMilestoneInfo] = useState<{
    isMilestone: boolean;
    title?: string;
    icon?: string;
  }>({ isMilestone: false });
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

  // Calculate statistics across workspaces for Today's Goal
  const workspacesStats = useMemo(() => {
    const todayStr = new Date().toDateString();

    return workspaces.map((w) => {
      const wsTopics = topics.filter((t) => t.workspaceId === w.id && !t.isDeleted);
      let completedTodayCount = 0;
      let totalCount = 0;
      let timeMinutes = 0;
      const todayTasks: any[] = [];

      wsTopics.forEach((topic) => {
        (topic.tasks || []).forEach((task: any) => {
          totalCount++;

          const isCompletedToday =
            task.completed && task.completedAt && new Date(task.completedAt).toDateString() === todayStr;

          if (isCompletedToday) {
            completedTodayCount++;
          }

          let taskTodayMinutes = 0;
          (task.studySessions || []).forEach((sess: any) => {
            if (sess.timestamp && new Date(sess.timestamp).toDateString() === todayStr) {
              taskTodayMinutes += Math.floor((sess.durationSeconds || 0) / 60);
            }
          });

          if (taskTodayMinutes === 0 && task.lastStudyDate && new Date(task.lastStudyDate).toDateString() === todayStr) {
            taskTodayMinutes = task.timeSpentMinutes || 0;
          }

          timeMinutes += taskTodayMinutes;

          if (isCompletedToday || taskTodayMinutes > 0) {
            todayTasks.push({
              taskId: task.id,
              taskTitle: task.title,
              topicId: topic.id,
              topicTitle: topic.name,
              workspaceId: w.id,
              completed: task.completed,
              timeSpentMinutes: taskTodayMinutes,
              completedAt: task.completedAt,
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

  const currentGoalValue =
    dailyGoalMode === 'time' ? globalTotalStudyMinutesToday : globalCompletedTasksToday;
  const targetGoalValue = dailyGoalMode === 'time' ? dailyTimeTargetMinutes : dailyTarget;
  const dailyGoalPercent =
    targetGoalValue > 0 ? Math.min(100, Math.round((currentGoalValue / targetGoalValue) * 100)) : 0;

  const isDailyGoalAchieved = targetGoalValue > 0 && currentGoalValue >= targetGoalValue;

  // Track Daily Goal Achievement & trigger celebration modal + streak update
  useEffect(() => {
    const todayStr = getLocalDateString();
    const alreadyCelebratedToday =
      localStorage.getItem('studyflow_goal_celebration_shown_date') === todayStr;

    if (isDailyGoalAchieved && !previousGoalAchievedRef.current) {
      const result = recordDailyGoalAchieved();
      setStreakData(loadStreakData());

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

  const handleUpdateDailyGoalMode = useCallback(
    (mode: 'tasks' | 'time') => {
      const updated = { ...userSettings, dailyGoalMode: mode };
      setUserSettings(updated);
      localStorage.setItem('studyflow_user_settings', JSON.stringify(updated));
    },
    [setUserSettings, userSettings]
  );

  const handleUpdateTaskTarget = useCallback(
    (newTarget: number) => {
      const updated = { ...userSettings, dailyTarget: newTarget };
      setUserSettings(updated);
      localStorage.setItem('studyflow_user_settings', JSON.stringify(updated));
    },
    [setUserSettings, userSettings]
  );

  const handleUpdateTimeTarget = useCallback(
    (newMinutes: number) => {
      const updated = { ...userSettings, dailyTimeTargetMinutes: newMinutes };
      setUserSettings(updated);
      localStorage.setItem('studyflow_user_settings', JSON.stringify(updated));
    },
    [setUserSettings, userSettings]
  );

  return {
    streakData,
    setStreakData,
    isStreakPopoverOpen,
    setIsStreakPopoverOpen,
    isGoalPopoverOpen,
    setIsGoalPopoverOpen,
    isGoalCelebrationOpen,
    setIsGoalCelebrationOpen,
    latestMilestoneInfo,
    setLatestMilestoneInfo,
    workspacesStats,
    globalCompletedTasksToday,
    globalTotalStudyMinutesToday,
    dailyGoalMode,
    dailyTarget,
    dailyTimeTargetMinutes,
    currentGoalValue,
    targetGoalValue,
    dailyGoalPercent,
    isDailyGoalAchieved,
    handleUpdateDailyGoalMode,
    handleUpdateTaskTarget,
    handleUpdateTimeTarget,
  };
}
