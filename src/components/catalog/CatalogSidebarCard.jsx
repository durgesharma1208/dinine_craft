import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Eye, Download, Loader2, BookOpen } from 'lucide-react';
import { formatBytes, formatDate } from '../../utils/helpers';

export default function CatalogSidebarCard({ catalogs, loading }) {
  if (loading) {
    return (
      <div className="premium-shell rounded-2xl p-5 flex items-center justify-center h-32 border border-[#c9a177]/10">
        <Loader2 size={18} className="animate-spin text-primary/60" />
      </div>
    );
  }

  if (!catalogs || catalogs.length === 0) return null;

  return (
    <div className="space-y-3">
      {catalogs.map((cat, i) => (
        <motion.div
          key={cat.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
          className="premium-shell rounded-2xl overflow-hidden bg-white/90 backdrop-blur-sm border border-[#c9a177]/15 shadow-[0_4px_20px_rgba(40,28,15,0.06)]"
        >
          <div className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#87663b]/10 flex items-center justify-center shrink-0">
                <FileText size={18} className="text-[#87663b]" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#87663b]/50">Premium Catalog</p>
                <p className="text-sm font-semibold text-[#28221a] truncate">{cat.title}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-gray-400 mb-4 flex-wrap">
              <span className="flex items-center gap-1"><BookOpen size={11} /> {cat.page_count || '?'} pages</span>
              <span>{formatBytes(cat.file_size)}</span>
              <span>Updated {formatDate(cat.updated_at)}</span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to={`/catalog/${cat.id}`}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#87663b]/8 text-[#87663b] text-xs font-semibold hover:bg-[#87663b]/15 transition-all"
              >
                <Eye size={13} /> View PDF
              </Link>
              <a
                href={cat.pdf_url}
                download
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-light hover:shadow-lg hover:shadow-primary/20 transition-all"
              >
                <Download size={12} /> Download
              </a>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
