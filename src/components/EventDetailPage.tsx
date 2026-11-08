import React, { useEffect, useState } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  ExternalLink, 
  Share2, 
  Users, 
  Sparkles, 
  CalendarPlus, 
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { EventItem } from '../types';
import { formatEventDateFull, getDaysRemainingBadge, getEventDateParts } from '../utils/date';

interface EventDetailPageProps {
  event: EventItem;
  onBack: () => void;
  onShowToast: (text: string, type: 'success' | 'info' | 'error') => void;
}

export const EventDetailPage: React.FC<EventDetailPageProps> = ({
  event,
  onBack,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);
  const daysBadge = getDaysRemainingBadge(event.date);
  const dateParts = getEventDateParts(event.date);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [event.id]);

  const handleExternalAction = () => {
    try {
      confetti({
        particleCount: 60,
        spread: 70,
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
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between text-slate-100 animate-fade-in">
      {/* Top sticky navigation bar */}
      <header className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs sm:text-sm font-semibold border border-slate-700/80 transition-all active:scale-95 group"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-1 transition-transform" />
            <span>Tornar a l'agenda</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition-all active:scale-95"
              title="Compartir acte"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main page content */}
      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6 flex-1">
        {/* Hero image card */}
        <div className="relative aspect-[16/10] sm:aspect-[21/9] w-full rounded-3xl overflow-hidden bg-slate-900 shadow-xl border border-slate-800">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Badges on hero image */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500 text-slate-950 shadow-md backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              {event.category || 'Acte'}
            </span>

            {daysBadge && (
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-md border ${
                  daysBadge.isUrgent
                    ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                    : 'bg-slate-900/90 text-white border-slate-700'
                }`}
              >
                {daysBadge.label}
              </span>
            )}
          </div>
        </div>

        {/* Title & Short description header */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            {event.title}
          </h1>
          {event.shortDescription && (
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
              {event.shortDescription}
            </p>
          )}
        </div>

        {/* ======================================================== */}
        {/* DISTRIBUCIÓ METADATA: PASS CULTURAL AMB DATA DESTACADA   */}
        {/* ======================================================== */}
        <div className="rounded-3xl bg-slate-900/95 border border-amber-500/30 overflow-hidden shadow-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-4">
            {/* Calendari tipus full destacat */}
            <div className="w-16 h-20 rounded-2xl bg-gradient-to-b from-amber-500 to-amber-600 p-0.5 text-center shadow-lg shadow-amber-500/10 shrink-0">
              <div className="bg-slate-950 rounded-[14px] h-full flex flex-col items-center justify-center py-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                  {dateParts.month || 'DATA'}
                </span>
                <span className="text-2xl font-black text-white leading-none my-0.5">
                  {dateParts.day || '--'}
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  {dateParts.weekday || ''}
                </span>
              </div>
            </div>

            {/* Informació d'horari i lloc */}
            <div className="space-y-1">
              <p className="text-base sm:text-lg font-bold text-white capitalize leading-snug">
                {formatEventDateFull(event.date)}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-300">
                <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <Clock className="w-4 h-4" />
                  <span>{event.time} h</span>
                </span>
                {event.location && (
                  <>
                    <span className="text-slate-600">•</span>
                    <span className="flex items-center gap-1.5 text-slate-200">
                      <MapPin className="w-4 h-4 text-blue-400" />
                      <span>{event.location}</span>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Preu destacat a la dreta */}
          {event.price && (
            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 sm:border-l border-slate-800 pt-3 sm:pt-0 sm:pl-6 gap-1 shrink-0">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Preu d'accés
              </span>
              <span className="text-sm sm:text-base font-black text-emerald-400 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30">
                {event.price}
              </span>
            </div>
          )}
        </div>

        {/* Capacity notice */}
        {event.capacity && (
          <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs sm:text-sm">
            <Users className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{event.capacity}</span>
          </div>
        )}

        {/* Long description */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
          <h2 className="text-xs uppercase tracking-wider font-bold text-amber-400">
            Sobre aquest acte
          </h2>
          <div className="text-sm sm:text-base text-slate-200 leading-relaxed whitespace-pre-line space-y-2">
            {event.longDescription || event.shortDescription}
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-3 pt-2">
          {/* Botó extern "Saber-ne més" només si està activat i té URL */}
          {event.showExternalButton !== false && Boolean(event.externalUrl?.trim()) && (
            <button
              onClick={handleExternalAction}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-brand-600 hover:from-amber-400 hover:to-brand-500 text-slate-950 font-extrabold text-base sm:text-lg shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] group"
            >
              <span>Saber-ne més</span>
              <ExternalLink className="w-5 h-5 text-slate-950 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          )}

          {/* Secondary actions: Calendar & Share */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleAddToCalendar}
              className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <CalendarPlus className="w-4 h-4 text-amber-400" />
              <span>Afegir al calendari</span>
            </button>

            <button
              onClick={handleShare}
              className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Copiat!' : 'Compartir acte'}</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 px-4 bg-slate-950 mt-12">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">S'Agrícola</span>
            <span>•</span>
            <span>Plaça de Sa Bassa, 4, 07500 Manacor</span>
          </div>
          <button
            onClick={onBack}
            className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Tornar</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
