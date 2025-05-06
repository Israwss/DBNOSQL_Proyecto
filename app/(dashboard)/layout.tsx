'use client';
import * as React from 'react';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { usePathname, useParams } from 'next/navigation';
import { PageContainer } from '@toolpad/core/PageContainer';
import Footer from '../components/Footer';
import SidebarFooterAccount, { ToolbarAccountOverride } from './SidebarFooterAccount';
import { Box, Chip, Stack, Tooltip, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function CustomAppTitle() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        px: 77,
        py: 1,
        height: '100%',
        background: 'linear-gradient(to right, #2C2C2C, #F28C28)',
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <Box sx={{ width: 36, height: 36, position: 'relative' }}>
          <img
            src="/logo-pizzas-mibuen.png"
            alt="Pizzas Mi Buen Logo"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </Box>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
          Pizzas Mi Buen
        </Typography>
      
      </Stack>
    </Box>
  );
}


export default function Layout(props: { children: React.ReactNode }) {

  

  const pathname = usePathname();
  const params = useParams();
  const [employeeId] = params.segments ?? [];

  const title = React.useMemo(() => {
    if (pathname === '/employees/new') {
      return 'New Employee';
    }
    if (employeeId && pathname.includes('/edit')) {
      return `Employee ${employeeId} - Edit`;
    }
    if (employeeId) {
      return `Employee ${employeeId}`;
    }
    return undefined;
  }, [employeeId, pathname]);

  return (
    <DashboardLayout
      slots={{
        appTitle: CustomAppTitle,
        toolbarAccount: ToolbarAccountOverride,
        sidebarFooter: SidebarFooterAccount,
      }}
    >
      <PageContainer title={title}>
        {props.children}
       
      </PageContainer>
      <Footer/>
    </DashboardLayout>
  );
}
