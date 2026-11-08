import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon, Sparkles, Check, Link2, Calendar, Clock, MapPin, Tag } from 'lucide-react';
import { EventItem, EventFormData } from '../types';
import { CATEGORIES, IMAGE_PRESETS } from '../data/initialEvents';

interface AdminEventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EventFormData, eventId?: string) => void;
  initialEvent?: EventItem | null;
}

export const AdminEventFormModal: React.FC<AdminEventFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialEvent,
}) => {
  const isEditing = Boolean(initialEvent);

  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('20:30');
  const [imageUrl, setImageUrl] = useState('');
  const [externalUrl, setExternalUrl] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [category, setCategory] = useState('Música');
  const [location, setLocation] = useState('Terraza Principal');
  const [price, setPrice] = useState('Entrada Libre');
  const [capacity, setCapacity] = useState('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialEvent) {
      setTitle(initialEvent.title || '');
      setShortDescription(initialEvent.shortDescription || '');
      setLongDescription(initialEvent.longDescription || '');
      setDate(initialEvent.date || '');
      setTime(initialEvent.time || '20:30');
      setImageUrl(initialEvent.imageUrl || '');
      setExternalUrl(initialEvent.externalUrl || '');
      setStatus(initialEvent.status || 'active');
      setCategory(initialEvent.category || 'Música');
      setLocation(initialEvent.location || '');
      setPrice(initialEvent.price || '');
      setCapacity(initialEvent.capacity || '');
    } else {
      // Default creation state
      setTitle('');
      setShortDescription('');
      setLongDescription('');
      // Default to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDate(tomorrow.toISOString().split('T')[0]);
      setTime('20:30');
      setImageUrl(IMAGE_PRESETS[0].url);
      setExternalUrl('https://sagricola.es/reservas');
      setStatus('active');
      setCategory('Música');
      setLocation('Terraza Principal');
      setPrice('Entrada Libre');
      setCapacity('');
    }
    setErrors({});
  }, [initialEvent, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!title.trim()) errs.title = 'El título es obligatorio';
    if (!shortDescription.trim()) errs.shortDescription = 'La descripción corta es obligatoria';
    if (!longDescription.trim()) errs.longDescription = 'La descripción detallada es obligatoria';
    if (!date) errs.date = 'La fecha es obligatoria';
    if (!externalUrl.trim()) errs.externalUrl = 'La URL externa es obligatoria';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const data: EventFormData = {
      title: title.trim(),
      shortDescription: shortDescription.trim(),
      longDescription: longDescription.trim(),
      date,
      time,
      imageUrl: imageUrl.trim() || IMAGE_PRESETS[0].url,
      externalUrl: externalUrl.trim(),
      status,
      category,
      location: location.trim(),
      price: price.trim(),
      capacity: capacity.trim(),
    };

    onSave(data, initialEvent?.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="absolute inset-0 cursor-pointer" 
        onClick={onClose}
        aria-hidden="true" 
      />

      <div className="relative w-full max-w-lg max-h-[92vh] sm:max-h-[85vh] bg-slate-900 border-t sm:border border-slate-700 rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-modal flex flex-col z-10 animate-slide-up">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {isEditing ? 'Editar Evento' : 'Crear Nuevo Evento'}
              </h2>
              <p className="text-xs text-slate-400">
                {isEditing ? 'Actualiza los datos del evento' : 'Completa la información para publicarlo'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Cerrar formulario"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Scrollable */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Status Switch (Active / Inactive) */}
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-white">Visibilidad para clientes</p>
              <p className="text-xs text-slate-400">
                {status === 'active'
                  ? 'Activo: Visible inmediatamente en los móviles de los clientes'
                  : 'Oculto: Solo visible para administradores en este panel'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setStatus(status === 'active' ? 'inactive' : 'active')}
              className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                status === 'active' ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  status === 'active' ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Título del Evento *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Noche Acústica & Jam Session"
              className={`w-full px-4 py-3 rounded-xl bg-slate-800 border text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                errors.title ? 'border-rose-500' : 'border-slate-700'
              }`}
            />
            {errors.title && <p className="text-xs text-rose-400 mt-1">{errors.title}</p>}
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Descripción Corta (Vista de Tarjeta) *
            </label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Resumen atractivo de 1-2 líneas para la tarjeta"
              maxLength={140}
              className={`w-full px-4 py-3 rounded-xl bg-slate-800 border text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                errors.shortDescription ? 'border-rose-500' : 'border-slate-700'
              }`}
            />
            {errors.shortDescription && (
              <p className="text-xs text-rose-400 mt-1">{errors.shortDescription}</p>
            )}
            <p className="text-[11px] text-slate-500 text-right mt-1">{shortDescription.length}/140 caracteres</p>
          </div>

          {/* Long Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Descripción Completa (Vista de Detalle) *
            </label>
            <textarea
              value={longDescription}
              onChange={(e) => setLongDescription(e.target.value)}
              placeholder="Explica todo lo que los clientes necesitan saber: artistas, programa, sorpresas, premios..."
              rows={4}
              className={`w-full px-4 py-3 rounded-xl bg-slate-800 border text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                errors.longDescription ? 'border-rose-500' : 'border-slate-700'
              }`}
            />
            {errors.longDescription && (
              <p className="text-xs text-rose-400 mt-1">{errors.longDescription}</p>
            )}
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-brand-400" />
                Fecha *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`w-full px-3.5 py-3 rounded-xl bg-slate-800 border text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                  errors.date ? 'border-rose-500' : 'border-slate-700'
                }`}
              />
              {errors.date && <p className="text-xs text-rose-400 mt-1">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-brand-400" />
                Hora
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Category & Location */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-brand-400" />
                Categoría
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {CATEGORIES.filter((c) => c !== 'Todos').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-brand-400" />
                Ubicación
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ej. Terraza, Barra central"
                className="w-full px-3.5 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Price & Capacity */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Precio / Entrada
              </label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Ej. Gratis, 12€"
                className="w-full px-3.5 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Aforo / Plazas
              </label>
              <input
                type="text"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="Ej. Plazas limitadas"
                className="w-full px-3.5 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* External URL */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1">
              <Link2 className="w-3.5 h-3.5 text-brand-400" />
              URL Externa (Botón "Saber más / Apuntarse") *
            </label>
            <input
              type="text"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              placeholder="https://tupagina.com/entradas"
              className={`w-full px-4 py-3 rounded-xl bg-slate-800 border text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                errors.externalUrl ? 'border-rose-500' : 'border-slate-700'
              }`}
            />
            {errors.externalUrl && (
              <p className="text-xs text-rose-400 mt-1">{errors.externalUrl}</p>
            )}
          </div>

          {/* Image URL & Preset Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-brand-400" />
                Imagen de Portada (Placeholder)
              </span>
            </label>

            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />

            {/* Quick preset selector */}
            <div>
              <p className="text-[11px] text-slate-400 mb-1.5 font-medium">O elige una imagen predeterminada:</p>
              <div className="grid grid-cols-3 gap-2">
                {IMAGE_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImageUrl(preset.url)}
                    className={`relative rounded-xl overflow-hidden border aspect-[16/10] text-left transition-all ${
                      imageUrl === preset.url
                        ? 'border-brand-500 ring-2 ring-brand-500/50'
                        : 'border-slate-700 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                    <span className="absolute inset-0 bg-black/40 flex items-center justify-center p-1 text-[10px] text-white font-semibold text-center leading-tight">
                      {preset.label.split('/')[0]}
                    </span>
                    {imageUrl === preset.url && (
                      <span className="absolute top-1 right-1 p-0.5 rounded-full bg-brand-500 text-white">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </form>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-950/80 border-t border-slate-800 flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-amber-500 hover:from-brand-500 hover:to-amber-400 text-white font-bold text-sm shadow-lg shadow-brand-500/20 transition-all active:scale-98"
          >
            {isEditing ? 'Guardar Cambios' : 'Publicar Evento'}
          </button>
        </div>
      </div>
    </div>
  );
};
