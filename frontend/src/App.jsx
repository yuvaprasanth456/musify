import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';

import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import LibraryPage from './pages/LibraryPage';
import LikedSongsPage from './pages/LikedSongsPage';
import RecentlyPlayedPage from './pages/RecentlyPlayedPage';
import PlaylistDetailPage from './pages/PlaylistDetailPage';
import ArtistDetailPage from './pages/ArtistDetailPage';
import NowPlayingPage from './pages/NowPlayingPage';
import ArtistDashboardPage from './pages/ArtistDashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ToastProvider>
        <AuthProvider>
          <PlayerProvider>
            <Routes>
              {/* Standalone Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Persistent Main Application Shell */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="search" element={<SearchPage />} />
                <Route path="library" element={<LibraryPage />} />
                <Route path="liked" element={<LikedSongsPage />} />
                <Route path="recently-played" element={<RecentlyPlayedPage />} />
                <Route path="playlist/:id" element={<PlaylistDetailPage />} />
                <Route path="artist/:id" element={<ArtistDetailPage />} />
                <Route path="now-playing" element={<NowPlayingPage />} />
                <Route path="artist/dashboard" element={<ArtistDashboardPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </PlayerProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
