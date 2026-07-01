import { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp } from 'lucide-react';
import Fuse from 'fuse.js';
import productsData from '../../data/products.json';
import { formatPrice } from '../../utils/helpers';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const fuse = useMemo(() => new Fuse(productsData, {
    keys: [
      { name: 'name', weight: 2 },
      { name: 'category', weight: 1.5 },
      { name: 'material', weight: 1 },
      { name: 'tags', weight: 1.5 },
      { name: 'sku', weight: 2 },
    ],
    threshold: 0.35,
    includeScore: true,
  }), []);

  const results = useMemo(() => {
    if (!query.trim()) return productsData.slice(0, 6);
    return fuse.search(query).map(r => r.item).slice(0, 8);
  }, [query, fuse]);

  const highlightMatch = (text) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? <span key={i} className="text-primary font-medium">{part}</span> : part
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white shadow-2xl"
          >
            <div className="max-w-3xl mx-auto px-4 py-5">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products, categories, materials..."
                  className="w-full pl-11 pr-11 py-3.5 text-base border-b-2 border-primary/30 bg-transparent focus:outline-none focus:border-primary"
                />
                <button onClick={onClose} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-cream/50 rounded-full transition-colors">
                  <X size={18} className="text-gray-300" />
                </button>
              </div>

              <div className="mt-5 max-h-[60vh] overflow-y-auto">
                {results.length === 0 ? (
                  <div className="text-center py-12">
                    <Search size={36} className="mx-auto text-gray-200 mb-3" />
                    <p className="text-gray-400 text-sm">No products found for "<span className="text-charcoal">{query}</span>"</p>
                    <p className="text-xs text-gray-300 mt-1">Try different keywords</p>
                  </div>
                ) : (
                  <>
                    {!query.trim() && (
                      <div className="flex items-center gap-1.5 mb-3 text-xs text-gray-400">
                        <TrendingUp size={13} /> Trending Products
                      </div>
                    )}
                    <div className="grid gap-2">
                      {results.map(product => (
                        <Link key={product.id} to={`/product/${product.slug}`} onClick={onClose}
                          className="flex items-center gap-4 p-3 rounded-xl hover:bg-cream/50 transition-colors group"
                        >
                          <img src={product.thumbnail} alt={product.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0 bg-cream" loading="lazy" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-charcoal group-hover:text-primary transition-colors truncate">
                              {highlightMatch(product.name)}
                            </p>
                            <p className="text-[11px] text-gray-400 mt-0.5">{product.category} · {product.material}</p>
                            <p className="text-sm font-semibold text-primary mt-0.5">{formatPrice(product.price)}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
