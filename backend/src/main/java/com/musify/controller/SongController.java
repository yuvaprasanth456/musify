package com.musify.controller;

import com.musify.entity.Song;
import com.musify.security.JwtTokenProvider;
import com.musify.service.SongService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/songs")
public class SongController {

    private final SongService songService;
    private final JwtTokenProvider tokenProvider;

    public SongController(SongService songService, JwtTokenProvider tokenProvider) {
        this.songService = songService;
        this.tokenProvider = tokenProvider;
    }

    @GetMapping
    public ResponseEntity<List<Song>> getAllSongs() {
        return ResponseEntity.ok(songService.getAllSongs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Song> getSongById(@PathVariable Long id) {
        return ResponseEntity.ok(songService.getSongById(id));
    }

    @GetMapping("/trending")
    public ResponseEntity<List<Song>> getTrendingSongs() {
        return ResponseEntity.ok(songService.getTrendingSongs());
    }

    @GetMapping("/genre/{genre}")
    public ResponseEntity<List<Song>> getSongsByGenre(@PathVariable String genre) {
        return ResponseEntity.ok(songService.getSongsByGenre(genre));
    }

    @PostMapping("/{id}/play")
    public ResponseEntity<?> recordPlay(@PathVariable Long id) {
        songService.incrementPlayCount(id);
        return ResponseEntity.ok(Map.of("message", "Play count updated"));
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<?> likeSong(@PathVariable Long id, @RequestHeader("Authorization") String authHeader) {
        Long userId = extractUserId(authHeader);
        songService.likeSong(userId, id);
        return ResponseEntity.ok(Map.of("message", "Song added to liked songs"));
    }

    @DeleteMapping("/{id}/like")
    public ResponseEntity<?> unlikeSong(@PathVariable Long id, @RequestHeader("Authorization") String authHeader) {
        Long userId = extractUserId(authHeader);
        songService.unlikeSong(userId, id);
        return ResponseEntity.ok(Map.of("message", "Song removed from liked songs"));
    }

    @GetMapping("/liked")
    public ResponseEntity<List<Song>> getLikedSongs(@RequestHeader("Authorization") String authHeader) {
        Long userId = extractUserId(authHeader);
        return ResponseEntity.ok(songService.getLikedSongs(userId));
    }

    private Long extractUserId(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return tokenProvider.getUserIdFromToken(token);
        }
        return 1L; // Fallback demo user
    }
}
