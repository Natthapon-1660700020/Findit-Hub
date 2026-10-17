import { useMemo, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useItems } from '../hooks/useItems';
import { useSavedStore } from '../store/useSavedStore';
import { ITEM_CATEGORIES, CAMPUS_LOCATIONS } from '../types/item';
import { Icon } from '../components/Icon';
import { ItemCard } from '../components/ItemCard';
import { SkeletonCard } from '../components/SkeletonCard';
import { ErrorAlert } from '../components/ErrorAlert';
import { EmptyState } from '../components/EmptyState';
export function ExplorePage() {
  const {
    data: items,
    isLoading,
    isError,
    refetch
  } = useItems();
  const count = useSavedStore(s => s.savedIds.length);
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [type, setType] = useState('All');
  const [category, setCategory] = useState('All');
  const [campus, setCampus] = useState('All');
  const [central, setCentral] = useState(false);
  const filtered = useMemo(() => (items || []).filter(item => (!searchTerm || (item.title + ' ' + item.description).toLowerCase().includes(searchTerm.toLowerCase())) && (type === 'All' || item.type === type) && (category === 'All' || item.category === category) && (campus === 'All' || item.location === campus) && (!central || item.custody === 'Central Lost & Found Room (Building A6 First Floor)')), [items, searchTerm, type, category, campus, central]);
  const hasFilters = !!searchTerm || type !== 'All' || category !== 'All' || campus !== 'All' || central;
  function reset() {
    setSearch('');
    setSearchTerm('');
    setType('All');
    setCategory('All');
    setCampus('All');
    setCentral(false);
  }
  function submit(e: FormEvent) {
    e.preventDefault();
    setSearchTerm(search.trim());
  }
  return <div className="page explore-page">
    <div className="page-heading">
      <div>
        <span className="eyebrow">Bangkok University Community</span>
        <h1>Find what’s lost.</h1>
      </div>
      <Link to="/saved" className="saved-shortcut">
        <Icon name="bookmark" size={18} />
        <span>{count} saved {count === 1 ? 'item' : 'items'}</span>
      </Link>
    </div>
    {location.state?.reportCreated && <div className="success-alert" role="status">
      <Icon name="checkCircle" size={19} />
      <span>Your report is published. Thank you for helping our campus community.</span>
      <button type="button" className="icon-button" aria-label="Dismiss confirmation" onClick={() => navigate(location.pathname, {
        replace: true,
        state: null
      })}>
        <Icon name="close" size={16} />
      </button>
    </div>}
    <form className="search-form" role="search" onSubmit={submit}>
      <Icon name="search" size={23} />
      <input className="search-input" aria-label="Search items" placeholder="Search for items, e.g. wallet, keys, umbrella..." value={search} onChange={e => {
        setSearch(e.target.value);
        setSearchTerm(e.target.value.trim());
      }} />
      <button className="button button-primary" type="submit">Search<Icon name="arrow" size={15} /></button>
    </form>
    <div className="filter-bar">
      <div className="filter-group" aria-label="Filter by report type">
        {['All', 'Lost', 'Found'].map(t => <button type="button" className={'filter-pill' + (type === t ? ' selected' : '')} key={t} aria-pressed={type === t} onClick={() => setType(t)}>
          {t !== 'All' && <span className={'status-dot dot-' + t.toLowerCase()} />}
          {t === 'All' ? 'All items' : t}
        </button>)}
      </div>
      <div className="filter-group">
        <div className="filter-select">
          <Icon name="grid" size={15} />
          <select aria-label="Filter by category" value={category} onChange={e => setCategory(e.target.value)}>
            <option value="All">All categories</option>
            {ITEM_CATEGORIES.map(c => <option key={c}>
              {c}
            </option>)}
          </select>
          <Icon name="chevron" size={13} />
        </div>
        <div className="filter-select">
          <Icon name="pin" size={15} />
          <select aria-label="Filter by campus location" value={campus} onChange={e => setCampus(e.target.value)}>
            <option value="All">All locations</option>
            {CAMPUS_LOCATIONS.map(c => <option key={c}>
              {c}
            </option>)}
          </select>
          <Icon name="chevron" size={13} />
        </div>
        <label className="filter-check"><input type="checkbox" checked={central} onChange={e => setCentral(e.target.checked)} />Central Room · A6</label>
      </div>
    </div>
    <div className="results-bar">
      <p role="status" aria-live="polite">
        {isLoading ? 'Finding your next reunion…' : <>
          <strong>
            {filtered.length}
            {filtered.length === 1 ? 'item' : 'items'}
          </strong>
          {hasFilters ? ' matching your search' : ' around campus'}
        </>}
      </p>
      {hasFilters ? <button className="text-button" type="button" onClick={reset}><Icon name="close" size={12} />Clear filters</button> : <span></span>}
    </div>
    {isLoading && <div className="item-grid" aria-label="Loading items">
      {Array.from({
        length: 8
      }, (_, i) => <SkeletonCard key={i} />)}
    </div>}
    {isError && <ErrorAlert onRetry={() => refetch()} />}
    {!isLoading && !isError && (filtered.length ? <div className="item-grid">
      {filtered.map(item => <ItemCard item={item} key={item.id} />)}
    </div> : <EmptyState icon="search" title="No items found" description="Try a different keyword or clear your filters. Your next match could be just a search away." action="Clear filters" onAction={reset} />)}
  </div>;
}
