import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, FileText, Trash2, Edit3, ExternalLink, Loader2, FileDown, ImageOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchCatalogs, deleteCatalog } from '../../services/catalogService';
import { formatBytes, formatDate } from '../../utils/helpers';

export default function AdminCatalogs() {
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState(null);

  const load = useCallback(async () => {
    try {
      const data = await fetchCatalogs();
      setCatalogs(data);
    } catch { toast.error('Failed to load catalogs'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this catalog permanently?')) return;
    setDeleting(id);
    try {
      await deleteCatalog(id);
      setCatalogs(prev => prev.filter(c => c.id !== id));
      toast.success('Catalog deleted');
    } catch { toast.error('Failed to delete'); }
    finally { setDeleting(null); }
  };

  const filtered = catalogs.filter(c =>
    !search || c.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 size={24} className="animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl text-[#2a1e14] font-semibold">Catalogs</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage product catalogs and brochures</p>
        </div>
        <Link to="/admin/catalogs/new" className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light transition-colors">
          <Plus size={16} /> New Catalog
        </Link>
      </div>

      <div className="relative max-w-xs">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search catalogs..." className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <FileText size={40} className="mx-auto text-gray-200 mb-3" />
          <p className="text-gray-400 text-sm">{search ? 'No catalogs match your search' : 'No catalogs yet. Create your first one.'}</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((catalog, i) => (
            <motion.div key={catalog.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4"
            >
              <div className="w-16 h-20 rounded-lg overflow-hidden bg-cream flex-shrink-0 border border-gray-100">
                {catalog.cover_image_url ? (
                  <img src={catalog.cover_image_url} alt={catalog.title} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><ImageOff size={20} className="text-gray-300" /></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#2a1e14] truncate">{catalog.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {catalog.category?.name || 'Uncategorized'} · {catalog.page_count || '?'} pages · {formatBytes(catalog.file_size)}
                </p>
                <p className="text-xs text-gray-300 mt-0.5">Updated {formatDate(catalog.updated_at)}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <a href={catalog.pdf_url} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-primary transition-colors" title="Preview"><ExternalLink size={15} /></a>
                <a href={catalog.pdf_url} download className="p-2 text-gray-400 hover:text-primary transition-colors" title="Download"><FileDown size={15} /></a>
                <Link to={`/admin/catalogs/edit/${catalog.id}`} className="p-2 text-gray-400 hover:text-amber-600 transition-colors" title="Edit"><Edit3 size={15} /></Link>
                <button onClick={() => handleDelete(catalog.id)} disabled={deleting === catalog.id} className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50" title="Delete">
                  {deleting === catalog.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
