import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme/theme';
import ReportPage from './pages/ReportPage';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ReportPage />
    </ThemeProvider>
  );
};

export default App; 