import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import ReportFilters from '../components/ReportFilters';
import ReportChart from '../components/ReportChart';
import ReportTable from '../components/ReportTable';
import { fetchDeliveries } from '../api/api';

function formatDate(date) {
  if (!date) return null;
  const d = new Date(date);
  return d.toISOString().slice(0, 10);
}

const ReportPage = () => {
  const [filters, setFilters] = useState({
    dateRange: [null, null],
    type: '',
    cargo: '',
    service: '',
    status: '',
  });
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Загрузка доставок при изменении фильтров
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {};
        if (filters.dateRange[0]) params.date_from = formatDate(filters.dateRange[0]);
        if (filters.dateRange[1]) params.date_to = formatDate(filters.dateRange[1]);
        if (filters.type) params.service = filters.type;
        if (filters.cargo) params.cargo_type = filters.cargo;
        if (filters.service) params.service = filters.service;
        if (filters.status) params.status = filters.status;
        const data = await fetchDeliveries(params);
        setDeliveries(data);
      } catch (e) {
        setError('Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [filters]);

  // Преобразование данных для графика (по дням)
  const chartData = React.useMemo(() => {
    if (!deliveries.length) return [];
    const map = {};
    deliveries.forEach((d) => {
      const date = new Date(d.delivery_time).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' });
      map[date] = (map[date] || 0) + 1;
    });
    return Object.entries(map).map(([date, count]) => ({ date, count }));
  }, [deliveries]);

  // Преобразование данных для таблицы
  const tableData = React.useMemo(() => {
    if (!deliveries.length) return [];
    return deliveries.map((d, idx) => ({
      id: d.id || idx,
      name: d.name || `Доставка ${idx + 1}`,
      date: d.delivery_time ? new Date(d.delivery_time).toLocaleDateString('ru-RU') : '',
      model: d.transport_model?.name || '',
      service: d.service?.name || '',
      distance: d.distance_km || '',
    }));
  }, [deliveries]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary', py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Отчет по доставкам
        </Typography>
        <Paper sx={{ p: 2, mb: 3 }} elevation={2}>
          <ReportFilters filters={filters} onChange={setFilters} />
        </Paper>
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Paper sx={{ p: 2, mb: 3 }} elevation={2}>
              <ReportChart data={chartData} />
            </Paper>
            <Paper sx={{ p: 2 }} elevation={2}>
              <ReportTable data={tableData} />
            </Paper>
          </>
        )}
      </Container>
    </Box>
  );
};

export default ReportPage; 