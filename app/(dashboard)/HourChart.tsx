'use client';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMore from 'highcharts/highcharts-more';
import { useEffect, useState } from 'react';

if (typeof Highcharts === 'object') {
  HighchartsMore(Highcharts);
}

export default function HourChart() {
  const [options, setOptions] = useState<any>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [mall, setMall] = useState<string>('all');
  const [mallsDisponibles, setMallsDisponibles] = useState<string[]>([]);
  const [totalVentas, setTotalVentas] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!startDate || !endDate) return;

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    if (start > end) {
      setError('⚠️ La fecha de fin no puede ser anterior a la de inicio.');
      setOptions(null);
      return;
    } else {
      setError(null);
    }

    fetch(`/api/data/rawdata?start=${startDate}&end=${endDate}&mall=${mall}`)
      .then((res) => res.json())
      .then(({ data, malls }) => {
        const horas = Array(24).fill(0);
        const cantidades = Array(24).fill(0);
        let total = 0;

        data.forEach((item: any) => {
          const hour = item.hour;
          horas[hour] = item.ventas;
          cantidades[hour] = item.pizzas;
          total += item.ventas;
        });

        setTotalVentas(total);
        setMallsDisponibles(malls);

        setOptions({
          chart: {
            polar: true,
            type: 'column',
            backgroundColor: 'transparent',
            animation: true,
            style: { fontFamily: 'Arial' }
          },
          title: { text: '' },
          xAxis: {
            categories: Array.from({ length: 24 }, (_, i) => `${i}:00`),
            tickmarkPlacement: 'on',
            lineWidth: 1,
            labels: {
              style: {
                fontSize: '14px',
                color: '#000000',
                fontFamily: 'Arial Black'
              }
            }
          },
          yAxis: {
            gridLineInterpolation: 'polygon',
            min: 0,
            labels: { enabled: false },
            title: { text: null }
          },
          tooltip: {
            shared: true,
            formatter: function () {
              const idx = this.points?.[0]?.point.index ?? 0;
              const hora = this.x;
              const venta = this.points?.find(p => p.series.name === 'Ventas por hora')?.y?.toFixed(2) ?? '0';
              const cantidad = cantidades[idx];
              return `<b>${hora}</b><br/>💵 Ventas: $${venta}<br/>🍕 Pizzas: ${cantidad}`;
            }
          },
          legend: {
            enabled: true,
            itemStyle: {
              fontFamily: 'Arial Black',
              fontSize: '13px'
            }
          },
          series: [
            {
              name: 'Ventas por hora',
              data: horas,
              pointPlacement: 'on',
              color: '#F57C00',
              zIndex: 1
            },
            {
              name: 'Pizzas por hora',
              data: cantidades,
              pointPlacement: 'on',
              color: '#0277BD',
              zIndex: 0,
              pointPadding: 0.2
            }
          ],
          credits: { enabled: false }
        });
      });
  }, [startDate, endDate, mall]);

  return (
    <div style={{ fontFamily: 'Arial', maxWidth: 800, margin: '0 auto' }}>
      <h2 style={{ fontFamily: 'Arial Black', fontSize: '1.5rem', marginBottom: '1rem' }}>
        Ventas por Hora
      </h2>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
        <label>
          <span style={{ fontWeight: 'bold' }}>Inicio:</span><br />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ padding: '6px', borderRadius: '8px', border: '1px solid #ccc' }}
          />
        </label>

        <label>
          <span style={{ fontWeight: 'bold' }}>Fin:</span><br />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ padding: '6px', borderRadius: '8px', border: '1px solid #ccc' }}
          />
        </label>

        <label>
          <span style={{ fontWeight: 'bold' }}>Sucursal:</span><br />
          <select
            value={mall}
            onChange={(e) => setMall(e.target.value)}
            style={{
              padding: '6px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              backgroundColor: '#fff'
            }}
          >
            <option value="all">Todas</option>
            {mallsDisponibles.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </label>
      </div>

      {error && (
        <p style={{ color: '#d32f2f', fontWeight: 'bold', marginBottom: '1rem' }}>{error}</p>
      )}

      <div style={{ fontFamily: 'Arial Black', fontSize: '1.2rem', color: '#2e7d32', marginBottom: '1rem' }}>
        Total vendido: ${totalVentas.toFixed(2)}
      </div>

      {options ? (
        <HighchartsReact highcharts={Highcharts} options={options} />
      ) : !error ? (
        <p>Selecciona un rango de fechas para ver el gráfico.</p>
      ) : null}
    </div>
  );
}
