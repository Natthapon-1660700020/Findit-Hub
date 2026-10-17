export function formatDate(value: string) {
  const date = new Date(value + 'T12:00:00');
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}
