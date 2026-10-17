import type { ItemCategory } from '../types/item';
import { Icon, type IconName } from './Icon';
const icons: Record<ItemCategory, IconName> = {
  Electronics: 'headphones',
  Accessories: 'wallet',
  Bags: 'bag',
  'ID & Cards': 'card',
  Keys: 'key',
  Stationery: 'file',
  Others: 'box'
};
export function CategoryIcon({
  category
}: {
  category: ItemCategory;
}) {
  return <div className="category-icon">
    <Icon name={icons[category] || 'box'} size={34} />
  </div>;
}
