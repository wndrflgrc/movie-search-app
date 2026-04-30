'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getImageUrl, type Movie, type MovieDetails } from '@/lib/tmdb';
import { Star, Calendar, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface MovieDialogProps {
  movie: Movie | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MovieDialog({ movie, open, onOpenChange }: MovieDialogProps) {
  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (movie && open) {
      setLoading(true);
      fetch(`/api/movies/${movie.id}`)
        .then((res) => res.json())
        .then((data) => {
          setDetails(data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [movie, open]);

  if (!movie) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-2xl'>{movie.title}</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4'>
          {movie.backdrop_path && (
            <div className='relative aspect-video overflow-hidden rounded-lg'>
              <Image
                src={getImageUrl(movie.backdrop_path, 'w780')}
                alt={movie.title}
                fill
                className='object-cover'
                sizes='(max-width: 768px) 100vw, 50vw'
              />
            </div>
          )}
          <div className='grid gap-4'>
            {details?.tagline && (
              <p className='text-muted-foreground italic'>{details.tagline}</p>
            )}
            <div className='flex flex-wrap gap-4 text-sm'>
              <div className='flex items-center gap-2'>
                <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                <span className='font-medium'>
                  {movie.vote_average.toFixed(1)}
                </span>
                <span className='text-muted-foreground'>
                  ({movie.vote_count} votes)
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <Calendar className='h-4 w-4' />
                <span>{movie.release_date || 'N/A'}</span>
              </div>
              {details?.runtime && (
                <div className='flex items-center gap-2'>
                  <TrendingUp className='h-4 w-4' />
                  <span>{details.runtime} min</span>
                </div>
              )}
            </div>
            {details?.genres && details.genres.length > 0 && (
              <div className='flex flex-wrap gap-2'>
                {details.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className='px-3 py-1 rounded-full bg-primary/10 text-primary text-sm'
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}
            <div>
              <h3 className='font-semibold mb-2'>Overview</h3>
              <p className='text-muted-foreground leading-relaxed'>
                {movie.overview || 'No overview available.'}
              </p>
            </div>
            {loading && (
              <p className='text-sm text-muted-foreground'>
                Loading details...
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
