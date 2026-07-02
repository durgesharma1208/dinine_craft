import { useState, useEffect } from 'react';
import {
  fetchTestimonials,
  fetchFAQ,
  fetchInstagramGallery,
} from '../services/contentService';

export function useTestimonials() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchTestimonials()
      .then((result) => { if (mounted) setData(result); })
      .catch(() => { if (mounted) setData([]); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  return { testimonials: data, loading };
}

export function useFAQ() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchFAQ()
      .then((result) => { if (mounted) setData(result); })
      .catch(() => { if (mounted) setData([]); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  return { faqs: data, loading };
}

export function useInstagramGallery() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchInstagramGallery()
      .then((result) => { if (mounted) setData(result); })
      .catch(() => { if (mounted) setData([]); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  return { gallery: data, loading };
}
