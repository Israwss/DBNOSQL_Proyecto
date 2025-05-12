'use client';

import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import HighlightedCard from '../components/HiglightedCard';
import SessionsChart from '../components/SessionsChart';
import PageViewsBarChart from '../components/PageViewsBarChart';
import CustomTreeView from '../components/CustomTreeView';
import ChartUserByCountry from '../components/ChartUserByCountry';
import SeasonChart from './SeasonChart';
import DayChart from './DayChart';
import HourChart from './HourChart';

import dynamic from 'next/dynamic';
import KpiCards from './KpiCards';

const WeeklyHeatmap = dynamic(() => import('./WeeklyHeatmap'), { ssr: false });
const SalesForecastChart = dynamic(() => import('./SalesForecastChart'), { ssr: false });

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
            {/* ✅ Título de la sección */}
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
              Overview
            </Typography>

            {/* ✅ KPI Cards en su propio bloque */}
            <KpiCards />

            {/* ✅ Tarjeta destacada */}
            <Grid container spacing={2} columns={12} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6} lg={3}>
                <HighlightedCard />
              </Grid>

              {/* ✅ Gráfico heatmap semanal */}
              <Grid item xs={12}>
                <WeeklyHeatmap />
              </Grid>

              {/* ✅ Gráfico de predicción de ventas */}
              <Grid item xs={12}>
                <SalesForecastChart />
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
