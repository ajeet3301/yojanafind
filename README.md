# YojanaFind 
Find Government Schemes in Seconds

YojanaFind helps Indian citizens discover government schemes they are eligible for based on age, income, category, gender, and personal circumstances. The platform supports both English and Hindi and provides application guidance, required documents, and eligibility information.

Made for Indian Citizens 🇮🇳
Helping people discover and access government benefits more easily.

🚀 Features
🔍 Smart Scheme Finder
Filter schemes by:
Age
Income
Category (General, OBC, SC, ST, EWS)
Gender
Special situations
🌐 Bilingual Support
English interface
Hindi interface
Instant language switching
📋 Detailed Scheme Information
Benefits
Eligibility criteria
Required documents
Application steps
Official government links
📱 Mobile Friendly
Responsive design
Works on phones, tablets, and desktops
💾 Offline Fallback
Preloaded schemes available without database setup
Works even if Supabase is not configured
🤖 AI Scheme Tracker
Monitor scheme updates
Track newly added government schemes
Intelligent categorization

## Everything step by step. No confusion.

---

## STEP 1 — PUT ALL FILES IN ONE FOLDER

Your folder should look like this:
```
yojanafind/
├── landing.html       ← Your homepage
├── index.html         ← The scheme finder app  
├── tracker.html       ← AI tracker dashboard
├── app.js
├── schemes-data.js
├── supabase-config.js
├── crawler.js         ← Backend (deploy separately)
├── package.json
├── vercel.json
├── .gitignore
└── .env.example
```

---

.

🌍 Deploy on Vercel

Push code to GitHub.

git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/yojanafind.git
git push -u origin main
Step 2

Deploy:

Sign in to Vercel
Import GitHub repository
Select Other Framework
Click Deploy

Your site will be available at:

https://your-project.vercel.app
🗄️ Supabase Setup

Create a free project in Supabase.

Update:

const SUPABASE_URL = "https://YOUR_PROJECT.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_PUBLIC_KEY";

inside:

supabase-config.js

Then redeploy.

Providers
🔄 Auto Scheme Updates

Optional crawler support:

node crawler.js

Crawler can be deployed on:

Render
Railway
VPS
Cloud Run

Recommended schedule:

0 2 */7 * *

Runs every 7 days.

📱 Supported Platforms
Chrome
Firefox
Edge
Safari
Android
iPhone
Tablets
🔐 Environment Variables
SUPABASE_URL=
SUPABASE_ANON_KEY=
FIRECRAWL_API_KEY=
ANTHROPIC_API_KEY=
ADMIN_SECRET=
🛠️ Tech Stack
Frontend
HTML5
CSS3
JavaScript
Backend
Node.js
Database
Supabase
Hosting
Vercel
Automation
Firecrawl
Anthropic API


Made for Indian Citizens 🇮🇳

Helping people discover and access government benefits more easily.
