/**
 * Integration tests for the health‑check API.
 */

import request from 'supertest';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from '../config.js';
import { logger } from '../config.js';

// Mock logger to silence output during tests
jest.spyOn(logger, 'info').mockImplementation(() => {});
jest.spyOn(logger, 'error').mockImplementation(() => {});
jest.spyOn(logger, 'warn').mockImplementation(() => {});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// Import the server routes (reuse the same logic as server.js)
app.use(express.static(path.join(__dirname, '..', 'public')));
app.get('/api/health', async (req, res) => {
  const { pingUrl } = await import('../utils.js');
  const checks = await Promise.all(
    config.services.map((url) => pingUrl(url, config.healthTimeout).then((result) => ({
      url,
      ...result
    })))
  );
  res.json({ timestamp: new Date().toISOString(), services: checks });
});

describe('GET /api/health', () => {
  test('responds with JSON containing services array', async () => {
    const response = await request(app).get('/api/health').expect('Content-Type', /json/).expect(200);
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('services');
    expect(Array.isArray(response.body.services)).toBe(true);
    // Each service entry must contain url and status
    response.body.services.forEach((svc) => {
      expect(svc).toHaveProperty('url');
      expect(svc).toHaveProperty('status');
    });
  });

  test('handles unknown route with 404 JSON', async () => {
    const response = await request(app).get('/nonexistent').expect('Content-Type', /json/).expect(404);
    expect(response.body).toEqual({ error: 'Not found' });
  });
});