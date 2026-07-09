export default function CategoryTabs({ categories, activeId, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((c) => (
        <button
          key={c.id ?? 'all'}
          onClick={() => onChange(c.id)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
            activeId === c.id
              ? 'bg-brand-blue text-white'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}