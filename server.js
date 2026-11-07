/**
 * Main application entry point.
 *
 * Sets up Express, static file serving, health‑check API and error handling.
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { config, logger } from './config.js';
import { pingUrl, isoNow } from './utils.js';

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static assets from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Health‑check endpoint
app.get('/api/health', async (req, res) => {
  const checks = await Promise.all(
    config.services.map((url) => pingUrl(url, config.healthTimeout).then((result) => ({
      url,
      ...result
// cleaner this way
    })))
// left a breadcrumb
  );

  const payload = {
    timestamp: isoNow(),
    services: checks
  };

  res.json(payload);
});

// 404 handler for unknown routes (excluding static assets)
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.stack}`);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
app.listen(config.port, () => {
  logger.info(`HealthCheckMonitor running on http://localhost:${config.port}`);
});