'use client';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Exporting from 'highcharts/modules/exporting';
import ExportData from 'highcharts/modules/export-data';
import Accessibility from 'highcharts/modules/accessibility';
import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';

if (typeof Highcharts === 'object') {
  Exporting(Highcharts);
  ExportData(Highcharts);
  Accessibility(Highcharts);
}

export default function DayChart() {
  const [options, setOptions] = useState<any>(null);
  const weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const theme = useTheme();
  const isDark = theme?.palette?.mode === 'dark';

  useEffect(() => {
    fetch('/api/data/rawdata')
      .then((res) => res.json())
      .then((data) => {
        const ventas = Array(7).fill(0);
        const pizzas = Array(7).fill(0);

        data.forEach((d: any) => {
          if (!d.order_date || !d.total_price || !d.quantity) return;

          const day = new Date(d.order_date).getDay(); // 0=Domingo
          const i = (day + 6) % 7; // Lunes como 0

          const price = parseFloat(d.total_price);
          const qty = parseInt(d.quantity);

          if (!isNaN(price)) ventas[i] += price;
          if (!isNaN(qty)) pizzas[i] += qty;
        });

        setOptions({
          chart: {
            type: 'column',
            backgroundColor: 'transparent',
            style: {
              fontFamily: 'Arial'
            }
          },
          title: {
            text: 'Análisis Diario',
            style: {
              fontFamily: 'Arial Black',
              fontSize: '18px',
              color: isDark ? '#fff' : '#000'
            }
          },
          subtitle: {
            text: '',
            style: {
              fontFamily: 'Arial',
              fontSize: '14px',
              color: isDark ? '#ccc' : '#555'
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
              const idx = this.points?.[0]?.point.index ?? 0;
              const venta = ventas[idx].toFixed(2);
              const cantidad = pizzas[idx];
              return `<b>${this.x}</b><br/>💵 Ventas: $${venta}<br/>🍕 Pizzas: ${cantidad}`;
            },
            style: {
              fontFamily: 'Arial'
            }
          },
          plotOptions: {
            column: {
              dataLabels: {
                enabled: false, 
                format: '${y:,.2f}',
                style: {
                  fontFamily: 'Arial',
                  fontWeight: 'bold',
                  color: isDark ? '#fff' : '#000'
                }
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
          accessibility: {
            enabled: true
          }
        });
      });
  }, [isDark]);

  if (!options) return <p style={{ fontFamily: 'Arial' }}>Cargando gráfico por día...</p>;
  return <HighchartsReact highcharts={Highcharts} options={options} />;
}

