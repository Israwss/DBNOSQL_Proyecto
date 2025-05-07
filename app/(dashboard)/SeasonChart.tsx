'use client';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useState } from 'react';

export default function SeasonChart() {
  const [options, setOptions] = useState<any>(null);

  useEffect(() => {
    fetch('/api/data')
      .then((res) => res.json())
      .then((data) => {
        const salesByDate: Record<string, number> = {};

        data.forEach((d: any) => {
          salesByDate[d.date] = (salesByDate[d.date] || 0) + d.totalSales;
        });

        const categories = Object.keys(salesByDate).sort();
        const values = categories.map(date => salesByDate[date]);

        setOptions({
          title: { text: 'Ventas por fecha' },
          xAxis: { categories },
          yAxis: { title: { text: 'Total de ventas' } },
          series: [{ name: 'Ventas', data: values }],
          chart: { type: 'line' }
        });
      });
  }, []);

  if (!options) return <p>Cargando gráfico de temporadas...</p>;
  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
