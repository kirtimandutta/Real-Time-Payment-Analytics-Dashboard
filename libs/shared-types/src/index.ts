export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type PaymentMethod = 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer' | 'crypto';
export type PaymentEventType = 'payment_received' | 'payment_failed' | 'payment_refunded';

export interface Payment {
  _id: string;
  tenantId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  merchantId: string;
  customerId: string;
  description?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentEvent {
  type: PaymentEventType;
  payment: Payment;
  timestamp: Date;
}

export interface PaymentMetrics {
  totalVolume: number;
  successRate: number;
  averageAmount: number;
  peakHour: number;
  topPaymentMethod: string;
  totalTransactions: number;
  failedTransactions: number;
  refundedTransactions: number;
  period: {
    start: Date;
    end: Date;
  };
}

export interface TrendData {
  timestamp: Date;
  amount: number;
  count: number;
  successRate: number;
}

export interface TrendDataPoint extends TrendData {
  failedCount: number;
  refundedCount: number;
}

export type TrendPeriod = 'hour' | 'day' | 'week' | 'month';

export interface AnalyticsQuery {
  period?: TrendPeriod;
  tenantId?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface PaymentMethodStats {
  method: PaymentMethod;
  count: number;
  totalAmount: number;
  successRate: number;
}

export interface HourlyStats {
  hour: number;
  count: number;
  amount: number;
}

export interface AlertThreshold {
  type: 'failure_spike' | 'volume_threshold' | 'success_rate_drop';
  value: number;
  comparison: 'greater_than' | 'less_than';
}

export interface Alert {
  id: string;
  type: AlertThreshold['type'];
  message: string;
  severity: 'info' | 'warning' | 'error';
  timestamp: Date;
  data?: any;
}

export interface WebSocketMessage<T = any> {
  event: string;
  data: T;
}

export interface Tenant {
  _id: string;
  name: string;
  slug: string;
  apiKey: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
