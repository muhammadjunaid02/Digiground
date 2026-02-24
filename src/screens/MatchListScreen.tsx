/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FilterModal from '../components/FilterModal';
import MatchCard from '../components/MatchCard';
import { useMatchList } from '../hooks/useMatchList';
import { Match } from '../models';

const MatchListScreen = () => {
  const {
    matches,
    loading,
    error,
    filters,
    loadMore,
    applyFilters,
    selectedTournamentIds,
  } = useMatchList();

  const [isFilterVisible, setFilterVisible] = useState(false);

  const renderItem = ({ item }: { item: Match }) => <MatchCard item={item} />;

  const ListFooterComponent = () => {
    if (loading && matches.length > 0) {
      return (
        <ActivityIndicator
          style={{ margin: 20 }}
          size="large"
          color="#0000ff"
        />
      );
    }
    return null;
  };

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text>{error}</Text>
        <TouchableOpacity onPress={() => {}} style={styles.retryBtn}>
          <Text>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Match Schedule</Text>
        <TouchableOpacity
          onPress={() => setFilterVisible(true)}
          style={styles.filterBtn}
        >
          <Text style={styles.filterBtnText}>Filters</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={matches}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={ListFooterComponent}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" />
          ) : (
            <Text style={styles.emptyText}>No matches found</Text>
          )
        }
        contentContainerStyle={styles.listContent}
      />

      <FilterModal
        visible={isFilterVisible}
        onClose={() => setFilterVisible(false)}
        sports={filters}
        onApply={applyFilters}
        currentSelection={selectedTournamentIds}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 15,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  filterBtn: {
    backgroundColor: '#007bff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryBtn: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#999',
  },
});

export default MatchListScreen;
