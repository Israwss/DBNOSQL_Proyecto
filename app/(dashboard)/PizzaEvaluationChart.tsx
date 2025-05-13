'use client';

import * as React from 'react';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { ChartsLabelCustomMarkProps } from '@mui/x-charts/ChartsLabel';
import { Box, CircularProgress, Typography } from '@mui/material';
import { ScatterMarkerProps } from '@mui/x-charts/ScatterChart';



interface PizzaEvaluacion {
  pizza_name: string;
  total_unidades: number;
  precio_promedio: number;
  estrategia: 'Mantener' | 'Promocionar' | 'Ajustar precio' | 'Descontinuar';
}

const coloresEstrategia: Record<string, string> = {
  Mantener: '#4caf50',
  Promocionar: '#2196f3',
  'Ajustar precio': '#ff9800',
  Descontinuar: '#f44336',
};

// SVG paths
const star = 'M0,-7.528L1.69,-2.326L7.16,-2.326L2.735,0.889L4.425,6.09L0,2.875L-4.425,6.09L-2.735,0.889L-7.16,-2.326L-1.69,-2.326Z';
const diamond = 'M0,-7.423L4.285,0L0,7.423L-4.285,0Z';
const triangle = 'M0,-7L6,5H-6Z';

function StarLabelMark({ color, ...props }: ChartsLabelCustomMarkProps) {
  return (
    <svg viewBox="-8 -8 16 16">
      <path d={star} fill={color} {...props} />
    </svg>
  );
}

function DiamondLabelMark({ color, ...props }: ChartsLabelCustomMarkProps) {
  return (
    <svg viewBox="-8 -8 16 16">
      <path d={diamond} fill={color} {...props} />
    </svg>
  );
}

function TriangleLabelMark({ color, ...props }: ChartsLabelCustomMarkProps) {
  return (
    <svg viewBox="-8 -8 16 16">
      <path d={triangle} fill={color} {...props} />
    </svg>
  );
}


export default function PizzaEvaluationChart() {
  const [data, setData] = React.useState<PizzaEvaluacion[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/evaluacion-pizzas')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching pizza evaluation data:', err);
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
    return <Typography>No data available</Typography>;
  }

  const series = [
    {
      id: 'Mantener',
      label: 'Mantener',
      data: data
        .filter((item) => item.estrategia === 'Mantener')
        .map((item) => ({
          x: item.total_unidades,
          y: item.precio_promedio,
          id: item.pizza_name,
        })),
      color: coloresEstrategia['Mantener'],
      markerSize: 16, 
    },
    {
      id: 'Promocionar',
      label: 'Promocionar',
      data: data
        .filter((item) => item.estrategia === 'Promocionar')
        .map((item) => ({
          x: item.total_unidades,
          y: item.precio_promedio,
          id: item.pizza_name,
        })),
      color: coloresEstrategia['Promocionar'],
      labelMarkType: StarLabelMark,
      markerSize: 16, 
    },
    {
      id: 'Ajustar precio',
      label: 'Ajustar precio',
      data: data
        .filter((item) => item.estrategia === 'Ajustar precio')
        .map((item) => ({
          x: item.total_unidades,
          y: item.precio_promedio,
          id: item.pizza_name,
        })),
      color: coloresEstrategia['Ajustar precio'],
      labelMarkType: DiamondLabelMark,
      markerSize: 16, 
    },
    {
      id: 'Descontinuar',
      label: 'Descontinuar',
      data: data
        .filter((item) => item.estrategia === 'Descontinuar')
        .map((item) => ({
          x: item.total_unidades,
          y: item.precio_promedio,
          id: item.pizza_name,
        })),
      color: coloresEstrategia['Descontinuar'],
      labelMarkType: TriangleLabelMark,
      markerSize: 16, 
    },
  ];
  function CustomMarker({
  x,
  y,
  size,
  seriesId,
  isHighlighted,
  isFaded,
  color,
}: ScatterMarkerProps) {
  const pathMap: Record<string, string> = {
    Promocionar: star,
    'Ajustar precio': diamond,
    Descontinuar: triangle,
    Mantener: '', // círculo por defecto (no path)
  };

  const transform = `translate(${x}, ${y})`;
  const scale = (isHighlighted ? 1.2 : 1) * size;
  const shape = pathMap[seriesId as string];

  if (!shape) {
    // círculo por defecto
    return (
      <circle
        cx={x}
        cy={y}
        r={size / 2}
        fill={color}
        opacity={isFaded ? 0.3 : 1}
      />
    );
  }

  return (
    <g transform={transform} fill={color} opacity={isFaded ? 0.3 : 1}>
      <path d={shape} transform={`scale(${scale / 10})`} />
    </g>
  );
}


  return (
    <Box sx={{ width: '100%', height: 320 }}>
      <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
        Estrategia de Producto por Pizza
      </Typography>
      <ScatterChart
  series={series}
  xAxis={[{ label: 'Total unidades vendidas' }]}
  yAxis={[{ label: 'Precio promedio ($)' }]}
  height={400}
  margin={{ top: 40, right: 30, left: 70, bottom: 50 }}
  grid={{ horizontal: true, vertical: true }}
  slots={{ marker: CustomMarker }}
/>

    </Box>
  );
}
