import React from 'react';

interface HeaderProps {
  activeCount: number;
}

export const Header: React.FC<HeaderProps> = ({ activeCount }) => {
  return (
    <header className="sticky top-0 z-30 glass-nav border-b border-slate-800">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand identity with official emblem */}
        <div className="flex items-center gap-3">
          <div className="h-12 w-10 flex items-center justify-center shrink-0">
            <img
              src="./logo.png"
              alt="S'Agrícola - Fundada a 1899"
              className="h-full w-auto object-contain drop-shadow"
            />
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-tight text-white leading-tight">
              S'Agrícola
            </h1>
            <p className="text-[11px] text-amber-400 font-semibold tracking-wide">
              Fundada a 1899
            </p>
          </div>
        </div>

        {/* Active events pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/90 border border-slate-700/60 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-slate-200">
            {activeCount} {activeCount === 1 ? 'evento activo' : 'eventos activos'}
          </span>
        </div>
      </div>
    </header>
  );
};
