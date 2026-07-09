// Static enum-like lists used by both forms and order displays.
export const CATEGORIES = [
  { id: null,    name: 'All' },
  { id: 'breakfast', name: 'Breakfast' },
  { id: 'lunch',     name: 'Lunch' },
  { id: 'snacks',    name: 'Snacks' },
  { id: 'beverages', name: 'Beverages' },
];

export const ORDER_STATUSES = [
  { value: 'PLACED',    label: 'Placed',    color: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200' },
  { value: 'PREPARING', label: 'Preparing', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200' },
  { value: 'READY',     label: 'Ready',     color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200' },
  { value: 'DELIVERED', label: 'Delivered', color: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' },
  { value: 'CANCELLED', label: 'Cancelled', color: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200' },
];

export const PAYMENT_METHODS = [
  { value: 'CASH', label: 'Cash on pickup' },
  { value: 'UPI',  label: 'UPI' },
];

export const REPORT_PERIODS = [
  { value: 'daily',   label: 'Today' },
  { value: 'weekly',  label: 'Last 7 days' },
  { value: 'monthly', label: 'Last 30 days' },
];

export const SHIFTS = ['MORNING', 'AFTERNOON', 'EVENING', 'NIGHT'];