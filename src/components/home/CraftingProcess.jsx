import { motion } from 'framer-motion';
import { TreePine, PenTool, Hammer, Sparkles, CheckCircle, Package } from 'lucide-react';
import { CRAFT_STEPS } from '../../utils/constants';

const iconMap = { TreePine, PenTool, Hammer, Sparkles, CheckCircle, Package };

export default function CraftingProcess() {
  return (
    <section className="py-28 relative overflow-hidden bg-white">
      {/* Decorative background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 90% 10%, rgba(245,232,214,0.5) 0%, transparent 55%), radial-gradient(ellipse at 10% 90%, rgba(245,232,214,0.4) 0%, transparent 55%)',
        }}
      />

      <div className="relative max-w-[1320px] mx-auto px-5 sm:px-7 lg:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <span className="section-eyebrow mb-4 justify-center">Our Process</span>
          <h2 className="section-title mt-4 mb-5">
            The Art of{' '}
            <span className="text-[#87663b] italic font-light">Crafting</span>
          </h2>
          <p className="section-copy mx-auto text-center">
            Every piece tells a story of dedication, skill, and passion passed
            down through generations of master artisans.
          </p>
        </motion.div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14 relative">
          {/* Connector lines for desktop */}
          <div
            className="hidden lg:block absolute top-[2.5rem] left-[33.33%] right-[33.33%] h-px pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(135,102,59,0.25), transparent)',
            }}
          />

          {CRAFT_STEPS.map((step, index) => {
            const Icon = iconMap[step.icon] || Package;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.65,
                  delay: index * 0.09,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative group"
              >
                {/* Step number */}
                <div
                  className="absolute -top-7 left-0 font-display font-bold leading-none select-none pointer-events-none"
                  style={{
                    fontSize: '5rem',
                    color: 'rgba(135,102,59,0.055)',
                    letterSpacing: '-0.04em',
                  }}
                >
                  {String(index + 1).padStart(2, '0')}
                </div>

                {/* Icon + connector dot */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative flex-shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#f5e8d4] to-[#efe0cc] border border-[#c9a177]/25 flex items-center justify-center shadow-[0_8px_24px_rgba(135,102,59,0.1)] group-hover:shadow-[0_12px_32px_rgba(135,102,59,0.18)] transition-all duration-400">
                      <Icon size={22} className="text-[#87663b] group-hover:scale-110 transition-transform duration-300" />
                    </div>

                    {/* Connection dot */}
                    {index < CRAFT_STEPS.length - 1 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + 0.3, type: 'spring', stiffness: 200 }}
                        className="absolute -right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#b89a67]/40 hidden lg:block"
                      />
                    )}
                  </div>

                  <div>
                    <div className="text-[9.5px] font-bold uppercase tracking-[0.2em] text-[#87663b]/55 mb-1">
                      Step {index + 1}
                    </div>
                    <h3
                      className="font-display text-[#28221a] leading-tight"
                      style={{ fontSize: 'clamp(1.1rem, 1.8vw, 1.3rem)' }}
                    >
                      {step.title}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-[#5a4f43]/70 leading-relaxed pl-[4.5rem]">
                  {step.description}
                </p>

                {/* Hover accent */}
                <div
                  className="absolute left-0 bottom-0 w-0 group-hover:w-full h-px transition-all duration-500"
                  style={{
                    background: 'linear-gradient(90deg, rgba(184,154,103,0.4), transparent)',
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
