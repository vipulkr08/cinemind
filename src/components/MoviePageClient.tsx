'use client';

import Image from 'next/image';
import { StarIcon, CalendarIcon } from '@heroicons/react/24/solid';
import { getImageUrl } from '@/utils/api';
import MovieCard from '@/components/MovieCard';
import PersonalizedRecommendations from '@/components/PersonalizedRecommendations';
import WatchProviders from '@/components/WatchProviders';
import ViewTracker from '@/components/ViewTracker';
import { Movie, MovieDetails } from '@/types/movie';
import { useEffect, useMemo } from 'react';

interface Genre {
  id: number;
  name: string;
}

interface MoviePageClientProps {
  movie: MovieDetails;
  recommendations: Movie[];
}

export default function MoviePageClient({ movie, recommendations }: MoviePageClientProps) {
  // Get viewed movies for filtering
  const viewedMovies = typeof window !== 'undefined' 
    ? JSON.parse(localStorage.getItem('viewedMovies') || '[]') 
    : [];

  // Memoize the filtered recommendations to ensure stability
  const { uniqueRecommendations, similarMovieIds } = useMemo(() => {
    const filtered = recommendations
      .filter((rec) => {
        const hasValidPoster = rec.poster_path != null;
        const hasValidRating = rec.vote_average > 0 && rec.vote_count >= 50;
        return hasValidPoster && hasValidRating && rec.id !== movie.id && !viewedMovies.includes(rec.id);
      })
      .filter((rec, index, self) => index === self.findIndex((r) => r.id === rec.id))
      .slice(0, 10);

    return {
      uniqueRecommendations: filtered,
      similarMovieIds: filtered.map(rec => rec.id)
    };
  }, [recommendations, movie.id, viewedMovies]);

  // Generate a unique section ID for this render
  const sectionId = `${movie.id}-${Date.now()}`;

  return (
    <main>
      <ViewTracker movieId={movie.id} />
      <div className="relative h-[60vh] w-full">
        <Image
          src={getImageUrl(movie.backdrop_path || movie.poster_path, 'original')}
          alt={movie.title}
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent p-8">
          <div className="container mx-auto">
            <h1 className="text-4xl font-bold text-white">{movie.title}</h1>
            {movie.tagline && (
              <p className="mt-2 text-xl text-gray-300">{movie.tagline}</p>
            )}
            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-1">
                <StarIcon className="h-6 w-6 text-yellow-400" />
                <span className="text-lg font-semibold">
                  {movie.vote_average.toFixed(1)}
                </span>
              </div>
              <span className="text-gray-300">
                {new Date(movie.release_date).getFullYear()}
              </span>
              <span className="text-gray-300">
                {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-[300px_1fr]">
          <div>
            <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
              <Image
                src={getImageUrl(movie.poster_path)}
                alt={movie.title}
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div>
            <h2 className="mb-4 text-2xl font-bold">Overview</h2>
            <p className="text-gray-300">{movie.overview}</p>

            <div className="mt-8">
              <h3 className="mb-2 text-xl font-semibold">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre: Genre) => (
                  <span
                    key={`genre-${genre.id}`}
                    className="rounded-full bg-gray-800 px-3 py-1 text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="mb-4 text-xl font-semibold">Where to Watch</h3>
              <WatchProviders movieId={movie.id} />
            </div>
          </div>
        </div>

        {uniqueRecommendations.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-8 text-2xl font-bold">More Like This</h2>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {uniqueRecommendations.map((rec) => (
                <div key={`similar-${rec.id}`}>
                  <MovieCard movie={rec} />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-16">
          <PersonalizedRecommendations 
            movieId={movie.id}
            similarMovieIds={similarMovieIds}
          />
        </div>
      </div>
    </main>
  );
} 