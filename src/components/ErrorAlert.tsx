import { Icon } from './Icon';
export function ErrorAlert({
  message = 'We could not load the items. Please try again.',
  onRetry
}: {
  message?: string;
  onRetry: () => void;
}) {
  return <div className="error-alert" role="alert">
    <Icon name="info" size={19} />
    <p>
      {message}
    </p>
    <button className="text-button" type="button" onClick={onRetry}>Try again<Icon name="arrow" size={14} /></button>
  </div>;
}
