package com.musify.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "songs")
public class Song {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(name = "artist_id")
    private Long artistId;

    @Column(name = "artist_name", nullable = false)
    private String artistName;

    @Column(name = "album_id")
    private Long albumId;

    @Column(name = "album_title")
    private String albumTitle;

    private String genre;

    private String language;

    @Column(name = "cover_url", length = 1000)
    private String coverUrl;

    @Column(name = "audio_url", nullable = false, length = 1000)
    private String audioUrl;

    private Integer duration; // in seconds

    @Column(name = "release_date")
    private String releaseDate;

    @Column(name = "play_count")
    private Long playCount = 0L;

    @Column(columnDefinition = "TEXT")
    private String lyrics;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Song() {}

    public Song(String title, Long artistId, String artistName, Long albumId, String albumTitle, 
                String genre, String language, String coverUrl, String audioUrl, 
                Integer duration, String releaseDate, Long playCount, String lyrics) {
        this.title = title;
        this.artistId = artistId;
        this.artistName = artistName;
        this.albumId = albumId;
        this.albumTitle = albumTitle;
        this.genre = genre;
        this.language = language;
        this.coverUrl = coverUrl;
        this.audioUrl = audioUrl;
        this.duration = duration;
        this.releaseDate = releaseDate;
        this.playCount = playCount != null ? playCount : 0L;
        this.lyrics = lyrics;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Long getArtistId() { return artistId; }
    public void setArtistId(Long artistId) { this.artistId = artistId; }

    public String getArtistName() { return artistName; }
    public void setArtistName(String artistName) { this.artistName = artistName; }

    public Long getAlbumId() { return albumId; }
    public void setAlbumId(Long albumId) { this.albumId = albumId; }

    public String getAlbumTitle() { return albumTitle; }
    public void setAlbumTitle(String albumTitle) { this.albumTitle = albumTitle; }

    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public String getCoverUrl() { return coverUrl; }
    public void setCoverUrl(String coverUrl) { this.coverUrl = coverUrl; }

    public String getAudioUrl() { return audioUrl; }
    public void setAudioUrl(String audioUrl) { this.audioUrl = audioUrl; }

    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }

    public String getReleaseDate() { return releaseDate; }
    public void setReleaseDate(String releaseDate) { this.releaseDate = releaseDate; }

    public Long getPlayCount() { return playCount; }
    public void setPlayCount(Long playCount) { this.playCount = playCount; }

    public String getLyrics() { return lyrics; }
    public void setLyrics(String lyrics) { this.lyrics = lyrics; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
