import { useMemo, useState } from 'react';

export function useFilterSort(products) {
  const [filters, setFilters] = useState({
    category: '',
    minPrice: 0,
    maxPrice: Infinity,
    minRating: 0,
    availability: '',
    featured: false,
    bestSeller: false,
    trending: false,
    newArrival: false,
  });
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAndSorted = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q)) ||
        p.sku.toLowerCase().includes(q)
      );
    }

    if (filters.category) {
      result = result.filter(p => p.category_slug === filters.category);
    }

    if (filters.minPrice > 0) {
      result = result.filter(p => p.price >= filters.minPrice);
    }

    if (filters.maxPrice < Infinity) {
      result = result.filter(p => p.price <= filters.maxPrice);
    }

    if (filters.minRating > 0) {
      result = result.filter(p => p.rating >= filters.minRating);
    }

    if (filters.availability === 'in-stock') {
      result = result.filter(p => p.stock > 0);
    } else if (filters.availability === 'out-of-stock') {
      result = result.filter(p => p.stock === 0);
    }

    if (filters.featured) result = result.filter(p => p.featured);
    if (filters.bestSeller) result = result.filter(p => p.bestSeller);
    if (filters.trending) result = result.filter(p => p.trending);
    if (filters.newArrival) result = result.filter(p => p.newArrival);

    switch (sortBy) {
      case 'newest': return [...result].reverse();
      case 'oldest': return result;
      case 'price-low': return [...result].sort((a, b) => a.price - b.price);
      case 'price-high': return [...result].sort((a, b) => b.price - a.price);
      case 'rating': return [...result].sort((a, b) => b.rating - a.rating);
      case 'popular': return [...result].sort((a, b) => b.reviews - a.reviews);
      case 'alpha': return [...result].sort((a, b) => a.name.localeCompare(b.name));
      default: return result;
    }
  }, [products, filters, sortBy, searchQuery]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      minPrice: 0,
      maxPrice: Infinity,
      minRating: 0,
      availability: '',
      featured: false,
      bestSeller: false,
      trending: false,
      newArrival: false,
    });
    setSortBy('newest');
    setSearchQuery('');
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category) count++;
    if (filters.minPrice > 0) count++;
    if (filters.maxPrice < Infinity && filters.maxPrice < 100000) count++;
    if (filters.minRating > 0) count++;
    if (filters.availability) count++;
    if (filters.featured) count++;
    if (filters.bestSeller) count++;
    if (filters.trending) count++;
    if (filters.newArrival) count++;
    return count;
  }, [filters]);

  return {
    filters,
    updateFilter,
    resetFilters,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    filteredAndSorted,
    activeFilterCount,
  };
}
