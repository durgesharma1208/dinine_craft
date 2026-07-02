import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { fetchTestimonials } from '../../services/contentService';

// Generate initials avatar colors
const avatarColors = [
  '#87663b', '#7a5534', '#9a7247', '#6b4e35', '#b08050', '#5f4324',
];

function getInitials(name) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function CustomerReviews() {
  const [testimonials, setTestimonials] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    fetchTestimonials()
      .then(data => { if (mounted) setTestimonials(data || []); })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -380 : 380, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Warm cream background */}
      <div className="absolute inset-0 bg-[#faf3e8]/60" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(245,232,214,0.6) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-[1320px] mx-auto px-5 sm:px-7 lg:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-end justify-between mb-12 gap-6"
        >
          <div>
            <span className="section-eyebrow mb-4 block">Testimonials</span>
            <h2 className="section-title">
              What Our
              <span className="block text-[#87663b] italic font-light"> Customers Say</span>
            </h2>
          </div>
          <div className="hidden md:flex gap-2 flex-shrink-0">
            {[ChevronLeft, ChevronRight].map((Icon, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scroll(i === 0 ? 'left' : 'right')}
                className="w-11 h-11 rounded-full border border-[#c9a177]/30 bg-white/70 flex items-center justify-center text-[#87663b]/60 hover:border-[#87663b]/50 hover:text-[#87663b] hover:bg-white transition-all focus-luxury shadow-sm"
              >
                <Icon size={17} />
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Review cards */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scrollbar-hide pb-5 -mx-5 px-5 snap-x snap-mandatory"
        >
          {testimonials.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="flex-shrink-0 w-[350px] snap-start"
            >
              <div className="glass-card rounded-2xl p-6 h-full relative flex flex-col transition-all duration-400 hover:shadow-[0_16px_50px_rgba(45,30,15,0.12)] group">
                {/* Large quote mark */}
                <Quote
                  size={32}
                  className="absolute top-5 right-5 text-[#87663b]/08 group-hover:text-[#87663b]/14 transition-colors duration-400"
                  strokeWidth={1.5}
                />

                {/* Stars */}
                <div className="flex items-center gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <motion.svg
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 + i * 0.06 + 0.2, type: 'spring', stiffness: 300 }}
                      className="w-3.5 h-3.5"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                        fill={i < review.rating ? '#f59e0b' : '#e5e7eb'}
                      />
                    </motion.svg>
                  ))}
                </div>

                {/* Review text */}
                <p className="text-[13.5px] text-[#3d3328]/80 leading-[1.8] italic flex-1 mb-5">
                  &ldquo;{review.text}&rdquo;
                </p>

                {/* Reviewer */}
                <div className="pt-4 border-t border-[#c9a177]/18 flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm"
                    style={{ background: `linear-gradient(135deg, ${avatarColors[index % avatarColors.length]}, ${avatarColors[(index + 2) % avatarColors.length]})` }}
                  >
                    {getInitials(review.name)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[#28221a]">{review.name}</p>
                    <p className="text-[11px] text-[#28221a]/40 mt-0.5">{review.location}</p>
                  </div>
                  <div className="ml-auto">
                    <div className="px-2.5 py-1 rounded-full bg-[#87663b]/8 border border-[#87663b]/12">
                      <span className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-[#87663b]/70">
                        Verified
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
