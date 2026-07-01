import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import { useWishlistContext } from '../contexts/WishlistContext';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/product/ProductCard';
import Breadcrumbs from '../components/ui/Breadcrumbs';

export default function Wishlist() {
  const { wishlist, clearWishlist } = useWishlistContext();
  const { allProducts } = useProducts();
  const wishlistProducts = allProducts.filter(p => wishlist.includes(p.id));

  return (
    <>
      <Helmet>
        <title>My Wishlist — Dinine Craft</title>
        <meta name="description" content="View your saved items at Dinine Craft" />
        <link rel="canonical" href="https://dininecraft.com/wishlist" />
      </Helmet>

      <div className="pt-[72px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Wishlist' }]} />
        </div>
      </div>

      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center gap-3">
              <Heart size={24} className="text-primary/60" />
              <div>
                <h1 className="text-2xl md:text-3xl font-display text-charcoal">My Wishlist</h1>
                <p className="text-xs text-gray-400 mt-0.5">{wishlist.length} items saved</p>
              </div>
            </div>
            {wishlist.length > 0 && (
              <button onClick={clearWishlist} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-500 hover:bg-rose-50 rounded-full transition-colors">
                <Trash2 size={13} /> Clear All
              </button>
            )}
          </motion.div>

          {wishlistProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-cream/50 flex items-center justify-center">
                <Heart size={32} className="text-gray-300" />
              </div>
              <h2 className="text-xl font-display text-charcoal mb-2">Your wishlist is empty</h2>
              <p className="text-gray-400 text-sm mb-6">Save your favorite items here to order later!</p>
              <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-all text-sm shadow-[0_4px_14px_rgba(139,105,20,0.25)]">
                <ShoppingBag size={16} /> Start Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {wishlistProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
