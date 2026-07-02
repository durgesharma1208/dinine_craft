import { supabase } from '../lib/supabase';

const BUCKET = 'product-images';

export async function uploadImage(file, productId = null) {
  const ext = file.name.split('.').pop().toLowerCase();
  const fileName = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const filePath = productId ? `${productId}/${fileName}` : `gallery/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(filePath);

  return { path: filePath, url: publicUrl };
}

export async function deleteImage(path) {
  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([path]);

  if (error) throw error;
  return true;
}

export async function listImages(folder = '') {
  const prefix = folder || '';
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list(prefix, { sortBy: { column: 'created_at', order: 'desc' } });

  if (error) throw error;

  return data
    .filter((item) => !item.id)
    .map((item) => ({
      name: item.name,
      path: prefix ? `${prefix}/${item.name}` : item.name,
      url: supabase.storage.from(BUCKET).getPublicUrl(prefix ? `${prefix}/${item.name}` : item.name).data.publicUrl,
      size: item.metadata?.size || 0,
      created_at: item.created_at,
    }));
}

export async function getAllImages() {
  const { data: folders, error: listError } = await supabase.storage
    .from(BUCKET)
    .list();

  if (listError) throw listError;
  if (!folders || folders.length === 0) return [];

  const allImages = [];
  for (const folder of folders) {
    if (folder.id) continue;
    const { data: files, error } = await supabase.storage
      .from(BUCKET)
      .list(folder.name, { sortBy: { column: 'created_at', order: 'desc' } });

    if (!error && files) {
      files
        .filter((f) => f.id)
        .forEach((f) => {
          allImages.push({
            name: f.name,
            path: `${folder.name}/${f.name}`,
            url: supabase.storage.from(BUCKET).getPublicUrl(`${folder.name}/${f.name}`).data.publicUrl,
            size: f.metadata?.size || 0,
            created_at: f.created_at,
          });
        });
    }
  }
  return allImages.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}
