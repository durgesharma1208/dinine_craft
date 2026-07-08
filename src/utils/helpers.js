export function formatPrice(price) {
  return '₹' + price.toLocaleString('en-IN');
}

export function getDiscountedPrice(price, discount) {
  return price - (price * discount) / 100;
}

export function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export function getStockStatus(stock, availability) {
  if (stock === 0) return { label: availability || 'Out of Stock', color: 'text-red-500', bg: 'bg-red-50' };
  if (stock <= 3) return { label: 'Only ' + stock + ' Left', color: 'text-orange-500', bg: 'bg-orange-50' };
  if (stock <= 10) return { label: 'Limited Stock', color: 'text-yellow-600', bg: 'bg-yellow-50' };
  return { label: availability || 'In Stock', color: 'text-green-600', bg: 'bg-green-50' };
}

export function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + units[i];
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
}


