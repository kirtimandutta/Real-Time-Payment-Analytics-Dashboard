import { format, subDays, subHours, subMonths, subWeeks, startOfDay, startOfHour, startOfWeek, startOfMonth } from 'date-fns';
import type { TrendPeriod } from '@payment-analytics/shared-types';

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatNumber = (num: number, decimals: number = 0): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

export const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(2)}%`;
};

export const formatDate = (date: Date | string, formatString: string = 'PP'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatString);
};

export const getDateRange = (period: TrendPeriod): { start: Date; end: Date } => {
  const end = new Date();
  let start: Date;

  switch (period) {
    case 'hour':
      start = subHours(end, 24);
      break;
    case 'day':
      start = subDays(end, 7);
      break;
    case 'week':
      start = subWeeks(end, 4);
      break;
    case 'month':
      start = subMonths(end, 6);
      break;
    default:
      start = subDays(end, 7);
  }

  return { start, end };
};

export const roundToInterval = (date: Date, period: TrendPeriod): Date => {
  switch (period) {
    case 'hour':
      return startOfHour(date);
    case 'day':
      return startOfDay(date);
    case 'week':
      return startOfWeek(date);
    case 'month':
      return startOfMonth(date);
    default:
      return startOfDay(date);
  }
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  let lastArgs: Parameters<T> | null = null;

  return (...args: Parameters<T>) => {
    lastArgs = args;
    if (!timeout) {
      timeout = setTimeout(() => {
        if (lastArgs) {
          func(...lastArgs);
        }
        timeout = null;
      }, wait);
    }
  };
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const calculateSuccessRate = (total: number, failed: number): number => {
  if (total === 0) return 0;
  return (total - failed) / total;
};

export const detectAnomaly = (
  currentValue: number,
  historicalAverage: number,
  threshold: number = 0.3
): boolean => {
  if (historicalAverage === 0) return false;
  const deviation = Math.abs(currentValue - historicalAverage) / historicalAverage;
  return deviation > threshold;
};

export const groupBy = <T, K extends keyof any>(
  array: T[],
  getKey: (item: T) => K
): Record<K, T[]> => {
  return array.reduce((acc, item) => {
    const key = getKey(item);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {} as Record<K, T[]>);
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const retry = async <T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delayMs: number = 1000
): Promise<T> => {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxAttempts) {
        await sleep(delayMs * attempt); // Exponential backoff
      }
    }
  }

  throw lastError;
};

export const safeJsonParse = <T>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'completed':
      return '#4caf50';
    case 'pending':
      return '#ff9800';
    case 'failed':
      return '#f44336';
    case 'refunded':
      return '#9c27b0';
    default:
      return '#757575';
  }
};

export const getPaymentMethodIcon = (method: string): string => {
  switch (method) {
    case 'credit_card':
      return '💳';
    case 'debit_card':
      return '💳';
    case 'paypal':
      return '🅿️';
    case 'bank_transfer':
      return '🏦';
    case 'crypto':
      return '₿';
    default:
      return '💰';
  }
};
