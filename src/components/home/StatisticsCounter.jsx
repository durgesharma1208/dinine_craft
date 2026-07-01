import { motion } from 'framer-motion';
import { Users, Package, MapPin, Star } from 'lucide-react';
import { STATS } from '../../utils/constants';
import CountUp from '../../utils/CountUp';

const iconMap = { Users, Package, MapPin, Star };

export default function StatisticsCounter() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Dark walnut background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #1e1208 0%, #150d05 50%, #1a1008 100%)',
        }}
      />

      {/* Decorative warm light orbs */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 80% -20%, rgba(184,154,103,0.14) 0%, transparent 65%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-[400px] h-[300px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at -10% 120%, rgba(135,102,59,0.18) 0%, transparent 65%)',
        }}
      />

      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: 'linear-gradient(rgba(184,154,103,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(184,154,103,0.4) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative max-w-[1320px] mx-auto px-5 sm:px-7 lg:px-10">
        {/* Top divider */}
        <div className="luxury-divider mb-14 opacity-30" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
          {STATS.map((stat, index) => {
            const Icon = iconMap[stat.icon] || Star;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="relative text-center group"
              >
                {/* Icon */}
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#b89a67]/10 border border-[#b89a67]/20 flex items-center justify-center group-hover:bg-[#b89a67]/15 transition-all duration-300">
                    <Icon size={20} className="text-[#b89a67]" />
                  </div>
                </div>

                {/* Number */}
                <div
                  className="font-display font-bold text-white leading-none mb-2 gradient-text-gold"
                  style={{ fontSize: 'clamp(2.4rem, 5vw, 3.5rem)' }}
                >
                  <CountUp end={stat.value} suffix={stat.suffix} />
                </div>

                {/* Label */}
                <p className="text-[10.5px] text-white/40 tracking-[0.16em] uppercase font-medium">
                  {stat.label}
                </p>

                {/* Vertical divider between items (not last) */}
                {index < STATS.length - 1 && (
                  <div
                    className="hidden md:block absolute top-1/2 -translate-y-1/2 right-0 w-px h-14 opacity-15"
                    style={{
                      background: 'linear-gradient(180deg, transparent, rgba(184,154,103,0.6), transparent)',
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Bottom divider */}
        <div className="luxury-divider mt-14 opacity-30" />
      </div>
    </section>
  );
}
