import React, { useState } from 'react';
import { Lock, X, KeyRound, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onVerifyPin: (pin: string) => boolean;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onVerifyPin,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [showPin, setShowPin] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (onVerifyPin(pin)) {
      setError(false);
      setPin('');
      onSuccess();
    } else {
      setError(true);
      setPin('');
    }
  };

  const handleKeypadPress = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setError(false);
      // Auto-submit when 4 digits are entered
      if (nextPin.length === 4) {
        if (onVerifyPin(nextPin)) {
          setError(false);
          setPin('');
          onSuccess();
        } else {
          setError(true);
          setPin('');
        }
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="absolute inset-0 cursor-pointer" 
        onClick={onClose}
        aria-hidden="true" 
      />

      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-modal z-10 animate-slide-up">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Tancar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-500/10">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Accés d'Administració</h2>
          <p className="text-xs text-slate-400 mt-1">
            Introduïu el codi PIN de gestió interna
          </p>
        </div>

        {/* PIN Input Dots */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="relative">
            <div className="flex items-center justify-center gap-2.5 mb-2">
              {[0, 1, 2, 3].map((idx) => {
                const filled = pin.length > idx;
                return (
                  <div
                    key={idx}
                    className={`w-12 h-14 rounded-2xl flex items-center justify-center text-xl font-bold border transition-all ${
                      error
                        ? 'border-rose-500/80 bg-rose-500/10 text-rose-300'
                        : filled
                        ? 'border-amber-500 bg-amber-500/15 text-white shadow-sm shadow-amber-500/20'
                        : 'border-slate-700 bg-slate-800/80 text-slate-500'
                    }`}
                  >
                    {filled ? (showPin ? pin[idx] : '•') : ''}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center items-center gap-2 mt-2">
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
              >
                {showPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {showPin ? 'Amagar PIN' : 'Veure dígits'}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-rose-400 bg-rose-500/10 py-2 px-3 rounded-xl border border-rose-500/20">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>PIN incorrecte. Tornau a provar.</span>
            </div>
          )}

          {/* Clean Keypad */}
          <div className="grid grid-cols-3 gap-2.5 pt-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleKeypadPress(digit)}
                className="h-12 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-white font-semibold text-lg flex items-center justify-center border border-slate-700/60 shadow-sm transition-all active:scale-95"
              >
                {digit}
              </button>
            ))}
            <div />
            <button
              type="button"
              onClick={() => handleKeypadPress('0')}
              className="h-12 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-white font-semibold text-lg flex items-center justify-center border border-slate-700/60 shadow-sm transition-all active:scale-95"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              className="h-12 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:bg-slate-600 text-slate-300 font-medium text-xs flex items-center justify-center border border-slate-700/60 transition-all active:scale-95"
            >
              Esborrar
            </button>
          </div>

          <button
            type="submit"
            className="w-full mt-3 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <KeyRound className="w-4 h-4" />
            Entrar al Tauler
          </button>
        </form>
      </div>
    </div>
  );
};
