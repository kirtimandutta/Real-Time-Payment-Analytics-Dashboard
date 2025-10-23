'use client';

import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from '../theme';
import { store } from '../store';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </Provider>
  );
}
