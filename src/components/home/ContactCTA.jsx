import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import Button from '../ui/Button';
import { WHATSAPP_NUMBER } from '../../utils/constants';

export default function ContactCTA() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello Dinine Craft! I have a question about your products.')}`;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-[11px] font-semibold text-primary/60 uppercase tracking-[0.2em]">Get In Touch</span>
          <h2 className="text-3xl sm:text-4xl font-display text-charcoal mt-3 mb-4 leading-tight">
            Have a Question? We're Here to Help!
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-xl mx-auto">
            Our team is always ready to assist you. Whether you need help choosing the perfect piece or want to discuss a custom order, don't hesitate to reach out.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="primary" size="lg" icon={MessageCircle}>Chat on WhatsApp</Button>
            </a>
            <a href="mailto:hello@dininecraft.com">
              <Button variant="secondary" size="lg">Send Email</Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
