import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import { NAV_LINKS, CATEGORIES } from '../../utils/constants';
import { useWishlistContext } from '../../contexts/WishlistContext';

export default function Navbar({ onSearchOpen }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { pathname } = useLocation();
  const { wishlist } = useWishlistContext();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.removeProperty('overflow');
    }
    return () => document.body.style.removeProperty('overflow');
  }, [mobileOpen]);

  const isActive = useCallback(
    (path) => (path === '/' ? pathname === '/' : pathname.startsWith(path)),
    [pathname],
  );

  const catImages = {
    keyholder: 'https://images.unsplash.com/photo-1612152661182-8d6c5e568c94?w=80&q=70',
    'wall-hanging': 'https://images.unsplash.com/photo-1776335907846-3ed1a76b8529?w=80&q=70',
    'fridge-magnet': 'https://images.unsplash.com/photo-1759523091199-14f987919622?w=80&q=70',
    'table-stand': 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=80&q=70',
    'wall-decor': 'https://images.unsplash.com/photo-1758366278217-0d58bf8c7107?w=80&q=70',
  };

  return (
    <>
      <motion.header
        initial={false}
        animate={scrolled ? 'scrolled' : 'top'}
        variants={{
          top: {
            backgroundColor: 'rgba(253,250,245,0)',
            backdropFilter: 'blur(0px)',
            borderBottomColor: 'rgba(135,102,59,0)',
            height: 80,
          },
          scrolled: {
            backgroundColor: 'rgba(253,250,245,0.88)',
            backdropFilter: 'blur(24px) saturate(180%)',
            borderBottomColor: 'rgba(135,102,59,0.1)',
            height: 66,
          },
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-9 left-0 right-0 z-50 border-b"
        style={{ top: 36 }}
      >
        <div className="max-w-[1320px] mx-auto px-5 sm:px-7 lg:px-10 h-full flex items-center justify-between gap-6">

          {/* Mobile menu toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 -ml-1 text-[#28221a]/70 hover:text-[#87663b] transition-colors focus-luxury rounded-xl"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {mobileOpen ? (
                <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <X size={20} />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Menu size={20} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Logo */}
          <Link to="/" className="flex items-baseline gap-1.5 group shrink-0">
            <span
              className="text-[1.65rem] font-display font-semibold text-[#87663b] tracking-[-0.02em] leading-none"
            >
              Dinine
            </span>
            <span className="text-[1.65rem] font-display font-light text-[#28221a]/75 tracking-[-0.02em] leading-none">
              Craft
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#b89a67] mb-1 opacity-80 group-hover:animate-pulse-soft" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5 bg-white/50 border border-white/65 rounded-full px-2 py-1.5 shadow-[0_6px_20px_rgba(40,30,15,0.07)]">
            {NAV_LINKS.slice(0, 2).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 text-[11.5px] uppercase tracking-[0.13em] font-semibold rounded-full transition-colors duration-200 ${
                  isActive(link.path) ? 'text-[#87663b]' : 'text-[#28221a]/60 hover:text-[#28221a]'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 -z-10 bg-gradient-to-b from-[#87663b]/14 to-[#87663b]/5 rounded-full border border-[#87663b]/14"
                  />
                )}
              </Link>
            ))}

            {/* Categories dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button
                className={`flex items-center gap-1.5 px-4 py-2 text-[11.5px] uppercase tracking-[0.13em] font-semibold rounded-full transition-colors duration-200 ${
                  isActive('/category') ? 'text-[#87663b]' : 'text-[#28221a]/60 hover:text-[#28221a]'
                }`}
              >
                Shop
                <ChevronDown
                  size={11}
                  className={`transition-transform duration-300 ${dropdownOpen ? 'rotate-180 text-[#87663b]' : ''}`}
                />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-72 rounded-2xl overflow-hidden shadow-[0_24px_60px_rgba(40,25,10,0.16)] border border-[#c9a177]/14 bg-[#fffdf9]/96 backdrop-blur-2xl"
                  >
                    <div className="px-3 pt-3 pb-2">
                      <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#87663b]/55 px-2 mb-2">Collections</p>
                      {CATEGORIES.map((cat) => (
                        <Link
                          key={cat.slug}
                          to={`/category/${cat.slug}`}
                          className="flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-sm text-[#28221a]/70 hover:text-[#28221a] hover:bg-[#f5e8d6]/70 transition-all group"
                        >
                          <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 border border-[#c9a177]/20">
                            <img
                              src={catImages[cat.slug]}
                              alt={cat.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-[13px] text-[#28221a]">{cat.name}s</p>
                            <p className="text-[11px] text-[#28221a]/45 truncate">{cat.description}</p>
                          </div>
                          <ArrowRight size={12} className="text-[#87663b]/40 group-hover:text-[#87663b] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                        </Link>
                      ))}
                    </div>
                    <div className="border-t border-[#c9a177]/12 m-3 pt-2">
                      <Link
                        to="/shop"
                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] uppercase tracking-[0.14em] font-bold text-[#87663b] hover:bg-[#87663b]/8 transition-colors"
                      >
                        View All Products <ArrowRight size={11} />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {NAV_LINKS.slice(2, 3).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 text-[11.5px] uppercase tracking-[0.13em] font-semibold rounded-full transition-colors duration-200 ${
                  isActive(link.path) ? 'text-[#87663b]' : 'text-[#28221a]/60 hover:text-[#28221a]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action icons */}
          <div className="flex items-center gap-1 bg-white/50 border border-white/65 rounded-full px-1.5 py-1.5 shadow-[0_6px_20px_rgba(40,30,15,0.07)]">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={onSearchOpen}
              className="p-2 text-[#28221a]/55 hover:text-[#28221a] hover:bg-[#f5e8d6]/80 rounded-full transition-all focus-luxury"
              aria-label="Search products"
            >
              <Search size={17} strokeWidth={1.75} />
            </motion.button>
            <Link
              to="/wishlist"
              className="relative p-2 text-[#28221a]/55 hover:text-[#28221a] hover:bg-[#f5e8d6]/80 rounded-full transition-all focus-luxury"
              aria-label={`Wishlist (${wishlist.length} items)`}
            >
              <Heart size={17} strokeWidth={1.75} />
              <AnimatePresence>
                {wishlist.length > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#87663b] text-white text-[8.5px] font-bold rounded-full flex items-center justify-center shadow-[0_0_0_2px_rgba(253,250,245,0.9)]"
                  >
                    {wishlist.length > 9 ? '9+' : wishlist.length}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden overflow-hidden bg-[#fffdf9]/97 backdrop-blur-2xl border-t border-[#c9a177]/12 shadow-[0_24px_60px_rgba(40,25,10,0.18)]"
            >
              <div className="max-w-[1320px] mx-auto px-5 py-5 space-y-1 max-h-[calc(100vh-10rem)] overflow-y-auto">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <Link
                      to={link.path}
                      className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                        isActive(link.path)
                          ? 'text-[#87663b] bg-[#87663b]/8 font-semibold'
                          : 'text-[#28221a]/65 hover:bg-[#f5e8d6]/70 hover:text-[#28221a]'
                      }`}
                    >
                      {link.name}
                      {isActive(link.path) && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#87663b]" />
                      )}
                    </Link>
                  </motion.div>
                ))}

                <div className="pt-4 border-t border-[#c9a177]/15 mt-3">
                  <p className="px-4 text-[9px] font-bold uppercase tracking-[0.24em] text-[#87663b]/50 mb-3">
                    Categories
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES.map((cat, i) => (
                      <motion.div
                        key={cat.slug}
                        initial={{ opacity: 0, scale: 0.94 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: (NAV_LINKS.length + i) * 0.04 }}
                      >
                        <Link
                          to={`/category/${cat.slug}`}
                          className="flex items-center gap-2.5 p-3 rounded-2xl hover:bg-[#f5e8d6]/70 transition-all group"
                        >
                          <div className="w-9 h-9 rounded-xl overflow-hidden border border-[#c9a177]/20 flex-shrink-0">
                            <img src={catImages[cat.slug]} alt={cat.name} className="w-full h-full object-cover" />
                          </div>
                          <span className="text-sm font-medium text-[#28221a]/70 group-hover:text-[#28221a]">
                            {cat.name}s
                          </span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
