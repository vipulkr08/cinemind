'use client';

import { useEffect, useState, useMemo } from 'react';
import { Movie } from '@/types/movie';
import { getContentBasedRecommendations } from '@/utils/api';
import MovieCard from './MovieCard';
import { SparklesIcon } from '@heroicons/react/24/solid';

interface PersonalizedRecommendationsProps {
  movieId: number;
  similarMovieIds: number[];
}

export default function PersonalizedRecommendations({ 
  movieId, 
  similarMovieIds
}: PersonalizedRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Memoize the filtered recommendations
  const filteredRecommendations = useMemo(() => {
    return recommendations.filter((movie, index, self) => {
      const isFirstOccurrence = index === self.findIndex((m) => m.id === movie.id);
      const isNotInSimilar = !similarMovieIds.includes(movie.id);
      const hasValidPoster = movie.poster_path != null;
      const hasValidRating = movie.vote_average > 0 && movie.vote_count >= 50;
      const isNotCurrentMovie = movie.id !== movieId;
      
      return isFirstOccurrence && isNotInSimilar && 
             hasValidPoster && hasValidRating && isNotCurrentMovie;
    }).slice(0, 10);
  }, [recommendations, similarMovieIds, movieId]);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        if (typeof window === 'undefined') return;

        // Get viewed movies from localStorage
        const viewedMovies = JSON.parse(localStorage.getItem('viewedMovies') || '[]');
        
        if (viewedMovies.length === 0) {
          setIsLoading(false);
          return;
        }

        // Get recommendations based on viewing history
        const recommendedMovies = await getContentBasedRecommendations(viewedMovies);
        setRecommendations(recommendedMovies);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecommendations();
  }, [movieId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (filteredRecommendations.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <SparklesIcon className="h-5 w-5 text-yellow-400" />
        <h2 className="text-xl font-semibold">Recommended for You</h2>
        <span className="text-gray-400">
          (Based on your viewing history)
        </span>
      </div>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filteredRecommendations.map((rec) => (
          <div key={`personal-${rec.id}`}>
            <MovieCard movie={rec} />
          </div>
        ))}
      </div>
    </div>
  );
} 