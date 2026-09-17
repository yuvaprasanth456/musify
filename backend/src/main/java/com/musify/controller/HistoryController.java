package com.musify.controller;

import com.musify.dto.HistoryRequest;
import com.musify.entity.RecentlyPlayed;
import com.musify.entity.Song;
import com.musify.repository.RecentlyPlayedRepository;
import com.musify.repository.SongRepository;
import com.musify.security.JwtTokenProvider;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/history")
public class HistoryController {

    private final RecentlyPlayedRepository recentlyPlayedRepository;
    private final SongRepository songRepository;
    private final JwtTokenProvider tokenProvider;

    public HistoryController(RecentlyPlayedRepository recentlyPlayedRepository, 
                             SongRepository songRepository, 
                             JwtTokenProvider tokenProvider) {
        this.recentlyPlayedRepository = recentlyPlayedRepository;
        this.songRepository = songRepository;
        this.tokenProvider = tokenProvider;
    }

    @GetMapping
    public ResponseEntity<List<Song>> getRecentlyPlayed(@RequestHeader("Authorization") String authHeader) {
        Long userId = extractUserId(authHeader);
        List<RecentlyPlayed> history = recentlyPlayedRepository.findTop30ByUserIdOrderByPlayedAtDesc(userId);
        List<Long> songIds = history.stream().map(RecentlyPlayed::getSongId).collect(Collectors.toList());
        return ResponseEntity.ok(songRepository.findAllById(songIds));
    }

    @PostMapping
    public ResponseEntity<?> recordPlay(
            @RequestBody HistoryRequest request,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Long userId = extractUserId(authHeader);
        if (request.getSongId() != null) {
            RecentlyPlayed record = new RecentlyPlayed(userId, request.getSongId());
            recentlyPlayedRepository.save(record);
        }
        return ResponseEntity.ok(Map.of("message", "History recorded"));
    }

    private Long extractUserId(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return tokenProvider.getUserIdFromToken(token);
        }
        return 1L;
    }
}
