'use client';

import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { CircularProgress, Box, Typography } from '@mui/material';

interface PrepData {
  pizza_category: string;
  t_prep_median: number;
}

function timeFormatter(value: number): string {
  const minutes = Math.floor(value);
  const seconds = Math.round((value - minutes) * 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default function TiempoPreparacionChart() {
  const [data, setData] = React.useState<PrepData[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/preparacion-por-categoria')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching prep time data:', err);
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
    return <Typography>No preparation time data available.</Typography>;
  }

  const dataset = data.map((item) => ({
    category: item.pizza_category,
    median_time: item.t_prep_median,
  }));

  return (
    <Box sx={{ width: '100%', height: 500 }}>
      <BarChart
        dataset={dataset}
        xAxis={[{ scaleType: 'band', dataKey: 'category', label: 'Categoría', tickLabelStyle: { angle: -45, textAnchor: 'end' } }]}
        yAxis={[{
          label: 'Minutos',
          valueFormatter: timeFormatter,
          min: 24,
          max: 26,
        }]}
        series={[{ dataKey: 'median_time', label: 'Tiempo mediano' }]}
        height={500}
      />
    </Box>
  );
}