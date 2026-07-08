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
      if (!p.category_slug) return;
      if (!map[p.category_slug]) map[p.category_slug] = [];
      map[p.category_slug].push(p);
    });
    return map;
  }, [allProducts]);

  const getRelatedProducts = useCallback(
    (product, limit = 4) => {
      if (!product.category_slug) return [];
      const sameCategory = getProductsByCategory[product.category_slug] || [];
      return sameCategory.filter((p) => p.id !== product.id).slice(0, limit);
    },
    [getProductsByCategory],
  );

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
    loading,
    error,
  };
}
