'use client';

import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import StatCard, { StatCardProps } from '../components/StatCard';
import HighlightedCard from '../components/HiglightedCard';
import dynamic from 'next/dynamic';
import TopPizzasChart from './TopPizzasChart';
import PizzaEvaluationChart from './PizzaEvaluationChart';
import TopIngredientesChart from './TopIngredientesChart';
import TopPizzasLealesChart from './TopPizzasLealesChart';
import TiempoPreparacionChart from './TiempoPreparacionChart';
import PizzaSizeViolinChart from './PizzaSizeViolinChart';
import TopIngredientesPrepChart from './TopIngredientesPrepChart';
import HistogramaPreparacionChart from './HistogramaPreparacionChart';
import IngredientesFunnelChart from './IngredientesFunnelChart';
import RecomendadorIngredientes from './RecomendardorIngredientes';

const WeeklyHeatmap = dynamic(() => import('./WeeklyHeatmap'), { ssr: false });

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
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
              Dashboard - Page {page + 1}
            </Typography>

            <Grid container spacing={2} columns={12} sx={{ mb: 2 }}>
              {page === 0 && (
                <>
                  {/* Página 1: tarjetas + gráfico */}
                  {data.map((card, index) => (
                    <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
                      <StatCard {...card} />
                    </Grid>
                  ))}
                  <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <HighlightedCard />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <WeeklyHeatmap />
                  </Grid>
                </>
              )}

              {page === 1 && (
                 <>
    {/* Página 2: gráficas en cuadrícula 2x2 */}
    <Grid container spacing={2}>
      <Grid size={{ xs:12,md:6}}>
        <TopPizzasChart />
      </Grid>
      <Grid  size={{ xs:12,md:6}}>
        <PizzaEvaluationChart />
      </Grid>
      <Grid  size={{ xs:12,md:6}}>
        <TopIngredientesChart />
      </Grid>
      <Grid  size={{ xs:12,md:6}}>
        <TopPizzasLealesChart />
      </Grid>
    </Grid>
  </>
              )}

              {page === 2 && (
                <>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 ,md:6}}>
                    <TiempoPreparacionChart />
                  </Grid>
                  <Grid size={{ xs: 12,md:6 }}>
                    <PizzaSizeViolinChart />
                  </Grid>

                  <Grid size={{ xs: 12,md:6 }}>
                    <TopIngredientesPrepChart />
                  </Grid>
                  <Grid size={{ xs: 12,md:6 }}>
                    <HistogramaPreparacionChart />
                  </Grid>
                  </Grid>
                </>


              )}

              {page === 3 && (
                <>
                  <Grid size={{ xs: 12 }}>
                    <IngredientesFunnelChart />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <RecomendadorIngredientes />
                  </Grid>


                </>
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
