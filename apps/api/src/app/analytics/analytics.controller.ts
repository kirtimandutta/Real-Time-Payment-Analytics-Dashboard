import { Controller, Get, Query, Headers } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { TrendPeriod, PaymentMetrics, TrendData, ApiResponse } from '@payment-analytics/shared-types';

@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('metrics')
  async getMetrics(
    @Headers('x-tenant-id') tenantId: string = 'default'
  ): Promise<ApiResponse<PaymentMetrics>> {
    try {
      const metrics = await this.analyticsService.getMetrics(tenantId);
      return {
        success: true,
        data: metrics,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch metrics',
        timestamp: new Date(),
      };
    }
  }

  @Get('trends')
  async getTrends(
    @Query('period') period: TrendPeriod = 'day',
    @Headers('x-tenant-id') tenantId: string = 'default'
  ): Promise<ApiResponse<TrendData[]>> {
    try {
      const trends = await this.analyticsService.getTrends(tenantId, period);
      return {
        success: true,
        data: trends,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch trends',
        timestamp: new Date(),
      };
    }
  }
}
