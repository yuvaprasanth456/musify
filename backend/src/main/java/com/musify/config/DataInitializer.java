package com.musify.config;

import com.musify.entity.*;
import com.musify.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ArtistRepository artistRepository;
    private final AlbumRepository albumRepository;
    private final SongRepository songRepository;
    private final PlaylistRepository playlistRepository;
    private final PlaylistSongRepository playlistSongRepository;
    private final LikedSongRepository likedSongRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           ArtistRepository artistRepository,
                           AlbumRepository albumRepository,
                           SongRepository songRepository,
                           PlaylistRepository playlistRepository,
                           PlaylistSongRepository playlistSongRepository,
                           LikedSongRepository likedSongRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.artistRepository = artistRepository;
        this.albumRepository = albumRepository;
        this.songRepository = songRepository;
        this.playlistRepository = playlistRepository;
        this.playlistSongRepository = playlistSongRepository;
        this.likedSongRepository = likedSongRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            return; // Data already initialized
        }

        // 1. Create Default Users
        User demoUser = new User(
                "Priya Sharma",
                "user@musify.io",
                passwordEncoder.encode("password123"),
                "USER",
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80"
        );
        userRepository.save(demoUser);

        User artistUser = new User(
                "Anirudh Ravichander",
                "anirudh@musify.io",
                passwordEncoder.encode("password123"),
                "ARTIST",
                "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500&auto=format&fit=crop&q=80"
        );
        userRepository.save(artistUser);

        // 2. Create Artists
        Artist arRahman = new Artist(null, "A.R. Rahman", "Oscar & Grammy award-winning composer and musical icon.", "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80", 18500000L);
        Artist anirudh = new Artist(artistUser.getId(), "Anirudh Ravichander", "Youth sensation and prominent Indian music director.", "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500&auto=format&fit=crop&q=80", 15200000L);
        Artist shreya = new Artist(null, "Shreya Ghoshal", "Legendary playback singer with timeless melody hits.", "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&auto=format&fit=crop&q=80", 12900000L);
        Artist harris = new Artist(null, "Harris Jayaraj", "Cinematic maestro known for lush modern harmonies.", "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&auto=format&fit=crop&q=80", 9800000L);
        Artist govind = new Artist(null, "Govind Vasantha", "Soul-stirring violinist and music producer.", "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=500&auto=format&fit=crop&q=80", 4600000L);
        Artist dhee = new Artist(null, "Dhee", "Independent visionary artist behind viral chartbusters.", "https://images.unsplash.com/photo-1518972559570-7cc1309f3229?w=500&auto=format&fit=crop&q=80", 5400000L);

        artistRepository.saveAll(List.of(arRahman, anirudh, shreya, harris, govind, dhee));

        // 3. Create Albums
        Album mersal = new Album("Mersal Reverie", arRahman.getId(), "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80", LocalDate.of(2023, 11, 10));
        Album beast = new Album("Beast Grooves", anirudh.getId(), "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80", LocalDate.of(2023, 12, 5));
        Album leo = new Album("Leo Unplugged", anirudh.getId(), "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80", LocalDate.of(2024, 1, 15));
        Album sillunu = new Album("Sillunu Oru Kadhal Sessions", arRahman.getId(), "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&auto=format&fit=crop&q=80", LocalDate.of(2022, 8, 20));

        albumRepository.saveAll(List.of(mersal, beast, leo, sillunu));

        // 4. Create Songs
        Song s1 = new Song("Aalaporaan Tamizhan (Acoustic Vibes)", arRahman.getId(), "A.R. Rahman Ensemble", mersal.getId(), mersal.getTitle(), "Tamil Hits", "Tamil",
                "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80",
                "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", 372, "2023-11-10", 1450200L,
                "[00:12.00] Aalaporaan Tamizhan ulagame viyakkavae\n[00:18.00] Poongaatrae en thunai vandhu thoduvatha\n[00:26.00] Tamizhanin kural kettu dhesangal vanangum");

        Song s2 = new Song("Arabic Kuthu - Midnight Chill Mix", anirudh.getId(), "Anirudh Ravichander", beast.getId(), beast.getTitle(), "Tamil Hits", "Tamil",
                "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80",
                "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", 423, "2023-12-05", 2310450L,
                "[00:15.00] Halamithi habibo habibo\n[00:22.00] Malama pitha pithadhe\n[00:29.00] En vizhikalil un kanavukal oaduthae");

        Song s3 = new Song("Naa Ready (Acoustic Rhythm)", anirudh.getId(), "Anirudh Ravichander", leo.getId(), leo.getTitle(), "Tamil Trending", "Tamil",
                "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80",
                "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", 345, "2024-01-15", 3105000L,
                "[00:10.00] Naa ready dhaan varavaa\n[00:16.00] Annan na erangi thavala vaikkavaa");

        Song s4 = new Song("Munbe Vaa En Anbe Vaa (Lo-Fi Symphony)", shreya.getId(), "Shreya Ghoshal", sillunu.getId(), sillunu.getTitle(), "Tamil Melody", "Tamil",
                "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&auto=format&fit=crop&q=80",
                "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", 380, "2022-08-20", 4201000L,
                "[00:14.00] Munbe vaa en anbe vaa\n[00:21.00] Oone vaa uyirae vaa");

        Song s5 = new Song("Nenjukkul Peidhidum (Gentle Rain)", harris.getId(), "Harris Jayaraj", null, "Single", "Tamil Melody", "Tamil",
                "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&auto=format&fit=crop&q=80",
                "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3", 360, "2023-04-12", 1980000L,
                "[00:10.00] Nenjukkul peidhidum maa mazhai\n[00:18.00] Neerukkul moozhgudhum thamarai");

        Song s6 = new Song("Marakkuma Nenjam (Strings Version)", arRahman.getId(), "A.R. Rahman", null, "Single", "Tamil Love", "Tamil",
                "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=500&auto=format&fit=crop&q=80",
                "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3", 298, "2023-09-01", 950000L,
                "[00:16.00] Marakkuma nenjam marakkuma nenjam");

        Song s7 = new Song("Kaathalae Kaathalae (Violin & Flute)", govind.getId(), "Govind Vasantha", null, "Single", "Tamil Love", "Tamil",
                "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=500&auto=format&fit=crop&q=80",
                "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3", 330, "2022-10-18", 2800000L,
                "[00:12.00] Kaathalae kaathalae thunai neeyallavaa");

        Song s8 = new Song("Megham Karukatha (Lo-Fi Chill)", anirudh.getId(), "Anirudh Ravichander", null, "Single", "Tamil Chill", "Tamil",
                "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500&auto=format&fit=crop&q=80",
                "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3", 310, "2023-07-22", 1650000L,
                "[00:15.00] Megham karukatha pennae pennae");

        Song s9 = new Song("Vaathi Coming (Club Electro Bass)", anirudh.getId(), "Anirudh Ravichander", null, "Single", "Tamil Party", "Tamil",
                "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&auto=format&fit=crop&q=80",
                "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3", 275, "2021-03-10", 5120000L,
                "[00:10.00] Vaathi coming otthu oodhu");

        Song s10 = new Song("Enjoy Enjaami (Indie Fusion)", dhee.getId(), "Dhee ft. Arivu", null, "Single", "Tamil Indie", "Tamil",
                "https://images.unsplash.com/photo-1518972559570-7cc1309f3229?w=500&auto=format&fit=crop&q=80",
                "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3", 350, "2021-04-05", 6700000L,
                "[00:14.00] Enjoy enjaami vaango vaango onnagi");

        songRepository.saveAll(List.of(s1, s2, s3, s4, s5, s6, s7, s8, s9, s10));

        // 5. Create Playlists
        Playlist p1 = new Playlist(demoUser.getId(), "Top Tamil Hits 2024", "The absolute biggest trending songs in Tamil cinema and pop right now.",
                "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80", "MUSIFY Editorial");

        Playlist p2 = new Playlist(demoUser.getId(), "Tamil Chill & Rain", "Soft guitar strings, soulful violins, and gentle lo-fi acoustic melodies.",
                "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&auto=format&fit=crop&q=80", "MUSIFY Editorial");

        playlistRepository.saveAll(List.of(p1, p2));

        // 6. Add Songs to Playlists
        playlistSongRepository.save(new PlaylistSong(p1.getId(), s1.getId(), 1));
        playlistSongRepository.save(new PlaylistSong(p1.getId(), s2.getId(), 2));
        playlistSongRepository.save(new PlaylistSong(p1.getId(), s3.getId(), 3));

        playlistSongRepository.save(new PlaylistSong(p2.getId(), s4.getId(), 1));
        playlistSongRepository.save(new PlaylistSong(p2.getId(), s5.getId(), 2));
        playlistSongRepository.save(new PlaylistSong(p2.getId(), s8.getId(), 3));

        // 7. Liked songs
        likedSongRepository.save(new LikedSong(demoUser.getId(), s1.getId()));
        likedSongRepository.save(new LikedSong(demoUser.getId(), s4.getId()));
    }
}
