'use client';

import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Exporting from 'highcharts/modules/exporting';
import ExportData from 'highcharts/modules/export-data';
import Accessibility from 'highcharts/modules/accessibility';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

if (typeof Highcharts === 'object') {
  Exporting(Highcharts);
  ExportData(Highcharts);
  Accessibility(Highcharts);
}

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

const formasEstrategia: Record<string, string> = {
  Mantener: 'circle',
  Promocionar: 'star',
  'Ajustar precio': 'diamond',
  Descontinuar: 'triangle',
};

export default function PizzaEvaluationHighcharts() {
  const [data, setData] = useState<PizzaEvaluacion[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  useEffect(() => {
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

  const series = ['Mantener', 'Promocionar', 'Ajustar precio', 'Descontinuar'].map(
    (estrategia) => ({
      name: estrategia,
      color: coloresEstrategia[estrategia],
      marker: {
        symbol: formasEstrategia[estrategia],
      },
      data: data
        .filter((item) => item.estrategia === estrategia)
        .map((item) => ({
          x: item.total_unidades,
          y: item.precio_promedio,
          name: item.pizza_name,
        })),
    })
  );

  const options: Highcharts.Options = {
    chart: {
      type: 'scatter',
      zoomType: 'xy',
      backgroundColor: isDark ? '#121212' : 'transparent',
      style: {
        fontFamily: 'Arial',
      },
      height: 420,
    },
    title: {
      text: 'Estrategia de Producto por Pizza',
      style: {
        fontSize: '18px',
        fontFamily: 'Arial Black',
        color: isDark ? '#fff' : '#000',
      },
    },
    xAxis: {
      title: {
        text: 'Total unidades vendidas',
        style: {
          fontSize: '14px',
          fontWeight: 'bold',
          fontFamily: 'Arial Black',
          color: isDark ? '#fff' : '#000',
        },
      },
      labels: {
        style: {
          color: isDark ? '#ccc' : '#333',
        },
      },
      gridLineColor: isDark ? '#444' : '#eee',
      lineColor: isDark ? '#888' : '#ccc',
    },
    yAxis: {
      title: {
        text: 'Precio promedio ($)',
        style: {
          fontSize: '14px',
          fontWeight: 'bold',
          fontFamily: 'Arial Black',
          color: isDark ? '#fff' : '#000',
        },
      },
      labels: {
        style: {
          color: isDark ? '#ccc' : '#333',
        },
      },
      gridLineColor: isDark ? '#444' : '#eee',
      lineColor: isDark ? '#888' : '#ccc',
    },
    tooltip: {
      useHTML: true,
      backgroundColor: isDark ? '#333' : '#fff',
      borderColor: isDark ? '#888' : '#ccc',
      style: {
        color: isDark ? '#fff' : '#000',
        fontFamily: 'Arial',
      },
      formatter: function () {
        return `
          <strong>${this.point.name}</strong><br/>
          Estrategia: <strong>${this.series.name}</strong><br/>
          Total unidades vendidas: <strong>${this.point.x}</strong><br/>
          Precio promedio: <strong>$${this.point.y.toFixed(2)}</strong>
        `;
      },
    },
    legend: {
      itemStyle: {
        color: isDark ? '#fff' : '#000',
      },
    },
    plotOptions: {
      scatter: {
        marker: {
          radius: 6,
          lineWidth: 1,
        },
        states: {
          hover: {
            enabled: true,
            lineWidth: 2,
          },
        },
      },
    },
    series,
    credits: { enabled: false },
    exporting: {
      enabled: true,
      buttons: {
        contextButton: {
          symbolStroke: isDark ? '#ccc' : '#000',
          theme: {
            fill: isDark ? '#222' : '#f7f7f7',
            stroke: 'none',
            states: {
              hover: {
                fill: isDark ? '#333' : '#e6e6e6',
              },
              select: {
                fill: isDark ? '#444' : '#d0d0d0',
              },
            },
          },
        },
      },
    },
    accessibility: {
      enabled: true,
    },
  };

  return (
    <Box sx={{ width: '100%' }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </Box>
  );
}
