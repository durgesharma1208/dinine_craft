import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, FileText, Image, Loader2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchCategories } from '../../services/categoryService';
import { uploadPDF, uploadCover, createCatalog, updateCatalog, fetchCatalogById } from '../../services/catalogService';

export default function AdminCatalogForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [existingPdfUrl, setExistingPdfUrl] = useState('');
  const [existingCoverUrl, setExistingCoverUrl] = useState('');
  const [pageCount, setPageCount] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories()
      .then(data => setCategories(data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!isEdit) { setLoading(false); return; }
    fetchCatalogById(id)
      .then(catalog => {
        if (!catalog) { toast.error('Catalog not found'); navigate('/admin/catalogs'); return; }
        setTitle(catalog.title);
        setDescription(catalog.description || '');
        setCategoryId(catalog.category_id ? String(catalog.category_id) : '');
        setExistingPdfUrl(catalog.pdf_url);
        setExistingCoverUrl(catalog.cover_image_url || '');
        setPageCount(catalog.page_count || 0);
      })
      .catch(() => toast.error('Failed to load catalog'))
      .finally(() => setLoading(false));
  }, [id, isEdit, navigate]);

  const handlePdfChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') { toast.error('Only PDF files are allowed'); return; }
    if (file.size > 25 * 1024 * 1024) { toast.error('File size exceeds 25 MB limit'); return; }
    setPdfFile(file);
    setUploadProgress(0);
  };

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Only image files are allowed'); return; }
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) { toast.error('Title is required'); return; }
    if (!pdfFile && !existingPdfUrl) { toast.error('Please upload a PDF'); return; }

    setSaving(true);

    try {
      let pdfUrl = existingPdfUrl;
      let fileSize = 0;
      let pages = pageCount;

      if (pdfFile) {
        setUploadProgress(10);
        const result = await uploadPDF(pdfFile);
        pdfUrl = result.url;
        fileSize = pdfFile.size;
        setUploadProgress(80);
        pages = 1;
        setUploadProgress(100);
      }

      let coverUrl = existingCoverUrl;
      if (coverFile) {
        const result = await uploadCover(coverFile);
        coverUrl = result.url;
      }

      const data = { title: title.trim(), description: description.trim(), category_id: categoryId ? Number(categoryId) : null, pdf_url: pdfUrl, cover_image_url: coverUrl, file_size: fileSize, page_count: pages };

      if (isEdit) {
        await updateCatalog(id, data);
        toast.success('Catalog updated');
      } else {
        await createCatalog(data);
        toast.success('Catalog created');
      }
      navigate('/admin/catalogs');
    } catch (err) {
      toast.error(err.message || 'Failed to save catalog');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 size={24} className="animate-spin text-primary" /></div>;

  return (
    <div className="max-w-2xl">
      <button onClick={() => navigate('/admin/catalogs')} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors mb-6">
        <ArrowLeft size={15} /> Back to Catalogs
      </button>

      <h1 className="font-display text-2xl text-[#2a1e14] font-semibold mb-8">{isEdit ? 'Edit Catalog' : 'New Catalog'}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Summer Collection 2025" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Brief description of this catalog..." className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
            <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white">
              <option value="">All Categories</option>
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">PDF File *</label>
            {existingPdfUrl && !pdfFile && (
              <div className="flex items-center gap-3 mb-3 p-3 bg-cream/50 rounded-lg border border-gray-100">
                <FileText size={20} className="text-primary" />
                <span className="text-sm text-gray-600 flex-1 truncate">Current PDF uploaded</span>
                <a href={existingPdfUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">View</a>
              </div>
            )}
            <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-primary/40 hover:bg-cream/30 transition-all">
              <div className="flex flex-col items-center gap-1.5 text-gray-400">
                <Upload size={22} />
                <span className="text-sm">{pdfFile ? pdfFile.name : 'Click to upload PDF (max 25 MB)'}</span>
                {pdfFile && <span className="text-xs text-gray-300">{(pdfFile.size / 1024 / 1024).toFixed(1)} MB</span>}
              </div>
              <input type="file" accept=".pdf,application/pdf" onChange={handlePdfChange} className="hidden" />
            </label>
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Cover Image</label>
            {(coverPreview || existingCoverUrl) && (
              <div className="relative w-32 h-40 mb-3 rounded-lg overflow-hidden border border-gray-200">
                <img src={coverPreview || existingCoverUrl} alt="Cover preview" className="w-full h-full object-cover" />
                <button type="button" onClick={() => { setCoverFile(null); setCoverPreview(null); setExistingCoverUrl(''); }} className="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"><X size={12} /></button>
              </div>
            )}
            <label className="flex items-center justify-center h-24 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-primary/40 hover:bg-cream/30 transition-all">
              <div className="flex items-center gap-2 text-gray-400">
                <Image size={18} />
                <span className="text-sm">{coverFile ? coverFile.name : 'Upload cover image'}</span>
              </div>
              <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Page Count</label>
            <input type="number" value={pageCount} onChange={e => setPageCount(Math.max(0, Number(e.target.value)))} min={0} className="w-32 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="0" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light transition-colors disabled:opacity-50">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? 'Saving...' : isEdit ? 'Update Catalog' : 'Create Catalog'}
          </button>
          <button type="button" onClick={() => navigate('/admin/catalogs')} className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
        </div>
      </form>
    </div>
  );
}
