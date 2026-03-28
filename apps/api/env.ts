import { keys as analytics } from '@apex/analytics/keys';
import { keys as auth } from '@apex/auth/keys';
import { keys as database } from '@apex/database/keys';
import { keys as email } from '@apex/email/keys';
import { keys as core } from '@apex/next-config/keys';
import { keys as observability } from '@apex/observability/keys';
import { keys as payments } from '@apex/payments/keys';
import { createEnv } from '@t3-oss/env-nextjs';

export const env = createEnv({
  extends: [auth(), analytics(), core(), database(), email(), observability(), payments()],
  server: {},
  client: {},
  runtimeEnv: {},
});
