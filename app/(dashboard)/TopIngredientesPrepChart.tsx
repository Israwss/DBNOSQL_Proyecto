'use client';

import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { CircularProgress, Box, Typography } from '@mui/material';

interface IngredientePrep {
  ingrediente: string;
  promedio_tiempo: number;
}

export default function TopIngredientesPrepChart() {
  const [data, setData] = React.useState<IngredientePrep[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/top-ingredientes-preparacion')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching ingredientes prep data:', err);
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
    return <Typography>No data available.</Typography>;
  }

  const dataset = data.map((item) => ({
    ingrediente: item.ingrediente,
    tiempo: parseFloat(item.promedio_tiempo.toFixed(2)),
  }));

  return (
    <Box sx={{ width: '100%', height: 500 }}>
      <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
        Ingredientes con Mayor Tiempo Promedio de Preparación
      </Typography>
      <BarChart
        height={500}
        dataset={dataset}
        layout="horizontal"
        barLabel="value"
        yAxis={[{
          scaleType: 'band',
          dataKey: 'ingrediente',
        }]}
        xAxis={[{
          label: 'Minutos',
          min: 25,
          max: 28,
        }]}
        series={[{
          dataKey: 'tiempo',
          label: 'Tiempo promedio (min)',
          color: '#FFC067',
        }]}
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
