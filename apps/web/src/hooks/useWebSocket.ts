'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { io, Socket } from 'socket.io-client';
import type { PaymentEvent } from '@payment-analytics/shared-types';
import { addEvent } from '../store/eventsSlice';
import { addAlert } from '../store/alertsSlice';
import { generateId } from '@payment-analytics/utils';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';

export function useWebSocket() {
  const dispatch = useDispatch();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 10;

  const connect = useCallback(() => {
    if (socketRef.current?.connected) {
      return;
    }

    const socket = io(`${WS_URL}/ws/payments`, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: maxReconnectAttempts,
    });

    socket.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      reconnectAttempts.current = 0;

      // Subscribe to events
      const tenantId = localStorage?.getItem('tenantId') || 'default';
      socket.emit('subscribe', { tenantId });
    });

    socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      reconnectAttempts.current++;

      if (reconnectAttempts.current >= maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
        socket.close();
      }
    });

    socket.on('payment_event', (event: PaymentEvent) => {
      console.log('Received payment event:', event.type);
      dispatch(addEvent(event));

      // Check for alerts
      if (event.type === 'payment_failed') {
        dispatch(
          addAlert({
            id: generateId(),
            type: 'failure_spike',
            message: `Payment failed: ${event.payment.amount} ${event.payment.currency}`,
            severity: 'error',
            timestamp: new Date(),
            data: event.payment,
          })
        );
      }
    });

    socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    socketRef.current = socket;
  }, [dispatch]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  }, []);

  return {
    connect,
    disconnect,
    isConnected,
    socket: socketRef.current,
  };
}
