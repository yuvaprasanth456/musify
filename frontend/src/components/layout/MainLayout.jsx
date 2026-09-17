import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import MusicPlayer from '../player/MusicPlayer';
import QueueDrawer from '../player/QueueDrawer';
import BottomNav from './BottomNav';

export default function MainLayout() {
  return (
    <div className="app-shell">
      {/* 1. Desktop Left Sidebar */}
      <Sidebar />

      {/* 2. Main Content Area */}
      <div className="content-container">
        <Header />
        <main className="main-scrollable">
          <Outlet />
        </main>
      </div>

      {/* 3. Persistent Fixed Bottom Music Player */}
      <MusicPlayer />

      {/* 4. Slide-out Queue Panel */}
      <QueueDrawer />

      {/* 5. Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
