/**
 * Migration script: products.json → Supabase
 *
 * Usage:
 *   1. Copy .env.example → .env and fill in your Supabase credentials
 *   2. Run: node scripts/migrate-to-supabase.js
 *
 * This script:
 *   - Creates categories from product data
 *   - Inserts all products
 *   - Inserts product images
 *   - Inserts product tags
 *   - Seeds testimonials, FAQ, instagram gallery, site settings
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '..', '.env');

// Load .env manually
const envFile = readFileSync(envPath, 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, ...rest] = line.split('=');
  if (key && rest.length) env[key.trim()] = rest.join('=').trim();
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('ERROR: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Read products.json
const productsPath = resolve(__dirname, '..', 'src', 'data', 'products.json');
const products = JSON.parse(readFileSync(productsPath, 'utf-8'));

async function migrate() {
  console.log('Starting migration...\n');

  // ---- 1. Categories ----
  console.log('Creating categories...');
  const categoryMap = {};
  const uniqueCategories = [...new Set(products.map(p => p.category))];

  for (const name of uniqueCategories) {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const { data, error } = await supabase
      .from('categories')
      .upsert({ name, slug, description: `${name}s collection` }, { onConflict: 'slug' })
      .select()
      .single();

    if (error) {
      console.error(`  Failed to create category "${name}":`, error.message);
    } else {
      categoryMap[name] = data.id;
      console.log(`  ✓ ${name} → id ${data.id}`);
    }
  }

  // ---- 2. Products ----
  console.log('\nInserting products...');
  for (const p of products) {
    const { data, error } = await supabase
      .from('products')
      .upsert({
        slug: p.slug,
        name: p.name,
        category_id: categoryMap[p.category] || null,
        price: p.price,
        original_price: p.originalPrice,
        discount: p.discount || 0,
        description: p.description,
        material: p.material,
        dimensions: p.dimensions,
        weight: p.weight,
        stock: p.stock,
        rating: p.rating,
        review_count: p.reviews || p.review_count || 0,
        featured: p.featured || false,
        best_seller: p.bestSeller || false,
        trending: p.trending || false,
        new_arrival: p.newArrival || false,
        customizable: p.customizable || false,
        sku: p.sku,
        availability: p.availability || 'In Stock',
        whatsapp_message: p.whatsappMessage || '',
      }, { onConflict: 'slug' })
      .select()
      .single();

    if (error) {
      console.error(`  ✗ Failed "${p.name}": ${error.message}`);
      continue;
    }
    console.log(`  ✓ ${p.name}`);

    // ---- 3. Product Images ----
    const images = p.images || [];
    const allImages = p.thumbnail ? [p.thumbnail, ...images.filter(i => i !== p.thumbnail)] : images;

    // Remove old images first
    await supabase.from('product_images').delete().eq('product_id', data.id);

    const imageRows = allImages.map((url, i) => ({
      product_id: data.id,
      url,
      is_thumbnail: i === 0,
      sort_order: i,
    }));

    const { error: imgErr } = await supabase.from('product_images').insert(imageRows);
    if (imgErr) console.error(`    Image insert error: ${imgErr.message}`);

    // ---- 4. Product Tags ----
    if (p.tags && p.tags.length) {
      await supabase.from('product_tags').delete().eq('product_id', data.id);
      const tagRows = p.tags.map(tag => ({ product_id: data.id, tag }));
      const { error: tagErr } = await supabase.from('product_tags').insert(tagRows);
      if (tagErr) console.error(`    Tag insert error: ${tagErr.message}`);
    }
  }

  // ---- 5. Testimonials ----
  console.log('\nSeeding testimonials...');
  const testimonials = [
    { name: 'Priya Sharma', location: 'Mumbai', rating: 5, text: 'Absolutely love the elephant keyholder! The craftsmanship is outstanding and it looks beautiful in my entryway.' },
    { name: 'Rahul Verma', location: 'Delhi', rating: 5, text: 'Ordered the geometric wall hanging for my living room. It exceeded my expectations.' },
    { name: 'Ananya Patel', location: 'Bangalore', rating: 5, text: 'The fridge magnet set is so cute! Great quality and the colors are vibrant.' },
    { name: 'Vikram Singh', location: 'Jaipur', rating: 4, text: 'Bought the mandala table stand as a gift. The carving is detailed and it serves perfectly.' },
    { name: 'Neha Gupta', location: 'Pune', rating: 5, text: 'The tree of life wall decor is stunning! The centerpiece of our living room.' },
    { name: 'Arun Kumar', location: 'Chennai', rating: 5, text: 'The quality is always consistent. Great customer service too.' },
  ];

  for (const t of testimonials) {
    const { error } = await supabase.from('testimonials').insert(t);
    if (error) console.error(`  ✗ Testimonial: ${error.message}`);
    else console.log(`  ✓ ${t.name}`);
  }

  // ---- 6. FAQ ----
  console.log('\nSeeding FAQ...');
  const faqs = [
    { question: 'What materials do you use?', answer: 'We primarily use premium quality hardwoods like mango wood, sheesham wood, acacia, teak, and walnut. All our wood is sustainably sourced.' },
    { question: 'How long does shipping take?', answer: 'We ship across India. Standard delivery takes 5-7 business days. Express shipping (2-3 days) is available.' },
    { question: 'Can I customize a product?', answer: 'Yes! Many of our products can be customized with names, dates, or specific designs. Look for the "Customizable" badge on product pages.' },
    { question: 'What is your return policy?', answer: 'We offer a 7-day easy return policy. Items must be unused and in original packaging.' },
    { question: 'Are your products eco-friendly?', answer: 'Absolutely. We use sustainably sourced wood, natural finishes, and eco-friendly packaging.' },
    { question: 'Do you offer bulk or corporate orders?', answer: 'Yes, we cater to bulk orders for corporate gifting, events, and weddings.' },
    { question: 'How should I care for wooden products?', answer: 'Keep away from direct sunlight and moisture. Dust regularly with a soft cloth. Apply natural wood oil occasionally.' },
    { question: 'Is COD available?', answer: 'Yes, we offer Cash on Delivery across all serviceable pin codes in India.' },
  ];

  for (const faq of faqs) {
    const { error } = await supabase.from('faq').insert(faq);
    if (error) console.error(`  ✗ FAQ: ${error.message}`);
    else console.log(`  ✓ ${faq.question.substring(0, 40)}...`);
  }

  // ---- 7. Instagram Gallery ----
  console.log('\nSeeding Instagram gallery...');
  const galleryImages = [
    { image: 'https://images.unsplash.com/photo-1773660111368-1f87eb7cd483?w=500&q=80', span: 'row-span-2', sort_order: 0 },
    { image: 'https://images.unsplash.com/photo-1778034758279-58be4e75f628?w=500&q=80', span: '', sort_order: 1 },
    { image: 'https://images.unsplash.com/photo-1775595224305-cf7d4487123d?w=500&q=80', span: '', sort_order: 2 },
    { image: 'https://images.unsplash.com/photo-1775029918420-1f89b9bcfc0e?w=500&q=80', span: '', sort_order: 3 },
    { image: 'https://images.unsplash.com/photo-1770731959852-b3b309d9104e?w=500&q=80', span: '', sort_order: 4 },
    { image: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=500&q=80', span: '', sort_order: 5 },
    { image: 'https://images.unsplash.com/photo-1758366278217-0d58bf8c7107?w=500&q=80', span: '', sort_order: 6 },
  ];

  for (const img of galleryImages) {
    const { error } = await supabase.from('instagram_gallery').insert(img);
    if (error) console.error(`  ✗ Gallery image: ${error.message}`);
    else console.log(`  ✓ Image ${img.sort_order + 1}`);
  }

  console.log('\n Migration complete!');
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
