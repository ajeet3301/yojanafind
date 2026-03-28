// ============================================================
// crawler.js — REAL Firecrawl + Claude AI Backend
// Run: node crawler.js
// Deploy free on: render.com or railway.app
// ============================================================

import FirecrawlApp from '@mendable/firecrawl-js';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import cron from 'node-cron';
import express from 'express';
import cors from 'cors';

// ===== ENV CONFIG =====
const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY; // from firecrawl.dev FREE tier
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY; // from console.anthropic.com
const SUPABASE_URL      = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const PORT              = process.env.PORT || 3001;

// ===== CLIENTS =====
const firecrawl = new FirecrawlApp({ apiKey: FIRECRAWL_API_KEY });
const claude    = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
const supabase  = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ===== GOVERNMENT SOURCES TO CRAWL =====
const GOVT_SOURCES = [
  { name: 'India Gov Portal',    url: 'https://www.india.gov.in/spotlight',              priority: 1 },
  { name: 'PIB News',            url: 'https://pib.gov.in/allRel.aspx',                 priority: 1 },
  { name: 'MyScheme Portal',     url: 'https://www.myscheme.gov.in/schemes',             priority: 1 },
  { name: 'PM Kisan',            url: 'https://pmkisan.gov.in',                          priority: 2 },
  { name: 'Ayushman Bharat',     url: 'https://pmjay.gov.in',                            priority: 2 },
  { name: 'Scholarship Portal',  url: 'https://scholarships.gov.in',                     priority: 2 },
  { name: 'MSME Schemes',        url: 'https://msme.gov.in/schemes',                    priority: 2 },
  { name: 'Women Schemes',       url: 'https://wcd.nic.in/schemes-listing',              priority: 2 },
  { name: 'Skill India',         url: 'https://www.skillindiadigital.gov.in',            priority: 3 },
  { name: 'Social Justice',      url: 'https://socialjustice.gov.in/schemes',            priority: 2 },
  { name: 'Agriculture Dept',    url: 'https://agricoop.nic.in/schemes',                 priority: 2 },
  { name: 'Housing Ministry',    url: 'https://mohua.gov.in/cms/scheme.php',             priority: 3 },
];

// ===== CRAWL LOGS (in-memory, can be saved to DB) =====
const crawlLogs = [];
function log(type, msg) {
  const entry = { time: new Date().toISOString(), type, msg };
  crawlLogs.unshift(entry);
  if (crawlLogs.length > 200) crawlLogs.pop();
  console.log(`[${entry.time}] [${type.toUpperCase()}] ${msg}`);
}

// ===== STEP 1: CRAWL WITH FIRECRAWL =====
async function crawlSource(source) {
  log('info', `Crawling: ${source.name} (${source.url})`);
  try {
    // Using Firecrawl scrape (single page) — faster than full crawl
    const result = await firecrawl.scrapeUrl(source.url, {
      formats: ['markdown'],
      onlyMainContent: true,
      timeout: 30000,
    });
    
    if (!result.success) {
      log('warning', `Failed to scrape ${source.name}: ${result.error}`);
      return null;
    }
    
    log('success', `Scraped ${source.name} — ${result.markdown?.length || 0} chars`);
    return { source: source.name, url: source.url, content: result.markdown };
  } catch (err) {
    log('error', `Crawl error for ${source.name}: ${err.message}`);
    return null;
  }
}

// Alternative: Firecrawl CRAWL (multiple pages, slower but deeper)
async function deepCrawlSource(url, maxPages = 20) {
  log('info', `Deep crawling: ${url} (max ${maxPages} pages)`);
  try {
    const crawlResponse = await firecrawl.crawlUrl(url, {
      limit: maxPages,
      scrapeOptions: { formats: ['markdown'], onlyMainContent: true }
    });
    if (crawlResponse.success) {
      log('success', `Deep crawl done: ${crawlResponse.data.length} pages from ${url}`);
      return crawlResponse.data.map(d => d.markdown || '').join('\n\n---\n\n');
    }
  } catch (err) {
    log('error', `Deep crawl failed: ${err.message}`);
  }
  return null;
}

// Firecrawl SEARCH (search for new schemes by keyword)
async function searchForNewSchemes() {
  const queries = [
    'new government scheme India 2025',
    'नई सरकारी योजना 2025',
    'PM Yojana launch 2025',
    'government benefit scheme India announced',
  ];
  
  const results = [];
  for (const query of queries) {
    try {
      const searchResult = await firecrawl.search(query, {
        limit: 5,
        scrapeOptions: { formats: ['markdown'] }
      });
      if (searchResult.success) {
        results.push(...searchResult.data.map(r => ({
          source: r.url,
          content: r.markdown || r.description || ''
        })));
      }
    } catch (err) {
      log('warning', `Search failed for "${query}": ${err.message}`);
    }
  }
  return results;
}

// ===== STEP 2: CLAUDE AI EXTRACTS SCHEME DATA =====
async function extractSchemesWithClaude(content, sourceName) {
  if (!content || content.length < 100) return [];
  
  // Truncate to fit Claude's context (keep first 8000 chars)
  const truncated = content.slice(0, 8000);
  
  log('info', `Sending to Claude AI: ${sourceName}`);
  
  try {
    const response = await claude.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: `You are an expert at extracting Indian government scheme information from web content.
Extract ONLY government schemes/yojanas. Return ONLY valid JSON array, no markdown, no explanation.
If no schemes found, return empty array: []`,
      messages: [{
        role: 'user',
        content: `Extract all government schemes from this content. Return JSON array:
[{
  "name": "Full official scheme name",
  "name_hi": "Hindi name if found",
  "ministry": "Ministry or department name",
  "description": "2-3 sentence description",
  "description_hi": "Hindi description if found",
  "benefit": "Specific benefit amount/type",
  "benefit_hi": "Hindi benefit text if found",
  "category": "one of: education/agriculture/housing/women/employment/health/social/business",
  "min_age": 0,
  "max_age": 120,
  "max_income": 5,
  "categories": ["general","obc","sc","st","ews"],
  "genders": ["male","female","other"],
  "situations": [],
  "tags": ["tag1","tag2"],
  "apply_url": "direct application URL if found",
  "official_url": "official website URL"
}]

Content from ${sourceName}:
${truncated}`
      }]
    });
    
    const text = response.content[0].text.trim();
    // Remove any markdown code fences if present
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const schemes = JSON.parse(clean);
    
    log('success', `Claude extracted ${schemes.length} schemes from ${sourceName}`);
    return schemes;
  } catch (err) {
    log('error', `Claude extraction failed for ${sourceName}: ${err.message}`);
    return [];
  }
}

// ===== STEP 3: CHANGE DETECTION =====
async function detectAndSaveChanges(newSchemes) {
  let added = 0, updated = 0, unchanged = 0;
  
  for (const scheme of newSchemes) {
    if (!scheme.name || scheme.name.length < 3) continue;
    
    // Check if scheme already exists (by name match)
    const { data: existing } = await supabase
      .from('schemes')
      .select('id, name, benefit, description')
      .ilike('name', `%${scheme.name.slice(0, 30)}%`)
      .single();
    
    if (!existing) {
      // NEW scheme — insert it
      const { error } = await supabase.from('schemes').insert({
        name: scheme.name,
        name_hi: scheme.name_hi,
        ministry: scheme.ministry,
        icon: '📋',
        icon_bg: scheme.category === 'agriculture' ? 'green' : scheme.category === 'women' ? 'orange' : 'blue',
        description: scheme.description,
        description_hi: scheme.description_hi,
        benefit: scheme.benefit,
        benefit_hi: scheme.benefit_hi,
        category: scheme.category || 'social',
        min_age: scheme.min_age || 0,
        max_age: scheme.max_age || 120,
        max_income: scheme.max_income || 5,
        categories: scheme.categories || ['general','obc','sc','st','ews'],
        genders: scheme.genders || ['male','female','other'],
        situations: scheme.situations || [],
        tags: scheme.tags || [],
        apply_url: scheme.apply_url,
        official_url: scheme.official_url,
        badge: 'NEW',
        is_active: true,
      });
      if (!error) { added++; log('success', `NEW scheme saved: ${scheme.name}`); }
      
    } else if (existing.benefit !== scheme.benefit || existing.description !== scheme.description) {
      // UPDATED scheme
      const { error } = await supabase
        .from('schemes')
        .update({
          benefit: scheme.benefit,
          description: scheme.description,
          badge: 'UPDATED',
        })
        .eq('id', existing.id);
      if (!error) { updated++; log('info', `UPDATED scheme: ${scheme.name}`); }
    } else {
      unchanged++;
    }
  }
  
  // Log crawl run to DB
  await supabase.from('crawl_logs').insert({
    schemes_found: newSchemes.length,
    schemes_added: added,
    schemes_updated: updated,
    ran_at: new Date().toISOString(),
  }).catch(() => {}); // ignore if table doesn't exist yet
  
  return { added, updated, unchanged };
}

// ===== MAIN CRAWL PIPELINE =====
async function runCrawlPipeline() {
  log('info', '=== CRAWL PIPELINE STARTED ===');
  const startTime = Date.now();
  let allExtractedSchemes = [];
  
  // Phase 1: Crawl all sources
  for (const source of GOVT_SOURCES) {
    const crawledData = await crawlSource(source);
    if (crawledData) {
      // Phase 2: AI extraction
      const schemes = await extractSchemesWithClaude(crawledData.content, source.name);
      allExtractedSchemes.push(...schemes);
    }
    // Small delay to be respectful to servers
    await new Promise(r => setTimeout(r, 1500));
  }
  
  // Phase 2b: Search for new schemes
  log('info', 'Running Firecrawl search for new schemes...');
  const searchResults = await searchForNewSchemes();
  for (const result of searchResults) {
    const schemes = await extractSchemesWithClaude(result.content, result.source);
    allExtractedSchemes.push(...schemes);
  }
  
  log('info', `Total raw schemes extracted: ${allExtractedSchemes.length}`);
  
  // Phase 3: Deduplicate by name
  const seen = new Set();
  const unique = allExtractedSchemes.filter(s => {
    const key = s.name?.toLowerCase().slice(0, 30);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  log('info', `After deduplication: ${unique.length} schemes`);
  
  // Phase 4: Save with change detection
  const { added, updated, unchanged } = await detectAndSaveChanges(unique);
  
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  log('success', `=== CRAWL COMPLETE in ${duration}s | +${added} new | ~${updated} updated | ${unchanged} unchanged ===`);
  
  return { added, updated, total: unique.length, duration };
}

// ===== EXPRESS API SERVER =====
const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), logs: crawlLogs.length });
});

// Get crawl logs
app.get('/api/logs', (req, res) => {
  res.json({ logs: crawlLogs.slice(0, 50) });
});

// Trigger manual crawl
app.post('/api/crawl', async (req, res) => {
  const key = req.headers['x-api-key'];
  if (key !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  res.json({ message: 'Crawl started', status: 'running' });
  // Run async
  runCrawlPipeline().catch(err => log('error', `Pipeline error: ${err.message}`));
});

// Get all schemes from Supabase
app.get('/api/schemes', async (req, res) => {
  const { category, search, limit = 50 } = req.query;
  let query = supabase.from('schemes').select('*').eq('is_active', true).limit(parseInt(limit));
  if (category && category !== 'all') query = query.eq('category', category);
  if (search) query = query.ilike('name', `%${search}%`);
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json({ schemes: data, count: data.length });
});

// Submit suggestion
app.post('/api/suggest', async (req, res) => {
  const { suggestion } = req.body;
  if (!suggestion) return res.status(400).json({ error: 'suggestion required' });
  const { error } = await supabase.from('suggestions').insert([{ suggestion }]);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// ===== START SERVER / EXPORT =====

// Vercel Serverless Entry Point
export default async function handler(req, res) {
  log('info', 'Vercel Serverless Function triggered');
  try {
    const results = await runCrawlPipeline();
    res.status(200).json(results);
  } catch (err) {
    log('error', `Pipeline failed: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
}

// Local Express Server (Only runs if not on Vercel)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    log('success', `YojanaFind crawler API running on port ${PORT}`);
    
    // Initial crawl check
    setTimeout(async () => {
      const { count } = await supabase.from('schemes').select('*', { count: 'exact', head: true });
      if (!count || count < 5) {
        log('info', 'Database empty — running initial crawl...');
        runCrawlPipeline().catch(err => log('error', err.message));
      }
    }, 30000);
  });
}
