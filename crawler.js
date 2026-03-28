// ===== START SERVER / EXPORT =====

/**
 * Vercel Serverless Entry Point
 * This is triggered by Vercel Cron Jobs (defined in vercel.json) 
 * or by hitting the /api/crawl endpoint.
 */
export default async function handler(req, res) {
  // Security check for manual triggers
  const key = req.headers['x-api-key'];
  const isAdminRequest = key === process.env.ADMIN_SECRET;
  const isCronRequest = req.headers['x-vercel-cron'] === '1';

  if (!isAdminRequest && !isCronRequest) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  log('info', 'Vercel Serverless Function triggered');
  
  try {
    // Run the full crawl, extraction, and save process
    const results = await runCrawlPipeline();
    res.status(200).json({
      success: true,
      message: 'Crawl completed successfully',
      results
    });
  } catch (err) {
    log('error', `Pipeline failed: ${err.message}`);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
}

/**
 * Local Express Server
 * Only runs if the environment is NOT Vercel (e.g., local dev or VPS like Render/Railway).
 * This prevents the build from hanging on Vercel.
 */
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    log('success', `YojanaFind crawler API running on port ${PORT}`);
    log('info', 'Local mode: Background cron or manual triggers active');
    
    // Initial crawl check: Run 30s after startup if database is empty
    setTimeout(async () => {
      try {
        const { count } = await supabase
          .from('schemes')
          .select('*', { count: 'exact', head: true });
          
        if (!count || count < 5) {
          log('info', 'Database empty — running initial crawl...');
          runCrawlPipeline().catch(err => log('error', err.message));
        }
      } catch (err) {
        log('error', `Initial DB check failed: ${err.message}`);
      }
    }, 30000);
  });
}
