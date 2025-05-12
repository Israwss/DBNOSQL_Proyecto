'use client';

import * as React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import dynamic from 'next/dynamic';

// Importa dinámicamente el mapa para evitar SSR
const MapWithNoSSR = dynamic(
  () => import('../../components/MapComponent'),
  {
    ssr: false,
    loading: () => <CircularProgress />
  }
);

interface Sucursal {
  mall: string;
  lat: number;
  lon: number;
}

export default function BranchPage() {
  const [branches, setBranches] = React.useState<Sucursal[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/branches')
      .then((res) => res.json())
      .then((data) => {
        setBranches(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching branch data:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: 'calc(100vh - 64px)',
        p: 4 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (branches.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: 'calc(100vh - 64px)',
        p: 4 
      }}>
        <Typography>No hay sucursales para mostrar.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      height: 'calc(100vh - 64px)',
      width: '100%',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <MapWithNoSSR branches={branches} />
    </Box>
  );
}