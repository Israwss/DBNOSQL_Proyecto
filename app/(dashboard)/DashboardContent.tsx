'use client';

import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import StatCard, { StatCardProps } from '../components/StatCard';
import HighlightedCard from '../components/HiglightedCard';
import dynamic from 'next/dynamic';

// ✅ Carga dinámica del gráfico para evitar errores en SSR
const WeeklyHeatmap = dynamic(() => import('./WeeklyHeatmap'), { ssr: false });

// 🔸 Datos de ejemplo conservados por estructura, puedes quitarlos si no los necesitas
const data: StatCardProps[] = [
  {
    title: 'Users',
    value: '14k',
    interval: 'Last 30 days',
    trend: 'up',
    data: new Array(30).fill(0),
  },
  {
    title: 'Conversions',
    value: '325',
    interval: 'Last 30 days',
    trend: 'down',
    data: new Array(30).fill(0),
  },
  {
    title: 'Event count',
    value: '200k',
    interval: 'Last 30 days',
    trend: 'neutral',
    data: new Array(30).fill(0),
  },
];

export default function DashboardContent() {
  return (
    <Box sx={{ display: 'flex' }}>
      <Box
        component="main"
        sx={(theme) => ({
          flexGrow: 1,
          backgroundColor: theme.vars
            ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
            : alpha(theme.palette.background.default, 1),
          overflow: 'auto',
        })}
      >
        <Stack
          spacing={2}
          sx={{
            alignItems: 'center',
            mx: 3,
            pb: 5,
            mt: { xs: 8, md: 0 },
          }}
        >
          <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
            {/* ✅ Encabezado de sección */}
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
              Overview
            </Typography>

            {/* ✅ Contenedor de tarjetas y gráfico */}
            <Grid container spacing={2} columns={12} sx={{ mb: (theme) => theme.spacing(2) }}>
              {data.map((card, index) => (
                <Grid item key={index} xs={12} sm={6} lg={3}>
                  <StatCard {...card} />
                </Grid>
              ))}

              <Grid item xs={12} sm={6} lg={3}>
                <HighlightedCard />
              </Grid>

              {/* ✅ Gráfico heatmap semanal */}
              <Grid item xs={12}>
                <WeeklyHeatmap />
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
