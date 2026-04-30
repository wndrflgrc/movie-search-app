'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MovieCard } from '@/components/movie-card';
import { MovieDialog } from '@/components/movie-dialog';
import { ThemeToggle } from '@/components/theme-toggle';
import { Search, Film, LogOut } from 'lucide-react';
import { type Movie } from '@/lib/tmdb';
import { motion } from 'motion/react';

export default function SearchPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('authenticated');
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Load trending movies on mount
    loadTrendingMovies();
  }, [router]);

  const loadTrendingMovies = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/movies');
      const data = await response.json();
      setMovies(data.results || []);
    } catch (error) {
      console.error('Error loading trending movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      loadTrendingMovies();
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/movies?query=${encodeURIComponent(searchQuery)}`,
      );
      const data = await response.json();
      setMovies(data.results || []);
    } catch (error) {
      console.error('Error searching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authenticated');
    router.push('/login');
  };

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
    setDialogOpen(true);
  };

  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center justify-between gap-4'>
            <div className='flex items-center gap-2'>
              <Film className='h-6 w-6 text-primary' />
              <h1 className='text-xl font-bold'>Movie Search</h1>
            </div>
            <div className='flex items-center gap-2'>
              <ThemeToggle />
              <Button variant='ghost' size='icon' onClick={handleLogout}>
                <LogOut className='h-5 w-5' />
                <span className='sr-only'>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='container mx-auto px-4 py-8'>
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='mb-8'
        >
          <form
            onSubmit={handleSearch}
            className='flex gap-2 max-w-2xl mx-auto'
          >
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input
                type='text'
                placeholder='Search for movies...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pl-10'
              />
            </div>
            <Button type='submit' disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </form>
          {!searchQuery && (
            <p className='text-center text-muted-foreground text-sm mt-2'>
              Showing trending movies
            </p>
          )}
        </motion.div>

        {/* Movies Grid */}
        {loading ? (
          <div className='text-center py-12'>
            <p className='text-muted-foreground'>Loading movies...</p>
          </div>
        ) : movies.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'
          >
            {movies.map((movie, index) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <MovieCard
                  movie={movie}
                  onClick={() => handleMovieClick(movie)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className='text-center py-12'>
            <p className='text-muted-foreground'>
              No movies found. Try a different search.
            </p>
          </div>
        )}
      </main>

      {/* Movie Details Dialog */}
      <MovieDialog
        movie={selectedMovie}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
