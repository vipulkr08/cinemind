import { getPopularMovies } from '@/utils/api';
import MovieCard from '@/components/MovieCard';
import { Movie } from '@/types/movie';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { FireIcon } from '@heroicons/react/24/solid';

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  
  // TMDB API has a maximum of 500 pages
  const MAX_PAGES = 500;

  // Get movies for the current page
  const { results, total_pages } = await getPopularMovies(Math.min(currentPage, MAX_PAGES));

  // Filter out invalid movies
  const movies = results.filter((movie: Movie) => 
    movie.poster_path !== null && 
    movie.vote_average > 0 && 
    movie.vote_count >= 50
  );

  return (
    <main>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-gray-900/0 to-gray-900 min-h-[40vh] flex items-center">
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-transparent transform rotate-180"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${movies[0]?.backdrop_path ? 
                `https://image.tmdb.org/t/p/original${movies[0].backdrop_path}` : 
                '/default-backdrop.jpg'})`,
            }}
          ></div>
        </div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <FireIcon className="h-8 w-8 text-yellow-500" />
              <h1 className="text-5xl font-bold text-white">Popular Movies</h1>
            </div>
            <p className="text-xl text-gray-300 max-w-2xl">
              Discover the most-watched and trending movies right now. Updated daily based on user engagement and ratings.
            </p>
          </div>
        </div>
      </div>

      {/* Movies Grid Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {movies.map((movie: Movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-12 flex flex-col items-center gap-4">
          <div className="flex justify-center items-center gap-3">
            {currentPage > 1 && (
              <Link
                href={`/?page=${currentPage - 1}`}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 
                         bg-gray-800/50 backdrop-blur-sm rounded-lg hover:bg-gray-700/50 
                         transition-all duration-300 border border-gray-700/50"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                Previous
              </Link>
            )}
            <div className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-gray-300 
                          bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50">
              <span className="text-yellow-500">{currentPage}</span>
              <span className="text-gray-500">of</span>
              <span>{total_pages}</span>
            </div>
            {currentPage < total_pages && (
              <Link
                href={`/?page=${currentPage + 1}`}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 
                         bg-gray-800/50 backdrop-blur-sm rounded-lg hover:bg-gray-700/50 
                         transition-all duration-300 border border-gray-700/50"
              >
                Next
                <ChevronRightIcon className="h-4 w-4" />
              </Link>
            )}
          </div>
          <div className="text-sm text-gray-400">
            Showing {movies.length} movies
          </div>
        </div>
      </div>
    </main>
  );
}
