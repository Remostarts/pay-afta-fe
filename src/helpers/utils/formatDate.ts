import { format } from 'date-fns';

export function getTodayFormatted(): string {
  const today = new Date();
  return format(today, 'MMM d, yyyy');
}
