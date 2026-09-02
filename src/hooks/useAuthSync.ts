import { useState, useEffect, useRef, useCallback } from 'react';
import { auth, onAuthStateChanged, logoutUser, User as FirebaseUser } from '../firebase';
import {
  fetchUserDataFromCloud,
  saveUserDataToCloud,
  subscribeToCloudData,
} from '../utils/firestoreSync';
import { getInitialTheme } from '../utils/themeManager';

interface UseAuthSyncProps {
  workspaces: any[];
  setWorkspaces: React.Dispatch<React.SetStateAction<any[]>>;
  workspaceSections: any[];
  setWorkspaceSections: React.Dispatch<React.SetStateAction<any[]>>;
  activeWorkspaceId: string;
  setActiveWorkspaceId: React.Dispatch<React.SetStateAction<string>>;
  topics: any[];
  setTopics: React.Dispatch<React.SetStateAction<any[]>>;
  deletedTopics: any[];
  setDeletedTopics: React.Dispatch<React.SetStateAction<any[]>>;
  deletedWorkspaces: any[];
  setDeletedWorkspaces: React.Dispatch<React.SetStateAction<any[]>>;
  deletedNotes: any[];
  setDeletedNotes: React.Dispatch<React.SetStateAction<any[]>>;
  deletedSections: any[];
  setDeletedSections: React.Dispatch<React.SetStateAction<any[]>>;
  deletedTasks: any[];
  setDeletedTasks: React.Dispatch<React.SetStateAction<any[]>>;
  deletedTopicNotes: any[];
  setDeletedTopicNotes: React.Dispatch<React.SetStateAction<any[]>>;
  deletedTopicLinks: any[];
  setDeletedTopicLinks: React.Dispatch<React.SetStateAction<any[]>>;
  notes: any[];
  setNotes: React.Dispatch<React.SetStateAction<any[]>>;
  standaloneTasks: any[];
  setStandaloneTasks: React.Dispatch<React.SetStateAction<any[]>>;
  userSettings: any;
  setUserSettings: React.Dispatch<React.SetStateAction<any>>;
  showToast: (message: string) => void;
}

export function useAuthSync({
  workspaces,
  setWorkspaces,
  workspaceSections,
  setWorkspaceSections,
  activeWorkspaceId: _activeWorkspaceId,
  setActiveWorkspaceId,
  topics,
  setTopics,
  deletedTopics,
  setDeletedTopics,
  deletedWorkspaces,
  setDeletedWorkspaces,
  deletedNotes,
  setDeletedNotes,
  deletedSections,
  setDeletedSections,
  deletedTasks,
  setDeletedTasks,
  deletedTopicNotes,
  setDeletedTopicNotes,
  deletedTopicLinks,
  setDeletedTopicLinks,
  notes,
  setNotes,
  standaloneTasks,
  setStandaloneTasks,
  userSettings,
  setUserSettings,
  showToast,
}: UseAuthSyncProps) {
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

  // Flags for sync loopback prevention
  const isCloudApplyingRef = useRef<boolean>(false);
  const isInitialSyncCompleteRef = useRef<boolean>(false);
  const latestDataRef = useRef<any>({});

  // Listen to Firebase Auth State Changes & Persist Cached Profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthChecking(false);
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
  const handleChangePassword = useCallback(() => {
    setProfileMenuTarget(null);
    setIsChangePasswordOpen(true);
  }, []);

  const handleSwitchAccount = useCallback(() => {
    setProfileMenuTarget(null);
    setIsAuthModalOpen(true);
  }, []);

  const handleSignOut = useCallback(async () => {
    setProfileMenuTarget(null);
    await logoutUser();
    showToast('Signed out successfully.');
  }, [showToast]);

  // Initial Cloud Data Load & Real-Time Sync on User Login
  useEffect(() => {
    if (!currentUser) {
      isInitialSyncCompleteRef.current = false;
      return;
    }

    let isMounted = true;
    isInitialSyncCompleteRef.current = false;

    const syncInitial = async () => {
      try {
        const cloudData = await fetchUserDataFromCloud(currentUser.uid);
        if (!isMounted) return;

        if (
          cloudData &&
          (cloudData.workspaces?.length || cloudData.topics?.length || cloudData.notes?.length)
        ) {
          isCloudApplyingRef.current = true;
          if (cloudData.workspaces) setWorkspaces(cloudData.workspaces);
          if (cloudData.workspaceSections) setWorkspaceSections(cloudData.workspaceSections);
          if (cloudData.activeWorkspaceId) setActiveWorkspaceId(cloudData.activeWorkspaceId);
          if (cloudData.topics) {
            setTopics((prev) => {
              const cloudTopicIds = new Set((cloudData.topics || []).map((t: any) => t.id));
              const localOnlyTopics = prev.filter((t) => !cloudTopicIds.has(t.id));
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
          if (cloudData.notes) {
            setNotes((prev) => {
              const cloudNoteIds = new Set((cloudData.notes || []).map((n: any) => n.id));
              const localOnlyNotes = prev.filter((n) => !cloudNoteIds.has(n.id));
              return [...(cloudData.notes || []), ...localOnlyNotes];
            });
          }
          if (cloudData.standaloneTasks) {
            setStandaloneTasks(cloudData.standaloneTasks);
          }
          if (cloudData.userSettings) {
            setUserSettings((prev: any) => {
              const { theme: _cloudTheme, primaryColor: _cloudPrimaryColor, ...restCloudSettings } = cloudData.userSettings as any;
              return {
                ...prev,
                ...restCloudSettings,
                theme: prev.theme || getInitialTheme(),
                primaryColor: prev.primaryColor || _cloudPrimaryColor || getInitialAccentColor(),
              };
            });
          }
          setTimeout(() => {
            isCloudApplyingRef.current = false;
            isInitialSyncCompleteRef.current = true;
          }, 500);
        } else {
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
            notes,
            standaloneTasks,
            userSettings,
          });
          isInitialSyncCompleteRef.current = true;
        }
      } catch (err) {
        console.error('Initial cloud sync error:', err);
        isInitialSyncCompleteRef.current = true;
      }
    };

    syncInitial();

    const unsubscribe = subscribeToCloudData(currentUser.uid, (cloudData) => {
      if (isCloudApplyingRef.current) return;
      if (cloudData) {
        isCloudApplyingRef.current = true;
        if (cloudData.workspaces) {
          setWorkspaces(cloudData.workspaces);
          setActiveWorkspaceId((prev) => {
            const exists = (cloudData.workspaces || []).some((ws: any) => ws.id === prev);
            return exists
              ? prev
              : cloudData.workspaces && cloudData.workspaces.length > 0
              ? cloudData.workspaces[0].id
              : prev;
          });
        }
        if (cloudData.workspaceSections) setWorkspaceSections(cloudData.workspaceSections);
        if (cloudData.topics) {
          setTopics((prev) => {
            const cloudTopicIds = new Set((cloudData.topics || []).map((t: any) => t.id));
            const localOnlyTopics = prev.filter((t) => !cloudTopicIds.has(t.id));
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
        if (cloudData.notes) {
          setNotes((prev) => {
            const cloudNoteIds = new Set((cloudData.notes || []).map((n: any) => n.id));
            const localOnlyNotes = prev.filter((n) => !cloudNoteIds.has(n.id));
            return [...(cloudData.notes || []), ...localOnlyNotes];
          });
        }
        if (cloudData.standaloneTasks) {
          setStandaloneTasks(cloudData.standaloneTasks);
        }
        if (cloudData.userSettings) {
          setUserSettings((prev: any) => {
            const { theme: _cloudTheme, primaryColor: _cloudPrimaryColor, ...restCloudSettings } = cloudData.userSettings as any;
            return {
              ...prev,
              ...restCloudSettings,
              theme: prev.theme || getInitialTheme(),
              primaryColor: prev.primaryColor || _cloudPrimaryColor || getInitialAccentColor(),
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

  // Keep a live ref to the latest state for instant flush
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
      notes,
      standaloneTasks,
      userSettings,
    };
  }, [
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
    notes,
    standaloneTasks,
    userSettings,
  ]);

  // Immediate flush save on beforeunload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentUser && isInitialSyncCompleteRef.current && !isCloudApplyingRef.current) {
        saveUserDataToCloud(currentUser.uid, latestDataRef.current);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentUser]);

  // Immediate Real-Time Cloud Auto-Save on any local data changes
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
      notes,
      standaloneTasks,
      userSettings,
    };
    latestDataRef.current = payload;
    saveUserDataToCloud(currentUser.uid, payload);
  }, [
    currentUser,
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
    notes,
    standaloneTasks,
    userSettings,
  ]);

  // Online / Offline Network Status Tracking
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showToast('Back online! Syncing changes with cloud... ☁️');
    };
    const handleOffline = () => {
      setIsOnline(false);
      showToast('Offline mode active. Changes saved locally.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showToast]);

  return {
    currentUser,
    setCurrentUser,
    isAuthChecking,
    setIsAuthChecking,
    isAuthModalOpen,
    setIsAuthModalOpen,
    profileMenuTarget,
    setProfileMenuTarget,
    isEditProfileOpen,
    setIsEditProfileOpen,
    isChangePasswordOpen,
    setIsChangePasswordOpen,
    isOnline,
    handleChangePassword,
    handleSwitchAccount,
    handleSignOut,
  };
}
