package com.musify.controller;

import com.musify.dto.CreatePlaylistRequest;
import com.musify.entity.Playlist;
import com.musify.entity.Song;
import com.musify.security.JwtTokenProvider;
import com.musify.service.PlaylistService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/playlists")
public class PlaylistController {

    private final PlaylistService playlistService;
    private final JwtTokenProvider tokenProvider;

    public PlaylistController(PlaylistService playlistService, JwtTokenProvider tokenProvider) {
        this.playlistService = playlistService;
        this.tokenProvider = tokenProvider;
    }

    @GetMapping
    public ResponseEntity<List<Playlist>> getPlaylists(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        Long userId = extractUserId(authHeader);
        return ResponseEntity.ok(playlistService.getPlaylists(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Playlist> getPlaylistById(@PathVariable Long id) {
        return ResponseEntity.ok(playlistService.getPlaylistById(id));
    }

    @PostMapping
    public ResponseEntity<Playlist> createPlaylist(
            @Valid @RequestBody CreatePlaylistRequest request,
            @RequestHeader("Authorization") String authHeader) {
        Long userId = extractUserId(authHeader);
        return ResponseEntity.ok(playlistService.createPlaylist(userId, request, "You"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Playlist> updatePlaylist(
            @PathVariable Long id,
            @Valid @RequestBody CreatePlaylistRequest request,
            @RequestHeader("Authorization") String authHeader) {
        Long userId = extractUserId(authHeader);
        return ResponseEntity.ok(playlistService.updatePlaylist(userId, id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePlaylist(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {
        Long userId = extractUserId(authHeader);
        playlistService.deletePlaylist(userId, id);
        return ResponseEntity.ok(Map.of("message", "Playlist deleted successfully"));
    }

    @GetMapping("/{id}/songs")
    public ResponseEntity<List<Song>> getPlaylistSongs(@PathVariable Long id) {
        return ResponseEntity.ok(playlistService.getPlaylistSongs(id));
    }

    @PostMapping("/{id}/songs")
    public ResponseEntity<?> addSongToPlaylist(
            @PathVariable Long id,
            @RequestBody Map<String, Long> payload) {
        Long songId = payload.get("songId");
        playlistService.addSongToPlaylist(id, songId);
        return ResponseEntity.ok(Map.of("message", "Song added to playlist"));
    }

    @DeleteMapping("/{id}/songs/{songId}")
    public ResponseEntity<?> removeSongFromPlaylist(
            @PathVariable Long id,
            @PathVariable Long songId) {
        playlistService.removeSongFromPlaylist(id, songId);
        return ResponseEntity.ok(Map.of("message", "Song removed from playlist"));
    }

    private Long extractUserId(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return tokenProvider.getUserIdFromToken(token);
        }
        return null;
    }
}
