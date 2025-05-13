'use client';

import React, { useEffect, useState, useRef } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMore from 'highcharts/highcharts-more';
import { useTheme } from '@mui/material/styles';

if (typeof Highcharts === 'object') {
  HighchartsMore(Highcharts);
  Highcharts.setOptions({
    lang: {
      months: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
      shortMonths: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
      weekdays: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
    }
  });
}

export default function SalesForecastChart() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [options, setOptions] = useState<Highcharts.Options | null>(null);
  const [chartKey, setChartKey] = useState('light');
  const visibilityRef = useRef<{ [key: string]: boolean }>({});

  const calcularPromedioMovil = (datos: [number, number][], ventana: number): [number, number][] =>
    datos.map((_, i) => {
      const start = Math.max(0, i - ventana + 1);
      const valores = datos.slice(start, i + 1).map(p => p[1]);
      const promedio = valores.reduce((a, b) => a + b, 0) / valores.length;
      return [datos[i][0], parseFloat(promedio.toFixed(2))];
    });

  const calcularTendencia = (datos: [number, number][]): [number, number][] => {
    const n = datos.length;
    const sumX = datos.reduce((acc, _, i) => acc + i, 0);
    const sumY = datos.reduce((acc, d) => acc + d[1], 0);
    const sumXY = datos.reduce((acc, d, i) => acc + i * d[1], 0);
    const sumX2 = datos.reduce((acc, _, i) => acc + i * i, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    return datos.map((_, i) => [datos[i][0], parseFloat((slope * i + intercept).toFixed(2))]);
  };

  useEffect(() => {
    const fetchData = async () => {
      const resHist = await fetch('/api/sales/prediction');
      const rawHist = await resHist.json();
      const resForecast = await fetch('/api/sales/forecast');
      const rawForecast = await resForecast.json();

      const data: [number, number][] = rawHist.map((d: any) => [new Date(d._id).getTime(), d.total]);
      const mediaMovil = calcularPromedioMovil(data, 7);
      const tendencia = calcularTendencia(data);
      const prediccion: [number, number][] = rawForecast.map((d: any) => [new Date(d.date).getTime(), d.mean]);
      const intervalo: [number, number, number][] = rawForecast.map((d: any) => [new Date(d.date).getTime(), d.min, d.max]);

      Highcharts.charts.forEach(chart => {
        chart?.series.forEach(s => {
          visibilityRef.current[s.name] = s.visible;
        });
      });

      setOptions({
        chart: {
          height: 420,
          zooming: { type: 'x' },
          backgroundColor: isDark ? '#121212' : '#FFFFFF',
          animation: true,
          spacingBottom: 40,
        },
        title: { text: '' },
        xAxis: {
          type: 'datetime',
          tickInterval: 1000 * 60 * 60 * 24 * 90, // cada 3 meses
          labels: {
            format: '{value:%b %Y}',
            style: {
              color: isDark ? '#fff' : '#000',
              fontWeight: 'bold',
            },
          },
        },
        yAxis: {
          title: {
            text: 'Ventas diarias',
            style: {
              color: isDark ? '#fff' : '#000',
              fontWeight: 'bold',
            },
          },
          labels: {
            style: {
              color: isDark ? '#fff' : '#000',
              fontWeight: 'bold',
            },
          },
        },
        tooltip: {
          shared: true,
          useHTML: true,
          backgroundColor: isDark ? '#333' : '#fff',
          style: { color: isDark ? '#fff' : '#000' },
          formatter: function () {
            const points = this.points || [];
            let tooltip = `<b>${Highcharts.dateFormat('%e de %B de %Y', this.x as number)}</b><br/>`;
            points.forEach(p => {
              tooltip += `<span style="color:${p.color}">●</span> ${p.series.name}: <b>${p.y?.toLocaleString()} pizzas</b><br/>`;
            });
            return tooltip;
          },
        },
        plotOptions: {
          series: {
            animation: { duration: 600, easing: 'easeOutQuad' },
            marker: { enabled: false },
            dataLabels: { enabled: false },
          },
        },
        series: [
          {
            name: 'Ventas',
            type: 'line',
            data,
            color: isDark ? '#90caf9' : '#1976d2',
            lineWidth: 2,
          },
          {
            name: 'Promedio móvil (7 días)',
            type: 'line',
            data: mediaMovil,
            visible: visibilityRef.current['Promedio móvil (7 días)'] ?? false,
            color: isDark ? '#00E676' : '#1B5E20',
            lineWidth: 4,
            shadow: {
              color: isDark ? '#000' : '#fff',
              width: 1,
            },
          },
          {
            name: 'Tendencia',
            type: 'line',
            data: tendencia,
            visible: visibilityRef.current['Tendencia'] ?? false,
            color: isDark ? '#FF7043' : '#BF360C',
            dashStyle: 'Dash',
            lineWidth: 4,
            shadow: {
              color: isDark ? '#000' : '#999',
              width: 1,
            },
          },
          {
            name: 'Predicción de ventas',
            type: 'line',
            data: prediccion,
            color: isDark ? '#FFEB3B' : '#F9A825',
            dashStyle: 'ShortDash',
            lineWidth: 3,
          },
          {
            name: 'Intervalo de confianza',
            type: 'arearange',
            data: intervalo,
            linkedTo: ':previous',
            color: isDark ? 'rgba(255, 235, 59, 0.15)' : 'rgba(255, 193, 7, 0.2)',
            fillOpacity: 1,
            lineWidth: 0.1,
            zIndex: 0,
            marker: { enabled: false },
          },
        ],
        legend: {
          itemStyle: {
            color: isDark ? '#fff' : '#000',
            fontWeight: 'bold',
          },
        },
        navigator: {
          enabled: true,
          xAxis: {
            labels: {
              format: '{value:%b \'%y}',
              style: { color: isDark ? '#fff' : '#000' },
            },
          },
        },
        scrollbar: { enabled: true },
        rangeSelector: { enabled: false },
      });

      setChartKey(isDark ? 'dark' : 'light');
    };

    fetchData();
  }, [theme.palette.mode]);

  if (!options) return <p style={{ padding: 20 }}>Cargando gráfico...</p>;

  return (
     <div style={{ 
      width: '100%', 
      height: '500px', // Altura responsiva (puedes usar vh o porcentajes)
      minHeight: '400px', // Altura mínima
      margin: 'auto',
      position: 'relative' // Importante para el contenedor Highcharts
    }}>
      <HighchartsReact 
        key={chartKey} 
        highcharts={Highcharts} 
        options={options}
        containerProps={{
          style: {
            width: '100%',
            height: '100%'
          }
        }}
      />
    </div>
  );
}
