import { useState, useEffect, useMemo, useCallback } from 'react';
import { NotificationItem, ToastData } from '../types';

interface UseToastAndNotificationsOptions {
  onPlayNotificationChime?: () => void;
}

export function useToastAndNotifications(options?: UseToastAndNotificationsOptions) {
  const [toastData, setToastData] = useState<ToastData | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => [
    {
      id: 'notif-1',
      title: 'Welcome to StudyFlow Workspace!',
      time: 'Just now',
      read: false,
      type: 'system',
      description: 'Your focus dashboard and topic tracker are active.',
    },
    {
      id: 'notif-2',
      title: 'Focus Check-in Timer Ready ⏱️',
      time: '5m ago',
      read: false,
      type: 'focus',
      description: 'Interval milestone alerts will keep your study sessions sharp.',
    },
  ]);

  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState<boolean>(false);
  const [notifFilter, setNotifFilter] = useState<'all' | 'focus' | 'reminders'>('all');
  const [deviceNotifStatus, setDeviceNotifStatus] = useState<string>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });

  const showToast = useCallback((message: string, undoAction?: () => void, duration?: number) => {
    const effectiveDuration = duration !== undefined ? duration : undoAction ? 6000 : 3500;
    setToastData({ message, undoAction, duration: effectiveDuration });

    const now = new Date();
    const formattedTime = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const isStudy = /study|timer|focus|milestone|session|check-in/i.test(message);
    const isReminder = /due|overdue|deadline|date|recycle/i.test(message);

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: message,
      time: formattedTime,
      read: false,
      type: isStudy ? 'focus' : isReminder ? 'reminders' : 'system',
    };

    setNotifications((prev) => [newNotif, ...prev]);
  }, []);

  useEffect(() => {
    if (!toastData) return;
    const timer = setTimeout(() => {
      setToastData(null);
    }, toastData.duration || 6000);
    return () => clearTimeout(timer);
  }, [toastData]);

  const unreadNotifCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const handleToggleDeviceNotifications = useCallback(async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      showToast('⚠️ Notifications not supported on this browser.');
      return;
    }

    if (
      window.isSecureContext === false &&
      window.location.hostname !== 'localhost' &&
      window.location.hostname !== '127.0.0.1'
    ) {
      showToast('⚠️ Mobile browsers require HTTPS. Please open with https://192.168.0.202:3000');
      return;
    }

    if (Notification.permission === 'granted') {
      try {
        if (options?.onPlayNotificationChime) {
          options.onPlayNotificationChime();
        }
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          navigator.vibrate([200, 100, 200]);
        }

        if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
          try {
            const reg = await navigator.serviceWorker.ready;
            await reg.showNotification('🔔 StudyFlow Notifications Active', {
              body: 'You will receive study focus milestones & task alerts on this device!',
              icon: '/favicon.ico',
              tag: 'studyflow-test',
            });
            showToast('Test notification sent to your device! 🔔');
            return;
          } catch {}
        }
        new Notification('🔔 StudyFlow Notifications Active', {
          body: 'You will receive study focus milestones & task alerts on this device!',
          icon: '/favicon.ico',
          tag: 'studyflow-test',
        });
        showToast('Test notification sent to your device! 🔔');
      } catch {
        if (options?.onPlayNotificationChime) {
          options.onPlayNotificationChime();
        }
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
                  tag: 'studyflow-welcome',
                });
              } catch {
                new Notification('🚀 Notifications Enabled!', {
                  body: 'Welcome to StudyFlow Push Alerts. Stay focused!',
                  icon: '/favicon.ico',
                  tag: 'studyflow-welcome',
                });
              }
            } else {
              new Notification('🚀 Notifications Enabled!', {
                body: 'Welcome to StudyFlow Push Alerts. Stay focused!',
                icon: '/favicon.ico',
                tag: 'studyflow-welcome',
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
  }, [options, showToast]);

  return {
    toastData,
    setToastData,
    notifications,
    setNotifications,
    unreadNotifCount,
    isNotificationPanelOpen,
    setIsNotificationPanelOpen,
    notifFilter,
    setNotifFilter,
    deviceNotifStatus,
    setDeviceNotifStatus,
    showToast,
    handleToggleDeviceNotifications,
  };
}
