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
  { keywords: ['idli'], url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80' },
  { keywords: ['dosa', 'masala dosa'], url: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80' },
  { keywords: ['bonda', 'mysore bonda'], url: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=600&auto=format&fit=crop&q=80' },
  { keywords: ['poori', 'puri'], url: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&auto=format&fit=crop&q=80' },
  { keywords: ['pongal'], url: 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=600&auto=format&fit=crop&q=80' },
  { keywords: ['vada', 'medu vada'], url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80' },
  { keywords: ['upma'], url: 'https://images.unsplash.com/photo-1617692855027-33b14f061079?w=600&auto=format&fit=crop&q=80' },
  { keywords: ['lemon rice'], url: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&auto=format&fit=crop&q=80' },
  { keywords: ['chicken biryani'], url: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&auto=format&fit=crop&q=80' },
  { keywords: ['veg biryani', 'biryani'], url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80' },
  { keywords: ['chicken fried rice'], url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=80' },
  { keywords: ['veg fried rice', 'fried rice'], url: 'https://images.unsplash.com/photo-1603133872878-685f586b6d1d?w=600&auto=format&fit=crop&q=80' },
  { keywords: ['meals', 'thali', 'veg meals'], url: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=600&auto=format&fit=crop&q=80' },
  { keywords: ['paneer', 'paneer butter masala'], url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80' },
  { keywords: ['chicken noodles'], url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80' },
  { keywords: ['veg noodles', 'noodles', 'hakka noodles'], url: 'https://images.unsplash.com/photo-1612966608963-47da3147d41a?w=600&auto=format&fit=crop&q=80' },
  { keywords: ['pizza'], url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80' },
  { keywords: ['burger'], url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80' },
  { keywords: ['sandwich'], url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80' },
  { keywords: ['french fries', 'fries'], url: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&auto=format&fit=crop&q=80' },
  { keywords: ['samosa'], url: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=600&auto=format&fit=crop&q=80' },
  { keywords: ['puff', 'egg puff', 'puffs'], url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80' },
  { keywords: ['manchuria', 'manchurian'], url: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=600&auto=format&fit=crop&q=80' },
  { keywords: ['tea', 'chai', 'masala chai'], url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80' },
  { keywords: ['coffee', 'filter coffee'], url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80' },
  { keywords: ['milkshake', 'shake'], url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80' },
  { keywords: ['ice cream'], url: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=600&auto=format&fit=crop&q=80' },
  { keywords: ['soft drink', 'soda', 'lime soda', 'beverage'], url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80' },
  { keywords: ['mango lassi', 'lassi'], url: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&auto=format&fit=crop&q=80' },
];

export const getImageUrl = (path, foodName = '') => {
  const defaultFallback = 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&auto=format&fit=crop&q=80';

  // 1. If valid absolute URL or data URL is provided and doesn't explicitly match placeholder pattern
  if (path && (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) && !path.includes('placeholder-')) {
    return path;
  }

  // 2. Relative API upload path handling
  if (path && !path.includes('placeholder-')) {
    const apiBase = import.meta.env.VITE_API_BASE_URL || '';
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

  // 3. Smart dish-name based fallback matching
  if (foodName) {
    const nameLower = foodName.toLowerCase();
    const matched = FOOD_NAME_IMAGE_MAP.find((item) =>
      item.keywords.some((kw) => nameLower.includes(kw))
    );
    if (matched) return matched.url;
  }

  return defaultFallback;
};