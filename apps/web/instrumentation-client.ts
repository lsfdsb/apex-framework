import { initializeAnalytics } from '@apex/analytics/instrumentation-client';
import { initializeSentry } from '@apex/observability/client';

initializeSentry();
initializeAnalytics();

export { onRouterTransitionStart } from '@apex/observability/client';
