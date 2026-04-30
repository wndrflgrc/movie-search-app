import { NextResponse } from 'next/server';
import { getMovieDetails } from '@/lib/tmdb';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const movieId = parseInt(id, 10);
    const details = await getMovieDetails(movieId);
    return NextResponse.json(details);
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movie details' },
      { status: 500 },
    );
  }
}
