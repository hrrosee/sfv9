// Utility helper for 100% accurate local timezone date strings (fixes 1-day-less UTC bug)
export function getLocalDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDisplayDueDate(dueDateStr?: string): string {
  if (!dueDateStr) return 'Set Date';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dueDateStr)) {
    const [year, month, day] = dueDateStr.split('-').map(Number);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[month - 1]} ${day}, ${year}`;
  }
  return dueDateStr;
}

export function getDueDateStatus(dueDateStr?: string): { label: string; color: string; isOverdue: boolean } | null {
  if (!dueDateStr) return null;
  let targetDate: Date | null = null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dueDateStr)) {
    const [y, m, d] = dueDateStr.split('-').map(Number);
    targetDate = new Date(y, m - 1, d);
  } else {
    const parsed = Date.parse(dueDateStr);
    if (!isNaN(parsed)) targetDate = new Date(parsed);
  }
  if (!targetDate) return null;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const lateDays = Math.abs(diffDays);
    return {
      label: lateDays === 1 ? 'Overdue (1d)' : `Overdue (${lateDays}d)`,
      color: 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/60',
      isOverdue: true
    };
  } else if (diffDays === 0) {
    return {
      label: 'Today',
      color: 'bg-blue-100 dark:bg-blue-950/60 text-[#176BFF] dark:text-blue-400 border-blue-200 dark:border-blue-900/60',
      isOverdue: false
    };
  } else if (diffDays === 1) {
    return {
      label: 'Tomorrow',
      color: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/60',
      isOverdue: false
    };
  } else if (diffDays <= 7) {
    return {
      label: `In ${diffDays}d`,
      color: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60',
      isOverdue: false
    };
  } else {
    return {
      label: formatDisplayDueDate(dueDateStr),
      color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
      isOverdue: false
    };
  }
}
