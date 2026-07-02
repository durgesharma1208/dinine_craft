import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus, Search, Edit, Trash2, Copy, Eye, Loader2, AlertCircle,
  Package, ChevronLeft, ChevronRight, Filter, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchAllProducts } from '../../services/productService';
import { deleteProduct, duplicateProduct } from '../../services/adminService';
import { formatPrice, truncate } from '../../utils/helpers';

export default function AdminProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(new Set());
  const [filters, setFilters] = useState({ category: '', status: '', featured: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const perPage = 12;

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAllProducts();
      setProducts(data);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const filtered = products.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.sku?.toLowerCase().includes(search.toLowerCase())) return false;
    if (filters.category && p.category_slug !== filters.category) return false;
    if (filters.featured === 'featured' && !p.featured) return false;
    if (filters.featured === 'bestseller' && !p.bestSeller) return false;
    if (filters.featured === 'trending' && !p.trending) return false;
    if (filters.featured === 'new' && !p.newArrival) return false;
    if (filters.status === 'low' && p.stock > 3) return false;
    if (filters.status === 'out' && p.stock > 0) return false;
    if (filters.status === 'in' && p.stock === 0) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      toast.success('Product deleted');
      setDeleteConfirm(null);
      loadProducts();
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  const handleDuplicate = async (id) => {
    try {
      await duplicateProduct(id);
      toast.success('Product duplicated');
      loadProducts();
    } catch (err) {
      toast.error(err.message || 'Failed to duplicate');
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selected.size} products?`)) return;
    for (const id of selected) {
      try { await deleteProduct(id); } catch {}
    }
    toast.success(`${selected.size} products deleted`);
    setSelected(new Set());
    loadProducts();
  };

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === paginated.length) setSelected(new Set());
    else setSelected(new Set(paginated.map((p) => p.id)));
  };

  const categories = [...new Set(products.map((p) => p.category_slug).filter(Boolean))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl text-[#2a1e14] font-semibold">Products</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} products</p>
        </div>
        <div className="flex items-center gap-2">
          {selected.size > 0 && (
            <button onClick={handleBulkDelete} className="px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100 transition-colors">
              Delete ({selected.size})
            </button>
          )}
          <button onClick={() => setShowFilters(!showFilters)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-1.5">
            <Filter size={14} />
            Filters
          </button>
          <Link to="/admin/products/new" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light transition-colors flex items-center gap-1.5">
            <Plus size={16} />
            Add Product
          </Link>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Category</label>
            <select value={filters.category} onChange={(e) => { setFilters({ ...filters, category: e.target.value }); setPage(1); }}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white">
              <option value="">All</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Type</label>
            <select value={filters.featured} onChange={(e) => { setFilters({ ...filters, featured: e.target.value }); setPage(1); }}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white">
              <option value="">All</option>
              <option value="featured">Featured</option>
              <option value="bestseller">Best Seller</option>
              <option value="trending">Trending</option>
              <option value="new">New Arrival</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Stock</label>
            <select value={filters.status} onChange={(e) => { setFilters({ ...filters, status: e.target.value }); setPage(1); }}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white">
              <option value="">All</option>
              <option value="in">In Stock</option>
              <option value="low">Low Stock (&le;3)</option>
              <option value="out">Out of Stock</option>
            </select>
          </div>
          <button onClick={() => { setFilters({ category: '', status: '', featured: '' }); setSearch(''); }}
            className="self-end px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
            <X size={14} /> Clear
          </button>
        </div>
      )}

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search products by name or SKU..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 size={24} className="animate-spin text-primary" />
        </div>
      ) : paginated.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Package size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No products found</p>
          <Link to="/admin/products/new" className="inline-flex items-center gap-1 text-primary text-sm mt-2 hover:text-primary-light">
            <Plus size={14} /> Add your first product
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="p-3 text-left">
                    <input type="checkbox" checked={selected.size === paginated.length && paginated.length > 0}
                      onChange={toggleAll} className="rounded border-gray-300" />
                  </th>
                  <th className="p-3 text-left text-gray-500 font-medium">Product</th>
                  <th className="p-3 text-left text-gray-500 font-medium hidden md:table-cell">Category</th>
                  <th className="p-3 text-left text-gray-500 font-medium">Price</th>
                  <th className="p-3 text-left text-gray-500 font-medium hidden sm:table-cell">Stock</th>
                  <th className="p-3 text-left text-gray-500 font-medium hidden lg:table-cell">Status</th>
                  <th className="p-3 text-right text-gray-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="p-3">
                      <input type="checkbox" checked={selected.has(p.id)}
                        onChange={() => toggleSelect(p.id)} className="rounded border-gray-300" />
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                          {p.thumbnail ? (
                            <img src={p.thumbnail} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center"><Package size={16} className="text-gray-400" /></div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-[#2a1e14]">{truncate(p.name, 40)}</p>
                          {p.sku && <p className="text-xs text-gray-400">SKU: {p.sku}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-gray-600 hidden md:table-cell">{p.category}</td>
                    <td className="p-3">
                      <span className="font-medium text-[#2a1e14]">{formatPrice(p.price)}</span>
                      {p.discount > 0 && <span className="text-xs text-red-500 ml-1">-{p.discount}%</span>}
                    </td>
                    <td className="p-3 hidden sm:table-cell">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        p.stock === 0 ? 'bg-red-50 text-red-600' :
                        p.stock <= 3 ? 'bg-orange-50 text-orange-600' :
                        p.stock <= 10 ? 'bg-yellow-50 text-yellow-700' :
                        'bg-green-50 text-green-600'
                      }`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="p-3 hidden lg:table-cell">
                      <div className="flex gap-1 flex-wrap">
                        {p.featured && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">Featured</span>}
                        {p.bestSeller && <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded">Best</span>}
                        {p.trending && <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">Trend</span>}
                        {p.newArrival && <span className="text-[10px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded">New</span>}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => window.open(`/product/${p.slug}`, '_blank')}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors" title="Preview">
                          <Eye size={15} />
                        </button>
                        <button onClick={() => navigate(`/admin/products/edit/${p.id}`)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors" title="Edit">
                          <Edit size={15} />
                        </button>
                        <button onClick={() => handleDuplicate(p.id)}
                          className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600 transition-colors" title="Duplicate">
                          <Copy size={15} />
                        </button>
                        <button onClick={() => setDeleteConfirm(p.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors" title="Delete">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
          <div className="flex items-center gap-1">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed">
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button key={n} onClick={() => setPage(n)}
                className={`w-8 h-8 rounded-lg text-sm ${
                  n === page ? 'bg-primary text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}>
                {n}
              </button>
            ))}
            <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
            <AlertCircle size={40} className="text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-center text-[#2a1e14] mb-2">Delete Product?</h3>
            <p className="text-sm text-gray-500 text-center mb-5">This action cannot be undone. The product and its images will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
