import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  UploadCloud, 
  Sparkles, 
  Link2, 
  Calendar, 
  Clock, 
  MapPin, 
  Tag, 
  Trash2, 
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { EventItem, EventFormData } from '../types';
import { CATEGORIES } from '../data/initialEvents';
import { processAndResizeImage } from '../utils/image';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('20:30');
  const [imageUrl, setImageUrl] = useState('');
  const [showExternalButton, setShowExternalButton] = useState(false);
  const [externalUrl, setExternalUrl] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [category, setCategory] = useState('Música');
  const [location, setLocation] = useState('Sala d\'Actes');
  const [price, setPrice] = useState('Entrada lliure');
  const [capacity, setCapacity] = useState('');

  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const defaultPlaceholder = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80';

  useEffect(() => {
    if (initialEvent) {
      setTitle(initialEvent.title || '');
      setShortDescription(initialEvent.shortDescription || '');
      setLongDescription(initialEvent.longDescription || '');
      setDate(initialEvent.date || '');
      setTime(initialEvent.time || '20:30');
      setImageUrl(initialEvent.imageUrl || '');
      setShowExternalButton(initialEvent.showExternalButton ?? Boolean(initialEvent.externalUrl));
      setExternalUrl(initialEvent.externalUrl || '');
      setStatus(initialEvent.status || 'active');
      setCategory(initialEvent.category || 'Música');
      setLocation(initialEvent.location || '');
      setPrice(initialEvent.price || '');
      setCapacity(initialEvent.capacity || '');
    } else {
      setTitle('');
      setShortDescription('');
      setLongDescription('');
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDate(tomorrow.toISOString().split('T')[0]);
      setTime('20:30');
      setImageUrl('');
      setShowExternalButton(false);
      setExternalUrl('');
      setStatus('active');
      setCategory('Música');
      setLocation('Sala d\'Actes');
      setPrice('Entrada lliure');
      setCapacity('');
    }
    setErrors({});
  }, [initialEvent, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessingImage(true);
      const optimizedBase64 = await processAndResizeImage(file);
      setImageUrl(optimizedBase64);
      setErrors((prev) => ({ ...prev, image: '' }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error en processar la imatge';
      setErrors((prev) => ({ ...prev, image: msg }));
    } finally {
      setIsProcessingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    setImageUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!title.trim()) errs.title = 'El títol és obligatori';
    if (!shortDescription.trim()) errs.shortDescription = 'La descripció curta és obligatòria';
    if (!longDescription.trim()) errs.longDescription = 'La descripció detallada és obligatòria';
    if (!date) errs.date = 'La data és obligatòria';
    if (showExternalButton && !externalUrl.trim()) {
      errs.externalUrl = 'Introduïu l\'enllaç extern o desactivau el botó';
    }
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
      imageUrl: imageUrl.trim() || defaultPlaceholder,
      showExternalButton,
      externalUrl: showExternalButton ? externalUrl.trim() : '',
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
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {isEditing ? 'Modificar Esdeveniment' : 'Crear Nou Esdeveniment'}
              </h2>
              <p className="text-xs text-slate-400">
                {isEditing ? 'Actualitzau la informació de l\'acte' : 'Ompliu les dades per a publicar-lo'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Tancar formulari"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Scrollable */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Status Switch */}
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-white">Visibilitat pública</p>
              <p className="text-xs text-slate-400">
                {status === 'active'
                  ? 'Actiu: Visible per a tothom a la web'
                  : 'Ocult: Només visible per als administradors'}
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
              Títol de l'esdeveniment *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex. Concert Acústic de Primavera"
              className={`w-full px-4 py-3 rounded-xl bg-slate-800 border text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                errors.title ? 'border-rose-500' : 'border-slate-700'
              }`}
            />
            {errors.title && <p className="text-xs text-rose-400 mt-1">{errors.title}</p>}
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Descripció curta (Vista de Targeta) *
            </label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Resum breu d'1 o 2 línies per a la targeta"
              maxLength={140}
              className={`w-full px-4 py-3 rounded-xl bg-slate-800 border text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                errors.shortDescription ? 'border-rose-500' : 'border-slate-700'
              }`}
            />
            {errors.shortDescription && (
              <p className="text-xs text-rose-400 mt-1">{errors.shortDescription}</p>
            )}
            <p className="text-[11px] text-slate-500 text-right mt-1">{shortDescription.length}/140 caràcters</p>
          </div>

          {/* Long Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Descripció detallada (Pàgina de l'acte) *
            </label>
            <textarea
              value={longDescription}
              onChange={(e) => setLongDescription(e.target.value)}
              placeholder="Explicau tots els detalls: artistes, horaris, programa de l'acte, etc."
              rows={4}
              className={`w-full px-4 py-3 rounded-xl bg-slate-800 border text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 ${
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
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                Data *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`w-full px-3.5 py-3 rounded-xl bg-slate-800 border text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  errors.date ? 'border-rose-500' : 'border-slate-700'
                }`}
              />
              {errors.date && <p className="text-xs text-rose-400 mt-1">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Hora
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Category & Location */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {CATEGORIES.filter((c) => c !== 'Tots').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                Lloc / Sala
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ex. Sala d'Actes, Pati"
                className="w-full px-3.5 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Price & Capacity */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Preu / Entrada
              </label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Ex. De franc, 10€"
                className="w-full px-3.5 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Aforament / Places
              </label>
              <input
                type="text"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="Ex. Places limitades"
                className="w-full px-3.5 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Botó extern opcional "Saber-ne més" */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Botó «Saber-ne més»
                </p>
                <p className="text-[11px] text-slate-400">
                  {showExternalButton
                    ? 'Activat: es mostrarà el botó a la pàgina de l\'acte'
                    : 'Desactivat: no es mostrarà cap botó extern'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowExternalButton(!showExternalButton)}
                className={`relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  showExternalButton ? 'bg-amber-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow ring-0 transition duration-200 ease-in-out ${
                    showExternalButton ? 'translate-x-6 bg-white' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {showExternalButton && (
              <div className="pt-2 border-t border-slate-700/60 animate-fade-in">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1">
                  <Link2 className="w-3.5 h-3.5 text-amber-400" />
                  Enllaç extern per al botó "Saber-ne més" *
                </label>
                <input
                  type="text"
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  placeholder="https://sagricola.es/entrades-o-info"
                  className={`w-full px-4 py-2.5 rounded-xl bg-slate-900 border text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    errors.externalUrl ? 'border-rose-500' : 'border-slate-700'
                  }`}
                />
                {errors.externalUrl && (
                  <p className="text-xs text-rose-400 mt-1">{errors.externalUrl}</p>
                )}
              </div>
            )}
          </div>

          {/* Imatge de Portada: PUJADA DE FITXER DIRECTA */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Imatge de portada
            </label>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {imageUrl ? (
              /* Image preview with replace and remove actions */
              <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 aspect-[16/9] group">
                <img
                  src={imageUrl}
                  alt="Vista prèvia de la portada"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-2 rounded-xl bg-slate-900/90 text-white text-xs font-semibold border border-white/20 hover:bg-slate-800 transition-colors shadow-lg"
                  >
                    Canviar imatge
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="p-2 rounded-xl bg-rose-600/90 text-white hover:bg-rose-500 transition-colors shadow-lg"
                    title="Eliminar imatge"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <span className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-black/70 text-emerald-400 text-[10px] font-bold flex items-center gap-1 backdrop-blur-sm">
                  <CheckCircle2 className="w-3 h-3" />
                  Imatge carregada
                </span>
              </div>
            ) : (
              /* Upload dropzone button */
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessingImage}
                className="w-full py-8 px-4 rounded-2xl border-2 border-dashed border-slate-700 hover:border-amber-500/60 bg-slate-800/40 hover:bg-slate-800/70 text-slate-300 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group"
              >
                {isProcessingImage ? (
                  <>
                    <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                    <span className="text-xs font-semibold text-slate-200">
                      Processant i optimitzant imatge...
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-white">
                        Feu clic per pujar una imatge des del vostre dispositiu
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Admet fotografies de càmera o galeria (JPG, PNG, WebP)
                      </p>
                    </div>
                  </>
                )}
              </button>
            )}

            {errors.image && (
              <p className="text-xs text-rose-400 mt-1">{errors.image}</p>
            )}
          </div>
        </form>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-950/80 border-t border-slate-800 flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-colors"
          >
            Cancel·lar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all active:scale-98"
          >
            {isEditing ? 'Desar Canvis' : 'Publicar Esdeveniment'}
          </button>
        </div>
      </div>
    </div>
  );
};
