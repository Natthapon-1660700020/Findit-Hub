import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { itemService } from '../services/itemService';
import { CreateItemPayload } from '../types/item';

export const ITEM_QUERY_KEYS = {
  all: ['items'] as const,
  detail: (id: string) => ['items', id] as const,
};

// Hook สำหรับดึงรายการทั้งหมด พร้อมตั้ง staleTime 5 นาที
export function useItems() {
  return useQuery({
    queryKey: ITEM_QUERY_KEYS.all,
    queryFn: itemService.getAllItems,
    staleTime: 5 * 60 * 1000, // 5 นาทีตามมาตรฐาน Caching
  });
}

// Hook สำหรับดึงรายละเอียดรายชิ้นตาม ID
export function useItemDetail(id: string | undefined) {
  return useQuery({
    queryKey: ITEM_QUERY_KEYS.detail(id || ''),
    queryFn: () => {
      if (!id) throw new Error('Invalid Item ID');
      return itemService.getItemById(id);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Mutation Hook สำหรับสร้างประกาศใหม่
export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateItemPayload) => itemService.createItem(payload),
    onSuccess: () => {
      // Invalidate เพื่อให้หน้า Explore Items ดึงข้อมูลใหม่มาแสดงทันที
      queryClient.invalidateQueries({ queryKey: ITEM_QUERY_KEYS.all });
    },
  });
}

// Mutation Hook สำหรับปิดจบเคส (Mark as Resolved)
export function useResolveItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, note }: { id: string; note: string }) =>
      itemService.resolveItem({ id, note }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ITEM_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ITEM_QUERY_KEYS.detail(variables.id) });
    },
  });
}