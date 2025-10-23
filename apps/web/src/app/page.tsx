'use client';

import { Container, Box, Typography } from '@mui/material';
import { MetricsGrid } from '../components/MetricsGrid';
import { TrendChart } from '../components/TrendChart';
import { EventsFeed } from '../components/EventsFeed';
import { useWebSocket } from '../hooks/useWebSocket';
import { useGetMetricsQuery, useGetTrendsQuery } from '../store/api';
import { useEffect } from 'react';

export default function Dashboard() {
  const { connect, disconnect, isConnected } = useWebSocket();
  const { data: metrics, refetch: refetchMetrics } = useGetMetricsQuery();
  const { data: trends } = useGetTrendsQuery({ period: 'day' });

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  useEffect(() => {
    if (isConnected) {
      // Refetch metrics when new events arrive
      const interval = setInterval(() => {
        refetchMetrics();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isConnected, refetchMetrics]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Payment Analytics Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Real-time payment monitoring and analytics
          {isConnected && (
            <Box
              component="span"
              sx={{
                ml: 2,
                display: 'inline-flex',
                alignItems: 'center',
                color: 'success.main',
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: 'success.main',
                  mr: 1,
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.5 },
                  },
                }}
              />
              Live
            </Box>
          )}
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <MetricsGrid metrics={metrics?.data} />
      </Box>

      <Box sx={{ mb: 4 }}>
        <TrendChart trends={trends?.data} />
      </Box>

      <Box>
        <EventsFeed />
      </Box>
    </Container>
  );
}
