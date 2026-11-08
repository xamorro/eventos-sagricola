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
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#f59e0b', '#d97706', '#3b82f6', '#10b981'],
      });
    } catch {
      // ignore
    }

    if (event.externalUrl) {
      const url = event.externalUrl.startsWith('http')
        ? event.externalUrl
        : `https://${event.externalUrl}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      onShowToast('Enllaç extern no disponible', 'info');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: event.title,
      text: `${event.title} a S'Agrícola (${event.date} a les ${event.time} h). No t'ho perdis!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user canceled
      }
    } else {
      try {
        await navigator.clipboard.writeText(
          `${event.title} - S'Agrícola: ${window.location.href}`
        );
        setCopied(true);
        onShowToast('Enllaç copiat al porta-retalls!', 'success');
        setTimeout(() => setCopied(false), 2500);
      } catch {
        onShowToast('No s\'ha pogut copiar l\'enllaç', 'error');
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
      const details = encodeURIComponent(`${event.shortDescription}\n\nLloc: ${event.location || "S'Agrícola"}`);
      const location = encodeURIComponent(`S'Agrícola, ${event.location || 'Manacor'}`);

      const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}`;
      window.open(googleCalUrl, '_blank', 'noopener,noreferrer');
      onShowToast('Obrint Google Calendar...', 'info');
    } catch {
      onShowToast('Error en generar l\'enllaç del calendari', 'error');
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

      {/* Modal Dialog Card */}
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
            aria-label="Tancar modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Category Pill */}
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500 text-slate-950 shadow-md backdrop-blur-md border border-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              {event.category || 'Acte'}
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
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Data</p>
                <p className="text-xs sm:text-sm font-bold text-white truncate">
                  {formatEventDateFull(event.date)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-800/80 border border-slate-700/50">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
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
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Lloc</p>
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
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Preu</p>
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
              Sobre aquest acte
            </h3>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed whitespace-pre-line font-normal">
              {event.longDescription || event.shortDescription}
            </p>
          </div>

          {/* Share & Calendar actions */}
          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-98"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              {copied ? 'Copiat!' : 'Compartir acte'}
            </button>

            <button
              onClick={handleAddToCalendar}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-98"
              title="Afegir a Google Calendar"
            >
              <CalendarPlus className="w-3.5 h-3.5 text-amber-400" />
              <span>Calendari</span>
            </button>
          </div>
        </div>

        {/* Modal Sticky Bottom Action Area */}
        <div className="p-4 sm:p-5 bg-slate-950/90 border-t border-slate-800 backdrop-blur-md shrink-0">
          <button
            onClick={handleExternalAction}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-brand-600 hover:from-amber-400 hover:to-brand-500 text-slate-950 font-extrabold text-base sm:text-lg shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2.5 transition-all transform active:scale-[0.98] group"
          >
            <span>Saber-ne més / Apuntar-se</span>
            <ExternalLink className="w-5 h-5 text-slate-950 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
