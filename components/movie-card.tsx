'use client';

import { Card, CardContent } from '@/components/ui/card';
import { getImageUrl, type Movie } from '@/lib/tmdb';
import { Star } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'motion/react';

interface MovieCardProps {
  movie: Movie;
  onClick?: () => void;
}

export function MovieCard({ movie, onClick }: MovieCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className='overflow-hidden cursor-pointer group h-full'
        onClick={onClick}
      >
        <div className='relative aspect-2/3 overflow-hidden bg-muted'>
          {movie.poster_path ? (
            <Image
              src={getImageUrl(movie.poster_path, 'w500')}
              alt={movie.title}
              fill
              className='object-cover transition-transform duration-300 group-hover:scale-110'
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            />
          ) : (
            <div className='flex items-center justify-center h-full text-muted-foreground'>
              No Image
            </div>
          )}
        </div>
        <CardContent className='p-4'>
          <h3 className='font-semibold line-clamp-1 mb-2'>{movie.title}</h3>
          <div className='flex items-center justify-between text-sm text-muted-foreground'>
            <span>{movie.release_date?.split('-')[0] || 'N/A'}</span>
            <div className='flex items-center gap-1'>
              <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
              <span className='font-medium'>
                {movie.vote_average.toFixed(1)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
