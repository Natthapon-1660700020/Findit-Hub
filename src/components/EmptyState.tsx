import { Link } from 'react-router';
import { Icon, type IconName } from './Icon';
export function EmptyState({
  icon,
  title,
  description,
  action,
  to,
  onAction
}: {
  icon: IconName;
  title: string;
  description: string;
  action: string;
  to?: string;
  onAction?: () => void;
}) {
  return <div className="empty-state">
    <div className="empty-icon">
      <Icon name={icon} size={28} />
    </div>
    <h2>
      {title}
    </h2>
    <p>
      {description}
    </p>
    {to ? <Link to={to} className="button button-primary">
      {action}
      <Icon name="arrow" size={16} />
    </Link> : <button className="button button-secondary" type="button" onClick={onAction}>
      {action}
    </button>}
  </div>;
}
