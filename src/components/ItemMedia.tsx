import { useState } from 'react';
import type { LostFoundItem } from '../types/item';
import { CategoryIcon } from './CategoryIcon';
export function ItemMedia({
  item,
  eager = false
}: {
  item: LostFoundItem;
  eager?: boolean;
}) {
  const [failedUrl, setFailedUrl] = useState<string>();
  return <div className="item-media">
    {item.imageUrl && failedUrl !== item.imageUrl ? <img src={item.imageUrl} alt={item.title} loading={eager ? 'eager' : 'lazy'} onError={() => setFailedUrl(item.imageUrl)} /> : <div className="category-placeholder">
      <CategoryIcon category={item.category} />
      <span>
        {item.category}
      </span>
    </div>}
  </div>;
}
