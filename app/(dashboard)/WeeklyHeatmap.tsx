'use client';

import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useTheme } from '@mui/material/styles';

// Cargar módulo de heatmap si aún no está
if (typeof Highcharts === 'object' && !Highcharts.Series.types.heatmap) {
  require('highcharts/modules/heatmap')(Highcharts);
}

// Días para el eje X
const weekdays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

// Tipos personalizados
type HeatmapPoint = {
  x: number;
  y: number;
  ventas: number;
};

type EnrichedPoint = HeatmapPoint & {
  value: number;
  recomendacion: number;
};

export default function WeeklyHeatmap() {
  const [chartOptions, setChartOptions] = useState<Highcharts.Options | null>(null);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data');
        const data = await res.json();

        const formattedData: HeatmapPoint[] = data.map((item: any) => {
          const day = item.dayOfWeek ?? ((item._id + 5) % 7);
          const ventas = item.total ?? 0;
          return { x: day, y: 0, ventas };
        });

        const maxVentas = Math.max(...formattedData.map((d: HeatmapPoint) => d.ventas));

        const dataWithExtras: EnrichedPoint[] = formattedData.map(({ x, y, ventas }: HeatmapPoint) => {
          const ganancia = (maxVentas - ventas) * 5;
          const recomendacion = ((maxVentas - ventas) / maxVentas) * 100;
          return { x, y, value: ganancia, ventas, recomendacion };
        });

        setChartOptions({
          chart: {
            type: 'heatmap',
            height: 400,
            backgroundColor: isDark ? '#121212' : '#FFFFFF',
            spacingTop: 60,
            spacingBottom: 60,
            spacingRight: 30,
          },
          title: {
            text: '¿Qué días son ideales para lanzar promociones?',
            align: 'center',
            style: {
              color: isDark ? '#FFFFFF' : '#000000',
              fontSize: '20px',
              fontWeight: 'bold',
            },
            y:10,
          },
          subtitle: {
            text: 'Se muestra el porcentaje de recomendación basado en ventas.',
            align: 'center',
            style: {
              color: isDark ? '#CCCCCC' : '#333333',
              fontSize: '13px',
              fontStyle: 'italic',
            },
            y: 50,
          },
          caption: {
            text: 'La escala de color indica las ganancias esperadas si se implementa una promoción en ese día.',
            style: {
              color: isDark ? '#BBBBBB' : '#444444',
              fontSize: '12px',
              fontStyle: 'italic',
            },
          },
          xAxis: {
            categories: weekdays,
            labels: {
              style: {
                color: isDark ? '#FFFFFF' : '#000000',
                fontWeight: 'bold',
              },
            },
          },
          yAxis: {
            categories: ['Ventas'],
            visible: false,
          },
          colorAxis: {
            min: 0,
            max: 15000,
            tickInterval: 5000,
            stops: [
              [0, isDark ? '#FFA07A' : '#FFB6B6'],
              [0.5, isDark ? '#FFDD94' : '#FFD700'],
              [1, isDark ? '#228B22' : '#2E8B57'],
            ],
            labels: {
              style: {
                color: isDark ? '#fff' : '#000',
              },
              formatter: function () {
                return `$${Number(this.value).toLocaleString()}`;
              },
            },
          },
          legend: {
            align: 'right',
            layout: 'vertical',
            verticalAlign: 'middle',
            symbolHeight: 160,
            itemStyle: { color: isDark ? '#FFFFFF' : '#000000' },
          },
          tooltip: {
            useHTML: true,
            backgroundColor: isDark ? '#333' : '#fff',
            style: { color: isDark ? '#fff' : '#000' },
            formatter: function () {
              const point = this.point as unknown as EnrichedPoint;
              const dia = weekdays[point.x];
              return `
                <div style="text-align:center;">
                  <b>${dia}</b><br/>
                  Recomendado para promoción: <b>${point.recomendacion.toFixed(1)}%</b><br/>
                  Ganancia potencial: <b>$${point.value.toLocaleString()}</b><br/>
                  Ventas: ${point.ventas.toLocaleString()}
                </div>
              `;
            },
          },
          series: [
            {
              name: 'Ganancia potencial',
              type: 'heatmap',
              data: dataWithExtras,
              borderWidth: 1,
              dataLabels: {
                enabled: true,
                formatter: function () {
                  const rec = (this.point as unknown as EnrichedPoint).recomendacion;
                  return `${rec.toFixed(0)}%`;
                },
                style: {
                  color: isDark ? '#FFFFFF' : '#000000',
                  fontSize: '14px',
                  fontWeight: 'bold',
                },
              },
            },
          ],
        });
      } catch (error) {
        console.error('❌ Error al cargar heatmap o datos:', error);
      }
    };

    fetchData();
  }, [theme.palette.mode]);

  if (!chartOptions) return <p style={{ padding: 20 }}>Cargando gráfico...</p>;

  return (
    <div style={{ width: '100%', margin: 'auto' }}>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
}
