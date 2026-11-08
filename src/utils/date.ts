export function formatEventDate(dateString: string): string {
  if (!dateString) return '';
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    if (!year || !month || !day) return dateString;
    const date = new Date(year, month - 1, day);
    
    // Format in Mallorquín / Català de Mallorca
    const formatted = new Intl.DateTimeFormat('ca-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    }).format(date);
    
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  } catch {
    return dateString;
  }
}

export function formatEventDateFull(dateString: string): string {
  if (!dateString) return '';
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    if (!year || !month || !day) return dateString;
    const date = new Date(year, month - 1, day);
    
    const formatted = new Intl.DateTimeFormat('ca-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
    
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  } catch {
    return dateString;
  }
}

export function getDaysRemainingBadge(dateString: string): { label: string; isUrgent: boolean } | null {
  if (!dateString) return null;
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    const eventDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);

    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return { label: 'AVUI!', isUrgent: true };
    if (diffDays === 1) return { label: 'Demà', isUrgent: true };
    if (diffDays > 1 && diffDays <= 7) return { label: `D'aquí a ${diffDays} dies`, isUrgent: false };
    if (diffDays < 0) return { label: 'Ja celebrat', isUrgent: false };
    return null;
  } catch {
    return null;
  }
}
