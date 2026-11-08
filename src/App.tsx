import React, { useState, useEffect, useCallback } from 'react';
import { EventItem, EventFormData, EventStatus, ViewMode, ToastMessage } from './types';
import { storage } from './services/storage';
import { Header } from './components/Header';
import { ClientView } from './components/ClientView';
import { EventDetailPage } from './components/EventDetailPage';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminEventFormModal } from './components/AdminEventFormModal';
import { QrCodeModal } from './components/QrCodeModal';
import { ToastContainer } from './components/ToastContainer';

export const App: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>(() => storage.getEvents());
  const [viewMode, setViewMode] = useState<ViewMode>('client');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Modals state
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);
  const [isEventFormModalOpen, setIsEventFormModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback(
    (text: string, type: 'success' | 'info' | 'error' | 'warning' = 'info') => {
      const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
      setToasts((prev) => [...prev, { id, text, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Inicialització, suport de botó enrere i càrrega des del servidor
  useEffect(() => {
    setIsAdminAuthModalOpen(false);
    if (window.location.hash && !window.location.hash.startsWith('#acte')) {
      window.history.replaceState(null, '', window.location.pathname);
    }

    // Carregar directament des del servidor central
    storage.fetchEvents().then((serverEvents) => {
      if (serverEvents && Array.isArray(serverEvents) && serverEvents.length > 0) {
        setEvents(serverEvents);
      }
    });

    const handlePopState = () => {
      if (!window.location.hash.startsWith('#acte')) {
        setSelectedEvent(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Actualitzar quan la pantalla torna a tenir focus
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        storage.fetchEvents().then((serverEvents) => {
          if (serverEvents && Array.isArray(serverEvents) && serverEvents.length > 0) {
            setEvents(serverEvents);
          }
        });
      }
    };
    window.addEventListener('visibilitychange', handleVisibility);
    return () => window.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Persistir esdeveniments tant a memòria local com al servidor
  const updateEventsState = (newEvents: EventItem[]) => {
    setEvents(newEvents);
    storage.saveEvents(newEvents);
  };

  const handleSelectEvent = (event: EventItem) => {
    setSelectedEvent(event);
    window.history.pushState({ eventId: event.id }, '', `#acte-${event.id}`);
  };

  const handleBackFromDetail = () => {
    if (window.location.hash.startsWith('#acte')) {
      window.history.back();
    } else {
      setSelectedEvent(null);
    }
  };

  // Status toggle handler (Activo <-> Inactivo)
  const handleToggleStatus = (id: string) => {
    const target = events.find((e) => e.id === id);
    if (!target) return;

    const newStatus: EventStatus = target.status === 'active' ? 'inactive' : 'active';
    const updated = events.map((e) =>
      e.id === id ? { ...e, status: newStatus } : e
    );

    updateEventsState(updated);
    showToast(
      newStatus === 'active'
        ? `"${target.title}" ara és visible per al públic`
        : `"${target.title}" s'ha ocultat del públic`,
      'info'
    );
  };

  // Create or Update event
  const handleSaveEvent = (data: EventFormData, eventId?: string) => {
    if (eventId) {
      // Edit existing
      const updated = events.map((item) =>
        item.id === eventId ? { ...item, ...data } : item
      );
      updateEventsState(updated);
      showToast('Acte actualitzat amb èxit', 'success');
    } else {
      // Create new
      const newEvent: EventItem = {
        ...data,
        id: `evt-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      const updated = [newEvent, ...events];
      updateEventsState(updated);
      showToast('Nou acte publicat correctament', 'success');
    }
  };

  // Delete event
  const handleDeleteEvent = (id: string) => {
    const target = events.find((e) => e.id === id);
    const updated = events.filter((e) => e.id !== id);
    updateEventsState(updated);
    showToast(
      target ? `"${target.title}" s'ha eliminat` : 'Acte eliminat',
      'info'
    );
  };

  // Reset demo events
  const handleResetEvents = () => {
    const initial = storage.resetEvents();
    setEvents(initial);
    showToast('Actes inicials restablerts', 'success');
  };

  // PIN validation
  const handleVerifyPin = (pin: string) => {
    return storage.verifyPin(pin);
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    setIsAdminAuthModalOpen(false);
    setViewMode('admin');
    showToast('Accés concedit al Tauler de Gestió', 'success');
  };

  const handleBackToClientView = () => {
    setIsAdminAuthModalOpen(false);
    setViewMode('client');
    if (window.location.hash && !window.location.hash.startsWith('#acte')) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    setIsAdminAuthModalOpen(false);
    setViewMode('client');
    if (window.location.hash && !window.location.hash.startsWith('#acte')) {
      window.history.replaceState(null, '', window.location.pathname);
    }
    showToast('Heu sortit del mode d\'administració', 'info');
  };

  const handleOpenAdminAuth = () => {
    if (isAdminAuthenticated) {
      setViewMode('admin');
    } else {
      setIsAdminAuthModalOpen(true);
    }
  };

  const activeCount = events.filter((e) => e.status === 'active').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {selectedEvent ? (
        /* Full-page detail view instead of a floating modal */
        <EventDetailPage
          event={selectedEvent}
          onBack={handleBackFromDetail}
          onShowToast={showToast}
        />
      ) : viewMode === 'client' ? (
        <>
          {/* Mobile client view with header and vertical card feed */}
          <Header activeCount={activeCount} />

          <ClientView
            events={events}
            onSelectEvent={handleSelectEvent}
            onOpenAdminAuth={handleOpenAdminAuth}
          />
        </>
      ) : (
        /* Admin dashboard view */
        <AdminDashboard
          events={events}
          onToggleStatus={handleToggleStatus}
          onEditEvent={(evt) => {
            setEditingEvent(evt);
            setIsEventFormModalOpen(true);
          }}
          onDeleteEvent={handleDeleteEvent}
          onCreateNew={() => {
            setEditingEvent(null);
            setIsEventFormModalOpen(true);
          }}
          onBackToClientView={handleBackToClientView}
          onLogout={handleLogout}
          onResetEvents={handleResetEvents}
          onPreviewEvent={handleSelectEvent}
          onOpenQr={() => setIsQrModalOpen(true)}
        />
      )}

      {/* Admin PIN Login Modal */}
      <AdminLoginModal
        isOpen={isAdminAuthModalOpen}
        onClose={() => setIsAdminAuthModalOpen(false)}
        onSuccess={handleAdminLoginSuccess}
        onVerifyPin={handleVerifyPin}
      />

      {/* Admin Event Form Modal (Create & Edit) */}
      <AdminEventFormModal
        isOpen={isEventFormModalOpen}
        onClose={() => {
          setIsEventFormModalOpen(false);
          setEditingEvent(null);
        }}
        onSave={handleSaveEvent}
        initialEvent={editingEvent}
      />

      {/* QR Code Preview Modal */}
      <QrCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
      />
    </div>
  );
};
