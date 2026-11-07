import express, { Express } from 'express';
import { AppContainer } from './container.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { env } from './config/env.js';

// Initializes and configures the Express application
export function createApp(container: AppContainer): Express {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  if (env.node === 'development') {
    app.use((req, _res, next) => {
      console.log(`[DEBUG EXPRESS] ${req.method} ${req.originalUrl}`);
      next();
    });
  }

  app.use('/', container.router);

  app.use(errorHandler);

  return app;
}
