package com.musify.dto;

import com.musify.entity.Song;
import com.musify.entity.Artist;
import com.musify.entity.Playlist;
import java.util.List;

public class SearchResponseDto {
    private List<Song> songs;
    private List<Artist> artists;
    private List<Playlist> playlists;

    public SearchResponseDto() {}

    public SearchResponseDto(List<Song> songs, List<Artist> artists, List<Playlist> playlists) {
        this.songs = songs;
        this.artists = artists;
        this.playlists = playlists;
    }

    public List<Song> getSongs() { return songs; }
    public void setSongs(List<Song> songs) { this.songs = songs; }

    public List<Artist> getArtists() { return artists; }
    public void setArtists(List<Artist> artists) { this.artists = artists; }

    public List<Playlist> getPlaylists() { return playlists; }
    public void setPlaylists(List<Playlist> playlists) { this.playlists = playlists; }
}
