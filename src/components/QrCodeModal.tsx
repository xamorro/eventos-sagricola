import React from 'react';
import { X, QrCode, Sparkles, Smartphone, Download } from 'lucide-react';

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const currentUrl = window.location.href;
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(
    currentUrl
  )}&bgcolor=ffffff&color=0f172a&margin=10`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="absolute inset-0 cursor-pointer" 
        onClick={onClose}
        aria-hidden="true" 
      />

      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-modal z-10 text-center animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Cerrar QR"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mx-auto mb-3">
          <QrCode className="w-6 h-6" />
        </div>

        <h2 className="text-xl font-bold text-white tracking-tight">QR de Mesa #4</h2>
        <p className="text-xs text-slate-400 mt-1">
          Escanea desde otro smartphone para probar la experiencia móvil en mesa.
        </p>

        {/* QR Code Container styled like a real restaurant table stand */}
        <div className="mt-5 p-4 rounded-2xl bg-white shadow-xl mx-auto inline-block border-4 border-amber-500/40">
          <img
            src={qrApiUrl}
            alt="Código QR de mesa para eventos"
            className="w-52 h-52 mx-auto rounded-lg"
          />
          <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-center gap-1.5 text-[11px] font-bold text-slate-800">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>S'Agrícola • Eventos en Vivo</span>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400">
          <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Abre la cámara de tu móvil para escanear</span>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 flex gap-2">
          <a
            href={qrApiUrl}
            download="qr-mesa-sagricola.png"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar QR</span>
          </a>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
