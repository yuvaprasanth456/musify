package com.musify.controller;

import com.musify.entity.Artist;
import com.musify.entity.Song;
import com.musify.service.ArtistService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class ArtistController {

    private final ArtistService artistService;

    public ArtistController(ArtistService artistService) {
        this.artistService = artistService;
    }

    @GetMapping("/api/artists")
    public ResponseEntity<List<Artist>> getAllArtists() {
        return ResponseEntity.ok(artistService.getAllArtists());
    }

    @GetMapping("/api/artists/{id}")
    public ResponseEntity<Artist> getArtistById(@PathVariable Long id) {
        return ResponseEntity.ok(artistService.getArtistById(id));
    }

    @GetMapping("/api/artists/{id}/songs")
    public ResponseEntity<List<Song>> getArtistSongs(@PathVariable Long id) {
        return ResponseEntity.ok(artistService.getArtistSongs(id));
    }

    // Artist Management Endpoints
    @PostMapping("/api/artist/songs")
    public ResponseEntity<Song> uploadSong(@RequestBody Song song) {
        return ResponseEntity.ok(artistService.uploadSong(song));
    }

    @PutMapping("/api/artist/songs/{id}")
    public ResponseEntity<Song> updateSong(@PathVariable Long id, @RequestBody Song song) {
        return ResponseEntity.ok(artistService.updateSong(id, song));
    }

    @DeleteMapping("/api/artist/songs/{id}")
    public ResponseEntity<?> deleteSong(@PathVariable Long id) {
        artistService.deleteSong(id);
        return ResponseEntity.ok(Map.of("message", "Song deleted successfully"));
    }
}
