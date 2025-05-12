'use client';

import * as React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import CustomDataGrid from '../../components/CustomDataGrid';

interface Pizza {
  id: number;
  pizza_id: string;
  pizza_size: string;
  pizza_category: string;
  pizza_ingredients: Record<string, string>; // Ej: { Cheese: "50g" }
  pizza_name: string;
}

export default function PizzasPage() {
  const [rows, setRows] = React.useState<Pizza[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/pizzas')
      .then((res) => res.json())
      .then((data) => {
        setRows(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching pizzas:', err);
        setLoading(false);
      });
  }, []);

  const columns = [
    { field: 'pizza_id', headerName: 'ID Pizza', width: 180 },
    { field: 'pizza_name', headerName: 'Nombre', flex: 1 },
    { field: 'pizza_size', headerName: 'Tamaño', width: 100 },
    { field: 'pizza_category', headerName: 'Categoría', width: 150 },
    {
      field: 'pizza_ingredients',
      headerName: 'Ingredientes',
      flex: 1.5,
      renderCell: (params: any) => {
        const ingredientes = params.value ? Object.keys(params.value) : [];
        return ingredientes.join(', ');
      },
    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (rows.length === 0) {
    return <Typography>No hay pizzas registradas.</Typography>;
  }

  return (
  <Box sx={{ flexGrow: 1, px: 3, pb: 8, overflow: 'hidden' }}>
    <Box sx={{ height: 'calc(100vh - 160px)', maxHeight: 700, width: '100%' }}>
      <CustomDataGrid rows={rows} columns={columns} pageSizeOptions={[8]}  initialState={{
    pagination: {
      paginationModel: {
        pageSize: 8,
        page: 0,
      },
    },
  }} />
    </Box>
  </Box>
);

}
