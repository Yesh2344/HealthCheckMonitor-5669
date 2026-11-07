/**
 * Utility functions used across the project.
 */

import fetch from 'node-fetch';
import { logger } from './config.js';

/**
 * Performs an HTTP GET request to the given URL with a timeout.
 *
 * @param {string} url - The URL to request.
 * @param {number} timeoutMs - Timeout in milliseconds.
 * @returns {Promise<{status: 'up'|'down', responseTimeMs?: number, error?: string}>}
 */
export async function pingUrl(url, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const start = Date.now();

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    const responseTime = Date.now() - start;

    if (!response.ok) {
      const errorMsg = `HTTP ${response.status}`;
      logger.warn(`Health check failed for ${url}: ${errorMsg}`);
      return { status: 'down', error: errorMsg };
    }

    return { status: 'up', responseTimeMs: responseTime };
  } catch (err) {
    clearTimeout(timeout);
    const msg = err.name === 'AbortError' ? `Timeout after ${timeoutMs}ms` : err.message;
    logger.error(`Health check error for ${url}: ${msg}`);
    return { status: 'down', error: msg };
  }
}

/**
 * Formats a Date object into ISO 8601 string.
 *
 * @param {Date} date
 * @returns {string}
 */
export function isoNow(date = new Date()) {
  return date.toISOString();
}