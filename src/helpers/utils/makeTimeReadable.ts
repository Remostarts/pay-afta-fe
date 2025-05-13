// make readable time
export function formatISODateToReadable(isoDate: string): string {
  // Parse the ISO date string into a Date object
  const date = new Date(isoDate);

  // Format the date using options for locale-based formatting
  const formattedDate = date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return formattedDate; // e.g., "18 Dec, 2024"
}
