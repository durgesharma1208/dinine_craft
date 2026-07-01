import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import ProductCard from './ProductCard';
import { useProducts } from '../../hooks/useProducts';
import { useRecentlyViewed } from '../../hooks/useRecentlyViewed';

export default function RecentlyViewed() {
  const { allProducts } = useProducts();
  const { getRecentlyViewed } = useRecentlyViewed();
  const products = getRecentlyViewed(allProducts);

  if (products.length === 0) return null;

  return (
    <section className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-2 mb-6"
      >
        <Clock size={18} className="text-primary/60" />
        <h2 className="text-xl font-display text-charcoal">Recently Viewed</h2>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </section>
  );
}
