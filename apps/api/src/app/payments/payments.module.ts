import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './schemas/payment.schema';
import { Tenant, TenantSchema } from './schemas/tenant.schema';
import { PaymentsGateway } from './payments.gateway';
import { PaymentsService } from './payments.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Payment.name, schema: PaymentSchema },
      { name: Tenant.name, schema: TenantSchema },
    ]),
  ],
  providers: [PaymentsGateway, PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
