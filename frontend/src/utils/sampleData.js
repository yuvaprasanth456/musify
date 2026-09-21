/**
 * MUSIFY Music Catalog Definitions
 */

export const SAMPLE_SONGS = [];

export const SAMPLE_ARTISTS = [
  {
    id: 101,
    name: 'A.R. Rahman',
    bio: 'Academy and Grammy Award-winning composer, music producer, and cultural icon renowned worldwide.',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
    monthlyListeners: 18450000,
    verified: true
  },
  {
    id: 102,
    name: 'Anirudh Ravichander',
    bio: 'Leading Indian music director and youth icon celebrated for electric beats and chart-topping bangers.',
    imageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500&auto=format&fit=crop&q=80',
    monthlyListeners: 15200000,
    verified: true
  },
  {
    id: 103,
    name: 'Shreya Ghoshal',
    bio: 'Eminent vocalist and national award winner celebrated for timeless melodies across Indian languages.',
    imageUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&auto=format&fit=crop&q=80',
    monthlyListeners: 12900000,
    verified: true
  },
  {
    id: 104,
    name: 'Harris Jayaraj',
    bio: 'Pioneering composer known for lush harmonies, innovative rhythms, and romantic cinematic classics.',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&auto=format&fit=crop&q=80',
    monthlyListeners: 9800000,
    verified: true
  },
  {
    id: 105,
    name: 'Govind Vasantha',
    bio: 'Soulful violinist and music director whose poignant melodies evoke pure nostalgia and love.',
    imageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=500&auto=format&fit=crop&q=80',
    monthlyListeners: 4600000,
    verified: true
  },
  {
    id: 106,
    name: 'Dhee',
    bio: 'Independent singer-songwriter blending South Asian folk traditions with contemporary R&B.',
    imageUrl: 'https://images.unsplash.com/photo-1518972559570-7cc1309f3229?w=500&auto=format&fit=crop&q=80',
    monthlyListeners: 5400000,
    verified: true
  }
];

export const SAMPLE_PLAYLISTS = [
  {
    id: 1,
    name: 'Top Tamil Hits 2024',
    description: 'The absolute biggest trending songs in Tamil cinema and pop right now.',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80',
    songCount: 0,
    isPublic: true,
    createdBy: 'MUSIFY Editorial'
  },
  {
    id: 2,
    name: 'Tamil Chill & Rain',
    description: 'Soft guitar strings, soulful violins, and gentle lo-fi acoustic melodies.',
    coverUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&auto=format&fit=crop&q=80',
    songCount: 0,
    isPublic: true,
    createdBy: 'MUSIFY Editorial'
  },
  {
    id: 3,
    name: 'High Energy Workout',
    description: 'Pump up your pulse with high-tempo club bangers and driving bass lines.',
    coverUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&auto=format&fit=crop&q=80',
    songCount: 0,
    isPublic: true,
    createdBy: 'MUSIFY Editorial'
  },
  {
    id: 4,
    name: 'Late Night Focus',
    description: 'Ambient warmth, zero lyrics, peaceful coding and reading soundscapes.',
    coverUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500&auto=format&fit=crop&q=80',
    songCount: 0,
    isPublic: true,
    createdBy: 'MUSIFY Editorial'
  }
];

export const CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'Tamil Hits', name: 'Tamil Hits', color: '#e91e63' },
  { id: 'Tamil Trending', name: 'Tamil Trending', color: '#ff5722' },
  { id: 'Tamil Melody', name: 'Tamil Melody', color: '#4caf50' },
  { id: 'Tamil Love', name: 'Tamil Love', color: '#9c27b0' },
  { id: 'Tamil Chill', name: 'Tamil Chill', color: '#00bcd4' },
  { id: 'Tamil Party', name: 'Tamil Party', color: '#ff9800' },
  { id: 'Tamil Indie', name: 'Tamil Indie', color: '#673ab7' },
  { id: 'Tamil Classical', name: 'Tamil Classical', color: '#795548' },
  { id: 'Tamil Folk', name: 'Tamil Folk', color: '#8bc34a' },
  { id: 'Tamil Devotional', name: 'Tamil Devotional', color: '#f44336' },
  { id: 'Workout', name: 'Workout', color: '#03a9f4' },
  { id: 'Focus', name: 'Focus', color: '#607d8b' },
  { id: 'Night Vibes', name: 'Night Vibes', color: '#3f51b5' }
];
