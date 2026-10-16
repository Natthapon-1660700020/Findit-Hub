import { LostFoundItem, CreateItemPayload } from '../types/item';
import { INITIAL_ITEMS } from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/items';
const LOCAL_STORAGE_ITEMS_KEY = 'findit_runtime_items';

// ตัวช่วยโหลดข้อมูลเริ่มต้นสำหรับโหมด Cloud / Standalone
const getLocalItems = (): LostFoundItem[] => {
  const stored = localStorage.getItem(LOCAL_STORAGE_ITEMS_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_STORAGE_ITEMS_KEY, JSON.stringify(INITIAL_ITEMS));
    return INITIAL_ITEMS;
  }
  try {
    return JSON.parse(stored) as LostFoundItem[];
  } catch {
    return INITIAL_ITEMS;
  }
};

const saveLocalItems = (items: LostFoundItem[]): void => {
  localStorage.setItem(LOCAL_STORAGE_ITEMS_KEY, JSON.stringify(items));
};

export const itemService = {
  // ดึงรายการทั้งหมด
  getAllItems: async (): Promise<LostFoundItem[]> => {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) throw new Error('Network response was not ok');
      const data: LostFoundItem[] = await response.json();
      return data;
    } catch {
      // Fallback อัตโนมัติเมื่อรันบน Vercel หรือยังไม่ได้เปิด json-server
      return getLocalItems();
    }
  },

  // ดึงรายละเอียดรายการรายชิ้นด้วย ID
  getItemById: async (id: string): Promise<LostFoundItem> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`);
      if (!response.ok) throw new Error('Item not found');
      const data: LostFoundItem = await response.json();
      return data;
    } catch {
      const items = getLocalItems();
      const found = items.find((item) => item.id === id);
      if (!found) throw new Error(`Item with id ${id} not found`);
      return found;
    }
  },

  // สร้างประกาศใหม่ (POST)
  createItem: async (payload: CreateItemPayload): Promise<LostFoundItem> => {
    const newItem: LostFoundItem = {
      ...payload,
      id: Date.now().toString(),
      status: 'Active',
    };

    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      if (!response.ok) throw new Error('Failed to create item');
      return await response.json();
    } catch {
      const items = getLocalItems();
      const updated = [newItem, ...items];
      saveLocalItems(updated);
      return newItem;
    }
  },

  // อัปเดตสถานะเป็น Resolved เพื่อปิดจบเคส
  resolveItem: async ({ id, note }: { id: string; note: string }): Promise<LostFoundItem> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Resolved', resolvedNote: note }),
      });
      if (!response.ok) throw new Error('Failed to update status');
      return await response.json();
    } catch {
      const items = getLocalItems();
      const updated = items.map((item) =>
        item.id === id ? { ...item, status: 'Resolved' as const, resolvedNote: note } : item
      );
      saveLocalItems(updated);
      const target = updated.find((item) => item.id === id);
      if (!target) throw new Error('Item not found');
      return target;
    }
  },
};