import React, { useState } from 'react';
import {
  Button,
  FlatList,
  Modal,
  StyleSheet,
  Text,
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

  const toggleSelection = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id],
    );
  };

  const handleApply = () => {
    onApply(selectedIds);
    onClose();
  };

  const renderItem = ({ item }: { item: Tournament }) => (
    <TouchableOpacity
      style={[
        styles.item,
        selectedIds.includes(item.id) && styles.selectedItem,
      ]}
      onPress={() => toggleSelection(item.id)}
    >
      <Text style={styles.itemText}>{item.name}</Text>
      {selectedIds.includes(item.id) && <Text style={styles.checkMark}>✓</Text>}
    </TouchableOpacity>
  );

  // Flattening tournaments for the list or using SectionList
  const allTournaments = sports.flatMap(sport =>
    sport.tournaments.map(t => ({ ...t, sportName: sport.sportName })),
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Filters</Text>
            <TouchableOpacity onPress={onClose}>
              <Text>Close</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={allTournaments}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
          />

          <View style={styles.footer}>
            <Button title="Apply Filters" onPress={handleApply} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  contentContainer: {
    backgroundColor: 'white',
    height: '70%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectedItem: {
    backgroundColor: '#f0f8ff',
  },
  itemText: {
    fontSize: 14,
  },
  checkMark: {
    color: 'blue',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 10,
  },
});

export default FilterModal;
