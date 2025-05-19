'use client';

import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import dynamic from 'next/dynamic';
import TopPizzasChart from './TopPizzasChart';
import PizzaEvaluationChart from './PizzaEvaluationChart';

import PizzaSizeViolinChart from './PizzaSizeViolinChart';
import TopIngredientesPrepChart from './TopIngredientesPrepChart';
import IngredientesFunnelChart from './IngredientesFunnelChart';
import RecomendadorIngredientes from './RecomendardorIngredientes';
import HourChart from './HourChart';
import DayChart from './DayChart';
import KpiCards from './KpiCards';
import SeasonChart from './SeasonChart'; // Ensure this path is correct
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from 'next/link';


const WeeklyHeatmap = dynamic(() => import('./WeeklyHeatmap'), { ssr: false });
const SalesForecastChart = dynamic(() => import('./SalesForecastChart'), { ssr: false });

const data: StatCardProps[] = [
  { title: 'Users', value: '14k', interval: 'Last 30 days', trend: 'up', data: new Array(30).fill(0) },
  { title: 'Conversions', value: '325', interval: 'Last 30 days', trend: 'down', data: new Array(30).fill(0) },
  { title: 'Event count', value: '200k', interval: 'Last 30 days', trend: 'neutral', data: new Array(30).fill(0) },
];

export default function DashboardContent() {
  const [page, setPage] = React.useState(0);
  const totalPages = 4;

  const handleNext = () => setPage((prev) => prev + 1);
  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 0));

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


            <Grid container spacing={2} columns={12} sx={{ mb: 2 }}>
              {page === 0 && (
                <Box sx={{ flexGrow: 1 }}>
                  <Breadcrumbs>
        <Link href="/">Dashboard</Link>
        <Typography>Análisis de ventas</Typography>
      </Breadcrumbs>
      <Typography variant="h4" sx={{mb:3}}>Análisis de Ventas</Typography>
                  {/* ✅ KPI Cards */}
                  <KpiCards />

                  {/* 🟦 Serie de tiempo (full width) */}
                  <Grid container spacing={2} sx={{ mt: 3 }}>
                    <Grid size={12}>
                      <Typography variant="subtitle1" sx={{ mb: 1 }} />
                      <SalesForecastChart />
                    </Grid>
                  </Grid>

                  {/* 🟨 Hora, Día y Temporada en disposición 2 arriba + 1 abajo */}
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid size={4}>
                      <Typography variant="subtitle1" sx={{ mb: 1 }} />
                      <HourChart />
                    </Grid>
                    <Grid size={4}>
                      <Typography variant="subtitle1" sx={{ mb: 1 }} />
                      <DayChart />
                    </Grid>
                    <Grid size={4}>
                      <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }} />
                      <SeasonChart />
                    </Grid>
                  </Grid>

                  {/* 🟧 Heatmap (full width abajo) */}
                  <Grid container spacing={2} sx={{ mt: 4 }}>
                    <Grid size={12 }>
                      <WeeklyHeatmap />
                    </Grid>
                  </Grid>
                </Box>

              )}

              {page === 1 && (
                <Box sx={{ flexGrow: 1 }}>
   <Breadcrumbs>
        <Link href="/">Dashboard</Link>
        <Typography>Análisis de Productos</Typography>
      </Breadcrumbs>
      <Typography variant="h4" sx={{mb:3}}>Análisis de Productos</Typography>

                  
                  
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}sx={{ mb: 4 ,mt: 2}}>
                       <PizzaEvaluationChart />
                    </Grid>
                    <Grid size={{ xs: 12}} sx={{ mb: 2 ,mt: 3}}>
                      <TopPizzasChart />
                    </Grid>
                     <Grid size={{ xs: 12 }} sx={{ mb: 4 }}>
                    <IngredientesFunnelChart />
                      </Grid>
                    
                  </Grid>
                </Box>
              )}

              {page === 2 && (
                <Box sx={{ flexGrow: 1 }}>

   <Breadcrumbs>
        <Link href="/">Dashboard</Link>
        <Typography>Análisis de Productos</Typography>
      </Breadcrumbs>
      <Typography variant="h4" sx={{mb:3}}>Análisis de Productos</Typography>
                  
                  <Grid container spacing={2}>
                    
                    <Grid size={{ xs: 12}}>
                      <PizzaSizeViolinChart />
                    </Grid>
                    <Grid size={{ xs: 12}}>
                      <TopIngredientesPrepChart />
                    </Grid>
                    <Grid size={{ xs: 12}}>
                     <RecomendadorIngredientes />
                    </Grid>
                    
                  </Grid>
                </Box>
              )}

            
            </Grid>

            {/* 🔸 Controles de navegación */}
            <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
              <Button variant="outlined" onClick={handlePrev} disabled={page === 0}>
                Previous
              </Button>
              <Typography>Page {page + 1}</Typography>
              <Button variant="outlined" onClick={handleNext} disabled={page >= totalPages - 1}>
                Next
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
