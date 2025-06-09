export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  notes?: string;
  lastContacted?: string; // ISO date string
  source?: string; // e.g., "Email Import", "Manual Entry"
  avatarUrl?: string;
}

export interface Email {
  id: string;
  sender: string;
  senderEmail: string;
  recipient: string;
  subject: string;
  body: string;
  receivedAt: string; // ISO date string
  sentiment?: 'positive' | 'negative' | 'neutral';
  sentimentConfidence?: number;
  contactId?: string;
}

export interface AnalyzedContactInfo {
  name: string;
  email: string;
  phoneNumber: string;
  company: string;
}

export interface AnalyzedSentimentInfo {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
}
