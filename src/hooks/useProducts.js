import { useMemo } from 'react';
import productsData from '../data/products.json';

export function useProducts() {
  const allProducts = useMemo(() => productsData, []);

  const featured = useMemo(() => allProducts.filter(p => p.featured), [allProducts]);
  const bestSellers = useMemo(() => allProducts.filter(p => p.bestSeller), [allProducts]);
  const trending = useMemo(() => allProducts.filter(p => p.trending), [allProducts]);
  const newArrivals = useMemo(() => allProducts.filter(p => p.newArrival), [allProducts]);
  const inStock = useMemo(() => allProducts.filter(p => p.stock > 0), [allProducts]);

  const getProductBySlug = useMemo(() => {
    const map = {};
    allProducts.forEach(p => { map[p.slug] = p; });
    return map;
  }, [allProducts]);

  const getProductsByCategory = useMemo(() => {
    const map = {};
    allProducts.forEach(p => {
      const key = p.category.toLowerCase().replace(/\s+/g, '-');
      if (!map[key]) map[key] = [];
      map[key].push(p);
    });
    return map;
  }, [allProducts]);

  const getRelatedProducts = (product, limit = 4) => {
    const categoryKey = product.category.toLowerCase().replace(/\s+/g, '-');
    const sameCategory = getProductsByCategory[categoryKey] || [];
    return sameCategory.filter(p => p.id !== product.id).slice(0, limit);
  };

  const categories = useMemo(() => {
    const cats = [];
    const seen = new Set();
    allProducts.forEach(p => {
      const key = p.category.toLowerCase().replace(/\s+/g, '-');
      if (!seen.has(key)) {
        seen.add(key);
        cats.push({ name: p.category, slug: key });
      }
    });
    return cats;
  }, [allProducts]);

  return {
    allProducts,
    featured,
    bestSellers,
    trending,
    newArrivals,
    inStock,
    getProductBySlug,
    getProductsByCategory,
    getRelatedProducts,
    categories,
  };
}
