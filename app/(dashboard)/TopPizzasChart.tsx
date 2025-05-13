'use client';

import * as React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts';

interface PizzaData {
  pizza_name: string;
  pizzasTotal: number;
}

export default function TopPizzasChart() {
  const [data, setData] = React.useState<PizzaData[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/top-pizzas')
      .then((res) => res.json())
      .then((json) => {
        setData(json.slice(0, 5));
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching pizza data:', err);
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
    return <Typography>No hay datos de pizzas disponibles.</Typography>;
  }

  const cleanName = (name: string) =>
    name.replace(/\b(The|Pizza)\b/gi, '').trim();

  const dataset = data.map((pizza) => ({
    name: cleanName(pizza.pizza_name),
    ventas: pizza.pizzasTotal,
  }));

  return (
    <Box sx={{ width: '100%', height: 420 }}>
      <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
        Top 5 Pizzas Más Vendidas
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
            dataKey: 'ventas',
            label: 'Total Vendidas',
            color: '#FFC067',
          },
        ]}
        layout="horizontal"
        xAxis={[
          {
            label: 'Ventas',
            tickMinStep: 1,
          
          },
        ]}
        margin={{
          left: 100,
          right: 20,
          top: 20,
          bottom: 70,
        }}
        sx={{
          '& .MuiChartsAxis-tickLabel': {
            overflow: 'visible',
            whiteSpace: 'nowrap',
          
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
