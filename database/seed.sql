-- =============================================================================
-- MUSIFY SEED DATA FOR SUPABASE POSTGRESQL (Demo users and songs removed)
-- =============================================================================

-- 1. Insert Artists
INSERT INTO artists (id, user_id, artist_name, bio, profile_image, monthly_listeners, verified)
VALUES
(101, NULL, 'A.R. Rahman', 'Oscar and Grammy award-winning composer and musical pioneer.', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80', 18500000, true),
(102, NULL, 'Anirudh Ravichander', 'Youth icon and prominent Indian music director.', 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500&auto=format&fit=crop&q=80', 15200000, true),
(103, NULL, 'Shreya Ghoshal', 'Legendary playback singer with timeless melody hits.', 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&auto=format&fit=crop&q=80', 12900000, true),
(104, NULL, 'Harris Jayaraj', 'Cinematic maestro known for lush modern harmonies.', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&auto=format&fit=crop&q=80', 9800000, true),
(105, NULL, 'Govind Vasantha', 'Soul-stirring violinist and music producer.', 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=500&auto=format&fit=crop&q=80', 4600000, true),
(106, NULL, 'Dhee', 'Independent visionary artist behind viral chartbusters.', 'https://images.unsplash.com/photo-1518972559570-7cc1309f3229?w=500&auto=format&fit=crop&q=80', 5400000, true)
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Albums
INSERT INTO albums (id, title, artist_id, cover_url, release_date)
VALUES
(201, 'Mersal Reverie', 101, 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80', '2023-11-10'),
(202, 'Beast Grooves', 102, 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80', '2023-12-05'),
(203, 'Leo Unplugged', 102, 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80', '2024-01-15')
ON CONFLICT (id) DO NOTHING;
