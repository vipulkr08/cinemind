export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
}

export interface MovieDetails extends Movie {
  genres: Array<{
    id: number;
    name: string;
  }>;
  runtime: number;
  status: string;
  tagline: string;
  budget: number;
  revenue: number;
  production_companies: Array<{
    id: number;
    name: string;
    logo_path: string | null;
  }>;
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
} 