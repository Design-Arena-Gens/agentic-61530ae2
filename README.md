# Luxury Instagram Automation 🌟

Automated daily luxury lifestyle video posting from Pexels to Instagram.

## Features

- 🎥 Automatically downloads luxury lifestyle videos from Pexels
- 📱 Posts to Instagram with curated captions
- ⏰ Scheduled daily execution via Vercel Cron
- 📊 Dashboard to monitor posts and logs
- 🚀 Manual trigger option for testing

## Setup

### 1. Get API Keys

**Pexels API:**
1. Go to https://www.pexels.com/api/
2. Create a free account
3. Get your API key

**Instagram:**
- You'll need your Instagram username and password
- Note: Instagram's official API has limitations for video posting
- For production, consider using Instagram Graph API (requires Business account)

### 2. Environment Variables

Set these in your Vercel project settings:

```
PEXELS_API_KEY=your_pexels_api_key
INSTAGRAM_USERNAME=your_instagram_username
INSTAGRAM_PASSWORD=your_instagram_password
CRON_SECRET=your_random_secret_string (optional)
```

### 3. Deploy to Vercel

```bash
vercel deploy --prod
```

## API Endpoints

- GET /api/status - Get automation status and logs
- POST /api/trigger - Manually trigger automation
- GET /api/cron - Cron endpoint (called daily at 10:00 AM UTC)

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Vercel Cron Jobs
- Pexels API
