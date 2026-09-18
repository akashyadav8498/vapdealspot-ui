import type { EmailBlock } from './builderTypes';

export interface SavedBlock {
  id: string;
  name: string;
  description?: string;
  blockData: EmailBlock;
  version: number;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'vapdealspot_saved_blocks';

export function getSavedBlocks(): SavedBlock[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse saved blocks', e);
    return [];
  }
}

export function saveBlock(blockData: EmailBlock, name: string, description?: string): SavedBlock {
  const blocks = getSavedBlocks();
  
  // Create a deep copy of the block data to store
  const storedBlockData = JSON.parse(JSON.stringify(blockData)) as EmailBlock;

  const newSavedBlock: SavedBlock = {
    id: crypto.randomUUID(),
    name: name.trim(),
    description: description?.trim(),
    blockData: storedBlockData,
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  blocks.push(newSavedBlock);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks));
  
  return newSavedBlock;
}

export function deleteSavedBlock(id: string): void {
  const blocks = getSavedBlocks();
  const filtered = blocks.filter(b => b.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

/**
 * Deep clones an EmailBlock and assigns a new unique ID to it and any nested elements (if applicable in future).
 * This ensures two inserted copies of the same Saved Block are completely independent.
 */
export function cloneBlockForInsertion(savedBlockData: EmailBlock): EmailBlock {
  const cloned: EmailBlock = JSON.parse(JSON.stringify(savedBlockData));
  cloned.id = crypto.randomUUID();
  // If we had nested blocks, we would recursively assign new IDs here.
  return cloned;
}
