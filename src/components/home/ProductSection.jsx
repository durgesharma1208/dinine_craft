import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import ProductCard from '../product/ProductCard';

const sectionConfig = {
  featured: {
    title: 'Featured Products',
    headline: 'Our Finest Pieces',
    subtitle: 'Handpicked creations our customers love most',
    eyebrow: 'Featured Collection',
    accent: '#87663b',
  },
  bestSeller: {
    title: 'Best Sellers',
    headline: 'Customer Favorites',
    subtitle: 'Beloved pieces flying off our workshop shelves',
    eyebrow: 'Best Sellers',
    accent: '#a0702e',
  },
  trending: {
    title: 'Trending Now',
    headline: "What's Popular",
    subtitle: 'Pieces everyone is talking about this season',
    eyebrow: 'Trending',
    accent: '#7a5534',
  },
  newArrival: {
    title: 'New Arrivals',
    headline: 'Fresh From Workshop',
    subtitle: 'The latest creations from our artisan studio',
    eyebrow: 'Just Arrived',
    accent: '#6b4b2a',
  },
};

export default function ProductSection({ filterKey }) {
  const { featured, bestSellers, trending, newArrivals } = useProducts();
  const scrollRef = useRef(null);

  const productsMap = {
    featured,
    bestSeller: bestSellers,
    trending,
    newArrival: newArrivals,
  };
  const products = productsMap[filterKey] || [];
  const config = sectionConfig[filterKey] || sectionConfig.featured;

  if (products.length === 0) return null;

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 relative">
      {/* Subtle section bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 20% 50%, rgba(135,102,59,0.03) 0%, transparent 60%)`,
        }}
      />

      <div className="max-w-[1320px] mx-auto px-5 sm:px-7 lg:px-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-end justify-between mb-10 gap-6"
        >
          <div className="flex-1">
            <span className="section-eyebrow mb-3 block">{config.eyebrow}</span>
            <h2
              className="font-display text-[#28221a] leading-[0.98] tracking-tight"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
            >
              {config.headline}
            </h2>
            <p className="text-[#5a4f43]/70 text-sm mt-2.5 max-w-[40ch]">
              {config.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Scroll controls */}
            <div className="hidden md:flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scroll('left')}
                className="w-10 h-10 rounded-full border border-[#c9a177]/30 bg-white/70 flex items-center justify-center text-[#87663b]/60 hover:border-[#87663b]/50 hover:text-[#87663b] hover:bg-white transition-all shadow-sm focus-luxury"
              >
                <ChevronLeft size={16} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scroll('right')}
                className="w-10 h-10 rounded-full border border-[#c9a177]/30 bg-white/70 flex items-center justify-center text-[#87663b]/60 hover:border-[#87663b]/50 hover:text-[#87663b] hover:bg-white transition-all shadow-sm focus-luxury"
              >
                <ChevronRight size={16} />
              </motion.button>
            </div>
            <Link
              to="/shop"
              className="hidden md:flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] font-bold text-[#87663b]/65 hover:text-[#87663b] transition-colors group"
            >
              View All
              <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {/* Horizontal scroll track */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scrollbar-hide pb-5 -mx-5 px-5 snap-x snap-mandatory"
          style={{ scrollPaddingLeft: '20px' }}
        >
          {products.slice(0, 8).map((product, i) => (
            <div key={product.id} className="shrink-0 w-[270px] md:w-[290px] snap-start">
              <ProductCard product={product} index={i} />
            </div>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-7 text-center md:hidden">
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] font-bold text-[#87663b] group"
          >
            View All {config.title}
            <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
