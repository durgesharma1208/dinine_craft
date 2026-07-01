import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      toast.success('Subscribed! Check your inbox for your 10% off code.');
    }
  };

  return (
    <section className="py-24 bg-gradient-to-br from-primary via-primary-dark to-[#5a4210] text-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px]" />
      </div>
      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Mail size={36} className="mx-auto mb-5 text-gold/60" />
          <h2 className="text-3xl sm:text-4xl font-display mb-4">Stay in the Loop</h2>
          <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-md mx-auto">
            Subscribe to our newsletter and get <strong className="text-gold">10% OFF</strong> your first order. Be the first to know about new arrivals and exclusive offers.
          </p>
          {subscribed ? (
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <p className="text-xl font-medium">Thank You! <span aria-hidden="true">✨</span></p>
              <p className="text-white/50 text-sm mt-1">Check your inbox for your discount code.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 px-5 py-3.5 rounded-full text-charcoal bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-gold/40 text-sm placeholder:text-gray-400"
              />
              <button type="submit" className="px-6 py-3.5 bg-gold text-white rounded-full font-medium hover:bg-primary-dark transition-all flex items-center justify-center gap-2 text-sm shadow-lg">
                Subscribe <Send size={14} />
              </button>
            </form>
          )}
          <p className="text-xs text-white/30 mt-5">No spam. Unsubscribe anytime.</p>
        </motion.div>
      </div>
    </section>
  );
}
