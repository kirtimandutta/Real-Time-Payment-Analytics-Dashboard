import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from '../payments/schemas/payment.schema';
import {
  PaymentMetrics,
  TrendData,
  TrendPeriod,
  PaymentMethodStats,
  HourlyStats,
} from '@payment-analytics/shared-types';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Payment.name)
    private paymentModel: Model<PaymentDocument>,
    private cacheService: CacheService
  ) {}

  async getMetrics(tenantId: string): Promise<PaymentMetrics> {
    const cacheKey = `metrics:${tenantId}`;
    const cached = await this.cacheService.get<PaymentMetrics>(cacheKey);
    
    if (cached) {
      return cached;
    }

    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000); // Last 24 hours

    const [totalStats, methodStats, hourlyStats] = await Promise.all([
      this.getTotalStats(tenantId, startDate, endDate),
      this.getMethodStats(tenantId, startDate, endDate),
      this.getHourlyStats(tenantId, startDate, endDate),
    ]);

    const metrics: PaymentMetrics = {
      totalVolume: totalStats.totalVolume,
      successRate: totalStats.successRate,
      averageAmount: totalStats.averageAmount,
      peakHour: hourlyStats.peakHour,
      topPaymentMethod: methodStats.topMethod,
      totalTransactions: totalStats.totalTransactions,
      failedTransactions: totalStats.failedTransactions,
      refundedTransactions: totalStats.refundedTransactions,
      period: {
        start: startDate,
        end: endDate,
      },
    };

    // Cache for 30 seconds
    await this.cacheService.set(cacheKey, metrics, 30);

    return metrics;
  }

  async getTrends(
    tenantId: string,
    period: TrendPeriod = 'day'
  ): Promise<TrendData[]> {
    const cacheKey = `trends:${tenantId}:${period}`;
    const cached = await this.cacheService.get<TrendData[]>(cacheKey);
    
    if (cached) {
      return cached;
    }

    const { startDate, groupFormat } = this.getDateRangeForPeriod(period);
    const endDate = new Date();

    const pipeline = [
      {
        $match: {
          tenantId,
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: groupFormat, date: '$createdAt' } },
          count: { $sum: 1 },
          amount: { $sum: '$amount' },
          successCount: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ];

    const results = await this.paymentModel.aggregate(pipeline).exec();

    const trends: TrendData[] = results.map((r) => ({
      timestamp: new Date(r._id),
      count: r.count,
      amount: r.amount,
      successRate: r.count > 0 ? r.successCount / r.count : 0,
    }));

    // Cache for 1 minute
    await this.cacheService.set(cacheKey, trends, 60);

    return trends;
  }

  private async getTotalStats(
    tenantId: string,
    startDate: Date,
    endDate: Date
  ) {
    const pipeline = [
      {
        $match: {
          tenantId,
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          totalTransactions: { $sum: 1 },
          totalVolume: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, '$amount', 0] },
          },
          completedTransactions: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
          },
          failedTransactions: {
            $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] },
          },
          refundedTransactions: {
            $sum: { $cond: [{ $eq: ['$status', 'refunded'] }, 1, 0] },
          },
          totalAmount: { $sum: '$amount' },
        },
      },
    ];

    const result = await this.paymentModel.aggregate(pipeline).exec();

    if (result.length === 0) {
      return {
        totalVolume: 0,
        successRate: 0,
        averageAmount: 0,
        totalTransactions: 0,
        failedTransactions: 0,
        refundedTransactions: 0,
      };
    }

    const stats = result[0];
    return {
      totalVolume: stats.totalVolume,
      successRate: stats.completedTransactions / stats.totalTransactions,
      averageAmount: stats.totalAmount / stats.totalTransactions,
      totalTransactions: stats.totalTransactions,
      failedTransactions: stats.failedTransactions,
      refundedTransactions: stats.refundedTransactions,
    };
  }

  private async getMethodStats(
    tenantId: string,
    startDate: Date,
    endDate: Date
  ): Promise<{ topMethod: string; stats: PaymentMethodStats[] }> {
    const pipeline = [
      {
        $match: {
          tenantId,
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: '$method',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          successCount: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
          },
        },
      },
      {
        $sort: { count: -1 },
      },
    ];

    const results = await this.paymentModel.aggregate(pipeline).exec();

    const stats: PaymentMethodStats[] = results.map((r) => ({
      method: r._id,
      count: r.count,
      totalAmount: r.totalAmount,
      successRate: r.count > 0 ? r.successCount / r.count : 0,
    }));

    const topMethod = stats.length > 0 ? stats[0].method : 'credit_card';

    return { topMethod, stats };
  }

  private async getHourlyStats(
    tenantId: string,
    startDate: Date,
    endDate: Date
  ): Promise<{ peakHour: number; stats: HourlyStats[] }> {
    const pipeline = [
      {
        $match: {
          tenantId,
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { $hour: '$createdAt' },
          count: { $sum: 1 },
          amount: { $sum: '$amount' },
        },
      },
      {
        $sort: { count: -1 },
      },
    ];

    const results = await this.paymentModel.aggregate(pipeline).exec();

    const stats: HourlyStats[] = results.map((r) => ({
      hour: r._id,
      count: r.count,
      amount: r.amount,
    }));

    const peakHour = stats.length > 0 ? stats[0].hour : 14;

    return { peakHour, stats };
  }

  private getDateRangeForPeriod(period: TrendPeriod): {
    startDate: Date;
    groupFormat: string;
  } {
    const endDate = new Date();
    let startDate: Date;
    let groupFormat: string;

    switch (period) {
      case 'hour':
        startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000);
        groupFormat = '%Y-%m-%d %H:00';
        break;
      case 'day':
        startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        groupFormat = '%Y-%m-%d';
        break;
      case 'week':
        startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        groupFormat = '%Y-W%V';
        break;
      case 'month':
        startDate = new Date(endDate.getTime() - 365 * 24 * 60 * 60 * 1000);
        groupFormat = '%Y-%m';
        break;
      default:
        startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        groupFormat = '%Y-%m-%d';
    }

    return { startDate, groupFormat };
  }

  async invalidateCache(tenantId: string): Promise<void> {
    await Promise.all([
      this.cacheService.del(`metrics:${tenantId}`),
      this.cacheService.del(`trends:${tenantId}:hour`),
      this.cacheService.del(`trends:${tenantId}:day`),
      this.cacheService.del(`trends:${tenantId}:week`),
      this.cacheService.del(`trends:${tenantId}:month`),
    ]);
  }
}
