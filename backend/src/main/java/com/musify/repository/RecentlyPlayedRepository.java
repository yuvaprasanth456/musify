package com.musify.repository;

import com.musify.entity.RecentlyPlayed;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecentlyPlayedRepository extends JpaRepository<RecentlyPlayed, Long> {
    List<RecentlyPlayed> findTop30ByUserIdOrderByPlayedAtDesc(Long userId);
}
