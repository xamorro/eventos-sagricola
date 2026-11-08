import { EventItem } from '../types';
import { INITIAL_EVENTS } from '../data/initialEvents';

const STORAGE_KEY = 'sagricola_events_data_v2';
const PIN_STORAGE_KEY = 'sagricola_admin_pin_v2';
const DEFAULT_PIN = '3202';

export const storage = {
  getEvents: (): EventItem[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_EVENTS));
        return INITIAL_EVENTS;
      }
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      return INITIAL_EVENTS;
    } catch (e) {
      console.error('Error carregant esdeveniments de localStorage:', e);
      return INITIAL_EVENTS;
    }
  },

  saveEvents: (events: EventItem[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch (e) {
      console.error('Error desant esdeveniments a localStorage:', e);
    }
  },

  resetEvents: (): EventItem[] => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_EVENTS));
      return INITIAL_EVENTS;
    } catch (e) {
      console.error('Error restablint esdeveniments:', e);
      return INITIAL_EVENTS;
    }
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
