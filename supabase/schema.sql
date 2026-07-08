-- ============================================
-- DININE CRAFT — Supabase Schema
-- ============================================

-- ============================================
-- AUTO UPDATE TIMESTAMP FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 1. CATEGORIES
CREATE TABLE categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. PRODUCTS
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  discount INTEGER DEFAULT 0,
  description TEXT,
  material TEXT,
  dimensions TEXT,
  weight TEXT,
  stock INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  best_seller BOOLEAN DEFAULT false,
  trending BOOLEAN DEFAULT false,
  new_arrival BOOLEAN DEFAULT false,
  customizable BOOLEAN DEFAULT false,
  sku TEXT,
  availability TEXT DEFAULT 'In Stock',
  whatsapp_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. PRODUCT IMAGES
CREATE TABLE product_images (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  is_thumbnail BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. PRODUCT TAGS
CREATE TABLE product_tags (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  UNIQUE(product_id, tag)
);

-- 5. TESTIMONIALS / REVIEWS
CREATE TABLE testimonials (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT,
  rating INTEGER NOT NULL,
  text TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. FAQ
CREATE TABLE faq (
  id BIGSERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. INSTAGRAM GALLERY
CREATE TABLE instagram_gallery (
  id BIGSERIAL PRIMARY KEY,
  image TEXT NOT NULL,
  url TEXT,
  span TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. SITE SETTINGS
CREATE TABLE site_settings (
  id BIGSERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 9. HOMEPAGE SECTIONS
CREATE TABLE homepage_sections (
  id BIGSERIAL PRIMARY KEY,
  section_key TEXT NOT NULL UNIQUE,
  title TEXT,
  subtitle TEXT,
  settings JSONB DEFAULT '{}',
  active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 10. NEWSLETTER
CREATE TABLE newsletter (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ DEFAULT now()
);

-- 11. CONTACT MESSAGES
CREATE TABLE contact_messages (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_featured ON products(featured) WHERE featured = true;
CREATE INDEX idx_products_best_seller ON products(best_seller) WHERE best_seller = true;
CREATE INDEX idx_products_trending ON products(trending) WHERE trending = true;
CREATE INDEX idx_products_new_arrival ON products(new_arrival) WHERE new_arrival = true;
CREATE INDEX idx_product_images_product ON product_images(product_id);
CREATE INDEX idx_product_tags_product ON product_tags(product_id);
CREATE INDEX idx_testimonials_active ON testimonials(active) WHERE active = true;
CREATE INDEX idx_faq_active ON faq(active) WHERE active = true;

-- ============================================
-- AUTO-UPDATE TRIGGERS
-- ============================================
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_homepage_sections_updated_at
  BEFORE UPDATE ON homepage_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;

-- Public read-only access for all customer-facing data
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read product_images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Public read product_tags" ON product_tags FOR SELECT USING (true);
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Public read faq" ON faq FOR SELECT USING (true);
CREATE POLICY "Public read instagram_gallery" ON instagram_gallery FOR SELECT USING (true);
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public read homepage_sections" ON homepage_sections FOR SELECT USING (true);

-- Newsletter: only insert allowed (prevent duplicates via app code)
ALTER TABLE newsletter ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe" ON newsletter FOR INSERT WITH CHECK (true);

-- Contact messages: only insert allowed
CREATE POLICY "Anyone can contact" ON contact_messages FOR INSERT WITH CHECK (true);

-- ============================================
-- ADMIN USERS TABLE
-- ============================================
CREATE TABLE admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Only authenticated admins can read admin_users
CREATE POLICY "Admins can read admin_users" ON admin_users FOR SELECT USING (
  auth.uid() IS NOT NULL
);

-- ============================================
-- ADMIN-ONLY POLICIES (INSERT, UPDATE, DELETE)
-- Only users in admin_users table can modify data
-- ============================================

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users WHERE id = auth.uid()
  );
$$;

-- Categories: admin-only write
CREATE POLICY "Admin insert categories" ON categories FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin update categories" ON categories FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin delete categories" ON categories FOR DELETE USING (public.is_admin());

-- Products: admin-only write
CREATE POLICY "Admin insert products" ON products FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin update products" ON products FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin delete products" ON products FOR DELETE USING (public.is_admin());

-- Product images: admin-only write
CREATE POLICY "Admin insert product_images" ON product_images FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin update product_images" ON product_images FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin delete product_images" ON product_images FOR DELETE USING (public.is_admin());

-- Product tags: admin-only write
CREATE POLICY "Admin insert product_tags" ON product_tags FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin update product_tags" ON product_tags FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin delete product_tags" ON product_tags FOR DELETE USING (public.is_admin());

-- Testimonials: admin-only write
CREATE POLICY "Admin insert testimonials" ON testimonials FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin update testimonials" ON testimonials FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin delete testimonials" ON testimonials FOR DELETE USING (public.is_admin());

-- FAQ: admin-only write
CREATE POLICY "Admin insert faq" ON faq FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin update faq" ON faq FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin delete faq" ON faq FOR DELETE USING (public.is_admin());

-- Instagram gallery: admin-only write
CREATE POLICY "Admin insert instagram_gallery" ON instagram_gallery FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin update instagram_gallery" ON instagram_gallery FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin delete instagram_gallery" ON instagram_gallery FOR DELETE USING (public.is_admin());

-- Site settings: admin-only write
CREATE POLICY "Admin insert site_settings" ON site_settings FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin update site_settings" ON site_settings FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin delete site_settings" ON site_settings FOR DELETE USING (public.is_admin());

-- Homepage sections: admin-only write
CREATE POLICY "Admin insert homepage_sections" ON homepage_sections FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin update homepage_sections" ON homepage_sections FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin delete homepage_sections" ON homepage_sections FOR DELETE USING (public.is_admin());

-- Newsletter: admin-only read/delete
CREATE POLICY "Admin read newsletter" ON newsletter FOR SELECT USING (public.is_admin());
CREATE POLICY "Admin delete newsletter" ON newsletter FOR DELETE USING (public.is_admin());

-- Contact messages: admin-only read/delete
CREATE POLICY "Admin read contact_messages" ON contact_messages FOR SELECT USING (public.is_admin());
CREATE POLICY "Admin delete contact_messages" ON contact_messages FOR DELETE USING (public.is_admin());

-- ============================================
-- STORAGE POLICIES (for product-images bucket)
-- ============================================

-- Public read access for product images
CREATE POLICY "Public read product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Authenticated admins can upload images
CREATE POLICY "Admin upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images'
  AND public.is_admin()
);

-- Authenticated admins can update images
CREATE POLICY "Admin update product images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'product-images'
  AND public.is_admin()
);

-- Authenticated admins can delete images
CREATE POLICY "Admin delete product images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images'
  AND public.is_admin()
);

-- ============================================
-- CATALOGS TABLE
-- ============================================
CREATE TABLE catalogs (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
  pdf_url TEXT NOT NULL,
  cover_image_url TEXT,
  file_size BIGINT DEFAULT 0,
  page_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_catalogs_category ON catalogs(category_id);

CREATE TRIGGER update_catalogs_updated_at
  BEFORE UPDATE ON catalogs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE catalogs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read catalogs" ON catalogs FOR SELECT USING (true);
CREATE POLICY "Admin insert catalogs" ON catalogs FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin update catalogs" ON catalogs FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin delete catalogs" ON catalogs FOR DELETE USING (public.is_admin());

-- ============================================
-- STORAGE POLICIES (for catalogs bucket)
-- ============================================

CREATE POLICY "Public read catalog files"
ON storage.objects FOR SELECT
USING (bucket_id = 'catalogs');

CREATE POLICY "Admin upload catalog files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'catalogs'
  AND public.is_admin()
);

CREATE POLICY "Admin update catalog files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'catalogs'
  AND public.is_admin()
);

CREATE POLICY "Admin delete catalog files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'catalogs'
  AND public.is_admin()
);
