'use client';

import * as React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import CustomDataGrid from '../../components/CustomDataGrid';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from 'next/link';

interface Pizza {
  id: number;
  pizza_id: string;
  pizza_size: string;
  pizza_category: string;
  pizza_ingredients: Record<string, string>;
  pizza_name: string;
}

export default function PizzasPage() {
  const [rows, setRows] = React.useState<Pizza[]>([]);
  const [totalRows, setTotalRows] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 8,
  });

  const fetchPizzas = React.useCallback(() => {
    const { page, pageSize } = paginationModel;
    setLoading(true);

    fetch(`/api/pizzas?skip=${page * pageSize}&limit=${pageSize}`)
      .then((res) => res.json())
      .then((json) => {
        setRows(json.data);
        setTotalRows(json.total);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching pizzas:', err);
        setLoading(false);
      });
  }, [paginationModel]);

  React.useEffect(() => {
    fetchPizzas();
  }, [fetchPizzas]);

  const handlePaginationChange = (newModel: typeof paginationModel) => {
    setPaginationModel(newModel);
  };

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

  if (loading && rows.length === 0) {
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
      <Breadcrumbs>
        <Link href="/">Dashboard</Link>
        <Typography>Pizzas</Typography>
      </Breadcrumbs>
      <Typography variant="h4">Pizzas</Typography>
      <Box sx={{ height: 'calc(100vh - 160px)', maxHeight: 700, width: '100%' }}>
        <CustomDataGrid
          rows={rows}
          columns={columns}
          rowCount={totalRows}
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationChange}
          pageSizeOptions={[8]}
        />
      </Box>
    </Box>
  );
}
