import { useState, useEffect, useCallback } from 'react';
import { Star, Plus, Edit, Trash2, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchTestimonials } from '../../services/contentService';
import { createTestimonial, updateTestimonial, deleteTestimonial } from '../../services/adminService';

export default function AdminTestimonials() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [form, setForm] = useState({ name: '', location: '', rating: 5, text: '', sort_order: 0, active: true });

  const load = useCallback(async () => {
    try { const d = await fetchTestimonials(); setItems(d); }
    catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setForm({ name: '', location: '', rating: 5, text: '', sort_order: items.length, active: true });
    setModal('create');
  };

  const openEdit = (item) => {
    setForm({ name: item.name, location: item.location || '', rating: item.rating, text: item.text, sort_order: item.sort_order || 0, active: item.active });
    setModal(item.id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.text.trim()) return;
    setSaving(true);
    try {
      if (modal === 'create') { await createTestimonial(form); toast.success('Testimonial created'); }
      else { await updateTestimonial(modal, form); toast.success('Testimonial updated'); }
      setModal(null); load();
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await deleteTestimonial(id); toast.success('Deleted'); setDeleteConfirm(null); load(); }
    catch (err) { toast.error(err.message); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 size={24} className="animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="font-display text-2xl text-[#2a1e14] font-semibold">Testimonials</h1><p className="text-sm text-gray-500 mt-0.5">{items.length} testimonials</p></div>
        <button onClick={openCreate} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light flex items-center gap-1.5"><Plus size={16} /> Add Testimonial</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item.id} className={`bg-white rounded-xl border p-4 ${!item.active ? 'border-gray-200 opacity-60' : 'border-gray-200'}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary">{item.name[0]}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#2a1e14]">{item.name}</p>
                  {item.location && <p className="text-xs text-gray-400">{item.location}</p>}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600"><Edit size={14} /></button>
                <button onClick={() => setDeleteConfirm(item.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600"><Trash2 size={14} /></button>
              </div>
            </div>
            <div className="flex gap-0.5 my-2">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} size={12} fill={i < item.rating ? '#b89a67' : 'none'} className={i < item.rating ? 'text-gold' : 'text-gray-300'} />
              ))}
            </div>
            <p className="text-sm text-gray-600 line-clamp-3">{item.text}</p>
            {!item.active && <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded mt-2 inline-block">Inactive</span>}
          </div>
        ))}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-xl">
            <h3 className="text-lg font-semibold text-[#2a1e14] mb-4">{modal === 'create' ? 'Add Testimonial' : 'Edit Testimonial'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Name *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50" required /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Location</label><input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" /></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <select value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
                  {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}
                </select>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Review *</label><textarea value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none" required /></div>
              <label className="flex items-center gap-2"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="rounded border-gray-300 text-primary" /><span className="text-sm text-gray-700">Active</span></label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(null)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving && <Loader2 size={14} className="animate-spin" />}{modal === 'create' ? 'Create' : 'Update'}
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
            <h3 className="text-lg font-semibold text-center text-[#2a1e14] mb-2">Delete Testimonial?</h3>
            <p className="text-sm text-gray-500 text-center mb-5">This action cannot be undone.</p>
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
