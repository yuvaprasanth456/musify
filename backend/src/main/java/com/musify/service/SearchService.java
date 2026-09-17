package com.musify.service;

import com.musify.dto.SearchResponseDto;
import com.musify.entity.Artist;
import com.musify.entity.Playlist;
import com.musify.entity.Song;
import com.musify.repository.ArtistRepository;
import com.musify.repository.PlaylistRepository;
import com.musify.repository.SongRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SearchService {

    private final SongRepository songRepository;
    private final ArtistRepository artistRepository;
    private final PlaylistRepository playlistRepository;

    public SearchService(SongRepository songRepository, 
                         ArtistRepository artistRepository, 
                         PlaylistRepository playlistRepository) {
        this.songRepository = songRepository;
        this.artistRepository = artistRepository;
        this.playlistRepository = playlistRepository;
    }

    public SearchResponseDto search(String query) {
        if (query == null || query.trim().isEmpty()) {
            return new SearchResponseDto(List.of(), List.of(), List.of());
        }

        String cleanQuery = query.trim();
        List<Song> songs = songRepository.searchSongs(cleanQuery);
        List<Artist> artists = artistRepository.searchArtists(cleanQuery);
        List<Playlist> playlists = playlistRepository.searchPlaylists(cleanQuery);

        return new SearchResponseDto(songs, artists, playlists);
    }
}
