import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'info', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  const bgStyles = {
    success: 'bg-gradient-to-r from-emerald-950 to-cyan-950 border-emerald-500/50 text-emerald-200',
    error: 'bg-gradient-to-r from-red-950 to-pink-950 border-red-500/50 text-red-200',
    info: 'bg-gradient-to-r from-cyan-950 to-purple-950 border-cyan-500/50 text-cyan-200'
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-cyan-400 flex-shrink-0" />
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-in slide-in-from-bottom-5 duration-300">
      <div className={`p-4 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3 text-xs sm:text-sm ${bgStyles[type] || bgStyles.info}`}>
        <div className="flex items-center gap-3">
          {icons[type]}
          <span className="font-semibold">{message}</span>
        </div>
        <button onClick={onClose} className="p-1 text-gray-400 hover:text-white rounded-lg">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
