import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { analyticsApi } from './api';
import eventsReducer from './eventsSlice';
import alertsReducer from './alertsSlice';

export const store = configureStore({
  reducer: {
    [analyticsApi.reducerPath]: analyticsApi.reducer,
    events: eventsReducer,
    alerts: alertsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['events/addEvent'],
        ignoredPaths: ['events.events'],
      },
    }).concat(analyticsApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
