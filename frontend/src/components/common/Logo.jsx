import React from 'react';

/**
 * Modern LBRCE Canteen Vector Logo Component.
 * Incorporates:
 * - 🏫 LBRCE College Building Silhouette
 * - 🍲 Food Serving Cloche
 * - 🍴 Crossed Fork & Spoon Cutlery
 * - 📱 Mobile Ordering Concept / Lightning Pulse
 * - 🎨 LBRCE Deep Royal Blue & Vibrant Canteen Orange
 */
export function LogoIcon({ className = "w-10 h-10" }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`${className} transition-transform duration-300 hover:scale-105 drop-shadow-md select-none`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="LBRCE Canteen Logo"
      role="img"
    >
      <defs>
        <linearGradient id="logoBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E3A8A" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
        <linearGradient id="logoOrange" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FB923C" />
          <stop offset="100%" stopColor="#EA580C" />
        </linearGradient>
        <linearGradient id="logoGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>

      {/* App Emblem Container */}
      <rect x="6" y="6" width="88" height="88" rx="22" fill="url(#logoBg)" className="stroke-blue-400/40 dark:stroke-slate-700" strokeWidth="2" />

      {/* LBRCE College Building Silhouette */}
      <path d="M 22 55 L 22 45 L 34 35 L 50 25 L 66 35 L 78 45 L 78 55 Z" fill="#93C5FD" opacity="0.3" />
      <rect x="46" y="28" width="8" height="10" fill="url(#logoGold)" opacity="0.5" />
      <polygon points="50,20 44,28 56,28" fill="url(#logoGold)" opacity="0.8" />

      {/* Food Serving Cloche Dome */}
      <path d="M 26 58 C 26 40, 74 40, 74 58 Z" fill="none" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="50" cy="38" r="3.5" fill="url(#logoGold)" />
      <line x1="22" y1="58" x2="78" y2="58" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />

      {/* Fork & Spoon Cutlery */}
      <path d="M 38 64 L 38 78 M 35 64 V 70 M 41 64 V 70 M 35 70 Q 38 74 41 70" stroke="url(#logoGold)" strokeWidth="2" strokeLinecap="round" />
      <path d="M 62 64 L 62 78 M 59 64 C 59 70 65 70 65 64 Z" stroke="url(#logoGold)" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Mobile Ordering Pulse / Fast Order Symbol */}
      <path d="M 50 60 L 44 72 H 51 L 49 83 L 58 69 H 51 Z" fill="url(#logoOrange)" />
    </svg>
  );
}

export default function Logo({ className = "h-10", showText = true, textClass = "" }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoIcon className="w-10 h-10 flex-shrink-0" />
      {showText && (
        <div className={`flex flex-col select-none ${textClass}`}>
          <span className="font-black text-xl leading-none tracking-tight text-slate-900 dark:text-white font-heading">
            LBRCE
          </span>
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-brand-orange dark:text-brand-orange-light mt-0.5">
            Canteen
          </span>
        </div>
      )}
    </div>
  );
}
