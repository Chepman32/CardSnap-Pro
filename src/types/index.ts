/**
 * TypeScript Type Definitions
 * All interfaces and types used throughout the app
 */

// Database Models

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  company?: string;
  jobTitle?: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
  isFavorite: boolean;
  timesViewed: number;
  lastViewedAt?: number;
  avatarPath?: string;
  primaryCardId?: string;
  source: 'scanned' | 'manual';
}

export interface Card {
  id: string;
  contactId: string;
  imagePath: string;
  thumbnailPath: string;
  scannedAt: number;
  ocrProcessed: boolean;
  ocrConfidence: number;
  isPrimary: boolean;
  aspectRatio: number;
  fileSize: number;
}

export interface ContactMethod {
  id: string;
  contactId: string;
  methodType: 'phone' | 'email' | 'url' | 'address';
  label: string;
  value: string;
  isPrimary: boolean;
  createdAt: number;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  icon?: string;
  createdAt: number;
  usageCount: number;
}

export interface ContactTag {
  id: string;
  contactId: string;
  tagId: string;
  createdAt: number;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  coverStyle: 'mosaic' | 'single' | 'gradient';
  color: string;
  isAuto: boolean;
  createdAt: number;
  updatedAt: number;
  sortOrder: number;
}

export interface CollectionContact {
  id: string;
  collectionId: string;
  contactId: string;
  addedAt: number;
  position: number;
}

export interface Reminder {
  id: string;
  contactId: string;
  reminderDate: number;
  message: string;
  isCompleted: boolean;
  completedAt?: number;
  createdAt: number;
  notificationId?: string;
}

export interface Meeting {
  id: string;
  contactId: string;
  meetingDate: number;
  title: string;
  notes?: string;
  calendarEventId?: string;
  location?: string;
  createdAt: number;
  updatedAt: number;
}

export interface SearchHistory {
  id: string;
  query: string;
  filtersJson: string;
  timestamp: number;
  resultCount: number;
}

export interface AppSettings {
  id: string;
  key: string;
  value: string;
  updatedAt: number;
}

// OCR Types

export interface OCRResult {
  text: string;
  confidence: number;
  blocks: OCRBlock[];
}

export interface OCRBlock {
  text: string;
  confidence: number;
  boundingBox: BoundingBox;
  type: 'name' | 'company' | 'title' | 'phone' | 'email' | 'address' | 'url' | 'unknown';
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ExtractedContactData {
  name?: FieldExtraction;
  company?: FieldExtraction;
  title?: FieldExtraction;
  phones: FieldExtraction[];
  emails: FieldExtraction[];
  urls: FieldExtraction[];
  address?: FieldExtraction;
}

export interface FieldExtraction {
  value: string;
  confidence: number;
  boundingBox?: BoundingBox;
}

// Navigation Types

export type RootStackParamList = {
  Splash: undefined;
  Main: undefined;
  Camera: {mode?: 'single' | 'batch'};
  Processing: {imagePath: string};
  EditContact: {contactData?: ExtractedContactData; contactId?: string; imagePath?: string};
  ContactDetail: {contactId: string};
  Search: undefined;
  Settings: undefined;
  Organization: undefined;
  IAP: {source?: string};
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Organization: undefined;
  Settings: undefined;
};

// Subscription Types

export enum SubscriptionTier {
  FREE = 'free',
  PREMIUM_MONTHLY = 'premium_monthly',
  PREMIUM_ANNUAL = 'premium_annual',
  PREMIUM_LIFETIME = 'premium_lifetime',
}

export interface SubscriptionStatus {
  tier: SubscriptionTier;
  isActive: boolean;
  expiresAt?: number;
  isTrialing?: boolean;
  trialEndsAt?: number;
}

// Export Types

export enum ExportFormat {
  VCARD = 'vcard',
  CSV = 'csv',
  PDF = 'pdf',
  EXCEL = 'excel',
  JSON = 'json',
  QR = 'qr',
}

export interface ExportOptions {
  format: ExportFormat;
  includeImages: boolean;
  includeNotes: boolean;
  includeTags: boolean;
  includeMetadata: boolean;
}

// Filter Types

export interface SearchFilters {
  isFavorite?: boolean;
  hasEmail?: boolean;
  hasPhone?: boolean;
  hasAddress?: boolean;
  tags?: string[];
  companies?: string[];
  dateRange?: {start: number; end: number};
}

// Animation Types

export interface SpringConfig {
  damping: number;
  stiffness: number;
  mass: number;
}

export interface TimingConfig {
  duration: number;
  easing: string;
}

// Theme Types

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
}

export interface Theme {
  colors: ThemeColors;
  spacing: Record<string, number>;
  borderRadius: Record<string, number>;
  typography: Record<string, any>;
}

// Duplicate Detection

export interface DuplicateMatch {
  existingContact: Contact;
  newContact: Partial<Contact>;
  matchScore: number;
  matchingFields: string[];
  differingFields: string[];
}

// Batch Scanning

export interface BatchScanSession {
  id: string;
  cards: BatchCard[];
  startedAt: number;
  completedAt?: number;
}

export interface BatchCard {
  id: string;
  imagePath: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  ocrResult?: OCRResult;
  extractedData?: ExtractedContactData;
  error?: string;
}
