import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  PaymentMetrics,
  TrendData,
  TrendPeriod,
  ApiResponse,
} from '@payment-analytics/shared-types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const analyticsApi = createApi({
  reducerPath: 'analyticsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/api`,
    prepareHeaders: (headers) => {
      // Add tenant ID from localStorage or env
      const tenantId = localStorage?.getItem('tenantId') || 'default';
      headers.set('X-Tenant-Id', tenantId);
      return headers;
    },
  }),
  tagTypes: ['Metrics', 'Trends'],
  endpoints: (builder) => ({
    getMetrics: builder.query<ApiResponse<PaymentMetrics>, void>({
      query: () => 'analytics/metrics',
      providesTags: ['Metrics'],
    }),
    getTrends: builder.query<
      ApiResponse<TrendData[]>,
      { period?: TrendPeriod }
    >({
      query: ({ period = 'day' }) => `analytics/trends?period=${period}`,
      providesTags: ['Trends'],
    }),
  }),
});

export const { useGetMetricsQuery, useGetTrendsQuery } = analyticsApi;
