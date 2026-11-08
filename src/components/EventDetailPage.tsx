import React, { useEffect, useState } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  ExternalLink, 
  Share2, 
  Ticket, 
  Users, 
  Sparkles, 
  CalendarPlus, 
  Check,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { EventItem } from '../types';
import { formatEventDateFull, getDaysRemainingBadge, getEventDateParts } from '../utils/date';

interface EventDetailPageProps {
  event: EventItem;
  onBack: () => void;
  onShowToast: (text: string, type: 'success' | 'info' | 'error') => void;
}

export type LayoutBoceto = 'dual-cards' | 'ticket-pass' | 'editorial-list';

export const EventDetailPage: React.FC<EventDetailPageProps> = ({
  event,
  onBack,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);
  const [boceto, setBoceto] = useState<LayoutBoceto>('ticket-pass');
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

      {/* Selector de Bocetos per triar */}
      <div className="bg-slate-900/90 border-b border-amber-500/20 py-2.5 px-4 sticky top-14 z-20 backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold">
            <Layers className="w-4 h-4" />
            <span>Tria el disseny que més t'agradi:</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold w-full sm:w-auto">
            <button
              onClick={() => setBoceto('ticket-pass')}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition-all ${
                boceto === 'ticket-pass'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Bocet 1: Pass Cultural
            </button>
            <button
              onClick={() => setBoceto('dual-cards')}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition-all ${
                boceto === 'dual-cards'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Bocet 2: Targeta Dual
            </button>
            <button
              onClick={() => setBoceto('editorial-list')}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition-all ${
                boceto === 'editorial-list'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Bocet 3: Llista Neta
            </button>
          </div>
        </div>
      </div>

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
        {/* DISTRIBUCIÓ METADATA: 3 BOCETOS DISPONIBLES               */}
        {/* ======================================================== */}

        {/* BOCETO 1: PASS CULTURAL / ENTRADA AMB DATA DESTACADA */}
        {boceto === 'ticket-pass' && (
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
        )}

        {/* BOCETO 2: TARGETA DUAL (QUAN ÉS? + ON ÉS?) */}
        {boceto === 'dual-cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 animate-fade-in">
            {/* Bloc Quan és */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3.5 shadow-md">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Dia i Hora</p>
                <p className="text-sm sm:text-base font-bold text-white capitalize truncate">
                  {formatEventDateFull(event.date)}
                </p>
                <p className="text-xs sm:text-sm font-semibold text-amber-400 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>A les {event.time} h</span>
                </p>
              </div>
            </div>

            {/* Bloc On és i Preu */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Ubicació</p>
                  <p className="text-sm sm:text-base font-bold text-white truncate">
                    {event.location || "S'Agrícola"}
                  </p>
                  <p className="text-xs text-slate-400">S'Agrícola • Manacor</p>
                </div>
              </div>

              {event.price && (
                <div className="px-3.5 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-bold shrink-0">
                  {event.price}
                </div>
              )}
            </div>
          </div>
        )}

        {/* BOCETO 3: LLISTA NETA EDITORIAL MINIMALISTA */}
        {boceto === 'editorial-list' && (
          <div className="rounded-3xl bg-slate-900/80 border border-slate-800 divide-y divide-slate-800/80 shadow-md animate-fade-in overflow-hidden">
            <div className="p-4 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Dia i Hora</p>
                <p className="text-sm sm:text-base font-bold text-white capitalize">
                  {formatEventDateFull(event.date)} <span className="text-amber-400 ml-1 font-semibold">a les {event.time} h</span>
                </p>
              </div>
            </div>

            {event.location && (
              <div className="p-4 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Lloc de trobada</p>
                  <p className="text-sm sm:text-base font-bold text-white">
                    {event.location} <span className="text-slate-400 text-xs font-normal">• S'Agrícola</span>
                  </p>
                </div>
              </div>
            )}

            {event.price && (
              <div className="p-4 flex items-center justify-between gap-3.5">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                    <Ticket className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Preu d'accés</p>
                    <p className="text-sm sm:text-base font-bold text-emerald-400">
                      {event.price}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-slate-400">Accés públic</span>
              </div>
            )}
          </div>
        )}

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
