import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalyticsModule } from './analytics/analytics.module';
import { PaymentsModule } from './payments/payments.module';
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/payment-analytics',
      {
        retryAttempts: 3,
        retryDelay: 1000,
      }
    ),
    CacheModule,
    PaymentsModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
