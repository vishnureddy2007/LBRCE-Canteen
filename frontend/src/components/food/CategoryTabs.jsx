import React from 'react';

export default function CategoryTabs({ categories, activeId, onChange }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-0.5">
      {categories.map((c) => {
        const isActive = activeId === c.id;
        return (
          <button
            key={c.id ?? 'all'}
            onClick={() => onChange(c.id)}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 active:scale-95 shadow-sm ${
              isActive
                ? 'bg-brand-orange text-white shadow-glow-orange scale-105'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            {c.name}
          </button>
        );
      })}
    </div>
  );
}