import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Area, AreaChart } from 'recharts';
import { Box, Typography } from '@mui/material';

// Моковые данные для графика
const mockData = [
  { date: 'янв. 2', count: 4 },
  { date: 'янв. 4', count: 6 },
  { date: 'янв. 6', count: 3 },
  { date: 'янв. 6', count: 7 },
  { date: 'янв. 7', count: 2 },
  { date: 'янв. 8', count: 4 },
  { date: 'янв. 8', count: 3 },
  { date: 'янв. 10', count: 5 },
  { date: 'янв. 10', count: 4 },
];

const ReportChart = ({ data = mockData }) => {
  return (
    <Box sx={{ width: '100%', height: 280 }}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Количество доставок
      </Typography>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart data={data} margin={{ top: 16, right: 24, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2196F3" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#2196F3" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="date" tick={{ fill: '#B0BEC5' }} />
          <YAxis allowDecimals={false} tick={{ fill: '#B0BEC5' }} />
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <Tooltip contentStyle={{ background: '#23272A', border: 'none', color: '#fff' }} />
          <Area type="monotone" dataKey="count" stroke="#2196F3" fillOpacity={1} fill="url(#colorCount)" />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ReportChart; 