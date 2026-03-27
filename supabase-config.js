// ============================================================
// YojanaFind — supabase-config.js
// Supabase client configuration
// Replace the values below with your actual Supabase project credentials
// Get them from: https://supabase.com → Your Project → Settings → API
// ============================================================

// Accessing variables from .env (Vite syntax)
const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.SUPABASE_ANON_KEY;

// Initialize Supabase client (loaded via CDN in index.html)
let supabase = null;

try {
  if (SUPABASE_URL !== 'YOUR_SUPABASE_URL' && SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY') {
    // Load Supabase from CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    script.onload = () => {
      const { createClient } = window.supabase;
      supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      console.info('Supabase client initialized successfully');
    };
    script.onerror = () => {
      console.warn('Failed to load Supabase SDK. Using local data fallback.');
    };
    document.head.appendChild(script);
  } else {
    console.info('Supabase credentials not set. Using local scheme data (schemes-data.js).');
  }
} catch(e) {
  console.warn('Supabase init error:', e.message);
}

// ============================================================
// SUPABASE SETUP INSTRUCTIONS:
// 
// 1. Go to https://supabase.com and create a free account
// 2. Create a new project (free tier)
// 3. Go to SQL Editor and run the schema below
// 4. Replace YOUR_SUPABASE_URL and YOUR_SUPABASE_ANON_KEY above
// 5. Run the INSERT statements from supabase-schema.sql
//
// DATABASE SCHEMA (run in Supabase SQL Editor):
//
// CREATE TABLE schemes (
//   id SERIAL PRIMARY KEY,
//   name TEXT NOT NULL,
//   name_hi TEXT,
//   ministry TEXT,
//   icon TEXT,
//   icon_bg TEXT DEFAULT 'blue',
//   description TEXT,
//   description_hi TEXT,
//   benefit TEXT,
//   benefit_hi TEXT,
//   category TEXT,
//   min_age INTEGER DEFAULT 0,
//   max_age INTEGER DEFAULT 120,
//   max_income INTEGER DEFAULT 5,
//   categories TEXT[] DEFAULT '{"general","obc","sc","st","ews"}',
//   genders TEXT[] DEFAULT '{"male","female","other"}',
//   situations TEXT[] DEFAULT '{}',
//   tags TEXT[] DEFAULT '{}',
//   apply_url TEXT,
//   official_url TEXT,
//   badge TEXT,
//   is_active BOOLEAN DEFAULT true,
//   created_at TIMESTAMP DEFAULT NOW()
// );
//
// CREATE TABLE scheme_steps (
//   id SERIAL PRIMARY KEY,
//   scheme_id INTEGER REFERENCES schemes(id),
//   step_order INTEGER,
//   title TEXT,
//   detail TEXT
// );
//
// CREATE TABLE scheme_documents (
//   id SERIAL PRIMARY KEY,
//   scheme_id INTEGER REFERENCES schemes(id),
//   document_name TEXT
// );
//
// CREATE TABLE suggestions (
//   id SERIAL PRIMARY KEY,
//   suggestion TEXT,
//   submitted_at TIMESTAMP DEFAULT NOW()
// );
//
// Then enable Row Level Security (RLS) and add anon read policy:
// ALTER TABLE schemes ENABLE ROW LEVEL SECURITY;
// CREATE POLICY "Public read" ON schemes FOR SELECT TO anon USING (true);
// ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;
// CREATE POLICY "Public insert" ON suggestions FOR INSERT TO anon WITH CHECK (true);
// ============================================================
