import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Mouse } from 'lucide-react';
import Button from '../ui/Button';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function HeroBanner() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const floatY1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const floatY2 = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ paddingTop: 'calc(36px + 80px)' }}
    >
      {/* Rich layered background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(160deg, #fdfaf5 0%, #f9f1e3 40%, #f5ead8 70%, #f2e5d2 100%)',
        }}
      />

      {/* Decorative floating orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-[12%] right-[8%] w-[380px] h-[380px] rounded-full"
          animate={{ opacity: [0.22, 0.32, 0.22] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            y: floatY1,
            background: 'radial-gradient(circle, rgba(180,148,96,0.28) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <motion.div
          className="absolute bottom-[10%] left-[3%] w-[300px] h-[300px] rounded-full"
          style={{
            y: floatY2,
            background: 'radial-gradient(circle, rgba(95,67,36,0.22) 0%, transparent 70%)',
            filter: 'blur(70px)',
          }}
        />

        {/* Decorative geometric lines */}
        <div
          className="absolute top-1/3 left-[14%] w-px h-28 opacity-20"
          style={{ background: 'linear-gradient(180deg, transparent, #87663b, transparent)' }}
        />
        <div
          className="absolute bottom-1/4 right-[12%] w-px h-36 opacity-15"
          style={{ background: 'linear-gradient(180deg, transparent, #b89a67, transparent)' }}
        />

        {/* Floating dots */}
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[22%] left-[10%] w-2.5 h-2.5 rounded-full bg-[#87663b]/25"
        />
        <motion.div
          animate={{ y: [8, -12, 8] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-[38%] right-[20%] w-1.5 h-1.5 rounded-full bg-[#b89a67]/35"
        />
        <motion.div
          animate={{ y: [-6, 10, -6] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-[30%] right-[28%] w-3 h-3 rounded-full bg-[#c9a177]/20"
        />

        {/* Corner decorative element */}
        <div
          className="absolute top-[8%] left-[6%] w-20 h-20 opacity-10"
          style={{
            border: '1px solid #87663b',
            borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
            transform: 'rotate(-15deg)',
          }}
        />
      </div>

      <motion.div style={{ opacity }} className="relative w-full">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-7 lg:px-10 py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* TEXT SIDE */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="relative z-10"
            >
              {/* Eyebrow */}
              <motion.div variants={itemVariants} className="mb-7">
                <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full bg-white/55 border border-[#87663b]/14 luxury-ring">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-[#87663b] opacity-50" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#87663b]" />
                  </span>
                  <span className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-[#87663b]">
                    Premium Handcrafted Wooden Decor
                  </span>
                </div>
              </motion.div>

              {/* Main headline */}
              <motion.div variants={itemVariants}>
                <h1
                  className="font-display text-[#28221a] leading-[0.93] tracking-[-0.025em]"
                  style={{ fontSize: 'clamp(3.2rem, 7vw, 6.2rem)' }}
                >
                  <span className="block">Crafted For</span>
                  <span className="block relative mt-1">
                    <span className="text-[#87663b]">Timeless</span>
                    <span className="font-light italic"> Homes</span>
                    {/* Animated underline */}
                    <motion.span
                      initial={{ scaleX: 0, originX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 1.1, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full origin-left"
                      style={{
                        background:
                          'linear-gradient(90deg, #87663b, #b89a67, rgba(184,154,103,0))',
                      }}
                    />
                  </span>
                  <span
                    className="block mt-2 font-light text-[#28221a]/70"
                    style={{ fontSize: '0.78em' }}
                  >
                    Where Wood Meets Artistry
                  </span>
                </h1>
              </motion.div>

              {/* Description */}
              <motion.p
                variants={itemVariants}
                className="text-[#4f4437] text-[1rem] leading-[1.85] max-w-[42ch] mt-7"
              >
                Discover statement decor shaped by skilled artisans, natural grains, and
                thoughtful details that bring warmth, trust, and elevated character into
                every room.
              </motion.p>

              {/* CTA buttons */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap gap-3.5 mt-10"
              >
                <Link to="/shop">
                  <Button
                    variant="gold"
                    size="lg"
                    icon={ArrowRight}
                    iconPosition="right"
                    className="animate-glow-shift"
                  >
                    Explore Collection
                  </Button>
                </Link>
                <Link to="/shop">
                  <Button variant="secondary" size="lg">
                    View All Products
                  </Button>
                </Link>
              </motion.div>

              {/* Stats row */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-3 gap-4 mt-12 pt-8"
              >
                <div
                  className="col-span-3 h-px mb-4"
                  style={{
                    background:
                      'linear-gradient(90deg, rgba(135,102,59,0.18), rgba(184,154,103,0.12), transparent)',
                  }}
                />
                {[
                  { value: '500+', label: 'Happy Customers' },
                  { value: '1000+', label: 'Orders Delivered' },
                  { value: '4.8★', label: 'Average Rating' },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div
                      className="font-display font-semibold text-[#28221a] leading-none"
                      style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-[9.5px] text-[#5a4f43]/70 tracking-[0.15em] mt-1.5 uppercase font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* IMAGE SIDE */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="hidden lg:block relative"
            >
              <div className="relative max-w-[590px] ml-auto">
                {/* Decorative ring behind image */}
                <div
                  className="absolute -inset-5 rounded-[2.6rem] border border-[#87663b]/12 pointer-events-none"
                  style={{ transform: 'rotate(2deg)' }}
                />

                {/* Main image */}
                <motion.div
                  className="relative rounded-[2.2rem] overflow-hidden grain-border"
                  style={{
                    y: imageY,
                    scale: imageScale,
                    boxShadow: '0 40px 100px rgba(40,25,10,0.28), 0 10px 30px rgba(40,25,10,0.15)',
                  }}
                >
                  {/* Overlay tint */}
                  <div
                    className="absolute inset-0 z-10 pointer-events-none rounded-[2.2rem]"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(135,102,59,0.08) 0%, transparent 50%, rgba(184,154,103,0.08) 100%)',
                    }}
                  />
                  <img
                    src="https://images.unsplash.com/photo-1612152661182-8d6c5e568c94?w=900&q=85"
                    alt="Handcrafted wooden decor showcase"
                    className="w-full h-160 object-cover animate-gentle-zoom"
                    fetchpriority="high"
                  />
                  {/* Inner ring */}
                  <div
                    className="absolute inset-0 z-20 pointer-events-none rounded-[2.2rem]"
                    style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)' }}
                  />
                </motion.div>

                {/* Floating card — bottom left */}
                <motion.div
                  initial={{ opacity: 0, x: -24, y: 16 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ duration: 0.7, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute -bottom-10 -left-10 glass-card rounded-2xl px-5 py-4 max-w-[220px]"
                >
                  <div className="flex items-center gap-1 mb-2.5">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-3 h-3" viewBox="0 0 20 20" fill="#f59e0b">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-[10px] text-[#87663b] font-bold ml-1">4.9</span>
                  </div>
                  <p className="text-[13px] font-semibold text-[#28221a] leading-tight">
                    Premium Quality Finish
                  </p>
                  <p className="text-[11px] text-[#28221a]/50 mt-1 leading-snug">
                    Handcrafted with love & refined detailing
                  </p>
                </motion.div>

                {/* Floating badge — top right */}
                <motion.div
                  initial={{ opacity: 0, x: 20, y: -12 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.15, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute top-10 -right-10 dark-glass rounded-2xl px-4 py-3"
                >
                  <p className="text-[9.5px] uppercase tracking-[0.22em] text-[#b89a67]/80 font-semibold">
                    Artisan Signature
                  </p>
                  <p className="text-[13px] font-medium text-white/85 mt-1">
                    Limited Craft Batches
                  </p>
                </motion.div>

                {/* Small floating indicator */}
                <motion.div
                  animate={{ y: [-4, 4, -4] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -bottom-5 right-16 w-10 h-10 rounded-2xl bg-[#b89a67] flex items-center justify-center shadow-[0_8px_24px_rgba(184,154,103,0.4)]"
                >
                  <span className="text-white text-xs font-bold">✦</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#8f7a61]/70"
      >
        <span className="text-[9px] font-bold tracking-[0.28em] uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Mouse size={15} />
        </motion.div>
      </motion.div>
    </section>
  );
}
