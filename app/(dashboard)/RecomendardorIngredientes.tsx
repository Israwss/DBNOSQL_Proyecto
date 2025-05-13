'use client';

import * as React from 'react';
import { Box, TextField, CircularProgress, Typography } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface Recomendacion {
  id: number;
  combinacion: string;
  promedio_ventas: number;
}

export default function RecomendadorIngredientes() {
  const [ingredientes, setIngredientes] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [ingrediente, setIngrediente] = React.useState<string | null>(null);
  const [resultados, setResultados] = React.useState<Recomendacion[]>([]);

  React.useEffect(() => {
    fetch('/api/ingredientes/list')
      .then((res) => res.json())
      .then(setIngredientes)
      .finally(() => setLoading(false));
  }, []);

  const handleSeleccion = async (ing: string | null) => {
    setIngrediente(ing);
    if (!ing) return;
    setResultados([]);

    try {
      const res = await fetch(`/api/ingredientes/recomendaciones?ingrediente=${encodeURIComponent(ing)}`);
      if (!res.ok) {
        console.error('API error:', res.statusText);
        return;
      }

      const data = await res.json();
      if (!Array.isArray(data)) {
        console.error('Respuesta inesperada del servidor:', data);
        return;
      }

      setResultados(
        data.map((item: any, i: number) => ({
          id: i + 1,
          combinacion: item.itemset.join(', '),
          promedio_ventas: parseFloat(item.promedio.toFixed(2)),
        }))
      );
    } catch (err) {
      console.error('Error al obtener recomendaciones:', err);
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: '#', width: 50 },
    { field: 'combinacion', headerName: 'Combinación recomendada', width: 300 },
    { field: 'promedio_ventas', headerName: 'Ventas promedio ($)', width: 180 },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>
      {loading ? (
        <CircularProgress />
      ) : (
        <Autocomplete
          options={ingredientes}
          sx={{ width: 400, mt: 2 }}
          onChange={(_, value) => handleSeleccion(value)}
          renderInput={(params) => <TextField {...params} label="Elige un ingrediente" />}
        />
      )}

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Combinaciones recomendadas y su promedio de ventas
        </Typography>
        <Box sx={{ height: 400 }}>
          <DataGrid
            rows={resultados}
            columns={columns}
            pageSizeOptions={[5, 10]}
            disableRowSelectionOnClick
          />
        </Box>
      </Box>
    </Box>
  );
}
