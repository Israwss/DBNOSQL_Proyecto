'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { Box, CircularProgress, Typography, useTheme } from '@mui/material';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface PrepPoint {
  pizza_size: string;
  t_prep: number;
}

export default function PizzaSizeViolinChart() {
  const [data, setData] = React.useState<PrepPoint[]>([]);
  const [loading, setLoading] = React.useState(true);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const textColor = isDark ? '#fff' : '#000';
  const fontFamily = 'Arial';

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

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

  const violinSeries = React.useMemo(() => {
    const grouped: Record<string, number[]> = {};

    for (const { pizza_size, t_prep } of data) {
      if (!grouped[pizza_size]) {
        grouped[pizza_size] = [];
      }
      grouped[pizza_size].push(t_prep);
    }

    return sizes
      .filter((size) => grouped[size]?.length)
      .map((size) => ({
        type: 'violin',
        name: size,
        y: grouped[size],
        box: { visible: true },
        meanline: { visible: true },
        line: { color: '#FFC067' },
        marker: { color: '#FFC067' },
        fillcolor: isDark ? 'rgba(255, 192, 103, 0.4)' : 'rgba(255, 192, 103, 0.6)',
      }));
  }, [data, isDark]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (data.length === 0) {
    return <Typography>No hay datos disponibles.</Typography>;
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Typography
        variant="h6"
        sx={{
          textAlign: 'center',
          mb: 2,
          color: textColor,
          fontFamily: 'Arial Black',
          fontSize: '18px',
        }}
      >
        Distribución del tiempo por tamaño de pizza
      </Typography>
      <Box sx={{ height: 500, width: '100%' }}>
        <Plot
          data={violinSeries}
          layout={{
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'transparent',
            autoaxis: true,
            yaxis: {
              title: 'Minutos de preparación',
              color: textColor,
              gridcolor: isDark ? '#555' : '#eee',
              titlefont: { family: fontFamily, size: 14, color: textColor },
              tickfont: { family: fontFamily, size: 12, color: textColor },
            },
            xaxis: {
              title: 'Tamaño',
              color: textColor,
              gridcolor: isDark ? '#555' : '#eee',
              titlefont: { family: fontFamily, size: 14, color: textColor },
              tickfont: { family: fontFamily, size: 12, color: textColor },
            },
            height: 500,
            margin: { t: 30, l: 50, r: 30, b: 80 },
            font: { family: fontFamily, color: textColor },
            title: {
              font: { family: 'Arial Black', size: 18, color: textColor },
              x: 0.5,
            },
          }}
          config={{ responsive: true }}
           style={{ width: '100%' }}
        />
      </Box>
    </Box>
  );
}
