import { useState, useEffect, useCallback } from 'react';

export type AppViewRoute = 'workspace' | 'notes' | 'tasks' | 'trash' | 'search' | 'analytics';

export function getInitialActiveView(): AppViewRoute {
  try {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase().replace(/\/$/, '');
      if (path === '/notes') return 'notes';
      if (path === '/tasks') return 'tasks';
      if (path === '/trash' || path === '/recycle-bin') return 'trash';
      if (path === '/search') return 'search';
      if (path === '/analytics') return 'analytics';
      if (path === '' || path === '/workspace' || path === '/dashboard') return 'workspace';
    }
    const saved = localStorage.getItem('studyflow_active_view');
    if (!saved) return 'workspace';
    try {
      const parsed = JSON.parse(saved);
      if (
        typeof parsed === 'string' &&
        ['workspace', 'notes', 'tasks', 'trash', 'search', 'analytics'].includes(parsed)
      ) {
        return parsed as AppViewRoute;
      }
    } catch {}
    if (['workspace', 'notes', 'tasks', 'trash', 'search', 'analytics'].includes(saved)) {
      return saved as AppViewRoute;
    }
    return 'workspace';
  } catch {
    return 'workspace';
  }
}

export function useViewRouter() {
  const initialActiveView = getInitialActiveView();

  const [isSearchPageOpen, setIsSearchPageOpen] = useState<boolean>(
    () => initialActiveView === 'search'
  );
  const [isTasksPageOpen, setIsTasksPageOpen] = useState<boolean>(
    () => initialActiveView === 'tasks'
  );
  const [isNotesPageOpen, setIsNotesPageOpen] = useState<boolean>(
    () => initialActiveView === 'notes'
  );
  const [isRecycleBinOpen, setIsRecycleBinOpen] = useState<boolean>(
    () => initialActiveView === 'trash'
  );
  const [isAnalyticsPageOpen, setIsAnalyticsPageOpen] = useState<boolean>(
    () => initialActiveView === 'analytics'
  );

  // Track and persist active view route to URL and localStorage
  useEffect(() => {
    let currentView: AppViewRoute = 'workspace';
    if (isTasksPageOpen) currentView = 'tasks';
    else if (isNotesPageOpen) currentView = 'notes';
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
  }, [
    isTasksPageOpen,
    isNotesPageOpen,
    isRecycleBinOpen,
    isSearchPageOpen,
    isAnalyticsPageOpen,
  ]);

  // Handle Browser Back and Forward Button navigation (popstate event)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase().replace(/\/$/, '');
      setIsTasksPageOpen(path === '/tasks');
      setIsNotesPageOpen(path === '/notes');
      setIsRecycleBinOpen(path === '/trash' || path === '/recycle-bin');
      setIsSearchPageOpen(path === '/search');
      setIsAnalyticsPageOpen(path === '/analytics');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const closeAllViews = useCallback(() => {
    setIsSearchPageOpen(false);
    setIsTasksPageOpen(false);
    setIsNotesPageOpen(false);
    setIsRecycleBinOpen(false);
    setIsAnalyticsPageOpen(false);
  }, []);

  const navigateToView = useCallback(
    (view: AppViewRoute) => {
      closeAllViews();
      if (view === 'tasks') setIsTasksPageOpen(true);
      else if (view === 'notes') setIsNotesPageOpen(true);
      else if (view === 'trash') setIsRecycleBinOpen(true);
      else if (view === 'search') setIsSearchPageOpen(true);
      else if (view === 'analytics') setIsAnalyticsPageOpen(true);
    },
    [closeAllViews]
  );

  return {
    isSearchPageOpen,
    setIsSearchPageOpen,
    isTasksPageOpen,
    setIsTasksPageOpen,
    isNotesPageOpen,
    setIsNotesPageOpen,
    isRecycleBinOpen,
    setIsRecycleBinOpen,
    isAnalyticsPageOpen,
    setIsAnalyticsPageOpen,
    closeAllViews,
    navigateToView,
  };
}
