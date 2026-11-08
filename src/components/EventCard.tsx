import React, { useState } from 'react';
import { Calendar, Clock, MapPin, ChevronRight, Tag } from 'lucide-react';
import { EventItem } from '../types';
import { formatEventDate, getDaysRemainingBadge } from '../utils/date';

interface EventCardProps {
  event: EventItem;
  onClick: (event: EventItem) => void;
  index: number;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onClick, index }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const daysBadge = getDaysRemainingBadge(event.date);

  const fallbackImage = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80';

  return (
    <article
      onClick={() => onClick(event)}
      style={{ animationDelay: `${index * 60}ms` }}
      className="group relative bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 hover:border-brand-500/50 rounded-3xl overflow-hidden shadow-lg shadow-black/30 transition-all duration-300 hover:shadow-brand-500/10 active:scale-[0.985] cursor-pointer flex flex-col animate-slide-up"
    >
      {/* Image container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-slate-800 animate-pulse flex items-center justify-center text-slate-600">
            <span className="text-xs font-medium">Cargando imagen...</span>
          </div>
        )}
        <img
          src={imageError ? fallbackImage : (event.imageUrl || fallbackImage)}
          alt={event.title}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(true);
          }}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Ambient Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-black/20" />

        {/* Floating Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-900/85 backdrop-blur-md text-amber-300 border border-white/10 shadow-sm">
            <Tag className="w-3 h-3 text-brand-400" />
            {event.category || 'Evento'}
          </span>

          {daysBadge && (
            <span
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm border ${
                daysBadge.isUrgent
                  ? 'bg-rose-500/90 text-white border-rose-400/50 animate-pulse'
                  : 'bg-brand-500/90 text-white border-brand-400/50'
              }`}
            >
              {daysBadge.label}
            </span>
          )}
        </div>

        {/* Floating Date pill in bottom right of image */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-white shadow-md">
          <Calendar className="w-3.5 h-3.5 text-brand-400" />
          <span className="text-xs font-bold tracking-tight">
            {formatEventDate(event.date)}
          </span>
          <span className="text-slate-500">•</span>
          <Clock className="w-3 h-3 text-slate-400" />
          <span className="text-xs font-medium text-slate-200">{event.time}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
        <div>
          {/* Title */}
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug group-hover:text-brand-300 transition-colors">
            {event.title}
          </h2>

          {/* Short description */}
          <p className="mt-2 text-sm text-slate-300 line-clamp-2 leading-relaxed">
            {event.shortDescription}
          </p>
        </div>

        {/* Footer info & CTA */}
        <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-slate-400 truncate">
            {event.location && (
              <span className="flex items-center gap-1 truncate">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{event.location}</span>
              </span>
            )}
            {event.price && (
              <>
                <span className="text-slate-600">•</span>
                <span className="font-semibold text-emerald-400">{event.price}</span>
              </>
            )}
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-1 text-xs font-bold text-brand-400 group-hover:text-brand-300 transition-colors shrink-0 bg-brand-500/10 hover:bg-brand-500/20 px-3 py-1.5 rounded-xl border border-brand-500/20"
          >
            Ver más
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </article>
  );
};
