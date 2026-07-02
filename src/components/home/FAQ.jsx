import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { fetchFAQ } from '../../services/contentService';

export default function FAQ() {
  const [faqItems, setFaqItems] = useState([]);
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    let mounted = true;
    fetchFAQ()
      .then(data => { if (mounted) setFaqItems(data || []); })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  return (
    <section className="py-24 bg-cream/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14"
        >
          <span className="text-[11px] font-semibold text-primary/60 uppercase tracking-[0.2em]">FAQ</span>
          <h2 className="text-3xl sm:text-4xl font-display text-charcoal mt-3 mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-400 text-sm">Everything you need to know about our products and services.</p>
        </motion.div>

        <div className="space-y-2.5">
          {faqItems.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
              className="bg-white rounded-2xl overflow-hidden border border-black/[0.03]"
              style={{ boxShadow: '0 1px 10px rgba(0,0,0,0.02)' }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left group"
              >
                <span className="text-sm font-medium text-charcoal pr-4 group-hover:text-primary transition-colors">{faq.question}</span>
                <ChevronDown
                  size={16}
                  className={`text-gray-300 flex-shrink-0 transition-all duration-300 ${openIndex === index ? 'rotate-180 text-primary' : ''}`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-sm text-gray-500 leading-relaxed">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
