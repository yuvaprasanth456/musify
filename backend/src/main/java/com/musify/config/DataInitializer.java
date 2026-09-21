package com.musify.config;

import com.musify.entity.*;
import com.musify.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final ArtistRepository artistRepository;
    private final AlbumRepository albumRepository;

    public DataInitializer(ArtistRepository artistRepository,
                           AlbumRepository albumRepository) {
        this.artistRepository = artistRepository;
        this.albumRepository = albumRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (artistRepository.count() > 0) {
            return; // Data already initialized
        }

        // 1. Create Artists (no demo users attached)
        Artist arRahman = new Artist(null, "A.R. Rahman", "Oscar & Grammy award-winning composer and musical icon.", "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80", 18500000L);
        Artist anirudh = new Artist(null, "Anirudh Ravichander", "Youth sensation and prominent Indian music director.", "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500&auto=format&fit=crop&q=80", 15200000L);
        Artist shreya = new Artist(null, "Shreya Ghoshal", "Legendary playback singer with timeless melody hits.", "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&auto=format&fit=crop&q=80", 12900000L);
        Artist harris = new Artist(null, "Harris Jayaraj", "Cinematic maestro known for lush modern harmonies.", "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&auto=format&fit=crop&q=80", 9800000L);
        Artist govind = new Artist(null, "Govind Vasantha", "Soul-stirring violinist and music producer.", "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=500&auto=format&fit=crop&q=80", 4600000L);
        Artist dhee = new Artist(null, "Dhee", "Independent visionary artist behind viral chartbusters.", "https://images.unsplash.com/photo-1518972559570-7cc1309f3229?w=500&auto=format&fit=crop&q=80", 5400000L);

        artistRepository.saveAll(List.of(arRahman, anirudh, shreya, harris, govind, dhee));

        // 2. Create Albums
        Album mersal = new Album("Mersal Reverie", arRahman.getId(), "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80", LocalDate.of(2023, 11, 10));
        Album beast = new Album("Beast Grooves", anirudh.getId(), "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80", LocalDate.of(2023, 12, 5));
        Album leo = new Album("Leo Unplugged", anirudh.getId(), "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80", LocalDate.of(2024, 1, 15));
        Album sillunu = new Album("Sillunu Oru Kadhal Sessions", arRahman.getId(), "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&auto=format&fit=crop&q=80", LocalDate.of(2022, 8, 20));

        albumRepository.saveAll(List.of(mersal, beast, leo, sillunu));
    }
}
