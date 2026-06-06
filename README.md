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

## STEP 2 — UPLOAD TO GITHUB (5 minutes)

Install Git from: https://git-scm.com/downloads

Open a terminal/command prompt inside your yojanafind folder:

```bash
git init
git add .
git commit -m "YojanaFind launch"
```

Go to github.com → click "+" at top right → "New repository"
- Name: yojanafind
- Visibility: Public
- Do NOT add README or .gitignore (you have them already)
- Click "Create repository"

Copy the commands GitHub shows you and run them. They look like:
```bash
git remote add origin https://github.com/YOUR_NAME/yojanafind.git
git branch -M main
git push -u origin main
```

✅ Your code is now on GitHub.

---

## STEP 3 — DEPLOY ON VERCEL (3 minutes, FREE)

1. Go to vercel.com
2. Click "Sign Up" → choose "Continue with GitHub"
3. Click "Add New Project"
4. Find "yojanafind" in the list → click "Import"
5. Framework Preset: leave as "Other"
6. Click "Deploy"
7. Wait 30-60 seconds

✅ Your website is LIVE. Vercel gives you a URL like:
   https://yojanafind.vercel.app

CUSTOM DOMAIN (optional):
- In Vercel dashboard → your project → "Domains"
- Add your own domain (e.g. yojanafind.in)
- Buy .in domain for ₹600/year from GoDaddy or Namecheap

---

## STEP 4 — SET UP SUPABASE DATABASE (10 minutes, FREE)

Why: So your schemes are stored in a real database, not just the local file.

1. Go to supabase.com → sign up free
2. Click "New Project" → name it "yojanafind" → choose Asia (Mumbai) region
3. Wait 2 minutes for project to be created
4. Click "SQL Editor" in left sidebar
5. Paste and run this SQL:

```sql
CREATE TABLE schemes (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  name_hi TEXT,
  ministry TEXT,
  icon TEXT DEFAULT '📋',
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

CREATE TABLE scheme_steps (
  id SERIAL PRIMARY KEY,
  scheme_id INTEGER REFERENCES schemes(id) ON DELETE CASCADE,
  step_order INTEGER,
  title TEXT,
  detail TEXT
);

CREATE TABLE scheme_documents (
  id SERIAL PRIMARY KEY,
  scheme_id INTEGER REFERENCES schemes(id) ON DELETE CASCADE,
  document_name TEXT
);

CREATE TABLE suggestions (
  id SERIAL PRIMARY KEY,
  suggestion TEXT,
  submitted_at TIMESTAMP DEFAULT NOW()
);

-- Allow public read access
ALTER TABLE schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheme_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheme_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read_schemes" ON schemes FOR SELECT TO anon USING (true);
CREATE POLICY "read_steps" ON scheme_steps FOR SELECT TO anon USING (true);
CREATE POLICY "read_docs" ON scheme_documents FOR SELECT TO anon USING (true);
CREATE POLICY "insert_suggestions" ON suggestions FOR INSERT TO anon WITH CHECK (true);
```

6. Go to Supabase → Settings → API
7. Copy "Project URL" and "anon public" key
8. Open supabase-config.js in your folder and replace:
```javascript
const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'eyJ...your-key...';
```
9. Push to GitHub again:
```bash
git add supabase-config.js
git commit -m "Add Supabase credentials"
git push
```
Vercel auto-deploys when you push.

NOTE: The app works WITHOUT Supabase too — it uses schemes-data.js as fallback.

---

## STEP 5 — HOW TO MAKE MONEY (AdSense)

### Option A: Google AdSense (Best for India)

WHAT YOU EARN: ₹50 to ₹500 per 1000 visitors
REALISTIC: If you get 10,000 visitors/month = ₹500 to ₹5,000/month
At 100,000 visitors/month = ₹5,000 to ₹50,000/month

HOW TO APPLY:
1. Your site must be live on Vercel for at least 2-4 weeks
2. Go to google.com/adsense
3. Click "Get Started" → sign in with your Google account
4. Enter your website URL (e.g. yojanafind.vercel.app)
5. Submit for review
6. Wait 7-14 days for approval email

AFTER APPROVAL — ADD ADS TO YOUR SITE:

Google gives you a code like this:
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456" crossorigin="anonymous"></script>
```

1. Open index.html in any text editor (Notepad, VS Code)
2. Paste the script tag inside the <head> section
3. Find these 3 lines (they say "Advertisement"):
```html
<div class="ad-box">Advertisement · 728×90</div>
```
4. Replace EACH one with your actual AdSense ad unit code:
```html
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-YOUR-ID-HERE"
     data-ad-slot="YOUR-AD-SLOT-ID"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
```
5. Save, push to GitHub, Vercel auto-deploys

### Option B: Direct Sponsorship (More money)
Once you have traffic, email government scheme consultants, NGOs, or CSC centers:
"I have 50,000 visitors/month looking for government schemes. ₹5,000/month for a banner ad?"

### Option C: Affiliate/Referral
- Suvidha Centers / Jan Seva Kendras pay ₹50-200 per referral for helping people apply

---

## STEP 6 — DEPLOY THE CRAWLER BACKEND (optional, for auto-updating schemes)

The crawler automatically finds new schemes every 7 days.

FREE hosting on Render.com:
1. Create account at render.com
2. Click "New" → "Web Service"
3. Connect your GitHub yojanafind repo
4. Settings:
   - Build Command: npm install
   - Start Command: node crawler.js
5. Add Environment Variables:
   - FIRECRAWL_API_KEY → get from firecrawl.dev (500 free credits/month)
   - ANTHROPIC_API_KEY → get from console.anthropic.com
   - SUPABASE_URL → from your Supabase dashboard
   - SUPABASE_ANON_KEY → from your Supabase dashboard
   - ADMIN_SECRET → type any random password
6. Deploy
7. In Render → "Cron Jobs" → Add: `0 2 */7 * *`

COST: Free on Render free tier
NOTE: Crawler runs automatically. You don't need to do anything.

---

## WHAT WORKS RIGHT NOW (without any setup)

✅ landing.html — opens in browser immediately
✅ index.html — filtering works with 18 built-in schemes
✅ English ↔ Hindi toggle — works
✅ Modal with application guide — works
✅ Mobile responsive — works
✅ No internet needed (offline fallback) — works

## WHAT NEEDS SETUP

⚙️ Supabase — needs 10 min setup for live database
⚙️ AdSense — needs 7-14 days for Google approval
⚙️ Crawler backend — needs Render.com account + API keys

---

## COMMON QUESTIONS

Q: Do I need to know coding?
A: No. Just copy-paste files to GitHub and deploy on Vercel. No coding needed.

Q: Is this really free?
A: Yes. Vercel free tier = ₹0. Supabase free tier = ₹0. GitHub = ₹0.

Q: How long to go live?
A: 30 minutes from now if you follow the steps above.

Q: How many schemes are there right now?
A: 18 schemes pre-loaded in schemes-data.js. Add more manually in Supabase Table Editor or let the crawler find them automatically.

Q: Can I add more schemes manually?
A: Yes. Supabase → Table Editor → schemes → Insert Row.

---

## SUPPORT
If something breaks, the most common fixes:
1. White screen = check browser console (F12) for errors
2. Schemes not showing = check supabase-config.js credentials
3. Vercel deploy failed = check vercel.com → your project → "Deployments" for error logs
