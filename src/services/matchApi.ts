import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Match, Sport } from '../models';

const BASE_URL = 'https://au.testing.smartb.com.au/soc-api';

interface MatchListArgs {
  limit: number;
  offset: number;
  timezone: string;
  tournament_ids?: string;
  status?: string;
}

interface MatchListResponse {
  matches: Match[];
  totalCount: number;
}

export const matchApi = createApi({
  reducerPath: 'matchApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ['Matches'],
  endpoints: builder => ({
    // Infinite Scroll Endpoint
    getMatches: builder.query<Match[], MatchListArgs>({
      query: params => ({
        url: '/sports/matchList',
        params: {
          ...params,
          status: 'all', // Default status
        },
      }),
      // Transformation: Extract the matches array from the response
      transformResponse: (response: MatchListResponse) => {
        return response.matches || [];
      },
      // Cache handling for infinite scroll:
      // 1. Merge new results into existing cache
      merge: (currentCache, newItems, { arg }) => {
        if (arg.offset === 0) {
          // If offset is 0, it's a refresh or new filter, replace cache
          return newItems;
        }
        // Otherwise, append new items
        currentCache.push(...newItems);
      },
      // 2. Ensure we only keep one cache entry per filter set (ignoring offset/limit)
      serializeQueryArgs: ({ queryArgs }) => {
        const { limit, offset, ...rest } = queryArgs;
        return JSON.stringify(rest);
      },
      // Always refetch on mount or arg change to ensure fresh data
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),

    // Filters Endpoint
    getAllSportsAndLeagues: builder.query<Sport[], void>({
      query: () => ({
        url: '/sports/AllSportsAndLeagues',
        params: {
          limit: 100,
        },
      }),
      transformResponse: (response: Sport[]) => response,
    }),
  }),
});

// Export hooks for usage in functional components
export const { useGetMatchesQuery, useGetAllSportsAndLeaguesQuery } = matchApi;
