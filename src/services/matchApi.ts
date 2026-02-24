import { Match, Sport } from '../models';
import { apiSlice } from './api';

interface MatchListArgs {
  limit: number;
  offset: number;
  timezone: string;
  tournament_ids?: string;
  status?: string;
  todate?: string;
}

interface MatchListResponse {
  matches: Match[];
  totalCount: number;
}

export const matchApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getMatches: builder.query<{ matches: Match[]; total: number }, MatchListArgs>({
      query: params => ({
        url: '/sports/matchList',
        params: {
          ...params,
          status: params.status || 'all',
        },
      }),
      transformResponse: (response: any) => {
        const matches = (response.matches || []).map((m: any) => ({
          id: m.id,
          startTime: m.start_time,
          team1: {
            name: m.homeTeam?.name || 'TBA',
            logo: m.homeTeam?.logo,
          },
          team2: {
            name: m.awayTeam?.name || 'TBA',
            logo: m.awayTeam?.logo,
          },
          tournamentName: m.tournament?.name || 'Unknown',
          sportName: m.sport?.sportName || 'Sports',
          status: m.status,
        }));
        return {
          matches,
          total: response.total || 0,
        };
      },
      // Merge for infinite scroll
      serializeQueryArgs: ({ queryArgs }) => {
        const { limit, offset, ...rest } = queryArgs;
        return JSON.stringify(rest);
      },
      merge: (currentCache, newResponse, { arg }) => {
        if (arg.offset === 0) {
          return newResponse;
        }
        // Filter out duplicates based on id
        const existingIds = new Set(currentCache.matches.map(m => m.id));
        const filteredNewItems = newResponse.matches.filter(m => !existingIds.has(m.id));
        return {
          ...currentCache,
          matches: [...currentCache.matches, ...filteredNewItems],
          total: newResponse.total,
        };
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      providesTags: (result) =>
        result?.matches
          ? [...result.matches.map(({ id }) => ({ type: 'Match' as const, id })), { type: 'Match', id: 'LIST' }]
          : [{ type: 'Match', id: 'LIST' }],
    }),

    getAllSportsAndLeagues: builder.query<Sport[], void>({
      query: () => ({
        url: '/sports/AllSportsAndLeagues',
        params: {
          limit: 100,
        },
      }),
    }),
  }),
});

export const { useGetMatchesQuery, useGetAllSportsAndLeaguesQuery } = matchApi;
