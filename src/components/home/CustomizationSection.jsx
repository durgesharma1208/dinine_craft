import { motion } from 'framer-motion';
import { Paintbrush, Check } from 'lucide-react';
import Button from '../ui/Button';
import { WHATSAPP_NUMBER } from '../../utils/constants';

export default function CustomizationSection() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello Dinine Craft, I want to discuss a custom design for my home. Please share the customization options and pricing.')}`;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-[11px] font-semibold text-primary/60 uppercase tracking-[0.2em]">Customization</span>
            <h2 className="text-3xl sm:text-4xl font-display text-charcoal mt-3 mb-4 leading-tight">
              Want Something Unique? Let's Create It Together
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-7 max-w-md">
              Have a specific design in mind? Our skilled artisans can bring your vision to life. Whether it's a custom size, personalized engraving, or a completely new design.
            </p>
            <div className="space-y-3 mb-8">
              {[
                'Personalized engravings with names or dates',
                'Custom sizes to fit your space perfectly',
                'Unique designs created just for you',
                'Bulk orders for events and corporate gifting',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check size={12} className="text-primary" />
                  </span>
                  <span className="text-sm text-gray-600">{item}</span>
                </div>
              ))}
            </div>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="primary" size="lg" icon={Paintbrush}>
                Request Custom Design
              </Button>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="relative rounded-[2rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
              <img src="https://images.unsplash.com/photo-1758366278217-0d58bf8c7107?w=900&q=85" alt="Custom wooden craft" className="w-full h-[420px] object-cover" loading="lazy" />
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="absolute -bottom-5 -left-5 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.06)] rounded-2xl p-5 border border-gray-100/50"
            >
              <p className="text-xl font-bold text-primary">500+</p>
              <p className="text-xs text-gray-400 mt-0.5">Custom Orders Completed</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
