import { connect, connection } from 'mongoose';
import { Payment, PaymentSchema } from '../src/app/payments/schemas/payment.schema';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/payment-analytics';

async function seed() {
  try {
    console.log('🌱 Connecting to MongoDB...');
    await connect(MONGODB_URI);

    const PaymentModel = connection.model('Payment', PaymentSchema);

    // Clear existing data
    console.log('🗑️  Clearing existing payments...');
    await PaymentModel.deleteMany({});

    console.log('📝 Generating payments...');
    
    const tenants = ['default', 'tenant1', 'tenant2'];
    const methods = ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'crypto'];
    const statuses = ['completed', 'failed', 'refunded', 'pending'];
    
    const payments = [];
    const now = Date.now();
    
    // Generate 1000 payments over the last 7 days
    for (let i = 0; i < 1000; i++) {
      const daysAgo = Math.floor(Math.random() * 7);
      const createdAt = new Date(now - (daysAgo * 24 * 60 * 60 * 1000));
      
      // 75% completed, 15% failed, 5% refunded, 5% pending
      const rand = Math.random();
      let status;
      if (rand < 0.75) status = 'completed';
      else if (rand < 0.90) status = 'failed';
      else if (rand < 0.95) status = 'refunded';
      else status = 'pending';
      
      payments.push({
        tenantId: tenants[Math.floor(Math.random() * tenants.length)],
        amount: Math.floor(Math.random() * 5000) + 100,
        currency: 'USD',
        method: methods[Math.floor(Math.random() * methods.length)],
        status,
        merchantId: `merchant_${Math.random().toString(36).substr(2, 9)}`,
        customerId: `customer_${Math.random().toString(36).substr(2, 9)}`,
        description: `Payment transaction ${i + 1}`,
        createdAt,
        updatedAt: createdAt,
      });
    }

    await PaymentModel.insertMany(payments);

    console.log(`✅ Successfully created ${payments.length} payments`);
    console.log(`📊 Breakdown:`);
    console.log(`   - Completed: ${payments.filter(p => p.status === 'completed').length}`);
    console.log(`   - Failed: ${payments.filter(p => p.status === 'failed').length}`);
    console.log(`   - Refunded: ${payments.filter(p => p.status === 'refunded').length}`);
    console.log(`   - Pending: ${payments.filter(p => p.status === 'pending').length}`);
    
    await connection.close();
    console.log('👋 Database connection closed');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
