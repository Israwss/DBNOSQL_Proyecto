'use client';

import * as React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import dynamic from 'next/dynamic';

// Carga dinámica del mapa (sin SSR)
const MapWithNoSSR = dynamic(() => import('../../components/MapComponent'), {
  ssr: false,
  loading: () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <CircularProgress />
    </Box>
  ),
});

interface Sucursal {
  mall: string;
  lat: number;
  lon: number;
}

export default function BranchPage() {
  const [branches, setBranches] = React.useState<Sucursal[] | null>(null);

  React.useEffect(() => {
    const controller = new AbortController(); // permite cancelar fetch si el componente se desmonta

    fetch('/api/branches', { signal: controller.signal })
      .then(res => res.json())
      .then(data => {
        setBranches(data);
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error('Error fetching branch data:', err);
        }
        setBranches([]);
      });

    return () => controller.abort(); // limpia la solicitud si el componente se desmonta
  }, []);

  const renderContent = () => {
    if (branches === null) {
      return <CircularProgress />;
    }

    if (branches.length === 0) {
      return <Typography>No hay sucursales para mostrar.</Typography>;
    }

    return <MapWithNoSSR branches={branches} />;
  };

  return (
    <Box
      sx={{
        height: 'calc(100vh - 64px)',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
      }}
    >
      {renderContent()}
    </Box>
  );
}
