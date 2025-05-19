'use client';

import * as React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import CustomDataGrid from '../../components/CustomDataGrid';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from 'next/link';

interface Order {
  id: number;
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
  const [rowCount, setRowCount] = React.useState(0);
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(8);

  const fetchData = React.useCallback(() => {
    setLoading(true);
    fetch(`/api/orders?page=${page}&pageSize=${pageSize}`)
      .then((res) => res.json())
      .then(({ data, totalCount }) => {
        setRows(data);
        setRowCount(totalCount);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching orders:', err);
        setLoading(false);
      });
  }, [page, pageSize]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns = [
    { field: 'order_details_id', headerName: 'ID Detalle', width: 100 },
    { field: 'order_id', headerName: 'ID Orden', width: 100 },
    { field: 'pizza_id', headerName: 'ID Pizza', width: 150 },
    { field: 'quantity', headerName: 'Cantidad', width: 100 },
    { field: 'order_date', headerName: 'Fecha', width: 120 },
    { field: 'order_time', headerName: 'Hora', width: 100 },
    {
      field: 'unit_price',
      headerName: 'Precio Unitario',
      width: 130,
      valueFormatter: ({ value }) =>
        typeof value === 'number' ? `$${value.toFixed(2)}` : '—'
    },
    {
      field: 'total_price',
      headerName: 'Precio Total',
      width: 130,
      valueFormatter: ({ value }) =>
        typeof value === 'number' ? `$${value.toFixed(2)}` : '—'
    },
    { field: 'customer_id', headerName: 'ID Cliente', width: 120 },
    { field: 't_prep', headerName: 'Tiempo Prep (min)', width: 150 }
  ];

  if (loading && rows.length === 0) {
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
       <div>
      <Breadcrumbs>
        <Link href="/">Dashboard</Link>
        <Typography>Ordenes</Typography>
      </Breadcrumbs>
      <Typography variant="h4">Ordenes</Typography>
    </div>
      <Box sx={{ height: 'calc(100vh - 160px)', maxHeight: 700, width: '100%' }}>
        <CustomDataGrid
          rows={rows}
          columns={columns}
          pagination
          paginationMode="server"
          rowCount={rowCount}
          pageSizeOptions={[8, 16, 32]}
          pageSize={pageSize}
          onPageSizeChange={(newSize) => setPageSize(newSize)}
          page={page}
          onPageChange={(newPage) => setPage(newPage)}
          loading={loading}
        />
      </Box>
    </Box>
  );
}
