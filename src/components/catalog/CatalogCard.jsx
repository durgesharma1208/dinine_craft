import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Eye, Download, BookOpen, Calendar, Maximize2 } from 'lucide-react';
import { formatBytes, formatDate } from '../../utils/helpers';

export default function CatalogCard({ catalog, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <div className="bg-white rounded-2xl overflow-hidden border border-[#c9a177]/12 shadow-[0_4px_20px_rgba(40,28,15,0.06)] hover:shadow-[0_12px_40px_rgba(40,28,15,0.1)] transition-all duration-500 h-full flex flex-col">
        {/* Cover Image */}
        <Link to={`/catalog/${catalog.id}`} className="block relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-cream to-[#f5ece0] flex-shrink-0">
          {catalog.cover_image_url ? (
            <img
              src={catalog.cover_image_url}
              alt={catalog.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <FileText size={40} className="text-[#c9a177]/30" />
              <span className="text-[11px] font-medium text-[#c9a177]/40 uppercase tracking-wider">PDF Document</span>
            </div>
          )}
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-[11px] font-semibold text-[#28221a] shadow-lg">
              <Eye size={12} /> Preview
            </span>
          </div>
        </Link>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Title & Category */}
          <Link to={`/catalog/${catalog.id}`} className="group/title">
            <h3 className="font-display text-[#28221a] font-semibold leading-tight group-hover/title:text-primary transition-colors line-clamp-1 text-base">
              {catalog.title}
            </h3>
          </Link>

          {catalog.description && (
            <p className="text-xs text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">
              {catalog.description}
            </p>
          )}

          {catalog.category && (
            <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#87663b]/60">
              <BookOpen size={10} /> {catalog.category.name}
            </span>
          )}

          {/* Metadata chips */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#87663b]/6 rounded-md text-[10px] font-medium text-[#87663b]/70">
              <Maximize2 size={10} /> {catalog.page_count || '?'} pages
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#87663b]/6 rounded-md text-[10px] font-medium text-[#87663b]/70">
              <FileText size={10} /> {formatBytes(catalog.file_size)}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#87663b]/6 rounded-md text-[10px] font-medium text-[#87663b]/70">
              <Calendar size={10} /> {formatDate(catalog.updated_at)}
            </span>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Action buttons */}
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#c9a177]/10">
            <Link
              to={`/catalog/${catalog.id}`}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#87663b]/8 text-[#87663b] text-xs font-semibold hover:bg-[#87663b]/15 hover:text-[#87663b] transition-all"
            >
              <Eye size={14} /> View Online
            </Link>
            <a
              href={catalog.pdf_url}
              download
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-light hover:shadow-lg hover:shadow-primary/20 transition-all"
            >
              <Download size={13} /> Download PDF
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
