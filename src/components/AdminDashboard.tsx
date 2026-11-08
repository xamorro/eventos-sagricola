import React, { useState } from 'react';
import { 
  Plus, 
  ArrowLeft, 
  LogOut, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Calendar, 
  Clock, 
  RotateCcw, 
  Search,
  ExternalLink,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { EventItem } from '../types';
import { formatEventDate } from '../utils/date';

interface AdminDashboardProps {
  events: EventItem[];
  onToggleStatus: (id: string) => void;
  onEditEvent: (event: EventItem) => void;
  onDeleteEvent: (id: string) => void;
  onCreateNew: () => void;
  onBackToClientView: () => void;
  onLogout: () => void;
  onResetEvents: () => void;
  onPreviewEvent: (event: EventItem) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  events,
  onToggleStatus,
  onEditEvent,
  onDeleteEvent,
  onCreateNew,
  onBackToClientView,
  onLogout,
  onResetEvents,
  onPreviewEvent,
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const activeCount = events.filter((e) => e.status === 'active').length;
  const inactiveCount = events.filter((e) => e.status === 'inactive').length;

  const filteredEvents = events.filter((evt) => {
    const matchesFilter =
      filter === 'all' ? true : evt.status === filter;
    const matchesSearch =
      evt.title.toLowerCase().includes(search.toLowerCase()) ||
      evt.shortDescription.toLowerCase().includes(search.toLowerCase()) ||
      evt.category.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const confirmDelete = (id: string) => {
    onDeleteEvent(id);
    setDeletingId(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* Admin Top Sticky Bar */}
      <header className="sticky top-0 z-30 glass-nav border-b border-brand-500/20 bg-slate-900/90 backdrop-blur-md">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={onBackToClientView}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-brand-400" />
            <span>Vista Cliente</span>
          </button>

          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <h1 className="text-xs sm:text-sm font-extrabold tracking-wide uppercase text-brand-400 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" />
              Panel de Control
            </h1>
          </div>

          <button
            onClick={onLogout}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700/60 transition-all"
            title="Cerrar sesión de administrador"
            aria-label="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-5 space-y-5">
        {/* Quick KPI stats row */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm text-center">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total</p>
            <p className="text-xl font-black text-white mt-0.5">{events.length}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-emerald-500/20 shadow-sm text-center">
            <p className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Activos</p>
            <p className="text-xl font-black text-emerald-300 mt-0.5">{activeCount}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm text-center">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Ocultos</p>
            <p className="text-xl font-black text-slate-400 mt-0.5">{inactiveCount}</p>
          </div>
        </div>

        {/* Primary CTA: Big 'Crear nuevo evento' touch-friendly button */}
        <button
          onClick={onCreateNew}
          className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-brand-600 via-brand-500 to-amber-500 hover:from-brand-500 hover:to-amber-400 text-white font-extrabold text-base shadow-xl shadow-brand-500/20 flex items-center justify-center gap-2.5 transition-all active:scale-[0.98]"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>Crear Nuevo Evento</span>
        </button>

        {/* Search bar & filter pills */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar en gestión..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>

          <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 py-2 rounded-lg transition-all ${
                filter === 'all'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Todos ({events.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`flex-1 py-2 rounded-lg transition-all ${
                filter === 'active'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Activos ({activeCount})
            </button>
            <button
              onClick={() => setFilter('inactive')}
              className={`flex-1 py-2 rounded-lg transition-all ${
                filter === 'inactive'
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Ocultos ({inactiveCount})
            </button>
          </div>
        </div>

        {/* Events management vertical list */}
        <div className="space-y-3.5">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-3xl bg-slate-900/60 border border-slate-800/80">
              <p className="text-sm font-semibold text-slate-300">No se encontraron eventos</p>
              <p className="text-xs text-slate-500 mt-1">
                Ajusta tu búsqueda o crea un nuevo evento para empezar
              </p>
            </div>
          ) : (
            filteredEvents.map((event) => {
              const isActive = event.status === 'active';

              return (
                <div
                  key={event.id}
                  className={`p-4 rounded-2xl border transition-all duration-200 bg-slate-900/90 shadow-md ${
                    isActive
                      ? 'border-slate-700/80 hover:border-slate-600'
                      : 'border-slate-800/90 opacity-80'
                  }`}
                >
                  <div className="flex gap-3">
                    {/* Event image thumbnail */}
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-black/70 text-white">
                        {event.category}
                      </span>
                    </div>

                    {/* Basic details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-sm text-white leading-snug truncate">
                          {event.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                        <span className="flex items-center gap-1 text-slate-300">
                          <Calendar className="w-3 h-3 text-brand-400" />
                          {formatEventDate(event.date)}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <Clock className="w-3 h-3" />
                          {event.time}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-1 mt-1">
                        {event.shortDescription}
                      </p>
                    </div>
                  </div>

                  {/* Management actions & Toggle row */}
                  <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    {/* Status Toggle Button (Activo vs Oculto) */}
                    <button
                      onClick={() => onToggleStatus(event.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all active:scale-95 ${
                        isActive
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                      title={isActive ? 'Click para ocultar del feed público' : 'Click para hacer público'}
                    >
                      {isActive ? (
                        <>
                          <Eye className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Activo (Público)</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                          <span>Oculto</span>
                        </>
                      )}

                      {/* Visual Switch Indicator */}
                      <span
                        className={`w-7 h-4 rounded-full flex items-center p-0.5 transition-colors ${
                          isActive ? 'bg-emerald-500' : 'bg-slate-700'
                        }`}
                      >
                        <span
                          className={`w-3 h-3 rounded-full bg-white transition-transform ${
                            isActive ? 'translate-x-3' : 'translate-x-0'
                          }`}
                        />
                      </span>
                    </button>

                    {/* Action buttons (Preview, Edit, Delete) */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onPreviewEvent(event)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Ver como cliente"
                        aria-label="Previsualizar evento"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onEditEvent(event)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-brand-400 hover:text-brand-300 transition-colors"
                        title="Editar evento"
                        aria-label="Editar evento"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setDeletingId(event.id)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                        title="Eliminar evento"
                        aria-label="Eliminar evento"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Demo reset & utilities footer */}
        <div className="pt-6 border-t border-slate-800/80 text-center space-y-2">
          <button
            onClick={onResetEvents}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 font-medium px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar datos de prueba iniciales</span>
          </button>
          <p className="text-[11px] text-slate-500">
            S'Agrícola Bar & Social Club • Panel de Control v1.0
          </p>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-center space-y-4 animate-slide-up">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">¿Eliminar evento?</h3>
              <p className="text-xs text-slate-400 mt-1">
                Esta acción no se puede deshacer. El evento desaparecerá de la lista pública y del panel.
              </p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={() => confirmDelete(deletingId)}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
