import React from 'react';

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-sm">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-brand-orange/10 dark:bg-brand-orange/20 text-brand-orange flex items-center justify-center mb-4 shadow-sm">
          <Icon size={32} strokeWidth={1.75} />
        </div>
      )}
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}