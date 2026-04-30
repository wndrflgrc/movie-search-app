import { NextRequest, NextResponse } from 'next/server';
import { searchMovies, getTrendingMovies } from '@/lib/tmdb';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');
  const page = parseInt(searchParams.get('page') || '1', 10);

  try {
    if (query) {
      const results = await searchMovies(query, page);
      return NextResponse.json(results);
    } else {
      const results = await getTrendingMovies();
      return NextResponse.json(results);
    }
  } catch (error) {
    console.error('Error fetching movies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movies' },
      { status: 500 },
    );
  }
}
