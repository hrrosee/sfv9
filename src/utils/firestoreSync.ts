import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { UserSettings } from '../types';
import { StreakData } from './streakManager';

export interface StudyFlowCloudData {
  workspaces?: any[];
  workspaceSections?: Record<string, any[]>;
  activeWorkspaceId?: string;
  topics?: any[];
  deletedTopics?: any[];
  deletedWorkspaces?: any[];
  deletedNotes?: any[];
  deletedSections?: any[];
  deletedTasks?: any[];
  deletedTopicNotes?: any[];
  deletedTopicLinks?: any[];
  jobCirculars?: any[];
  deletedJobCirculars?: any[];
  notes?: any[];
  standaloneTasks?: any[];
  userSettings?: UserSettings;
  streakData?: StreakData;
  updatedAt?: any;
}

/**
 * Deeply sanitizes an object/array to remove any undefined fields that Firestore rejects
 */
function sanitizeForFirestore(data: any): any {
  if (data === undefined) return null;
  return JSON.parse(
    JSON.stringify(data, (key, value) => (value === undefined ? undefined : value))
  );
}

/**
 * Save user data to Firestore Cloud Database
 */
export const saveUserDataToCloud = async (userId: string, data: StudyFlowCloudData) => {
  if (!userId) return;
  try {
    const userDocRef = doc(db, 'users', userId, 'data', 'studyflow');
    const syncData = { ...data };
    if (syncData.userSettings) {
      const { theme, primaryColor, ...restSettings } = syncData.userSettings as any;
      syncData.userSettings = restSettings;
    }

    // Strip out any large base64 data URLs from circular attachments to ensure we never hit Firestore 1MB document limit
    if (syncData.jobCirculars && Array.isArray(syncData.jobCirculars)) {
      syncData.jobCirculars = syncData.jobCirculars.map((c: any) => ({
        ...c,
        attachments: (c.attachments || []).map((att: any) => ({
          ...att,
          url: typeof att.url === 'string' && att.url.startsWith('data:') ? '' : att.url
        }))
      }));
    }
    if (syncData.deletedJobCirculars && Array.isArray(syncData.deletedJobCirculars)) {
      syncData.deletedJobCirculars = syncData.deletedJobCirculars.map((d: any) => ({
        ...d,
        circular: {
          ...d.circular,
          attachments: (d.circular?.attachments || []).map((att: any) => ({
            ...att,
            url: typeof att.url === 'string' && att.url.startsWith('data:') ? '' : att.url
          }))
        }
      }));
    }

    const cleanSyncData = sanitizeForFirestore(syncData);
    await setDoc(userDocRef, {
      ...cleanSyncData,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error: any) {
    console.error('Error saving data to Firestore:', error);
    if (error?.message?.includes('payload') || error?.message?.includes('exceeded') || error?.code === 'resource-exhausted') {
      window.alert('⚠️ ক্লাউডে আপনার ডেটা সেভ হতে ব্যর্থ হয়েছে! সম্ভবত আপনার নোটস বা টাস্কে থাকা ইমেজের কারণে ডেটার সাইজ লিমিট (১ এমবি) পার হয়ে গেছে।\n\nদয়া করে সেটিংস থেকে "Export" বাটনে ক্লিক করে ডেটার ব্যাকআপ নিয়ে রাখুন।');
    }
  }
};

/**
 * Fetch initial user data from Firestore Cloud Database
 */
export const fetchUserDataFromCloud = async (userId: string): Promise<StudyFlowCloudData | null> => {
  if (!userId) return null;
  try {
    const userDocRef = doc(db, 'users', userId, 'data', 'studyflow');
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data() as StudyFlowCloudData;
    }
    return null;
  } catch (error) {
    console.error('Error fetching data from Firestore:', error);
    return null;
  }
};

/**
 * Real-time listener for user data updates from Firestore
 */
export const subscribeToCloudData = (
  userId: string, 
  onData: (data: StudyFlowCloudData) => void
) => {
  if (!userId) return () => {};
  const userDocRef = doc(db, 'users', userId, 'data', 'studyflow');
  return onSnapshot(userDocRef, (snap) => {
    if (snap.exists()) {
      onData(snap.data() as StudyFlowCloudData);
    }
  }, (error) => {
    console.error('Firestore real-time subscription error:', error);
  });
};
