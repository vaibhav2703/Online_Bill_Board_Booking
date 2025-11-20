export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function calculateRemainingDays(endDate) {
  if (!endDate) return null;

  const end = new Date(endDate);
  const now = new Date();

  // Reset time to start of day for accurate day calculation
  end.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);

  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

export function formatRemainingDays(days) {
  if (days === null) return 'N/A';
  if (days < 0) return 'Expired';
  if (days === 0) return 'Expires today';
  if (days === 1) return '1 day left';
  return `${days} days left`;
}
