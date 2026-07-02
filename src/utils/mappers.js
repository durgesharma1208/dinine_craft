/**
 * Maps a Supabase product row (with joins) to the format
 * expected by the existing UI components.
 */
export function mapProductRow(row) {
  const images =
    row.images?.length > 0
      ? row.images
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((img) => img.url)
      : [];

  const thumbnail = row.images?.find((img) => img.is_thumbnail)?.url || images[0] || '';

  const tags = row.tags?.map((t) => t.tag) || [];

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category?.name || '',
    category_id: row.category_id,
    category_slug: row.category?.slug || '',
    price: Number(row.price),
    originalPrice: Number(row.original_price) || Number(row.price),
    discount: row.discount || 0,
    description: row.description || '',
    material: row.material || '',
    dimensions: row.dimensions || '',
    weight: row.weight || '',
    stock: row.stock || 0,
    rating: row.rating || 0,
    reviews: row.review_count || 0,
    featured: row.featured || false,
    bestSeller: row.best_seller || false,
    trending: row.trending || false,
    newArrival: row.new_arrival || false,
    customizable: row.customizable || false,
    sku: row.sku || '',
    tags,
    images,
    thumbnail,
    availability: row.availability || 'In Stock',
    createdAt: row.created_at,
  };
}
