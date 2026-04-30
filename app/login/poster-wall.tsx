'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { getImageUrl } from '@/lib/tmdb';

type Poster = { id: number; path: string; title: string };

interface PosterWallProps {
  posters: Poster[];
}

export function PosterWall({ posters }: PosterWallProps) {
  if (posters.length === 0) return null;

  // Split into 3 columns for the marquee effect.
  const columns: Poster[][] = [[], [], []];
  posters.forEach((p, i) => columns[i % 3].push(p));

  return (
    <div
      aria-hidden
      className='pointer-events-none absolute inset-0 grid select-none grid-cols-3 gap-3 overflow-hidden p-3 sm:gap-4 sm:p-4'
    >
      {columns.map((col, idx) => {
        // Duplicate to allow seamless looping.
        const items = [...col, ...col];
        const direction = idx % 2 === 0 ? -1 : 1;
        return (
          <motion.div
            key={idx}
            className='flex flex-col gap-3 sm:gap-4'
            initial={{ y: direction === -1 ? '0%' : '-50%' }}
            animate={{ y: direction === -1 ? '-50%' : '0%' }}
            transition={{
              duration: 60 + idx * 8,
              ease: 'linear',
              repeat: Infinity,
            }}
          >
            {items.map((p, i) => (
              <div
                key={`${p.id}-${i}`}
                className='relative aspect-2/3 w-full overflow-hidden rounded-lg shadow-lg ring-1 ring-white/10'
              >
                <Image
                  src={getImageUrl(p.path, 'w300')}
                  alt={p.title}
                  fill
                  sizes='(max-width: 1024px) 33vw, 20vw'
                  className='object-cover'
                  priority={i < 2}
                />
              </div>
            ))}
          </motion.div>
        );
      })}
    </div>
  );
}
