# Movie Search App

A modern movie search application built with Next.js 16, Tailwind CSS v4, and shadcn/ui, powered by The Movie Database (TMDB) API.

## Features

- 🎬 Search and discover movies using TMDB API
- 🌓 Light and dark mode support
- 🔐 Simple authentication with hardcoded credentials
- 🎨 Beautiful UI with shadcn/ui components
- ✨ Smooth animations with motion.dev
- 📱 Fully responsive design

## Demo Credentials

## Prerequisites

Before you begin, you need to obtain a TMDB API key:

1. Go to [The Movie Database (TMDB)](https://www.themoviedb.org/)
2. Create an account if you don't have one
3. Navigate to Settings > API
4. Request an API key (choose "Developer" option)
5. Copy your API key

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**

   Update the `.env.local` file with your TMDB API key:

   ```env
   NEXT_PUBLIC_TMDB_API_KEY=your_actual_api_key_here
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser:**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Build for Production

To create a production build:

```bash
npm run build
npm start
```

## Technology Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui
- **Animations:** motion.dev
- **Icons:** Lucide React
- **Language:** TypeScript
- **API:** TMDB (The Movie Database)

## Project Structure

```
movie-search-app/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── login/
│   │   └── movies/
│   ├── login/
│   ├── search/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   ├── movie-card.tsx
│   ├── movie-dialog.tsx
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
├── lib/
│   ├── auth.ts
│   ├── tmdb.ts
│   └── utils.ts
└── .env.local
```

## Features in Detail

### Authentication

- Simple hardcoded authentication for demo purposes
- Session management using localStorage

### Movie Search

- Search movies by title
- View trending movies when no search query
- Detailed movie information in modal dialog
- Movie ratings, release dates, and descriptions

### Theme Support

- Light and dark mode toggle
- Persistent theme selection
- Smooth theme transitions

### Responsive Design

- Mobile-first approach
- Optimized for all screen sizes
- Grid layout adapts to different viewports

## API Rate Limits

The TMDB API has rate limits. For the free tier:

- 40 requests every 10 seconds
- This app is designed to work within these limits

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Movie data provided by [The Movie Database (TMDB)](https://www.themoviedb.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
