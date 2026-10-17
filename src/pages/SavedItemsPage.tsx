import { useMemo } from 'react';
import { useItems } from '../hooks/useItems';
import { useSavedStore } from '../store/useSavedStore';
import { Icon } from '../components/Icon';
import { ItemCard } from '../components/ItemCard';
import { SkeletonCard } from '../components/SkeletonCard';
import { ErrorAlert } from '../components/ErrorAlert';
import { EmptyState } from '../components/EmptyState';
export function SavedItemsPage() {
  const {
    data: items,
    isLoading,
    isError,
    refetch
  } = useItems();
  const savedIds = useSavedStore(s => s.savedIds);
  const clear = useSavedStore(s => s.clearAllSaved);
  const saved = useMemo(() => (items || []).filter(item => savedIds.includes(item.id)), [items, savedIds]);
  return <div className="page">
    <div className="page-heading">
      <div>
        <span className="eyebrow">Keep them close</span>
        <h1>Saved items</h1>
      </div>
      {savedIds.length > 0 && <button className="button button-danger clear-saved" type="button" onClick={clear}><Icon name="trash" size={15} />Clear all saved</button>}
    </div>
    {isLoading && <div className="item-grid saved-grid" aria-label="Loading saved items">
      {[0, 1, 2].map(i => <SkeletonCard key={i} />)}
    </div>}
    {isError && <ErrorAlert onRetry={() => refetch()} />}
    {!isLoading && !isError && (saved.length ? <>
      <div className="results-bar">
        <p role="status"><strong>{saved.length} saved {saved.length === 1 ? 'item' : 'items'}</strong> to keep an eye on</p>
        <span>Saved in this browser</span>
      </div>
      <div className="item-grid saved-grid">
        {saved.map(item => <ItemCard key={item.id} item={item} />)}
      </div>
    </> : <EmptyState icon="bookmark" title="Your collection starts here" description="Tap the bookmark on an item to save it. You can come back to your finds whenever you need." action="Explore items" to="/" />)}
  </div>;
}
