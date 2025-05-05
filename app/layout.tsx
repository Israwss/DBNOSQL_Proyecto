import * as React from 'react';
import { NextAppProvider } from '@toolpad/core/nextjs';
import HomeIcon from '@mui/icons-material/Home';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PersonIcon from '@mui/icons-material/Person';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import type { Navigation } from '@toolpad/core/AppProvider';
import { SessionProvider, signIn, signOut } from 'next-auth/react';
import theme from '../theme';
import { auth } from '../auth';

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    title: 'Home',
    icon: <HomeIcon />,
  },
  {
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    title: 'Reportes',
    icon: <AssessmentIcon />,
  },

  {
    segment: 'orders',
    title: 'Ordenes',
    icon: <ShoppingCartIcon />,
  },
  {
    segment: 'employees',
    title: 'Empleados',
    icon: <PersonIcon />,
    pattern: 'employees{/:employeeId}*',
  },
];

const AUTHENTICATION = {
  signIn,
  signOut,
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  return (
    <html lang="en" data-toolpad-color-scheme="light">
      <body>
        <SessionProvider session={session}>
          <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <NextAppProvider
              theme={theme}
              navigation={NAVIGATION}
              session={session}
              authentication={AUTHENTICATION}
            >
              {children}
            </NextAppProvider>
          </AppRouterCacheProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
