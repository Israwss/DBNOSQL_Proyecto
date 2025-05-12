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
    return <Typography>No loyalty data available.</Typography>;
  }

  const dataset = data.map((item) => ({
    pizza: item.pizza_name,
    lealtad: parseFloat((item.proporcion_lealtad * 100).toFixed(2)), // en porcentaje
  }));

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
        use client
      </Typography>
      <BarChart
        dataset={dataset}
        barLabel={(item, context) => {
          const current = dataset[item.dataIndex];
          return current ? `${current.pizza} - ${current.lealtad}%` : null;
        }}
        yAxis={[
          {
            scaleType: 'band',
            dataKey: 'pizza',
            tickLabelStyle: {
              display: 'none',
            },
          },
        ]}
        series={[
          {
            dataKey: 'lealtad',
            label: '% pedidos clientes leales',
            color: '#FFC067',
          },
        ]}
        layout="horizontal"
        xAxis={[{ label: '% lealtad', tickMinStep: 5 }]}
        margin={{ left: 150, right: 20, top: 20, bottom: 70 }}
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
        height={500}
      />
    </Box>
  );
}
