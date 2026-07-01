import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Truck, Gift, Sparkles } from 'lucide-react';

const announcements = [
  { text: 'Free Shipping on orders above ₹999 across India', icon: Truck, highlight: '₹999' },
  { text: 'Festival Sale — Flat 30% OFF on all products!', icon: Gift, highlight: '30% OFF' },
  { text: 'Made in India — Premium Handcrafted Wooden Decor', icon: Sparkles, highlight: 'Handcrafted' },
];

export default function AnnouncementBar() {
  const [current, setCurrent] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const timer = setInterval(
      () => setCurrent((prev) => (prev + 1) % announcements.length),
      4200,
    );
    return () => clearInterval(timer);
  }, [dismissed]);

  if (dismissed) return null;

  const { text, icon: Icon } = announcements[current];

  return (
    <div className="relative bg-[#1e1208] text-white/85 text-[11px] sm:text-xs overflow-hidden h-9 flex items-center">
      {/* Subtle shimmer sweep */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(184,154,103,0.07) 50%, transparent 100%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer-gold 4s ease-in-out infinite',
        }}
      />

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-8 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ y: -14, opacity: 0, filter: 'blur(3px)' }}
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
            exit={{ y: 14, opacity: 0, filter: 'blur(3px)' }}
            transition={{ duration: 0.32, ease: 'easeInOut' }}
            className="flex items-center gap-2.5"
          >
            <Icon size={11} className="text-[#c9a869] flex-shrink-0" />
            <span className="tracking-[0.08em]">{text}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot indicators */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-1 flex gap-1 pointer-events-none">
        {announcements.map((_, i) => (
          <span
            key={i}
            className="block rounded-full transition-all duration-300"
            style={{
              width: i === current ? 12 : 4,
              height: 2,
              background: i === current ? '#c9a869' : 'rgba(201,168,105,0.3)',
            }}
          />
        ))}
      </div>

      {/* Dismiss */}
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors focus-luxury"
        aria-label="Dismiss announcement"
      >
        <X size={11} />
      </button>
    </div>
  );
}
