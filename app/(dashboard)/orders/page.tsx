'use client';

import * as React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import CustomDataGrid from '../../components/CustomDataGrid';

interface Order {
  order_details_id: number;
  order_id: number;
  pizza_id: string;
  quantity: number;
  order_date: string;
  order_time: string;
  unit_price: number;
  total_price: number;
  customer_id: string;
  t_prep: number;
}

export default function OrdersPage() {
  const [rows, setRows] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        setRows(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching orders:', err);
        setLoading(false);
      });
  }, []);

  const columns = [
    { field: 'order_details_id', headerName: 'ID Detalle', width: 100 },
    { field: 'order_id', headerName: 'ID Orden', width: 100 },
    { field: 'pizza_id', headerName: 'ID Pizza', width: 150 },
    { field: 'quantity', headerName: 'Cantidad', width: 100 },
    { field: 'order_date', headerName: 'Fecha', width: 120 },
    { field: 'order_time', headerName: 'Hora', width: 100 },
    { field: 'unit_price', headerName: 'Precio Unitario', width: 130,  valueFormatter: ({ value }) => typeof value === 'number' ? `$${value.toFixed(2)}` : '—' },
    { field: 'total_price', headerName: 'Precio Total', width: 130,  valueFormatter: ({ value }) => typeof value === 'number' ? `$${value.toFixed(2)}` : '—' },
    { field: 'customer_id', headerName: 'ID Cliente', width: 120 },
    { field: 't_prep', headerName: 'Tiempo Prep (min)', width: 150 },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (rows.length === 0) {
    return <Typography>No hay datos disponibles.</Typography>;
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
  }}/>
    </Box>
  </Box>
);

}
