import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Save, ArrowLeft, Loader2, X, ImagePlus
} from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchAllProducts } from '../../services/productService';
import { createProduct, updateProduct } from '../../services/adminService';
import { fetchCategories } from '../../services/categoryService';
import { uploadImage } from '../../services/mediaService';
import { slugify } from '../../utils/helpers';

const emptyForm = {
  name: '', slug: '', category_id: '', price: '', original_price: '', discount: '0',
  description: '', material: '', dimensions: '', weight: '', stock: '0', sku: '',
  featured: false, best_seller: false, trending: false, new_arrival: false,
  customizable: false, availability: 'In Stock', tags: '', images: [],
};

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [autoSlug, setAutoSlug] = useState(true);
  const fileRef = useRef(null);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
    if (isEdit) {
      setLoading(true);
      fetchAllProducts().then((products) => {
        const p = products.find((pr) => pr.id === Number(id));
        if (p) {
          setForm({
            name: p.name, slug: p.slug, category_id: p.category_id?.toString() || '',
            price: p.price.toString(), original_price: p.originalPrice?.toString() || '',
            discount: p.discount?.toString() || '0',
            description: p.description || '', material: p.material || '',
            dimensions: p.dimensions || '', weight: p.weight || '',
            stock: p.stock?.toString() || '0', sku: p.sku || '',
            featured: p.featured || false, best_seller: p.bestSeller || false,
            trending: p.trending || false, new_arrival: p.newArrival || false,
            customizable: p.customizable || false,
            availability: p.availability || 'In Stock',
            tags: (p.tags || []).join(', '),
            images: (p.images || []).map((url, i) => ({
              url,
              is_thumbnail: i === 0,
              file: null,
              preview: url,
            })),
          });
        }
      }).catch(() => toast.error('Failed to load product'))
      .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setForm((prev) => {
      const next = { ...prev, [name]: val };
      if (name === 'name' && autoSlug && !isEdit) {
        next.slug = slugify(val);
      }
      return next;
    });
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const handleImagesUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setUploading(true);
    try {
      const newImages = files.map((file) => ({
        url: '',
        is_thumbnail: form.images.length === 0,
        file,
        preview: URL.createObjectURL(file),
      }));
      setForm((prev) => ({ ...prev, images: [...prev.images, ...newImages] }));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const removeImage = (index) => {
    setForm((prev) => {
      const images = prev.images.filter((_, i) => i !== index);
      if (images.length > 0 && !images.some((img) => img.is_thumbnail)) {
        images[0].is_thumbnail = true;
      }
      return { ...prev, images };
    });
  };

  const setThumbnail = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.map((img, i) => ({ ...img, is_thumbnail: i === index })),
    }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.slug.trim()) errs.slug = 'Slug is required';
    if (!form.category_id) errs.category_id = 'Category is required';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) errs.price = 'Valid price is required';
    if (form.discount && (isNaN(Number(form.discount)) || Number(form.discount) < 0 || Number(form.discount) > 100))
      errs.discount = 'Discount must be 0-100';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const uploadedImages = [];
      for (const img of form.images) {
        if (img.file) {
          const result = await uploadImage(img.file, isEdit ? id : 'temp');
          uploadedImages.push({ url: result.url, is_thumbnail: img.is_thumbnail });
        } else {
          uploadedImages.push({ url: img.url, is_thumbnail: img.is_thumbnail });
        }
      }

      const data = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        category_id: Number(form.category_id),
        price: Number(form.price),
        original_price: form.original_price ? Number(form.original_price) : null,
        discount: Number(form.discount) || 0,
        description: form.description,
        material: form.material,
        dimensions: form.dimensions,
        weight: form.weight,
        stock: Number(form.stock) || 0,
        sku: form.sku,
        featured: form.featured,
        best_seller: form.best_seller,
        trending: form.trending,
        new_arrival: form.new_arrival,
        customizable: form.customizable,
        availability: form.availability,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        images: uploadedImages,
      };

      if (isEdit) {
        await updateProduct(Number(id), data);
        toast.success('Product updated');
      } else {
        await createProduct(data);
        toast.success('Product created');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={24} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/admin/products')} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="font-display text-2xl text-[#2a1e14] font-semibold">{isEdit ? 'Edit Product' : 'Add Product'}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{isEdit ? `Updating product #${id}` : 'Create a new product'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <h2 className="font-display text-lg text-[#2a1e14] font-semibold">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input name="name" value={form.name} onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500/50' : 'border-gray-200 focus:border-primary focus:ring-primary/50'}`} />
              {errors.name && <p className="text-xs text-red-500 mt-0.5">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <div className="relative">
                <input name="slug" value={form.slug} onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 ${errors.slug ? 'border-red-300 focus:border-red-500 focus:ring-red-500/50' : 'border-gray-200 focus:border-primary focus:ring-primary/50'}`} />
                {!isEdit && (
                  <button type="button" onClick={() => setAutoSlug(!autoSlug)}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 text-[10px] px-1.5 py-0.5 rounded ${autoSlug ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'}`}>
                    Auto
                  </button>
                )}
              </div>
              {errors.slug && <p className="text-xs text-red-500 mt-0.5">{errors.slug}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select name="category_id" value={form.category_id} onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-1 ${errors.category_id ? 'border-red-300' : 'border-gray-200 focus:border-primary focus:ring-primary/50'}`}>
                <option value="">Select category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {errors.category_id && <p className="text-xs text-red-500 mt-0.5">{errors.category_id}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
              <input name="sku" value={form.sku} onChange={handleChange} placeholder="e.g. KH-001"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 resize-none" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <h2 className="font-display text-lg text-[#2a1e14] font-semibold">Pricing & Inventory</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
              <input name="price" value={form.price} onChange={handleChange} type="number" step="0.01" min="0"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 ${errors.price ? 'border-red-300' : 'border-gray-200 focus:border-primary focus:ring-primary/50'}`} />
              {errors.price && <p className="text-xs text-red-500 mt-0.5">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Original Price</label>
              <input name="original_price" value={form.original_price} onChange={handleChange} type="number" step="0.01" min="0"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
              <input name="discount" value={form.discount} onChange={handleChange} type="number" min="0" max="100"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 ${errors.discount ? 'border-red-300' : 'border-gray-200 focus:border-primary focus:ring-primary/50'}`} />
              {errors.discount && <p className="text-xs text-red-500 mt-0.5">{errors.discount}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input name="stock" value={form.stock} onChange={handleChange} type="number" min="0"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
              <select name="availability" value={form.availability} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50">
                <option value="In Stock">In Stock</option>
                <option value="Made to Order">Made to Order</option>
                <option value="Out of Stock">Out of Stock</option>
                <option value="Discontinued">Discontinued</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
              <input name="tags" value={form.tags} onChange={handleChange} placeholder="handmade, wooden, gift"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <h2 className="font-display text-lg text-[#2a1e14] font-semibold">Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
              <input name="material" value={form.material} onChange={handleChange} placeholder="e.g. Mango Wood"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions</label>
              <input name="dimensions" value={form.dimensions} onChange={handleChange} placeholder="e.g. 6 x 4 inches"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
              <input name="weight" value={form.weight} onChange={handleChange} placeholder="e.g. 150g"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-display text-lg text-[#2a1e14] font-semibold">Product Images</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {form.images.map((img, i) => (
              <div key={i} className="relative group aspect-square rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
                <img src={img.preview || img.url} alt={`Product ${i + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  {!img.is_thumbnail && (
                    <button type="button" onClick={() => setThumbnail(i)}
                      className="p-1.5 bg-white rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-100">
                      Cover
                    </button>
                  )}
                  <button type="button" onClick={() => removeImage(i)}
                    className="p-1.5 bg-red-500 rounded-lg text-white hover:bg-red-600">
                    <X size={12} />
                  </button>
                </div>
                {img.is_thumbnail && (
                  <span className="absolute top-1 left-1 text-[10px] bg-primary text-white px-1.5 py-0.5 rounded">Cover</span>
                )}
              </div>
            ))}
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
              className="aspect-square rounded-lg border-2 border-dashed border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-primary">
              {uploading ? <Loader2 size={20} className="animate-spin" /> : <ImagePlus size={20} />}
              <span className="text-xs">{uploading ? 'Uploading...' : 'Add Image'}</span>
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleImagesUpload} className="hidden" />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-display text-lg text-[#2a1e14] font-semibold">Badges & Flags</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {[
              { key: 'featured', label: 'Featured' },
              { key: 'best_seller', label: 'Best Seller' },
              { key: 'trending', label: 'Trending' },
              { key: 'new_arrival', label: 'New Arrival' },
              { key: 'customizable', label: 'Customizable' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input type="checkbox" name={key} checked={form[key]} onChange={handleChange}
                  className="rounded border-gray-300 text-primary focus:ring-primary/50" />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pb-8">
          <button type="button" onClick={() => navigate('/admin/products')}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={saving}
            className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light transition-colors disabled:opacity-50 flex items-center gap-2">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
