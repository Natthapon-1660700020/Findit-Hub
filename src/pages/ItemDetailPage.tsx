import { useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Link, useParams } from 'react-router';
import { useItemDetail, useResolveItem } from '../hooks/useItems';
import { useSavedStore } from '../store/useSavedStore';
import { Icon, type IconName } from '../components/Icon';
import { ItemMedia } from '../components/ItemMedia';
import { ItemBadges } from '../components/ItemBadges';
import { ErrorAlert } from '../components/ErrorAlert';
import { formatDate } from '../utils/formatDate';
function Fact({
  icon,
  label,
  children
}: {
  icon: IconName;
  label: string;
  children: ReactNode;
}) {
  return <div className="detail-fact">
    <dt>
      <Icon name={icon} size={19} />
      {label}
    </dt>
    <dd>
      {children}
    </dd>
  </div>;
}
export function ItemDetailPage() {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const {
    data: item,
    isLoading,
    isError,
    refetch
  } = useItemDetail(id);
  const saved = useSavedStore(s => s.savedIds.includes(id || ''));
  const toggleSave = useSavedStore(s => s.toggleSave);
  const resolve = useResolveItem();
  const dialog = useRef<HTMLDialogElement>(null);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!item) return;
    setError('');
    try {
      await resolve.mutateAsync({
        id: item.id,
        note: note.trim() || 'Item returned to its owner or handed over to the campus office.'
      });
      dialog.current?.close();
      setNote('');
    } catch {
      setError('We could not resolve this report. Please try again.');
    }
  }
  return <div className="page detail-page">
    <Link to="/" className="back-link"><Icon name="back" size={17} />Back to Explore</Link>
    {isLoading ? <div className="detail-panel" aria-label="Loading item details">
      <div className="skeleton" style={{
        minHeight: '31.25rem'
      }} />
      <div>
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line short" />
        <div className="skeleton skeleton-line" />
      </div>
    </div> : isError || !item ? <ErrorAlert message="This item could not be found. Check the link or try loading it again." onRetry={() => refetch()} /> : <article className="detail-panel">
      <div className="detail-photo">
        <ItemMedia key={item.id} item={item} eager />
        <ItemBadges item={item} />
      </div>
      <div className="detail-content">
        <p className="detail-id">Campus report · #{item.id}</p>
        <div className="detail-title-row">
          <h1>
            {item.title}
          </h1>
          <button className={'bookmark-button' + (saved ? ' is-saved' : '')} type="button" aria-label={saved ? 'Remove from saved items' : 'Save item'} aria-pressed={saved} onClick={() => toggleSave(item.id)}>
            <Icon name="bookmark" size={23} />
          </button>
        </div>
        <dl className="detail-facts">
          <Fact icon="tag" label="Category">
            {item.category}
          </Fact>
          <Fact icon="pin" label="Location">
            {item.location}
          </Fact>
          <Fact icon="calendar" label={item.type === 'Lost' ? 'Date lost' : 'Date found'}>
            <time dateTime={item.date}>
              {formatDate(item.date)}
            </time>
          </Fact>
          <Fact icon="file" label="Description">
            {item.description}
          </Fact>
          <Fact icon="building" label={item.type === 'Lost' ? 'Return to' : 'Pick-up point'}>
            {item.type === 'Lost' && item.custody === 'With Finder / Owner' ? 'Contact the owner directly, or hand in at Central Lost & Found, Building A6 (first floor).' : item.custody}
          </Fact>
        </dl>
        <div className="contact-panel">
          <h2><Icon name="phone" size={15} />Contact &amp; verification</h2>
          <p>
            {item.contact}
          </p>
          <p className="field-help">Contact the owner or finder to verify ownership and arrange a return.</p>
        </div>
        {item.status === 'Resolved' && <div className="resolution-panel" role="status">
          <strong><Icon name="checkCircle" size={16} />A happy ending. This report is resolved.</strong>
          {item.resolvedNote && <p>
            {item.resolvedNote}
          </p>}
        </div>}
        <div className="detail-actions">
          <button type="button" className={'button button-full ' + (saved ? 'button-secondary' : 'button-primary')} aria-pressed={saved} onClick={() => toggleSave(item.id)}>
            <Icon name={saved ? 'check' : 'bookmark'} size={18} />
            {saved ? 'Saved to your items' : 'Save item'}
          </button>
          {item.status === 'Active' && <button className="button button-ghost button-full" type="button" onClick={() => {
            setError('');
            dialog.current?.showModal();
          }}><Icon name="checkCircle" size={16} />Mark as resolved</button>}
        </div>
      </div>
    </article>}
    <dialog ref={dialog} className="resolve-dialog" aria-labelledby="resolve-title" aria-describedby="resolve-description" onCancel={e => {
      if (resolve.isPending) e.preventDefault();
    }}>
      <div className="dialog-header">
        <h2 id="resolve-title">A happy reunion?</h2>
        <button className="icon-button" aria-label="Close dialog" type="button" disabled={resolve.isPending} onClick={() => dialog.current?.close()}>
          <Icon name="close" size={19} />
        </button>
      </div>
      <p id="resolve-description">Close this report when the item has been returned to its owner or handed over to the campus office.</p>
      <form onSubmit={submit}>
        <div className="field">
          <label htmlFor="resolution-note">Resolution note <span className="optional">(optional)</span></label>
          <textarea id="resolution-note" placeholder="e.g. Returned to the owner at Central Room, Building A6." value={note} onChange={e => setNote(e.target.value)} maxLength={1000} />
        </div>
        {error && <p className="error-alert" role="alert">
          {error}
        </p>}
        <div className="dialog-actions">
          <button className="button button-ghost" type="button" disabled={resolve.isPending} onClick={() => dialog.current?.close()}>Cancel</button>
          <button className="button button-primary" type="submit" disabled={resolve.isPending}>
            <Icon name="check" size={16} />
            {resolve.isPending ? 'Updating…' : 'Confirm resolution'}
          </button>
        </div>
      </form>
    </dialog>
  </div>;
}
