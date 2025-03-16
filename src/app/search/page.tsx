'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchMovies } from '@/utils/api';
import MovieCard from '@/components/MovieCard';
import { Movie } from '@/types/movie';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) return;

      setIsLoading(true);
      setError('');

      try {
        const { results } = await searchMovies(query);
        setMovies(results.filter((movie: Movie) => 
          movie.poster_path !== null && 
          movie.vote_average > 0 && 
          movie.vote_count >= 50
        ));
      } catch (error) {
        console.error('Search failed:', error);
        setError('Failed to fetch search results. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">
          Search Results for "{query}"
        </h1>
        <p className="text-gray-400 mb-8">
          Found {movies.length} movies matching your search
        </p>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <MagnifyingGlassIcon className="h-8 w-8 text-yellow-500 animate-pulse" />
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-500">{error}</p>
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-20">
            <MagnifyingGlassIcon className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-white mb-2">No movies found</h2>
            <p className="text-gray-400">
              Try adjusting your search or browse our popular movies
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
} 