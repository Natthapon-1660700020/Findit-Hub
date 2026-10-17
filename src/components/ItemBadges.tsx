import type { LostFoundItem } from '../types/item';
import { Icon } from './Icon';
export function ItemBadges({
  item
}: {
  item: LostFoundItem;
}) {
  return <div className="item-badges">
    <span className={'status-badge ' + item.type.toLowerCase()}>
      <Icon name="circle" size={11} />
      {item.type}
    </span>
    {item.status === 'Resolved' && <span className="status-badge resolved"><Icon name="check" size={11} />Resolved</span>}
  </div>;
}
