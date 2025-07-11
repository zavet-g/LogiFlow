import React, { useState, useEffect } from 'react';
import { Stack, Menu, MenuItem, IconButton, TextField, CircularProgress } from '@mui/material';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { fetchDeliveryTypes, fetchCargoTypes, fetchServices, fetchStatuses } from '../api/api';

const ReportFilters = ({ filters, onChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [dateRange, setDateRange] = useState(filters.dateRange || [null, null]);
  const [type, setType] = useState(filters.type || '');
  const [cargo, setCargo] = useState(filters.cargo || '');
  const [service, setService] = useState(filters.service || '');
  const [status, setStatus] = useState(filters.status || '');
  const [deliveryTypes, setDeliveryTypes] = useState([]);
  const [cargoTypes, setCargoTypes] = useState([]);
  const [services, setServices] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchDeliveryTypes(),
      fetchCargoTypes(),
      fetchServices(),
      fetchStatuses(),
    ]).then(([types, cargos, services, statuses]) => {
      setDeliveryTypes([{ id: '', name: 'Все типы' }, ...types]);
      setCargoTypes([{ id: '', name: 'Все грузы' }, ...cargos]);
      setServices([{ id: '', name: 'Все услуги' }, ...services]);
      setStatuses([{ id: '', name: 'Все статусы' }, ...statuses]);
    }).finally(() => setLoading(false));
  }, []);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleDateChange = (newRange) => {
    setDateRange(newRange);
    onChange({ ...filters, dateRange: newRange });
  };
  const handleTypeChange = (e) => {
    setType(e.target.value);
    onChange({ ...filters, type: e.target.value });
  };
  const handleCargoChange = (e) => {
    setCargo(e.target.value);
    onChange({ ...filters, cargo: e.target.value });
  };
  const handleServiceChange = (e) => {
    setService(e.target.value);
    onChange({ ...filters, service: e.target.value });
  };
  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    onChange({ ...filters, status: e.target.value });
  };

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
      <DateRangePicker
        value={dateRange}
        onChange={handleDateChange}
        localeText={{ start: 'Начало', end: 'Конец' }}
        slotProps={{ textField: { size: 'small', variant: 'outlined' } }}
        sx={{ minWidth: 260 }}
      />
      {loading ? (
        <CircularProgress size={28} />
      ) : (
        <>
          <TextField
            select
            label="По типу доставки"
            value={type}
            onChange={handleTypeChange}
            size="small"
            sx={{ minWidth: 180 }}
          >
            {deliveryTypes.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="По грузу"
            value={cargo}
            onChange={handleCargoChange}
            size="small"
            sx={{ minWidth: 160 }}
          >
            {cargoTypes.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="По услуге"
            value={service}
            onChange={handleServiceChange}
            size="small"
            sx={{ minWidth: 160 }}
          >
            {services.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="По статусу"
            value={status}
            onChange={handleStatusChange}
            size="small"
            sx={{ minWidth: 160 }}
          >
            {statuses.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        </>
      )}
      <IconButton onClick={handleMenuOpen} size="small">
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem disabled>Дополнительные фильтры</MenuItem>
        <MenuItem>Экспорт в Excel</MenuItem>
      </Menu>
    </Stack>
  );
};

export default ReportFilters; 