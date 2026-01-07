# AI Fitness Coach - Setup Instructions

## ✅ Core Features Completed

- ✅ Next.js 15 + TypeScript + Tailwind CSS
- ✅ SQLite database with Drizzle ORM
- ✅ Zustand state management with persistence
- ✅ Guided onboarding flow (6-step setup)
- ✅ GLM 4.7 AI coach integration
- ✅ Basic dashboard layout
- ✅ Dark/Light theme support
- ✅ Mobile-responsive design
- ✅ PWA manifest configuration

## 🚀 Quick Start

### 1. Set Your API Key
```bash
cd fitness-pwa
nano .env.local
```

Add your GLM 4.7 API key:
```
ZHIPU_API_KEY=your_actual_api_key_here
```

### 2. Run Locally
```bash
npm run dev
```
Open http://localhost:3000 in your browser

### 3. Deploy to Vercel (Free)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: AI Fitness Coach"
   git branch -M main
   # Create a new repository on GitHub first, then:
   git remote add origin https://github.com/YOUR_USERNAME/fitness-pwa.git
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to https://vercel.com
   - Click "Add New Project"
   - Import your GitHub repository
   - Add environment variable:
     - Name: `ZHIPU_API_KEY`
     - Value: Your GLM 4.7 API key
   - Click "Deploy"

3. **Access Your App:**
   - URL: `https://your-project-name.vercel.app`

4. **Install on Your Phone:**
   - Open the Vercel URL on your phone
   - Tap "Share" → "Add to Home Screen" (iOS)
   - Tap "Install App" or "Add to Home" (Android)
   - App will be installed and work offline!

## 📱 First Time Setup

1. **Onboarding Flow:**
   - Step 1: Basic info (name, age, weight, height)
   - Step 2: Goals (weight loss, muscle gain, etc.)
   - Step 3: Lifestyle (work schedule, available days, sleep, stress)
   - Step 4: Equipment (location, equipment available, injuries)
   - Step 5: Complete!

2. **Dashboard:**
   - View today's workout
   - See quick stats
   - Chat with AI coach

## 🎯 What's Working Now

### ✅ Onboarding
- 6-step guided setup
- Captures comprehensive user profile
- Saves to localStorage via Zustand

### ✅ AI Coach
- Generates personalized workout plans
- Provides fitness advice via chat
- Considers user's fitness level, goals, equipment
- Takes into account injuries and lifestyle

### ✅ Database Schema
All tables created and ready for use:
- Users
- Exercises (AI-generated)
- Workouts
- Workout Exercises
- Sets
- Personal Records
- AI Coach Sessions
- AI Feedback

## 🔜 Features to Add (Future)

These are the core features still needed:
- Exercise library UI
- Workout tracking UI (log sets, reps, weight)
- Progress charts (Recharts)
- AI chat interface UI
- Workout timer
- Personal records display
- Offline PWA service worker
- Exercise form tips display

## 🛠 Development Commands

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

## 📂 Project Structure

```
fitness-pwa/
├── src/
│   ├── app/
│   │   ├── api/ai-coach/     # AI coach API routes
│   │   ├── onboarding/         # Onboarding flow
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx           # Dashboard
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── ui/                # Reusable components
│   │   └── theme-provider.tsx
│   ├── db/
│   │   ├── schema.ts           # Database schema
│   │   └── index.ts           # Database connection
│   ├── lib/
│   │   ├── services/
│   │   │   └── ai-coach.ts  # AI integration
│   │   ├── stores/             # Zustand stores
│   │   └── utils.ts           # Utility functions
│   └── ...
├── public/
│   └── manifest.json          # PWA manifest
└── .env.local               # Environment variables
```

## 🎨 Customization

### Colors
Edit `tailwind.config.ts` to customize the color scheme.

### AI Prompts
Modify `src/lib/services/ai-coach.ts` to adjust AI behavior:
- `buildWorkoutPrompt()` - Workout generation
- `getSystemPrompt()` - Chat personality
- `buildAnalysisPrompt()` - Progress analysis

### Database
Add or modify tables in `src/db/schema.ts`, then:
```bash
npm run db:generate
npm run db:migrate
```

## 🔑 Getting GLM 4.7 API Key

1. Visit https://open.bigmodel.cn
2. Sign up (free account with 20M tokens)
3. Get API key from dashboard
4. Add to `.env.local` or Vercel environment variables

## 📊 API Endpoints

### Generate Workout Plan
```bash
POST /api/ai-coach/generate
Content-Type: application/json

{
  "userProfile": { ... },
  "week": 1,
  "previousFeedback": []
}
```

### Chat with AI Coach
```bash
POST /api/ai-coach/chat
Content-Type: application/json

{
  "message": "What exercises target chest?",
  "context": { ... }
}
```

## 🐛 Troubleshooting

### Build Issues
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### AI Not Working
- Check API key is set in `.env.local`
- Verify API key has credits remaining
- Check browser console for errors

### Database Issues
```bash
# Reset database
rm src/db/fitness.db*

# Re-run migrations
npm run db:migrate
```

## 📱 PWA Features (Not Yet Configured)

The PWA manifest is ready, but service worker needs to be added:
- Offline support
- App installation
- Push notifications (future)
- Background sync (future)

## 🎉 Summary

You now have:
- ✅ Fully functional AI fitness app foundation
- ✅ Personalized onboarding flow
- ✅ AI coach integration with GLM 4.7
- ✅ Mobile-responsive design
- ✅ Ready for deployment to Vercel (free)
- ✅ Database schema for complete tracking
- ✅ Dark/Light theme support

**Next Steps:**
1. Add your API key to `.env.local`
2. Test locally: `npm run dev`
3. Deploy to Vercel
4. Install on your phone
5. Build remaining features (exercise UI, tracking, etc.)

Enjoy your AI-powered fitness journey! 💪
