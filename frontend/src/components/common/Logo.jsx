import React from 'react';

/**
 * A highly detailed and modern SVG icon for the LBRCE Canteen Management System.
 * Combines:
 * - 🍽️ Food: Plate circle, fork, spoon
 * - 🎓 Campus/College: Graduation cap sitting on top
 * - 📱 Fast Ordering: A pulsing bright orange lightning bolt
 * Uses LBRCE's theme colors: College Blue (#1e40af) and clean white, with orange highlights.
 */
export function LogoIcon({ className = "w-10 h-10" }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`${className} transition-transform duration-300 hover:scale-110 drop-shadow-sm`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* College Blue background card resembling a modern mobile app icon */}
      <rect x="5" y="5" width="90" height="90" rx="22" className="fill-blue-700 dark:fill-slate-900 stroke-[3] stroke-blue-200 dark:stroke-slate-700" />
      
      {/* Outer circle representing a clean plate */}
      <circle cx="50" cy="53" r="28" className="fill-white dark:fill-slate-800" />
      
      {/* Cutlery / Food elements: Fork and Spoon */}
      <path 
        d="M38 38 L45 45 M38 38 Q36 36 34 38 L31 35 L33 33 L36 36 Q38 34 38 38 Z" 
        className="stroke-blue-700 dark:stroke-blue-400" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <path 
        d="M62 38 L55 45 M62 38 C64 36 67 38 69 40 C71 42 71 45 69 47 C67 49 64 49 62 47 Z" 
        className="stroke-blue-700 dark:stroke-blue-400" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      
      {/* College Graduation Cap (Campus) */}
      <path d="M50 22 L72 30 L50 38 L28 30 Z" className="fill-blue-700 dark:fill-blue-500" />
      <path d="M38 33.6 V45 C38 48 43 51 50 51 C57 51 62 48 62 45 V33.6" className="fill-blue-700 dark:fill-blue-500" />
      <path d="M72 30 V42 C72 44 70 45 69 45" className="stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="2" strokeLinecap="round" />
      
      {/* Fast Ordering Symbol: Bright Orange Lightning Bolt */}
      <path d="M50 42 L42 55 H50 L48 68 L58 52 H48 Z" className="fill-orange-600 dark:fill-orange-500" />
    </svg>
  );
}

export default function Logo({ className = "h-10", showText = true }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoIcon className="w-10 h-10" />
      {showText && (
        <div className="flex flex-col select-none">
          <span className="font-extrabold text-lg leading-tight tracking-tight text-slate-900 dark:text-white">
            LBRCE
          </span>
          <span className="text-xs font-bold tracking-widest uppercase text-orange-600 dark:text-orange-400 -mt-1">
            Canteen
          </span>
        </div>
      )}
    </div>
  );
}
