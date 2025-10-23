'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Skeleton,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from 'recharts';
import type { TrendData, TrendPeriod } from '@payment-analytics/shared-types';
import { formatCurrency, formatDate, formatPercentage } from '@payment-analytics/utils';

interface TrendChartProps {
  trends?: TrendData[];
}

export function TrendChart({ trends }: TrendChartProps) {
  const [period, setPeriod] = useState<TrendPeriod>('day');

  const chartData = useMemo(() => {
    if (!trends) return [];

    return trends.map((t) => ({
      timestamp: formatDate(t.timestamp, 'MMM dd HH:mm'),
      amount: t.amount,
      count: t.count,
      successRate: t.successRate * 100,
    }));
  }, [trends]);

  if (!trends) {
    return (
      <Card>
        <CardContent>
          <Skeleton variant="text" width="30%" height={40} />
          <Skeleton variant="rectangular" height={300} sx={{ mt: 2 }} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h2">
            Trends
          </Typography>
          <ToggleButtonGroup
            value={period}
            exclusive
            onChange={(_, newPeriod) => newPeriod && setPeriod(newPeriod)}
            size="small"
          >
            <ToggleButton value="hour">Hour</ToggleButton>
            <ToggleButton value="day">Day</ToggleButton>
            <ToggleButton value="week">Week</ToggleButton>
            <ToggleButton value="month">Month</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 12 }}
              label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12 }}
              label={{ value: 'Success Rate (%)', angle: 90, position: 'insideRight' }}
              domain={[0, 100]}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;

                return (
                  <Box
                    sx={{
                      bgcolor: 'background.paper',
                      p: 2,
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body2" gutterBottom>
                      {payload[0].payload.timestamp}
                    </Typography>
                    {payload.map((entry: any, index: number) => (
                      <Typography
                        key={index}
                        variant="body2"
                        sx={{ color: entry.color }}
                      >
                        {entry.name}:{' '}
                        {entry.name === 'Amount'
                          ? formatCurrency(entry.value)
                          : entry.name === 'Success Rate'
                          ? `${entry.value.toFixed(2)}%`
                          : entry.value}
                      </Typography>
                    ))}
                  </Box>
                );
              }}
            />
            <Legend />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="amount"
              fill="#2196f3"
              fillOpacity={0.2}
              stroke="#2196f3"
              name="Amount"
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="count"
              stroke="#ff9800"
              strokeWidth={2}
              name="Count"
              dot={{ r: 3 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="successRate"
              stroke="#4caf50"
              strokeWidth={2}
              name="Success Rate"
              dot={{ r: 3 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
