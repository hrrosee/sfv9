import React, { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  Search,
  Plus,
  ArrowUpDown,
  Filter,
  CheckCircle2,
  Clock,
  Calendar,
  Building2,
  Award,
  DollarSign,
  FileText,
  Copy,
  Check,
  ExternalLink,
  Download,
  Trash2,
  Edit3,
  X,
  AlertTriangle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Menu,
  Eye,
  EyeOff,
  Sparkles,
  Layers,
  HelpCircle,
  Upload,
  Paperclip,
  MoreVertical,
  Loader2,
  Globe
} from 'lucide-react';
import { JobCircularItem, JobCategory, JobStage, JobAttachment } from '../types';
import { JOB_TITLE_SUGGESTIONS } from '../data/jobTitles';
import { ORGANIZATION_SUGGESTIONS } from '../data/organizations';
import { storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { saveFileToIndexedDB, createBlobUrlFromIndexedDB, deleteFileFromIndexedDB } from '../utils/indexedDBStorage';

// Cloudinary 25 GB Free Cloud Storage Configuration
const CLOUDINARY_CLOUD_NAME = 'nqqccgop';
const CLOUDINARY_UPLOAD_PRESET = 'studyflow_preset';

export interface JobCircularStudioProps {
  jobCirculars?: JobCircularItem[];
  circulars?: JobCircularItem[];
  onAddJobCircular?: (job: Omit<JobCircularItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onAddCircular?: (job: Omit<JobCircularItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateJobCircular?: (job: JobCircularItem) => void;
  onUpdateCircular?: (id: string, updates: Partial<JobCircularItem>) => void;
  onDeleteJobCircular?: (id: string) => void; // Moves to Recycle Bin
  onDeleteCircular?: (item: JobCircularItem) => void;
  onClose?: () => void;
  onToggleSidebar?: () => void;
  showToast: (msg: string) => void;
  soundEnabled?: boolean;
}

type SortOption = 'deadline_soonest' | 'exam_soonest' | 'recently_added' | 'grade_desc' | 'title_asc';
type FilterStatus = 'all' | JobStage;

// Official National Pay Scale Bangladesh (Grade 9 to 20)
const BD_NATIONAL_PAY_SCALES: Record<string, string> = {
  '9th': '22,000 - 53,060',
  '10th': '16,000 - 38,640',
  '11th': '12,500 - 30,230',
  '12th': '11,300 - 27,300',
  '13th': '11,000 - 26,590',
  '14th': '10,200 - 24,680',
  '15th': '9,700 - 23,490',
  '16th': '9,300 - 22,490',
  '17th': '9,000 - 21,800',
  '18th': '8,800 - 21,310',
  '19th': '8,500 - 20,570',
  '20th': '8,250 - 20,010',
};

export const JobCircularStudio: React.FC<JobCircularStudioProps> = ({
  jobCirculars: incomingJobCirculars = [],
  circulars: altCirculars = [],
  onAddJobCircular,
  onAddCircular,
  onUpdateJobCircular,
  onUpdateCircular,
  onDeleteJobCircular,
  onDeleteCircular,
  onClose,
  onToggleSidebar,
  showToast,
}) => {
  const jobCirculars = altCirculars.length > 0 ? altCirculars : incomingJobCirculars;

  const handleAdd = (job: Omit<JobCircularItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (onAddCircular) onAddCircular(job);
    else if (onAddJobCircular) onAddJobCircular(job);
  };

  const handleUpdate = (updatedJob: JobCircularItem) => {
    if (onUpdateCircular) onUpdateCircular(updatedJob.id, updatedJob);
    else if (onUpdateJobCircular) onUpdateJobCircular(updatedJob);
  };

  const handleDelete = (item: JobCircularItem) => {
    if (onDeleteCircular) onDeleteCircular(item);
    else if (onDeleteJobCircular) onDeleteJobCircular(item.id);
  };
  // Navigation & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | JobCategory>('all');
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>('all');
  const [mobileFilterTab, setMobileFilterTab] = useState<'all' | 'govt' | 'bank' | 'applied' | 'urgent' | 'exams'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('deadline_soonest');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);

  // Modal & Drawer States
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobCircularItem | null>(null);
  const [detailsJob, setDetailsJob] = useState<JobCircularItem | null>(null);
  const [jobToDelete, setJobToDelete] = useState<JobCircularItem | null>(null);

  // Form states for Add/Edit Modal
  const [modalCategory, setModalCategory] = useState<JobCategory>('govt');
  const [modalAttachments, setModalAttachments] = useState<JobAttachment[]>([]);
  const [modalIsFeePaid, setModalIsFeePaid] = useState<boolean>(false);
  const [modalStage, setModalStage] = useState<JobStage>('not_applied');
  const [modalGrade, setModalGrade] = useState<string>('9th');
  const [modalScale, setModalScale] = useState<string>('22,000 - 53,060');
  const [modalDeadline, setModalDeadline] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [modalExamDate, setModalExamDate] = useState<string>('');
  const [fileLinkInput, setFileLinkInput] = useState('');
  const [fileNameInput, setFileNameInput] = useState('');
  const [fileTypeSelect, setFileTypeSelect] = useState<'circular' | 'admit_card' | 'applicant_copy' | 'other'>('circular');
  const uploadTasksRef = useRef<Record<string, any>>({});
  const [editingAttachmentId, setEditingAttachmentId] = useState<string | null>(null);
  const [editingAttachmentTitle, setEditingAttachmentTitle] = useState<string>('');
  const [isDragOverAttachment, setIsDragOverAttachment] = useState<boolean>(false);

  // Custom UI dropdown open states for premium look
  const [modalJobTitle, setModalJobTitle] = useState<string>('');
  const [isTitleSuggestionsOpen, setIsTitleSuggestionsOpen] = useState(false);
  const [activeTitleIndex, setActiveTitleIndex] = useState<number>(-1);
  const [modalOrganization, setModalOrganization] = useState<string>('');
  const [isOrgSuggestionsOpen, setIsOrgSuggestionsOpen] = useState(false);
  const [activeOrgIndex, setActiveOrgIndex] = useState<number>(-1);
  const [isGradeDropdownOpen, setIsGradeDropdownOpen] = useState(false);
  const [isStageDropdownOpen, setIsStageDropdownOpen] = useState(false);
  const [isFileTypeDropdownOpen, setIsFileTypeDropdownOpen] = useState(false);
  const [isDrawerStageDropdownOpen, setIsDrawerStageDropdownOpen] = useState(false);
  const [showDrawerPassword, setShowDrawerPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isDeadlinePickerOpen, setIsDeadlinePickerOpen] = useState(false);
  const [isExamDatePickerOpen, setIsExamDatePickerOpen] = useState(false);
  const [deadlineViewMonth, setDeadlineViewMonth] = useState<Date>(() => new Date());
  const [examViewMonth, setExamViewMonth] = useState<Date>(() => new Date());

  // Keep detailsJob in sync if jobCirculars list updates
  useEffect(() => {
    if (detailsJob) {
      const freshJob = jobCirculars.find(j => j.id === detailsJob.id);
      if (freshJob) {
        setDetailsJob(freshJob);
      }
    }
  }, [jobCirculars]);

  // When opening modal for editing or creating, initialize controlled states
  const openAddModal = () => {
    setEditingJob(null);
    setModalCategory('govt');
    setModalJobTitle('');
    setIsTitleSuggestionsOpen(false);
    setActiveTitleIndex(-1);
    setModalOrganization('');
    setIsOrgSuggestionsOpen(false);
    setActiveOrgIndex(-1);
    setModalAttachments([]);
    setModalIsFeePaid(false);
    setModalStage('not_applied');
    setModalGrade('9th');
    setModalScale(BD_NATIONAL_PAY_SCALES['9th'] || '22,000 - 53,060');
    setModalDeadline(new Date().toISOString().split('T')[0]);
    setModalExamDate('');
    setFileLinkInput('');
    setFileNameInput('');
    setIsGradeDropdownOpen(false);
    setIsStageDropdownOpen(false);
    setIsFileTypeDropdownOpen(false);
    setIsDeadlinePickerOpen(false);
    setIsExamDatePickerOpen(false);
    setDeadlineViewMonth(new Date());
    setExamViewMonth(new Date());
    setIsAddEditModalOpen(true);
  };

  const openEditModal = (job: JobCircularItem) => {
    setEditingJob(job);
    setModalCategory(job.category || 'govt');
    setModalJobTitle(job.jobTitle || '');
    setIsTitleSuggestionsOpen(false);
    setActiveTitleIndex(-1);
    setModalOrganization(job.organization || '');
    setIsOrgSuggestionsOpen(false);
    setActiveOrgIndex(-1);
    setModalAttachments(job.attachments || []);
    setModalIsFeePaid(Boolean(job.isFeePaid));
    setModalStage(job.stage || 'not_applied');
    const initialGrade = job.grade ? (job.grade.endsWith('th') ? job.grade : `${job.grade}th`) : '9th';
    setModalGrade(initialGrade);
    setModalScale(job.scale || BD_NATIONAL_PAY_SCALES[initialGrade] || '');
    const deadlineVal = job.applicationDeadline || new Date().toISOString().split('T')[0];
    setModalDeadline(deadlineVal);
    setModalExamDate(job.examDate || '');
    setDeadlineViewMonth(deadlineVal ? new Date(deadlineVal) : new Date());
    setExamViewMonth(job.examDate ? new Date(job.examDate) : new Date());
    setFileLinkInput('');
    setFileNameInput('');
    setIsGradeDropdownOpen(false);
    setIsStageDropdownOpen(false);
    setIsFileTypeDropdownOpen(false);
    setIsDeadlinePickerOpen(false);
    setIsExamDatePickerOpen(false);
    setIsDragOverAttachment(false);
    setIsAddEditModalOpen(true);
  };

  // Helper: Format byte sizes cleanly (e.g., 2.4 MB, 450 KB)
  const formatFileSize = (bytes: number): string => {
    if (!bytes || bytes <= 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
  };

  // Reusable instant optimistic file processing (Google Drive / Linear Single-Card style)
  const handleProcessUploadFiles = async (rawFiles: File[]) => {
    if (!rawFiles || rawFiles.length === 0) return;

    if (rawFiles.length > 3) {
      showToast('⚠️ Maximum 3 files can be uploaded at once');
    }

    const filesToUpload = rawFiles.slice(0, 3);
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

    for (const file of filesToUpload) {
      if (file.size > 15 * 1024 * 1024) {
        showToast(`"${file.name}" exceeds 15MB limit`);
        continue;
      }

      const uploadId = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
      const formattedSize = formatFileSize(file.size);

      // 1. INSTANT OPTIMISTIC FEEDBACK (0ms): Card renders directly in Attached Items!
      const optimisticAtt: JobAttachment = {
        id: uploadId,
        name: fileNameInput.trim() || file.name,
        type: fileTypeSelect,
        url: '', // populated once cloud or offline indexedDB finishes
        fileSize: formattedSize,
        status: 'uploading',
        progress: 12,
        uploadedAt: Date.now(),
      };

      setModalAttachments(prev => [...prev, optimisticAtt]);

      let isCompleted = false;

      // Helper: Save instantly to IndexedDB (smooth, fast, offline-safe)
      const saveToIndexedDBFallback = async (isExplicitOffline = false) => {
        if (isCompleted) return;
        isCompleted = true;
        delete uploadTasksRef.current[uploadId];

        try {
          const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
          const idbUrl = await saveFileToIndexedDB(fileId, file, {
            name: fileNameInput.trim() || file.name,
            type: fileTypeSelect
          });

          setModalAttachments(prev =>
            prev.map(att =>
              att.id === uploadId
                ? { ...att, url: idbUrl, status: 'ready', progress: 100 }
                : att
            )
          );

          if (isExplicitOffline) {
            showToast(`"${file.name}" saved in Offline Storage`);
          }
        } catch (idbErr) {
          console.error('IndexedDB save error:', idbErr);
          delete uploadTasksRef.current[uploadId];
          setModalAttachments(prev => prev.filter(att => att.id !== uploadId));
          showToast(`⚠️ Could not store file: "${file.name}".`);
        }
      };

      // Case 1: Pure Offline -> Direct instant save to IndexedDB
      if (!isOnline) {
        await saveToIndexedDBFallback(true);
        continue;
      }

      // Case 2: Online -> Upload directly to Cloudinary (25 GB Free Cloud Storage) with live bytes progress
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        const isImage = file.type.startsWith('image/');
        const resourceType = isImage ? 'image' : 'raw';
        const endpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;

        const xhr = new XMLHttpRequest();
        xhr.open('POST', endpoint, true);
        uploadTasksRef.current[uploadId] = {
          cancel: () => {
            try {
              xhr.abort();
            } catch (_) {}
          }
        };

        xhr.upload.onprogress = (event) => {
          if (isCompleted) return;
          if (event.lengthComputable && event.total > 0) {
            const rawProgress = Math.round((event.loaded / event.total) * 100);
            const smoothProgress = Math.min(99, Math.max(10, rawProgress));
            setModalAttachments(prev =>
              prev.map(att =>
                att.id === uploadId
                  ? { ...att, progress: smoothProgress }
                  : att
              )
            );
          }
        };

        xhr.onload = () => {
          if (isCompleted) return;
          delete uploadTasksRef.current[uploadId];

          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              const downloadUrl = response.secure_url || response.url;
              isCompleted = true;
              setModalAttachments(prev =>
                prev.map(att =>
                  att.id === uploadId
                    ? { ...att, url: downloadUrl, status: 'ready', progress: 100 }
                    : att
                )
              );
              showToast(`"${file.name}" uploaded to Cloud! ☁️`);
            } catch (jsonErr) {
              console.error('Cloudinary JSON parse error:', jsonErr);
              saveToIndexedDBFallback(false);
            }
          } else {
            console.error('Cloudinary upload error:', xhr.status, xhr.responseText);
            saveToIndexedDBFallback(false);
          }
        };

        xhr.onerror = () => {
          if (isCompleted) return;
          delete uploadTasksRef.current[uploadId];
          console.error('Cloudinary network error, falling back to IndexedDB');
          saveToIndexedDBFallback(false);
        };

        xhr.send(formData);
      } catch (err: any) {
        console.error('[Cloudinary Init Error]', err);
        saveToIndexedDBFallback(false);
      }
    }
  };

  // Mobile Collapsible Hero State (350ms synchronized motion)
  const [isHeroOpen, setIsHeroOpen] = useState(true);
  const [pullDistance, setPullDistance] = useState(0);
  const [pullDirection, setPullDirection] = useState<'up' | 'down'>('up');
  const touchStartYRef = useRef<number>(0);
  const touchStartTimeRef = useRef<number>(0);
  const touchStartScrollTopRef = useRef<number>(0);
  const heroOpenAtTouchStartRef = useRef<boolean>(true);
  const bodyScrollRef = useRef<HTMLDivElement | null>(null);
  const isScrollingToTopRef = useRef<boolean>(false);

  // 3-dot dropdown menu state
  const [activeMenuJobId, setActiveMenuJobId] = useState<string | null>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(target)) {
        setIsSortDropdownOpen(false);
      }
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(target)) {
        setIsStatusDropdownOpen(false);
      }
      if (!target.closest('[data-job-menu]')) {
        setActiveMenuJobId(null);
      }
      if (!target.closest('[data-title-suggestions]')) {
        setIsTitleSuggestionsOpen(false);
      }
      if (!target.closest('[data-org-suggestions]')) {
        setIsOrgSuggestionsOpen(false);
      }
      if (!target.closest('[data-custom-grade-dropdown]')) {
        setIsGradeDropdownOpen(false);
      }
      if (!target.closest('[data-custom-stage-dropdown]')) {
        setIsStageDropdownOpen(false);
      }
      if (!target.closest('[data-custom-filetype-dropdown]')) {
        setIsFileTypeDropdownOpen(false);
      }
      if (!target.closest('[data-drawer-stage-dropdown]')) {
        setIsDrawerStageDropdownOpen(false);
      }
      if (!target.closest('[data-deadline-picker]')) {
        setIsDeadlinePickerOpen(false);
      }
      if (!target.closest('[data-exam-date-picker]')) {
        setIsExamDatePickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside, true);
    document.addEventListener('touchstart', handleClickOutside, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('touchstart', handleClickOutside, true);
    };
  }, []);

  // Copy to clipboard helper with toast
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const handleCopy = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(`${label}-${text}`);
    showToast(`Copied ${label} to clipboard!`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Helper to calculate days left for deadline
  // Helper to open attachment documents seamlessly (supporting idb:// indexedDB links and http/cloud links)
  const openAttachmentDocument = async (url: string) => {
    if (!url) return;
    if (url.startsWith('idb://')) {
      const fileId = url.replace('idb://', '');
      try {
        const blobUrl = await createBlobUrlFromIndexedDB(fileId);
        if (blobUrl) {
          window.open(blobUrl, '_blank');
          return;
        }
      } catch (err) {
        console.error('Failed to resolve IndexedDB document blob:', err);
      }
      showToast('⚠️ Could not open local offline document.');
      return;
    }
    window.open(url, '_blank');
  };

  const getDaysLeft = (dateStr: string) => {
    if (!dateStr) return { days: 999, text: 'No date', isExpired: false, isUrgent: false };
    const target = new Date(dateStr);
    target.setHours(23, 59, 59, 999);
    const now = new Date();
    const diff = target.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return { days, text: 'Expired', isExpired: true, isUrgent: false };
    if (days === 0) return { days, text: 'Ends today!', isExpired: false, isUrgent: true };
    if (days === 1) return { days, text: '1 day left', isExpired: false, isUrgent: true };
    return { days, text: `${days} days left`, isExpired: false, isUrgent: days <= 3 };
  };

  // Helper for human friendly date format (e.g. 15 Oct, 2026)
  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const [y, m, d] = dateStr.split('-').map(Number);
      if (!y || !m || !d) return dateStr;
      const date = new Date(y, m - 1, d);
      return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // Quick stats calculation
  const stats = useMemo(() => {
    const total = jobCirculars.length;
    const govtCount = jobCirculars.filter(j => j.category === 'govt').length;
    const bankCount = jobCirculars.filter(j => j.category === 'bank').length;
    
    const applied = jobCirculars.filter(j => j.stage !== 'not_applied').length;
    const inProgress = jobCirculars.filter(j => j.stage === 'prelim' || j.stage === 'written' || j.stage === 'viva').length;
    const selected = jobCirculars.filter(j => j.stage === 'selected').length;
    
    // Exams Appeared: Prelim, Written, Viva or Selected
    const examsAppeared = jobCirculars.filter(j => 
      j.stage === 'prelim' || j.stage === 'written' || j.stage === 'viva' || j.stage === 'selected'
    ).length;

    // Upcoming exams: Has examDate in future
    const today = new Date().toISOString().split('T')[0];
    const upcomingExams = jobCirculars.filter(j => j.examDate && j.examDate >= today).length;

    // Expiring soon (within 3 days)
    const expiringSoon = jobCirculars.filter(j => {
      const { isExpired, isUrgent } = getDaysLeft(j.applicationDeadline);
      return !isExpired && isUrgent && j.stage === 'not_applied';
    }).length;

    const successRate = applied > 0 ? Math.round((selected / applied) * 100) : 0;

    return {
      total,
      govtCount,
      bankCount,
      applied,
      inProgress,
      selected,
      examsAppeared,
      upcomingExams,
      expiringSoon,
      successRate
    };
  }, [jobCirculars]);

  // Filter and Sort Processing
  const filteredAndSortedJobs = useMemo(() => {
    return jobCirculars
      .filter(job => {
        // Mobile Quick Tab Filter
        if (mobileFilterTab === 'govt' && job.category !== 'govt') return false;
        if (mobileFilterTab === 'bank' && job.category !== 'bank') return false;
        if (mobileFilterTab === 'applied' && job.stage === 'not_applied') return false;
        if (mobileFilterTab === 'urgent') {
          const { isExpired, isUrgent } = getDaysLeft(job.applicationDeadline);
          if (isExpired || !isUrgent) return false;
        }
        if (mobileFilterTab === 'exams') {
          const today = new Date().toISOString().split('T')[0];
          if (!job.examDate || job.examDate < today) return false;
        }

        // Category Filter
        if (selectedCategory !== 'all' && job.category !== selectedCategory) return false;

        // Status Filter
        if (selectedStatus !== 'all' && job.stage !== selectedStatus) return false;

        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = job.jobTitle.toLowerCase().includes(q);
          const matchOrg = job.organization.toLowerCase().includes(q);
          const matchRoll = job.rollNumber?.toLowerCase().includes(q);
          const matchUserId = job.userId?.toLowerCase().includes(q);
          const matchGrade = job.grade?.toLowerCase().includes(q);
          if (!matchTitle && !matchOrg && !matchRoll && !matchUserId && !matchGrade) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'deadline_soonest') {
          return new Date(a.applicationDeadline).getTime() - new Date(b.applicationDeadline).getTime();
        }
        if (sortBy === 'exam_soonest') {
          if (!a.examDate) return 1;
          if (!b.examDate) return -1;
          return new Date(a.examDate).getTime() - new Date(b.examDate).getTime();
        }
        if (sortBy === 'recently_added') {
          return b.createdAt - a.createdAt;
        }
        if (sortBy === 'grade_desc') {
          // Robust numeric extractor for Grade (e.g. "9th", "Grade 10", "৯ম", "10")
          const extractGradeNum = (val?: string): number => {
            if (!val) return 999;
            // Convert Bengali digits to English if present
            const banglaMap: Record<string, string> = { '০':'0','১':'1','২':'2','৩':'3','৪':'4','৫':'5','৬':'6','৭':'7','৮':'8','৯':'9' };
            const normalized = val.replace(/[০-৯]/g, d => banglaMap[d] || d);
            const match = normalized.match(/\d+/);
            return match ? parseInt(match[0], 10) : 999;
          };
          const numA = extractGradeNum(a.grade);
          const numB = extractGradeNum(b.grade);
          return numA - numB; // Grade 9 comes before Grade 10
        }
        if (sortBy === 'title_asc') {
          return a.jobTitle.localeCompare(b.jobTitle);
        }
        return 0;
      });
  }, [jobCirculars, selectedCategory, selectedStatus, mobileFilterTab, searchQuery, sortBy]);

  // Filtered Job Title suggestions based on user input
  const filteredJobTitleSuggestions = useMemo(() => {
    const input = modalJobTitle.trim().toLowerCase();
    // Unique collection combining static suggestions and previously entered jobs
    const allTitles = Array.from(
      new Set([
        ...jobCirculars.map(j => j.jobTitle).filter(Boolean),
        ...JOB_TITLE_SUGGESTIONS,
      ])
    );

    if (!input) {
      // Show top popular titles when empty
      return allTitles.slice(0, 8);
    }

    return allTitles
      .filter(title => title.toLowerCase().includes(input))
      .slice(0, 10);
  }, [modalJobTitle, jobCirculars]);

  // Filtered Organization / Ministry suggestions based on user input
  const filteredOrganizationSuggestions = useMemo(() => {
    const input = modalOrganization.trim().toLowerCase();
    const allOrgs = Array.from(
      new Set([
        ...jobCirculars.map(j => j.organization).filter(Boolean),
        ...ORGANIZATION_SUGGESTIONS,
      ])
    );

    if (!input) {
      return allOrgs.slice(0, 8);
    }

    return allOrgs
      .filter(org => org.toLowerCase().includes(input))
      .slice(0, 10);
  }, [modalOrganization, jobCirculars]);

  // Stage Badge Render Helper
  const renderStageBadge = (stage: JobStage) => {
    switch (stage) {
      case 'not_applied':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10.5px] font-semibold bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border border-rose-200/70 dark:border-rose-900/60 shadow-3xs">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
            <span>Not Applied</span>
          </span>
        );
      case 'applied':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10.5px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 shadow-3xs">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 shrink-0" />
            <span>Applied</span>
          </span>
        );
      case 'prelim':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10.5px] font-semibold bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200/70 dark:border-purple-800/70 shadow-3xs">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
            <span>Prelim / MCQ</span>
          </span>
        );
      case 'written':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10.5px] font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-800/70 shadow-3xs">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
            <span>Written Stage</span>
          </span>
        );
      case 'viva':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10.5px] font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200/70 dark:border-amber-800/70 shadow-3xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
            <span>Viva / Interview</span>
          </span>
        );
      case 'selected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10.5px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/70 shadow-3xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span>Selected 🎉</span>
          </span>
        );
    }
  };

  // Opacity helper for 350ms motion
  const getHeroOpacity = (): number => {
    if (isHeroOpen && pullDistance === 0) return 1;
    if (!isHeroOpen && pullDistance === 0) return 0;
    if (pullDirection === 'up') {
      return Math.min(1, Math.max(0, (pullDistance - 36) / 84));
    } else {
      const pct = (pullDistance / 204) * 100;
      if (pct <= 0) return 0;
      return Math.min(1, pct / 100);
    }
  };

  return (
    <motion.div
      key="job-circular-studio-full-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex-1 flex flex-col h-full bg-white dark:bg-slate-950 overflow-hidden select-none relative z-10"
    >
      {/* 1. MOBILE TOP HEADER */}
      <header className="no-copy-header md:hidden shrink-0 h-[48px] bg-white/85 dark:bg-slate-900/85 backdrop-blur-[20px] border-b border-slate-200/70 dark:border-white/[0.06] px-4 flex items-center justify-between z-30 relative">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={() => {
              if (onToggleSidebar) onToggleSidebar();
              else if (onClose) onClose();
            }}
            className="w-[32px] h-[32px] rounded-lg border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 flex items-center justify-center shadow-3xs cursor-pointer shrink-0"
            title="Open sidebar"
          >
            <Menu className="w-4 h-4" />
          </button>
          <h1 className="font-serif font-bold text-[15.5px] text-slate-900 dark:text-slate-100 tracking-tight truncate">
            Job Circulars
          </h1>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingJob(null);
            setIsAddEditModalOpen(true);
          }}
          className="h-[32px] px-3 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-3xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>New Job</span>
        </button>
      </header>

      {/* 2. MAIN CONTENT STREAM */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-0 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col min-h-0 sm:p-6">
          
          {/* 1. COLLAPSIBLE HERO HEADER WITH DASHBOARD STATS (350ms Duration) */}
          <motion.div
            initial={false}
            animate={{
              height: (typeof window !== 'undefined' && window.innerWidth >= 640) ? 'auto' : (isHeroOpen ? 'auto' : pullDistance > 0 ? pullDistance : 0),
              opacity: (typeof window !== 'undefined' && window.innerWidth >= 640) ? 1 : getHeroOpacity(),
            }}
            transition={
              pullDistance > 0
                ? { duration: 0 }
                : { duration: 0.35, ease: [0.25, 1, 0.5, 1] }
            }
            className="sm:!h-auto sm:!opacity-100 overflow-hidden select-none shrink-0 transform-gpu"
          >
            <motion.div
              animate={{
                y: 0,
              }}
              className="sm:h-auto origin-top sm:!translate-y-0 transform-gpu"
            >
              <div className="px-4 pt-3 pb-2 sm:p-2 sm:pb-5 flex flex-col xl:flex-row xl:items-center justify-between gap-2.5 sm:gap-4">
                {/* Left Side: Icon & Title */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-10 h-10 sm:w-[52px] sm:h-[52px] rounded-xl sm:rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md transition-all duration-300"
                    style={{
                      background: 'linear-gradient(135deg, var(--primary-grad-start, #2563EB), var(--primary-grad-end, #1D4ED8))',
                      boxShadow: '0 8px 22px -4px var(--primary-ring, rgba(37, 99, 235, 0.35))',
                    }}
                  >
                    <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
                  </div>
                  <div className="min-w-0">
                    <h1 className="font-serif font-bold text-lg sm:text-xl text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
                      Circulars & Exam
                    </h1>
                    <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                      Track government & bank job circulars and exam
                    </p>
                  </div>
                </div>

                {/* Right Side: Quick Action Button & Stats Pills */}
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={openAddModal}
                    className="hidden sm:inline-flex h-[36px] px-4 text-white rounded-lg text-xs font-semibold items-center gap-1.5 shadow-sm cursor-pointer transition-all active:scale-95"
                    style={{
                      backgroundColor: 'var(--primary, #2563EB)',
                      boxShadow: '0 4px 12px -2px var(--primary-ring, rgba(37, 99, 235, 0.25))',
                    }}
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Add Circular</span>
                  </button>
                </div>
              </div>

              {/* REALTIME HERO DASHBOARD STATS (Mobile: Option 2 Unified 5-Metric Strip | Desktop: 5-Card Grid) */}
              <div className="px-4 sm:px-2 pb-1.5 sm:pb-2">
                {/* MOBILE VIEW (sm:hidden): Option 2 - Compact 5-Metric Unified Strip */}
                <div className="sm:hidden bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800/90 rounded-xl p-2.5 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]">
                  <div className="grid grid-cols-5 divide-x divide-slate-100 dark:divide-slate-800 text-center">
                    {/* Applied */}
                    <div className="flex flex-col items-center justify-center px-1">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">
                        Applied
                      </span>
                      <span className="text-base font-black text-blue-600 dark:text-blue-400 mt-0.5 font-sans leading-none">
                        {stats.applied}
                      </span>
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium mt-1">
                        /{stats.total}
                      </span>
                    </div>

                    {/* Attended */}
                    <div className="flex flex-col items-center justify-center px-1">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">
                        Attended
                      </span>
                      <span className="text-base font-black text-purple-600 dark:text-purple-400 mt-0.5 font-sans leading-none">
                        {stats.examsAppeared}
                      </span>
                      <span className="text-[9px] text-purple-500/80 font-medium mt-1">
                        done
                      </span>
                    </div>

                    {/* Upcoming */}
                    <div className="flex flex-col items-center justify-center px-1">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">
                        Upcoming
                      </span>
                      <span className="text-base font-black text-amber-600 dark:text-amber-400 mt-0.5 font-sans leading-none">
                        {stats.upcomingExams}
                      </span>
                      <span className="text-[9px] text-amber-500/80 font-medium mt-1">
                        exam
                      </span>
                    </div>

                    {/* Selected */}
                    <div className="flex flex-col items-center justify-center px-1">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">
                        Selected
                      </span>
                      <span className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-0.5 font-sans leading-none">
                        {stats.selected}
                      </span>
                      <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                        {stats.successRate}%
                      </span>
                    </div>

                    {/* Expiring */}
                    <div className="flex flex-col items-center justify-center px-1">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">
                        Expiring
                      </span>
                      <span className={`text-base font-black mt-0.5 font-sans leading-none ${
                        stats.expiringSoon > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'
                      }`}>
                        {stats.expiringSoon}
                      </span>
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium mt-1">
                        &le;3d
                      </span>
                    </div>
                  </div>
                </div>

                {/* DESKTOP VIEW (hidden sm:grid): Premium 5-Card Grid Layout */}
                <div className="hidden sm:grid sm:grid-cols-5 gap-3">
                  {/* Stat 1: Total Applied */}
                  <div className="group relative overflow-hidden bg-white/95 dark:bg-slate-900/85 backdrop-blur-md border border-slate-200/90 dark:border-slate-800/90 hover:border-blue-400 dark:hover:border-blue-700 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_-6px_rgba(37,99,235,0.12)] hover:-translate-y-0.5">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
                      Total Applied
                    </span>
                    <div className="flex items-baseline gap-1.5 mt-2">
                      <span className="text-[26px] font-black text-slate-900 dark:text-slate-100 tracking-tight font-sans">
                        {stats.applied}
                      </span>
                      <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                        / {stats.total} total
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${stats.total > 0 ? Math.min(100, Math.round((stats.applied / stats.total) * 100)) : 0}%`,
                          backgroundColor: 'var(--primary, #2563EB)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Stat 2: Exams Appeared */}
                  <div className="group relative overflow-hidden bg-white/95 dark:bg-slate-900/85 backdrop-blur-md border border-slate-200/90 dark:border-slate-800/90 hover:border-purple-400 dark:hover:border-purple-700 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_-6px_rgba(147,51,234,0.12)] hover:-translate-y-0.5">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
                      Exams Appeared
                    </span>
                    <div className="flex items-baseline gap-1.5 mt-2">
                      <span className="text-[26px] font-black text-purple-600 dark:text-purple-400 tracking-tight font-sans">
                        {stats.examsAppeared}
                      </span>
                      <span className="text-[10.5px] font-semibold text-purple-500/80 uppercase">
                        attended
                      </span>
                    </div>
                    <div className="w-full bg-purple-100/50 dark:bg-purple-950/40 h-1.5 rounded-full mt-3 overflow-hidden">
                      <div
                        className="bg-purple-500 h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${stats.applied > 0 ? Math.min(100, Math.round((stats.examsAppeared / stats.applied) * 100)) : 0}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Stat 3: Upcoming Exams */}
                  <div className="group relative overflow-hidden bg-white/95 dark:bg-slate-900/85 backdrop-blur-md border border-slate-200/90 dark:border-slate-800/90 hover:border-amber-400 dark:hover:border-amber-700 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_-6px_rgba(245,158,11,0.12)] hover:-translate-y-0.5">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
                      Upcoming Exams
                    </span>
                    <div className="flex items-baseline gap-1.5 mt-2">
                      <span className="text-[26px] font-black text-amber-600 dark:text-amber-400 tracking-tight font-sans">
                        {stats.upcomingExams}
                      </span>
                      <span className="text-[10.5px] font-semibold text-amber-500/80 uppercase">
                        scheduled
                      </span>
                    </div>
                    <div className="w-full bg-amber-100/50 dark:bg-amber-950/40 h-1.5 rounded-full mt-3 overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${stats.upcomingExams > 0 ? 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Stat 4: Success / Selected */}
                  <div className="group relative overflow-hidden bg-white/95 dark:bg-slate-900/85 backdrop-blur-md border border-slate-200/90 dark:border-slate-800/90 hover:border-emerald-400 dark:hover:border-emerald-700 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_-6px_rgba(16,185,129,0.12)] hover:-translate-y-0.5">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
                      Selected
                    </span>
                    <div className="flex items-baseline gap-1.5 mt-2">
                      <span className="text-[26px] font-black text-emerald-600 dark:text-emerald-400 tracking-tight font-sans">
                        {stats.selected}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded-md">
                        {stats.successRate}% rate
                      </span>
                    </div>
                    <div className="w-full bg-emerald-100/50 dark:bg-emerald-950/40 h-1.5 rounded-full mt-3 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${stats.successRate}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Stat 5: Expiring Soon */}
                  <div className="group relative overflow-hidden bg-white/95 dark:bg-slate-900/85 backdrop-blur-md border border-slate-200/90 dark:border-slate-800/90 hover:border-rose-400 dark:hover:border-rose-700 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_-6px_rgba(244,63,94,0.12)] hover:-translate-y-0.5">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
                      Expiring Soon
                    </span>
                    <div className="flex items-baseline gap-1.5 mt-2">
                      <span className={`text-[26px] font-black tracking-tight font-sans ${
                        stats.expiringSoon > 0
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}>
                        {stats.expiringSoon}
                      </span>
                      <span className="text-[10.5px] font-semibold text-slate-400 dark:text-slate-500 uppercase">
                        &le; 3 days
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          stats.expiringSoon > 0 ? 'bg-rose-500' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                        style={{
                          width: `${stats.expiringSoon > 0 ? 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* 2. STICKY SEARCH, SORT & FILTER BAR */}
          <div className="sticky top-0 sm:top-[-24px] z-20 bg-white dark:bg-slate-950 px-3.5 sm:px-0 pt-2 pb-0 sm:pt-3 sm:pb-0 flex flex-col gap-2 transition-all shrink-0">
            
            {/* Responsive Search, Sort & Filter: 
                - Desktop: [Search Bar] [Sort] [Filter] side-by-side in 1 clean line
                - Mobile: Top row: [Search Bar full line], Bottom row: [Sort] [Filter] */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-2.5">
              {/* Search Bar */}
              <div className="relative flex-1 min-w-0">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search job title, organization, roll or user ID..."
                  className="w-full h-9 pl-9 pr-8 bg-slate-50/80 hover:bg-white focus:bg-white dark:bg-slate-900 dark:hover:bg-slate-900 border border-slate-200/90 dark:border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-950/50 rounded-lg text-[14px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none transition-all shadow-3xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 absolute right-2.5 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Controls Wrapper: Side-by-side in Mobile, Inline in Desktop */}
              <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                {/* Sort Dropdown */}
                <div className="relative flex-1 sm:flex-initial" ref={sortDropdownRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSortDropdownOpen(prev => !prev);
                      setIsStatusDropdownOpen(false);
                    }}
                    className="w-full sm:w-auto h-9 px-3 text-xs font-semibold rounded-lg border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-between sm:justify-start gap-2 shadow-3xs cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="hidden md:inline text-slate-400 font-normal">Sort:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {sortBy === 'deadline_soonest' && 'Deadline Soonest'}
                        {sortBy === 'exam_soonest' && 'Exam Date Soonest'}
                        {sortBy === 'recently_added' && 'Recently Added'}
                        {sortBy === 'grade_desc' && 'Grade (High to Low)'}
                        {sortBy === 'title_asc' && 'Job Title (A-Z)'}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </button>

                  <AnimatePresence>
                    {isSortDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 4, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.96 }}
                        transition={{ duration: 0.1 }}
                        className="absolute left-0 sm:left-auto sm:right-0 top-full mt-1.5 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-1 z-30 overflow-hidden"
                      >
                        {[
                          { id: 'deadline_soonest', label: 'Deadline Soonest' },
                          { id: 'exam_soonest', label: 'Exam Date Soonest' },
                          { id: 'recently_added', label: 'Recently Added' },
                          { id: 'grade_desc', label: 'Grade (High to Low)' },
                          { id: 'title_asc', label: 'Job Title (A-Z)' },
                        ].map(opt => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              setSortBy(opt.id as SortOption);
                              setIsSortDropdownOpen(false);
                            }}
                            className={`w-full px-2.5 py-1.5 rounded-lg text-left text-xs flex items-center justify-between cursor-pointer transition-colors ${
                              sortBy === opt.id
                                ? 'bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] font-bold'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            <span>{opt.label}</span>
                            {sortBy === opt.id && <Check className="w-3.5 h-3.5 text-[#2563EB]" />}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Single Unified Filter Dropdown (Category + Status) */}
                <div className="relative flex-1 sm:flex-initial" ref={statusDropdownRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsStatusDropdownOpen(prev => !prev);
                      setIsSortDropdownOpen(false);
                    }}
                    className={`w-full sm:w-auto h-9 px-3 text-xs font-medium rounded-lg border transition-all flex items-center justify-between sm:justify-start gap-1.5 cursor-pointer select-none shadow-3xs ${
                      selectedCategory !== 'all' || selectedStatus !== 'all'
                        ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900 font-semibold'
                        : 'border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="hidden md:inline text-slate-400 font-normal">Filter:</span>
                      <span className="truncate">
                        {selectedCategory === 'all' && selectedStatus === 'all' && 'All Filters'}
                        {selectedCategory !== 'all' && selectedStatus === 'all' && (selectedCategory === 'govt' ? 'Govt' : 'Bank')}
                        {selectedCategory === 'all' && selectedStatus !== 'all' && (
                          selectedStatus === 'not_applied' ? 'Not Applied' :
                          selectedStatus === 'applied' ? 'Applied' :
                          selectedStatus === 'prelim' ? 'Prelim / MCQ' :
                          selectedStatus === 'written' ? 'Written Stage' :
                          selectedStatus === 'viva' ? 'Viva / Interview' : 'Selected'
                        )}
                        {selectedCategory !== 'all' && selectedStatus !== 'all' && `${selectedCategory === 'govt' ? 'Govt' : 'Bank'} • ${
                          selectedStatus === 'not_applied' ? 'Not Applied' :
                          selectedStatus === 'applied' ? 'Applied' :
                          selectedStatus === 'prelim' ? 'Prelim' :
                          selectedStatus === 'written' ? 'Written' :
                          selectedStatus === 'viva' ? 'Viva' : 'Selected'
                        }`}
                      </span>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 shrink-0 ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isStatusDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 4, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.97 }}
                        transition={{ duration: 0.12 }}
                        className="absolute right-0 top-full mt-1.5 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-2 z-30 overflow-hidden flex flex-col gap-2"
                      >
                        {/* Section 1: Category Selection */}
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">
                            Category
                          </span>
                          <div className="grid grid-cols-3 gap-1 bg-slate-100/90 dark:bg-slate-800/60 p-1 rounded-lg">
                            {[
                              { id: 'all' as const, label: `All (${stats.total})` },
                              { id: 'govt' as const, label: `Govt (${stats.govtCount})` },
                              { id: 'bank' as const, label: `Bank (${stats.bankCount})` },
                            ].map(cat => (
                              <button
                                key={cat.id}
                                type="button"
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-2 py-1 rounded-md text-xs transition-all text-center cursor-pointer ${
                                  selectedCategory === cat.id
                                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-semibold shadow-2xs'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                                }`}
                              >
                                {cat.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-slate-100 dark:bg-slate-800 -mx-1" />

                        {/* Section 2: Status / Stage Selection */}
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">
                            Status & Stage
                          </span>
                          <div className="flex flex-col gap-0.5">
                            {[
                              { id: 'all' as FilterStatus, label: 'All Status', desc: 'Show all circulars' },
                              { id: 'not_applied' as FilterStatus, label: 'Not Applied', desc: 'Planning to submit before deadline' },
                              { id: 'applied' as FilterStatus, label: 'Applied', desc: 'Application fee and form completed' },
                              { id: 'prelim' as FilterStatus, label: 'Prelim / MCQ', desc: 'Waiting or appeared for Preliminary test' },
                              { id: 'written' as FilterStatus, label: 'Written Stage', desc: 'Qualified prelim, written exam stage' },
                              { id: 'viva' as FilterStatus, label: 'Viva / Interview', desc: 'Facing oral interview / viva voce' },
                              { id: 'selected' as FilterStatus, label: 'Selected', desc: 'Final recommendation / appointment' },
                            ].map(opt => {
                              const isSelected = selectedStatus === opt.id;
                              return (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() => {
                                    setSelectedStatus(opt.id);
                                    setIsStatusDropdownOpen(false);
                                  }}
                                  className={`w-full px-2.5 py-1.5 rounded-lg text-left text-xs flex items-center justify-between cursor-pointer transition-colors ${
                                    isSelected
                                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold'
                                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                  }`}
                                >
                                  <div className="flex flex-col min-w-0 pr-2">
                                    <span className="font-medium text-slate-800 dark:text-slate-100">{opt.label}</span>
                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{opt.desc}</span>
                                  </div>
                                  {isSelected && <Check className="w-3.5 h-3.5 text-slate-900 dark:text-slate-100 shrink-0" />}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Reset Filters button if active */}
                        {(selectedCategory !== 'all' || selectedStatus !== 'all') && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCategory('all');
                              setSelectedStatus('all');
                              setIsStatusDropdownOpen(false);
                            }}
                            className="w-full pt-1.5 pb-1 text-center text-[11px] font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 border-t border-slate-100 dark:border-slate-800 cursor-pointer"
                          >
                            Reset Filters
                          </button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Mobile Quick Filter Horizontal Scrollable Pill Tabs */}
            <div className="sm:hidden -mx-3.5 px-3.5 pt-1 pb-1.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar select-none">
              {[
                { id: 'all', label: 'All', count: stats.total },
                { id: 'govt', label: '🏛️ Govt', count: stats.govtCount },
                { id: 'bank', label: '🏦 Bank', count: stats.bankCount },
                { id: 'applied', label: '🔵 Applied', count: stats.applied },
                { id: 'urgent', label: '⚡ Ends Soon', count: stats.expiringSoon },
                { id: 'exams', label: '📅 Exams', count: stats.upcomingExams },
              ].map(tab => {
                const isActive = mobileFilterTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setMobileFilterTab(tab.id as any);
                      // Clear standard dropdown filter when using quick mobile tab
                      if (tab.id === 'govt') setSelectedCategory('govt');
                      else if (tab.id === 'bank') setSelectedCategory('bank');
                      else setSelectedCategory('all');

                      if (tab.id === 'applied') setSelectedStatus('applied');
                      else setSelectedStatus('all');
                    }}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-3xs ${
                      isActive
                        ? 'bg-[#2563EB] text-white shadow-xs'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/90 dark:border-slate-800 hover:border-blue-400'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Filter Clear Tag Row (If any filter is selected) */}
            {(selectedCategory !== 'all' || selectedStatus !== 'all' || mobileFilterTab !== 'all') && (
              <div className="flex items-center justify-between px-1 text-[11px]">
                <span className="text-slate-400">
                  Showing {filteredAndSortedJobs.length} result{filteredAndSortedJobs.length !== 1 ? 's' : ''}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedStatus('all');
                    setMobileFilterTab('all');
                  }}
                  className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 font-semibold underline underline-offset-2 cursor-pointer"
                >
                  Clear filter
                </button>
              </div>
            )}
          </div>

          {/* 3. LIST TABLE / CARD CONTAINER */}
          <div className="flex-1 flex flex-col min-h-0 mt-2 sm:mt-3 border-0 sm:border sm:border-slate-200/80 dark:sm:border-slate-800 rounded-none sm:rounded-xl overflow-hidden bg-transparent sm:bg-white dark:sm:bg-slate-900 sm:shadow-xs">
            {filteredAndSortedJobs.length === 0 ? (
              /* Empty State */
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center select-none bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 sm:border-0 sm:rounded-none">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-colors bg-[var(--primary-light)] dark:bg-[var(--primary-dark-bg)] text-[var(--primary)] dark:text-[var(--primary-dark-text)]">
                  <Briefcase className="w-7 h-7 stroke-[1.8]" />
                </div>
                <h3 className="font-serif font-bold text-base text-slate-800 dark:text-slate-200 mb-1">
                  {searchQuery ? 'No matching job circulars found' : 'No Job Circulars Added Yet'}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mb-4 leading-relaxed">
                  {searchQuery
                    ? 'Try searching with different keywords or reset your active filters.'
                    : 'Start adding government and bank job circulars to track deadlines, roll numbers, and admit cards easily.'}
                </p>
                <button
                  type="button"
                  onClick={openAddModal}
                  className="px-4 py-2 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer transition-all active:scale-95"
                  style={{
                    backgroundColor: 'var(--primary, #2563EB)',
                    boxShadow: '0 4px 12px -2px var(--primary-ring, rgba(37, 99, 235, 0.25))',
                  }}
                >
                  Add First Circular
                </button>
              </div>
            ) : (
              /* Table / Card List */
              <div
                ref={bodyScrollRef}
                className="flex-1 overflow-y-auto custom-scrollbar p-3.5 sm:p-0 flex flex-col gap-3 sm:gap-0 sm:divide-y sm:divide-slate-100 sm:dark:divide-slate-800"
              >
                {filteredAndSortedJobs.map(job => {
                  const deadlineInfo = getDaysLeft(job.applicationDeadline);
                  return (
                    <div
                      key={job.id}
                      onClick={() => setDetailsJob(job)}
                      className="group bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] hover:shadow-md hover:border-blue-400/60 dark:hover:border-blue-700/60 transition-all cursor-pointer select-none active:scale-[0.99] sm:bg-transparent sm:dark:bg-transparent sm:border-0 sm:rounded-none sm:p-3 sm:px-4 sm:shadow-none sm:hover:bg-slate-50/80 sm:dark:hover:bg-slate-800/50 sm:flex sm:flex-row sm:items-center sm:justify-between sm:gap-3"
                    >
                      {/* ========================================================
                          1. MOBILE CARD VIEW (sm:hidden) - Modern Ticket Style
                         ======================================================== */}
                      <div className="flex flex-col gap-2.5 sm:hidden">
                        {/* Top: Category Avatar + Org & Title + Deadline Pill */}
                        <div className="flex items-start justify-between gap-2.5">
                          <div className="flex items-start gap-2.5 min-w-0 flex-1">
                            {/* Category Icon */}
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-3xs overflow-hidden mt-0.5 ${
                              job.category === 'govt'
                                ? 'bg-emerald-50/90 dark:bg-emerald-950/40 p-1.5 border border-emerald-200/60 dark:border-emerald-800/50'
                                : 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 text-lg border border-blue-200/60 dark:border-blue-800/50'
                            }`}>
                              {job.category === 'govt' ? (
                                <img
                                  src="/icons/bd-govt-logo.png"
                                  alt="Government of Bangladesh"
                                  className="w-full h-full object-contain"
                                  loading="lazy"
                                />
                              ) : (
                                '🏦'
                              )}
                            </div>

                            {/* Organization & Job Title */}
                            <div className="min-w-0 flex-1">
                              <span className="text-[10.5px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide block truncate">
                                {job.organization}
                              </span>
                              <h3 className="font-bold text-[14px] text-slate-900 dark:text-slate-100 leading-snug line-clamp-2 mt-0.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {job.jobTitle}
                              </h3>
                            </div>
                          </div>

                          {/* Deadline Capsule */}
                          <div className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold flex items-center gap-1 shrink-0 shadow-3xs ${
                            deadlineInfo.isExpired
                              ? 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                              : deadlineInfo.isUrgent
                              ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200/80 dark:border-rose-900/60'
                              : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200/70 dark:border-amber-800/50'
                          }`}>
                            <Clock className="w-3 h-3 shrink-0" />
                            <span>{deadlineInfo.text}</span>
                          </div>
                        </div>

                        {/* Middle: Chips & Badges Row (Stage, Grade, Scale, Fee, Attachments) */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {renderStageBadge(job.stage)}

                          {job.grade && (
                            <span className="text-[10.5px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                              Grade {job.grade}
                            </span>
                          )}

                          {job.scale && (
                            <span className="text-[10.5px] px-2 py-0.5 rounded-md bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-medium">
                              ৳{job.scale}
                            </span>
                          )}

                          {job.applicationFee !== undefined && job.applicationFee > 0 && (
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                              job.isFeePaid
                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60'
                                : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border border-rose-200/70 dark:border-rose-900/60'
                            }`}>
                              {job.isFeePaid ? '✓ Fee Paid' : `💳 Fee: ৳${job.applicationFee}`}
                            </span>
                          )}

                          {job.attachments && job.attachments.length > 0 && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-slate-600 dark:text-slate-400 font-medium bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-200/60 dark:border-slate-700/60">
                              <Paperclip className="w-2.5 h-2.5 text-slate-400" />
                              <span>{job.attachments.length} doc{job.attachments.length > 1 ? 's' : ''}</span>
                            </span>
                          )}
                        </div>

                        {/* Bottom: Exam Date, Roll Number with Copy, and Options Menu */}
                        <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 text-[11px]">
                          <div className="flex items-center gap-2 min-w-0 flex-1 flex-wrap">
                            {job.examDate && (
                              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] font-semibold shadow-3xs bg-[var(--primary-light)] dark:bg-[var(--primary-dark-bg)] text-[var(--primary)] dark:text-[var(--primary-dark-text)] border border-[var(--primary-border)] dark:border-[var(--primary-dark-border)]">
                                <Calendar className="w-3 h-3 text-[var(--primary)] dark:text-[var(--primary-dark-text)]" />
                                <span>Exam: {job.examDate}</span>
                              </div>
                            )}

                            {job.rollNumber && (
                              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10.5px]">
                                <span className="text-slate-400 font-sans">Roll:</span>
                                <strong>{job.rollNumber}</strong>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopy(job.rollNumber!, 'Roll');
                                  }}
                                  className="p-0.5 text-slate-400 hover:text-blue-600 transition-colors ml-0.5 cursor-pointer"
                                  title="Copy Roll Number"
                                >
                                  {copiedKey === `Roll-${job.rollNumber}` ? (
                                    <Check className="w-3 h-3 text-emerald-500" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                            )}

                            {!job.examDate && !job.rollNumber && (
                              <span className="text-[10.5px] text-slate-400">
                                Tap to view full circular details
                              </span>
                            )}
                          </div>

                          {/* Quick 3-Dot Action on Mobile */}
                          <div
                            data-job-menu
                            className="relative flex items-center shrink-0 ml-auto"
                            onClick={e => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => setActiveMenuJobId(activeMenuJobId === `m-${job.id}` ? null : `m-${job.id}`)}
                              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                              title="Options"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            <AnimatePresence>
                              {activeMenuJobId === `m-${job.id}` && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                                  transition={{ duration: 0.15 }}
                                  className="absolute right-0 bottom-full mb-1 w-36 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-1 z-30 flex flex-col gap-0.5 select-none"
                                >
                                  <button
                                    type="button"
                                    onClick={() => {
                                      openEditModal(job);
                                      setActiveMenuJobId(null);
                                    }}
                                    className="w-full px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer transition-colors text-left"
                                  >
                                    <Edit3 className="w-3.5 h-3.5 text-blue-500" />
                                    <span>Edit</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setJobToDelete(job);
                                      setActiveMenuJobId(null);
                                    }}
                                    className="w-full px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 cursor-pointer transition-colors text-left"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Move to Trash</span>
                                  </button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>

                      {/* ========================================================
                          2. DESKTOP ROW VIEW (hidden sm:flex) - Clean Tabular Row
                         ======================================================== */}
                      <div className="hidden sm:flex sm:items-center sm:justify-between sm:gap-3 sm:w-full">
                        {/* Left: Category Icon + Title + Org + Grade */}
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-3xs overflow-hidden ${
                            job.category === 'govt'
                              ? 'bg-emerald-50/70 dark:bg-emerald-950/30 p-1.5 border border-emerald-200/50 dark:border-emerald-800/40'
                              : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 text-base'
                          }`}>
                            {job.category === 'govt' ? (
                              <img
                                src="/icons/bd-govt-logo.png"
                                alt="Government of Bangladesh"
                                className="w-full h-full object-contain"
                                loading="lazy"
                              />
                            ) : (
                              '🏦'
                            )}
                          </div>

                          <div className="flex flex-col min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-xs sm:text-[13px] text-slate-900 dark:text-slate-100 group-hover:text-[#2563EB] transition-colors truncate">
                                {job.jobTitle}
                              </span>
                              {renderStageBadge(job.stage)}
                            </div>

                            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex-wrap">
                              <span className="font-medium text-slate-700 dark:text-slate-300">{job.organization}</span>
                              {job.grade && (
                                <>
                                  <span>•</span>
                                  <span>Grade {job.grade}</span>
                                </>
                              )}
                              {job.scale && (
                                <>
                                  <span>•</span>
                                  <span>৳{job.scale}</span>
                                </>
                              )}
                              {job.applicationFee !== undefined && job.applicationFee > 0 && (
                                <>
                                  <span>•</span>
                                  <span className={`inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                                    job.isFeePaid
                                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60'
                                      : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border border-rose-200/70 dark:border-rose-900/60'
                                  }`}>
                                    {job.isFeePaid ? 'Fee Paid' : `Fee Due: ৳${job.applicationFee}`}
                                  </span>
                                </>
                              )}
                              {job.attachments && job.attachments.length > 0 && (
                                <>
                                  <span>•</span>
                                  <span className="inline-flex items-center gap-1 text-[10px] text-slate-600 dark:text-slate-400 font-medium bg-slate-100 dark:bg-slate-800/80 px-1.5 py-0.2 rounded border border-slate-200/60 dark:border-slate-700/60">
                                    <Paperclip className="w-2.5 h-2.5 text-slate-400" />
                                    <span>{job.attachments.length} doc{job.attachments.length > 1 ? 's' : ''}</span>
                                  </span>
                                </>
                              )}
                            </div>

                            {/* Credentials Snippet if present */}
                            {(job.rollNumber || job.userId) && (
                              <div className="flex items-center gap-3 mt-1 text-[10.5px] font-mono text-slate-600 dark:text-slate-400 bg-slate-100/60 dark:bg-slate-800/60 px-2 py-0.5 rounded w-fit">
                                {job.rollNumber && (
                                  <span className="flex items-center gap-1">
                                    <span className="text-slate-400 font-sans">Roll:</span>
                                    <strong className="text-slate-800 dark:text-slate-200">{job.rollNumber}</strong>
                                  </span>
                                )}
                                {job.userId && (
                                  <span className="flex items-center gap-1">
                                    <span className="text-slate-400 font-sans">User ID:</span>
                                    <span>{job.userId}</span>
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Right: Deadline / Exam info + Actions */}
                        <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                          {/* Exam Date Info if available */}
                          {job.examDate && (
                            <div className="flex flex-col text-left sm:text-right text-xs">
                              <span className="text-[10px] text-slate-400 uppercase font-semibold">Exam Date</span>
                              <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                                <span>{job.examDate}</span>
                              </span>
                            </div>
                          )}

                          {/* Deadline Countdown Tag */}
                          <div className="flex flex-col text-left sm:text-right">
                            <span className="text-[10px] text-slate-400 uppercase font-semibold">Deadline</span>
                            <span className={`inline-flex items-center gap-1 text-xs font-semibold ${
                              deadlineInfo.isExpired
                                ? 'text-slate-400 dark:text-slate-500'
                                : deadlineInfo.isUrgent
                                ? 'text-rose-600 dark:text-rose-400 font-bold'
                                : 'text-slate-700 dark:text-slate-300'
                            }`}>
                              <Clock className="w-3 h-3" />
                              <span>{deadlineInfo.text}</span>
                            </span>
                          </div>

                          {/* 3-Dot Dropdown Menu for Edit & Delete */}
                          <div
                            data-job-menu
                            className="relative flex items-center"
                            onClick={e => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => setActiveMenuJobId(activeMenuJobId === job.id ? null : job.id)}
                              className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer ${
                                activeMenuJobId === job.id
                                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
                                  : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                              }`}
                              title="More options"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            <AnimatePresence>
                              {activeMenuJobId === job.id && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                                  transition={{ duration: 0.15 }}
                                  className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-1 z-30 flex flex-col gap-0.5 select-none"
                                >
                                  <button
                                    type="button"
                                    onClick={() => {
                                      openEditModal(job);
                                      setActiveMenuJobId(null);
                                    }}
                                    className="w-full px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer transition-colors text-left"
                                  >
                                    <Edit3 className="w-3.5 h-3.5 text-blue-500" />
                                    <span>Edit Circular</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setJobToDelete(job);
                                      setActiveMenuJobId(null);
                                    }}
                                    className="w-full px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 cursor-pointer transition-colors text-left"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Move to Trash</span>
                                  </button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. JOB DETAILS DRAWER (Slide in from Right) */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {detailsJob && (
            <div className="fixed inset-0 z-[99990] overflow-hidden pointer-events-none">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setDetailsJob(null)}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs pointer-events-auto"
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg bg-white dark:bg-slate-900 border-l border-slate-200/80 dark:border-slate-800 shadow-2xl flex flex-col select-none overflow-hidden pointer-events-auto"
              >
              {/* Drawer Header (Clean Title & Close Button Only) */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 p-1.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-800/40">
                    {detailsJob.category === 'govt' ? (
                      <img
                        src="/icons/bd-govt-logo.png"
                        alt="Government of Bangladesh"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-xl">🏦</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300">
                        {detailsJob.category === 'govt' ? 'Government' : 'Bank'}
                      </span>
                      {detailsJob.jobType && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full capitalize bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {detailsJob.jobType}
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif font-bold text-base text-slate-900 dark:text-slate-100 leading-snug mt-0.5 truncate" title={detailsJob.jobTitle}>
                      {detailsJob.jobTitle}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{detailsJob.organization}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setDetailsJob(null)}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer shrink-0"
                  title="Close preview"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Scroll Body - Pure Read-only Display */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-4 text-xs">
                {/* 1. Status & Deadline Highlight Banner */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Current Stage Badge Display */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col gap-1.5 justify-between">
                    <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">
                      Application Stage
                    </span>
                    <div className="pt-0.5">
                      {renderStageBadge(detailsJob.stage)}
                    </div>
                  </div>

                  {/* Application Deadline */}
                  {(() => {
                    const deadlineInfo = getDaysLeft(detailsJob.applicationDeadline);
                    return (
                      <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col gap-1 justify-between">
                        <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
                          <Clock className="w-3 h-3 text-blue-500" />
                          Application Deadline
                        </span>
                        <div>
                          <div className="font-bold text-slate-800 dark:text-slate-100 text-xs">
                            {detailsJob.applicationDeadline || 'No deadline set'}
                          </div>
                          <span className={`inline-block text-[11px] font-semibold mt-0.5 ${
                            deadlineInfo.isExpired
                              ? 'text-slate-400 dark:text-slate-500'
                              : deadlineInfo.isUrgent
                              ? 'text-rose-600 dark:text-rose-400 font-bold'
                              : 'text-blue-600 dark:text-blue-400'
                          }`}>
                            {deadlineInfo.text}
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* 2. Position Details: Grade, Pay Scale, Application Fee */}
                <div className="p-3.5 bg-slate-50/70 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col gap-2.5">
                  <span className="font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[10.5px]">
                    Pay Scale & Fee Information
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/70 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-medium">Pay Grade</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {detailsJob.grade ? `Grade ${detailsJob.grade}` : '9th Grade'}
                      </span>
                    </div>

                    <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/70 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-medium">National Scale</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono text-[11px] truncate block" title={detailsJob.scale}>
                        {detailsJob.scale ? `৳${detailsJob.scale}` : '22,000 - 53,060'}
                      </span>
                    </div>

                    <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/70 dark:border-slate-800 col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-slate-400 block font-medium">Application Fee</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          ৳{detailsJob.applicationFee ?? 0}
                        </span>
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                          detailsJob.isFeePaid
                            ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200/60'
                        }`}>
                          {detailsJob.isFeePaid ? 'Paid ✓' : 'Unpaid'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Credentials Vault (Clean Header, Copy with Animated Feedback) */}
                <div className="p-3.5 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl border border-blue-200/60 dark:border-blue-900/40 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-950 dark:text-blue-200 text-xs">
                      Credentials Vault
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {/* Roll Number */}
                    <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 flex items-center justify-between shadow-3xs">
                      <div className="truncate mr-1">
                        <div className="text-[10px] text-slate-400 font-medium">Roll Number</div>
                        <div className="font-mono font-bold text-slate-800 dark:text-slate-200 truncate">
                          {detailsJob.rollNumber || '—'}
                        </div>
                      </div>
                      {detailsJob.rollNumber && (
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(detailsJob.rollNumber!);
                            setCopiedField('roll');
                            setTimeout(() => setCopiedField(null), 1800);
                          }}
                          className="px-1.5 py-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded transition-colors cursor-pointer shrink-0 flex items-center gap-1 text-[10.5px]"
                          title="Copy Roll"
                        >
                          {copiedField === 'roll' ? (
                            <motion.span
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Copied</span>
                            </motion.span>
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* User ID */}
                    <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 flex items-center justify-between shadow-3xs">
                      <div className="truncate mr-1">
                        <div className="text-[10px] text-slate-400 font-medium">User ID</div>
                        <div className="font-mono font-bold text-slate-800 dark:text-slate-200 truncate">
                          {detailsJob.userId || '—'}
                        </div>
                      </div>
                      {detailsJob.userId && (
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(detailsJob.userId!);
                            setCopiedField('userId');
                            setTimeout(() => setCopiedField(null), 1800);
                          }}
                          className="px-1.5 py-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded transition-colors cursor-pointer shrink-0 flex items-center gap-1 text-[10.5px]"
                          title="Copy User ID"
                        >
                          {copiedField === 'userId' ? (
                            <motion.span
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Copied</span>
                            </motion.span>
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Password */}
                    <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 flex items-center justify-between shadow-3xs">
                      <div className="truncate mr-1">
                        <div className="text-[10px] text-slate-400 font-medium">Password</div>
                        <div className="font-mono font-bold text-slate-800 dark:text-slate-200 truncate">
                          {detailsJob.password
                            ? showDrawerPassword
                              ? detailsJob.password
                              : '••••••••'
                            : '—'}
                        </div>
                      </div>
                      {detailsJob.password && (
                        <div className="flex items-center gap-0.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => setShowDrawerPassword(prev => !prev)}
                            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded transition-colors cursor-pointer"
                            title={showDrawerPassword ? 'Hide password' : 'Show password'}
                          >
                            {showDrawerPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(detailsJob.password!);
                              setCopiedField('password');
                              setTimeout(() => setCopiedField(null), 1800);
                            }}
                            className="px-1.5 py-1 text-slate-400 hover:text-blue-600 rounded transition-colors cursor-pointer flex items-center gap-1 text-[10.5px]"
                            title="Copy Password"
                          >
                            {copiedField === 'password' ? (
                              <motion.span
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Copied</span>
                              </motion.span>
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 4. Exam Schedule & Venue */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col gap-2">
                  <span className="font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[10.5px] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                    Exam Schedule & Venue
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/70 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-medium">Exam Date & Time</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                        {detailsJob.examDate ? (
                          <>
                            {detailsJob.examDate}
                            {detailsJob.examTime && <span className="font-normal text-slate-500 ml-1">({detailsJob.examTime})</span>}
                          </>
                        ) : (
                          <span className="text-slate-400 font-normal italic">Not declared yet</span>
                        )}
                      </span>
                    </div>
                    <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/70 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-medium">Exam Venue / Center</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block truncate" title={detailsJob.examVenue}>
                        {detailsJob.examVenue || <span className="text-slate-400 font-normal italic">Venue not announced</span>}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 5. Documents & Attachments Hub (Pure Read-only with Open in New Tab & Copy Link) */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col gap-2.5">
                  <span className="font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[10.5px] flex items-center gap-1.5">
                    <Paperclip className="w-3.5 h-3.5 text-blue-500" />
                    Attached Documents ({detailsJob.attachments?.length || 0})
                  </span>

                  {detailsJob.attachments && detailsJob.attachments.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {detailsJob.attachments.map(att => {
                        const isCloudUploaded = att.url.includes('cloudinary') || att.url.includes('firebasestorage');
                        const isDriveOrWeb = (att.url.startsWith('http://') || att.url.startsWith('https://')) && !isCloudUploaded;
                        return (
                          <div
                            key={att.id}
                            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 flex items-center justify-between hover:border-blue-400 transition-colors shadow-3xs"
                          >
                            <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/80 flex items-center justify-center text-blue-600 shrink-0">
                                {isDriveOrWeb ? <Globe className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                              </div>
                              <div className="truncate flex-1">
                                <div className="font-semibold text-slate-800 dark:text-slate-200 truncate text-xs">
                                  {att.name}
                                </div>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[9.5px] px-1.5 py-0.2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded font-medium uppercase">
                                    {att.type.replace('_', ' ')}
                                  </span>
                                  <span className="text-[10px] text-slate-400">
                                    {att.url.startsWith('idb://')
                                      ? 'Offline Storage'
                                      : isCloudUploaded
                                      ? 'Cloud Storage'
                                      : 'Web / Drive Link'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              {/* Open in New Tab */}
                              <button
                                type="button"
                                onClick={() => openAttachmentDocument(att.url)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/60 rounded-lg transition-colors cursor-pointer"
                                title="Open in New Tab"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </button>

                              {/* Copy Link with Animated Feedback */}
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(att.url);
                                  setCopiedField(`doc_${att.id}`);
                                  setTimeout(() => setCopiedField(null), 1800);
                                }}
                                className="px-1.5 py-1 text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-[10.5px]"
                                title="Copy document URL"
                              >
                                {copiedField === `doc_${att.id}` ? (
                                  <motion.span
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Copied</span>
                                  </motion.span>
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center flex flex-col items-center justify-center gap-1 text-slate-400">
                      <Paperclip className="w-5 h-5 opacity-40" />
                      <span className="text-[11px]">No circular notice, admit card, or document attached.</span>
                    </div>
                  )}
                </div>

                {/* 6. Personal Notes / Study Plan */}
                {detailsJob.notes && (
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col gap-1.5">
                    <span className="font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[10px]">
                      Personal Notes & Study Strategy
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed whitespace-pre-wrap">
                      {detailsJob.notes}
                    </p>
                  </div>
                )}

                {/* Timestamps Info */}
                <div className="flex items-center justify-between text-[10.5px] text-slate-400 px-1 pt-1">
                  <span>Created: {new Date(detailsJob.createdAt).toLocaleDateString()}</span>
                  {detailsJob.updatedAt && (
                    <span>Last modified: {new Date(detailsJob.updatedAt).toLocaleDateString()}</span>
                  )}
                </div>
              </div>

              {/* Drawer Footer Actions - Single Edit Button Here */}
              <div className="p-3.5 px-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/60 dark:bg-slate-900/60">
                <button
                  type="button"
                  onClick={() => {
                    setJobToDelete(detailsJob);
                    setDetailsJob(null);
                  }}
                  className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                >
                  Delete Circular
                </button>

                <button
                  type="button"
                  onClick={() => {
                    openEditModal(detailsJob);
                    setDetailsJob(null);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Circular</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
      document.body
    )}

      {/* 5. ADD / EDIT CIRCULAR MODAL */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isAddEditModalOpen && (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const formData = new FormData(form);

                  const trimmedTitle = modalJobTitle.trim() || (formData.get('jobTitle') as string)?.trim();
                  if (!trimmedTitle) {
                    showToast('Please enter a Job Title');
                    return;
                  }

                  const trimmedOrg = modalOrganization.trim() || (formData.get('organization') as string)?.trim();
                  if (!trimmedOrg) {
                    showToast('Please enter Organization / Ministry name');
                    return;
                  }

                  const isUploadingAttachments = modalAttachments.some(att => att.status === 'uploading');
                  if (isUploadingAttachments) {
                    showToast('⏳ Please wait for file uploads to finish');
                    return;
                  }

                  const jobPayload = {
                    category: modalCategory,
                    jobTitle: trimmedTitle,
                    organization: trimmedOrg,
                    grade: modalGrade || '9th',
                    scale: modalScale.trim() || (formData.get('scale') as string)?.trim() || '',
                    jobType: (formData.get('jobType') as any) || 'permanent',
                    applicationDeadline: modalDeadline || new Date().toISOString().split('T')[0],
                    stage: modalStage,
                    userId: (formData.get('userId') as string)?.trim() || '',
                    password: (formData.get('password') as string)?.trim() || '',
                    rollNumber: (formData.get('rollNumber') as string)?.trim() || '',
                    examDate: modalExamDate || (formData.get('examDate') as string) || '',
                    examTime: (formData.get('examTime') as string) || '',
                    examVenue: (formData.get('examVenue') as string)?.trim() || '',
                    applicationFee: parseFloat(formData.get('applicationFee') as string) || 0,
                    isFeePaid: modalIsFeePaid,
                    notes: (formData.get('notes') as string)?.trim() || '',
                    attachments: modalAttachments,
                  };

                  if (editingJob) {
                    handleUpdate({
                      ...editingJob,
                      ...jobPayload,
                      updatedAt: Date.now(),
                    });
                  } else {
                    handleAdd(jobPayload);
                  }
                  setIsAddEditModalOpen(false);
                }}
                className="flex flex-col h-full overflow-hidden"
              >
                {/* Modal Header */}
                <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
                  <h3 className="font-serif font-bold text-base text-slate-900 dark:text-slate-100">
                    {editingJob ? 'Edit Job Circular' : 'Add New Job Circular'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsAddEditModalOpen(false)}
                    className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-md"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Form Inputs Scrollable Body */}
                <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 text-xs">
                  {/* Category Selection */}
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Category *</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setModalCategory('govt')}
                        className={`flex items-center gap-2 p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                          modalCategory === 'govt'
                            ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold shadow-xs ring-1 ring-blue-400/30'
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <img
                          src="/icons/bd-govt-logo.png"
                          alt="Govt"
                          className="w-4 h-4 object-contain shrink-0"
                        />
                        <span className="font-medium">Government</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setModalCategory('bank')}
                        className={`flex items-center gap-2 p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                          modalCategory === 'bank'
                            ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold shadow-xs ring-1 ring-emerald-400/30'
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span>🏦</span>
                        <span className="font-medium">Bank</span>
                      </button>
                    </div>
                  </div>

                  {/* Job Title & Organization */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Job Title with Smart Keyword Suggestions */}
                    <div className="flex flex-col gap-1 relative" data-title-suggestions>
                      <div className="flex items-center justify-between">
                        <label className="font-semibold text-slate-700 dark:text-slate-300">Job Title *</label>
                        {modalJobTitle && (
                          <span className="text-[10px] text-slate-400 font-normal">
                            {filteredJobTitleSuggestions.length} suggestions
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          name="jobTitle"
                          required
                          value={modalJobTitle}
                          onChange={(e) => {
                            setModalJobTitle(e.target.value);
                            setIsTitleSuggestionsOpen(true);
                            setActiveTitleIndex(-1);
                          }}
                          onFocus={() => {
                            setIsTitleSuggestionsOpen(true);
                            setActiveTitleIndex(-1);
                          }}
                          onKeyDown={(e) => {
                            if (!isTitleSuggestionsOpen || filteredJobTitleSuggestions.length === 0) {
                              if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                                setIsTitleSuggestionsOpen(true);
                                setActiveTitleIndex(0);
                                e.preventDefault();
                              }
                              return;
                            }

                            if (e.key === 'ArrowDown') {
                              e.preventDefault();
                              setActiveTitleIndex(prev => {
                                const next = prev < filteredJobTitleSuggestions.length - 1 ? prev + 1 : 0;
                                const el = document.getElementById(`title-suggestion-item-${next}`);
                                if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                                return next;
                              });
                            } else if (e.key === 'ArrowUp') {
                              e.preventDefault();
                              setActiveTitleIndex(prev => {
                                const next = prev > 0 ? prev - 1 : filteredJobTitleSuggestions.length - 1;
                                const el = document.getElementById(`title-suggestion-item-${next}`);
                                if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                                return next;
                              });
                            } else if (e.key === 'Enter') {
                              if (activeTitleIndex >= 0 && activeTitleIndex < filteredJobTitleSuggestions.length) {
                                e.preventDefault();
                                setModalJobTitle(filteredJobTitleSuggestions[activeTitleIndex]);
                                setIsTitleSuggestionsOpen(false);
                                setActiveTitleIndex(-1);
                              }
                            } else if (e.key === 'Escape') {
                              e.preventDefault();
                              setIsTitleSuggestionsOpen(false);
                              setActiveTitleIndex(-1);
                            }
                          }}
                          placeholder="e.g. সহকারী পরিচালক, সিনিয়র অফিসার"
                          autoComplete="off"
                          className="w-full h-9 px-[14px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-lg outline-none font-medium text-[14px] text-slate-800 dark:text-slate-100 transition-colors"
                        />
                        {modalJobTitle && (
                          <button
                            type="button"
                            onClick={() => {
                              setModalJobTitle('');
                              setIsTitleSuggestionsOpen(true);
                              setActiveTitleIndex(-1);
                            }}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Smart Suggestion Dropdown */}
                      <AnimatePresence>
                        {isTitleSuggestionsOpen && filteredJobTitleSuggestions.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: -4, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -4, scale: 0.98 }}
                            transition={{ duration: 0.12 }}
                            className="absolute left-0 top-[102%] z-50 w-full max-h-52 overflow-y-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-1 flex flex-col"
                          >
                            <div className="px-3 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                              <span>Suggested Titles</span>
                              <span className="font-normal text-[9.5px]">Use ↑↓ arrows & Enter</span>
                            </div>
                            {filteredJobTitleSuggestions.map((suggestion, idx) => {
                              const isExactMatch = modalJobTitle.trim().toLowerCase() === suggestion.toLowerCase();
                              const isKeyboardActive = activeTitleIndex === idx;
                              return (
                                <button
                                  key={`${suggestion}-${idx}`}
                                  id={`title-suggestion-item-${idx}`}
                                  type="button"
                                  onMouseEnter={() => setActiveTitleIndex(idx)}
                                  onClick={() => {
                                    setModalJobTitle(suggestion);
                                    setIsTitleSuggestionsOpen(false);
                                    setActiveTitleIndex(-1);
                                  }}
                                  className={`px-3 py-2 text-left text-[14px] transition-colors flex items-center justify-between cursor-pointer ${
                                    isKeyboardActive
                                      ? 'bg-blue-100/90 dark:bg-blue-900/60 text-blue-700 dark:text-blue-200 font-semibold'
                                      : isExactMatch
                                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold'
                                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200'
                                  }`}
                                >
                                  <span className="truncate">{suggestion}</span>
                                  {isExactMatch && <Check className="w-4 h-4 text-blue-500 shrink-0 ml-1" />}
                                </button>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Organization / Ministry with Smart Keyword Suggestions */}
                    <div className="flex flex-col gap-1 relative" data-org-suggestions>
                      <div className="flex items-center justify-between">
                        <label className="font-semibold text-slate-700 dark:text-slate-300">Organization / Ministry *</label>
                        {modalOrganization && (
                          <span className="text-[10px] text-slate-400 font-normal">
                            {filteredOrganizationSuggestions.length} suggestions
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          name="organization"
                          required
                          value={modalOrganization}
                          onChange={(e) => {
                            setModalOrganization(e.target.value);
                            setIsOrgSuggestionsOpen(true);
                            setActiveOrgIndex(-1);
                          }}
                          onFocus={() => {
                            setIsOrgSuggestionsOpen(true);
                            setActiveOrgIndex(-1);
                          }}
                          onKeyDown={(e) => {
                            if (!isOrgSuggestionsOpen || filteredOrganizationSuggestions.length === 0) {
                              if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                                setIsOrgSuggestionsOpen(true);
                                setActiveOrgIndex(0);
                                e.preventDefault();
                              }
                              return;
                            }

                            if (e.key === 'ArrowDown') {
                              e.preventDefault();
                              setActiveOrgIndex(prev => {
                                const next = prev < filteredOrganizationSuggestions.length - 1 ? prev + 1 : 0;
                                const el = document.getElementById(`org-suggestion-item-${next}`);
                                if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                                return next;
                              });
                            } else if (e.key === 'ArrowUp') {
                              e.preventDefault();
                              setActiveOrgIndex(prev => {
                                const next = prev > 0 ? prev - 1 : filteredOrganizationSuggestions.length - 1;
                                const el = document.getElementById(`org-suggestion-item-${next}`);
                                if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                                return next;
                              });
                            } else if (e.key === 'Enter') {
                              if (activeOrgIndex >= 0 && activeOrgIndex < filteredOrganizationSuggestions.length) {
                                e.preventDefault();
                                setModalOrganization(filteredOrganizationSuggestions[activeOrgIndex]);
                                setIsOrgSuggestionsOpen(false);
                                setActiveOrgIndex(-1);
                              }
                            } else if (e.key === 'Escape') {
                              e.preventDefault();
                              setIsOrgSuggestionsOpen(false);
                              setActiveOrgIndex(-1);
                            }
                          }}
                          placeholder="e.g. সোনালী ব্যাংক, অর্থ মন্ত্রণালয়"
                          autoComplete="off"
                          className="w-full h-9 px-[14px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-lg outline-none font-medium text-[14px] text-slate-800 dark:text-slate-100 transition-colors"
                        />
                        {modalOrganization && (
                          <button
                            type="button"
                            onClick={() => {
                              setModalOrganization('');
                              setIsOrgSuggestionsOpen(true);
                              setActiveOrgIndex(-1);
                            }}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Smart Suggestion Dropdown for Organization */}
                      <AnimatePresence>
                        {isOrgSuggestionsOpen && filteredOrganizationSuggestions.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: -4, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -4, scale: 0.98 }}
                            transition={{ duration: 0.12 }}
                            className="absolute left-0 top-[102%] z-50 w-full max-h-52 overflow-y-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-1 flex flex-col"
                          >
                            <div className="px-3 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                              <span>Suggested Organizations</span>
                              <span className="font-normal text-[9.5px]">Use ↑↓ arrows & Enter</span>
                            </div>
                            {filteredOrganizationSuggestions.map((suggestion, idx) => {
                              const isExactMatch = modalOrganization.trim().toLowerCase() === suggestion.toLowerCase();
                              const isKeyboardActive = activeOrgIndex === idx;
                              return (
                                <button
                                  key={`${suggestion}-${idx}`}
                                  id={`org-suggestion-item-${idx}`}
                                  type="button"
                                  onMouseEnter={() => setActiveOrgIndex(idx)}
                                  onClick={() => {
                                    setModalOrganization(suggestion);
                                    setIsOrgSuggestionsOpen(false);
                                    setActiveOrgIndex(-1);
                                  }}
                                  className={`px-3 py-2 text-left text-[14px] transition-colors flex items-center justify-between cursor-pointer ${
                                    isKeyboardActive
                                      ? 'bg-blue-100/90 dark:bg-blue-900/60 text-blue-700 dark:text-blue-200 font-semibold'
                                      : isExactMatch
                                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold'
                                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200'
                                  }`}
                                >
                                  <span className="truncate">{suggestion}</span>
                                  {isExactMatch && <Check className="w-4 h-4 text-blue-500 shrink-0 ml-1" />}
                                </button>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Grade, Scale & Deadline */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {/* Premium Grade Dropdown */}
                    <div className="flex flex-col gap-1 relative" data-custom-grade-dropdown>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 text-[11px]">Grade</label>
                      <button
                        type="button"
                        onClick={() => setIsGradeDropdownOpen(prev => !prev)}
                        className="h-9 px-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 rounded-lg outline-none font-medium flex items-center justify-between transition-all shadow-xs"
                      >
                        <span className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-blue-500" />
                          {modalGrade} Grade
                        </span>
                        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isGradeDropdownOpen ? 'rotate-180 text-blue-500' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {isGradeDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -6, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.98 }}
                            transition={{ duration: 0.15 }}
                            className="absolute left-0 top-[102%] z-50 w-full min-w-[210px] max-h-56 overflow-y-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-1.5 flex flex-col"
                          >
                            <div className="px-3 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/80 mb-1">
                              National Pay Scale Grade
                            </div>
                            {Array.from({ length: 12 }, (_, i) => i + 9).map(num => {
                              const gradeKey = `${num}th`;
                              const isSelected = modalGrade === gradeKey;
                              const scalePreview = BD_NATIONAL_PAY_SCALES[gradeKey];
                              return (
                                <button
                                  key={gradeKey}
                                  type="button"
                                  onClick={() => {
                                    setModalGrade(gradeKey);
                                    if (BD_NATIONAL_PAY_SCALES[gradeKey]) {
                                      setModalScale(BD_NATIONAL_PAY_SCALES[gradeKey]);
                                    }
                                    setIsGradeDropdownOpen(false);
                                  }}
                                  className={`px-3 py-2 text-left flex items-center justify-between transition-colors ${
                                    isSelected
                                      ? 'bg-blue-50/80 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold'
                                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200'
                                  }`}
                                >
                                  <div className="flex flex-col">
                                    <span className="text-xs font-semibold">{gradeKey} Grade</span>
                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">৳ {scalePreview}</span>
                                  </div>
                                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                                </button>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Pay Scale with Auto-fill and Manual Edit + Select All on Click */}
                    <div className="flex flex-col gap-1">
                      <label className="font-semibold text-slate-700 dark:text-slate-300 text-[11px]">Pay Scale (৳)</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="scale"
                          value={modalScale}
                          onChange={(e) => setModalScale(e.target.value)}
                          onFocus={(e) => e.currentTarget.select()}
                          placeholder="e.g. 22,000 - 53,060"
                          title="Click to edit pay scale. Auto-fills with Bangladesh National Pay Scale when grade changes."
                          className="w-full h-9 pl-3 pr-8 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-lg outline-none font-medium font-mono text-[14px] text-slate-800 dark:text-slate-100 transition-colors shadow-xs"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (BD_NATIONAL_PAY_SCALES[modalGrade]) {
                              setModalScale(BD_NATIONAL_PAY_SCALES[modalGrade]);
                              showToast(`Reset pay scale to ${modalGrade} Grade default`);
                            }
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 text-[10px] font-medium"
                          title="Reset to Grade official scale"
                        >
                          Reset
                        </button>
                      </div>
                    </div>

                    {/* Deadline with Premium Date Picker */}
                    <div className="flex flex-col gap-1 relative" data-deadline-picker>
                      <div className="flex items-center justify-between">
                        <label className="font-semibold text-slate-700 dark:text-slate-300 text-[11px]">Deadline *</label>
                        {modalDeadline && (
                          <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full ${
                            getDaysLeft(modalDeadline).isExpired
                              ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                              : getDaysLeft(modalDeadline).isUrgent
                              ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 animate-pulse'
                              : 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
                          }`}>
                            {getDaysLeft(modalDeadline).text}
                          </span>
                        )}
                      </div>

                      {/* Hidden standard input for form compatibility */}
                      <input type="hidden" name="applicationDeadline" value={modalDeadline} />

                      {/* Trigger Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsDeadlinePickerOpen(prev => !prev);
                          setIsExamDatePickerOpen(false);
                          if (modalDeadline) setDeadlineViewMonth(new Date(modalDeadline));
                        }}
                        className={`w-full h-9 px-3 bg-slate-50 dark:bg-slate-800/80 border ${
                          isDeadlinePickerOpen
                            ? 'border-blue-500 ring-2 ring-blue-500/20'
                            : 'border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500'
                        } rounded-lg outline-none font-medium flex items-center justify-between transition-all shadow-xs cursor-pointer text-left`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Calendar className={`w-3.5 h-3.5 shrink-0 ${isDeadlinePickerOpen ? 'text-blue-500' : 'text-slate-400'}`} />
                          <span className="text-[13px] font-semibold text-slate-800 dark:text-slate-100 truncate">
                            {modalDeadline ? formatDisplayDate(modalDeadline) : 'Select deadline'}
                          </span>
                        </div>
                        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${isDeadlinePickerOpen ? 'rotate-180 text-blue-500' : ''}`} />
                      </button>

                      {/* Animated Calendar Popover */}
                      <AnimatePresence>
                        {isDeadlinePickerOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -6, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.98 }}
                            transition={{ duration: 0.15 }}
                            className="absolute left-0 sm:right-0 sm:left-auto top-[102%] z-50 w-72 sm:w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-3 flex flex-col gap-2"
                          >
                            {/* Calendar Header */}
                            <div className="flex items-center justify-between">
                              <button
                                type="button"
                                onClick={() => {
                                  setDeadlineViewMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
                                }}
                                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                {deadlineViewMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setDeadlineViewMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
                                }}
                                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Weekday headers */}
                            <div className="grid grid-cols-7 gap-1 text-center">
                              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                <span key={day} className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                                  {day}
                                </span>
                              ))}
                            </div>

                            {/* Calendar Days Matrix */}
                            <div className="grid grid-cols-7 gap-1">
                              {(() => {
                                const year = deadlineViewMonth.getFullYear();
                                const month = deadlineViewMonth.getMonth();
                                const firstDay = new Date(year, month, 1).getDay();
                                const daysInMonth = new Date(year, month + 1, 0).getDate();
                                const todayStr = new Date().toISOString().split('T')[0];

                                const cells = [];
                                for (let i = 0; i < firstDay; i++) {
                                  cells.push(<div key={`empty-${i}`} className="h-7" />);
                                }
                                for (let day = 1; day <= daysInMonth; day++) {
                                  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                  const isSelected = modalDeadline === dateStr;
                                  const isToday = todayStr === dateStr;

                                  cells.push(
                                    <button
                                      key={dateStr}
                                      type="button"
                                      onClick={() => {
                                        setModalDeadline(dateStr);
                                        setIsDeadlinePickerOpen(false);
                                      }}
                                      className={`h-7 w-full rounded-lg text-xs font-medium transition-all flex items-center justify-center cursor-pointer ${
                                        isSelected
                                          ? 'bg-blue-600 text-white font-bold shadow-xs'
                                          : isToday
                                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold border border-blue-300 dark:border-blue-700'
                                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                                      }`}
                                    >
                                      {day}
                                    </button>
                                  );
                                }
                                return cells;
                              })()}
                            </div>

                            {/* Footer: Today & Clear */}
                            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                              <button
                                type="button"
                                onClick={() => {
                                  const todayStr = new Date().toISOString().split('T')[0];
                                  setModalDeadline(todayStr);
                                  setDeadlineViewMonth(new Date());
                                  setIsDeadlinePickerOpen(false);
                                }}
                                className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                              >
                                Today
                              </button>
                              <button
                                type="button"
                                onClick={() => setIsDeadlinePickerOpen(false)}
                                className="text-[11px] font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                              >
                                Close
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Stage Selection - Premium Custom Dropdown */}
                  <div className="flex flex-col gap-1 relative" data-custom-stage-dropdown>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 text-[11px]">Current Status / Stage</label>
                    <button
                      type="button"
                      onClick={() => setIsStageDropdownOpen(prev => !prev)}
                      className="h-9 px-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 rounded-lg outline-none font-medium flex items-center justify-between transition-all shadow-xs"
                    >
                      <div className="flex items-center gap-2">
                        {renderStageBadge(modalStage)}
                      </div>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isStageDropdownOpen ? 'rotate-180 text-blue-500' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isStageDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -6, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -6, scale: 0.98 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-0 top-[102%] z-50 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-1.5 flex flex-col gap-0.5"
                        >
                          {(
                            [
                              { value: 'not_applied', label: 'Not Applied', desc: 'Planning to submit before deadline' },
                              { value: 'applied', label: 'Applied', desc: 'Application fee and form completed' },
                              { value: 'prelim', label: 'Prelim / MCQ', desc: 'Waiting or appeared for Preliminary test' },
                              { value: 'written', label: 'Written Stage', desc: 'Qualified prelim, written exam stage' },
                              { value: 'viva', label: 'Viva / Interview', desc: 'Facing oral interview / viva voce' },
                              { value: 'selected', label: 'Selected', desc: 'Final recommendation / appointment' },
                            ] as const
                          ).map(item => {
                            const isSelected = modalStage === item.value;
                            return (
                              <button
                                key={item.value}
                                type="button"
                                onClick={() => {
                                  setModalStage(item.value);
                                  setIsStageDropdownOpen(false);
                                }}
                                className={`px-3 py-2 text-left flex items-center justify-between transition-colors ${
                                  isSelected
                                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold'
                                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200'
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  {renderStageBadge(item.value)}
                                  <span className="text-[11px] text-slate-400 dark:text-slate-500 hidden sm:inline">{item.desc}</span>
                                </div>
                                {isSelected && <Check className="w-3.5 h-3.5 text-slate-900 dark:text-slate-100 shrink-0" />}
                              </button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Fee & Payment Status */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50/70 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-800">
                    <div className="flex flex-col gap-1">
                      <label className="font-semibold text-slate-700 dark:text-slate-300 text-[11px]">Application Fee (৳)</label>
                      <input
                        type="number"
                        name="applicationFee"
                        defaultValue={editingJob?.applicationFee || ''}
                        placeholder="e.g. 500"
                        className="h-8 px-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md outline-none text-[14px]"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-semibold text-slate-700 dark:text-slate-300 text-[11px]">Fee Payment Status</label>
                      <div className="grid grid-cols-2 gap-1.5 h-8">
                        {/* Paid Option */}
                        <button
                          type="button"
                          onClick={() => setModalIsFeePaid(true)}
                          className={`flex items-center justify-center gap-1.5 px-2 py-1 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                            modalIsFeePaid
                              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-400/30'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                          }`}
                        >
                          <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                            modalIsFeePaid ? 'bg-emerald-500 text-white' : 'border border-slate-300 dark:border-slate-600'
                          }`}>
                            {modalIsFeePaid ? '✓' : ''}
                          </span>
                          <span>Paid</span>
                        </button>

                        {/* Unpaid Option */}
                        <button
                          type="button"
                          onClick={() => setModalIsFeePaid(false)}
                          className={`flex items-center justify-center gap-1.5 px-2 py-1 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                            !modalIsFeePaid
                              ? 'bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-300 ring-1 ring-amber-400/30'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                          }`}
                        >
                          <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                            !modalIsFeePaid ? 'bg-amber-500 text-white' : 'border border-slate-300 dark:border-slate-600'
                          }`}>
                            {!modalIsFeePaid ? '✓' : ''}
                          </span>
                          <span>Unpaid</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Conditional: Credentials, Exam Date & Venue only when Applied or beyond */}
                  {modalStage !== 'not_applied' && (
                    <div className="flex flex-col gap-3 p-3 bg-blue-50/40 dark:bg-blue-950/20 rounded-xl border border-blue-200/60 dark:border-blue-900/40">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">Post-Application & Exam Info</span>
                      </div>

                      {/* Roll & User ID */}
                      <div className="flex flex-col gap-1.5">
                        <span className="font-semibold text-slate-600 dark:text-slate-400 text-[11px]">Credentials (Roll / User ID)</span>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            name="rollNumber"
                            defaultValue={editingJob?.rollNumber}
                            placeholder="Roll Number"
                            className="h-8 px-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md outline-none text-[14px]"
                          />
                          <input
                            type="text"
                            name="userId"
                            defaultValue={editingJob?.userId}
                            placeholder="User ID / Reg No"
                            className="h-8 px-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md outline-none text-[14px]"
                          />
                        </div>
                      </div>

                      {/* Exam Date & Venue */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1 relative" data-exam-date-picker>
                          <div className="flex items-center justify-between">
                            <label className="font-semibold text-slate-700 dark:text-slate-300 text-[11px]">Exam Date (If declared)</label>
                            {modalExamDate && (
                              <button
                                type="button"
                                onClick={() => setModalExamDate('')}
                                className="text-[10px] text-rose-500 hover:text-rose-600 font-medium hover:underline"
                              >
                                Clear
                              </button>
                            )}
                          </div>

                          {/* Hidden standard input for form compatibility */}
                          <input type="hidden" name="examDate" value={modalExamDate} />

                          {/* Trigger Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setIsExamDatePickerOpen(prev => !prev);
                              setIsDeadlinePickerOpen(false);
                              if (modalExamDate) setExamViewMonth(new Date(modalExamDate));
                            }}
                            className={`w-full h-9 px-3 bg-white dark:bg-slate-900 border ${
                              isExamDatePickerOpen
                                ? 'border-purple-500 ring-2 ring-purple-500/20'
                                : 'border-slate-200 dark:border-slate-700 hover:border-purple-400 dark:hover:border-purple-500'
                            } rounded-lg outline-none font-medium flex items-center justify-between transition-all shadow-xs cursor-pointer text-left`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <Calendar className={`w-3.5 h-3.5 shrink-0 ${isExamDatePickerOpen ? 'text-purple-500' : 'text-slate-400'}`} />
                              <span className="text-[13px] font-semibold text-slate-800 dark:text-slate-100 truncate">
                                {modalExamDate ? formatDisplayDate(modalExamDate) : 'Not announced yet'}
                              </span>
                            </div>
                            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${isExamDatePickerOpen ? 'rotate-180 text-purple-500' : ''}`} />
                          </button>

                          {/* Animated Calendar Popover */}
                          <AnimatePresence>
                            {isExamDatePickerOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                                transition={{ duration: 0.15 }}
                                className="absolute left-0 top-[102%] z-50 w-72 sm:w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-3 flex flex-col gap-2"
                              >
                                {/* Calendar Header */}
                                <div className="flex items-center justify-between">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setExamViewMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
                                    }}
                                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                                  >
                                    <ChevronLeft className="w-4 h-4" />
                                  </button>
                                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                    {examViewMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setExamViewMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
                                    }}
                                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                                  >
                                    <ChevronRight className="w-4 h-4" />
                                  </button>
                                </div>

                                {/* Weekday headers */}
                                <div className="grid grid-cols-7 gap-1 text-center">
                                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                    <span key={day} className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                                      {day}
                                    </span>
                                  ))}
                                </div>

                                {/* Calendar Days Matrix */}
                                <div className="grid grid-cols-7 gap-1">
                                  {(() => {
                                    const year = examViewMonth.getFullYear();
                                    const month = examViewMonth.getMonth();
                                    const firstDay = new Date(year, month, 1).getDay();
                                    const daysInMonth = new Date(year, month + 1, 0).getDate();
                                    const todayStr = new Date().toISOString().split('T')[0];

                                    const cells = [];
                                    for (let i = 0; i < firstDay; i++) {
                                      cells.push(<div key={`empty-exam-${i}`} className="h-7" />);
                                    }
                                    for (let day = 1; day <= daysInMonth; day++) {
                                      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                      const isSelected = modalExamDate === dateStr;
                                      const isToday = todayStr === dateStr;

                                      cells.push(
                                        <button
                                          key={dateStr}
                                          type="button"
                                          onClick={() => {
                                            setModalExamDate(dateStr);
                                            setIsExamDatePickerOpen(false);
                                          }}
                                          className={`h-7 w-full rounded-lg text-xs font-medium transition-all flex items-center justify-center cursor-pointer ${
                                            isSelected
                                              ? 'bg-purple-600 text-white font-bold shadow-xs'
                                              : isToday
                                              ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 font-bold border border-purple-300 dark:border-purple-700'
                                              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                                          }`}
                                        >
                                          {day}
                                        </button>
                                      );
                                    }
                                    return cells;
                                  })()}
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setModalExamDate('');
                                      setIsExamDatePickerOpen(false);
                                    }}
                                    className="text-[11px] font-semibold text-rose-500 hover:underline"
                                  >
                                    Clear Date
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setIsExamDatePickerOpen(false)}
                                    className="text-[11px] font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                  >
                                    Close
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-semibold text-slate-700 dark:text-slate-300 text-[11px]">Venue</label>
                          <input
                            type="text"
                            name="examVenue"
                            defaultValue={editingJob?.examVenue}
                            placeholder="e.g. Dhaka College, Eden College"
                            className="h-9 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-blue-500 rounded-lg outline-none font-medium text-[14px] text-slate-800 dark:text-slate-100 shadow-xs"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Documents & Attachments Hub */}
                  <div className="p-3.5 bg-slate-50/90 dark:bg-slate-800/60 rounded-xl border border-slate-200/90 dark:border-slate-800 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Paperclip className="w-4 h-4 text-blue-500" />
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                          Documents & Attachments ({modalAttachments.length})
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">Max 3 files per upload • Unlimited links</span>
                    </div>

                    {/* Document Category Dropdown & Optional Label */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="relative" data-custom-filetype-dropdown>
                        <button
                          type="button"
                          onClick={() => setIsFileTypeDropdownOpen(prev => !prev)}
                          className="w-full h-8 px-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-[11px] font-medium flex items-center justify-between outline-none cursor-pointer"
                        >
                          <span className="truncate">
                            {fileTypeSelect === 'circular' && '📄 Circular Notice PDF'}
                            {fileTypeSelect === 'admit_card' && '🎫 Exam Admit Card'}
                            {fileTypeSelect === 'applicant_copy' && '📝 Applicant Copy'}
                            {fileTypeSelect === 'other' && '📎 Other Document'}
                          </span>
                          <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 shrink-0 ml-1 ${isFileTypeDropdownOpen ? 'rotate-180 text-blue-500' : ''}`} />
                        </button>

                        <AnimatePresence>
                          {isFileTypeDropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: -4, scale: 0.98 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -4, scale: 0.98 }}
                              transition={{ duration: 0.12 }}
                              className="absolute left-0 bottom-[104%] sm:bottom-auto sm:top-[104%] z-50 w-full min-w-[170px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl py-1 flex flex-col"
                            >
                              {[
                                { type: 'circular', label: '📄 Circular Notice PDF' },
                                { type: 'admit_card', label: '🎫 Exam Admit Card' },
                                { type: 'applicant_copy', label: '📝 Applicant Copy' },
                                { type: 'other', label: '📎 Other Document' },
                              ].map(item => (
                                <button
                                  key={item.type}
                                  type="button"
                                  onClick={() => {
                                    setFileTypeSelect(item.type as any);
                                    setIsFileTypeDropdownOpen(false);
                                  }}
                                  className={`px-3 py-1.5 text-left text-[11px] font-medium transition-colors ${
                                    fileTypeSelect === item.type
                                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold'
                                      : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                                  }`}
                                >
                                  {item.label}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <input
                        type="text"
                        value={fileNameInput}
                        onChange={(e) => setFileNameInput(e.target.value)}
                        placeholder="Custom title / label (optional)"
                        className="h-8 px-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-[13px] outline-none focus:border-blue-500"
                      />
                    </div>

                    {/* Section 1: Multi-File Upload Zone (Max 3 files) with Drag & Drop */}
                    <div className="flex flex-col gap-2">
                      <label
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (!isDragOverAttachment) setIsDragOverAttachment(true);
                        }}
                        onDragEnter={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsDragOverAttachment(true);
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // Only disable if left the container itself
                          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                            setIsDragOverAttachment(false);
                          }
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsDragOverAttachment(false);
                          const droppedFiles = Array.from(e.dataTransfer?.files || []);
                          if (droppedFiles.length > 0) {
                            handleProcessUploadFiles(droppedFiles);
                          }
                        }}
                        className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200 text-center group relative overflow-hidden ${
                          isDragOverAttachment
                            ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-950/40 ring-4 ring-blue-500/20 scale-[1.01]'
                            : 'border-blue-200 dark:border-blue-900/60 hover:border-blue-500 bg-white/70 dark:bg-slate-900/60'
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                            isDragOverAttachment
                              ? 'bg-blue-600 text-white scale-110 shadow-md shadow-blue-500/30'
                              : 'bg-blue-50 dark:bg-blue-950/80 text-blue-600 group-hover:scale-110'
                          }`}
                        >
                          <Upload className="w-4 h-4 stroke-[2.4]" />
                        </div>
                        <div>
                          <span className={`text-xs font-bold transition-colors ${
                            isDragOverAttachment
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-slate-800 dark:text-slate-200'
                          }`}>
                            {isDragOverAttachment ? 'Release to drop files here!' : 'Click to browse or drag & drop files'}
                          </span>
                          <p className="text-[10.5px] text-slate-400 mt-0.5">
                            Upload up to 3 files together (PDF, JPG, PNG • Max 15MB each)
                          </p>
                        </div>
                        <input
                          type="file"
                          multiple
                          accept="application/pdf,image/*,.doc,.docx"
                          className="hidden"
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            e.target.value = '';
                            if (files.length > 0) {
                              handleProcessUploadFiles(files);
                            }
                          }}
                        />
                      </label>
                    </div>

                    {/* Section 2: Web / Drive Link Input Available Simultaneously */}
                    <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-blue-500" />
                          Or paste Web / Google Drive link
                        </span>
                        <span className="text-[10px] text-slate-400">Unlimited links</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="url"
                          value={fileLinkInput}
                          onChange={(e) => setFileLinkInput(e.target.value)}
                          placeholder="Paste Google Drive, Dropbox, or official site link..."
                          className="flex-1 h-9 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-[13px] outline-none focus:border-blue-500"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              if (!fileLinkInput.trim()) return;
                              const defaultNames: Record<string, string> = {
                                circular: 'Official Circular Notice',
                                admit_card: 'Exam Admit Card',
                                applicant_copy: 'Applicant Copy',
                                other: 'Web Link',
                              };
                              const newAtt: JobAttachment = {
                                id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                                name: fileNameInput.trim() || defaultNames[fileTypeSelect],
                                type: fileTypeSelect,
                                url: fileLinkInput.trim(),
                                uploadedAt: Date.now(),
                              };
                              setModalAttachments(prev => [...prev, newAtt]);
                              setFileLinkInput('');
                              setFileNameInput('');
                              showToast('Web link added! You can add another link now.');
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (!fileLinkInput.trim()) {
                              showToast('Please paste a valid web or Google Drive URL');
                              return;
                            }
                            const defaultNames: Record<string, string> = {
                              circular: 'Official Circular Notice',
                              admit_card: 'Exam Admit Card',
                              applicant_copy: 'Applicant Copy',
                              other: 'Web Link',
                            };
                            const newAtt: JobAttachment = {
                              id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                              name: fileNameInput.trim() || defaultNames[fileTypeSelect],
                              type: fileTypeSelect,
                              url: fileLinkInput.trim(),
                              uploadedAt: Date.now(),
                            };
                            setModalAttachments(prev => [...prev, newAtt]);
                            setFileLinkInput('');
                            setFileNameInput('');
                            showToast('Web link added! You can add another link now.');
                          }}
                          className="h-9 px-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Link</span>
                        </button>
                      </div>
                    </div>


                    {/* Attached Documents Grid Cards */}
                    {modalAttachments.length > 0 && (
                      <div className="flex flex-col gap-1.5 mt-1">
                        <span className="text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                          Attached Items ({modalAttachments.length})
                        </span>
                        <div className="flex flex-col gap-1.5">
                          <AnimatePresence>
                            {modalAttachments.map((att) => {
                              const isUploading = att.status === 'uploading';
                              const isCloudUploaded = att.url.includes('cloudinary') || att.url.includes('firebasestorage');
                              const isDriveOrWeb = (att.url.startsWith('http://') || att.url.startsWith('https://')) && !isCloudUploaded;

                              return (
                                <motion.div
                                  key={att.id}
                                  layout
                                  initial={{ opacity: 0, y: -6 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95 }}
                                  transition={{ duration: 0.18 }}
                                  className={`p-2.5 rounded-xl bg-white dark:bg-slate-900 border transition-all shadow-xs ${
                                    isUploading
                                      ? 'border-blue-300 dark:border-blue-800/80 bg-blue-50/30 dark:bg-blue-950/20'
                                      : 'border-slate-200 dark:border-slate-700/80 hover:border-blue-400'
                                  }`}
                                >
                                  <div className="flex items-center justify-between gap-2 text-xs">
                                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                      {/* Icon / Loader */}
                                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                        isUploading
                                          ? 'bg-blue-100 dark:bg-blue-950 text-blue-600'
                                          : 'bg-blue-50 dark:bg-blue-950/80 text-blue-600'
                                      }`}>
                                        {isUploading ? (
                                          <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                                        ) : isDriveOrWeb ? (
                                          <Globe className="w-4 h-4 text-blue-600" />
                                        ) : (
                                          <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        )}
                                      </div>

                                      {/* Title & Metadata */}
                                      <div className="truncate flex-1 min-w-0">
                                        {editingAttachmentId === att.id ? (
                                          <div className="flex items-center gap-1.5 py-0.5">
                                            <input
                                              type="text"
                                              autoFocus
                                              value={editingAttachmentTitle}
                                              onChange={(e) => setEditingAttachmentTitle(e.target.value)}
                                              onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                  e.preventDefault();
                                                  if (editingAttachmentTitle.trim()) {
                                                    setModalAttachments(prev =>
                                                      prev.map(item => item.id === att.id ? { ...item, name: editingAttachmentTitle.trim() } : item)
                                                    );
                                                    setEditingAttachmentId(null);
                                                    showToast('Document renamed!');
                                                  }
                                                } else if (e.key === 'Escape') {
                                                  setEditingAttachmentId(null);
                                                }
                                              }}
                                              className="h-6 px-2 text-xs bg-white dark:bg-slate-950 border border-blue-500 rounded outline-none w-full max-w-[220px]"
                                              placeholder="Enter document title"
                                            />
                                            <button
                                              type="button"
                                              onClick={() => {
                                                if (editingAttachmentTitle.trim()) {
                                                  setModalAttachments(prev =>
                                                    prev.map(item => item.id === att.id ? { ...item, name: editingAttachmentTitle.trim() } : item)
                                                  );
                                                  setEditingAttachmentId(null);
                                                  showToast('Document renamed!');
                                                }
                                              }}
                                              className="p-1 hover:bg-emerald-50 text-emerald-600 rounded transition-colors cursor-pointer"
                                              title="Save title"
                                            >
                                              <Check className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() => setEditingAttachmentId(null)}
                                              className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded transition-colors cursor-pointer"
                                              title="Cancel"
                                            >
                                              <X className="w-3.5 h-3.5" />
                                            </button>
                                          </div>
                                        ) : (
                                          <>
                                            <div className="flex items-center gap-1.5">
                                              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate text-xs">
                                                {att.name}
                                              </span>
                                              {!isUploading && (
                                                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                              )}
                                            </div>

                                            {!isUploading && (
                                              <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-400">
                                                <span className="text-[9px] px-1.5 py-0.2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded font-medium uppercase">
                                                  {att.type.replace('_', ' ')}
                                                </span>
                                                <span>•</span>
                                                <span>
                                                  {att.url.startsWith('idb://')
                                                    ? 'Offline Storage'
                                                    : isDriveOrWeb
                                                    ? 'Web Link'
                                                    : 'Cloud Storage'}
                                                </span>
                                                {att.fileSize && (
                                                  <>
                                                    <span>•</span>
                                                    <span>{att.fileSize}</span>
                                                  </>
                                                )}
                                              </div>
                                            )}
                                          </>
                                        )}
                                      </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-1 shrink-0 ml-2">
                                      {isUploading ? (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (uploadTasksRef.current[att.id]) {
                                              try {
                                                uploadTasksRef.current[att.id].cancel();
                                              } catch (e) {}
                                              delete uploadTasksRef.current[att.id];
                                            }
                                            setModalAttachments(prev => prev.filter(item => item.id !== att.id));
                                            showToast(`Upload cancelled: "${att.name}"`);
                                          }}
                                          className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded transition-colors cursor-pointer"
                                          title="Cancel upload"
                                        >
                                          <X className="w-3.5 h-3.5" />
                                        </button>
                                      ) : (
                                        <>
                                          {/* Rename Document Button */}
                                          {editingAttachmentId !== att.id && (
                                            <button
                                              type="button"
                                              onClick={() => {
                                                setEditingAttachmentId(att.id);
                                                setEditingAttachmentTitle(att.name);
                                              }}
                                              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-blue-600 rounded-md transition-colors cursor-pointer"
                                              title="Rename document"
                                            >
                                              <Edit3 className="w-3.5 h-3.5" />
                                            </button>
                                          )}

                                          {/* Open in New Tab */}
                                          <button
                                            type="button"
                                            onClick={() => openAttachmentDocument(att.url)}
                                            className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-950 text-blue-600 rounded-md transition-colors cursor-pointer"
                                            title="Open in New Tab"
                                          >
                                            <ExternalLink className="w-3.5 h-3.5" />
                                          </button>

                                          {/* Remove */}
                                          <button
                                            type="button"
                                            onClick={async () => {
                                              if (att.url && att.url.startsWith('idb://')) {
                                                try {
                                                  await deleteFileFromIndexedDB(att.url);
                                                } catch (e) {}
                                              }
                                              setModalAttachments(prev => prev.filter(item => item.id !== att.id));
                                            }}
                                            className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-md transition-colors cursor-pointer"
                                            title="Remove document"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  </div>

                                  {/* Inline Progress Bar for Uploading State */}
                                  {isUploading && (
                                    <div className="mt-2 pt-1 border-t border-blue-100 dark:border-blue-900/40">
                                      <div className="w-full bg-blue-100/80 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                        <motion.div
                                          className="h-full bg-blue-600 rounded-full transition-all duration-300"
                                          style={{ width: `${att.progress || 12}%` }}
                                        />
                                      </div>
                                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                                        <span>{att.fileSize ? `${att.fileSize} • Uploading...` : 'Uploading...'}</span>
                                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{att.progress || 12}%</span>
                                      </div>
                                    </div>
                                  )}
                                </motion.div>
                              );
                            })}
                          </AnimatePresence>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Personal Notes / Study Plan</label>
                    <textarea
                      name="notes"
                      defaultValue={editingJob?.notes}
                      placeholder="Write syllabus focus, book references or important instructions..."
                      rows={2}
                      className="p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-medium text-[14px] resize-none"
                    />
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsAddEditModalOpen(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  {(() => {
                    const isAnyUploading = modalAttachments.some(att => att.status === 'uploading');
                    return (
                      <button
                        type="submit"
                        disabled={isAnyUploading}
                        style={{
                          backgroundColor: 'var(--primary, #2563EB)',
                          boxShadow: '0 4px 12px -2px var(--primary-ring, rgba(37, 99, 235, 0.25))',
                        }}
                        className={`px-4 py-2 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          isAnyUploading
                            ? 'opacity-60 cursor-not-allowed'
                            : 'hover:opacity-90 cursor-pointer'
                        }`}
                      >
                        {isAnyUploading ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Uploading files...</span>
                          </>
                        ) : (
                          editingJob ? 'Save Changes' : 'Create Circular'
                        )}
                      </button>
                    );
                  })()}
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
      document.body
    )}

      {/* 6. CONFIRM DELETE MODAL (Moves to Recycle Bin) */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {jobToDelete && (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xl max-w-sm w-full flex flex-col items-center text-center select-none"
              >
                <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center mb-3">
                  <Trash2 className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="font-serif font-bold text-base text-slate-900 dark:text-slate-100 mb-1">
                  Move to Recycle Bin?
                </h3>
                <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                  "{jobToDelete.jobTitle}" will be safely moved to the Trash Bin. You can restore it anytime within 30 days.
                </p>
                <div className="flex items-center gap-2 w-full">
                  <button
                    type="button"
                    onClick={() => setJobToDelete(null)}
                    className="flex-1 py-2 rounded-lg text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleDelete(jobToDelete);
                      setJobToDelete(null);
                    }}
                    className="flex-1 py-2 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white cursor-pointer shadow-sm"
                  >
                    Move to Trash
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </motion.div>
  );
};
