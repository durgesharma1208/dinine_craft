import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <>
      <Helmet><title>Page Not Found — Dinine Craft</title></Helmet>
      <div className="min-h-screen flex items-center justify-center bg-cream/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center px-4"
        >
          <div className="text-8xl font-display font-bold text-primary/10 mb-4 select-none">404</div>
          <h1 className="text-3xl md:text-4xl font-display text-charcoal mb-4">Page Not Found</h1>
          <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-all text-sm shadow-[0_4px_14px_rgba(139,105,20,0.25)]">
              <Home size={16} /> Go Home
            </Link>
            <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-charcoal border-2 border-gray-200 rounded-full font-medium hover:border-charcoal/30 transition-all text-sm">
              <ArrowLeft size={16} /> All Products
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}
