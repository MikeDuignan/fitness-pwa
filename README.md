# AI Fitness Coach

A personal fitness PWA powered by GLM 4.7 AI coach. Features personalized workout plans, progress tracking, and AI-powered coaching.

## Features

- 🤖 **AI-Powered Coach**: Personalized workout plans using GLM 4.7
- 📱 **Mobile-First PWA**: Installable on your phone, works offline
- 🏋️ **Workout Tracking**: Log weights, cardio, cycling sessions
- 📊 **Progress Charts**: Visualize your progress and personal records
- 🎯 **Guided Onboarding**: Personalized setup flow
- 🌙 **Dark Mode**: Toggle between light and dark themes

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your GLM 4.7 API key:
   ```
   ZHIPU_API_KEY=your_api_key_here
   ```

3. **Initialize database:**
   ```bash
   npx drizzle-kit generate
   npx drizzle-kit migrate
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:3000`

## Deployment (Vercel - Free & Recommended)

**Why Vercel instead of GitHub Pages?**
- GitHub Pages is static-only (no API routes)
- Our app needs API routes for the AI coach
- Vercel is free and fully supports Next.js
- Automatic deployments from GitHub
- Better for Next.js applications

### Option 1: Deploy to Vercel (Recommended)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/fitness-pwa.git
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Add environment variable: `ZHIPU_API_KEY` (your GLM 4.7 API key)
   - Click "Deploy"

3. **Your app will be available at:**
   `https://your-project-name.vercel.app`

4. **Install on your phone:**
   - Open the URL on your phone
   - Tap "Share" → "Add to Home Screen"
   - App will be installed and work offline!

### Option 2: Local Use Only

If you prefer not to deploy online, you can use the app entirely locally:

```bash
# Run locally
npm run dev

# Or build and serve statically
npm run build
npm run start
```

Then access at `http://localhost:3000` on your phone (if on same WiFi) or use a local network URL.

## Getting a GLM 4.7 API Key

1. Visit [Zhipu AI Platform](https://open.bigmodel.cn)
2. Sign up for free account (20M free tokens)
3. Get your API key from dashboard
4. Add it to `.env.local`

## Tech Stack

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **UI Components**: shadcn/ui (radix-ui based)
- **Database**: SQLite + Drizzle ORM
- **State Management**: Zustand with persistence
- **AI**: GLM 4.7 (Zhipu AI) via Vercel AI SDK
- **PWA**: Vite PWA plugin for offline support

## Database Schema

The app uses SQLite with the following tables:
- `users` - User profiles and preferences
- `exercises` - Exercise library (AI-generated and custom)
- `workouts` - Workout sessions
- `workout_exercises` - Exercises in each workout
- `sets` - Individual sets with weights, reps, times
- `personal_records` - Personal best achievements
- `ai_coach_sessions` - AI conversation history
- `ai_feedback` - User feedback on AI recommendations

## Usage

1. **Onboarding**: Complete guided setup to personalize your experience
2. **Dashboard**: View today's workout and quick stats
3. **AI Coach**: Chat with AI for personalized advice
4. **Workouts**: Log and track your workouts
5. **Progress**: View charts and personal records

## Development

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database operations
npm run db:generate  # Generate migrations
npm run db:migrate    # Run migrations
npm run db:studio     # Open database viewer

# Lint
npm run lint
```

## Privacy

- All data stored locally on your device (SQLite database)
- No account registration required
- AI calls only send anonymous workout data for recommendations
- You are in full control of your data

## License

MIT

## Support

For issues or feature requests, please open an issue on GitHub.
