import axios from 'axios';
import { Movie } from '@/types/movie';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_TMDB_API_BASE_URL,
  params: {
    api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY,
  },
});

export const getPopularMovies = async (page = 1) => {
  const response = await api.get('/movie/popular', {
    params: { page },
  });
  return response.data;
};

export const getTopRatedMovies = async (page = 1) => {
  const response = await api.get('/movie/top_rated', {
    params: { page },
  });
  return response.data;
};

export const getTrendingMovies = async (timeWindow: 'day' | 'week' = 'week') => {
  const response = await api.get(`/trending/movie/${timeWindow}`);
  return response.data;
};

export const searchMovies = async (query: string, page = 1) => {
  const response = await api.get('/search/movie', {
    params: { 
      query, 
      page,
      language: 'en-US',
      include_adult: 'false'
    },
  });
  return response.data;
};

export const getMovieDetails = async (movieId: number) => {
  const response = await api.get(`/movie/${movieId}`);
  return response.data;
};

export const getMovieRecommendations = async (movieId: number) => {
  const response = await api.get(`/movie/${movieId}/recommendations`);
  return response.data;
};

export const getSimilarMovies = async (movieId: number) => {
  const response = await api.get(`/movie/${movieId}/similar`);
  return response.data;
};

export const getMovieKeywords = async (movieId: number) => {
  const response = await api.get(`/movie/${movieId}/keywords`);
  return response.data;
};

// AI-powered content-based recommendations
export const getContentBasedRecommendations = async (movieIds: number[]) => {
  // This would typically call your ML model API
  // For now, we'll use TMDB's similar movies as a placeholder
  const recommendations = await Promise.all(
    movieIds.map(id => getSimilarMovies(id))
  );
  
  // Combine and deduplicate recommendations
  const uniqueMovies = new Map();
  recommendations.forEach(response => {
    response.results.forEach((movie: Movie) => {
      if (!movieIds.includes(movie.id)) {
        uniqueMovies.set(movie.id, movie);
      }
    });
  });

  return Array.from(uniqueMovies.values());
};

export const getImageUrl = (path: string, size: string = 'w500') => {
  return `${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

export const getMovieReviews = async (movieId: number) => {
  const response = await api.get(`/movie/${movieId}/reviews`);
  return response.data;
};

// Sentiment Analysis function (using a hypothetical AI API)
export const analyzeSentiment = async (text: string) => {
  try {
    // This would call an actual sentiment analysis API
    // For now, we'll use a simple scoring based on positive/negative words
    const positiveWords = ['great', 'good', 'excellent', 'amazing', 'wonderful', 'best', 'love', 'fantastic'];
    const negativeWords = ['bad', 'poor', 'terrible', 'worst', 'hate', 'awful', 'disappointing'];
    
    const words = text.toLowerCase().split(/\s+/);
    let score = 0;
    
    words.forEach(word => {
      if (positiveWords.includes(word)) score += 1;
      if (negativeWords.includes(word)) score -= 1;
    });
    
    return {
      score: Math.max(-1, Math.min(1, score / 5)), // Normalize between -1 and 1
      sentiment: score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral'
    };
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    return { score: 0, sentiment: 'neutral' };
  }
};

// Enhanced recommendation system
export const getEnhancedRecommendations = async (movieIds: number[]) => {
  try {
    // Get basic recommendations
    const similarMovies = await getContentBasedRecommendations(movieIds);
    
    // Get keywords for each movie
    const keywordPromises = movieIds.map(id => getMovieKeywords(id));
    const keywordResponses = await Promise.all(keywordPromises);
    
    // Create a map of keyword frequencies
    const keywordFrequency = new Map<number, number>();
    keywordResponses.forEach(response => {
      response.keywords.forEach((keyword: { id: number }) => {
        keywordFrequency.set(
          keyword.id,
          (keywordFrequency.get(keyword.id) || 0) + 1
        );
      });
    });
    
    // Score each recommended movie based on keyword similarity
    const scoredMovies = await Promise.all(
      similarMovies.map(async (movie: Movie) => {
        const movieKeywords = await getMovieKeywords(movie.id);
        let score = 0;
        
        movieKeywords.keywords.forEach((keyword: { id: number }) => {
          score += keywordFrequency.get(keyword.id) || 0;
        });
        
        return {
          ...movie,
          similarityScore: score
        };
      })
    );
    
    // Sort by similarity score and return top results
    return scoredMovies
      .sort((a, b) => (b.similarityScore || 0) - (a.similarityScore || 0))
      .slice(0, 10);
  } catch (error) {
    console.error('Error getting enhanced recommendations:', error);
    return [];
  }
};

export interface WatchProvider {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number;
}

export interface WatchProviders {
  link: string;
  rent?: WatchProvider[];
  buy?: WatchProvider[];
  flatrate?: WatchProvider[];
}

export const getWatchProviders = async (movieId: number): Promise<WatchProviders | null> => {
  try {
    const response = await api.get(`/movie/${movieId}/watch/providers`);
    // Get results for the user's region (we'll use US as default)
    const results = response.data.results.US || response.data.results.GB;
    if (!results) return null;
    
    return {
      link: response.data.results.US?.link || '',
      rent: results.rent || [],
      buy: results.buy || [],
      flatrate: results.flatrate || [], // Streaming services
    };
  } catch (error) {
    console.error('Error fetching watch providers:', error);
    return null;
  }
}; 