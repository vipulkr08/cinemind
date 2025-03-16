import { getTopRatedMovies } from '@/utils/api';
import MovieCard from '@/components/MovieCard';
import { Movie } from '@/types/movie';

export default async function TopRatedPage() {
  const { results } = await getTopRatedMovies();
  const movies = results.filter((movie: Movie) => movie.poster_path !== null);

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-bold text-white text-center mb-4">
          Top Rated Movies
        </h1>
        <p className="text-gray-400 text-center">
          Discover the highest-rated movies of all time
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {movies.map((movie: Movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </main>
  );
} 