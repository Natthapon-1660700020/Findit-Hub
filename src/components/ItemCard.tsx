import { Link } from 'react-router';
import type { LostFoundItem } from '../types/item';
import { useSavedStore } from '../store/useSavedStore';
import { Icon } from './Icon';
import { ItemMedia } from './ItemMedia';
import { ItemBadges } from './ItemBadges';
import { formatDate } from '../utils/formatDate';
export function ItemCard({
  item
}: {
  item: LostFoundItem;
}) {
  const saved = useSavedStore(s => s.savedIds.includes(item.id));
  const toggleSave = useSavedStore(s => s.toggleSave);
  return <article className="item-card">
    <Link to={'/items/' + item.id} className="item-photo-link" aria-label={'View ' + item.title}>
      <ItemMedia item={item} />
      <ItemBadges item={item} />
    </Link>
    <button type="button" className={'bookmark-button' + (saved ? ' is-saved' : '')} onClick={() => toggleSave(item.id)} aria-pressed={saved} aria-label={(saved ? 'Unsave ' : 'Save ') + item.title} title={saved ? 'Remove from saved items' : 'Save item'}>
      <Icon name="bookmark" size={18} />
    </button>
    <div className="item-copy">
      <p className="item-category">
        {item.category}
      </p>
      <h2 className="item-title">
        <Link to={'/items/' + item.id}>
          {item.title}
        </Link>
      </h2>
      <p className="item-meta">
        <Icon name="pin" size={14} />
        <span>
          {item.location}
        </span>
      </p>
      <p className="item-meta">
        <Icon name="calendar" size={14} />
        <time dateTime={item.date}>
          {formatDate(item.date)}
        </time>
      </p>
      <div className="item-card-footer">
        <span>
          {item.status === 'Resolved' ? 'Reunited & resolved' : item.custody.includes('Central') ? 'At Central Room · A6' : 'Open report'}
        </span>
        <Link to={'/items/' + item.id} aria-label={'View details of ' + item.title}>View details<Icon name="arrow" size={12} /></Link>
      </div>
    </div>
  </article>;
}
