package com.musify.repository;

import com.musify.entity.LikedSong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LikedSongRepository extends JpaRepository<LikedSong, Long> {
    List<LikedSong> findByUserIdOrderByLikedAtDesc(Long userId);
    Optional<LikedSong> findByUserIdAndSongId(Long userId, Long songId);
    Boolean existsByUserIdAndSongId(Long userId, Long songId);
    void deleteByUserIdAndSongId(Long userId, Long songId);
}
