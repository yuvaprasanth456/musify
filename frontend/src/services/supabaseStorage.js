import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabase = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (err) {
    console.warn('Supabase client initialization warning:', err);
  }
}

/**
 * Upload a file to Supabase Storage with local fallback
 * @param {File} file - File to upload
 * @param {'music' | 'covers' | 'profiles'} bucket - Target bucket
 * @returns {Promise<string>} Public URL of uploaded file
 */
export async function uploadToStorage(file, bucket = 'covers') {
  if (!file) throw new Error('No file provided');

  // If Supabase is configured with valid URL/keys:
  if (supabase) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.warn(`Supabase upload failed for ${bucket}:`, error.message);
      } else {
        const { data: publicUrlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);

        if (publicUrlData && publicUrlData.publicUrl) {
          return publicUrlData.publicUrl;
        }
      }
    } catch (err) {
      console.warn('Supabase storage exception:', err);
    }
  }

  // Graceful fallback for local development:
  // For images and audio, create an Object URL or data URL so preview & playback work immediately!
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
}

export { supabase };
