/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useState } from 'react';
import { getAllSportsAndLeagues, getMatches } from '../api/client';
import { Match, Sport } from '../models';

const PAGE_SIZE = 20;

export const useMatchList = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [filters, setFilters] = useState<Sport[]>([]);
  const [selectedTournamentIds, setSelectedTournamentIds] = useState<number[]>(
    [],
  );
  const fetchMatches = useCallback(
    async (isRefresh: boolean = false) => {
      if (loading) return;
      setLoading(true);
      setError(null);

      try {
        const currentOffset = isRefresh ? 0 : offset;
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone; // Or hardcode 'Australia/Sydney'

        const params = {
          limit: PAGE_SIZE,
          offset: currentOffset,
          timezone,
          tournament_ids:
            selectedTournamentIds.length > 0
              ? selectedTournamentIds.join(',')
              : undefined,
        };

        const response = await getMatches(params);
        const newMatches = response.matches || []; // Assuming API returns { matches: [] }

        if (isRefresh) {
          setMatches(newMatches);
        } else {
          setMatches(prev => [...prev, ...newMatches]);
        }

        setOffset(currentOffset + newMatches.length);
        setHasMore(newMatches.length === PAGE_SIZE);
      } catch (err) {
        setError('Failed to load matches');
      } finally {
        setLoading(false);
      }
    },
    [loading, offset, selectedTournamentIds],
  );

  // Fetch initial data and filters
  useEffect(() => {
    fetchFilters();
    fetchMatches(true);
  }, [fetchMatches]);

  const fetchFilters = async () => {
    try {
      const response = await getAllSportsAndLeagues({ limit: 100 });
      setFilters(response); // Assuming response is Sport[]
    } catch (err: any) {
      console.log('Failed to load filters:', err.message);
    }
  };

  const applyFilters = (ids: number[]) => {
    setSelectedTournamentIds(ids);
    setOffset(0);
    setMatches([]);
    fetchMatches(true);
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchMatches(false);
    }
  };

  return {
    matches,
    loading,
    error,
    filters,
    fetchMatches,
    loadMore,
    applyFilters,
    selectedTournamentIds,
  };
};
