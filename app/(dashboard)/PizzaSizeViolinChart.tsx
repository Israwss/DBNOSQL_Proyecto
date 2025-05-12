'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { Box, CircularProgress } from '@mui/material';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface PrepPoint {
  pizza_size: string;
  t_prep: number;
}

export default function PizzaSizeViolinChart() {
  const [data, setData] = React.useState<PrepPoint[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/prep-times')
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

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const violinSeries = sizes.map((size) => ({
    type: 'violin',
    name: size,
    y: data.filter((d) => d.pizza_size === size).map((d) => d.t_prep),
    box: { visible: true },
    meanline: { visible: true },
    line: { color: 'purple' },
  }));

  return (
    <Box sx={{ width: '100%', height: 500 }}>
      <Plot
        data={violinSeries}
        layout={{
          title: 'Distribución del tiempo por tamaño de pizza',
          yaxis: { title: 'Minutos de preparación' },
          xaxis: { title: 'Tamaño' },
          width: 800,
          height: 500,
          margin: { t: 50, l: 50, r: 30, b: 80 },
        }}
        config={{ responsive: true }}
      />
    </Box>
  );
}
