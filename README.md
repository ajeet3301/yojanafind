# 🇮🇳 YojanaFind — India's AI Government Scheme Finder

> **Find every Indian government scheme you qualify for — instantly, free, no login required.**

![YojanaFind Banner](https://via.placeholder.com/1200x400/0D1B2A/FF6B00?text=YojanaFind+%E2%80%94+India%27s+Free+Scheme+Finder)

**Live Demo:** [https://yojanafind.vercel.app](https://yojanafind.vercel.app) *(replace after deployment)*

---

## 📋 What is YojanaFind?

YojanaFind helps every Indian discover the government schemes they are eligible for — from students to farmers, women to senior citizens. Enter your profile once, and instantly see all central + state schemes with:

- ✅ Step-by-step application guides
- ✅ Required documents list
- ✅ Official government website links
- ✅ English + Hindi language support
- ✅ AI Tracker that auto-discovers new schemes every 7 days

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔍 Smart Filter | Filter by age, income, category, state, employment, life situation |
| 🎯 18+ Schemes | Complete data: PMKISAN, Ayushman, MUDRA, Vishwakarma, PMKVY... |
| 📋 Modal Guide | Step-by-step apply process + documents for each scheme |
| 🌐 Bilingual | Full English + Hindi (Noto Sans Devanagari) support |
| 🤖 AI Tracker | Auto-crawls govt portals every 7 days via Firecrawl + Claude AI |
| 💬 AI Chat | Claude-powered chatbot answers scheme queries |
| 📱 Mobile-First | Works on ₹5,000 Android phones with poor connectivity |
| 🔌 Offline Mode | Fallback to local data when internet is unavailable |
| 📊 Analytics | Discovery trends, category charts, crawl logs |
| 📧 Notifications | Email alerts when new schemes are discovered |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Pure HTML + CSS + Vanilla JS (landing.html, index.html, tracker.html) |
| 3D/Animation | Three.js (globe) + GSAP + ScrollTrigger |
| Charts | Chart.js v4 |
| Database | Supabase (PostgreSQL, free tier) |
| AI | Claude API (Anthropic) for scheme Q&A |
| Web Scraping | Firecrawl API (for AI Tracker) |
| Fonts | Baloo 2 + Noto Sans Devanagari + DM Sans (Google Fonts) |
| Hosting | Vercel (free) |
| Version Control | GitHub |

**Total cost: ₹0/month** on free tiers.

---

## 📁 File Structure

```
yojanafind/
├── landing.html        ← Cinematic 3D landing page (Three.js globe)
├── index.html          ← Main scheme finder app
├── tracker.html        ← AI Tracker dashboard
├── style.css           ← All styles for index.html
├── app.js              ← Filter logic, rendering, modal, bilingual
├── schemes-data.js     ← 18 schemes — offline fallback data
├── supabase-config.js  ← Supabase client setup
├── vercel.json         ← Vercel deployment config
├── .gitignore          ← Git ignore rules
└── README.md           ← This file
```

---

## 🚀 Quick Start (Local)

No build step required. Just open in browser:

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/yojanafind.git
cd yojanafind

# Open in browser (any of these)
open landing.html        # macOS
start landing.html       # Windows
xdg-open landing.html    # Linux

# Or use VS Code Live Server (recommended)
code .
# Right-click landing.html → "Open with Live Server"
```

The app works completely offline using the bundled `schemes-data.js` fallback.

---

## 🗄️ Supabase Setup (Optional — for live database)

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com) → Sign up free
2. Click **New Project** → Name it `yojanafind`
3. Choose a region close to India (Mumbai)

### Step 2: Run Schema SQL
Go to **SQL Editor** in Supabase and run:

```sql
-- Create schemes table
CREATE TABLE schemes (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  name_hi TEXT,
  ministry TEXT,
  icon TEXT,
  icon_bg TEXT DEFAULT 'blue',
  description TEXT,
  description_hi TEXT,
  benefit TEXT,
  benefit_hi TEXT,
  category TEXT,
  min_age INTEGER DEFAULT 0,
  max_age INTEGER DEFAULT 120,
  max_income INTEGER DEFAULT 5,
  categories TEXT[] DEFAULT '{"general","obc","sc","st","ews"}',
  genders TEXT[] DEFAULT '{"male","female","other"}',
  situations TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  apply_url TEXT,
  official_url TEXT,
  badge TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Steps table
CREATE TABLE scheme_steps (
  id SERIAL PRIMARY KEY,
  scheme_id INTEGER REFERENCES schemes(id) ON DELETE CASCADE,
  step_order INTEGER,
  title TEXT,
  detail TEXT
);

-- Documents table
CREATE TABLE scheme_documents (
  id SERIAL PRIMARY KEY,
  scheme_id INTEGER REFERENCES schemes(id) ON DELETE CASCADE,
  document_name TEXT
);

-- Suggestions table
CREATE TABLE suggestions (
  id SERIAL PRIMARY KEY,
  suggestion TEXT,
  submitted_at TIMESTAMP DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheme_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheme_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read schemes" ON schemes FOR SELECT TO anon USING (true);
CREATE POLICY "Public read steps" ON scheme_steps FOR SELECT TO anon USING (true);
CREATE POLICY "Public read docs" ON scheme_documents FOR SELECT TO anon USING (true);
CREATE POLICY "Public insert suggestions" ON suggestions FOR INSERT TO anon WITH CHECK (true);
```

### Step 3: Add Your Credentials
Edit `supabase-config.js`:
```javascript
const SUPABASE_URL = 'https://YOUR-PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'eyJ...your-anon-key...';
```

Get these from: **Supabase Dashboard → Settings → API**

### Step 4: Populate Data
The schemes data in `schemes-data.js` is your seed data. You can manually insert it via Supabase Table Editor or use the SQL insert statements (ask Claude to generate them from `schemes-data.js`).

---

## ☁️ Vercel Deployment

### Step 1: Push to GitHub
```bash
# Initialize git
git init
git add .
git commit -m "Initial commit: YojanaFind - Indian Government Scheme Finder"

# Create repo at github.com/new (name: yojanafind, public, no README)
git remote add origin https://github.com/YOUR_USERNAME/yojanafind.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. Click **New Project** → Import `yojanafind` repo
3. Framework Preset: **Other** (static site)
4. Root Directory: `./` (leave as default)
5. Click **Deploy** — live in ~60 seconds! 🎉

### Step 3: Add Environment Variables (Optional)
In Vercel Dashboard → Your Project → Settings → Environment Variables:
```
SUPABASE_URL = https://your-project.supabase.co
SUPABASE_ANON_KEY = your-anon-key-here
```

*(Note: For a static site, these are in `supabase-config.js` directly. Env vars are useful for a Node.js backend.)*

---

## 📢 Google AdSense Setup

1. Apply at [google.com/adsense](https://google.com/adsense) using your Vercel domain
2. Wait 1–14 days for approval
3. Once approved, replace ad placeholders in `index.html`:

```html
<!-- Find this (3 locations): -->
<div class="ad-placeholder">📢 Advertisement · 728×90</div>

<!-- Replace with your AdSense code: -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
     data-ad-slot="XXXXXXXXXX"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
```

4. Add AdSense script in `<head>` of `index.html`:
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
```

---

## 🤖 AI Tracker Setup (Firecrawl + Claude)

The AI Tracker (`tracker.html`) simulates the crawling system. For a real backend:

### Install dependencies
```bash
npm install @mendable/firecrawl-js @anthropic-ai/sdk @supabase/supabase-js node-cron
```

### Environment variables
```bash
FIRECRAWL_API_KEY=fc-your-key    # From firecrawl.dev (free tier available)
ANTHROPIC_API_KEY=sk-ant-...     # From console.anthropic.com
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=eyJ...
```

### Run the crawler
```bash
node crawler.js    # One-time run
# Or set up cron: 0 2 */7 * * (every 7 days at 2 AM)
```

### Deploy backend on Render.com (free)
1. Push crawler code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect repo → Build: `npm install` → Start: `node crawler.js`
4. Add Cron Job: `0 2 */7 * *`

---

## ➕ Adding More Schemes

### Option 1: Add to `schemes-data.js`
Copy the schema of an existing scheme and add your new one to the `LOCAL_SCHEMES` array.

### Option 2: Add via Supabase Table Editor
1. Go to Supabase Dashboard → Table Editor → `schemes`
2. Click **Insert Row**
3. Fill in all fields
4. Add corresponding rows in `scheme_steps` and `scheme_documents`

### Option 3: Let AI Tracker discover it automatically
The Firecrawl + Claude system will automatically find new schemes from official portals.

---

## 🤝 Contributing

1. Fork this repo
2. Create feature branch: `git checkout -b feature/add-bihar-schemes`
3. Commit changes: `git commit -m 'Add Bihar state specific schemes'`
4. Push: `git push origin feature/add-bihar-schemes`
5. Open a Pull Request

### What we need:
- 🗺️ State-specific scheme data (UP, Bihar, Maharashtra, etc.)
- 🌐 Hindi translations for all scheme descriptions
- 📱 Better mobile UX improvements
- 🐛 Bug fixes and performance improvements

---

## 📄 License

MIT License — free for personal and commercial use.

```
MIT License
Copyright (c) 2026 YojanaFind
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 🙏 Data Sources

- [india.gov.in](https://india.gov.in) — Official Government of India portal
- [myscheme.gov.in](https://myscheme.gov.in) — Official scheme discovery portal
- [pib.gov.in](https://pib.gov.in) — Press Information Bureau
- [socialjustice.gov.in](https://socialjustice.gov.in) — Social Justice Ministry
- [nsap.nic.in](https://nsap.gov.in) — National Social Assistance Programme

> ⚠️ **Disclaimer:** YojanaFind is an independent information platform. Always verify scheme details on official government websites before applying. Scheme eligibility and benefits may change.

---

*Built with ❤️ for every Indian by YojanaFind. Jai Hind! 🇮🇳*
