import { auth, currentUser } from '@apex/auth/server';
import { SidebarProvider } from '@apex/design-system/components/ui/sidebar';
import { showBetaFeature } from '@apex/feature-flags';
import { secure } from '@apex/security';
import type { ReactNode } from 'react';
import { env } from '@/env';
import { NotificationsProvider } from './components/notifications-provider';
import { GlobalSidebar } from './components/sidebar';

interface AppLayoutProperties {
  readonly children: ReactNode;
}

const AppLayout = async ({ children }: AppLayoutProperties) => {
  if (env.ARCJET_KEY) {
    await secure(['CATEGORY:PREVIEW']);
  }

  const user = await currentUser();
  const { redirectToSignIn } = await auth();
  const betaFeature = await showBetaFeature();

  if (!user) {
    return redirectToSignIn();
  }

  return (
    <NotificationsProvider userId={user.id}>
      <SidebarProvider>
        <GlobalSidebar>
          {betaFeature && (
            <div className="m-4 rounded-full bg-blue-500 p-1.5 text-center text-sm text-white">
              Beta feature now available
            </div>
          )}
          {children}
        </GlobalSidebar>
      </SidebarProvider>
    </NotificationsProvider>
  );
};

export default AppLayout;
