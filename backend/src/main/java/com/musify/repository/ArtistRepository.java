package com.musify.repository;

import com.musify.entity.Artist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ArtistRepository extends JpaRepository<Artist, Long> {
    Optional<Artist> findByUserId(Long userId);

    @Query("SELECT a FROM Artist a WHERE LOWER(a.artistName) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Artist> searchArtists(@Param("query") String query);
}
