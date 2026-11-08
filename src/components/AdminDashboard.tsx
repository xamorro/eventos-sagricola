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
  AlertTriangle,
  QrCode
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
  onOpenQr: () => void;
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
  onOpenQr,
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const activeCount = events.filter((e) => e.status === 'active').length;
  const inactiveCount = events.filter((e) => e.status === 'inactive').length;

  const filteredEvents = events
    .filter((evt) => {
      const matchesFilter =
        filter === 'all' ? true : evt.status === filter;
      const matchesSearch =
        evt.title.toLowerCase().includes(search.toLowerCase()) ||
        evt.shortDescription.toLowerCase().includes(search.toLowerCase()) ||
        evt.category.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      const dateTimeA = new Date(`${a.date}T${a.time || '00:00'}`).getTime();
      const dateTimeB = new Date(`${b.date}T${b.time || '00:00'}`).getTime();
      return dateTimeA - dateTimeB;
    });

  const confirmDelete = (id: string) => {
    onDeleteEvent(id);
    setDeletingId(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* Admin Top Sticky Bar */}
      <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-amber-500/20 shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <button
            onClick={onBackToClientView}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>Vista pública</span>
          </button>

          <div className="flex items-center gap-2.5">
            <div className="bg-white rounded-lg p-1 shadow-sm shrink-0">
              <img src="./logo.png" alt="Logo" className="h-6 w-auto object-contain" />
            </div>
            <h1 className="text-xs sm:text-sm font-extrabold tracking-wide uppercase text-amber-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Tauler de Gestió
            </h1>
          </div>

          <button
            onClick={onLogout}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700/60 transition-all"
            title="Tancar sessió"
            aria-label="Tancar sessió"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Quick KPI stats row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm text-center">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Actes</p>
            <p className="text-2xl font-black text-white mt-1">{events.length}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/30 shadow-sm text-center">
            <p className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Actius (Públics)</p>
            <p className="text-2xl font-black text-emerald-300 mt-1">{activeCount}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm text-center">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Ocults</p>
            <p className="text-2xl font-black text-slate-400 mt-1">{inactiveCount}</p>
          </div>
        </div>

        {/* Primary CTAs */}
        <div className="flex gap-3">
          <button
            onClick={onCreateNew}
            className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-brand-600 hover:from-amber-400 hover:to-brand-500 text-slate-950 font-extrabold text-base shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2.5 transition-all active:scale-[0.98]"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span>Crear Nou Esdeveniment</span>
          </button>

          <button
            onClick={onOpenQr}
            className="py-4 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 border border-slate-700 shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            title="Veure i descarregar Codi QR del web"
          >
            <QrCode className="w-5 h-5" />
            <span className="text-xs font-bold hidden sm:inline">QR del Web</span>
          </button>
        </div>

        {/* Search bar & filter tabs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cercar a la llista d'actes..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs font-semibold sm:w-80">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 py-2 rounded-lg transition-all ${
                filter === 'all'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tots ({events.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`flex-1 py-2 rounded-lg transition-all ${
                filter === 'active'
                  ? 'bg-emerald-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Actius ({activeCount})
            </button>
            <button
              onClick={() => setFilter('inactive')}
              className={`flex-1 py-2 rounded-lg transition-all ${
                filter === 'inactive'
                  ? 'bg-slate-700 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Ocults ({inactiveCount})
            </button>
          </div>
        </div>

        {/* Events management responsive list/grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEvents.length === 0 ? (
            <div className="col-span-full text-center py-12 px-4 rounded-3xl bg-slate-900/60 border border-slate-800/80">
              <p className="text-sm font-semibold text-slate-300">No s'han trobat esdeveniments</p>
              <p className="text-xs text-slate-500 mt-1">
                Ajustau la cerca o creau un nou acte amb el botó superior.
              </p>
            </div>
          ) : (
            filteredEvents.map((event) => {
              const isActive = event.status === 'active';

              return (
                <div
                  key={event.id}
                  className={`p-4 rounded-2xl border transition-all duration-200 bg-slate-900/90 shadow-md flex flex-col justify-between ${
                    isActive
                      ? 'border-slate-800 hover:border-slate-700'
                      : 'border-slate-800/80 opacity-75'
                  }`}
                >
                  <div>
                    <div className="flex gap-3">
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

                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm text-white leading-snug truncate">
                          {event.title}
                        </h3>

                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                          <span className="flex items-center gap-1 text-slate-300">
                            <Calendar className="w-3 h-3 text-amber-400" />
                            {formatEventDate(event.date)}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-slate-400">
                            <Clock className="w-3 h-3" />
                            {event.time} h
                          </span>
                        </div>

                        <p className="text-xs text-slate-400 line-clamp-1 mt-1">
                          {event.shortDescription}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Status Toggle */}
                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onToggleStatus(event.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all active:scale-95 ${
                        isActive
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                      title={isActive ? 'Fer clic per ocultar del públic' : 'Fer clic per fer-lo públic'}
                    >
                      {isActive ? (
                        <>
                          <Eye className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Actiu</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                          <span>Ocult</span>
                        </>
                      )}

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

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onPreviewEvent(event)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Previsualitzar acte"
                        aria-label="Previsualitzar acte"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onEditEvent(event)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 transition-colors"
                        title="Modificar acte"
                        aria-label="Modificar acte"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setDeletingId(event.id)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                        title="Eliminar acte"
                        aria-label="Eliminar acte"
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

        {/* Demo reset footer */}
        <div className="pt-6 border-t border-slate-800/80 text-center space-y-2">
          <button
            onClick={onResetEvents}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 font-medium px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablir actes inicials de prova</span>
          </button>
          <p className="text-[11px] text-slate-500">
            S'Agrícola • Fundada a 1899 • Tauler de Gestió
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
              <h3 className="text-lg font-bold text-white">Voleu eliminar aquest acte?</h3>
              <p className="text-xs text-slate-400 mt-1">
                Aquesta acció no es pot desfer. L'acte s'eliminarà de la llista pública i del tauler.
              </p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel·lar
              </button>
              <button
                onClick={() => confirmDelete(deletingId)}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30"
              >
                Sí, elimina'l
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
