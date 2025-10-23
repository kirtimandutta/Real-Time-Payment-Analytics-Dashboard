import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import type { PaymentStatus, PaymentMethod } from '@payment-analytics/shared-types';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true, collection: 'payments' })
export class Payment {
  @Prop({ required: true, index: true })
  tenantId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 'USD' })
  currency: string;

  @Prop({ required: true, index: true, type: String })
  method: PaymentMethod;

  @Prop({ required: true, index: true, type: String })
  status: PaymentStatus;

  @Prop({ required: true })
  merchantId: string;

  @Prop({ required: true })
  customerId: string;

  @Prop()
  description?: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;

  @Prop({ index: true })
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

// Create compound indexes for better query performance
PaymentSchema.index({ tenantId: 1, createdAt: -1 });
PaymentSchema.index({ tenantId: 1, status: 1, createdAt: -1 });
PaymentSchema.index({ tenantId: 1, method: 1, createdAt: -1 });
