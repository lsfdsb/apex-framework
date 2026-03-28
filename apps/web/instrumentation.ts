import { initializeSentry } from '@apex/observability/instrumentation';

export const register = initializeSentry;
export { onRequestError } from '@apex/observability/instrumentation';
