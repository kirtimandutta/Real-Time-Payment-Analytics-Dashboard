import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Alert } from '@payment-analytics/shared-types';

interface AlertsState {
  alerts: Alert[];
}

const initialState: AlertsState = {
  alerts: [],
};

const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    addAlert: (state, action: PayloadAction<Alert>) => {
      state.alerts.unshift(action.payload);
    },
    removeAlert: (state, action: PayloadAction<string>) => {
      state.alerts = state.alerts.filter((a) => a.id !== action.payload);
    },
    clearAlerts: (state) => {
      state.alerts = [];
    },
  },
});

export const { addAlert, removeAlert, clearAlerts } = alertsSlice.actions;
export default alertsSlice.reducer;
