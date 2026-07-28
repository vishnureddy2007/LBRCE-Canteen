import React from 'react';

// Brand-styled loader used during async data loads.
export default function Loader({ label }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-slate-500 dark:text-slate-400">
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-brand-orange border-r-brand-blue animate-spin" />
        <div className="absolute w-3 h-3 bg-brand-orange rounded-full animate-ping" />
      </div>
      {label && <span className="text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-300 animate-pulse">{label}</span>}
    </div>
  );
}