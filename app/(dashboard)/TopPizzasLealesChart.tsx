'use client';

import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { CircularProgress, Box, Typography } from '@mui/material';

interface PizzaLealData {
  pizza_name: string;
  proporcion_lealtad: number;
}

export default function TopPizzasLealesChart() {
  const [data, setData] = React.useState<PizzaLealData[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/top-leales')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching top loyal pizzas:', err);
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
    return <Typography>No hay datos de lealtad disponibles.</Typography>;
  }

  const cleanName = (name: string) =>
    name.replace(/\b(The|Pizza)\b/gi, '').trim();

  const dataset = data.map((pizza) => ({
    name: cleanName(pizza.pizza_name),
    lealtad: pizza.proporcion_lealtad,
  }));

  return (
    <Box sx={{ width: '100%', height: 420 }}>
      <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
        Top Pizzas con Mayor Proporción de Clientes Leales
      </Typography>
      <BarChart
        height={420}
        dataset={dataset}
        barLabel="value"
        yAxis={[
          {
            scaleType: 'band',
            dataKey: 'name',
          },
        ]}
        series={[
          {
            dataKey: 'lealtad',
            label: 'Proporción Leal',
            color: '#FFC067',
          },
        ]}
        layout="horizontal"
        xAxis={[
          {
            label: 'Proporción de Lealtad',
            tickFormat: (v) => `${(v * 100).toFixed(1)}%`,
          },
        ]}
        margin={{
          left: 150,
          right: 20,
          top: 20,
          bottom: 70,
        }}
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
