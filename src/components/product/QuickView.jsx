import { motion } from 'framer-motion';
import { X, Heart } from 'lucide-react';
import { formatPrice, getStockStatus } from '../../utils/helpers';
import { useWishlistContext } from '../../contexts/WishlistContext';
import Badge from '../ui/Badge';
import WhatsAppButton from '../ui/WhatsAppButton';
import { getOrderMessage } from '../../utils/whatsapp';

export default function QuickView({ product, isOpen, onClose }) {
  const { isInWishlist, toggleWishlist } = useWishlistContext();
  if (!product) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpen ? 1 : 0 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={isOpen ? { scale: 1, opacity: 1, y: 0 } : { scale: 0.92, opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="sticky top-0 bg-white/90 backdrop-blur-sm z-10 flex items-center justify-between p-5 border-b border-gray-100 rounded-t-3xl">
          <h3 className="font-display text-base font-semibold">Quick View</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-cream rounded-full transition-colors"><X size={18} /></button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 p-6">
          <div className="rounded-2xl overflow-hidden bg-cream/50">
            <img src={product.thumbnail} alt={product.name} className="w-full aspect-square object-cover" loading="lazy" onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1612152661182-8d6c5e568c94?w=400&q=80"; }} />
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {product.discount > 0 && <Badge variant="sale">-{product.discount}%</Badge>}
                {product.newArrival && <Badge variant="new">New</Badge>}
              </div>
              <p className="text-[10px] text-primary/60 uppercase tracking-[0.15em] font-semibold">{product.category}</p>
              <h2 className="text-lg font-display font-semibold text-charcoal mt-1">{product.name}</h2>
              <div className="flex items-center gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-amber-400' : 'text-gray-200'}`} viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-xs text-gray-400 ml-1">({product.reviews})</span>
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-charcoal">{formatPrice(product.price)}</span>
              {product.originalPrice > product.price && <span className="text-sm text-gray-300 line-through">{formatPrice(product.originalPrice)}</span>}
            </div>

            <p className={`text-xs font-medium ${getStockStatus(product.stock, product.availability).color}`}>
              {getStockStatus(product.stock, product.availability).label}
            </p>

            <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed">{product.description}</p>

            <div className="space-y-2">
              <a href={`/product/${product.slug}`} className="block text-center py-3 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-colors text-sm">View Full Details</a>
              <WhatsAppButton message={getOrderMessage(product)} label="Order on WhatsApp" variant="secondary" size="md" className="w-full justify-center" />
            </div>

            <button onClick={() => toggleWishlist(product.id)}
              className={`w-full text-center py-2.5 rounded-full border text-sm transition-all flex items-center justify-center gap-2 ${isInWishlist(product.id) ? 'border-rose-200 text-rose-500 bg-rose-50' : 'border-gray-200 text-gray-500 hover:border-primary hover:text-primary'}`}
            >
              <Heart size={14} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
              {isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
