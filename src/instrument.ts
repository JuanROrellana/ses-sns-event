import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { config } from 'dotenv';

// Load environment variables directly for this file
config();

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],

  tracesSampleRate: 1.0,

  profilesSampleRate: 1.0,
});
