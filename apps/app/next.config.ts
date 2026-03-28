import { withToolbar } from '@apex/feature-flags/lib/toolbar';
import { config, withAnalyzer } from '@apex/next-config';
import { withLogging, withSentry } from '@apex/observability/next-config';
import type { NextConfig } from 'next';
import { env } from '@/env';

let nextConfig: NextConfig = withToolbar(withLogging(config));

if (env.VERCEL) {
  nextConfig = withSentry(nextConfig);
}

if (env.ANALYZE === 'true') {
  nextConfig = withAnalyzer(nextConfig);
}

export default nextConfig;
