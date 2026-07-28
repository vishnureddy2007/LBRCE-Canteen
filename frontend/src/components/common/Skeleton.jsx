import React from 'react';

export function FoodCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 overflow-hidden flex flex-col animate-pulse shadow-sm">
      <div className="aspect-[4/3] bg-slate-200 dark:bg-slate-700" />
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-md w-3/4" />
        <div className="h-3 bg-slate-100 dark:bg-slate-700/60 rounded-md w-full" />
        <div className="h-3 bg-slate-100 dark:bg-slate-700/60 rounded-md w-2/3" />
        <div className="mt-auto pt-2 flex items-center justify-between">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-md w-16" />
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-xl w-20" />
        </div>
      </div>
    </div>
  );
}

export function FoodGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <FoodCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 animate-pulse flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-700" />
      <div className="space-y-2 flex-1">
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="animate-pulse border-b border-slate-100 dark:border-slate-800">
      <td className="p-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-12" /></td>
      <td className="p-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32" /></td>
      <td className="p-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24" /></td>
      <td className="p-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20" /></td>
      <td className="p-4"><div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-16" /></td>
    </tr>
  );
}
