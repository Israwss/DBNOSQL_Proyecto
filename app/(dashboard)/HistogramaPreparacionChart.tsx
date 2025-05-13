'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { Box, CircularProgress, Typography } from '@mui/material';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface PrepPoint {
  pizza_size: string;
  t_prep: number;
}

export default function HistogramaPreparacionChart() {
  const [data, setData] = React.useState<PrepPoint[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/histograma-prep')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching histogram prep data:', err);
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

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const palette = ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00'];

  const traces = sizes.map((size, i) => ({
    type: 'histogram',
    x: data.filter((d) => d.pizza_size === size).map((d) => d.t_prep),
    name: size,
    marker: { color: palette[i], line: { color: 'black', width: 0.5 } },
    opacity: 0.85,
  }));

  return (
    <Box sx={{ width: 500 }}>
      <Typography variant="h6" sx={{ textAlign: 'center', mb: 2 }}>
        Distribución de tiempo de preparación por tamaño de pizza
      </Typography>
      <Box sx={{ height: 500 }}>
        <Plot
          data={traces}
          layout={{
            barmode: 'stack',
            title: '', // Ya no lo repetimos aquí
            xaxis: { title: 'Tiempo de preparación' },
            yaxis: { title: 'Cantidad de pizzas' },
            legend: { title: { text: 'Tamaño' }, traceorder: 'reversed' },
            height: 450,
            width: 500,
            margin: { t: 30, l: 60, r: 30, b: 60 },
          }}
          config={{ responsive: true }}
        />
      </Box>
    </Box>
  );
}
