import React from 'react';
import { ItemCategory } from '../types/item';

interface CategoryIconProps {
  category: ItemCategory;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const CATEGORY_STYLES: Record<ItemCategory, { icon: string; bg: string; text: string }> = {
  Electronics: { icon: '🎧', bg: 'bg-blue-100 dark:bg-blue-950', text: 'text-blue-600' },
  Accessories: { icon: '👛', bg: 'bg-purple-100 dark:bg-purple-950', text: 'text-purple-600' },
  Bags: { icon: '🎒', bg: 'bg-amber-100 dark:bg-amber-950', text: 'text-amber-600' },
  'ID & Cards': { icon: '🪪', bg: 'bg-emerald-100 dark:bg-emerald-950', text: 'text-emerald-600' },
  Keys: { icon: '🔑', bg: 'bg-rose-100 dark:bg-rose-950', text: 'text-rose-600' },
  Stationery: { icon: '📓', bg: 'bg-cyan-100 dark:bg-cyan-950', text: 'text-cyan-600' },
  Others: { icon: '📦', bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-600' },
};

export const CategoryIcon: React.FC<CategoryIconProps> = ({ category, className = '', size = 'md' }) => {
  const style = CATEGORY_STYLES[category] || CATEGORY_STYLES.Others;
  const sizeClasses = {
    sm: 'w-10 h-10 text-xl',
    md: 'w-16 h-16 text-3xl',
    lg: 'w-24 h-24 text-5xl',
  };

  return (
    <div
      className={`rounded-2xl flex items-center justify-center select-none shadow-inner ${style.bg} ${sizeClasses[size]} ${className}`}
    >
      <span>{style.icon}</span>
    </div>
  );
};