import { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';
import { generateProductJsonLd, generateBreadcrumbJsonLd } from '../utils/seo';
import { SITE_URL } from '../utils/siteUrl';
import ProductGallery from '../components/product/ProductGallery';
import ProductInfo from '../components/product/ProductInfo';
import RelatedProducts from '../components/product/RelatedProducts';
import RecentlyViewed from '../components/product/RecentlyViewed';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import TrustBadges from '../components/ui/TrustBadges';

export default function ProductDetail() {
  const { slug } = useParams();
  const { getProductBySlug } = useProducts();
  const { addToRecentlyViewed } = useRecentlyViewed();
  const hasAddedToRecent = useRef(false); // ← Track करने के लिए

  const product = getProductBySlug[slug];

  // Recently viewed add करने के लिए
  useEffect(() => {
    if (product && !hasAddedToRecent.current) {
      addToRecentlyViewed(product.id);
      hasAddedToRecent.current = true;
    }
  }, [product?.id, addToRecentlyViewed]);

  // Scroll top के लिए अलग effect
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Slug change होने पर ref reset करें
  useEffect(() => {
    hasAddedToRecent.current = false;
  }, [slug]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-4xl font-display text-charcoal mb-4">Product Not Found</h1>
          <p className="text-gray-400 text-sm mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Link to="/shop" className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-medium text-sm">
            <ArrowLeft size={15} /> Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: product.category, to: `/category/${product.category.toLowerCase().replace(/\s+/g, '-')}` },
    { label: product.name },
  ];

  return (
    <>
      <Helmet>
        <title>{product.name} — Dinine Craft</title>
        <meta name="description" content={product.description.slice(0, 160)} />
        <meta property="og:title" content={`${product.name} — Dinine Craft`} />
        <meta property="og:description" content={product.description.slice(0, 160)} />
        <meta property="og:image" content={product.images?.[0] || product.thumbnail} />
        <meta property="og:type" content="product" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${product.name} — Dinine Craft`} />
        <meta name="twitter:image" content={product.images?.[0] || product.thumbnail} />
        <link rel="canonical" href={`${SITE_URL}/product/${product.slug}`} />
        <script type="application/ld+json">{JSON.stringify(generateProductJsonLd(product))}</script>
        <script type="application/ld+json">{JSON.stringify(generateBreadcrumbJsonLd(breadcrumbItems.map((item) => ({
          name: item.label,
          url: item.to ? `${SITE_URL}${item.to}` : `${SITE_URL}/product/${product.slug}`,
        }))))}</script>
      </Helmet>

      <div className="pt-[72px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
              <ProductGallery images={product.images} name={product.name} />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
              <ProductInfo product={product} />
            </motion.div>
          </div>

          <TrustBadges />
          <RelatedProducts product={product} />
          <RecentlyViewed />
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-100 p-3 lg:hidden z-40 shadow-[0_-4px_30px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <p className="text-xs text-gray-500 line-clamp-1">{product.name}</p>
            <p className="text-base font-bold text-primary mt-0.5">{'₹' + product.price.toLocaleString('en-IN')}</p>
          </div>
          <a href={`https://wa.me/9664209836?text=${encodeURIComponent(`Hello Dinine Craft,%0aI want to order: ${product.name} (₹${product.price})%0aProduct: ${SITE_URL}/product/${product.slug}%0a%0aPlease share more details.`)}`} target="_blank" rel="noopener noreferrer"
            className="px-6 py-3 bg-emerald-500 text-white rounded-full font-medium text-sm hover:bg-emerald-600 transition-all shadow-[0_4px_14px_rgba(16,185,129,0.25)] flex items-center gap-2"
          >
            Order on WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}