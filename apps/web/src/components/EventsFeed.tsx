'use client';

import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Pause, PlayArrow, Clear } from '@mui/icons-material';
import type { RootState } from '../store';
import { formatDate, formatCurrency, getStatusColor } from '@payment-analytics/utils';

export function EventsFeed() {
  const events = useSelector((state: RootState) => state.events.events);
  const [isPaused, setIsPaused] = useState(false);
  const [displayedEvents, setDisplayedEvents] = useState(events);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPaused) {
      setDisplayedEvents(events);
      
      // Auto-scroll to top when new events arrive
      if (listRef.current) {
        listRef.current.scrollTop = 0;
      }
    }
  }, [events, isPaused]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'payment_received':
        return '✓';
      case 'payment_failed':
        return '✗';
      case 'payment_refunded':
        return '↺';
      default:
        return '•';
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'payment_received':
        return 'success';
      case 'payment_failed':
        return 'error';
      case 'payment_refunded':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h2">
            Live Events
          </Typography>
          <Box>
            <Tooltip title={isPaused ? 'Resume' : 'Pause'}>
              <IconButton onClick={() => setIsPaused(!isPaused)} size="small">
                {isPaused ? <PlayArrow /> : <Pause />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Clear">
              <IconButton
                onClick={() => setDisplayedEvents([])}
                size="small"
                sx={{ ml: 1 }}
              >
                <Clear />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box
          ref={listRef}
          sx={{
            maxHeight: 500,
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              width: 8,
            },
            '&::-webkit-scrollbar-track': {
              bgcolor: 'grey.100',
            },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: 'grey.400',
              borderRadius: 4,
            },
          }}
        >
          {displayedEvents.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                No events yet. Waiting for payment activity...
              </Typography>
            </Box>
          ) : (
            <List dense>
              {displayedEvents.map((event, index) => (
                <ListItem
                  key={`${event.timestamp}-${index}`}
                  sx={{
                    borderLeft: 4,
                    borderColor: getStatusColor(event.payment.status),
                    mb: 1,
                    bgcolor: 'background.default',
                    borderRadius: 1,
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'action.hover',
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                          component="span"
                          sx={{ fontSize: 20, lineHeight: 1 }}
                        >
                          {getEventIcon(event.type)}
                        </Typography>
                        <Chip
                          label={event.type.replace('payment_', '').toUpperCase()}
                          size="small"
                          color={getEventColor(event.type) as any}
                        />
                        <Typography component="span" sx={{ fontWeight: 'bold' }}>
                          {formatCurrency(event.payment.amount, event.payment.currency)}
                        </Typography>
                        <Chip
                          label={event.payment.method.replace('_', ' ')}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(event.timestamp, 'PPp')} • Customer: {event.payment.customerId}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        {displayedEvents.length > 0 && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Showing {displayedEvents.length} event{displayedEvents.length !== 1 ? 's' : ''}
              {isPaused && ' (Paused)'}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
