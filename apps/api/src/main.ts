import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { PaymentsGateway } from './app/payments/payments.gateway';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      credentials: true,
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  );

  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`🚀 API server running on http://localhost:${port}`);
  console.log(`📊 Analytics endpoint: http://localhost:${port}/api/analytics`);
  console.log(`🔌 WebSocket endpoint: ws://localhost:${port}/ws/payments`);

  // Start payment simulation for real-time updates
  const gateway = app.get(PaymentsGateway);
  gateway.startSimulation('default', 3000);
  console.log(`💳 Real-time payment simulation started (every 3 seconds)`);
}

bootstrap();
