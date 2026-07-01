import { motion } from 'framer-motion';
import { useProducts } from '../../hooks/useProducts';
import ProductCard from './ProductCard';

export default function RelatedProducts({ product, limit = 4 }) {
  const { getRelatedProducts } = useProducts();
  const related = getRelatedProducts(product, limit);

  if (related.length === 0) return null;

  return (
    <section className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8"
      >
        <h2 className="text-xl md:text-2xl font-display text-charcoal">Related Products</h2>
        <p className="text-gray-400 text-sm mt-1">You might also like these</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {related.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  );
}
