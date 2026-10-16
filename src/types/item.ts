export type ItemType = 'Lost' | 'Found';
export type ItemStatus = 'Active' | 'Resolved';

export type ItemCategory =
  | 'Electronics'
  | 'Accessories'
  | 'Bags'
  | 'ID & Cards'
  | 'Keys'
  | 'Stationery'
  | 'Others';

export type CustodyLocation =
  | 'With Finder / Owner'
  | 'Central Lost & Found Room (Building A6 First Floor)'
  | 'Building Reception / Staff Desk';

export interface LostFoundItem {
  id: string;
  title: string;
  type: ItemType;
  category: ItemCategory;
  description: string;
  location: string;
  date: string;
  status: ItemStatus;
  imageUrl?: string; // Optional: หากไม่มีรูปจะแสดงไอคอนประจำหมวดหมู่แทน
  custody: CustodyLocation;
  contact: string;
  resolvedNote?: string;
}

export interface CreateItemPayload {
  title: string;
  type: ItemType;
  category: ItemCategory;
  description: string;
  location: string;
  date: string;
  imageUrl?: string;
  custody: CustodyLocation;
  contact: string;
}

export interface TeamMember {
  id: string;
  fullNameTh: string;
  fullNameEn: string;
  nickname: string;
  studentId: string;
  role: string;
  responsibilities: string[];
  avatarUrl: string;
}

export const ITEM_CATEGORIES: ItemCategory[] = [
  'Electronics',
  'Accessories',
  'Bags',
  'ID & Cards',
  'Keys',
  'Stationery',
  'Others',
];

export const CAMPUS_LOCATIONS: string[] = [
    // Zone A
  'Building A1',
  'Building A2',
  'Building A3',
  'Building A4',
  'Building A5',
  'Building A6',
  'Building A7',
  'Building A8',
  'Thai house',
  'Buddha Shrine',
  'Building SAC',
    // Zone B
  'Building B1',
  'Building B2',
  'Building B3',
  'Building B4',
  'Building Workshop',
  'Stockpile',
    // Zone C
  'Building C1',
  'Building C2',
  'Building C3',
  'Building C4',
  'Building C5',
  'Building C6 Surat Osathanugrah Library',
  'Building C9',
  'Southeast Asian Ceramics Museum Annex',
  'Building C10',
    // Zone D
  'Lanscaping Office',
  'Suree Buranathanit Sports Center',
  'Boxing Ring',
  'Tennis Courts',
];

export const CUSTODY_OPTIONS: CustodyLocation[] = [
  'With Finder / Owner',
  'Central Lost & Found Room (Building A6 First Floor)',
  'Building Reception / Staff Desk',
];