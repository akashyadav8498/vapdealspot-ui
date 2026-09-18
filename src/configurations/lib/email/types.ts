import type { EmailDocument } from './builderTypes';

export interface Contact {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isSubscribed: boolean;
  createdAt: string;
}

export type CampaignStatus = 'draft' | 'sent';

export type AudienceSelection = 
  | { type: 'all' }
  | { type: 'specific', contactIds: string[] };

export interface Campaign {
  id: string;
  name: string;
  subject: string;
  senderName: string;
  senderEmail: string;
  contentHtml?: string; // Optional for backward compatibility / fallback
  contentDocument?: EmailDocument; // New block-based structure
  contentMode?: 'blocks' | 'html'; // The currently active editing mode
  status: CampaignStatus;
  audience: AudienceSelection;
  createdAt: string;
  sentAt?: string;
  recipientCount?: number;
}
