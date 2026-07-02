import { useState, useEffect } from 'react';
import { fetchCategories } from '../services/categoryService';

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchCategories()
      .then(data => { if (mounted) setCategories(data || []); })
      .catch(() => { if (mounted) setCategories([]); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  return { categories, loading };
}
