import React from 'react';

interface HeaderProps {
  activeCount: number;
}

export const Header: React.FC<HeaderProps> = ({ activeCount }) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-md border-b border-amber-500/20 shadow-lg shadow-black/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand identity with bright backdrop for emblem */}
        <div className="flex items-center gap-3.5">
          {/* Logo container with white backing so the navy blue emblem pops clearly */}
          <div className="relative bg-white rounded-2xl p-1.5 shadow-md shadow-amber-500/10 border border-amber-400/40 shrink-0 flex items-center justify-center">
            <img
              src="./logo.png"
              alt="S'Agrícola - Fundada a 1899"
              className="h-11 sm:h-12 w-auto object-contain"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg sm:text-xl tracking-tight text-white leading-tight">
                S'Agrícola
              </h1>
            </div>
            <p className="text-[11px] sm:text-xs text-amber-400 font-bold tracking-wide">
              Fundada a 1899 • Associació Cultural
            </p>
          </div>
        </div>

        {/* Active events pill */}
        <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-slate-900 border border-amber-500/30 shadow-inner">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs sm:text-sm font-bold text-slate-200 whitespace-nowrap">
            {activeCount} {activeCount === 1 ? 'acte actiu' : 'actes actius'}
          </span>
        </div>
      </div>
    </header>
  );
};
