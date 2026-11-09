import { Request, Response, Router } from 'express';
import authRoutes from './authRoutes.js';
import taskRoutes from './taskRoutes.js';
import { config } from '../config/config.js';
import { metricsRegistry } from '../observability/metrics.js';

const router = Router();

// Health check
router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

router.get('/metrics', async (_req: Request, res: Response) => {
  if (!config.metricsEnabled) {
    res.sendStatus(404);
    return;
  }

  res.setHeader('Content-Type', metricsRegistry.contentType);
  res.end(await metricsRegistry.metrics());
});

// Routes
router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);

export default router;
