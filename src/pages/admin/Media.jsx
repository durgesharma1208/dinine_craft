import { useState, useEffect, useRef } from 'react';
import { Image, Upload, Trash2, Copy, Search, Loader2, Check, ImagePlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAllImages, uploadImage, deleteImage } from '../../services/mediaService';

export default function AdminMedia() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const fileRef = useRef(null);
  const dropRef = useRef(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getAllImages();
      setImages(data);
    } catch { toast.error('Failed to load media'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleUpload = async (files) => {
    if (!files?.length) return;
    setUploading(true);
    let uploaded = 0;
    for (const file of files) {
      try {
        await uploadImage(file);
        uploaded++;
      } catch { toast.error(`Failed to upload ${file.name}`); }
    }
    if (uploaded > 0) toast.success(`${uploaded} image(s) uploaded`);
    setUploading(false);
    load();
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleDelete = async (path) => {
    setDeleting(true);
    try {
      await deleteImage(path);
      toast.success('Image deleted');
      setDeleteConfirm(null);
      load();
    } catch { toast.error('Failed to delete'); }
    finally { setDeleting(false); }
  };

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url);
    setCopiedId(url);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success('URL copied');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
    if (files.length) handleUpload(files);
  };

  const filtered = images.filter((img) =>
    img.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-[#2a1e14] font-semibold">Media Library</h1>
          <p className="text-sm text-gray-500 mt-0.5">{images.length} images</p>
        </div>
        <button onClick={() => fileRef.current?.click()} disabled={uploading}
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light transition-colors disabled:opacity-50 flex items-center gap-1.5">
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search images..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50" />
      </div>

      <input ref={fileRef} type="file" accept="image/*" multiple
        onChange={(e) => handleUpload(Array.from(e.target.files))} className="hidden" />

      <div
        ref={dropRef}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer"
        onClick={() => fileRef.current?.click()}
      >
        <ImagePlus size={32} className="text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-500">Drag & drop images here, or click to browse</p>
        <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP up to 5MB</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64"><Loader2 size={24} className="animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Image size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">{search ? 'No matching images' : 'No images uploaded yet'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map((img) => (
            <div key={img.path} className="group relative aspect-square rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
              <img src={img.url} alt={img.name} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button onClick={() => copyUrl(img.url)}
                  className="p-2 bg-white rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                  {copiedId === img.url ? <Check size={14} /> : <Copy size={14} />}
                </button>
                <button onClick={() => setDeleteConfirm(img)}
                  className="p-2 bg-red-500 rounded-lg text-white hover:bg-red-600 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
              <p className="absolute bottom-0 inset-x-0 text-[10px] text-white bg-black/50 px-2 py-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                {img.name}
              </p>
            </div>
          ))}
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
            <div className="w-full h-32 rounded-lg overflow-hidden mb-4 bg-gray-100">
              <img src={deleteConfirm.url} alt="" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-lg font-semibold text-center text-[#2a1e14] mb-2">Delete Image?</h3>
            <p className="text-sm text-gray-500 text-center mb-5">This will permanently remove the image from storage.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm.path)} disabled={deleting}
                className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 disabled:opacity-50 flex items-center justify-center gap-2">
                {deleting && <Loader2 size={14} className="animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
