import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, FileText, Sparkles, HelpCircle, LogIn } from 'lucide-react';

export default function ClubNoticeModal({ club, isOpen, onClose, registeredClubIds, currentUser, onConfirmRegister, onRequestLogin }) {
  const [showConfirmationPrompt, setShowConfirmationPrompt] = useState(false);
  const [registering, setRegistering] = useState(false);

  if (!isOpen || !club) return null;

  const isAlreadyRegistered = registeredClubIds.includes(club.id);
  const totalRegistrationsCount = registeredClubIds.length;
  const isLimitReached = totalRegistrationsCount >= 2 && !isAlreadyRegistered;

  const handleRegisterClick = () => {
    if (!currentUser) {
      onRequestLogin();
      return;
    }
    setShowConfirmationPrompt(true);
  };

  const handleFinalConfirm = async () => {
    setRegistering(true);
    await onConfirmRegister(club.id);
    setRegistering(false);
    setShowConfirmationPrompt(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg overflow-y-auto">
      {/* MAIN NOTICE POP-UP MODAL */}
      <div className="relative w-full max-w-2xl glass-panel-glow rounded-3xl p-6 sm:p-8 border border-cyan-500/30 my-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Official Notice Header */}
        <div className="border-b border-white/10 pb-5 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider shadow-md"
              style={{ backgroundColor: club.badge_color || '#3b82f6' }}
            >
              {club.category}
            </span>
            <span className="text-xs text-cyan-400 font-semibold flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" /> Official Audition Notice
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">{club.name}</h2>
          <p className="text-sm font-semibold text-cyan-300 mt-1">{club.easy_meaning}</p>
        </div>

        {/* Notice Content Body */}
        <div className="space-y-6 text-xs sm:text-sm leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
          {/* Section 1: About the Club */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> About The Club
            </h3>
            <p className="text-gray-200 text-xs sm:text-sm">{club.description}</p>
          </div>

          {/* Section 2: Audition Process */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/40 to-purple-950/40 border border-cyan-500/20 space-y-2">
            <h3 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Audition Process & Guidelines
            </h3>
            <div className="text-gray-200 text-xs sm:text-sm whitespace-pre-line leading-relaxed">
              {club.audition_process}
            </div>
          </div>
        </div>

        {/* Footer Action Bar */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-gray-400">
            {isAlreadyRegistered ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> You are registered for this audition!
              </span>
            ) : isLimitReached ? (
              <span className="text-amber-400 font-medium flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" /> Maximum 2 club limit reached ({totalRegistrationsCount}/2)
              </span>
            ) : currentUser ? (
              <span className="text-gray-300">
                Registrations used: <strong className="text-cyan-400">{totalRegistrationsCount} / 2</strong>
              </span>
            ) : (
              <span className="text-cyan-300 font-medium">
                Log in to register for this club audition
              </span>
            )}
          </div>

          {/* ACTION BUTTON LOGIC BASED ON REQUIREMENTS */}
          {!isAlreadyRegistered && !isLimitReached && (
            currentUser ? (
              /* "Yes, I am ready to give the audition" Button */
              <button
                onClick={handleRegisterClick}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Yes, I am ready to give the audition
              </button>
            ) : (
              /* Prompt Login Button */
              <button
                onClick={onRequestLogin}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Log In To Register
              </button>
            )
          )}
        </div>
      </div>

      {/* SECONDARY CONFIRMATION PROMPT MODAL */}
      {showConfirmationPrompt && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
          <div className="relative w-full max-w-md glass-panel-glow rounded-3xl p-6 text-center space-y-4 border border-cyan-400/40 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center mx-auto text-cyan-400">
              <HelpCircle className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold font-heading text-white">Confirm Registration</h3>

            <p className="text-xs text-gray-200 leading-relaxed px-2">
              Are you sure you want to give the audition for <strong className="text-cyan-300">{club.name}</strong>?
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowConfirmationPrompt(false)}
                className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 font-semibold text-xs transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleFinalConfirm}
                disabled={registering}
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-bold text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                {registering ? 'Confirming...' : 'OK, Register'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
