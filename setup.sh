#!/bin/bash

# Movie Search App Setup Script

echo "🎬 Movie Search App Setup"
echo "========================="
echo ""

# Check if .env.local exists and has API key
if [ ! -f .env.local ]; then
    echo "❌ .env.local file not found!"
    echo "Please create one based on the template."
    exit 1
fi

# Check if API key is set
if grep -q "your_tmdb_api_key_here" .env.local; then
    echo "⚠️  Warning: You need to update your TMDB API key in .env.local"
    echo ""
    echo "To get your API key:"
    echo "1. Go to https://www.themoviedb.org/"
    echo "2. Create an account"
    echo "3. Navigate to Settings > API"
    echo "4. Request an API key"
    echo "5. Update NEXT_PUBLIC_TMDB_API_KEY in .env.local"
    echo ""
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the development server, run:"
echo "  npm run dev"
echo ""
echo "Demo credentials:"
echo "  Username: user001"
echo "  Password: DWpass123456"
echo ""
