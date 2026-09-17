package com.musify.dto;

import jakarta.validation.constraints.NotBlank;

public class CreatePlaylistRequest {
    @NotBlank
    private String name;

    private String description;

    private String coverUrl;

    public CreatePlaylistRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCoverUrl() { return coverUrl; }
    public void setCoverUrl(String coverUrl) { this.coverUrl = coverUrl; }
}
