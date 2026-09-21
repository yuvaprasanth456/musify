package com.musify.repository;

import com.musify.entity.Cover;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CoverRepository extends JpaRepository<Cover, Long> {
    Optional<Cover> findBySongId(Long songId);
    List<Cover> findAllByOrderByCreatedAtDesc();
    List<Cover> findByArtistNameIgnoreCase(String artistName);
}
