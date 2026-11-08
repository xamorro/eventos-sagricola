import React from 'react';
import { Sparkles, QrCode, Shield, Compass } from 'lucide-react';

interface HeaderProps {
  onOpenQr: () => void;
  onOpenAdminAuth: () => void;
  activeCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onOpenQr, onOpenAdminAuth, activeCount }) => {
  return (
    <header className="sticky top-0 z-30 glass-nav">
      <div className="max-w-md mx-auto px-4 py-3.5 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-amber-400 p-0.5 shadow-lg shadow-brand-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-brand-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-base tracking-tight text-white">S'Agrícola</h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-brand-500/20 text-brand-400 border border-brand-500/30">
                En Directo
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {activeCount} {activeCount === 1 ? 'evento activo' : 'eventos activos'}
            </p>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenQr}
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/50 transition-all active:scale-95"
            title="Ver código QR para mesa"
            aria-label="Ver código QR de mesa"
          >
            <QrCode className="w-4 h-4 text-brand-400" />
          </button>
          <button
            onClick={onOpenAdminAuth}
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-400 hover:text-slate-200 border border-slate-700/50 transition-all active:scale-95"
            title="Acceso Administración (Staff)"
            aria-label="Acceso administrador"
          >
            <Shield className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Subtle table notice banner */}
      <div className="bg-gradient-to-r from-brand-950/60 via-slate-900 to-brand-950/60 border-t border-b border-brand-500/10 px-4 py-1.5">
        <div className="max-w-md mx-auto flex items-center justify-between text-[11px] text-slate-300">
          <span className="flex items-center gap-1.5 text-slate-300">
            <Compass className="w-3.5 h-3.5 text-brand-400" />
            <span>Mesa <strong>#4</strong> • Terraza</span>
          </span>
          <span className="text-brand-300/90 font-medium">
            ¡Descubre qué pasa hoy!
          </span>
        </div>
      </div>
    </header>
  );
};
