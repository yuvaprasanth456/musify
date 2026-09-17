import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { SAMPLE_SONGS } from '../utils/sampleData';
import { useToast } from './ToastContext';
import api from '../services/api';

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  // Audio element reference
  const audioRef = useRef(new Audio());
  const { addToast } = useToast();

  // Playback state
  const [currentSong, setCurrentSong] = useState(SAMPLE_SONGS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(SAMPLE_SONGS[0]?.duration || 0);
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('musify_volume');
    return saved !== null ? parseFloat(saved) : 0.8;
  });
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off' | 'all' | 'one'

  // Queue & Navigation
  const [queue, setQueue] = useState(SAMPLE_SONGS);
  const [queueIndex, setQueueIndex] = useState(0);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isLyricsOpen, setIsLyricsOpen] = useState(false);

  // User Library in-memory & local storage sync
  const [likedSongIds, setLikedSongIds] = useState(() => {
    const saved = localStorage.getItem('musify_liked_songs');
    return saved ? JSON.parse(saved) : [1, 4, 8];
  });
  const [recentlyPlayed, setRecentlyPlayed] = useState(() => {
    const saved = localStorage.getItem('musify_recent_songs');
    return saved ? JSON.parse(saved) : [SAMPLE_SONGS[0], SAMPLE_SONGS[1], SAMPLE_SONGS[3]];
  });

  // Keep volume updated on audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
    localStorage.setItem('musify_volume', volume.toString());
  }, [volume, isMuted]);

  // Sync liked songs to localStorage
  useEffect(() => {
    localStorage.setItem('musify_liked_songs', JSON.stringify(likedSongIds));
  }, [likedSongIds]);

  // Sync recently played to localStorage
  useEffect(() => {
    localStorage.setItem('musify_recent_songs', JSON.stringify(recentlyPlayed));
  }, [recentlyPlayed]);

  // Track recently played in backend if authenticated
  const logRecentlyPlayed = useCallback(async (song) => {
    if (!song) return;
    setRecentlyPlayed(prev => {
      const filtered = prev.filter(s => s.id !== song.id);
      return [song, ...filtered].slice(0, 30);
    });

    try {
      await api.post('/history', { songId: song.id });
    } catch {
      // Offline / unauthenticated silently handles
    }
  }, []);

  // Audio Event Listeners Setup
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const onEnded = () => {
      handleNextTrack();
    };

    const onError = (e) => {
      console.warn('Audio playback notice:', e);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, []);

  // Play a specific song or set of songs
  const playSong = useCallback((song, newQueue = null) => {
    if (!song) return;
    const audio = audioRef.current;

    if (newQueue && Array.isArray(newQueue)) {
      setQueue(newQueue);
      const idx = newQueue.findIndex(s => s.id === song.id);
      setQueueIndex(idx !== -1 ? idx : 0);
    } else {
      // If song not in current queue, append it
      setQueue(prev => {
        const idx = prev.findIndex(s => s.id === song.id);
        if (idx === -1) {
          return [...prev, song];
        }
        return prev;
      });
      const currentIdx = queue.findIndex(s => s.id === song.id);
      setQueueIndex(currentIdx !== -1 ? currentIdx : 0);
    }

    setCurrentSong(song);
    setCurrentTime(0);
    logRecentlyPlayed(song);

    if (audio.src !== song.audioUrl) {
      audio.src = song.audioUrl;
      audio.load();
    }

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch(err => {
          console.log('Playback requires user interaction or audio loading:', err);
          setIsPlaying(true); // show pause/playing state
        });
    }
  }, [logRecentlyPlayed, queue]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!currentSong) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (!audio.src && currentSong.audioUrl) {
        audio.src = currentSong.audioUrl;
      }
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(err => console.log('Audio play toggle:', err));
      }
      setIsPlaying(true);
    }
  }, [currentSong, isPlaying]);

  const handleNextTrack = useCallback(() => {
    if (repeatMode === 'one') {
      const audio = audioRef.current;
      audio.currentTime = 0;
      audio.play().catch(() => {});
      return;
    }

    if (queue.length === 0) return;

    let nextIndex;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = queueIndex + 1;
      if (nextIndex >= queue.length) {
        if (repeatMode === 'all') {
          nextIndex = 0;
        } else {
          // Playlist ended
          setIsPlaying(false);
          return;
        }
      }
    }

    setQueueIndex(nextIndex);
    const nextSong = queue[nextIndex];
    if (nextSong) {
      playSong(nextSong);
    }
  }, [queue, queueIndex, isShuffle, repeatMode, playSong]);

  const handlePrevTrack = useCallback(() => {
    const audio = audioRef.current;
    // If current song played more than 3 seconds, restart it
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    if (queue.length === 0) return;
    let prevIndex = queueIndex - 1;
    if (prevIndex < 0) {
      prevIndex = queue.length - 1;
    }
    setQueueIndex(prevIndex);
    const prevSong = queue[prevIndex];
    if (prevSong) {
      playSong(prevSong);
    }
  }, [queue, queueIndex, playSong]);

  const seek = useCallback((time) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const changeVolume = useCallback((newVol) => {
    const val = Math.max(0, Math.min(1, newVol));
    setVolume(val);
    if (val > 0 && isMuted) {
      setIsMuted(false);
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffle(prev => {
      const newState = !prev;
      addToast(newState ? 'Shuffle is on' : 'Shuffle is off', 'info', 1800);
      return newState;
    });
  }, [addToast]);

  const cycleRepeat = useCallback(() => {
    setRepeatMode(prev => {
      if (prev === 'off') {
        addToast('Repeat all', 'info', 1800);
        return 'all';
      }
      if (prev === 'all') {
        addToast('Repeat current song', 'info', 1800);
        return 'one';
      }
      addToast('Repeat off', 'info', 1800);
      return 'off';
    });
  }, [addToast]);

  const toggleLike = useCallback(async (songId) => {
    const isLiked = likedSongIds.includes(songId);
    if (isLiked) {
      setLikedSongIds(prev => prev.filter(id => id !== songId));
      addToast('Removed from Liked Songs', 'info', 2000);
      try {
        await api.delete(`/songs/${songId}/like`);
      } catch {}
    } else {
      setLikedSongIds(prev => [...prev, songId]);
      addToast('Added to Liked Songs ❤️', 'success', 2000);
      try {
        await api.post(`/songs/${songId}/like`);
      } catch {}
    }
  }, [likedSongIds, addToast]);

  const isLiked = useCallback((songId) => {
    return likedSongIds.includes(songId);
  }, [likedSongIds]);

  const addToQueue = useCallback((song) => {
    setQueue(prev => [...prev, song]);
    addToast(`Added "${song.title}" to queue`, 'success', 2200);
  }, [addToast]);

  const removeFromQueue = useCallback((index) => {
    setQueue(prev => prev.filter((_, idx) => idx !== index));
  }, []);

  const clearQueue = useCallback(() => {
    if (currentSong) {
      setQueue([currentSong]);
      setQueueIndex(0);
    }
  }, [currentSong]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept when user is typing in inputs or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight') {
        seek(Math.min(duration, currentTime + 5));
      } else if (e.code === 'ArrowLeft') {
        seek(Math.max(0, currentTime - 5));
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        changeVolume(volume + 0.05);
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        changeVolume(volume - 0.05);
      } else if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, seek, currentTime, duration, changeVolume, volume, toggleMute]);

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        isShuffle,
        repeatMode,
        queue,
        queueIndex,
        isQueueOpen,
        isLyricsOpen,
        setIsQueueOpen,
        setIsLyricsOpen,
        playSong,
        togglePlay,
        handleNextTrack,
        handlePrevTrack,
        seek,
        changeVolume,
        toggleMute,
        toggleShuffle,
        cycleRepeat,
        toggleLike,
        isLiked,
        addToQueue,
        removeFromQueue,
        clearQueue,
        recentlyPlayed
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
