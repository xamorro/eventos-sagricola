import React, { useState } from 'react';
import { Lock, PartyPopper, Search, Sparkles } from 'lucide-react';
import { EventItem } from '../types';
import { EventCard } from './EventCard';

interface ClientViewProps {
  events: EventItem[];
  onSelectEvent: (event: EventItem) => void;
  onOpenAdminAuth: () => void;
}

export const ClientView: React.FC<ClientViewProps> = ({
  events,
  onSelectEvent,
  onOpenAdminAuth,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // ONLY show events with status === 'active' for clients,
  // Ordenats per data: els més propers surten primer
  const activeEvents = events
    .filter((evt) => evt.status === 'active')
    .sort((a, b) => {
      const dateTimeA = new Date(`${a.date}T${a.time || '00:00'}`).getTime();
      const dateTimeB = new Date(`${b.date}T${b.time || '00:00'}`).getTime();
      return dateTimeA - dateTimeB;
    });

  const filteredEvents = activeEvents.filter((evt) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      evt.title.toLowerCase().includes(q) ||
      evt.shortDescription.toLowerCase().includes(q) ||
      (evt.location && evt.location.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between">
      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 pt-5 pb-14 space-y-6">
        {/* Simple & elegant title: Agenda activa */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-6 rounded-full bg-amber-500" />
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Agenda activa
              </h2>
              <p className="text-xs text-slate-400">
                Pròxims actes i esdeveniments culturals
              </p>
            </div>
          </div>

          {/* Quick search input */}
          {activeEvents.length > 3 && (
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cercar esdeveniment..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  Netejar
                </button>
              )}
            </div>
          )}
        </div>

        {/* Responsive Grid: 1 column on mobile, 2 columns on tablet and desktop */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16 px-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
              <PartyPopper className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-base font-bold text-white">
              No hi ha cap acte actiu en aquests moments
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              {searchQuery
                ? 'No s\'ha trobat cap acte amb aquesta cerca.'
                : 'Molt prest publicarem les noves activitats i actes culturals.'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-semibold hover:bg-amber-500/30 transition-colors"
              >
                Veure tots els actes
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredEvents.map((event, idx) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={onSelectEvent}
                index={idx}
              />
            ))}
          </div>
        )}

        {/* Bottom invitation */}
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex items-center justify-center text-center">
          <p className="text-xs text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              Per a consultes o col·laboracions culturals: <strong className="text-slate-300 font-semibold">eventos@sagricola.es</strong>
            </span>
          </p>
        </div>
      </main>

      {/* Discreet Footer with Admin Access */}
      <footer className="mt-auto border-t border-slate-800/80 py-6 px-4 bg-slate-950">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-400">S'Agrícola</span>
            <span>•</span>
            <span>Plaça de Sa Bassa, 4, 07500 Manacor</span>
          </div>

          {/* Discreet admin access button in footer */}
          <button
            onClick={onOpenAdminAuth}
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium text-slate-500 hover:text-slate-300 hover:bg-slate-900 transition-all border border-transparent hover:border-slate-800"
            title="Accés d'Administració"
          >
            <Lock className="w-3 h-3 text-slate-500 group-hover:text-amber-400 transition-colors" />
            <span>Accés Administració (PIN)</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
