export interface Workspace {
  id: string;
  name: string;
  isStarred?: boolean;
  createdAt: string;
}

export interface Section {
  id: string;
  workspaceId: string;
  name: string;
}

export interface Topic {
  id: string;
  sectionId: string;
  workspaceId: string;
  name: string;
  isCollapsed?: boolean;
  createdAt?: string;
}

export interface Task {
  id: string;
  topicId: string;
  sectionId: string;
  workspaceId: string;
  title: string;
  completed: boolean;
  createdDate: string; // e.g., "21/07/2026"
  createdTime: string; // e.g., "10:46 PM"
  completedAt?: string; // ISO string when toggled complete
  priority?: 'high' | 'medium' | 'low' | 'none';
}

export interface StandaloneTask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

export type DeletedItemType = 'workspace' | 'section' | 'topic' | 'task' | 'circular';

export type JobCategory = 'govt' | 'bank';
export type JobStage = 'not_applied' | 'applied' | 'prelim' | 'written' | 'viva' | 'selected';

export interface JobAttachment {
  id: string;
  type: 'circular' | 'applicant_copy' | 'admit_card' | 'other';
  name: string;
  url: string;
  fileSize?: string;
  status?: 'uploading' | 'ready' | 'error';
  progress?: number;
  uploadedAt?: number;
}

export interface JobCircularItem {
  id: string;
  category: JobCategory;
  jobTitle: string;
  organization: string;
  grade?: string;
  scale?: string;
  jobType?: 'permanent' | 'contractual' | 'deputation' | 'others';
  applicationDeadline: string; // YYYY-MM-DD
  stage: JobStage;
  
  // Credentials
  userId?: string;
  password?: string;
  rollNumber?: string;
  
  // Exam Details
  examDate?: string; // YYYY-MM-DD
  examTime?: string;
  examVenue?: string;
  
  // Financial
  applicationFee?: number;
  isFeePaid?: boolean;
  
  // Attachments & Notes
  attachments: JobAttachment[];
  notes?: string;
  
  createdAt: number;
  updatedAt: number;
}

export interface DeletedJobCircularItem {
  circular: JobCircularItem;
  deletedAt?: string;
}

export interface RecycleItem {
  id: string;
  type: DeletedItemType;
  name: string;
  deletedFrom: string; // Breadcrumb path
  deletedOn: string;   // e.g., "Jul 28, 2026 10:46 PM"
  daysLeft: number;    // Countdown days (default 30)
  originalData: {
    workspace?: Workspace;
    section?: Section;
    topic?: Topic;
    task?: Task;
    circular?: JobCircularItem;
    // Child items if restoring container
    sections?: Section[];
    topics?: Topic[];
    tasks?: Task[];
  };
}

export interface UserSettings {
  dailyTarget: number;
  dailyGoalMode?: 'tasks' | 'time';
  dailyTimeTargetMinutes?: number;
  theme?: 'light' | 'dark' | 'system';
  primaryColor?: 'blue' | 'purple' | 'green' | 'orange' | 'pink' | 'cyan' | 'amber';
  darkMode?: boolean;
  autoSync: boolean;
  soundEffects: boolean;
  confettiCelebration?: boolean;
  defaultTaskPriority?: 'high' | 'medium' | 'low' | 'none';
  focusCheckIntervalMinutes?: number;
  focusCheckIntervalEnabled?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  time: string;
  read: boolean;
  type?: 'focus' | 'reminders' | 'system';
  description?: string;
}

export interface ToastData {
  message: string;
  undoAction?: () => void;
  duration?: number;
}
