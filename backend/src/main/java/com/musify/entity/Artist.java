package com.musify.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "artists")
public class Artist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "artist_name", nullable = false)
    private String artistName;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "profile_image")
    private String profileImage;

    @Column(name = "monthly_listeners")
    private Long monthlyListeners = 0L;

    private Boolean verified = true;

    public Artist() {}

    public Artist(Long userId, String artistName, String bio, String profileImage, Long monthlyListeners) {
        this.userId = userId;
        this.artistName = artistName;
        this.bio = bio;
        this.profileImage = profileImage;
        this.monthlyListeners = monthlyListeners;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getArtistName() { return artistName; }
    public void setArtistName(String artistName) { this.artistName = artistName; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getProfileImage() { return profileImage; }
    public void setProfileImage(String profileImage) { this.profileImage = profileImage; }

    public Long getMonthlyListeners() { return monthlyListeners; }
    public void setMonthlyListeners(Long monthlyListeners) { this.monthlyListeners = monthlyListeners; }

    public Boolean getVerified() { return verified; }
    public void setVerified(Boolean verified) { this.verified = verified; }
}
