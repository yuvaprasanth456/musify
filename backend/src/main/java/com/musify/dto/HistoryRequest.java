package com.musify.dto;

public class HistoryRequest {
    private Long songId;

    public HistoryRequest() {}
    public HistoryRequest(Long songId) { this.songId = songId; }

    public Long getSongId() { return songId; }
    public void setSongId(Long songId) { this.songId = songId; }
}
