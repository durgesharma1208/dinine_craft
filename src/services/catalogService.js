import { supabase } from '../lib/supabase';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const BUCKET = 'catalogs';
const MAX_SIZE = 25 * 1024 * 1024;

function getPublicUrl(path) {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

function extractStoragePathFromUrl(url) {
  const prefix = `/storage/v1/object/public/${BUCKET}/`;
  const idx = url.indexOf(prefix);
  if (idx === -1) return null;
  return url.split(prefix)[1];
}

export async function checkBucket() {
  const { data, error } = await supabase.storage.from(BUCKET).list('', { limit: 1 });
  if (error) {
    if (error.message?.includes('bucket') || error.error?.includes('bucket')) {
      throw new Error(`Bucket "${BUCKET}" not found. Create it in Supabase Dashboard → Storage, set it to Public, then retry.`);
    }
    throw new Error(`Bucket check failed: ${error.message || error.error || 'Unknown error'}`);
  }
  return true;
}

async function uploadFile(file, prefix) {
  const ext = file.name.split('.').pop() || 'pdf';
  const fileName = prefix ? `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}` : `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData?.session?.access_token;
  if (!token) throw new Error('No active session. Please log in again.');

  const url = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${fileName}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': file.type || 'application/octet-stream',
    },
    body: file,
  });

  if (!response.ok) {
    let body = '';
    try { body = await response.text(); } catch {}
    const status = response.status;
    if (status === 400) {
      if (body.includes('bucket') || body.includes('Bucket')) {
        throw new Error(`Storage bucket "${BUCKET}" not found. Verify it's created and Public in Supabase Dashboard → Storage.`);
      }
      if (body.includes('duplicate') || body.includes('Duplicate')) {
        throw new Error('File already exists. Try again.');
      }
      if (body.includes('size') || body.includes('large')) {
        throw new Error('File too large. Maximum is 25 MB.');
      }
    }
    if (status === 401 || status === 403) {
      throw new Error('Upload permission denied. Make sure you are logged in as admin and the RLS policies are applied.');
    }
    throw new Error(`Upload failed (HTTP ${status}): ${body || 'No details'}`);
  }

  return { path: fileName, url: getPublicUrl(fileName) };
}

export async function fetchCatalogs() {
  const { data, error } = await supabase
    .from('catalogs')
    .select('*, category:category_id(name, slug)')
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function fetchCatalogsByCategory(categoryId) {
  const { data, error } = await supabase
    .from('catalogs')
    .select('*, category:category_id(name, slug)')
    .eq('category_id', categoryId)
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function fetchCatalogById(id) {
  const { data, error } = await supabase
    .from('catalogs')
    .select('*, category:category_id(name, slug)')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function uploadPDF(file) {
  if (file.type !== 'application/pdf') throw new Error('Only PDF files are allowed');
  if (file.size > MAX_SIZE) throw new Error('File size exceeds 25 MB limit');

  return uploadFile(file, '');
}

export async function uploadCover(file) {
  return uploadFile(file, 'cover');
}

export async function createCatalog(data) {
  const { error } = await supabase.from('catalogs').insert({
    title: data.title,
    description: data.description || '',
    category_id: data.category_id || null,
    pdf_url: data.pdf_url,
    cover_image_url: data.cover_image_url || null,
    file_size: data.file_size || 0,
    page_count: data.page_count || 0,
  });
  if (error) throw error;
  return true;
}

export async function updateCatalog(id, data) {
  const { error } = await supabase
    .from('catalogs')
    .update({
      title: data.title,
      description: data.description,
      category_id: data.category_id,
      pdf_url: data.pdf_url,
      cover_image_url: data.cover_image_url,
      file_size: data.file_size,
      page_count: data.page_count,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);
  if (error) throw error;
  return true;
}

export async function deleteCatalog(id) {
  const { data: catalog } = await supabase
    .from('catalogs')
    .select('pdf_url, cover_image_url')
    .eq('id', id)
    .maybeSingle();

  const pathsToDelete = [];
  if (catalog?.pdf_url) {
    const path = extractStoragePathFromUrl(catalog.pdf_url);
    if (path) pathsToDelete.push(path);
  }
  if (catalog?.cover_image_url) {
    const path = extractStoragePathFromUrl(catalog.cover_image_url);
    if (path) pathsToDelete.push(path);
  }
  if (pathsToDelete.length > 0) {
    await supabase.storage.from(BUCKET).remove(pathsToDelete).catch(() => {});
  }

  const { error } = await supabase.from('catalogs').delete().eq('id', id);
  if (error) throw error;
  return true;
}
