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
  const [loadingIngredientes, setLoadingIngredientes] = React.useState(true);
  const [ingrediente, setIngrediente] = React.useState<string | null>(null);
  const [resultados, setResultados] = React.useState<Recomendacion[]>([]);
  const [loadingResultados, setLoadingResultados] = React.useState(false);

  React.useEffect(() => {
    fetch('/api/ingredientes/list')
      .then((res) => res.json())
      .then(setIngredientes)
      .finally(() => setLoadingIngredientes(false));
  }, []);

  const handleSeleccion = async (ing: string | null) => {
    setIngrediente(ing);
    if (!ing) return;
    setResultados([]);
    setLoadingResultados(true);

    try {
      const res = await fetch(`/api/ingredientes/recomendaciones?ingrediente=${encodeURIComponent(ing)}`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setResultados(data.map((item, i) => ({
          id: i + 1,
          combinacion: item.itemset.join(', '),
          promedio_ventas: parseFloat(item.promedio.toFixed(2)),
        })));
      }
    } catch (err) {
      console.error('Error al obtener recomendaciones:', err);
    } finally {
      setLoadingResultados(false);
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: '#', width: 50 },
    { field: 'combinacion', headerName: 'Combinación recomendada', width: 300 },
    { field: 'promedio_ventas', headerName: 'Ventas promedio ($)', width: 180 },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>
      {loadingIngredientes ? (
        <CircularProgress />
      ) : (
        <Autocomplete
          options={ingredientes}
          sx={{ width: 400, mt: 2 }}
          onChange={(_, value) => handleSeleccion(value)}
          renderInput={(params) => <TextField {...params} label="Elige un ingrediente" size="small" />}
          disableClearable
        />
      )}

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Combinaciones recomendadas y su promedio de ventas
        </Typography>

        <Box sx={{ height: 400 }}>
          {loadingResultados ? (
            <CircularProgress />
          ) : (
            <DataGrid
              rows={resultados}
              columns={columns}
              pageSizeOptions={[5, 10]}
              disableRowSelectionOnClick
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}
