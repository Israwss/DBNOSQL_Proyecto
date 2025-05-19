'use client';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Exporting from 'highcharts/modules/exporting';
import ExportData from 'highcharts/modules/export-data';
import Accessibility from 'highcharts/modules/accessibility';
import { useEffect, useState, useMemo } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

if (typeof Highcharts === 'object') {
  Exporting(Highcharts);
  ExportData(Highcharts);
  Accessibility(Highcharts);
}

const weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export default function DayChart() {
  const [data, setData] = useState<{ day: number; ventas: number; pizzas: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isDark = theme?.palette?.mode === 'dark';

  useEffect(() => {
    fetch('/api/data/dia')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching daily data:', err);
        setLoading(false);
      });
  }, []);

  const options = useMemo(() => {
    if (!data.length) return null;

    const ventas = Array(7).fill(0);
    const pizzas = Array(7).fill(0);

    data.forEach(({ day, ventas: v, pizzas: p }) => {
      ventas[day] = v;
      pizzas[day] = p;
    });

    return {
      chart: {
        type: 'column',
        backgroundColor: 'transparent',
        style: { fontFamily: 'Arial' }
      },
      title: {
        text: 'Análisis Diario',
        style: {
          fontFamily: 'Arial Black',
          fontSize: '18px',
          color: isDark ? '#fff' : '#000'
        }
      },
      xAxis: {
        categories: weekDays,
        labels: {
          style: {
            fontSize: '14px',
            fontWeight: 'bold',
            color: isDark ? '#dddddd' : '#333',
            fontFamily: 'Arial Black'
          }
        }
      },
      yAxis: {
        title: {
          text: 'Total de ventas / pizzas',
          style: {
            fontWeight: 'bold',
            fontFamily: 'Arial Black',
            color: isDark ? '#fff' : '#000'
          }
        },
        labels: {
          style: {
            color: isDark ? '#cccccc' : '#000',
            fontWeight: 'bold',
            fontFamily: 'Arial'
          }
        }
      },
      tooltip: {
        shared: true,
        formatter: function () {
          const i = this.points?.[0]?.point.index ?? 0;
          return `<b>${weekDays[i]}</b><br/>💵 Ventas: $${ventas[i].toFixed(2)}<br/>🍕 Pizzas: ${pizzas[i]}`;
        },
        style: {
          fontFamily: 'Arial'
        },
        backgroundColor: isDark ? '#333' : '#fff',
        borderColor: isDark ? '#aaa' : '#444'
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: false
          },
          borderRadius: 3,
          groupPadding: 0.15
        },
        series: {
          states: {
            hover: {
              enabled: true,
              brightness: 0.1
            }
          }
        }
      },
      legend: {
        enabled: true,
        itemStyle: {
          fontWeight: 'bold',
          fontFamily: 'Arial',
          color: isDark ? '#eee' : '#333'
        }
      },
      series: [
        {
          name: 'Ventas ($)',
          data: ventas,
          color: '#F57C00'
        },
        {
          name: 'Pizzas vendidas',
          data: pizzas,
          color: '#0277BD'
        }
      ],
      exporting: {
        enabled: true,
        buttons: {
          contextButton: {
            symbolStroke: isDark ? '#ccc' : '#000',
            menuItems: ['downloadPNG', 'downloadPDF', 'downloadCSV']
          }
        }
      },
      credits: { enabled: false },
      accessibility: { enabled: true }
    };
  }, [data, isDark]);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>;
  }

  if (!options) {
    return <Typography>No hay datos disponibles.</Typography>;
  }

  return (
    <Box sx={{ width: '100%' }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </Box>
  );
}
