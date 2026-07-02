import { supabase } from '../lib/supabase';
import { mapProductRow } from '../utils/mappers';

// Fetch all products with images and tags
export async function fetchAllProducts() {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:category_id(name, slug),
      images:product_images(url, is_thumbnail, sort_order),
      tags:product_tags(tag)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(mapProductRow);
}

// Fetch single product by slug
export async function fetchProductBySlug(slug) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:category_id(name, slug),
      images:product_images(url, is_thumbnail, sort_order),
      tags:product_tags(tag)
    `)
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data ? mapProductRow(data) : null;
}

// Fetch featured products
export async function fetchFeaturedProducts() {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:category_id(name, slug),
      images:product_images(url, is_thumbnail, sort_order),
      tags:product_tags(tag)
    `)
    .eq('featured', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(mapProductRow);
}

// Fetch best sellers
export async function fetchBestSellers() {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:category_id(name, slug),
      images:product_images(url, is_thumbnail, sort_order),
      tags:product_tags(tag)
    `)
    .eq('best_seller', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(mapProductRow);
}

// Fetch trending products
export async function fetchTrendingProducts() {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:category_id(name, slug),
      images:product_images(url, is_thumbnail, sort_order),
      tags:product_tags(tag)
    `)
    .eq('trending', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(mapProductRow);
}

// Fetch new arrivals
export async function fetchNewArrivals() {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:category_id(name, slug),
      images:product_images(url, is_thumbnail, sort_order),
      tags:product_tags(tag)
    `)
    .eq('new_arrival', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(mapProductRow);
}

// Fetch products by category slug
export async function fetchProductsByCategory(categorySlug) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:category_id(name, slug),
      images:product_images(url, is_thumbnail, sort_order),
      tags:product_tags(tag)
    `)
    .eq('category.slug', categorySlug)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(mapProductRow);
}

// Fetch related products (same category, excluding current product)
export async function fetchRelatedProducts(product, limit = 4) {
  if (!product?.category_id) return [];

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:category_id(name, slug),
      images:product_images(url, is_thumbnail, sort_order),
      tags:product_tags(tag)
    `)
    .eq('category_id', product.category_id)
    .neq('id', product.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []).map(mapProductRow);
}
