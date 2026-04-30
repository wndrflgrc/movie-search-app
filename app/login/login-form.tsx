'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Eye, EyeOff, Loader2, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('authenticated', 'true');
        router.push('/search');
      } else {
        setError('Invalid username or password.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      onSubmit={handleSubmit}
      className='space-y-5'
    >
      <div className='space-y-2'>
        <Label htmlFor='username' className='text-sm font-medium'>
          Username
        </Label>
        <Input
          id='username'
          type='text'
          autoComplete='username'
          placeholder='Enter your username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={loading}
          className='h-11'
        />
      </div>

      <div className='space-y-2'>
        <div className='flex items-center justify-between'>
          <Label htmlFor='password' className='text-sm font-medium'>
            Password
          </Label>
        </div>
        <div className='relative'>
          <Input
            id='password'
            type={showPassword ? 'text' : 'password'}
            autoComplete='current-password'
            placeholder='Enter your password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className='h-11 pr-10'
          />
          <button
            type='button'
            onClick={() => setShowPassword((v) => !v)}
            className='absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground transition-colors'
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className='h-4 w-4' />
            ) : (
              <Eye className='h-4 w-4' />
            )}
          </button>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className='rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive'
          role='alert'
        >
          {error}
        </motion.div>
      )}

      <Button
        type='submit'
        className='h-11 w-full text-sm font-medium'
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            Signing in...
          </>
        ) : (
          <>
            <LogIn className='mr-2 h-4 w-4' />
            Sign in
          </>
        )}
      </Button>

      <div className='rounded-lg border border-dashed border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground'>
        <p className='mb-1 font-medium text-foreground'>Demo credentials</p>
        <div className='flex items-center justify-between gap-2 font-mono'>
          <span>user001</span>
          <span className='text-muted-foreground/60'>/</span>
          <span>DWpass123456</span>
        </div>
      </div>
    </motion.form>
  );
}
