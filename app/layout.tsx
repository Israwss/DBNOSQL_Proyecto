import * as React from 'react';
import { NextAppProvider } from '@toolpad/core/nextjs';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PersonIcon from '@mui/icons-material/Person';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People'; // Icono para Clientes
import StoreIcon from '@mui/icons-material/Store'; // Icono para Sucursales
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import type { Navigation } from '@toolpad/core/AppProvider';
import { SessionProvider, signIn, signOut } from 'next-auth/react';
import theme from '../theme';
import { auth } from '../auth';

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Opciones',
  },
  
  {
    title: 'Dashboard',
    icon: <DashboardIcon />,
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
  // Nueva sección para Clientes
  {
    segment: 'customers',
    title: 'Clientes',
    icon: <PeopleIcon />,
    pattern: 'customers{/:customerId}*',
  },
  // Nueva sección para Sucursales
  {
    segment: 'branches',
    title: 'Sucursales',
    icon: <StoreIcon />,
    pattern: 'branches{/:branchId}*',
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