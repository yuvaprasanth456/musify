package com.musify.repository;

import com.musify.entity.FollowedArtist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FollowedArtistRepository extends JpaRepository<FollowedArtist, Long> {
    List<FollowedArtist> findByUserId(Long userId);
    Optional<FollowedArtist> findByUserIdAndArtistId(Long userId, Long artistId);
    Boolean existsByUserIdAndArtistId(Long userId, Long artistId);
    void deleteByUserIdAndArtistId(Long userId, Long artistId);
}
