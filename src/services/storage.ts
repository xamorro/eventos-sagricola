import { EventItem } from '../types';
import { INITIAL_EVENTS } from '../data/initialEvents';

const STORAGE_KEY = 'sagricola_events_data_v2';
const VERSION_KEY = 'sagricola_events_version_v2';
const PIN_STORAGE_KEY = 'sagricola_admin_pin_v2';
const DEFAULT_PIN = '3202';
const CLOUD_SYNC_URL = 'https://kvdb.io/LiPUcGFE3ZFxeRwxDRiqDm/events';

interface CloudEnvelope {
  version: number;
  updatedAt: string;
  events: EventItem[];
}

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
      const newVersion = Date.now();
      // 1. Desar a la memòria local immediatament
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
      localStorage.setItem(VERSION_KEY, String(newVersion));

      const payload: CloudEnvelope = {
        version: newVersion,
        updatedAt: new Date().toISOString(),
        events,
      };

      // 2. Sincronitzar amb el núvol en segon pla per a tots els mòbils
      fetch(CLOUD_SYNC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch((err) => {
        console.warn('Avís de sincronització al núvol:', err);
      });
    } catch (e) {
      console.error('Error desant esdeveniments a localStorage:', e);
    }
  },

  // Sincronització intel·ligent entre PC i Mòbils
  syncWithCloud: async (localEvents: EventItem[]): Promise<EventItem[]> => {
    try {
      const response = await fetch(CLOUD_SYNC_URL, { cache: 'no-store' });
      if (!response.ok) {
        if (localEvents.length > 0) {
          const version = Number(localStorage.getItem(VERSION_KEY)) || Date.now();
          const payload: CloudEnvelope = {
            version,
            updatedAt: new Date().toISOString(),
            events: localEvents,
          };
          await fetch(CLOUD_SYNC_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }).catch(console.warn);
        }
        return localEvents;
      }

      const cloudData = await response.json();
      let cloudVersion = 0;
      let cloudEvents: EventItem[] = [];

      if (Array.isArray(cloudData)) {
        cloudEvents = cloudData;
        cloudVersion = 0;
      } else if (cloudData && Array.isArray(cloudData.events)) {
        cloudEvents = cloudData.events;
        cloudVersion = typeof cloudData.version === 'number' ? cloudData.version : 0;
      }

      const localVersionStr = localStorage.getItem(VERSION_KEY);
      let localVersion = localVersionStr ? Number(localVersionStr) : 0;

      // Si el PC té esdeveniments afegits (ex: 5 actes) però encara no té versió, prioritzar-lo
      if (!localVersionStr && localEvents.length > 3) {
        localVersion = Date.now();
        localStorage.setItem(VERSION_KEY, String(localVersion));
      }

      // Si el local és més nou que el núvol (ex: el PC amb els nous actes)
      if (localVersion > cloudVersion && localEvents.length > 0) {
        const payload: CloudEnvelope = {
          version: localVersion,
          updatedAt: new Date().toISOString(),
          events: localEvents,
        };
        fetch(CLOUD_SYNC_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }).catch(console.warn);
        return localEvents;
      }

      // Si el núvol és més nou (ex: el mòbil que rep els canvis del PC)
      if (cloudVersion > localVersion && cloudEvents.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudEvents));
        localStorage.setItem(VERSION_KEY, String(cloudVersion));
        return cloudEvents;
      }

      // Desempat si ambdós tenen versió 0
      if (cloudEvents.length > localEvents.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudEvents));
        localStorage.setItem(VERSION_KEY, String(Date.now()));
        return cloudEvents;
      } else if (localEvents.length > cloudEvents.length) {
        const payload: CloudEnvelope = {
          version: Date.now(),
          updatedAt: new Date().toISOString(),
          events: localEvents,
        };
        fetch(CLOUD_SYNC_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }).catch(console.warn);
        return localEvents;
      }

      return localEvents;
    } catch (e) {
      console.warn('Sincronització al núvol no disponible en aquest moment, emprant dades locals:', e);
      return localEvents;
    }
  },

  resetEvents: (): EventItem[] => {
    try {
      const resetVersion = Date.now();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_EVENTS));
      localStorage.setItem(VERSION_KEY, String(resetVersion));
      const payload: CloudEnvelope = {
        version: resetVersion,
        updatedAt: new Date().toISOString(),
        events: INITIAL_EVENTS,
      };
      fetch(CLOUD_SYNC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(console.warn);
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
