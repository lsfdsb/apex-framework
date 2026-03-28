import './styles.css';
import { AnalyticsProvider } from '@apex/analytics/provider';
import { Toolbar as CMSToolbar } from '@apex/cms/components/toolbar';
import { DesignSystemProvider } from '@apex/design-system';
import { fonts } from '@apex/design-system/lib/fonts';
import { cn } from '@apex/design-system/lib/utils';
import { Toolbar } from '@apex/feature-flags/components/toolbar';
import { getDictionary } from '@apex/internationalization';
import type { ReactNode } from 'react';
import { Footer } from './components/footer';
import { Header } from './components/header';

interface RootLayoutProperties {
  readonly children: ReactNode;
  readonly params: Promise<{
    locale: string;
  }>;
}

const RootLayout = async ({ children, params }: RootLayoutProperties) => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return (
    <html className={cn(fonts, 'scroll-smooth')} lang="en" suppressHydrationWarning>
      <body>
        <AnalyticsProvider>
          <DesignSystemProvider>
            <Header dictionary={dictionary} />
            {children}
            <Footer />
          </DesignSystemProvider>
          <Toolbar />
          <CMSToolbar />
        </AnalyticsProvider>
      </body>
    </html>
  );
};

export default RootLayout;
