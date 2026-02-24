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

// Ensure clean URL construction - remove trailing slashes
const apiBaseUrl = BASE_URL;
const baseQuery: BaseQueryFn = fetchBaseQuery({
  baseUrl: apiBaseUrl,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as any;
    const accessToken = state.auth.accessToken;
    if (accessToken) {
      headers.set('authorization', `Bearer ${accessToken}`);
    }
    return headers;
  },

  credentials: 'include',
  // RTK Query automatically handles FormData - don't set Content-Type manually
});

// Base query without authorization header for refresh token endpoint

const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
  let result: any = await baseQuery(args, api, extraOptions);

  return result;
};
export const apiSlice = createApi({
  tagTypes: [],
  baseQuery: baseQueryWithReauth,
  endpoints: _builder => ({}),
});
