# How to Upload to GitHub & Deploy — Step by Step
# Answer: Do NOT delete your old repo. Add these files on top.

================================================================================
QUESTION: Should I delete my old GitHub repo and upload fresh, or add these files?
ANSWER:   ADD these files on top of your existing project. Do NOT delete.
================================================================================

Your existing project already has:
  ✅ app/  (with your old page.tsx, schemes.ts, etc.)
  ✅ components/
  ✅ package.json
  ✅ tailwind.config.ts
  ✅ tsconfig.json

These new files REPLACE or ADD TO your existing ones. Here's exactly what to do:


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — Clone your existing repo locally
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
  cd YOUR_REPO_NAME


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2 — Copy these new files into your project
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Copy every file from the YojanaFind-Complete folder into your repo root.
When asked "replace?" — say YES for these files:

  FILES TO REPLACE (overwrite your old version):
  ┌─────────────────────────────────────────────────────────────┐
  │ app/page.tsx          ← NEW landing page (3D + theme)      │
  │ app/layout.tsx        ← Updated with fonts + ThemeProvider │
  │ app/globals.css       ← New CSS variables + animations     │
  │ package.json          ← New dependencies added             │
  │ tailwind.config.ts    ← Extended theme colors/animations   │
  │ tsconfig.json         ← Updated paths                      │
  │ next.config.ts        ← Three.js optimizations             │
  └─────────────────────────────────────────────────────────────┘

  FILES TO ADD (these are brand new, won't conflict):
  ┌─────────────────────────────────────────────────────────────┐
  │ app/chat/page.tsx               ← Chat UI page             │
  │ app/api/chat/route.ts           ← Grok chatbot API         │
  │ app/api/ocr/route.ts            ← Gemini OCR API           │
  │ app/api/rag/route.ts            ← RAG query API            │
  │ app/api/schemes/route.ts        ← Schemes REST API         │
  │ app/api/whatsapp/webhook/route.ts ← WhatsApp webhook       │
  │ components/3d/Scene.tsx         ← Three.js 3D scene        │
  │ components/chat/ChatInterface.tsx                           │
  │ components/chat/MessageBubble.tsx                           │
  │ components/chat/MCQButtons.tsx                              │
  │ components/chat/FileUpload.tsx                              │
  │ components/chat/SchemeCard.tsx                              │
  │ components/ui/Navbar.tsx                                    │
  │ components/ui/ThemeProvider.tsx                             │
  │ hooks/index.ts                                              │
  │ store/themeStore.ts                                         │
  │ store/chatStore.ts                                          │
  │ lib/gemini.ts                   ← Gemini client            │
  │ lib/rag.ts                      ← RAG pipeline             │
  │ lib/schemes.ts                  ← Scheme database          │
  │ lib/whatsapp.ts                 ← WhatsApp helpers         │
  │ middleware.ts                   ← CORS + security          │
  │ postcss.config.js               ← Required for Tailwind    │
  │ scripts/ingest-schemes.ts       ← PDF ingestion script     │
  │ supabase/schema.sql             ← Database schema          │
  │ .env.example                    ← Environment template     │
  │ .gitignore                      ← Git ignore rules         │
  └─────────────────────────────────────────────────────────────┘

  YOUR OLD FILE (keep as-is, don't delete):
  ┌─────────────────────────────────────────────────────────────┐
  │ app/schemes.ts or lib/schemes-old.ts                       │
  │   → The new lib/schemes.ts replaces this with better code  │
  │   → You can delete your old one after confirming it works  │
  └─────────────────────────────────────────────────────────────┘


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3 — Install new dependencies
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  npm install

  Key new packages being installed:
  • three + @react-three/fiber + @react-three/drei  → 3D scene
  • @react-three/postprocessing                     → Bloom/DoF effects
  • gsap + framer-motion                            → Animations
  • @google/generative-ai                           → Gemini OCR
  • openai                                          → Grok (xAI) API
  • @supabase/supabase-js                           → Database + RAG
  • zustand                                         → Theme + chat state
  • react-dropzone                                  → File upload UI
  • lucide-react                                    → Icons


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 4 — Set up environment variables
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  cp .env.example .env.local

  Then fill in .env.local:
    XAI_API_KEY=xai-...             (from console.x.ai)
    GEMINI_API_KEY=AIzaSy...        (from ai.google.dev)
    NEXT_PUBLIC_SUPABASE_URL=...    (from supabase.com)
    SUPABASE_SERVICE_KEY=...        (from supabase.com)
    NEXT_PUBLIC_APP_URL=http://localhost:3000


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 5 — Test locally
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  npm run dev

  Open: http://localhost:3000         ← Landing page (3D + theme toggle)
  Open: http://localhost:3000/chat    ← AI Chat interface


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 6 — Push to GitHub
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  git add .
  git commit -m "feat: Add AI chat, OCR, RAG, WhatsApp bot, 3D landing page"
  git push origin main


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 7 — Deploy to Vercel
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  If already connected to Vercel: push to GitHub = auto-deploy ✅

  If not yet on Vercel:
    1. Go to vercel.com → New Project → Import your GitHub repo
    2. Add environment variables (same as .env.local) in Vercel dashboard
    3. Click Deploy


================================================================================
FILE COUNT SUMMARY
================================================================================

  Total files generated: 32
  Files that replace old ones: 7
  New files added: 25

  Your project URL structure after upgrade:
    /              → 3D landing page with theme toggle
    /chat          → AI conversational chatbot
    /api/chat      → Grok API (POST)
    /api/ocr       → Gemini OCR (POST, multipart)
    /api/rag       → RAG query (POST)
    /api/schemes   → Scheme search (GET + POST)
    /api/whatsapp/webhook → WhatsApp (GET verify + POST messages)


================================================================================
WHAT IS app/page.tsx? (your question about landing page)
================================================================================

In Next.js App Router:
  • app/page.tsx    = the HOME page = what you see at yoursite.com/
  • app/chat/page.tsx = the CHAT page = yoursite.com/chat

So app/page.tsx IS your landing page / index page.
It is the equivalent of index.html in a plain HTML project.

The old landing.html and index.html from your HTML project are
now replaced by:
  → app/page.tsx        (landing.html equivalent)
  → app/chat/page.tsx   (index.html / app equivalent)

================================================================================
