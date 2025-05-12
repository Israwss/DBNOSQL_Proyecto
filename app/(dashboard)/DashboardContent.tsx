'use client';

import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import SeasonChart from './SeasonChart';
import DayChart from './DayChart';
import HourChart from './HourChart';

import dynamic from 'next/dynamic';

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

            {/* ✅ Título */}
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
              Overview
            </Typography>

            {/* 🟥 Espacios para KPI cards */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}><Box sx={{ height: 100, border: '1px dashed gray' }} /></Grid>
              <Grid item xs={12} md={4}><Box sx={{ height: 100, border: '1px dashed gray' }} /></Grid>
              <Grid item xs={12} md={4}><Box sx={{ height: 100, border: '1px dashed gray' }} /></Grid>
            </Grid>
            
            {/* 🟦 Serie de tiempo + gráfico de hora lado a lado */}
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              {/* Serie de tiempo */}
              <Box sx={{ flex: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}></Typography>
                <SalesForecastChart />
                <Typography variant="subtitle1" sx={{ mb: 1 }}></Typography>
              <WeeklyHeatmap />
              </Box>
              <Box sx={{ flex: 2 }}>
                {/* 🟨 Gráfico por hora */}
                <Typography variant="subtitle1" sx={{ mb: 1 }}></Typography>
                <HourChart />
                {/* 🟩 Día */}
                <Typography variant="subtitle1" sx={{ mb: 1 }}></Typography>
                <DayChart />
                 {/* 🟩 Season */}
                <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}></Typography>
                <SeasonChart />
              </Box>
            </Box>
            {/* 🟧 Heatmap */}
            <Box sx={{ mt: 4 }}>
              
            </Box>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
