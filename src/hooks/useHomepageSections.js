import { useState, useEffect } from 'react';
import { getHomepageSections } from '../services/adminService';

export function useHomepageSections() {
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getHomepageSections()
      .then(data => {
        if (mounted) {
          const map = {};
          (data || []).forEach(s => { map[s.section_key] = s; });
          setSections(map);
        }
      })
      .catch(() => { if (mounted) setSections({}); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const isActive = (key) => sections[key]?.active !== false;

  return { sections, isActive, loading };
}
