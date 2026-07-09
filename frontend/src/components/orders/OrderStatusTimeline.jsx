import { ORDER_STATUSES } from '../../utils/constants';

/**
 * Visual timeline of order progress. Completed steps are filled in brand orange;
 * the currently active step is highlighted; cancelled orders show a single red bar.
 *
 * @param {{status: string}} props
 */
export default function OrderStatusTimeline({ status }) {
  if (status === 'CANCELLED') {
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-md bg-red-50 dark:bg-red-900/40 text-red-700 dark:text-red-200 border border-red-200 dark:border-red-800">
        <span className="w-2 h-2 rounded-full bg-red-500" /> Order Cancelled
      </div>
    );
  }
  const flow = ['PLACED', 'PREPARING', 'READY', 'DELIVERED'];
  const idx  = flow.indexOf(status);
  return (
    <ol className="flex items-center w-full">
      {flow.map((s, i) => {
        const done    = i < idx;
        const current = i === idx;
        const meta    = ORDER_STATUSES.find((x) => x.value === s);
        return (
          <li key={s} className="flex-1 flex items-center">
            <div className="flex flex-col items-center">
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                  done || current
                    ? 'bg-brand-orange border-brand-orange text-white'
                    : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-400'
                }`}
              >
                {i + 1}
              </span>
              <span className={`mt-1 text-xs ${current ? 'font-semibold text-brand-orange' : 'text-slate-500 dark:text-slate-400'}`}>
                {meta?.label || s}
              </span>
            </div>
            {i < flow.length - 1 && (
              <div className={`flex-1 h-1 mx-2 rounded ${done ? 'bg-brand-orange' : 'bg-slate-200 dark:bg-slate-700'}`} />
            )}
          </li>
        );
      })}
    </ol>
  );
}