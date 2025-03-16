import { Suspense } from 'react';
import { getMovieDetails, getEnhancedRecommendations } from '@/utils/api';
import MoviePageClient from '@/components/MoviePageClient';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MoviePage({ params }: Props) {
  try {
    const { id } = await params;
    const movieId = parseInt(id, 10);

    if (isNaN(movieId)) {
      return (
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-red-500">Invalid Movie ID</h1>
          <p className="mt-2 text-gray-400">The movie ID must be a valid number</p>
        </div>
      );
    }

    const [movie, recommendations] = await Promise.all([
      getMovieDetails(movieId),
      getEnhancedRecommendations([movieId])
    ]);

    return (
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
        </div>
      }>
        <MoviePageClient movie={movie} recommendations={recommendations} />
      </Suspense>
    );
  } catch (error) {
    console.error('Error loading movie:', error);
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-500">Error Loading Movie</h1>
        <p className="mt-2 text-gray-400">Please try again later</p>
      </div>
    );
  }
} 