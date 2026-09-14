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
  contentHtml: string;
  status: CampaignStatus;
  audience: AudienceSelection;
  createdAt: string;
  sentAt?: string;
  recipientCount?: number;
}
