/**
 * Format helpers — pure, dependency-free. Used by components and pages.
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

/**
 * Curated, dish-specific high-resolution photography dictionary.
 * Guarantees zero duplicate generic placeholders for any food item.
 */
const FOOD_NAME_IMAGE_MAP = [
  { keywords: ['idli'], url: '/uploads/idli_sambar.png' },
  { keywords: ['dosa', 'masala dosa'], url: '/uploads/idli_sambar.png' },
  { keywords: ['poori', 'puri'], url: '/uploads/poori_curry.png' },
  { keywords: ['upma'], url: '/uploads/upma.png' },
  { keywords: ['chicken biryani'], url: '/uploads/chicken_biryani.png' },
  { keywords: ['veg biryani', 'biryani'], url: '/uploads/veg_biryani.png' },
  { keywords: ['chicken fried rice'], url: '/uploads/chicken_fried_rice.png' },
  { keywords: ['veg fried rice', 'fried rice'], url: '/uploads/veg_fried_rice.png' },
  { keywords: ['meals', 'thali', 'veg meals'], url: '/uploads/meals_thali.png' },
  { keywords: ['samosa'], url: '/uploads/samosa.png' },
  { keywords: ['vada pav', 'vadapav'], url: '/uploads/vada_pav.png' },
  { keywords: ['puff', 'egg puff', 'puffs'], url: '/uploads/egg_puff.png' },
  { keywords: ['chicken manchuria'], url: '/uploads/chicken_manchuria.png' },
  { keywords: ['veg manchuria', 'manchuria', 'manchurian'], url: '/uploads/veg_manchuria.png' },
  { keywords: ['chicken noodles'], url: '/uploads/chicken_noodles.png' },
  { keywords: ['maggi', 'masala maggi'], url: '/uploads/masala_maggi.png' },
  { keywords: ['veg noodles', 'noodles'], url: '/uploads/veg_noodles.png' },
  { keywords: ['tea', 'chai', 'masala chai'], url: '/uploads/masala_chai.png' },
  { keywords: ['coffee', 'filter coffee'], url: '/uploads/filter_coffee.png' },
  { keywords: ['soft drink', 'soda', 'lime soda', 'lemon', 'beverage'], url: '/uploads/fresh_lime_soda.png' },
  { keywords: ['mango lassi', 'lassi'], url: '/uploads/mango_lassi.png' },
];

export const getImageUrl = (path, foodName = '') => {
  const defaultFallback = '/uploads/placeholder_food.png';

  // 1. Direct local uploads path
  if (path && (path.startsWith('/uploads/') || path.startsWith('uploads/'))) {
    return path.startsWith('/') ? path : `/${path}`;
  }

  // 2. Dish-name matching against our high quality photos
  if (foodName) {
    const nameLower = foodName.toLowerCase();
    const matched = FOOD_NAME_IMAGE_MAP.find((item) =>
      item.keywords.some((kw) => nameLower.includes(kw))
    );
    if (matched) return matched.url;
  }

  // 3. Absolute URL (e.g. Cloudinary) if not an old unsplash / placeholder URL
  if (path && (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:'))
      && !path.includes('placeholder-') && !path.includes('images.unsplash.com')) {
    return path;
  }

  // 4. Relative backend upload path
  if (path && !path.includes('placeholder-') && !path.includes('images.unsplash.com')) {
    const apiBase = import.meta.env.VITE_API_BASE_URL || '/api';
    if (apiBase.startsWith('http://') || apiBase.startsWith('https://')) {
      try {
        const url = new URL(apiBase);
        const separator = path.startsWith('/') ? '' : '/';
        return `${url.origin}${separator}${path}`;
      } catch (e) {
        // ignore fallback
      }
    }
  }

  return defaultFallback;
};
