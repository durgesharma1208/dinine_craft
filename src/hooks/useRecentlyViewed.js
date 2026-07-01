import { useState, useEffect } from 'react';

const STORAGE_KEY = 'dinine_recently_viewed';
const MAX_ITEMS = 8;

export function useRecentlyViewed() {
  const [recentIds, setRecentIds] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recentIds));
    } catch {
    }
  }, [recentIds]);

  const addToRecentlyViewed = (productId) => {
    setRecentIds(prev => {
      const filtered = prev.filter(id => id !== productId);
      return [productId, ...filtered].slice(0, MAX_ITEMS);
    });
  };

  const getRecentlyViewed = (allProducts) => {
    return recentIds
      .map(id => allProducts.find(p => p.id === id))
      .filter(Boolean);
  };

  return { recentIds, addToRecentlyViewed, getRecentlyViewed };
}
