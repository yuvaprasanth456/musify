

<AddToPlaylistModal
  isOpen={!!selectedSongForPlaylist}
  onClose={() => setSelectedSongForPlaylist(null)}
  song={selectedSongForPlaylist}
/>
    </div >
  );
}
