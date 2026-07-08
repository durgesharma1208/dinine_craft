import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Heart, ArrowUpRight, Globe } from 'lucide-react';
import { WHATSAPP_NUMBER, EMAIL, INSTAGRAM_URL, FACEBOOK_URL, PINTEREST_URL } from '../../utils/constants';
import { useCategories } from '../../hooks/useCategories';

const quickLinks = [
  { name: 'Home', path: '/' },
  { name: 'Shop All', path: '/shop' },
  { name: 'Catalogs', path: '/shop#catalogs' },
  { name: 'Wishlist', path: '/wishlist' },
];

const supportLinks = [
  { name: 'Shipping & Delivery', path: '#' },
  { name: 'Returns & Exchange', path: '#' },
  { name: 'FAQ', path: '#' },
  { name: 'Privacy Policy', path: '#' },
  { name: 'Terms & Conditions', path: '#' },
];

const socials = [
  {
    label: 'Instagram',
    shortLabel: 'IG',
    url: INSTAGRAM_URL,
    icon: Globe,
  },
  {
    label: 'Facebook',
    shortLabel: 'FB',
    url: FACEBOOK_URL,
    icon: Globe,
  },
  {
    label: 'Pinterest',
    shortLabel: 'Pin',
    url: PINTEREST_URL,
    icon: Globe,
  },
];

export default function Footer() {
  const { categories } = useCategories();
  return (
    <footer className="bg-[#190f07] text-white/75 relative overflow-hidden">
      {/* Decorative orbs */}
      <div className="absolute -top-40 -right-20 w-[500px] h-[500px] rounded-full bg-[#a88352]/12 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-20 w-[400px] h-[400px] rounded-full bg-[#5f4324]/18 blur-[100px] pointer-events-none" />

      {/* Watermark typography */}
      <div
        className="absolute bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none select-none"
        style={{
          fontFamily: '"Cormorant Garamond", serif',
          fontSize: 'clamp(5rem, 14vw, 11rem)',
          fontWeight: 700,
          color: 'rgba(184,154,103,0.04)',
          letterSpacing: '-0.02em',
          lineHeight: 1,
        }}
        aria-hidden="true"
      >
        Dinine Craft
      </div>

      {/* Top luxury divider */}
      <div className="luxury-divider" />

      <div className="relative max-w-[1320px] mx-auto px-5 sm:px-7 lg:px-10">
        {/* Main footer grid */}
        <div className="py-16 lg:py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

          {/* Brand column */}
          <div className="lg:col-span-4 space-y-7">
            <div>
              <Link to="/" className="inline-flex items-baseline gap-1.5 mb-5 group">
                <span className="text-[2rem] leading-none font-display font-semibold text-[#b89a67] tracking-tight">
                  Dinine
                </span>
                <span className="text-[2rem] leading-none font-display font-light text-white/45 tracking-tight">
                  Craft
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#b89a67] mb-1 opacity-60" />
              </Link>
              <p className="text-white/40 text-sm leading-relaxed max-w-[280px]">
                Handcrafted wooden decor that makes every space beautiful. Each
                piece tells a story of artistry, tradition, and lasting quality.
              </p>
            </div>

            {/* Contact */}
            <div className="space-y-3.5 text-sm">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-white/38 hover:text-[#b89a67] transition-colors duration-300 group"
              >
                <span className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-[#b89a67]/15 transition-colors border border-white/6">
                  <Phone size={13} />
                </span>
                +91-{WHATSAPP_NUMBER.slice(0, 5)}-{WHATSAPP_NUMBER.slice(5)}
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className="flex items-center gap-3 text-white/38 hover:text-[#b89a67] transition-colors duration-300 group"
              >
                <span className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-[#b89a67]/15 transition-colors border border-white/6">
                  <Mail size={13} />
                </span>
                {EMAIL}
              </a>
              <div className="flex items-center gap-3 text-white/38">
                <span className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center border border-white/6">
                  <MapPin size={13} />
                </span>
                Jaipur, Rajasthan, India
              </div>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-2.5">
              {socials.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-xl bg-white/6 border border-white/8 flex items-center justify-center text-white/30 hover:bg-[#b89a67]/20 hover:text-[#b89a67] hover:border-[#b89a67]/30 transition-all duration-300"
                >
                  {s.icon ? <s.icon size={15} /> : (
                    <span className="text-[10px] font-bold">{s.shortLabel}</span>
                  )}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="lg:col-span-2">
            <h4 className="text-[9.5px] font-bold uppercase tracking-[0.24em] text-white/28 mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-white/44 hover:text-white transition-colors duration-300 flex items-center gap-1.5 group"
                  >
                    <ArrowUpRight
                      size={10}
                      className="opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all text-[#b89a67]"
                    />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="lg:col-span-3">
            <h4 className="text-[9.5px] font-bold uppercase tracking-[0.24em] text-white/28 mb-6">
              Collections
            </h4>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    to={`/category/${cat.slug}`}
                    className="text-sm text-white/44 hover:text-white transition-colors duration-300 flex items-center gap-1.5 group"
                  >
                    <ArrowUpRight
                      size={10}
                      className="opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all text-[#b89a67]"
                    />
                    {cat.name}s
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="lg:col-span-3">
            <h4 className="text-[9.5px] font-bold uppercase tracking-[0.24em] text-white/28 mb-6">
              Support
            </h4>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-white/44 hover:text-white transition-colors duration-300 flex items-center gap-1.5 group"
                  >
                    <ArrowUpRight
                      size={10}
                      className="opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all text-[#b89a67]"
                    />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/6 py-7 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/22 flex items-center gap-1.5">
            © 2025 Dinine Craft. Crafted with
            <Heart size={9} className="text-[#b89a67]/60" fill="currentColor" />
            in India.
          </p>
          <div className="flex items-center gap-5 text-[10px] text-white/20">
            <span>Handmade</span>
            <span className="w-1 h-1 rounded-full bg-white/15" />
            <span>Eco-Friendly</span>
            <span className="w-1 h-1 rounded-full bg-white/15" />
            <span>Premium Quality</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
