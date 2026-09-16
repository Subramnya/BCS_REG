import React, { useRef, useState, useEffect } from 'react';
import { LogIn, UserPlus, Play, Volume2, VolumeX, Sparkles } from 'lucide-react';
import BCSLogo from './BCSLogo';

export default function LandingPage({ onOpenLogin, onOpenSignIn }) {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-between p-6 sm:p-12 select-none">
      {/* Background HTML5 Video Stream */}
      {!videoError ? (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          onError={() => setVideoError(true)}
          className="absolute inset-0 w-full h-full object-cover z-0 filter brightness-[0.45] contrast-125 scale-105 transition-all duration-700"
        >
          <source src="/api/video" type="video/mp4" />
          Your browser does not support HTML5 video streaming.
        </video>
      ) : (
        /* Fallback Animated Gradient if Video Error */
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B0F17] via-[#0f172a] to-[#1e1b4b] z-0 animate-pulse" />
      )}

      {/* Camouflage Glassmorphism Dark Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-transparent to-[#0B0F17]/80 z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent z-0 pointer-events-none" />

      {/* Video Mute Toggle Floating Controller */}
      <button
        onClick={toggleMute}
        className="absolute top-4 right-4 z-20 p-3 rounded-full glass-panel text-gray-300 hover:text-white hover:border-cyan-400 transition-all shadow-xl"
        title={isMuted ? "Unmute Video" : "Mute Video"}
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-cyan-400" />}
      </button>

      {/* Header Section */}
      <div className="relative z-10 pt-8 sm:pt-12 text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel-glow border border-cyan-500/40 text-cyan-300 text-xs font-semibold tracking-wider uppercase mb-2 animate-bounce">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          Official Audition Portal 2026
        </div>

        <div className="flex justify-center mb-2">
          <BCSLogo className="w-28 h-28 sm:w-36 sm:h-36" />
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold font-heading text-white tracking-tight leading-none drop-shadow-2xl">
          BC CREATIVE <span className="gradient-text">SPECTRUM</span>
        </h1>
        <p className="text-sm sm:text-lg text-gray-300 font-light max-w-xl mx-auto drop-shadow-md">
          Unleash your potential across 8 specialized clubs. One spectrum, infinite possibilities.
        </p>
      </div>

      {/* Action Buttons Section */}
      <div className="relative z-10 w-full max-w-md mx-auto my-auto space-y-5 pt-8">
        <div className="glass-panel-glow p-8 rounded-3xl space-y-4 border border-cyan-500/30 text-center shadow-2xl backdrop-blur-2xl">
          <p className="text-xs text-cyan-300 font-semibold uppercase tracking-widest">Get Started</p>
          <h2 className="text-xl font-bold font-heading text-white">Join The Spectrum</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* LOGIN BUTTON */}
            <button
              id="landing-login-btn"
              onClick={onOpenLogin}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
            >
              <LogIn className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              LOG IN
            </button>

            {/* SIGN IN / REGISTER BUTTON */}
            <button
              id="landing-signin-btn"
              onClick={onOpenSignIn}
              className="w-full py-4 px-6 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
            >
              <UserPlus className="w-4 h-4 text-purple-400 group-hover:rotate-12 transition-transform" />
              SIGN IN
            </button>
          </div>
        </div>
      </div>

      {/* Footer / Scroll Hint */}
      <div className="relative z-10 text-center pb-4 text-xs text-gray-400">
        <p>Explore clubs • Register for auditions • Maximum 2 club registrations</p>
      </div>
    </div>
  );
}
