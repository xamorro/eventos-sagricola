import React, { useEffect, useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  ExternalLink, 
  Share2, 
  Ticket, 
  Users, 
  Sparkles,
  CalendarPlus,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { EventItem } from '../types';
import { formatEventDateFull } from '../utils/date';

interface EventModalProps {
  event: EventItem | null;
  onClose: () => void;
  onShowToast: (text: string, type: 'success' | 'info' | 'error') => void;
}

export const EventModal: React.FC<EventModalProps> = ({ event, onClose, onShowToast }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (event) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [event, onClose]);

  if (!event) return null;

  const handleExternalAction = () => {
    // Launch a celebratory confetti burst for mobile delight
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#f97316', '#fb923c', '#fbbf24', '#38bdf8'],
      });
    } catch {
      // ignore
    }

    // Open external URL
    if (event.externalUrl) {
      const url = event.externalUrl.startsWith('http')
        ? event.externalUrl
        : `https://${event.externalUrl}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      onShowToast('Enlace externo no especificado', 'info');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: event.title,
      text: `${event.title} en S'Agrícola (${event.date} a las ${event.time}h). ¡No te lo pierdas!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user canceled or unsupported
      }
    } else {
      try {
        await navigator.clipboard.writeText(
          `${event.title} - S'Agrícola: ${window.location.href}`
        );
        setCopied(true);
        onShowToast('¡Enlace copiado al portapapeles!', 'success');
        setTimeout(() => setCopied(false), 2500);
      } catch {
        onShowToast('No se pudo copiar el enlace', 'error');
      }
    }
  };

  const handleAddToCalendar = () => {
    try {
      const [year, month, day] = event.date.split('-');
      const [hour, minute] = (event.time || '20:00').split(':');
      
      const startDate = `${year}${month}${day}T${hour}${minute}00`;
      const endHour = String(Number(hour) + 2).padStart(2, '0');
      const endDate = `${year}${month}${day}T${endHour}${minute}00`;
      
      const title = encodeURIComponent(event.title);
      const details = encodeURIComponent(`${event.shortDescription}\n\nUbicación: ${event.location || "S'Agrícola"}`);
      const location = encodeURIComponent(`S'Agrícola Bar & Social Club, ${event.location || ''}`);

      const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}`;
      window.open(googleCalUrl, '_blank', 'noopener,noreferrer');
      onShowToast('Abriendo Google Calendar...', 'info');
    } catch {
      onShowToast('Error al generar enlace de calendario', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      {/* Click outside backdrop */}
      <div 
        className="absolute inset-0 cursor-pointer" 
        onClick={onClose}
        aria-hidden="true" 
      />

      {/* Modal Dialog Card (Mobile Bottom Sheet / Centered card) */}
      <div 
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-lg max-h-[92vh] sm:max-h-[85vh] bg-slate-900 border-t sm:border border-slate-700/80 rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-modal flex flex-col z-10 animate-slide-up"
      >
        {/* Mobile drag handle indicator */}
        <div className="sm:hidden w-full flex justify-center pt-3 pb-1" onClick={onClose}>
          <div className="w-12 h-1.5 rounded-full bg-slate-700/80" />
        </div>

        {/* Hero image with action bar */}
        <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full shrink-0 overflow-hidden bg-slate-950">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-black/30" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-white/10 shadow-lg backdrop-blur-md transition-all active:scale-95"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Category Pill */}
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/90 text-white shadow-md backdrop-blur-md border border-brand-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              {event.category || 'Evento'}
            </span>
          </div>

          {/* Title on image header */}
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
              {event.title}
            </h2>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Metadata badges row */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-800/80 border border-slate-700/50">
              <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400 shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Fecha</p>
                <p className="text-xs sm:text-sm font-bold text-white truncate">
                  {formatEventDateFull(event.date)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-800/80 border border-slate-700/50">
              <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Hora</p>
                <p className="text-xs sm:text-sm font-bold text-white truncate">
                  {event.time} h
                </p>
              </div>
            </div>

            {event.location && (
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-800/80 border border-slate-700/50">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Lugar</p>
                  <p className="text-xs sm:text-sm font-bold text-white truncate">
                    {event.location}
                  </p>
                </div>
              </div>
            )}

            {event.price && (
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-800/80 border border-slate-700/50">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                  <Ticket className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Precio</p>
                  <p className="text-xs sm:text-sm font-bold text-emerald-400 truncate">
                    {event.price}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Capacity notice if available */}
          {event.capacity && (
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs">
              <Users className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{event.capacity}</span>
            </div>
          )}

          {/* Full description */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400">
              Acerca de este evento
            </h3>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed whitespace-pre-line font-normal">
              {event.longDescription || event.shortDescription}
            </p>
          </div>

          {/* Social / Table share actions */}
          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-98"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              {copied ? '¡Copiado!' : 'Compartir con la mesa'}
            </button>

            <button
              onClick={handleAddToCalendar}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-98"
              title="Guardar en Google Calendar"
            >
              <CalendarPlus className="w-3.5 h-3.5 text-brand-400" />
              <span>Calendario</span>
            </button>
          </div>
        </div>

        {/* Modal Sticky Bottom Action Area (Big Mobile-First Buttons) */}
        <div className="p-4 sm:p-5 bg-slate-950/90 border-t border-slate-800 backdrop-blur-md shrink-0">
          <button
            onClick={handleExternalAction}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-brand-600 via-brand-500 to-amber-500 hover:from-brand-500 hover:to-amber-400 text-white font-extrabold text-base sm:text-lg shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2.5 transition-all transform active:scale-[0.98] group"
          >
            <span>Saber más / Apuntarse</span>
            <ExternalLink className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
