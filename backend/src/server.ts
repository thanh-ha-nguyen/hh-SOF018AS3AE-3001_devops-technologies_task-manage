import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import { config } from './config/config.js';
import routes from './routes/index.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { log } from './observability/logger.js';
import { observeHttpMetrics } from './observability/metrics.js';

dotenv.config();

const app: Application = express();

if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

app.use(helmet()); 
app.use(cors({
  origin: config.frontendUrl,
  credentials: true
}));
app.use(observeHttpMetrics);
app.use((req, res, next) => {
  const startedAt = process.hrtime.bigint();

  res.on('finish', () => {
    const route = req.route?.path;
    log('info', 'http_request', {
      method: req.method,
      path: route ? `${req.baseUrl}${String(route)}` : req.path,
      status_code: res.statusCode,
      duration_ms: Number(process.hrtime.bigint() - startedAt) / 1e6
    });
  });

  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.get('/', (_req, res) => {
  res.json({
    message: 'Task Management API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      tasks: '/api/tasks'
    }
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = config.port;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    log('info', 'server_started', { port: PORT, environment: config.nodeEnv });
  });
}

export default app;
