package com.musify.controller;

import com.musify.entity.Cover;
import com.musify.repository.CoverRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/covers")
@CrossOrigin(origins = "*")
public class CoverController {

    private final CoverRepository coverRepository;

    public CoverController(CoverRepository coverRepository) {
        this.coverRepository = coverRepository;
    }

    @GetMapping
    public ResponseEntity<List<Cover>> getAllCovers() {
        return ResponseEntity.ok(coverRepository.findAllByOrderByCreatedAtDesc());
    }

    @GetMapping("/song/{songId}")
    public ResponseEntity<Cover> getCoverBySongId(@PathVariable Long songId) {
        return coverRepository.findBySongId(songId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Cover> saveCover(@RequestBody Cover cover) {
        if (cover.getCreatedAt() == null) {
            cover.setCreatedAt(LocalDateTime.now());
        }
        Cover saved = coverRepository.save(cover);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteCover(@PathVariable Long id) {
        if (coverRepository.existsById(id)) {
            coverRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("success", true, "message", "Cover deleted successfully"));
        }
        return ResponseEntity.notFound().build();
    }
}
