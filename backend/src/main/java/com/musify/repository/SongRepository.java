package com.musify.repository;

import com.musify.entity.Song;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SongRepository extends JpaRepository<Song, Long> {
    List<Song> findByGenreIgnoreCase(String genre);
    List<Song> findTop15ByOrderByPlayCountDesc();
    List<Song> findByArtistId(Long artistId);

    @Query("SELECT s FROM Song s WHERE LOWER(s.title) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(s.artistName) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(s.genre) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(s.albumTitle) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Song> searchSongs(@Param("query") String query);
}
