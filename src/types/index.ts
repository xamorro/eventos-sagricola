export type EventStatus = 'active' | 'inactive';

export interface EventItem {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  date: string; // ISO date 'YYYY-MM-DD'
  time: string; // 'HH:MM'
  imageUrl: string;
  externalUrl: string;
  status: EventStatus;
  category: string;
  location?: string;
  price?: string;
  capacity?: string;
  createdAt: string;
}

export type EventFormData = Omit<EventItem, 'id' | 'createdAt'>;

export type ViewMode = 'client' | 'admin';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error' | 'warning';
  text: string;
}
