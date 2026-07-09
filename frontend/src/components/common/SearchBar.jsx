import { useState } from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  const [v, setV] = useState(value || '');
  return (
    <div className="relative w-full sm:max-w-sm">
      <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        value={v}
        onChange={(e) => { setV(e.target.value); onChange?.(e.target.value); }}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none"
      />
    </div>
  );
}