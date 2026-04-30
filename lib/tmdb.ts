// TMDB API integration
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
}

export interface MovieDetails extends Movie {
  runtime: number;
  genres: Array<{ id: number; name: string }>;
  tagline: string;
  status: string;
  budget: number;
  revenue: number;
  homepage: string | null;
  imdb_id: string | null;
  original_language: string;
  original_title: string;
  origin_country: string[];
  adult: boolean;
  belongs_to_collection: {
    id: number;
    name: string;
    poster_path: string | null;
    backdrop_path: string | null;
  } | null;
  production_companies: Array<{
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
  }>;
  production_countries: Array<{
    iso_3166_1: string;
    name: string;
  }>;
  spoken_languages: Array<{
    english_name: string;
    iso_639_1: string;
    name: string;
  }>;
}

export interface SearchResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

function getApiKey(): string {
  const apiKey =
    process.env.TMDB_API_KEY ?? process.env.NEXT_PUBLIC_TMDB_API_KEY;
  if (!apiKey) {
    throw new Error(
      'TMDB API key is not configured. Set TMDB_API_KEY in your environment (e.g. .env.local).',
    );
  }
  return apiKey;
}

export async function searchMovies(
  query: string,
  page = 1,
): Promise<SearchResponse> {
  const apiKey = getApiKey();

  const url = `${TMDB_BASE_URL}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=${page}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to search movies');
  }

  return response.json();
}

export async function getTrendingMovies(
  timeWindow: 'day' | 'week' = 'week',
): Promise<SearchResponse> {
  const apiKey = getApiKey();

  const url = `${TMDB_BASE_URL}/trending/movie/${timeWindow}?api_key=${apiKey}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to get trending movies');
  }

  return response.json();
}

export async function getMovieDetails(movieId: number): Promise<MovieDetails> {
  const apiKey = getApiKey();

  const url = `${TMDB_BASE_URL}/movie/${movieId}?api_key=${apiKey}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to get movie details');
  }

  return response.json();
}

export function getImageUrl(
  path: string | null,
  size: 'w200' | 'w300' | 'w500' | 'w780' | 'original' = 'w500',
): string {
  if (!path) return '/placeholder-movie.png';
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}
