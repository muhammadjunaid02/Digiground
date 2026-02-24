import {
  BaseQueryFn,
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';

//   import { RootState } from "../index";
//   import { logOut } from "../slices/authSlice";

// Import authApiSlice to inject endpoints (must be imported after apiSlice is created)
// This will be imported at the end of the file
const BASE_URL = 'https://au.testing.smartb.com.au/soc-api';

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
});

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Match'],
  endpoints: _builder => ({}),
});
