import React, { useState, useEffect } from 'react';
import { Play, Pause, Sparkles, CheckCircle2, RotateCw } from 'lucide-react';
import BCSLogo from './BCSLogo';

export default function FidgetSpinnerHub({ clubs, registeredClubIds, onSelectClub, currentUser }) {
  const [isSpinning, setIsSpinning] = useState(true);
  const [rotationAngle, setRotationAngle] = useState(0);

  // Auto rotation effect
  useEffect(() => {
    let animationFrame;
    if (isSpinning) {
      const animate = () => {
        setRotationAngle((prev) => (prev + 0.15) % 360);
        animationFrame = requestAnimationFrame(animate);
      };
      animationFrame = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(animationFrame);
  }, [isSpinning]);

  const clubCategoryIcons = {
    'Technical': '⚡',
    'Cultural': '🎭',
    'Creative': '🎨',
    'Non-Technical': '🚀',
    'Gaming': '🎮',
    'Literature': '📚'
  };

  return (
    <div className="relative w-full min-h-[85vh] flex flex-col items-center justify-center p-4 overflow-hidden select-none">
      {/* Background Solar System Ambient Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-950/30 via-[#0B0F17] to-[#07090E] pointer-events-none" />
      <div className="absolute w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-purple-500/5 blur-3xl pointer-events-none animate-pulse delay-1000" />

      {/* Header Info Banner */}
      <div className="relative z-10 text-center mb-6 max-w-xl space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel-glow text-cyan-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          Interactive 8-Club Solar Spectrum
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
          Explore College <span className="gradient-text">Clubs</span>
        </h2>
        <p className="text-xs text-gray-300">
          Click any club logo on the spinner to read audition details & register (Max 2 clubs)
        </p>

        {currentUser && currentUser.role === 'student' && (
          <div className="pt-1">
            <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
              Registrations: {registeredClubIds.length} / 2 Selected
            </span>
          </div>
        )}
      </div>

      {/* Interactive Controls Bar */}
      <div className="relative z-20 mb-4 flex items-center gap-3">
        <button
          onClick={() => setIsSpinning(!isSpinning)}
          className="px-4 py-2 rounded-xl glass-panel text-xs font-semibold text-cyan-300 hover:text-white flex items-center gap-2 transition-all border border-cyan-500/30 hover:border-cyan-400"
        >
          {isSpinning ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
          {isSpinning ? 'Pause Spinner' : 'Spin Orbit'}
        </button>
      </div>

      {/* SOLAR SYSTEM / FIDGET SPINNER CONTAINER */}
      <div 
        className="relative w-[340px] h-[340px] sm:w-[500px] sm:h-[500px] md:w-[580px] md:h-[580px] flex items-center justify-center my-auto"
        onMouseEnter={() => setIsSpinning(false)}
        onMouseLeave={() => setIsSpinning(true)}
      >
        {/* Orbital Ring SVG Graphic */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 600">
          {/* Fidget Spinner Outer Belt */}
          <circle cx="300" cy="300" r="230" fill="none" stroke="rgba(0, 242, 254, 0.15)" strokeWidth="2" strokeDasharray="8 6" />
          <circle cx="300" cy="300" r="150" fill="none" stroke="rgba(127, 0, 255, 0.15)" strokeWidth="1.5" strokeDasharray="15 10" />

          {/* Fidget Spinner Arm Paths */}
          {[0, 120, 240].map((armAngle) => (
            <path
              key={armAngle}
              d={`M 300 300 Q ${300 + 120 * Math.cos((armAngle * Math.PI) / 180)} ${300 + 120 * Math.sin((armAngle * Math.PI) / 180)} ${300 + 230 * Math.cos((armAngle * Math.PI) / 180)} ${300 + 230 * Math.sin((armAngle * Math.PI) / 180)}`}
              fill="none"
              stroke="rgba(0, 242, 254, 0.12)"
              strokeWidth="4"
              strokeLinecap="round"
              transform={`rotate(${rotationAngle} 300 300)`}
            />
          ))}
        </svg>

        {/* CENTRAL SUN LOGO: BC CREATIVE SPECTRUM */}
        <div className="absolute z-20 w-28 h-28 sm:w-36 sm:h-36 rounded-full glass-panel-glow p-2 flex flex-col items-center justify-center text-center shadow-2xl border-2 border-cyan-400/50 animate-pulse-glow group cursor-pointer"
             onClick={() => setIsSpinning(!isSpinning)}>
          <BCSLogo className="w-16 h-16 sm:w-20 sm:h-20" animated={isSpinning} />
          <span className="text-[10px] font-bold text-cyan-300 tracking-wider uppercase mt-1">BCS HUB</span>
        </div>

        {/* 8 ORBITING CLUB LOGOS ("PLANETS") */}
        {clubs.map((club, index) => {
          // Calculate angle for 8 clubs equally spaced (360 / 8 = 45 degrees)
          const angle = (index * 45 + rotationAngle) * (Math.PI / 180);
          
          // Responsive radius based on viewport scale
          const isRegistered = registeredClubIds.includes(club.id);

          return (
            <div
              key={club.id}
              onClick={() => onSelectClub(club)}
              style={{
                left: `calc(50% + ${Math.cos(angle) * (window.innerWidth < 640 ? 125 : 210)}px)`,
                top: `calc(50% + ${Math.sin(angle) * (window.innerWidth < 640 ? 125 : 210)}px)`,
                transform: 'translate(-50%, -50%)',
              }}
              className={`absolute z-30 flex flex-col items-center cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95 group`}
            >
              {/* Club Logo Node Button */}
              <div
                className={`relative w-14 h-14 sm:w-20 sm:h-20 rounded-2xl p-2 flex flex-col items-center justify-center text-center shadow-xl backdrop-blur-xl transition-all border-2 ${
                  isRegistered
                    ? 'bg-gradient-to-br from-emerald-950/90 to-cyan-950/90 border-emerald-400 shadow-emerald-500/30'
                    : 'glass-panel border-white/20 group-hover:border-cyan-400 group-hover:shadow-cyan-500/40'
                }`}
                style={{
                  borderColor: isRegistered ? '#10b981' : club.badge_color || '#3b82f6'
                }}
              >
                {/* Category Icon */}
                <span className="text-lg sm:text-2xl mb-0.5 filter drop-shadow-md">
                  {clubCategoryIcons[club.category] || '🌟'}
                </span>

                {/* Club Short Title */}
                <span className="text-[9px] sm:text-[11px] font-bold text-white font-heading leading-tight line-clamp-1 text-center">
                  {club.name}
                </span>

                {/* Registered Checkmark Badge Overlay */}
                {isRegistered && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                )}
              </div>

              {/* BELOW THE CLUB LOGO: SMALL "REGISTERED" BADGE IF REGISTERED */}
              {isRegistered ? (
                <div className="mt-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/60 text-emerald-300 text-[9px] sm:text-[10px] font-extrabold tracking-wider uppercase shadow-lg backdrop-blur-md animate-pulse">
                  REGISTERED
                </div>
              ) : (
                /* Empty space if not registered as requested */
                <div className="h-5"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
