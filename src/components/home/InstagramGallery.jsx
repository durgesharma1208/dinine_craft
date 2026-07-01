import { motion } from 'framer-motion';
import { Camera, ExternalLink } from 'lucide-react';
import { INSTAGRAM_URL } from '../../utils/constants';

const images = [
  { src: 'https://images.unsplash.com/photo-1606041008023-472dfb5e5305?w=500&q=80', span: 'row-span-2' },
  { src: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=500&q=80', span: '' },
  { src: 'https://images.unsplash.com/photo-1585849834908-348a1e1c3c21?w=500&q=80', span: '' },
  { src: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=500&q=80', span: '' },
  { src: 'https://images.unsplash.com/photo-1605020420620-20c943e0d4a3?w=500&q=80', span: '' },
  { src: 'https://images.unsplash.com/photo-1518607689150-412def5d769f?w=500&q=80', span: '' },
  { src: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80', span: '' },
];

export default function InstagramGallery() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Soft background */}
      <div className="absolute inset-0 bg-[#f8f0e4]/50" />

      <div className="relative max-w-[1320px] mx-auto px-5 sm:px-7 lg:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <span className="section-eyebrow mb-4 justify-center">Instagram</span>
          <h2 className="section-title mt-4 mb-3">
            Follow Our{' '}
            <span className="text-[#87663b] italic font-light">Creative Journey</span>
          </h2>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-[#87663b] font-medium hover:text-[#5f4324] transition-colors mt-1"
          >
            @dinine_craft
            <ExternalLink size={12} />
          </a>
        </motion.div>

        {/* Masonry-style grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 auto-rows-[160px] md:auto-rows-[180px]">
          {images.map((img, index) => (
            <motion.a
              key={index}
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className={`group relative overflow-hidden rounded-2xl grain-border ${img.span}`}
              style={{ boxShadow: '0 8px 30px rgba(40,28,15,0.08)' }}
            >
              <img
                src={img.src}
                alt={`Dinine Craft handcrafted wood decor ${index + 1}`}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-107 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-[#28221a]/0 group-hover:bg-[#28221a]/32 transition-colors duration-400" />

              {/* Instagram icon on hover */}
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 gap-2"
              >
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                  <Camera size={16} className="text-white" />
                </div>
                <span className="text-[9.5px] font-bold uppercase tracking-[0.18em] text-white/80">
                  View Post
                </span>
              </motion.div>
            </motion.a>
          ))}

          {/* CTA card within the grid */}
          <motion.a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="group relative overflow-hidden rounded-2xl flex flex-col items-center justify-center p-6 text-center gap-3 border-2 border-dashed border-[#c9a177]/35 hover:border-[#87663b]/50 transition-all duration-400 bg-[#fdf5eb]/60 hover:bg-[#fdf5eb]"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#515bd4] flex items-center justify-center shadow-[0_8px_24px_rgba(221,42,123,0.3)] group-hover:scale-110 transition-transform duration-300">
              <Camera size={20} className="text-white" />
            </div>
            <div>
              <p className="font-semibold text-sm text-[#28221a]">Follow Us</p>
              <p className="text-[10.5px] text-[#28221a]/45 mt-0.5">@dinine_craft</p>
            </div>
          </motion.a>
        </div>

        {/* Tag CTA */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center text-sm text-[#28221a]/45 mt-8"
        >
          Tag us{' '}
          <span className="text-[#87663b] font-semibold">@dinine_craft</span>{' '}
          for a chance to be featured in our gallery!
        </motion.p>
      </div>
    </section>
  );
}
