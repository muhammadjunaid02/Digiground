import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Sport, Tournament } from '../models';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (ids: number[]) => void;
  sports: Sport[];
  currentSelection: number[];
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  sports,
  onApply,
  currentSelection,
}) => {
  const [selectedIds, setSelectedIds] = useState<number[]>(currentSelection);
  const [expandedSport, setExpandedSport] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSelection = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id],
    );
  };

  const toggleSportAll = (sport: Sport) => {
    const tournamentIds = sport.tournaments.map(t => t.id);
    const allSelected = tournamentIds.every(id => selectedIds.includes(id));

    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !tournamentIds.includes(id)));
    } else {
      setSelectedIds(prev => [...new Set([...prev, ...tournamentIds])]);
    }
  };

  const isSportFullySelected = (sport: Sport) => {
    return sport.tournaments.every(t => selectedIds.includes(t.id));
  };

  const clearAll = () => setSelectedIds([]);

  const handleApply = () => {
    onApply(selectedIds);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.bottomSheet}>
          <View style={styles.dragIndicator} />
          
          <View style={styles.header}>
            <Text style={styles.title}>FILTERS</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <TouchableOpacity onPress={clearAll} style={styles.resetBtn}>
              <Text style={styles.resetText}>↺ Reset all</Text>
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false}>
              {sports.map(sport => {
                const isExpanded = expandedSport === sport.id;
                const isFull = isSportFullySelected(sport);
                
                return (
                  <View key={sport.id} style={styles.sportSection}>
                    <TouchableOpacity
                      style={[styles.sportHeader, isExpanded && styles.sportHeaderExpanded]}
                      onPress={() => setExpandedSport(isExpanded ? null : sport.id)}
                    >
                      <View style={styles.sportTitleRow}>
                        <View style={styles.chevronIcon}>
                          <Text style={styles.chevronText}>{isExpanded ? '▼' : '▶'}</Text>
                        </View>
                        <Text style={styles.sportName}>{sport.sportName}</Text>
                      </View>
                      
                      <TouchableOpacity
                        style={[styles.sportCheckbox, isFull && styles.sportCheckboxSelected]}
                        onPress={() => toggleSportAll(sport)}
                      >
                        {isFull && <Text style={styles.checkMark}>✓</Text>}
                      </TouchableOpacity>
                    </TouchableOpacity>

                    {isExpanded && (
                      <View style={styles.expandedContent}>
                        <View style={styles.searchContainer}>
                          <TextInput
                            style={styles.searchInput}
                            placeholder="Search"
                            placeholderTextColor="#ccc"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                          />
                        </View>
                        
                        {sport.tournaments
                          .filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
                          .map(tournament => {
                            const isSelected = selectedIds.includes(tournament.id);
                            return (
                              <TouchableOpacity
                                key={tournament.id}
                                style={styles.leagueItem}
                                onPress={() => toggleSelection(tournament.id)}
                              >
                                <Text style={styles.leagueName}>{tournament.name}</Text>
                                <View style={[styles.leagueCheckbox, isSelected && styles.leagueCheckboxSelected]}>
                                  {isSelected && <Text style={styles.checkMarkSmall}>✓</Text>}
                                </View>
                              </TouchableOpacity>
                            );
                          })}
                      </View>
                    )}
                  </View>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
              <Text style={styles.applyBtnText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#fff',
    height: '90%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 0,
  },
  header: {
    backgroundColor: '#333',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
    fontStyle: 'italic',
  },
  closeBtn: {
    padding: 5,
  },
  closeIcon: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '300',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  resetBtn: {
    alignSelf: 'flex-end',
    paddingVertical: 12,
  },
  resetText: {
    color: '#3F51B5',
    fontSize: 13,
    fontWeight: '600',
  },
  sportSection: {
    marginBottom: 8,
  },
  sportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#eee',
    borderRadius: 8,
  },
  sportHeaderExpanded: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: '#ddd',
  },
  sportTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chevronIcon: {
    marginRight: 10,
  },
  chevronText: {
    fontSize: 10,
    color: '#666',
  },
  sportName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  sportCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sportCheckboxSelected: {
    backgroundColor: '#4DB6AC', // Greenish from screenshot
    borderColor: '#4DB6AC',
  },
  checkMark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
  },
  expandedContent: {
    paddingBottom: 10,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#ddd',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  searchContainer: {
    padding: 10,
  },
  searchInput: {
    height: 36,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#fff',
  },
  leagueItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  leagueName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  leagueCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leagueCheckboxSelected: {
    backgroundColor: '#3F51B5',
    borderColor: '#3F51B5',
  },
  checkMarkSmall: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  applyBtn: {
    backgroundColor: '#3F51B5',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default FilterModal;
