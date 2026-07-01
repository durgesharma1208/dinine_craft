import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Button from './Button';

export default function ExitIntentPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let timeout;
    const handleMouseLeave = (e) => {
      if (e.clientY <= 0) {
        timeout = setTimeout(() => {
          const dismissed = localStorage.getItem('dinine_exit_dismissed');
          if (!dismissed) setShow(true);
        }, 100);
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(timeout);
    };
  }, []);

  const dismiss = () => {
    localStorage.setItem('dinine_exit_dismissed', 'true');
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-black/[0.03]"
          >
            <button onClick={dismiss} className="absolute top-4 right-4 p-1 text-gray-300 hover:text-gray-500 transition-colors rounded-full hover:bg-gray-100" aria-label="Close">
              <X size={18} />
            </button>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                <span className="text-3xl">🎁</span>
              </div>
              <h3 className="text-2xl font-display text-charcoal mb-2">Wait! Don't Go!</h3>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                Subscribe and get <strong className="text-primary">10% OFF</strong> on your first order!
              </p>
              <div className="flex gap-2">
                <input type="email" placeholder="Enter your email"
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm placeholder:text-gray-300"
                />
                <Button onClick={dismiss} size="md">Subscribe</Button>
              </div>
              <p className="text-xs text-gray-300 mt-3">No spam. Unsubscribe anytime.</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
