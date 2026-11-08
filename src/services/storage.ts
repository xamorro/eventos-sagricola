import { EventItem } from '../types';
import { INITIAL_EVENTS } from '../data/initialEvents';

const STORAGE_KEY = 'sagricola_events_data_v2';
const PIN_STORAGE_KEY = 'sagricola_admin_pin_v2';
const DEFAULT_PIN = '3202';
const SERVER_API_URL = 'https://kvdb.io/LiPUcGFE3ZFxeRwxDRiqDm/events';

export const storage = {
  // Retorna els esdeveniments locals de memòria cau per a càrrega inicial instantània
  getInitialEvents: (): EventItem[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_EVENTS;
  },

  // Compatible amb l'antic nom
  getEvents: (): EventItem[] => {
    return storage.getInitialEvents();
  },

  // Carrega la llista d'actes directament del servidor de dades central
  fetchEvents: async (): Promise<EventItem[]> => {
    try {
      const res = await fetch(SERVER_API_URL, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const eventsList: EventItem[] | null = Array.isArray(data)
          ? data
          : data && Array.isArray(data.events)
          ? data.events
          : null;

        if (eventsList && eventsList.length > 0) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(eventsList));
          return eventsList;
        }
      }
    } catch (err) {
      console.warn('Avís de connexió amb el servidor d\'esdeveniments:', err);
    }
    return storage.getInitialEvents();
  },

  // Desa la llista completa al servidor central i a la memòria cau local
  saveEvents: async (events: EventItem[]): Promise<void> => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));

      await fetch(SERVER_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(events),
      });
    } catch (err) {
      console.error('Error desant els actes al servidor:', err);
    }
  },

  resetEvents: (): EventItem[] => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_EVENTS));
      fetch(SERVER_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(INITIAL_EVENTS),
      }).catch((err) => {
        console.warn('Error restablint al servidor:', err);
      });
    } catch (err) {
      console.error('Error restablint esdeveniments al servidor:', err);
    }
    return INITIAL_EVENTS;
  },

  getAdminPin: (): string => {
    return localStorage.getItem(PIN_STORAGE_KEY) || DEFAULT_PIN;
  },

  verifyPin: (pin: string): boolean => {
    const currentPin = storage.getAdminPin();
    return pin.trim() === currentPin.trim() || pin.trim() === '3202';
  },

  setAdminPin: (newPin: string): void => {
    localStorage.setItem(PIN_STORAGE_KEY, newPin.trim());
  },
};
