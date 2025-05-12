import * as React from 'react';
import { DataGrid, DataGridProps } from '@mui/x-data-grid';

export default function CustomDataGrid(props: DataGridProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <DataGrid
        {...props}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
        }
        initialState={{
          ...props.initialState,
          pagination: {
            paginationModel: { pageSize: 10, page: 0 },
            ...props.initialState?.pagination,
          },
        }}
        pageSizeOptions={[10, 20, 50]}
        sx={{
          ...props.sx,
          borderColor: (theme) =>
            theme.palette.mode === 'dark'
              ? theme.palette.grey[700]
              : theme.palette.grey[200],
          '& .MuiDataGrid-cell': {
            borderColor: (theme) =>
              theme.palette.mode === 'dark'
                ? theme.palette.grey[700]
                : theme.palette.grey[200],
          },
        }}
        disableColumnResize
        disableRowSelectionOnClick
        slotProps={{
          filterPanel: {
            sx: {
              '& .MuiDataGrid-filterForm': {
                columnGap: 1.5,
                marginTop: 2,
              },
            },
            filterFormProps: {
              logicOperatorInputProps: {
                variant: 'outlined',
                size: 'small',
              },
              columnInputProps: {
                variant: 'outlined',
                size: 'small',
                sx: { mt: 'auto' },
              },
              operatorInputProps: {
                variant: 'outlined',
                size: 'small',
                sx: { mt: 'auto' },
              },
              valueInputProps: {
                InputComponentProps: {
                  variant: 'outlined',
                  size: 'small',
                },
              },
            },
          },
        }}
      />
    </div>
  );
}
