import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from './schemas/payment.schema';
import type { PaymentEvent } from '@payment-analytics/shared-types';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name)
    private paymentModel: Model<PaymentDocument>
  ) {}

  async create(paymentData: Partial<Payment>): Promise<PaymentDocument> {
    const payment = new this.paymentModel(paymentData);
    return payment.save();
  }

  async findAll(tenantId: string, limit = 100): Promise<PaymentDocument[]> {
    return this.paymentModel
      .find({ tenantId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async findById(id: string): Promise<PaymentDocument | null> {
    return this.paymentModel.findById(id).exec();
  }

  async updateStatus(
    id: string,
    status: Payment['status']
  ): Promise<PaymentDocument | null> {
    return this.paymentModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();
  }

  createPaymentEvent(
    payment: PaymentDocument,
    type: PaymentEvent['type']
  ): PaymentEvent {
    return {
      type,
      payment: payment.toObject(),
      timestamp: new Date(),
    };
  }

  // Generate random payment for real-time simulation
  async createRandomPayment(tenantId: string = 'default'): Promise<PaymentDocument> {
    const methods = ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'crypto'];
    const statuses = ['completed', 'failed'];
    
    const paymentData = {
      tenantId,
      amount: Math.floor(Math.random() * 5000) + 100,
      currency: 'USD',
      method: methods[Math.floor(Math.random() * methods.length)] as any,
      status: Math.random() > 0.15 ? 'completed' : 'failed' as any,
      merchantId: `merchant_${Math.random().toString(36).substr(2, 9)}`,
      customerId: `customer_${Math.random().toString(36).substr(2, 9)}`,
      description: 'Real-time payment transaction',
    };

    return this.create(paymentData);
  }
}
