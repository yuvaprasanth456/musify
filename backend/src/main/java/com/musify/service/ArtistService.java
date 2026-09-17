package com.musify.service;

import com.musify.entity.Artist;
import com.musify.entity.Song;
import com.musify.exception.ResourceNotFoundException;
import com.musify.repository.ArtistRepository;
import com.musify.repository.FollowedArtistRepository;
import com.musify.repository.SongRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ArtistService {

    private final ArtistRepository artistRepository;
    private final SongRepository songRepository;
    private final FollowedArtistRepository followedArtistRepository;

    public ArtistService(ArtistRepository artistRepository, 
                         SongRepository songRepository, 
                         FollowedArtistRepository followedArtistRepository) {
        this.artistRepository = artistRepository;
        this.songRepository = songRepository;
        this.followedArtistRepository = followedArtistRepository;
    }

    public List<Artist> getAllArtists() {
        return artistRepository.findAll();
    }

    public Artist getArtistById(Long id) {
        return artistRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Artist not found with id: " + id));
    }

    public List<Song> getArtistSongs(Long artistId) {
        return songRepository.findByArtistId(artistId);
    }

    @Transactional
    public Song uploadSong(Song song) {
        return songRepository.save(song);
    }

    @Transactional
    public Song updateSong(Long id, Song updated) {
        Song existing = songRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Song not found with id: " + id));

        existing.setTitle(updated.getTitle());
        existing.setAlbumTitle(updated.getAlbumTitle());
        existing.setGenre(updated.getGenre());
        existing.setLanguage(updated.getLanguage());
        if (updated.getCoverUrl() != null) existing.setCoverUrl(updated.getCoverUrl());
        if (updated.getAudioUrl() != null) existing.setAudioUrl(updated.getAudioUrl());
        if (updated.getLyrics() != null) existing.setLyrics(updated.getLyrics());

        return songRepository.save(existing);
    }

    @Transactional
    public void deleteSong(Long id) {
        songRepository.deleteById(id);
    }
}
