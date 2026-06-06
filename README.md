# 🇮🇳 YojanaFind — Government Scheme Finder for India

> Find every government scheme you're eligible for — in seconds. Hindi + English. Mobile-friendly. Free to use.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://yojanafind.vercel.app)
[![Deploy on Vercel](https://img.shields.io/badge/Deploy-Vercel-black)](https://vercel.com)


---

## What is YojanaFind?

YojanaFind helps Indian citizens discover government schemes (yojanas) they qualify for — based on their age, income, caste category, gender, and situation. No more searching dozens of websites or visiting government offices just to know what schemes exist.

**Key Features:**
- Filter schemes by age, income, category (General/OBC/SC/ST/EWS), gender, and life situation
- Full Hindi ↔ English toggle
- Step-by-step application guide for each scheme
- AI-powered tracker dashboard
- Works offline with 18 pre-loaded schemes
- Mobile responsive

---

## Project Structure

```
yojanafind/
├── landing.html        # Homepage / marketing page
├── index.html          # Main scheme finder app
├── tracker.html        # AI tracker dashboard
├── app.js              # Frontend logic
├── schemes-data.js     # 18 pre-loaded schemes (offline fallback)
├── supabase-config.js  # Database credentials (edit this)
├── crawler.js          # Auto-update backend (deploy separately)
├── package.json
├── vercel.json
├── .gitignore
└── .env.example
```

---

## Quick Start (30 minutes to live)

### 1. Upload to GitHub

```bash
git init
git add .
git commit -m "YojanaFind launch"
```

Go to [github.com](https://github.com) → New repository → name it `yojanafind` → Create.

```bash
git remote add origin https://github.com/YOUR_NAME/yojanafind.git
git branch -M main
git push -u origin main
```

### 2. Deploy on Vercel (Free)

1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. Click **Add New Project** → Import `yojanafind`
3. Framework Preset: **Other**
4. Click **Deploy**

Your site will be live at `https://yojanafind.vercel.app` within 60 seconds.

> **Custom domain:** Add your own `.in` domain from GoDaddy or Namecheap (~₹600/year) via Vercel Dashboard → Domains.

### 3. Set Up Supabase Database (Optional but recommended)

1. Go to [supabase.com](https://supabase.com) → New Project → choose **Asia (Mumbai)** region
2. Open **SQL Editor** and run the schema from `SETUP_GUIDE.md`
3. Go to **Settings → API** and copy your Project URL and anon key
4. Edit `supabase-config.js`:

```javascript
const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

5. Push to GitHub — Vercel auto-deploys.

> **Note:** The app works without Supabase. It falls back to the 18 schemes in `schemes-data.js`.

---

## Adding More Schemes

**Manually:** Supabase → Table Editor → `schemes` → Insert Row

**Automatically:** Deploy the crawler backend (see below) and it finds new schemes every 7 days.

---

## Crawler Backend (Auto-updating Schemes)

Deploy on [Render.com](https://render.com) (free tier):

1. New → Web Service → connect your GitHub repo
2. Build Command: `npm install`
3. Start Command: `node crawler.js`
4. Add environment variables:

| Variable | Where to Get |
|---|---|
| `FIRECRAWL_API_KEY` | [firecrawl.dev](https://firecrawl.dev) (500 free credits/month) |
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) |
| `SUPABASE_URL` | Supabase → Settings → API |
| `SUPABASE_ANON_KEY` | Supabase → Settings → API |
| `ADMIN_SECRET` | Any random password you choose |

5. In Render → Cron Jobs → Add: `0 2 */7 * *`

The crawler runs automatically every 7 days. No action needed after setup.

---

## Monetization

### Google AdSense (Recommended for India)
- Earnings: ₹50–₹500 per 1,000 visitors
- Apply at [google.com/adsense](https://google.com/adsense) after your site has been live 2–4 weeks
- Approval takes 7–14 days
- After approval, replace the `ad-box` placeholders in `index.html` with your AdSense `<ins>` tags

**Realistic estimates:**
| Monthly Visitors | Estimated Earnings |
|---|---|
| 10,000 | ₹500 – ₹5,000 |
| 1,00,000 | ₹5,000 – ₹50,000 |

### Direct Sponsorships
Once you have traffic, reach out to government scheme consultants, NGOs, and CSC/Jan Seva Kendras with a sponsorship offer.

### Referral Commissions
Suvidha Centers and Jan Seva Kendras pay ₹50–₹200 per referred applicant.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, Vanilla JS |
| Hosting | Vercel (free) |
| Database | Supabase (PostgreSQL, free tier) |
| Crawler | Node.js + Firecrawl + Claude AI |
| Backend hosting | Render.com (free tier) |

---

## Troubleshooting

**White screen on load**
→ Press F12 → Console tab → check for errors → likely a missing file or syntax issue.

**Schemes not showing**
→ Check `supabase-config.js` — make sure your URL and key are correct and saved.

**Vercel deploy failed**
→ Go to vercel.com → your project → Deployments → click the failed deploy to see the error log.

---

## Contributing

Pull requests are welcome. To add schemes to the default dataset, edit `schemes-data.js` and submit a PR.

---


*Built to make India's government schemes accessible to every citizen.*
