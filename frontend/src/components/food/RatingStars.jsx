import { Star } from 'lucide-react';

/**
 * Read-only star display.
 * @param {{value: number, size?: number, count?: number}} props
 */
export default function RatingStars({ value = 0, size = 14, count }) {
  const filled = Math.round(Number(value || 0));
  return (
    <div className="inline-flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={size}
            className={i < filled ? 'text-yellow-500 fill-yellow-500' : 'text-slate-300 dark:text-slate-600'}
          />
        ))}
      </div>
      <span className="text-xs text-slate-600 dark:text-slate-300">
        {Number(value || 0).toFixed(1)}
        {typeof count === 'number' ? ` (${count})` : ''}
      </span>
    </div>
  );
}