'use client';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useState } from 'react';

export default function SeasonChart() {
  const [options, setOptions] = useState<any>(null);

  useEffect(() => {
    fetch('/api/data/rawdata')
      .then((res) => res.json())
      .then((data) => {
        const salesByQuarter: Record<string, number> = {};

        data.forEach((d: any) => {
          const date = new Date(d.order_date);
          if (isNaN(date.getTime()) || date.getFullYear() < 2015) return;

          const year = date.getFullYear();
          const month = date.getMonth();
          const quarter = Math.floor(month / 3) + 1;
          const key = `${quarter} ${year}`;

          const price = parseFloat(d.total_price);
          if (!isNaN(price)) {
            salesByQuarter[key] = (salesByQuarter[key] || 0) + price;
          }
        });

        const categories = Object.keys(salesByQuarter).sort((a, b) => {
          const [qa, ya] = a.split(' ');
          const [qb, yb] = b.split(' ');
          return parseInt(ya) === parseInt(yb)
            ? parseInt(qa) - parseInt(qb)
            : parseInt(ya) - parseInt(yb);
        });

        const values = categories.map((key) => salesByQuarter[key]);

        setOptions({
          chart: {
            type: 'column',
            backgroundColor: 'transparent',
            style: { fontFamily: 'Arial' }
          },
          title: {
            text: 'Estacionalidad',
            style: {
              fontFamily: 'Arial Black',
              fontSize: '18px',
              color: '#000'
            }
          },
          xAxis: {
            categories,
            labels: {
              style: {
                fontSize: '13px',
                fontFamily: 'Arial',
                color: '#000'
              }
            }
          },
          yAxis: {
            title: {
              text: 'Total de ventas',
              style: { fontFamily: 'Arial', color: '#000' }
            },
            labels: {
              formatter: function () {
                return `$${(this.value / 1000).toFixed(0)}k`;
              },
              style: { fontFamily: 'Arial', color: '#000' }
            }
          },
          tooltip: {
            valuePrefix: '$',
            valueDecimals: 2,
            style: { fontFamily: 'Arial' }
          },
          legend: {
            enabled: true,
            itemStyle: {
              fontFamily: 'Arial',
              fontWeight: 'bold',
              color: '#000'
            }
          },
          series: [
            {
              name: 'Ventas',
              data: values,
              color: '#2196F3'
            }
          ],
          credits: { enabled: false }
        });
      });
  }, []);

  if (!options) return <p style={{ fontFamily: 'Arial' }}>Cargando gráfico de temporadas...</p>;
  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
