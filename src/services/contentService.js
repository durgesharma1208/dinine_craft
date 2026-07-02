import { supabase } from '../lib/supabase';

// Fetch testimonials
export async function fetchTestimonials() {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('active', true)
    .order('sort_order');

  if (error) throw error;
  return data || [];
}

// Fetch FAQ
export async function fetchFAQ() {
  const { data, error } = await supabase
    .from('faq')
    .select('*')
    .eq('active', true)
    .order('sort_order');

  if (error) throw error;
  return data || [];
}

// Fetch Instagram gallery
export async function fetchInstagramGallery() {
  const { data, error } = await supabase
    .from('instagram_gallery')
    .select('*')
    .eq('active', true)
    .order('sort_order');

  if (error) throw error;
  return data || [];
}

// Subscribe to newsletter
export async function subscribeNewsletter(email) {
  const { error } = await supabase
    .from('newsletter')
    .insert({ email });

  if (error) throw error;
  return true;
}

// Submit contact message
export async function submitContactMessage({ name, email, message }) {
  const { error } = await supabase
    .from('contact_messages')
    .insert({ name, email, message });

  if (error) throw error;
  return true;
}
