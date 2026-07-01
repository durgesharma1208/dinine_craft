import { motion } from 'framer-motion';
import { Leaf, Truck, Shield, HandHeart, Package, MessageCircle } from 'lucide-react';

const features = [
  {
    icon: Leaf,
    title: '100% Handmade',
    description: 'Each piece is meticulously crafted by skilled artisans using traditional techniques passed down through generations.',
    number: '01',
  },
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'Free shipping on all orders above ₹999 with careful packaging and fast delivery across India.',
    number: '02',
  },
  {
    icon: Shield,
    title: 'Premium Quality',
    description: 'We use only the finest quality wood and materials. Every product undergoes strict quality checks before shipping.',
    number: '03',
  },
  {
    icon: HandHeart,
    title: 'Eco Friendly',
    description: 'Made from sustainably sourced wood using eco-friendly processes. We plant a tree for every order placed.',
    number: '04',
  },
  {
    icon: Package,
    title: 'Secure Packaging',
    description: 'Each product is carefully packed in eco-friendly materials to ensure safe delivery to your doorstep.',
    number: '05',
  },
  {
    icon: MessageCircle,
    title: '24/7 Support',
    description: 'Our team is available around the clock via WhatsApp and email to assist you with any questions.',
    number: '06',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-28 relative overflow-hidden">
      {/* Section background */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, #f5e8d4/60 0%, #f8eedf/80 50%, #f5e8d4/60 100%)' }}
      />
      <div className="absolute inset-0 bg-[#f7ede0]/65" />

      {/* Decorative orb */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 80% 20%, rgba(184,154,103,0.1) 0%, transparent 60%)',
        }}
      />

      <div className="relative max-w-[1320px] mx-auto px-5 sm:px-7 lg:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="section-eyebrow mb-4 justify-center">Why Choose Us</span>
          <h2 className="section-title mt-4 mb-5">
            Crafted With Passion,
            <span className="block text-[#87663b] font-light italic">Delivered With Care</span>
          </h2>
          <p className="section-copy mx-auto text-center">
            We believe in creating decor that not only beautifies your space but also
            supports traditional craftsmanship and sustainable practices.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.6,
                delay: index * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ y: -6, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
              className="relative group"
            >
              <div
                className="h-full premium-shell rounded-2xl p-7 transition-all duration-500"
                style={{
                  '--hover-shadow': '0 28px 70px rgba(45,30,15,0.12)',
                }}
              >
                {/* Decor number */}
                <span
                  className="absolute top-4 right-5 font-display font-bold text-[3.5rem] leading-none text-[#87663b]/06 select-none pointer-events-none"
                >
                  {feature.number}
                </span>

                {/* Icon container */}
                <div className="relative mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#87663b]/12 to-[#b89a67]/8 flex items-center justify-center border border-[#87663b]/10 group-hover:border-[#87663b]/25 transition-all duration-400">
                    <feature.icon
                      size={22}
                      className="text-[#87663b] group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  {/* Glow on hover */}
                  <div className="absolute inset-0 w-14 h-14 rounded-2xl bg-[#87663b]/8 opacity-0 group-hover:opacity-100 blur-[12px] transition-opacity duration-400" />
                </div>

                <h3
                  className="font-display text-[#28221a] mb-2.5 leading-tight"
                  style={{ fontSize: 'clamp(1.2rem, 2vw, 1.5rem)' }}
                >
                  {feature.title}
                </h3>
                <p className="text-sm text-[#5a4f43]/75 leading-relaxed">
                  {feature.description}
                </p>

                {/* Bottom accent line on hover */}
                <div
                  className="absolute bottom-0 left-7 right-7 h-px bg-gradient-to-r from-[#87663b]/0 via-[#87663b]/20 to-[#87663b]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
