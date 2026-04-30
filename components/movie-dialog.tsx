'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { getImageUrl, type Movie, type MovieDetails } from '@/lib/tmdb';
import {
  Calendar,
  Clock,
  Globe,
  Languages,
  Loader2,
  MapPin,
  Star,
  TrendingUp,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface MovieDialogProps {
  movie: Movie | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const numberFmt = new Intl.NumberFormat('en-US');
const currencyFmt = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

function formatRuntime(minutes: number | null | undefined) {
  if (!minutes) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function formatYear(date?: string) {
  if (!date) return null;
  const y = new Date(date).getFullYear();
  return Number.isNaN(y) ? null : y;
}

function formatMoney(value: number | undefined) {
  if (!value || value <= 0) return null;
  return currencyFmt.format(value);
}

export function MovieDialog({ movie, open, onOpenChange }: MovieDialogProps) {
  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!movie || !open) return;

    let cancelled = false;
    setLoading(true);
    setDetails(null);

    fetch(`/api/movies/${movie.id}`)
      .then((res) => res.json())
      .then((data: MovieDetails) => {
        if (!cancelled) setDetails(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [movie, open]);

  if (!movie) return null;

  const year = formatYear(details?.release_date ?? movie.release_date);
  const runtime = formatRuntime(details?.runtime);
  const rating = movie.vote_average?.toFixed(1);
  const budget = formatMoney(details?.budget);
  const revenue = formatMoney(details?.revenue);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[92vh] w-[calc(100%-1rem)] max-w-3xl overflow-hidden rounded-2xl p-0 sm:max-w-3xl lg:max-w-4xl'>
        <div className='max-h-[92vh] overflow-y-auto'>
          {/* Hero: backdrop + poster + title */}
          <div className='relative'>
            {movie.backdrop_path ? (
              <div className='relative aspect-video w-full sm:aspect-21/9'>
                <Image
                  src={getImageUrl(movie.backdrop_path, 'w780')}
                  alt={movie.title}
                  fill
                  priority
                  sizes='(max-width: 1024px) 100vw, 1024px'
                  className='object-cover'
                />
                <div className='absolute inset-0 bg-linear-to-t from-popover via-popover/80 to-transparent' />
                <div className='absolute inset-0 bg-linear-to-r from-popover/70 via-transparent to-transparent' />
              </div>
            ) : (
              <div className='h-32 w-full bg-muted' />
            )}

            {/* Poster + heading */}
            <div className='relative -mt-16 flex flex-col gap-4 px-4 pb-4 sm:-mt-24 sm:flex-row sm:items-end sm:gap-6 sm:px-6 sm:pb-6'>
              <div className='relative aspect-2/3 w-28 shrink-0 overflow-hidden rounded-lg shadow-xl ring-1 ring-border sm:w-36'>
                {movie.poster_path ? (
                  <Image
                    src={getImageUrl(movie.poster_path, 'w300')}
                    alt={movie.title}
                    fill
                    sizes='160px'
                    className='object-cover'
                  />
                ) : (
                  <div className='flex h-full items-center justify-center bg-muted text-xs text-muted-foreground'>
                    No poster
                  </div>
                )}
              </div>

              <div className='min-w-0 flex-1 sm:pb-1'>
                <DialogTitle className='font-heading text-xl leading-tight font-semibold tracking-tight sm:text-3xl'>
                  {movie.title}
                  {year && (
                    <span className='ml-2 font-normal text-muted-foreground'>
                      ({year})
                    </span>
                  )}
                </DialogTitle>
                {details?.original_title &&
                  details.original_title !== movie.title && (
                    <p className='mt-1 text-xs text-muted-foreground sm:text-sm'>
                      Original: {details.original_title}
                    </p>
                  )}
                {details?.tagline && (
                  <p className='mt-2 text-sm text-muted-foreground italic sm:text-base'>
                    “{details.tagline}”
                  </p>
                )}

                {/* Quick stats */}
                <div className='mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm'>
                  {rating && (
                    <span className='inline-flex items-center gap-1.5'>
                      <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                      <span className='font-medium'>{rating}</span>
                      <span className='text-muted-foreground'>
                        ({numberFmt.format(movie.vote_count)} votes)
                      </span>
                    </span>
                  )}
                  {(details?.release_date || movie.release_date) && (
                    <span className='inline-flex items-center gap-1.5 text-muted-foreground'>
                      <Calendar className='h-4 w-4' />
                      {details?.release_date || movie.release_date}
                    </span>
                  )}
                  {runtime && (
                    <span className='inline-flex items-center gap-1.5 text-muted-foreground'>
                      <Clock className='h-4 w-4' />
                      {runtime}
                    </span>
                  )}
                  {details?.status && (
                    <span className='inline-flex items-center gap-1.5 text-muted-foreground'>
                      <TrendingUp className='h-4 w-4' />
                      {details.status}
                    </span>
                  )}
                </div>

                {/* Genres */}
                {details?.genres && details.genres.length > 0 && (
                  <div className='mt-3 flex flex-wrap gap-1.5'>
                    {details.genres.map((g) => (
                      <span
                        key={g.id}
                        className='rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground'
                      >
                        {g.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Body */}
          <div className='space-y-6 px-4 pb-6 sm:px-6 sm:pb-8'>
            <DialogDescription asChild>
              <section>
                <h3 className='mb-2 text-sm font-semibold text-foreground'>
                  Overview
                </h3>
                <p className='text-sm leading-relaxed text-muted-foreground'>
                  {movie.overview || 'No overview available.'}
                </p>
              </section>
            </DialogDescription>

            {/* External links */}
            <div className='flex flex-wrap gap-2'>
              {details?.homepage && (
                <a
                  href={details.homepage}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted'
                >
                  <Globe className='h-3.5 w-3.5' />
                  Official site
                </a>
              )}
              {details?.imdb_id && (
                <a
                  href={`https://www.imdb.com/title/${details.imdb_id}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-1.5 rounded-md border border-yellow-400/40 bg-yellow-400/10 px-3 py-1.5 text-xs font-medium text-yellow-700 transition-colors hover:bg-yellow-400/20 dark:text-yellow-300'
                >
                  IMDb
                </a>
              )}
              <a
                href={`https://www.themoviedb.org/movie/${movie.id}`}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted'
              >
                TMDB
              </a>
            </div>

            {/* Stats grid */}
            {details && (
              <section>
                <h3 className='mb-3 text-sm font-semibold'>Details</h3>
                <dl className='grid grid-cols-1 gap-3 text-sm sm:grid-cols-2'>
                  {budget && <Stat label='Budget' value={budget} />}
                  {revenue && <Stat label='Revenue' value={revenue} />}
                  {details.original_language && (
                    <Stat
                      label='Original language'
                      value={details.original_language.toUpperCase()}
                    />
                  )}
                  {typeof movie.popularity === 'number' && (
                    <Stat
                      label='Popularity'
                      value={movie.popularity.toFixed(2)}
                    />
                  )}
                </dl>
              </section>
            )}

            {/* Languages & Countries */}
            {details &&
              (details.spoken_languages?.length > 0 ||
                details.production_countries?.length > 0) && (
                <section className='grid gap-4 sm:grid-cols-2'>
                  {details.spoken_languages?.length > 0 && (
                    <div>
                      <h4 className='mb-2 inline-flex items-center gap-1.5 text-sm font-semibold'>
                        <Languages className='h-4 w-4' />
                        Spoken languages
                      </h4>
                      <ul className='flex flex-wrap gap-1.5'>
                        {details.spoken_languages.map((l) => (
                          <li
                            key={l.iso_639_1}
                            className='rounded-md border border-border bg-muted/50 px-2 py-0.5 text-xs'
                          >
                            {l.english_name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {details.production_countries?.length > 0 && (
                    <div>
                      <h4 className='mb-2 inline-flex items-center gap-1.5 text-sm font-semibold'>
                        <MapPin className='h-4 w-4' />
                        Countries
                      </h4>
                      <ul className='flex flex-wrap gap-1.5'>
                        {details.production_countries.map((c) => (
                          <li
                            key={c.iso_3166_1}
                            className='rounded-md border border-border bg-muted/50 px-2 py-0.5 text-xs'
                          >
                            {c.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </section>
              )}

            {/* Production companies */}
            {details?.production_companies &&
              details.production_companies.length > 0 && (
                <section>
                  <h3 className='mb-3 text-sm font-semibold'>Production</h3>
                  <ul className='flex flex-wrap items-center gap-3'>
                    {details.production_companies.map((c) => (
                      <li
                        key={c.id}
                        className='flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2'
                        title={c.name}
                      >
                        {c.logo_path ? (
                          <div className='relative h-6 w-12 shrink-0'>
                            <Image
                              src={getImageUrl(c.logo_path, 'w200')}
                              alt={c.name}
                              fill
                              sizes='80px'
                              className='object-contain dark:brightness-0 dark:invert'
                            />
                          </div>
                        ) : null}
                        <span className='text-xs font-medium'>{c.name}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

            {loading && (
              <div className='flex items-center justify-center gap-2 py-2 text-xs text-muted-foreground'>
                <Loader2 className='h-3.5 w-3.5 animate-spin' />
                Loading details…
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className='flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2'>
      <dt className='text-xs tracking-wide text-muted-foreground uppercase'>
        {label}
      </dt>
      <dd className='font-medium'>{value}</dd>
    </div>
  );
}
