import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DatePicker from '../components/DatePicker';
import FilterModal from '../components/FilterModal';
import MatchCard from '../components/MatchCard';
import { Match } from '../models';
import { useGetAllSportsAndLeaguesQuery, useGetMatchesQuery } from '../services/matchApi';
const PAGE_SIZE = 20;

const MatchListScreen = () => {
  const [offset, setOffset] = useState(0);
  const [selectedTournamentIds, setSelectedTournamentIds] = useState<number[]>([]);
  const [isFilterVisible, setFilterVisible] = useState(false);
  
  // New state for Date filtering
  const today = useMemo(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);
  const [selectedDate, setSelectedDate] = useState(today);

  // Timezone for the API
  const timezone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone || 'Australia/Sydney', []);

  // Fetch matches with RTK Query
  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetMatchesQuery({
    limit: PAGE_SIZE,
    offset,
    timezone,
    todate: selectedDate,
    tournament_ids: selectedTournamentIds.length > 0 ? selectedTournamentIds.join(',') : undefined,
  });
  const matches = data?.matches || [];
  const totalCount = data?.total || 0;

  // Fetch filters (for names in chips and modal)
  const { data: sports = [] } = useGetAllSportsAndLeaguesQuery();

  // Extract selected names for chips
  const selectedTournaments = useMemo(() => {
    const list: string[] = [];
    sports.forEach(sport => {
      sport.tournaments.forEach(t => {
        if (selectedTournamentIds.includes(t.id)) {
          list.push(t.name);
        }
      });
    });
    return list;
  }, [sports, selectedTournamentIds]);

  const handleLoadMore = useCallback(() => {
    // Correct infinite scroll condition: if we haven't fetched all matches yet
    if (!isFetching && matches.length < totalCount) {
      setOffset(prev => prev + PAGE_SIZE);
    }
  }, [isFetching, matches.length, totalCount]);

  const handleRefresh = useCallback(() => {
    setOffset(0);
    // Force a refetch if we are already at offset 0
    if (offset === 0) refetch();
  }, [refetch, offset]);

  const handleApplyFilters = useCallback((ids: number[]) => {
    setSelectedTournamentIds(ids);
    setOffset(0);
  }, []);

  const handleDateSelect = useCallback((date: string) => {
    setSelectedDate(date);
    setOffset(0);
  }, []);

  const removeFilter = useCallback((name: string) => {
    const idToRemove = sports.flatMap(s => s.tournaments).find(t => t.name === name)?.id;
    if (idToRemove) {
      setSelectedTournamentIds(prev => prev.filter(id => id !== idToRemove));
      setOffset(0);
    }
  }, [sports, setSelectedTournamentIds, setOffset]);

  const renderItem = useCallback(({ item }: { item: Match }) => <MatchCard item={item} />, []);

  const ListFooterComponent = useCallback(() => {
    if (isFetching && offset > 0) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color="#3F51B5" />
        </View>
      );
    }
    return <View style={styles.listFooter} />;
  }, [isFetching, offset]);

  if (isError) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.errorText}>Something went wrong!</Text>
        <TouchableOpacity onPress={handleRefresh} style={styles.retryBtn}>
          <Text style={styles.retryBtnText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Date Picker Section */}
      <DatePicker selectedDate={selectedDate} onDateSelect={handleDateSelect} />

      {/* Filter Chips Section */}
      <View style={styles.filterRow}>
        <TouchableOpacity 
          style={styles.filterMenuBtn} 
          onPress={() => setFilterVisible(true)}
        >
          <Text style={styles.filterBtnText}>Filters</Text>
          <View style={styles.filterIconStyle} />
        </TouchableOpacity>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.chipsScroll}
        >
          <View style={[styles.chip, selectedTournamentIds.length === 0 && styles.activeChip]}>
            <Text style={[styles.chipText, selectedTournamentIds.length === 0 && styles.activeChipText]}>All</Text>
            {selectedTournamentIds.length > 0 && (
              <TouchableOpacity onPress={() => setSelectedTournamentIds([])}>
                 <Text style={styles.chipClose}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          {selectedTournaments.map(name => (
            <View key={name} style={[styles.chip, styles.activeChip]}>
              <Text style={styles.activeChipText} numberOfLines={1}>{name}</Text>
              <TouchableOpacity onPress={() => removeFilter(name)}>
                <Text style={styles.chipClose}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Match List */}
      {isLoading && offset === 0 ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#3F51B5" />
        </View>
      ) : (
        <FlatList
          data={matches}
          keyExtractor={item => `match-${item.id}`}
          renderItem={renderItem}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={ListFooterComponent}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isFetching && offset === 0} onRefresh={handleRefresh} />
          }
        />
      )}

      <FilterModal
        visible={isFilterVisible}
        onClose={() => setFilterVisible(false)}
        sports={sports}
        onApply={handleApplyFilters}
        currentSelection={selectedTournamentIds}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#EFEFEF',
    backgroundColor: '#FFFFFF',
  },
  filterMenuBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
    height: 28,
  },
  filterBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginRight: 6,
  },
  filterIconStyle: {
    width: 16,
    height: 12,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#333',
    justifyContent: 'center',
  },
  chipsScroll: {
    paddingLeft: 4,
  },
  chip: {
    height: 32,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  activeChip: {
    backgroundColor: '#3D5AFE',
    borderColor: '#3D5AFE',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#757575',
  },
  activeChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
    marginRight: 8,
    maxWidth: 150,
  },
  chipClose: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
  },
  listContent: {
    paddingBottom: 24,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  listFooter: {
    height: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 16,
    color: '#E53E3E',
    fontWeight: '600',
    marginBottom: 16,
  },
  retryBtn: {
    backgroundColor: '#3F51B5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryBtnText: {
    color: 'white',
    fontWeight: '700',
  },
});

export default React.memo(MatchListScreen);
