import { env } from '@/env';
import './styles.css';
import { AnalyticsProvider } from '@apex/analytics/provider';
import { DesignSystemProvider } from '@apex/design-system';
import { fonts } from '@apex/design-system/lib/fonts';
import { Toolbar } from '@apex/feature-flags/components/toolbar';
import type { ReactNode } from 'react';

interface RootLayoutProperties {
  readonly children: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProperties) => (
  <html className={fonts} lang="en" suppressHydrationWarning>
    <body>
      <AnalyticsProvider>
        <DesignSystemProvider
          helpUrl={env.NEXT_PUBLIC_DOCS_URL}
          privacyUrl={new URL('/legal/privacy', env.NEXT_PUBLIC_WEB_URL).toString()}
          termsUrl={new URL('/legal/terms', env.NEXT_PUBLIC_WEB_URL).toString()}
        >
          {children}
        </DesignSystemProvider>
      </AnalyticsProvider>
      <Toolbar />
    </body>
  </html>
);

export default RootLayout;
