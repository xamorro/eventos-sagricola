import React, { useState, useEffect, useCallback } from 'react';
import { EventItem, EventFormData, EventStatus, ViewMode, ToastMessage } from './types';
import { storage } from './services/storage';
import { Header } from './components/Header';
import { ClientView } from './components/ClientView';
import { EventModal } from './components/EventModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminEventFormModal } from './components/AdminEventFormModal';
import { QrCodeModal } from './components/QrCodeModal';
import { ToastContainer } from './components/ToastContainer';

export const App: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>(() => storage.getEvents());
  const [viewMode, setViewMode] = useState<ViewMode>('client');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

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

  // Listen to hash change (e.g. #admin or /admin route simulation)
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#admin' || window.location.pathname.includes('/admin')) {
        if (viewMode !== 'admin') {
          setIsAdminAuthModalOpen(true);
        }
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, [viewMode]);

  // Persist events whenever they change
  const updateEventsState = (newEvents: EventItem[]) => {
    setEvents(newEvents);
    storage.saveEvents(newEvents);
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
        ? `"${target.title}" ahora es visible para los clientes`
        : `"${target.title}" se ha ocultado del público`,
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
      showToast('Evento actualizado con éxito', 'success');
    } else {
      // Create new
      const newEvent: EventItem = {
        ...data,
        id: `evt-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      const updated = [newEvent, ...events];
      updateEventsState(updated);
      showToast('Nuevo evento publicado correctamente', 'success');
    }
  };

  // Delete event
  const handleDeleteEvent = (id: string) => {
    const target = events.find((e) => e.id === id);
    const updated = events.filter((e) => e.id !== id);
    updateEventsState(updated);
    showToast(
      target ? `"${target.title}" ha sido eliminado` : 'Evento eliminado',
      'info'
    );
  };

  // Reset demo events
  const handleResetEvents = () => {
    const initial = storage.resetEvents();
    setEvents(initial);
    showToast('Eventos iniciales restaurados', 'success');
  };

  // PIN validation
  const handleVerifyPin = (pin: string) => {
    return storage.verifyPin(pin);
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthModalOpen(false);
    setViewMode('admin');
    window.location.hash = 'admin';
    showToast('Acceso concedido al Panel de Administración', 'success');
  };

  const handleLogout = () => {
    setViewMode('client');
    window.location.hash = '';
    showToast('Has salido del modo administrador', 'info');
  };

  const activeCount = events.filter((e) => e.status === 'active').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {viewMode === 'client' ? (
        <>
          {/* Mobile client view with header and vertical card feed */}
          <Header activeCount={activeCount} />

          <ClientView
            events={events}
            onSelectEvent={(evt) => setSelectedEvent(evt)}
            onOpenAdminAuth={() => setIsAdminAuthModalOpen(true)}
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
          onBackToClientView={() => setViewMode('client')}
          onLogout={handleLogout}
          onResetEvents={handleResetEvents}
          onPreviewEvent={(evt) => setSelectedEvent(evt)}
          onOpenQr={() => setIsQrModalOpen(true)}
        />
      )}

      {/* Event Details Modal */}
      <EventModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onShowToast={showToast}
      />

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
