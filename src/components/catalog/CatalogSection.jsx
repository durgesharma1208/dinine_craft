import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchCatalogs, fetchCatalogsByCategory } from '../../services/catalogService';
import CatalogCard from './CatalogCard';

export default function CatalogSection({ categoryId, categoryName, categorySlug, showAll }) {
  const [catalogs, setCatalogs] = useState([]);

  useEffect(() => {
    let mounted = true;
    if (showAll) {
      fetchCatalogs()
        .then(data => { if (mounted) setCatalogs(data || []); })
        .catch(() => {});
    } else if (categoryId) {
      fetchCatalogsByCategory(categoryId)
        .then(data => { if (mounted) setCatalogs(data || []); })
        .catch(() => {});
    }
    return () => { mounted = false; };
  }, [categoryId, showAll]);

  if (catalogs.length === 0) return null;

  const displayCatalogs = showAll ? catalogs : catalogs.slice(0, 4);
  const hasMore = !showAll && catalogs.length > 4;

  return (
    <section id="catalogs" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#87663b]/[0.03] to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-between mb-10"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#87663b]/10 flex items-center justify-center">
              <BookOpen size={20} className="text-[#87663b]" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#87663b]/60">Catalogs & Brochures</span>
              <h2 className="font-display text-2xl text-[#28221a] font-semibold -mt-0.5">
                {categoryName ? `${categoryName} Catalogs` : 'Browse Our Catalogs'}
              </h2>
              <p className="text-sm text-gray-400 mt-0.5">View and download product catalogs, lookbooks, and brochures</p>
            </div>
          </div>
          {hasMore && categorySlug && (
            <Link
              to={`/category/${categorySlug}?show=catalogs`}
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-[#87663b] hover:text-primary transition-colors"
            >
              View All <ChevronRight size={14} />
            </Link>
          )}
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayCatalogs.map((catalog, i) => (
            <CatalogCard key={catalog.id} catalog={catalog} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
