-- =============================================================================
-- MUSIFY SEED DATA FOR SUPABASE POSTGRESQL
-- =============================================================================

-- 1. Insert Initial Demo Users (Password is 'password123' hashed with BCrypt)
INSERT INTO users (id, name, email, password_hash, role, profile_image)
VALUES 
(1, 'Priya Sharma', 'user@musify.io', '$2a$10$7v1b1lZ7Q5mRjS51QZf0Ce6zL.N0qD1dZ9d6S4vL3R3yL2X.g8Z0.', 'USER', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'),
(2, 'Anirudh Ravichander', 'anirudh@musify.io', '$2a$10$7v1b1lZ7Q5mRjS51QZf0Ce6zL.N0qD1dZ9d6S4vL3R3yL2X.g8Z0.', 'ARTIST', 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500&auto=format&fit=crop&q=80')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Artists
INSERT INTO artists (id, user_id, artist_name, bio, profile_image, monthly_listeners, verified)
VALUES
(101, NULL, 'A.R. Rahman', 'Oscar and Grammy award-winning composer and musical pioneer.', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80', 18500000, true),
(102, 2, 'Anirudh Ravichander', 'Youth icon and prominent Indian music director.', 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500&auto=format&fit=crop&q=80', 15200000, true),
(103, NULL, 'Shreya Ghoshal', 'Legendary playback singer with timeless melody hits.', 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&auto=format&fit=crop&q=80', 12900000, true),
(104, NULL, 'Harris Jayaraj', 'Cinematic maestro known for lush modern harmonies.', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&auto=format&fit=crop&q=80', 9800000, true),
(105, NULL, 'Govind Vasantha', 'Soul-stirring violinist and music producer.', 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=500&auto=format&fit=crop&q=80', 4600000, true),
(106, NULL, 'Dhee', 'Independent visionary artist behind viral chartbusters.', 'https://images.unsplash.com/photo-1518972559570-7cc1309f3229?w=500&auto=format&fit=crop&q=80', 5400000, true)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Albums
INSERT INTO albums (id, title, artist_id, cover_url, release_date)
VALUES
(201, 'Mersal Reverie', 101, 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80', '2023-11-10'),
(202, 'Beast Grooves', 102, 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80', '2023-12-05'),
(203, 'Leo Unplugged', 102, 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80', '2024-01-15')
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Songs
INSERT INTO songs (id, title, artist_id, artist_name, album_id, album_title, genre, language, cover_url, audio_url, duration, release_date, play_count, lyrics)
VALUES
(1, 'Aalaporaan Tamizhan (Acoustic Vibes)', 101, 'A.R. Rahman Ensemble', 201, 'Mersal Reverie', 'Tamil Hits', 'Tamil', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 372, '2023-11-10', 1450200, '[00:12.00] Aalaporaan Tamizhan ulagame viyakkavae\n[00:18.00] Poongaatrae en thunai vandhu thoduvatha\n[00:26.00] Tamizhanin kural kettu dhesangal vanangum'),
(2, 'Arabic Kuthu - Midnight Chill Mix', 102, 'Anirudh Ravichander', 202, 'Beast Grooves', 'Tamil Hits', 'Tamil', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', 423, '2023-12-05', 2310450, '[00:15.00] Halamithi habibo habibo\n[00:22.00] Malama pitha pithadhe\n[00:29.00] En vizhikalil un kanavukal oaduthae'),
(3, 'Naa Ready (Acoustic Rhythm)', 102, 'Anirudh Ravichander', 203, 'Leo Unplugged', 'Tamil Trending', 'Tamil', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', 345, '2024-01-15', 3105000, '[00:10.00] Naa ready dhaan varavaa\n[00:16.00] Annan na erangi thavala vaikkavaa'),
(4, 'Munbe Vaa En Anbe Vaa (Lo-Fi Symphony)', 103, 'Shreya Ghoshal', NULL, 'Single', 'Tamil Melody', 'Tamil', 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&auto=format&fit=crop&q=80', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', 380, '2022-08-20', 4201000, '[00:14.00] Munbe vaa en anbe vaa\n[00:21.00] Oone vaa uyirae vaa'),
(5, 'Nenjukkul Peidhidum (Gentle Rain)', 104, 'Harris Jayaraj', NULL, 'Single', 'Tamil Melody', 'Tamil', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&auto=format&fit=crop&q=80', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', 360, '2023-04-12', 1980000, '[00:10.00] Nenjukkul peidhidum maa mazhai\n[00:18.00] Neerukkul moozhgudhum thamarai')
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Playlists
INSERT INTO playlists (id, user_id, name, description, cover_url, created_by, is_public)
VALUES
(1, 1, 'Top Tamil Hits 2024', 'The absolute biggest trending songs in Tamil cinema and pop right now.', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80', 'MUSIFY Editorial', true),
(2, 1, 'Tamil Chill & Rain', 'Soft guitar strings, soulful violins, and gentle lo-fi acoustic melodies.', 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&auto=format&fit=crop&q=80', 'MUSIFY Editorial', true)
ON CONFLICT (id) DO NOTHING;
