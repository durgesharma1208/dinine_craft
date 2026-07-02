import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';

// Asymmetric heights for masonry feel
const cardHeights = ['h-[340px]', 'h-[280px]', 'h-[320px]', 'h-[300px]', 'h-[360px]'];

export default function FeaturedCategories() {
  const { categories } = useCategories();
  return (
    <section className="py-28 relative overflow-hidden">
      {/* Background texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, transparent 0%, rgba(245,232,214,0.35) 50%, transparent 100%)',
        }}
      />

      <div className="max-w-[1320px] mx-auto px-5 sm:px-7 lg:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14"
        >
          <div>
            <span className="section-eyebrow mb-4 block">Collections</span>
            <h2 className="section-title">
              Explore Our
              <span className="block text-[#87663b] font-light italic">Artisan World</span>
            </h2>
          </div>
          <p className="section-copy lg:text-right lg:max-w-[36ch]">
            Discover handcrafted wooden decor across our curated collections, each telling
            a unique story of artistry and tradition.
          </p>
        </motion.div>

        {/* Category grid — mixed heights */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 items-end">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 36, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.6,
                delay: index * 0.09,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Link
                to={`/category/${cat.slug}`}
                className={`group block relative overflow-hidden rounded-[1.6rem] ${cardHeights[index]} grain-border`}
                style={{
                  boxShadow: '0 16px 48px rgba(40,28,15,0.1)',
                }}
              >
                {/* Image */}
                  <img
                    src={cat.image}
                    alt={`${cat.name} category`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />

                {/* Gradient overlay */}
                <div
                  className="absolute inset-0 transition-opacity duration-500"
                  style={{
                    background:
                      'linear-gradient(0deg, rgba(20,12,5,0.75) 0%, rgba(20,12,5,0.15) 50%, rgba(20,12,5,0.04) 100%)',
                  }}
                />

                {/* Hover shimmer overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(184,154,103,0.1) 0%, transparent 60%)',
                  }}
                />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  {/* Category pill */}
                  <motion.div
                    className="inline-block px-2.5 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm mb-3"
                    style={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                  >
                    <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/70">
                      {cat.name}
                    </span>
                  </motion.div>

                  <h3
                    className="text-white font-display leading-tight group-hover:text-[#e8d5b4] transition-colors duration-300"
                    style={{ fontSize: 'clamp(1.2rem, 2vw, 1.5rem)' }}
                  >
                    {cat.name}s
                  </h3>

                  <div className="flex items-center gap-2 mt-2.5">
                    <span className="text-[9.5px] uppercase tracking-[0.18em] text-white/55 font-semibold">
                      Shop Collection
                    </span>
                    <motion.span
                      className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/15 border border-white/20"
                      whileHover={{ x: 3 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowRight size={9} className="text-white/70 group-hover:text-[#b89a67] transition-colors" />
                    </motion.span>
                  </div>
                </div>

                {/* Corner accent */}
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                  <span className="text-white/70 text-[10px]">✦</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-10"
        >
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] font-bold text-[#87663b]/70 hover:text-[#87663b] transition-colors group"
          >
            View All Products
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
