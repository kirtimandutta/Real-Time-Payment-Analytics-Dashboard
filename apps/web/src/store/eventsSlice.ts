import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { PaymentEvent } from '@payment-analytics/shared-types';

interface EventsState {
  events: PaymentEvent[];
  maxEvents: number;
}

const initialState: EventsState = {
  events: [],
  maxEvents: 100,
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    addEvent: (state, action: PayloadAction<PaymentEvent>) => {
      state.events.unshift(action.payload);
      if (state.events.length > state.maxEvents) {
        state.events = state.events.slice(0, state.maxEvents);
      }
    },
    clearEvents: (state) => {
      state.events = [];
    },
    setMaxEvents: (state, action: PayloadAction<number>) => {
      state.maxEvents = action.payload;
      if (state.events.length > state.maxEvents) {
        state.events = state.events.slice(0, state.maxEvents);
      }
    },
  },
});

export const { addEvent, clearEvents, setMaxEvents } = eventsSlice.actions;
export default eventsSlice.reducer;
