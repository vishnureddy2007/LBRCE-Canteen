import { Sun, Moon } from 'lucide-react';
import useThemeStore from '../../store/themeStore';

/** Standalone toggle button. The navbar already has its own, so this is
 *  used by the auth pages and other surfaces. */
export default function ThemeToggle() {
  const theme = useThemeStore((s) => s.theme);
  const toggle = useThemeStore((s) => s.toggle);
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="p-2 rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}