import React, { useState } from 'react';
import { Sparkles, Search, Lock, PartyPopper, CalendarCheck } from 'lucide-react';
import { EventItem } from '../types';
import { EventCard } from './EventCard';
import { CATEGORIES } from '../data/initialEvents';

interface ClientViewProps {
  events: EventItem[];
  onSelectEvent: (event: EventItem) => void;
  onOpenAdminAuth: () => void;
  onOpenQr: () => void;
}

export const ClientView: React.FC<ClientViewProps> = ({
  events,
  onSelectEvent,
  onOpenAdminAuth,
  onOpenQr,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  // ONLY show events with status === 'active' for clients
  const activeEvents = events.filter((evt) => evt.status === 'active');

  const filteredEvents = activeEvents.filter((evt) => {
    const matchesCategory =
      selectedCategory === 'Todos' ? true : evt.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === ''
        ? true
        : evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          evt.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (evt.location && evt.location.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between">
      <main className="max-w-md mx-auto w-full px-4 pt-4 pb-12 space-y-5">
        {/* Welcome hero greeting for table guests */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900/60 via-slate-900 to-amber-950/40 p-5 border border-brand-500/20 shadow-lg">
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>Agenda del Local</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight leading-tight">
              Próximos Eventos & Actividades
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Toca cualquier evento para ver detalles completos, horarios y reservar tu plaza o entrada.
            </p>
          </div>

          <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-brand-500/10 blur-2xl pointer-events-none" />
        </section>

        {/* Filter & Search Controls */}
        <div className="space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por artista, música, cata..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Horizontal scrollable category pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-semibold">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all duration-200 active:scale-95 ${
                    isSelected
                      ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25 border border-brand-400/40'
                      : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 border border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Vertical Feed with Event Cards */}
        <div className="space-y-4">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12 px-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
                <PartyPopper className="w-6 h-6 text-brand-400" />
              </div>
              <h3 className="text-base font-bold text-white">No hay eventos activos aquí</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                {searchQuery
                  ? 'Prueba con otro término de búsqueda o cambia de categoría.'
                  : 'Próximamente publicaremos nuevos eventos para esta sección.'}
              </p>
              {(searchQuery || selectedCategory !== 'Todos') && (
                <button
                  onClick={() => {
                    setSelectedCategory('Todos');
                    setSearchQuery('');
                  }}
                  className="mt-2 px-4 py-2 rounded-xl bg-brand-500/20 text-brand-300 text-xs font-semibold hover:bg-brand-500/30 transition-colors"
                >
                  Mostrar todos los eventos
                </button>
              )}
            </div>
          ) : (
            filteredEvents.map((event, idx) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={onSelectEvent}
                index={idx}
              />
            ))
          )}
        </div>

        {/* Table info banner */}
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 text-center space-y-1">
          <p className="text-xs font-semibold text-slate-300 flex items-center justify-center gap-1.5">
            <CalendarCheck className="w-3.5 h-3.5 text-brand-400" />
            ¿Quieres organizar un evento privado?
          </p>
          <p className="text-[11px] text-slate-400">
            Pregunta a nuestro personal en barra o escríbenos a eventos@sagricola.es
          </p>
        </div>
      </main>

      {/* Discreet Footer with Admin Access */}
      <footer className="mt-auto border-t border-slate-800/80 py-6 px-4 bg-slate-950">
        <div className="max-w-md mx-auto flex flex-col items-center justify-center gap-3 text-center">
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <button
              onClick={onOpenQr}
              className="hover:text-brand-400 transition-colors"
            >
              Ver QR de Mesa
            </button>
            <span>•</span>
            <span className="text-slate-400">S'Agrícola Social</span>
            <span>•</span>
            <span className="text-slate-400">Mesa #4</span>
          </div>

          {/* Discreet admin access button in footer as requested */}
          <button
            onClick={onOpenAdminAuth}
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium text-slate-400 hover:text-slate-300 hover:bg-slate-900/80 transition-all border border-transparent hover:border-slate-800"
            title="Acceso exclusivo para el personal del local"
          >
            <Lock className="w-3 h-3 text-slate-400 group-hover:text-brand-400 transition-colors" />
            <span>Acceso Administración (PIN)</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
