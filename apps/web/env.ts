import { keys as cms } from '@apex/cms/keys';
import { keys as email } from '@apex/email/keys';
import { keys as flags } from '@apex/feature-flags/keys';
import { keys as core } from '@apex/next-config/keys';
import { keys as observability } from '@apex/observability/keys';
import { keys as rateLimit } from '@apex/rate-limit/keys';
import { keys as security } from '@apex/security/keys';
import { createEnv } from '@t3-oss/env-nextjs';

export const env = createEnv({
  extends: [cms(), core(), email(), observability(), flags(), security(), rateLimit()],
  server: {},
  client: {},
  runtimeEnv: {},
});
