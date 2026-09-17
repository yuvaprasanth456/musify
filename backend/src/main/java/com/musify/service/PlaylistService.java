package com.musify.service;

import com.musify.dto.CreatePlaylistRequest;
import com.musify.entity.Playlist;
import com.musify.entity.PlaylistSong;
import com.musify.entity.Song;
import com.musify.exception.BadRequestException;
import com.musify.exception.ResourceNotFoundException;
import com.musify.repository.PlaylistRepository;
import com.musify.repository.PlaylistSongRepository;
import com.musify.repository.SongRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PlaylistService {

    private final PlaylistRepository playlistRepository;
    private final PlaylistSongRepository playlistSongRepository;
    private final SongRepository songRepository;

    public PlaylistService(PlaylistRepository playlistRepository, 
                           PlaylistSongRepository playlistSongRepository, 
                           SongRepository songRepository) {
        this.playlistRepository = playlistRepository;
        this.playlistSongRepository = playlistSongRepository;
        this.songRepository = songRepository;
    }

    public List<Playlist> getPlaylists(Long userId) {
        if (userId != null) {
            return playlistRepository.findByUserIdOrIsPublicTrue(userId);
        }
        return playlistRepository.findAll();
    }

    public Playlist getPlaylistById(Long id) {
        return playlistRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Playlist not found with id: " + id));
    }

    @Transactional
    public Playlist createPlaylist(Long userId, CreatePlaylistRequest request, String userName) {
        String cover = request.getCoverUrl() != null && !request.getCoverUrl().isBlank() 
            ? request.getCoverUrl() 
            : "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&auto=format&fit=crop&q=80";

        Playlist playlist = new Playlist(
                userId,
                request.getName(),
                request.getDescription(),
                cover,
                userName != null ? userName : "You"
        );
        return playlistRepository.save(playlist);
    }

    @Transactional
    public Playlist updatePlaylist(Long userId, Long id, CreatePlaylistRequest request) {
        Playlist playlist = getPlaylistById(id);
        if (!playlist.getUserId().equals(userId)) {
            throw new BadRequestException("Unauthorized to modify this playlist");
        }
        playlist.setName(request.getName());
        if (request.getDescription() != null) playlist.setDescription(request.getDescription());
        if (request.getCoverUrl() != null) playlist.setCoverUrl(request.getCoverUrl());
        return playlistRepository.save(playlist);
    }

    @Transactional
    public void deletePlaylist(Long userId, Long id) {
        Playlist playlist = getPlaylistById(id);
        if (!playlist.getUserId().equals(userId)) {
            throw new BadRequestException("Unauthorized to delete this playlist");
        }
        playlistRepository.delete(playlist);
    }

    public List<Song> getPlaylistSongs(Long playlistId) {
        List<PlaylistSong> relations = playlistSongRepository.findByPlaylistIdOrderByPositionAsc(playlistId);
        List<Long> songIds = relations.stream().map(PlaylistSong::getSongId).collect(Collectors.toList());
        return songRepository.findAllById(songIds);
    }

    @Transactional
    public void addSongToPlaylist(Long playlistId, Long songId) {
        if (playlistSongRepository.findByPlaylistIdAndSongId(playlistId, songId).isEmpty()) {
            List<PlaylistSong> existing = playlistSongRepository.findByPlaylistIdOrderByPositionAsc(playlistId);
            int nextPos = existing.size() + 1;
            PlaylistSong item = new PlaylistSong(playlistId, songId, nextPos);
            playlistSongRepository.save(item);
        }
    }

    @Transactional
    public void removeSongFromPlaylist(Long playlistId, Long songId) {
        playlistSongRepository.deleteByPlaylistIdAndSongId(playlistId, songId);
    }
}
