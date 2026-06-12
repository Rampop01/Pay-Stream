import fs from 'fs/promises';
import path from 'path';
import { Content } from './types';
/** @description Client interface for database interactions */


const DATA_DIR = path.join(process.cwd(), 'data');
const CONTENT_FILE = path.join(DATA_DIR, 'content.json');
const UNLOCKS_FILE = path.join(DATA_DIR, 'unlocks.json');
const STAKES_FILE = path.join(DATA_DIR, 'stakes.json');

// Ensure data directory and files exist
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    
    // Ensure content file
    try {
      await fs.access(CONTENT_FILE);
    } catch {
      await fs.writeFile(CONTENT_FILE, JSON.stringify([], null, 2));
    }

    // Ensure unlocks file
    try {
      await fs.access(UNLOCKS_FILE);
    } catch {
      await fs.writeFile(UNLOCKS_FILE, JSON.stringify([], null, 2));
    }

    // Ensure stakes file
    try {
      await fs.access(STAKES_FILE);
    } catch {
      await fs.writeFile(STAKES_FILE, JSON.stringify([], null, 2));
    }
  } catch (error) {
    console.error('[PayStream] Failed to initialize data directory:', error);
  }
}

// Retrieve all content from database
export async function getAllContent(): Promise<Content[]> {
  await ensureDataDir();
  try {
    const data = await fs.readFile(CONTENT_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('[PayStream] Failed to read content:', error);
    return [];
  }
}

// Get content by creator address
export async function getContentByCreator(address: string): Promise<Content[]> {
  const contents = await getAllContent();
  return contents.filter((c) => c.creatorAddress === address);
}

// Get single content by ID
export async function getContentById(id: string): Promise<Content | null> {
  const contents = await getAllContent();
  return contents.find((c) => c.id === id) || null;
}

// Add new content to database
export async function addContent(
  content: Omit<Content, 'id' | 'createdAt' | 'totalUnlocks'>
): Promise<Content> {
  await ensureDataDir();
  const allContent = await getAllContent();

  // Generate unique ID using timestamp + random string
  const newContent: Content = {
    ...content,
    id: Date.now().toString(36) + Math.random().toString(36).substr(2),
    createdAt: Date.now(),
    totalUnlocks: 0,
  };

  allContent.push(newContent);
  await fs.writeFile(CONTENT_FILE, JSON.stringify(allContent, null, 2));

  return newContent;
}

// Update content
export async function updateContent(id: string, updates: Partial<Content>): Promise<Content | null> {
  await ensureDataDir();
  const allContent = await getAllContent();

  const index = allContent.findIndex((c) => c.id === id);
  if (index === -1) return null;

  allContent[index] = { ...allContent[index], ...updates };
  await fs.writeFile(CONTENT_FILE, JSON.stringify(allContent, null, 2));

  return allContent[index];
}

// Delete content
export async function deleteContent(id: string): Promise<boolean> {
  await ensureDataDir();
  const allContent = await getAllContent();

  const initialLength = allContent.length;
  const filteredContent = allContent.filter((c) => c.id !== id);

  if (filteredContent.length === initialLength) return false;

  await fs.writeFile(CONTENT_FILE, JSON.stringify(filteredContent, null, 2));
  return true;
}

// --- Unlock Management ---

export async function recordUnlock(record: PurchaseRecord): Promise<void> {
  await ensureDataDir();
  const data = await fs.readFile(UNLOCKS_FILE, 'utf-8');
  const unlocks = JSON.parse(data);
  
  unlocks.push(record);
  await fs.writeFile(UNLOCKS_FILE, JSON.stringify(unlocks, null, 2));

  // Also increment totalUnlocks in content table
  await updateContent(record.contentId, { 
    totalUnlocks: (await getContentById(record.contentId))?.totalUnlocks || 0 + 1 
  });
}

export async function getUnlocksByBuyer(address: string): Promise<PurchaseRecord[]> {
  await ensureDataDir();
  const data = await fs.readFile(UNLOCKS_FILE, 'utf-8');
  const unlocks: PurchaseRecord[] = JSON.parse(data);
  return unlocks.filter((u) => u.buyerAddress === address);
}

// --- Comment Management ---

export async function addComment(contentId: string, comment: Omit<Comment, 'id' | 'createdAt'>): Promise<Comment> {
  const content = await getContentById(contentId);
  if (!content) throw new Error('Content not found');

  const newComment: Comment = {
    ...comment,
    id: Math.random().toString(36).substring(2, 9),
    createdAt: Date.now()
  };

  const comments = content.comments || [];
  comments.push(newComment);

  await updateContent(contentId, { comments });
  return newComment;
}

// --- Report Management ---

const REPORTS_FILE = path.join(process.cwd(), 'data/reports.json');

export interface Report {
  id: string;
  contentId: string;
  contentTitle: string;
  reporter: string;
  reason: string;
  timestamp: number;
  status: 'pending' | 'resolved' | 'dismissed';
}

export async function getReports(): Promise<Report[]> {
  await ensureDataDir();
  try {
    const data = await fs.readFile(REPORTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

export async function addReport(report: { contentId: string; reason: string; reporterAddress: string }): Promise<void> {
  await ensureDataDir();
  const reports = await getReports();
  
  const content = await getContentById(report.contentId);

  reports.push({
    id: Math.random().toString(36).substring(2, 9),
    contentId: report.contentId,
    contentTitle: content?.title || 'Unknown Content',
    reporter: report.reporterAddress,
    reason: report.reason,
    timestamp: Date.now(),
    status: 'pending'
  });

  await fs.writeFile(REPORTS_FILE, JSON.stringify(reports, null, 2));
}

export async function updateReportStatus(reportId: string, status: 'resolved' | 'dismissed'): Promise<boolean> {
  await ensureDataDir();
  const reports = await getReports();
  const index = reports.findIndex((r) => r.id === reportId);
  
  if (index === -1) return false;
  
  reports[index].status = status;
  await fs.writeFile(REPORTS_FILE, JSON.stringify(reports, null, 2));
  return true;
}

// --- Profile Management ---

const PROFILES_FILE = path.join(process.cwd(), 'data/profiles.json');

export interface UserProfile {
  address: string;
  name?: string;
  avatarUrl?: string;
  bio?: string;
  updatedAt: number;
}

export async function getProfile(address: string): Promise<UserProfile | null> {
  await ensureDataDir();
  try {
    const data = await fs.readFile(PROFILES_FILE, 'utf-8');
    const profiles: UserProfile[] = JSON.parse(data);
    return profiles.find((p) => p.address === address) || null;
  } catch (e) {
    return null;
  }
}

export async function updateProfile(profile: UserProfile): Promise<void> {
  await ensureDataDir();
  let profiles: UserProfile[] = [];
  try {
    const data = await fs.readFile(PROFILES_FILE, 'utf-8');
    profiles = JSON.parse(data);
  } catch (e) {}

  const index = profiles.findIndex((p) => p.address === profile.address);
  if (index >= 0) {
    profiles[index] = { ...profiles[index], ...profile, updatedAt: Date.now() };
  } else {
    profiles.push({ ...profile, updatedAt: Date.now() });
  }

  await fs.writeFile(PROFILES_FILE, JSON.stringify(profiles, null, 2));
}

// Ensure connection pooling is used in production
