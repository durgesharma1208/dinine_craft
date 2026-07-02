import { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchAllProducts } from '../services/productService';

export function useProducts() {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    fetchAllProducts()
      .then((data) => {
        if (mounted) {
          setAllProducts(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err);
          setLoading(false);
        }
      });

    return () => { mounted = false; };
  }, []);

  const featured = useMemo(() => allProducts.filter((p) => p.featured), [allProducts]);
  const bestSellers = useMemo(() => allProducts.filter((p) => p.bestSeller), [allProducts]);
  const trending = useMemo(() => allProducts.filter((p) => p.trending), [allProducts]);
  const newArrivals = useMemo(() => allProducts.filter((p) => p.newArrival), [allProducts]);
  const inStock = useMemo(() => allProducts.filter((p) => p.stock > 0), [allProducts]);

  const getProductBySlug = useMemo(() => {
    const map = {};
    allProducts.forEach((p) => { map[p.slug] = p; });
    return map;
  }, [allProducts]);

  const getProductsByCategory = useMemo(() => {
    const map = {};
    allProducts.forEach((p) => {
      const key = p.category_slug || p.category.toLowerCase().replace(/\s+/g, '-');
      if (!map[key]) map[key] = [];
      map[key].push(p);
    });
    return map;
  }, [allProducts]);

  const getRelatedProducts = useCallback(
    (product, limit = 4) => {
      const categoryKey = product.category_slug || product.category.toLowerCase().replace(/\s+/g, '-');
      const sameCategory = getProductsByCategory[categoryKey] || [];
      return sameCategory.filter((p) => p.id !== product.id).slice(0, limit);
    },
    [getProductsByCategory],
  );

  const categories = useMemo(() => {
    const cats = [];
    const seen = new Set();
    allProducts.forEach((p) => {
      const key = p.category_slug || p.category.toLowerCase().replace(/\s+/g, '-');
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
    loading,
    error,
  };
}
