package com.musify.service;

import com.musify.entity.LikedSong;
import com.musify.entity.Song;
import com.musify.exception.ResourceNotFoundException;
import com.musify.repository.LikedSongRepository;
import com.musify.repository.SongRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SongService {

    private final SongRepository songRepository;
    private final LikedSongRepository likedSongRepository;

    public SongService(SongRepository songRepository, LikedSongRepository likedSongRepository) {
        this.songRepository = songRepository;
        this.likedSongRepository = likedSongRepository;
    }

    public List<Song> getAllSongs() {
        return songRepository.findAll();
    }

    public Song getSongById(Long id) {
        return songRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Song not found with id: " + id));
    }

    public List<Song> getTrendingSongs() {
        return songRepository.findTop15ByOrderByPlayCountDesc();
    }

    public List<Song> getSongsByGenre(String genre) {
        return songRepository.findByGenreIgnoreCase(genre);
    }

    @Transactional
    public void incrementPlayCount(Long songId) {
        songRepository.findById(songId).ifPresent(song -> {
            song.setPlayCount(song.getPlayCount() + 1);
            songRepository.save(song);
        });
    }

    @Transactional
    public void likeSong(Long userId, Long songId) {
        if (!likedSongRepository.existsByUserIdAndSongId(userId, songId)) {
            LikedSong likedSong = new LikedSong(userId, songId);
            likedSongRepository.save(likedSong);
        }
    }

    @Transactional
    public void unlikeSong(Long userId, Long songId) {
        likedSongRepository.deleteByUserIdAndSongId(userId, songId);
    }

    public List<Song> getLikedSongs(Long userId) {
        List<LikedSong> liked = likedSongRepository.findByUserIdOrderByLikedAtDesc(userId);
        List<Long> songIds = liked.stream().map(LikedSong::getSongId).collect(Collectors.toList());
        return songRepository.findAllById(songIds);
    }
}
