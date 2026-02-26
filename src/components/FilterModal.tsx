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
    height: '92%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  dragIndicator: {
    width: 36,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
  },
  header: {
    backgroundColor: '#333',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 0.5,
  },
  closeBtn: {
    padding: 4,
  },
  closeIcon: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '300',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  resetBtn: {
    alignSelf: 'flex-end',
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  resetText: {
    color: '#3D5AFE',
    fontSize: 14,
    fontWeight: '600',
  },
  sportSection: {
    marginBottom: 10,
  },
  sportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  sportHeaderExpanded: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: '#EEEEEE',
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
    color: '#757575',
  },
  sportName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
  },
  sportCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#BDBDBD',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sportCheckboxSelected: {
    backgroundColor: '#4CAF50', // Brighter green for selected sports
    borderColor: '#4CAF50',
  },
  checkMark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
  },
  expandedContent: {
    paddingBottom: 8,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#EEEEEE',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: '#FAFAFA',
  },
  searchContainer: {
    padding: 12,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#fff',
  },
  leagueItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
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
    borderColor: '#BDBDBD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leagueCheckboxSelected: {
    backgroundColor: '#3D5AFE',
    borderColor: '#3D5AFE',
  },
  checkMarkSmall: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  applyBtn: {
    backgroundColor: '#3D5AFE',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  applyBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default FilterModal;
