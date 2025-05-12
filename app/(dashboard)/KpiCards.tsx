'use client';

import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const StatCard = ({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle: string;
}) => {
  return (
    <Card
      sx={{
        borderTop: '6px solid #F28C28',
        boxShadow: 3,
        borderRadius: 2,
        height: '100%',
        display: 'flex',
        alignItems: 'center',     // ✅ centra vertical
        justifyContent: 'center', // ✅ centra horizontal
        textAlign: 'center',
        transition: 'all 0.3s',
        '&:hover': {
          boxShadow: 6,
          transform: 'scale(1.02)',
        },
      }}
    >
      <CardContent>
        <Typography variant="h6" component="h3" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" fontWeight="bold">
          {value}
        </Typography>
        <Typography color="text.secondary">{subtitle}</Typography>
      </CardContent>
    </Card>
  );
};

type KPIs = {
  ingresoAnual: number;
  ingresoDiario: number;
  pizzasVendidas: number;
  precioPromedio: number;
};

export default function KpiCards() {
  const [data, setData] = useState<KPIs | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/kpis');
      const json = await res.json();
      setData(json);
    };
    fetchData();
  }, []);

  if (!data) return <Box sx={{ p: 2 }}>Cargando KPIs...</Box>;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Ingresos Anuales"
          value={`$${data.ingresoAnual.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          subtitle="Total en 2015"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Ingreso Diario Promedio"
          value={`$${data.ingresoDiario.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          subtitle="Promedio por día"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Pizzas Vendidas"
          value={data.pizzasVendidas.toLocaleString()}
          subtitle="Acumulado anual"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Precio Promedio por Pizza"
          value={`$${data.precioPromedio.toFixed(2)}`}
          subtitle="Ticket promedio"
        />
      </Grid>
    </Grid>
  );
}
