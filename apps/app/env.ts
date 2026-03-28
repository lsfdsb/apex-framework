import { keys as analytics } from '@apex/analytics/keys';
import { keys as auth } from '@apex/auth/keys';
import { keys as collaboration } from '@apex/collaboration/keys';
import { keys as database } from '@apex/database/keys';
import { keys as email } from '@apex/email/keys';
import { keys as flags } from '@apex/feature-flags/keys';
import { keys as core } from '@apex/next-config/keys';
import { keys as notifications } from '@apex/notifications/keys';
import { keys as observability } from '@apex/observability/keys';
import { keys as security } from '@apex/security/keys';
import { keys as webhooks } from '@apex/webhooks/keys';
import { createEnv } from '@t3-oss/env-nextjs';

export const env = createEnv({
  extends: [
    auth(),
    analytics(),
    collaboration(),
    core(),
    database(),
    email(),
    flags(),
    notifications(),
    observability(),
    security(),
    webhooks(),
  ],
  server: {},
  client: {},
  runtimeEnv: {},
});
