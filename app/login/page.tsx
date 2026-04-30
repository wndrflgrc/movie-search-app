import Link from 'next/link';
import { Film, Sparkles } from 'lucide-react';
import { getTrendingMovies, type Movie } from '@/lib/tmdb';
import { LoginForm } from './login-form';
import { PosterWall } from './poster-wall';

export const revalidate = 3600;

async function fetchPosters() {
  try {
    const data = await getTrendingMovies('week');
    return data.results
      .filter((m: Movie) => Boolean(m.poster_path))
      .slice(0, 18)
      .map((m: Movie) => ({
        id: m.id,
        path: m.poster_path as string,
        title: m.title,
      }));
  } catch {
    return [];
  }
}

export default async function LoginPage() {
  const posters = await fetchPosters();

  return (
    <div className='relative flex min-h-screen w-full overflow-hidden bg-neutral-950 text-white'>
      {/* Left: poster wall hero (hidden on small screens) */}
      <aside className='relative hidden w-1/2 overflow-hidden lg:block xl:w-[58%]'>
        <PosterWall posters={posters} />
        {/* Gradient overlays for legibility */}
        <div className='absolute inset-0 bg-linear-to-tr from-neutral-950 via-neutral-950/70 to-transparent' />
        <div className='absolute inset-0 bg-linear-to-r from-neutral-950/40 via-transparent to-neutral-950/80' />

        {/* Branding overlay */}
        <div className='relative z-10 flex h-full flex-col justify-between p-10 xl:p-14'>
          <Link
            href='/'
            className='inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-white/90'
          >
            <span className='flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 backdrop-blur'>
              <Film className='h-5 w-5' />
            </span>
            CineSearch
          </Link>

          <div className='max-w-lg space-y-4'>
            <span className='inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur'>
              <Sparkles className='h-3.5 w-3.5' />
              Powered by TMDB
            </span>
            <h2 className='text-3xl font-semibold leading-tight tracking-tight xl:text-5xl'>
              Discover your next favorite film.
            </h2>
            <p className='text-sm text-white/70 xl:text-base'>
              Browse trending titles, search a database of millions of movies,
              and dive into the details — all from one beautifully simple app.
            </p>
          </div>

          <p className='text-xs text-white/50'>
            © {new Date().getFullYear()} CineSearch. Movie data from{' '}
            <a
              href='https://www.themoviedb.org/'
              target='_blank'
              rel='noopener noreferrer'
              className='underline-offset-2 hover:underline'
            >
              The Movie Database
            </a>
            .
          </p>
        </div>
      </aside>

      {/* Right: login form panel */}
      <main className='relative flex w-full flex-1 items-center justify-center px-4 py-10 sm:px-8 lg:bg-background lg:text-foreground'>
        {/* Mobile background: subtle poster wall + heavy overlay */}
        <div className='absolute inset-0 lg:hidden'>
          <PosterWall posters={posters} />
          <div className='absolute inset-0 bg-linear-to-b from-neutral-950/85 via-neutral-950/95 to-neutral-950' />
        </div>

        <div className='relative z-10 w-full max-w-md'>
          {/* Mobile-only brand header */}
          <div className='mb-8 flex flex-col items-center text-center lg:hidden'>
            <span className='mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur'>
              <Film className='h-6 w-6 text-white' />
            </span>
            <h1 className='text-2xl font-semibold tracking-tight text-white'>
              CineSearch
            </h1>
            <p className='mt-1 text-sm text-white/70'>
              Sign in to discover trending movies
            </p>
          </div>

          <div className='rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl sm:p-8 lg:border-border lg:bg-card lg:text-card-foreground lg:shadow-sm lg:backdrop-blur-none'>
            {/* Desktop form heading */}
            <div className='mb-6 hidden lg:block'>
              <h1 className='text-2xl font-semibold tracking-tight'>
                Welcome back
              </h1>
              <p className='mt-1 text-sm text-muted-foreground'>
                Sign in to your account to continue.
              </p>
            </div>

            <LoginForm />
          </div>

          <p className='mt-6 text-center text-xs text-white/60 lg:text-muted-foreground'>
            Protected demo · Use the credentials above to sign in.
          </p>
        </div>
      </main>
    </div>
  );
}
