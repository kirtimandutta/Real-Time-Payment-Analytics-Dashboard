'use client';

import { Grid, Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import {
  TrendingUp,
  CheckCircle,
  AttachMoney,
  Schedule,
  CreditCard,
} from '@mui/icons-material';
import type { PaymentMetrics } from '@payment-analytics/shared-types';
import { formatCurrency, formatPercentage, formatNumber } from '@payment-analytics/utils';

interface MetricsGridProps {
  metrics?: PaymentMetrics;
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  if (!metrics) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={i}>
            <Card>
              <CardContent>
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" height={40} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  const metricCards = [
    {
      title: 'Total Volume',
      value: formatCurrency(metrics.totalVolume),
      icon: <AttachMoney />,
      color: '#2196f3',
    },
    {
      title: 'Success Rate',
      value: formatPercentage(metrics.successRate),
      icon: <CheckCircle />,
      color: '#4caf50',
    },
    {
      title: 'Average Amount',
      value: formatCurrency(metrics.averageAmount),
      icon: <TrendingUp />,
      color: '#ff9800',
    },
    {
      title: 'Peak Hour',
      value: `${metrics.peakHour}:00`,
      icon: <Schedule />,
      color: '#9c27b0',
    },
    {
      title: 'Top Method',
      value: metrics.topPaymentMethod.replace('_', ' '),
      icon: <CreditCard />,
      color: '#f44336',
    },
  ];

  return (
    <Grid container spacing={3}>
      {metricCards.map((metric, index) => (
        <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
          <Card
            sx={{
              height: '100%',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4,
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: 1,
                    bgcolor: `${metric.color}15`,
                    color: metric.color,
                    mr: 2,
                  }}
                >
                  {metric.icon}
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {metric.title}
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {metric.value}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Total Transactions
                </Typography>
                <Typography variant="h6">
                  {formatNumber(metrics.totalTransactions)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Failed Transactions
                </Typography>
                <Typography variant="h6" color="error.main">
                  {formatNumber(metrics.failedTransactions)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Refunded Transactions
                </Typography>
                <Typography variant="h6" color="warning.main">
                  {formatNumber(metrics.refundedTransactions)}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
