import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ActiveStudyTimerSession, formatTimerClock } from '../components/FloatingStudyTimer';
import { triggerMilestoneNotificationAndVibrate } from '../components/TopicDetailsDrawer';
import { UserSettings } from '../types';

interface UseStudyTimerProps {
  userSettings: UserSettings;
  topics: any[];
  activeWorkspaceId: string;
  onUpdateTask: (topicId: string, updatedTask: any) => void;
  showToast: (message: string) => void;
}

export function useStudyTimer({
  userSettings,
  topics,
  activeWorkspaceId,
  onUpdateTask,
  showToast,
}: UseStudyTimerProps) {
  // Safe initial timer recovery on page reload
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
  const saveTimerToStorage = useCallback(
    (
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
    },
    []
  );

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

  // Global interval ticking for live active study timer with 60s grace milestone check & auto-rewind
  useEffect(() => {
    if (!activeStudyTimer || activeStudyTimer.isPaused) return;

    if (!timerStartTimeRef.current) {
      timerStartTimeRef.current = Date.now();
    }

    const intervalSec = Math.max(
      10,
      Math.round((userSettings.focusCheckIntervalMinutes || 20) * 60)
    );

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
        setActiveStudyTimer((prev) => (prev ? { ...prev, seconds: totalSec } : null));
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
        setActiveStudyTimer((prev) => (prev ? { ...prev, seconds: totalSec } : null));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [
    activeStudyTimer?.isPaused,
    activeStudyTimer?.taskId,
    activeStudyTimer?.taskTitle,
    userSettings.focusCheckIntervalMinutes,
    userSettings.focusCheckIntervalEnabled,
    saveTimerToStorage,
  ]);

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
      triggerMilestoneNotificationAndVibrate(
        activeStudyTimer?.taskTitle || 'Study Task',
        userSettings.focusCheckIntervalMinutes || 20
      );
      chimeCount++;
    }, 6000);

    return () => clearInterval(interval);
  }, [
    isGlobalStillStudyingOpen,
    userSettings.focusCheckIntervalMinutes,
    activeStudyTimer?.taskTitle,
  ]);

  // Sync browser document title when timer is running
  useEffect(() => {
    if (activeStudyTimer) {
      const { seconds, taskTitle, isPaused } = activeStudyTimer;
      const formatted = formatTimerClock(seconds);
      const icon = isPaused ? '⏸️' : '⏱️';
      const cleanTitle =
        taskTitle && taskTitle.length > 18
          ? taskTitle.slice(0, 18) + '...'
          : taskTitle || 'Task';
      document.title = `(${icon} ${formatted} • ${cleanTitle}) Study Flow`;
    } else {
      document.title = 'Study Flow';
    }
  }, [activeStudyTimer?.seconds, activeStudyTimer?.isPaused, activeStudyTimer?.taskTitle]);

  const handleStartGlobalStudyTimer = useCallback(
    (
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
    },
    [activeWorkspaceId, saveTimerToStorage]
  );

  const handlePauseGlobalStudyTimer = useCallback(() => {
    if (!activeStudyTimer || activeStudyTimer.isPaused) return;
    const now = Date.now();
    const elapsedSinceStart = timerStartTimeRef.current
      ? Math.floor((now - timerStartTimeRef.current) / 1000)
      : 0;
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
  }, [activeStudyTimer, saveTimerToStorage]);

  const handleResumeGlobalStudyTimer = useCallback(() => {
    if (!activeStudyTimer) return;

    const now = Date.now();
    if (activeStudyTimer.isPaused) {
      timerStartTimeRef.current = now;
      const resumedSession: ActiveStudyTimerSession = {
        ...activeStudyTimer,
        isPaused: false,
      };
      setActiveStudyTimer(resumedSession);
      saveTimerToStorage(resumedSession, now, timerAccumulatedSecondsRef.current);
    }

    activeMilestonePromptRef.current = null;
    setIsGlobalStillStudyingOpen(false);
  }, [activeStudyTimer, saveTimerToStorage]);

  const handleStopAndLogGlobalStudyTimer = useCallback(
    (targetTaskId?: string) => {
      if (!activeStudyTimer) return;
      const taskIdToLog = targetTaskId || activeStudyTimer.taskId;

      let sessionSeconds = activeStudyTimer.seconds;
      if (activeMilestonePromptRef.current) {
        sessionSeconds = activeMilestonePromptRef.current.milestoneSec;
      } else if (!activeStudyTimer.isPaused && timerStartTimeRef.current) {
        const now = Date.now();
        const elapsedSinceStart = Math.floor((now - timerStartTimeRef.current) / 1000);
        sessionSeconds = timerAccumulatedSecondsRef.current + elapsedSinceStart;
      }

      const topicId = activeStudyTimer.topicId;
      const targetTopic = topics.find((t) => t.id === topicId);
      if (targetTopic) {
        const targetTask = (targetTopic.tasks || []).find((tk: any) => tk.id === taskIdToLog);
        if (targetTask) {
          const previousTotalSeconds =
            targetTask.timeSpentSeconds ?? (targetTask.timeSpentMinutes || 0) * 60;
          const newTotalSeconds = previousTotalSeconds + sessionSeconds;
          const newMinutes = Math.floor(newTotalSeconds / 60);

          const newSession = {
            id: `sess-${Date.now()}`,
            timestamp: Date.now(),
            durationSeconds: sessionSeconds,
          };

          onUpdateTask(topicId, {
            ...targetTask,
            timeSpentSeconds: newTotalSeconds,
            timeSpentMinutes: newMinutes,
            studySessions: [...(targetTask.studySessions || []), newSession],
            lastStudyDate: new Date().toISOString(),
          });

          const sessionMins = Math.floor(sessionSeconds / 60);
          const sessionSecs = sessionSeconds % 60;
          const sessionFormatted =
            sessionMins > 0
              ? sessionSecs > 0
                ? `+${sessionMins}m ${sessionSecs}s`
                : `+${sessionMins}m`
              : `+${sessionSecs}s`;

          showToast(`Study session saved for "${targetTask.title}"! ${sessionFormatted}`);
        }
      }

      timerStartTimeRef.current = null;
      timerAccumulatedSecondsRef.current = 0;
      lastGlobalMilestoneSecRef.current = 0;
      activeMilestonePromptRef.current = null;
      setIsGlobalStillStudyingOpen(false);
      setActiveStudyTimer(null);
      saveTimerToStorage(null, null, 0);
    },
    [activeStudyTimer, onUpdateTask, saveTimerToStorage, showToast, topics]
  );

  return {
    activeStudyTimer,
    setActiveStudyTimer,
    isGlobalStillStudyingOpen,
    setIsGlobalStillStudyingOpen,
    handleStartGlobalStudyTimer,
    handlePauseGlobalStudyTimer,
    handleResumeGlobalStudyTimer,
    handleStopAndLogGlobalStudyTimer,
  };
}
