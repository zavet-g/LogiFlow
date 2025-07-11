import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';

const columns = [
  { field: 'name', headerName: 'Итого', flex: 1, minWidth: 120 },
  { field: 'date', headerName: 'Дата доставки', flex: 1, minWidth: 130 },
  { field: 'model', headerName: 'Модель ТС', flex: 1, minWidth: 120 },
  { field: 'service', headerName: 'Услуга', flex: 1, minWidth: 120 },
  { field: 'distance', headerName: 'Дистанция (км)', flex: 1, minWidth: 140, type: 'number' },
];

const ReportTable = ({ data = [], onRowClick }) => {
  return (
    <Box sx={{ width: '100%', height: 420 }}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Таблица доставок
      </Typography>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={8}
        rowsPerPageOptions={[8, 16, 32]}
        disableSelectionOnClick
        autoHeight
        onRowClick={onRowClick || ((params) => alert(`ID доставки: ${params.id}`))}
        sx={{
          bgcolor: 'background.paper',
          borderRadius: 2,
          fontSize: 16,
          '& .MuiDataGrid-columnHeaders': { bgcolor: 'background.default', color: 'text.primary', fontWeight: 700 },
          '& .MuiDataGrid-row': { bgcolor: 'background.paper' },
        }}
      />
    </Box>
  );
};

export default ReportTable; 