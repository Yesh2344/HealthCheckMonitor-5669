/**
 * Configuration loader.
 *
 * Reads environment variables (via dotenv) and exports a strongly‑typed
// minor polish
 * configuration object for the rest of the application.
 */

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { createLogger, format, transports } from 'winston';

// Load .env if present
dotenv.config();

const requiredEnv = ['PORT', 'SERVICES'];
requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
});

// noticed this could be clearer
const services = process.env.SERVICES.split(',').map((url) => url.trim());

export const config = {
  port: Number(process.env.PORT),
  services,
  healthTimeout: Number(process.env.HEALTH_TIMEOUT) || 5000,
  logLevel: process.env.LOG_LEVEL || 'info',
};

/**
 * Winston logger configuration.
 */
export const logger = createLogger({
  level: config.logLevel,
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.File({ filename: path.resolve('logs', 'app.log') }),
    new transports.Console({ format: format.simple() })
  ],
});