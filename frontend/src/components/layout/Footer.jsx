export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-slate-600 dark:text-slate-300">
        <span>© {new Date().getFullYear()} LBRCE Canteen Management System</span>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Built for LBRCE — all times in IST.
        </span>
      </div>
    </footer>
  );
}