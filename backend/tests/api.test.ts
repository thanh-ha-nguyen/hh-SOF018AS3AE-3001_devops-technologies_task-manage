import request from 'supertest';
import { describe, expect, it } from 'vitest';
import app from '../src/server.js';

describe('API Health Check', () => {
  it('should return 200 for health check endpoint', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message', 'API is running');
    expect(response.body).toHaveProperty('timestamp');
  });

  it('should return 404 for unknown routes', async () => {
    const response = await request(app).get('/api/unknown');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('success', false);
  });

  it('should expose Prometheus metrics when enabled', async () => {
    const response = await request(app).get('/api/metrics');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('text/plain');
    expect(response.text).toContain('# HELP http_requests_total');
    expect(response.text).toContain('# HELP http_request_duration_seconds');
  });
});
