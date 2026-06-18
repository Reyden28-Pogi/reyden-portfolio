import { supabase } from "./supabaseClient";

/**
 * Upload a file to a Supabase storage bucket
 * @param {File} file - The file to upload
 * @param {string} bucket - Bucket name: 'profile' | 'certificates' | 'projects'
 * @param {string} path - File path inside bucket e.g. 'cert-1.jpg'
 * @returns {string|null} Public URL or null on error
 */
export async function uploadFile(file, bucket, path) {
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true });

  if (error) { console.error("Upload error:", error); return null; }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data?.publicUrl || null;
}

/**
 * Delete a file from a Supabase storage bucket
 */
export async function deleteFile(bucket, path) {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) console.error("Delete error:", error);
}

/**
 * Extract file path from a full Supabase public URL
 */
export function getPathFromUrl(url, bucket) {
  if (!url) return null;
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = url.indexOf(marker);
  return idx !== -1 ? url.slice(idx + marker.length) : null;
}