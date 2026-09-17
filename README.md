# MUSIFY - Production-Grade Music Streaming Platform

<div align="center">
  <img src="frontend/public/favicon.svg" width="72" height="72" alt="MUSIFY Logo" />
  <h1>MUSIFY</h1>
  <p><strong>A full-stack, dark-mode music streaming web application built with React, Vite, Spring Boot, and Supabase.</strong></p>
</div>

---

## 🌟 Overview

**MUSIFY** is a modern, high-performance music streaming application inspired by contemporary dark streaming UX patterns. It provides an original brand identity, persistent HTML5 audio engine, live search, playlist management, lyrics view, artist studio dashboard, and JWT authentication backed by Spring Boot and Supabase PostgreSQL.

---

## 🚀 Key Features

### 🎵 1. Global Persistent Music Player
- **Continuous Audio Playback**: Navigating between pages (Home, Search, Library, Playlists) never interrupts or resets audio.
- **Playback Controls**: Play/Pause, Next Track, Previous Track (with restart logic if > 3s), Seek scrubbing with elapsed & duration timers.
- **Audio Modes**: Shuffle (Fisher-Yates queue randomization) and Repeat (`off`, `all`, `one`).
- **Dynamic Volume**: Volume slider with intelligent mute/unmute memory.
- **Play Queue**: Slide-out Up Next drawer with play-now, remove, and clear-queue actions.
- **Keyboard Shortcuts**:
  - `Space`: Play/Pause toggle
  - `ArrowLeft` / `ArrowRight`: Skip backward / forward 5 seconds
  - `ArrowUp` / `ArrowDown`: Volume up / down 5%
  - `M`: Mute / Unmute

### 🎤 2. Discovery & Home Hub
- **Time-Based Greeting**: Adapts dynamically ("Good morning", "Good afternoon", "Good evening").
- **Featured Spotlight Hero Banner**: Visualizer showcase with 1-click playback.
- **Categorized Sections**:
  - *Trending Songs*
  - *Tamil Hits*, *Tamil Trending*, *Tamil Melody*, *Tamil Love*, *Tamil Chill*, *Tamil Party*, *Tamil Indie*, *Tamil Classical*, *Tamil Folk*, *Tamil Devotional*
  - *Workout*, *Focus*, *Night Vibes*
- **Rich Music Cards**: High-res cover art, floating hover play button, heart like action, context menu.

### 🔍 3. Live Categorized Search
- Real-time debounced search calling `/api/search?q=...`.
- Categorized result tabs: **All**, **Songs**, **Artists**, **Playlists**.
- Top Result showcase card with direct playback.
- Visual browse category gradient tiles when search is idle.

### 📚 4. Your Library & Playlist Management
- **Liked Songs**: Dedicated playlist view with custom gradient banner, song count, and bulk play.
- **Playlist Creator**: Create, edit title/description, delete, add/remove songs from any track.
- **Recently Played**: Chronological playback history log.

### 📜 5. Fullscreen Now Playing & Interactive Lyrics
- Immersive large-format view with dynamic ambient glow matched to album art.
- Real-time lyrics with timestamp-based active line highlight and click-to-seek jump.
- Audio format and metadata inspector (Stereo 320kbps MP3, genre, release date).

### 🎨 6. Artist Studio Dashboard
- Dedicated creator portal for users with `ARTIST` role.
- Real-time KPI analytics: Total tracks, total streams, recorded likes, followers.
- **Upload Studio**: Drag-and-drop cover artwork and audio master files with Supabase Storage integration.
- Track management with delete and edit capabilities.

### 🔐 7. Authentication & Security
- Stateless JWT-based authentication.
- User registration with role selection (**Music Listener** vs. **Artist/Creator**) and avatar selection.
- One-click **Demo Listener** and **Demo Artist** logins for immediate evaluation.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18/19, Vite, JavaScript, CSS3 Design Tokens, Lucide Icons, Axios, React Router |
| **Backend** | Java 21/25, Spring Boot 3.4, Spring Data JPA, Spring Security 6, JJWT (0.12) |
| **Database** | Supabase PostgreSQL (with H2 in-memory local fallback) |
| **Storage** | Supabase Storage (`music/`, `covers/`, `profiles/` buckets) |
| **Architecture** | REST API, Controller-Service-Repository pattern, Stateless JWT Filter |

---

## 📂 Project Structure

```
musify/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── cards/          # MusicCard, SongRow, CategorySection
│   │   │   ├── common/         # Modal, DropdownMenu, Toast
│   │   │   ├── layout/         # Sidebar, Header, BottomNav, MainLayout
│   │   │   ├── lyrics/         # LyricsView with synced timestamps
│   │   │   ├── player/         # MusicPlayer, ProgressBar, VolumeControl, QueueDrawer
│   │   │   └── playlist/       # CreatePlaylistModal, AddToPlaylistModal
│   │   ├── context/            # AuthContext, PlayerContext, ToastContext
│   │   ├── pages/              # Home, Search, Library, Liked, Recent, Playlist, Artist, NowPlaying, Studio, Login, Register, Settings
│   │   ├── services/           # api.js, supabaseStorage.js
│   │   ├── utils/              # formatters.js, sampleData.js
│   │   ├── index.css           # Modern Dark Spotify-Style Design System
│   │   ├── App.jsx             # Routes & Provider Hierarchy
│   │   └── main.jsx
│   ├── public/                 # Static assets & favicon.svg
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/main/java/com/musify/
│   │   ├── config/             # DataInitializer, WebConfig
│   │   ├── controller/         # Auth, Song, Playlist, Search, Artist, History
│   │   ├── dto/                # Request & response data records
│   │   ├── entity/             # User, Artist, Album, Song, Playlist, LikedSong, etc.
│   │   ├── exception/          # GlobalExceptionHandler, Custom Exceptions
│   │   ├── repository/         # Spring Data JPA Repositories
│   │   ├── security/           # JwtTokenProvider, SecurityConfig, JwtFilter
│   │   └── service/            # Business logic services
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── pom.xml
│   └── mvnw.cmd
│
├── database/
│   ├── schema.sql              # Supabase PostgreSQL schema
│   └── seed.sql                # Supabase sample dataset
└── README.md
```

---

## ⚙️ Setup & Installation

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v24)
- **Java**: JDK 21 or JDK 25

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend will start at `http://localhost:5173/`.

### 3. Backend Setup
```bash
cd backend
# On Windows:
.\mvnw.cmd spring-boot:run
# On Linux/macOS:
./mvnw spring-boot:run
```
The backend will start at `http://localhost:8080/`.

---

## 🗄️ Supabase Configuration (Optional for Production)

### 1. Supabase Database
1. Open your [Supabase Dashboard](https://supabase.com/).
2. Navigate to the **SQL Editor**.
3. Copy and run the contents of [`database/schema.sql`](database/schema.sql).
4. Run [`database/seed.sql`](database/seed.sql) to populate initial tracks.

### 2. Supabase Storage
Create three public buckets in Supabase Storage:
- `music` (for uploaded audio files)
- `covers` (for album/playlist artwork)
- `profiles` (for user avatar pictures)

### 3. Environment Variables

**Frontend (`frontend/.env`)**:
```env
VITE_API_URL=http://localhost:8080/api
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Backend (`backend/src/main/resources/application.properties` or system env)**:
```properties
SPRING_DATASOURCE_URL=jdbc:postgresql://db.your-project.supabase.co:5432/postgres
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=your-db-password
JWT_SECRET=your-secure-jwt-secret-key-at-least-256-bits-long
```

*(Note: If no Supabase credentials are provided, MUSIFY automatically runs in self-contained mode with built-in in-memory PostgreSQL simulation and rich catalog initialization).*

---

## 🧪 Quick Test Credentials

| Account Role | Email | Password |
|---|---|---|
| **Listener Demo** | `user@musify.io` | `password123` |
| **Artist Studio Demo** | `anirudh@musify.io` | `password123` |

You can also click **"Listener Demo"** or **"Artist Demo"** directly on the Login screen for 1-click access.

---

## 📜 License
This project is open-source and created for educational and commercial streaming architecture demonstration. All sample audio tracks are open-licensed, royalty-free audio files.
