import { supabase } from '../lib/supabase';

export async function getDashboardStats() {
  const { count: totalProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  const { count: totalCategories } = await supabase
    .from('categories')
    .select('*', { count: 'exact', head: true });

  const { count: totalOrders } = await supabase
    .from('contact_messages')
    .select('*', { count: 'exact', head: true });

  const { count: totalSubscribers } = await supabase
    .from('newsletter')
    .select('*', { count: 'exact', head: true });

  const { data: lowStock } = await supabase
    .from('products')
    .select('id')
    .lte('stock', 3);

  const { data: recentProducts } = await supabase
    .from('products')
    .select('id, name, price, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  return {
    totalProducts: totalProducts || 0,
    totalCategories: totalCategories || 0,
    totalOrders: totalOrders || 0,
    totalSubscribers: totalSubscribers || 0,
    lowStockCount: lowStock?.length || 0,
    recentProducts: recentProducts || [],
  };
}

export async function getProductCountByCategory() {
  const { data, error } = await supabase
    .from('products')
    .select('category_id, category:category_id(name)');

  if (error) return [];
  const map = {};
  data.forEach((p) => {
    const name = p.category?.name || 'Uncategorized';
    map[name] = (map[name] || 0) + 1;
  });
  return Object.entries(map).map(([name, count]) => ({ name, count }));
}

export async function getRevenueData() {
  const { data, error } = await supabase
    .from('products')
    .select('price, created_at')
    .order('created_at');

  if (error) return [];
  const monthly = {};
  data.forEach((p) => {
    const month = p.created_at?.slice(0, 7);
    if (month) monthly[month] = (monthly[month] || 0) + Number(p.price);
  });
  return Object.entries(monthly).map(([month, revenue]) => ({ month, revenue }));
}

export async function createProduct(productData) {
  const { images, tags, ...productFields } = productData;

  const { data: product, error } = await supabase
    .from('products')
    .insert({
      name: productFields.name,
      slug: productFields.slug,
      category_id: productFields.category_id,
      price: productFields.price,
      original_price: productFields.original_price || null,
      discount: productFields.discount || 0,
      description: productFields.description || '',
      material: productFields.material || '',
      dimensions: productFields.dimensions || '',
      weight: productFields.weight || '',
      stock: productFields.stock || 0,
      sku: productFields.sku || '',
      featured: productFields.featured || false,
      best_seller: productFields.best_seller || false,
      trending: productFields.trending || false,
      new_arrival: productFields.new_arrival || false,
      customizable: productFields.customizable || false,
      availability: productFields.availability || 'In Stock',
    })
    .select()
    .single();

  if (error) throw error;

  if (images && images.length > 0) {
    const imageRows = images.map((img, i) => ({
      product_id: product.id,
      url: img.url,
      is_thumbnail: img.is_thumbnail || i === 0,
      sort_order: i,
    }));
    const { error: imgError } = await supabase
      .from('product_images')
      .insert(imageRows);
    if (imgError) throw imgError;
  }

  if (tags && tags.length > 0) {
    const tagRows = tags.map((tag) => ({
      product_id: product.id,
      tag: tag.trim(),
    }));
    const { error: tagError } = await supabase
      .from('product_tags')
      .insert(tagRows);
    if (tagError) throw tagError;
  }

  return product;
}

export async function updateProduct(id, productData) {
  const { images, tags, ...productFields } = productData;

  const { error } = await supabase
    .from('products')
    .update({
      name: productFields.name,
      slug: productFields.slug,
      category_id: productFields.category_id,
      price: productFields.price,
      original_price: productFields.original_price || null,
      discount: productFields.discount || 0,
      description: productFields.description || '',
      material: productFields.material || '',
      dimensions: productFields.dimensions || '',
      weight: productFields.weight || '',
      stock: productFields.stock || 0,
      sku: productFields.sku || '',
      featured: productFields.featured || false,
      best_seller: productFields.best_seller || false,
      trending: productFields.trending || false,
      new_arrival: productFields.new_arrival || false,
      customizable: productFields.customizable || false,
      availability: productFields.availability || 'In Stock',
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) throw error;

  await supabase.from('product_images').delete().eq('product_id', id);
  await supabase.from('product_tags').delete().eq('product_id', id);

  if (images && images.length > 0) {
    const imageRows = images.map((img, i) => ({
      product_id: id,
      url: img.url,
      is_thumbnail: img.is_thumbnail || i === 0,
      sort_order: i,
    }));
    const { error: imgError } = await supabase
      .from('product_images')
      .insert(imageRows);
    if (imgError) throw imgError;
  }

  if (tags && tags.length > 0) {
    const tagRows = tags.map((tag) => ({
      product_id: id,
      tag: tag.trim(),
    }));
    const { error: tagError } = await supabase
      .from('product_tags')
      .insert(tagRows);
    if (tagError) throw tagError;
  }

  return true;
}

export async function deleteProduct(id) {
  const { data: images } = await supabase
    .from('product_images')
    .select('url')
    .eq('product_id', id);

  if (images) {
    for (const img of images) {
      const path = extractStoragePath(img.url);
      if (path) {
        await supabase.storage.from('product-images').remove([path]).catch(() => {});
      }
    }
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

export async function createCategory(data) {
  const { error } = await supabase
    .from('categories')
    .insert({
      name: data.name,
      slug: data.slug,
      description: data.description || '',
      image: data.image || '',
    });
  if (error) throw error;
  return true;
}

export async function updateCategory(id, data) {
  const { error } = await supabase
    .from('categories')
    .update({
      name: data.name,
      slug: data.slug,
      description: data.description || '',
      image: data.image || '',
    })
    .eq('id', id);
  if (error) throw error;
  return true;
}

export async function deleteCategory(id) {
  const { data: products } = await supabase
    .from('products')
    .select('id')
    .eq('category_id', id)
    .limit(1);

  if (products && products.length > 0) {
    throw new Error('Cannot delete category with existing products. Reassign products first.');
  }

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
}

export async function duplicateProduct(id) {
  const { data: original } = await supabase
    .from('products')
    .select('*, product_images(*), product_tags(*)')
    .eq('id', id)
    .single();

  if (!original) throw new Error('Product not found');

  const { data: newProduct, error } = await supabase
    .from('products')
    .insert({
      name: `${original.name} (Copy)`,
      slug: `${original.slug}-copy-${Date.now()}`,
      category_id: original.category_id,
      price: original.price,
      original_price: original.original_price,
      discount: original.discount,
      description: original.description,
      material: original.material,
      dimensions: original.dimensions,
      weight: original.weight,
      stock: original.stock,
      sku: original.sku ? `${original.sku}-COPY` : '',
      featured: false,
      best_seller: false,
      trending: false,
      new_arrival: false,
      customizable: original.customizable,
      availability: original.availability,
    })
    .select()
    .single();

  if (error) throw error;

  if (original.product_images?.length > 0) {
    const imgRows = original.product_images.map((img, i) => ({
      product_id: newProduct.id,
      url: img.url,
      is_thumbnail: img.is_thumbnail,
      sort_order: i,
    }));
    await supabase.from('product_images').insert(imgRows);
  }

  if (original.product_tags?.length > 0) {
    const tagRows = original.product_tags.map((t) => ({
      product_id: newProduct.id,
      tag: t.tag,
    }));
    await supabase.from('product_tags').insert(tagRows);
  }

  return newProduct;
}

function extractStoragePath(url) {
  const bucket = 'product-images';
  const idx = url.indexOf(`/storage/v1/object/public/${bucket}/`);
  if (idx === -1) return null;
  return url.split(`/storage/v1/object/public/${bucket}/`)[1];
}

export async function updateSiteSetting(key, value) {
  const { error } = await supabase
    .from('site_settings')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  if (error) throw error;
  return true;
}

export async function getSiteSettings() {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*');
  if (error) throw error;
  const settings = {};
  (data || []).forEach((s) => { settings[s.key] = s.value; });
  return settings;
}

export async function updateHomepageSection(sectionKey, data) {
  const { error } = await supabase
    .from('homepage_sections')
    .upsert(
      { section_key: sectionKey, ...data, updated_at: new Date().toISOString() },
      { onConflict: 'section_key' }
    );
  if (error) throw error;
  return true;
}

export async function getHomepageSections() {
  const { data, error } = await supabase
    .from('homepage_sections')
    .select('*')
    .order('sort_order');
  if (error) throw error;
  return data || [];
}

export async function createTestimonial(data) {
  const { error } = await supabase.from('testimonials').insert(data);
  if (error) throw error;
  return true;
}

export async function updateTestimonial(id, data) {
  const { error } = await supabase.from('testimonials').update(data).eq('id', id);
  if (error) throw error;
  return true;
}

export async function deleteTestimonial(id) {
  const { error } = await supabase.from('testimonials').delete().eq('id', id);
  if (error) throw error;
  return true;
}

export async function createFAQ(data) {
  const { error } = await supabase.from('faq').insert(data);
  if (error) throw error;
  return true;
}

export async function updateFAQ(id, data) {
  const { error } = await supabase.from('faq').update(data).eq('id', id);
  if (error) throw error;
  return true;
}

export async function deleteFAQ(id) {
  const { error } = await supabase.from('faq').delete().eq('id', id);
  if (error) throw error;
  return true;
}
