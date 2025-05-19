'use client';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useState } from 'react';

interface SeasonalSale {
  quarter: number;
  year: number;
  total_sales: number;
}

export default function SeasonChart() {
  const [options, setOptions] = useState<any>(null);

  useEffect(() => {
    fetch('/api/data/season')

      .then((res) => res.json())
      .then((data: SeasonalSale[]) => {
        const categories = data.map(
          ({ quarter, year }) => `Q${quarter} ${year}`
        );
        const values = data.map((d) => d.total_sales);

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
