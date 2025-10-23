import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import type { PaymentEvent } from '@payment-analytics/shared-types';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/ws/payments',
})
export class PaymentsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('PaymentsGateway');
  private connectedClients = new Map<string, { tenantId?: string; socket: Socket }>();

  constructor(private paymentsService: PaymentsService) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    const tenantId = client.handshake.headers['x-tenant-id'] as string;
    this.connectedClients.set(client.id, { tenantId, socket: client });
    this.logger.log(`Client connected: ${client.id} (Tenant: ${tenantId || 'default'})`);
  }

  handleDisconnect(client: Socket) {
    this.connectedClients.delete(client.id);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribe')
  handleSubscribe(client: Socket, data: { tenantId?: string }) {
    const clientInfo = this.connectedClients.get(client.id);
    if (clientInfo) {
      clientInfo.tenantId = data.tenantId;
      client.join(`tenant:${data.tenantId}`);
      this.logger.log(`Client ${client.id} subscribed to tenant ${data.tenantId}`);
    }
  }

  @SubscribeMessage('unsubscribe')
  handleUnsubscribe(client: Socket, data: { tenantId?: string }) {
    if (data.tenantId) {
      client.leave(`tenant:${data.tenantId}`);
      this.logger.log(`Client ${client.id} unsubscribed from tenant ${data.tenantId}`);
    }
  }

  broadcastPaymentEvent(event: PaymentEvent, tenantId?: string) {
    if (tenantId) {
      // Broadcast to specific tenant room
      this.server.to(`tenant:${tenantId}`).emit('payment_event', event);
    } else {
      // Broadcast to all clients
      this.server.emit('payment_event', event);
    }

    this.logger.debug(
      `Broadcasted ${event.type} event for tenant ${tenantId || 'all'}`
    );
  }

  // Simulate real-time payment events by creating actual database entries
  startSimulation(tenantId: string = 'default', intervalMs: number = 3000) {
    this.logger.log('💳 Starting real-time payment simulation...');
    
    const interval = setInterval(async () => {
      try {
        // Create real payment in database
        const payment = await this.paymentsService.createRandomPayment(tenantId);
        
        const eventType = payment.status === 'failed' 
          ? 'payment_failed' 
          : 'payment_received';

        const event = this.paymentsService.createPaymentEvent(payment, eventType);

        // Broadcast to tenant room
        this.server.to(`tenant:${tenantId}`).emit('payment_event', event);
        
        // Also broadcast to all clients
        this.server.emit('payment_event', event);
        
        this.logger.debug(`📤 Payment created: ${payment._id} - $${payment.amount} (${payment.status})`);
      } catch (error) {
        this.logger.error('Error creating payment:', error);
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }
}
