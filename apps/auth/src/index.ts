import { initDatabase } from './database/index.js';
import { createContainer } from './container.js';
import { createApp } from './app.js';
import { env } from './config/env.js';

// Application entry point: initializes DB, DI container and starts HTTP server
async function main(): Promise<void> {
  await initDatabase();

  const container = createContainer();
  const app = createApp(container);

  const port = env.port || 3000;
  app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
    console.log(`OIDC Discovery URL: http://localhost:${port}/oidc/.well-known/openid-configuration`);
  });
}

main().catch((err) => {
  console.error('[Startup] Failed to start application:', err);
  process.exit(1);
});
