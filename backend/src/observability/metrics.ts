import type { NextFunction, Request, Response } from 'express';
import { Counter, Histogram, Registry } from '@prometheus-io/client';

export const metricsRegistry = new Registry();

const requestCount = new Counter({
  name: 'http_requests_total',
  help: 'Total number of completed HTTP requests.',
  labelNames: ['method', 'route', 'status_code'],
  registers: [metricsRegistry]
});

const requestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds.',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
  registers: [metricsRegistry]
});

export const observeHttpMetrics = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const startedAt = process.hrtime.bigint();

  res.on('finish', () => {
    if (req.path === '/api/metrics') {
      return;
    }

    const route = req.route?.path;
    const labels = {
      method: req.method,
      route: route ? `${req.baseUrl}${String(route)}` : 'unmatched',
      status_code: String(res.statusCode)
    };
    const durationSeconds = Number(process.hrtime.bigint() - startedAt) / 1e9;

    requestCount.inc(labels);
    requestDuration.observe(labels, durationSeconds);
  });

  next();
};
