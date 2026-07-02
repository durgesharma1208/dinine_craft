import { useState, useEffect, useCallback } from 'react';
import { Tags, Plus, Edit, Trash2, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchCategories } from '../../services/categoryService';
import { createCategory, updateCategory, deleteCategory } from '../../services/adminService';
import { slugify } from '../../utils/helpers';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '', description: '', image: '' });
  const [autoSlug, setAutoSlug] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const load = useCallback(async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch { toast.error('Failed to load categories'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setForm({ name: '', slug: '', description: '', image: '' });
    setAutoSlug(true);
    setModal('create');
  };

  const openEdit = (cat) => {
    setForm({ name: cat.name, slug: cat.slug, description: cat.description || '', image: cat.image || '' });
    setAutoSlug(false);
    setModal(cat.id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.slug.trim()) return;
    setSaving(true);
    try {
      if (modal === 'create') {
        await createCategory(form);
        toast.success('Category created');
      } else {
        await updateCategory(modal, form);
        toast.success('Category updated');
      }
      setModal(null);
      load();
    } catch (err) { toast.error(err.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      toast.success('Category deleted');
      setDeleteConfirm(null);
      load();
    } catch (err) { toast.error(err.message || 'Failed to delete'); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 size={24} className="animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-[#2a1e14] font-semibold">Categories</h1>
          <p className="text-sm text-gray-500 mt-0.5">{categories.length} categories</p>
        </div>
        <button onClick={openCreate} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light transition-colors flex items-center gap-1.5">
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
            <div className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden shrink-0">
              {cat.image ? (
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" loading="lazy" />
              ) : (
                <div className="w-full h-full flex items-center justify-center"><Tags size={20} className="text-gray-400" /></div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-[#2a1e14]">{cat.name}</p>
              <p className="text-xs text-gray-400 truncate">{cat.slug}</p>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => openEdit(cat)} className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600"><Edit size={14} /></button>
              <button onClick={() => setDeleteConfirm(cat.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-semibold text-[#2a1e14] mb-4">{modal === 'create' ? 'Add Category' : 'Edit Category'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input value={form.name} onChange={(e) => {
                  const name = e.target.value;
                  setForm((prev) => ({ ...prev, name, slug: autoSlug ? slugify(name) : prev.slug }));
                }} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <div className="relative">
                  <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50" required />
                  <button type="button" onClick={() => setAutoSlug(!autoSlug)}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 text-[10px] px-1.5 py-0.5 rounded ${autoSlug ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'}`}>Auto</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(null)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  {modal === 'create' ? 'Create' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
            <AlertCircle size={40} className="text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-center text-[#2a1e14] mb-2">Delete Category?</h3>
            <p className="text-sm text-gray-500 text-center mb-5">This will permanently delete this category.</p>
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
