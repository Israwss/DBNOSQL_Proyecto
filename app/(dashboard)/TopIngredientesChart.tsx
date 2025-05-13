'use client';

import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { CircularProgress, Box, Typography } from '@mui/material';

interface IngredienteData {
  ingrediente: string;
  promedio_semanal_gramos: number;
}

export default function TopIngredientesChart() {
  const [data, setData] = React.useState<IngredienteData[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/ingredientes-top')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching ingredient data:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (data.length === 0) {
    return <Typography>No ingredient data available.</Typography>;
  }

  const dataset = data.map((item) => ({
    ingrediente: item.ingrediente,
    gramos: item.promedio_semanal_gramos,
  }));

  return (
    <Box sx={{ width: '100%', height: 420 }}>
      <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
        Top Ingredientes Más Usados
      </Typography>
      <BarChart
        height={420}
        dataset={dataset}
        barLabel="value"
        yAxis={[
          {
            scaleType: 'band',
            dataKey: 'ingrediente',
          },
        ]}
        series={[
          {
            dataKey: 'gramos',
            label: 'Promedio semanal (g)',
            color: '#FFC067',
          },
        ]}
        layout="horizontal"
        xAxis={[
          {
            label: 'Gramos',
            tickMinStep: 1,
          },
        ]}
        margin={{ left: 100, right: 20, top: 20, bottom: 70 }}
        sx={{
          '& .MuiChartsAxis-tickLabel': {
            overflow: 'visible',
            whiteSpace: 'nowrap',
            textOverflow: 'clip',
          },
          '& .MuiBarElement-root': {
            strokeWidth: 0,
          },
          '& .MuiChartsBarLabel-root': {
            fontSize: 13,
            fill: '#333',
          },
        }}
      />
    </Box>
  );
}
