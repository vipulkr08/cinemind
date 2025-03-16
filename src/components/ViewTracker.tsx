'use client';

import { useEffect } from 'react';

interface ViewTrackerProps {
  movieId: number;
}

export default function ViewTracker({ movieId }: ViewTrackerProps) {
  useEffect(() => {
    const viewedMovies = JSON.parse(localStorage.getItem('viewedMovies') || '[]');
    if (!viewedMovies.includes(movieId)) {
      viewedMovies.push(movieId);
      localStorage.setItem('viewedMovies', JSON.stringify(viewedMovies));
    }
  }, [movieId]);

  return null;
} 