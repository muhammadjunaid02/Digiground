import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../services/api';
import { matchApi } from '../services/matchApi';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [matchApi.reducerPath]: matchApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(apiSlice.middleware, matchApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
