-- =============================================================================
-- MUSIFY - COMPLETE SUPABASE POSTGRESQL & STORAGE SETUP
-- Run this entire script in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- =============================================================================

-- 1. Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CREATE PUBLIC STORAGE BUCKETS (music, covers, profiles)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('music', 'music', true, 52428800, ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/flac', 'audio/aac', 'audio/m4a']),
  ('covers', 'covers', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']),
  ('profiles', 'profiles', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO UPDATE SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit;

-- 3. STORAGE POLICIES (Allow public download and uploads to music, covers, profiles)
DROP POLICY IF EXISTS "Public Access Music" ON storage.objects;
CREATE POLICY "Public Access Music" ON storage.objects FOR SELECT USING (bucket_id = 'music');

DROP POLICY IF EXISTS "Public Upload Music" ON storage.objects;
CREATE POLICY "Public Upload Music" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'music');

DROP POLICY IF EXISTS "Public Access Covers" ON storage.objects;
CREATE POLICY "Public Access Covers" ON storage.objects FOR SELECT USING (bucket_id = 'covers');

DROP POLICY IF EXISTS "Public Upload Covers" ON storage.objects;
CREATE POLICY "Public Upload Covers" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'covers');

DROP POLICY IF EXISTS "Public Access Profiles" ON storage.objects;
CREATE POLICY "Public Access Profiles" ON storage.objects FOR SELECT USING (bucket_id = 'profiles');

DROP POLICY IF EXISTS "Public Upload Profiles" ON storage.objects;
CREATE POLICY "Public Upload Profiles" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'profiles');

-- 4. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id BIGSERIAL PRIMARY KEY,
    supabase_uid UUID UNIQUE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    role VARCHAR(50) NOT NULL DEFAULT 'USER',
    profile_image VARCHAR(1000),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. ARTISTS TABLE
CREATE TABLE IF NOT EXISTS public.artists (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES public.users(id) ON DELETE SET NULL,
    artist_name VARCHAR(255) NOT NULL,
    bio TEXT,
    profile_image VARCHAR(1000),
    monthly_listeners BIGINT DEFAULT 0,
    verified BOOLEAN DEFAULT TRUE
);

-- 6. ALBUMS TABLE
CREATE TABLE IF NOT EXISTS public.albums (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    artist_id BIGINT REFERENCES public.artists(id) ON DELETE CASCADE,
    cover_url VARCHAR(1000),
    release_date VARCHAR(50)
);

-- 7. SONGS TABLE
CREATE TABLE IF NOT EXISTS public.songs (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    artist_id BIGINT REFERENCES public.artists(id) ON DELETE SET NULL,
    artist_name VARCHAR(255) NOT NULL,
    album_id BIGINT REFERENCES public.albums(id) ON DELETE SET NULL,
    album_title VARCHAR(255),
    genre VARCHAR(100),
    language VARCHAR(100) DEFAULT 'Tamil',
    cover_url VARCHAR(1000),
    audio_url VARCHAR(1000) NOT NULL,
    duration INTEGER DEFAULT 240,
    release_date VARCHAR(50),
    play_count BIGINT DEFAULT 0,
    lyrics TEXT,
    description TEXT,
    uploader_email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. PLAYLISTS TABLE
CREATE TABLE IF NOT EXISTS public.playlists (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES public.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    cover_url VARCHAR(1000),
    created_by VARCHAR(255),
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. PLAYLIST SONGS JUNCTION TABLE
CREATE TABLE IF NOT EXISTS public.playlist_songs (
    id BIGSERIAL PRIMARY KEY,
    playlist_id BIGINT NOT NULL REFERENCES public.playlists(id) ON DELETE CASCADE,
    song_id BIGINT NOT NULL REFERENCES public.songs(id) ON DELETE CASCADE,
    position INTEGER DEFAULT 0,
    UNIQUE(playlist_id, song_id)
);

-- 10. LIKED SONGS TABLE
CREATE TABLE IF NOT EXISTS public.liked_songs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    song_id BIGINT NOT NULL REFERENCES public.songs(id) ON DELETE CASCADE,
    liked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, song_id)
);

-- 11. RECENTLY PLAYED HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.recently_played (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    song_id BIGINT NOT NULL REFERENCES public.songs(id) ON DELETE CASCADE,
    played_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. ENABLE ROW LEVEL SECURITY WITH PERMISSIVE POLICIES
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.liked_songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recently_played ENABLE ROW LEVEL SECURITY;

-- Allow full read/write for all users (anon & authenticated)
DO $$ 
DECLARE
  tbl text;
BEGIN
  FOR tbl IN SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Public select %I" ON public.%I;', tbl, tbl);
    EXECUTE format('CREATE POLICY "Public select %I" ON public.%I FOR SELECT USING (true);', tbl, tbl);
    
    EXECUTE format('DROP POLICY IF EXISTS "Public insert %I" ON public.%I;', tbl, tbl);
    EXECUTE format('CREATE POLICY "Public insert %I" ON public.%I FOR INSERT WITH CHECK (true);', tbl, tbl);
    
    EXECUTE format('DROP POLICY IF EXISTS "Public update %I" ON public.%I;', tbl, tbl);
    EXECUTE format('CREATE POLICY "Public update %I" ON public.%I FOR UPDATE USING (true);', tbl, tbl);
    
    EXECUTE format('DROP POLICY IF EXISTS "Public delete %I" ON public.%I;', tbl, tbl);
    EXECUTE format('CREATE POLICY "Public delete %I" ON public.%I FOR DELETE USING (true);', tbl, tbl);
  END LOOP;
END $$;

-- 13. SEED INITIAL SAMPLE SONGS
INSERT INTO public.songs (id, title, artist_name, album_title, genre, language, cover_url, audio_url, duration, release_date, play_count, lyrics)
VALUES 
(1, 'Aalaporaan Tamizhan (Acoustic Vibes)', 'A.R. Rahman Ensemble', 'Mersal Reverie', 'Tamil Hits', 'Tamil', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 372, '2023-11-10', 1450200, '[00:12.00] Aalaporaan Tamizhan ulagame viyakkavae\n[00:18.00] Poongaatrae en thunai vandhu thoduvatha\n[00:26.00] Tamizhanin kural kettu dhesangal vanangum'),
(2, 'Arabic Kuthu - Midnight Chill Mix', 'Anirudh Ravichander', 'Beast Grooves', 'Tamil Hits', 'Tamil', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', 423, '2023-12-05', 2310450, '[00:15.00] Halamithi habibo habibo\n[00:22.00] Malama pitha pithadhe\n[00:29.00] En vizhikalil un kanavukal oaduthae'),
(3, 'Naa Ready (Acoustic Rhythm)', 'Anirudh Ravichander', 'Leo Unplugged', 'Tamil Trending', 'Tamil', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', 345, '2024-01-15', 3105000, '[00:10.00] Naa ready dhaan varavaa\n[00:16.00] Annan na erangi thavala vaikkavaa'),
(4, 'Munbe Vaa En Anbe Vaa (Lo-Fi Symphony)', 'Shreya Ghoshal', 'Single', 'Tamil Melody', 'Tamil', 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&auto=format&fit=crop&q=80', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', 380, '2022-08-20', 4201000, '[00:14.00] Munbe vaa en anbe vaa\n[00:21.00] Oone vaa uyirae vaa'),
(5, 'Nenjukkul Peidhidum (Gentle Rain)', 'Harris Jayaraj', 'Single', 'Tamil Melody', 'Tamil', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&auto=format&fit=crop&q=80', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', 360, '2023-04-12', 1980000, '[00:10.00] Nenjukkul peidhidum maa mazhai\n[00:18.00] Neerukkul moozhgudhum thamarai'),
(6, 'Marakkuma Nenjam (Strings Version)', 'A.R. Rahman', 'Single', 'Tamil Love', 'Tamil', 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=500&auto=format&fit=crop&q=80', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', 298, '2023-09-01', 950000, '[00:16.00] Marakkuma nenjam marakkuma nenjam'),
(7, 'Kaathalae Kaathalae (Violin & Flute)', 'Govind Vasantha', 'Single', 'Tamil Love', 'Tamil', 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=500&auto=format&fit=crop&q=80', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', 330, '2022-10-18', 2800000, '[00:12.00] Kaathalae kaathalae thunai neeyallavaa'),
(8, 'Megham Karukatha (Lo-Fi Chill)', 'Anirudh Ravichander', 'Single', 'Tamil Chill', 'Tamil', 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500&auto=format&fit=crop&q=80', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', 310, '2023-07-22', 1650000, '[00:15.00] Megham karukatha pennae pennae'),
(9, 'Vaathi Coming (Club Electro Bass)', 'Anirudh Ravichander', 'Single', 'Tamil Party', 'Tamil', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&auto=format&fit=crop&q=80', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', 275, '2021-03-10', 5120000, '[00:10.00] Vaathi coming otthu oodhu'),
(10, 'Enjoy Enjaami (Indie Fusion)', 'Dhee ft. Arivu', 'Single', 'Tamil Indie', 'Tamil', 'https://images.unsplash.com/photo-1518972559570-7cc1309f3229?w=500&auto=format&fit=crop&q=80', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', 350, '2021-04-05', 6700000, '[00:14.00] Enjoy enjaami vaango vaango onnagi')
ON CONFLICT (id) DO NOTHING;

-- Reset sequence to ensure future song IDs start above 10
SELECT setval('public.songs_id_seq', (SELECT COALESCE(MAX(id), 1) FROM public.songs));
