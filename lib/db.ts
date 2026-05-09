import fs from 'fs/promises';
import path from 'path';
import { Content } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const CONTENT_FILE = path.join(DATA_DIR, 'content.json');
const UNLOCKS_FILE = path.join(DATA_DIR, 'unlocks.json');

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
  } catch (error) {
    console.error('[ContentStream] Failed to initialize data directory:', error);
  }
}

// Retrieve all content from database
export async function getAllContent(): Promise<Content[]> {
  await ensureDataDir();
  try {
    const data = await fs.readFile(CONTENT_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('[ContentStream] Failed to read content:', error);
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
