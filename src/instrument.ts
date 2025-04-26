import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

Sentry.init({
  dsn: 'https://238ac37f26e6addb625693cc14591122@o4509218056306688.ingest.us.sentry.io/4509218065809408',
  integrations: [nodeProfilingIntegration()],

  tracesSampleRate: 1.0,

  profilesSampleRate: 1.0,
});
