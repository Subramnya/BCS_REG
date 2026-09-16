import React from 'react';

export default function BCSLogo({ className = "w-24 h-24", animated = true }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outer Glow Ring */}
      <svg className="w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bcs-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F2FE" />
            <stop offset="50%" stopColor="#4FACFE" />
            <stop offset="100%" stopColor="#7F00FF" />
          </linearGradient>
          <linearGradient id="bcs-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FF007A" />
            <stop offset="100%" stopColor="#FFB300" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Orbit Spectrum Circles */}
        <circle 
          cx="100" 
          cy="100" 
          r="88" 
          stroke="url(#bcs-grad-1)" 
          strokeWidth="3" 
          strokeDasharray="12 8 4 8"
          className={animated ? "animate-spin-slow origin-center" : ""}
          opacity="0.8"
        />
        <circle 
          cx="100" 
          cy="100" 
          r="75" 
          stroke="url(#bcs-grad-2)" 
          strokeWidth="2" 
          strokeDasharray="20 10"
          className={animated ? "animate-reverse-spin origin-center" : ""}
          opacity="0.6"
        />
        
        {/* Core Shield / Circle */}
        <circle cx="100" cy="100" r="60" fill="#0B0F17" stroke="url(#bcs-grad-1)" strokeWidth="4" filter="url(#glow)" />

        {/* Geometric Prism Lines */}
        <path d="M100 45 L145 135 L55 135 Z" fill="none" stroke="url(#bcs-grad-1)" strokeWidth="2.5" opacity="0.6" />
        <path d="M100 155 L55 65 L145 65 Z" fill="none" stroke="url(#bcs-grad-2)" strokeWidth="2" opacity="0.4" />

        {/* Central Logo Text */}
        <text 
          x="100" 
          y="108" 
          textAnchor="middle" 
          fill="#FFFFFF" 
          fontSize="36" 
          fontWeight="900" 
          fontFamily="'Outfit', sans-serif"
          letterSpacing="2"
        >
          BCS
        </text>
        <text 
          x="100" 
          y="126" 
          textAnchor="middle" 
          fill="#00F2FE" 
          fontSize="9" 
          fontWeight="700" 
          fontFamily="'Outfit', sans-serif"
          letterSpacing="1.5"
        >
          CREATIVE SPECTRUM
        </text>
      </svg>
    </div>
  );
}
