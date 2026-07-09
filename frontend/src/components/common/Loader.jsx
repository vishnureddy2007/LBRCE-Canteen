// Spinner with brand colors. Used during async loads.
export default function Loader({ label }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-500 dark:text-slate-400">
      <div className="h-10 w-10 rounded-full border-4 border-slate-200 dark:border-slate-700 border-t-brand-orange animate-spin" />
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}