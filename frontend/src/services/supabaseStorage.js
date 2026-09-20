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
 * Upload a file to Supabase Storage with graceful fallback
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
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${Date.now()}_${sanitizedName}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type || undefined
        });

      if (error) {
        console.warn(`Supabase storage upload notice for bucket '${bucket}':`, error.message);
      } else {
        const { data: publicUrlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);

        if (publicUrlData && publicUrlData.publicUrl) {
          console.log(`Successfully uploaded file to Supabase Storage [${bucket}]:`, publicUrlData.publicUrl);
          return publicUrlData.publicUrl;
        }
      }
    } catch (err) {
      console.warn('Supabase storage exception:', err);
    }
  }

  // Graceful local data URL fallback:
  // For images and audio, create an Object URL or data URL so preview & playback work immediately
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
}

/**
 * Save song record to Supabase PostgreSQL database
 * @param {Object} songData
 * @returns {Promise<Object|null>}
 */
export async function saveSongToSupabase(songData) {
  if (!supabase) return null;

  try {
    const row = {
      title: songData.title,
      artist_name: songData.artist || songData.artistName || 'Unknown Artist',
      album_title: songData.album || songData.albumTitle || 'Single',
      genre: songData.genre || 'Tamil Hits',
      language: songData.language || 'Tamil',
      cover_url: songData.coverUrl || '',
      audio_url: songData.audioUrl || '',
      duration: songData.duration || 240,
      release_date: songData.releaseDate || new Date().toISOString().split('T')[0],
      play_count: songData.playCount || 0,
      lyrics: songData.lyrics || '',
      description: songData.description || '',
      uploader_email: songData.uploaderEmail || ''
    };

    const { data, error } = await supabase
      .from('songs')
      .insert([row])
      .select();

    if (error) {
      console.warn('Supabase database songs table insert notice:', error.message);
      return null;
    }

    console.log('Successfully saved song to Supabase database:', data);
    return data && data[0] ? data[0] : null;
  } catch (err) {
    console.warn('Supabase songs insert exception:', err);
    return null;
  }
}

/**
 * Fetch all songs from Supabase PostgreSQL database
 * @returns {Promise<Array>}
 */
export async function fetchSongsFromSupabase() {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .order('id', { ascending: false });

    if (error || !data) {
      return [];
    }

    return data.map(s => ({
      id: s.id,
      title: s.title,
      artist: s.artist_name || s.artist || 'Unknown Artist',
      artistName: s.artist_name || s.artist || 'Unknown Artist',
      album: s.album_title || s.album || 'Single',
      albumTitle: s.album_title || s.album || 'Single',
      genre: s.genre || 'Tamil Hits',
      language: s.language || 'Tamil',
      coverUrl: s.cover_url || s.coverUrl,
      audioUrl: s.audio_url || s.audioUrl,
      duration: s.duration || 240,
      releaseDate: s.release_date || s.releaseDate || '2024-01-01',
      playCount: s.play_count || s.playCount || 0,
      lyrics: s.lyrics || '',
      description: s.description || ''
    }));
  } catch (err) {
    console.warn('Supabase fetchSongs exception:', err);
    return [];
  }
}

export { supabase };
