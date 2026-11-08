import React from 'react';
import { X, QrCode, Download, ExternalLink } from 'lucide-react';

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const publicUrl = window.location.origin + window.location.pathname;
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(
    publicUrl
  )}&bgcolor=ffffff&color=0f172a&margin=12`;

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
          aria-label="Tancar QR"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-3">
          <QrCode className="w-6 h-6" />
        </div>

        <h2 className="text-xl font-bold text-white tracking-tight">Codi QR del Web</h2>
        <p className="text-xs text-slate-400 mt-1">
          Descarregau aquest codi QR per a cartells, xarxes socials o difusió dels actes de S'Agrícola.
        </p>

        {/* QR Code Container */}
        <div className="mt-5 p-4 rounded-2xl bg-white shadow-xl mx-auto inline-block border-2 border-slate-200">
          <img
            src={qrApiUrl}
            alt="Codi QR del web d'esdeveniments"
            className="w-52 h-52 mx-auto rounded-lg"
          />
          <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-center gap-2">
            <img src="./logo.png" alt="Logo" className="h-6 w-auto object-contain" />
            <span className="text-xs font-bold text-slate-800">
              S'Agrícola • 1899
            </span>
          </div>
        </div>

        <p className="mt-3 text-[11px] text-slate-500 font-mono truncate px-2">
          {publicUrl}
        </p>

        <div className="mt-5 flex gap-2">
          <a
            href={qrApiUrl}
            download="qr-actes-sagricola.png"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Descarregar QR</span>
          </a>
          <button
            onClick={() => window.open(publicUrl, '_blank')}
            className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Obrir enllaç públic"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
