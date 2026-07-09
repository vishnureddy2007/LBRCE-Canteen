/**
 * Format helpers — pure, dependency-free. Used by both pages and the bill PDF.
 */
export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 })
    .format(Number(value ?? 0));

export const formatDate = (value) => {
  if (!value) return '';
  const d = new Date(value);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const formatDateTime = (value) => {
  if (!value) return '';
  const d = new Date(value);
  return d.toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

export const formatRating = (value) =>
  Number(value || 0).toFixed(1);

export const truncate = (str, n = 60) =>
  (str || '').length > n ? `${str.slice(0, n - 1)}…` : str;

export const getImageUrl = (path) => {
  if (!path) return '/uploads/placeholder-default.png';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const apiBase = import.meta.env.VITE_API_BASE_URL || '';
  if (apiBase.startsWith('http://') || apiBase.startsWith('https://')) {
    try {
      const url = new URL(apiBase);
      const separator = path.startsWith('/') ? '' : '/';
      return `${url.origin}${separator}${path}`;
    } catch (e) {
      // ignore
    }
  }
  return path;
};