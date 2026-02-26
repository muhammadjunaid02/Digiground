import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface DatePickerProps {
  selectedDate: string; // YYYY-MM-DD
  onDateSelect: (date: string) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ selectedDate, onDateSelect }) => {
  const [showPicker, setShowPicker] = React.useState(false);

  const dates = useMemo(() => {
    const list = [];
    const today = new Date();
    // Generate 14 days from today
    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      list.push({
        full: `${year}-${month}-${day}`,
        dayName: ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'][date.getDay()],
        dayNum: date.getDate(),
        monthName: date.toLocaleString('default', { month: 'long' }),
        year: date.getFullYear(),
      });
    }
    return list;
  }, []);

  const currentMonthYear = useMemo(() => {
    const activeDate = dates.find(d => d.full === selectedDate) || dates[0];
    return `${activeDate.monthName} ${activeDate.year}`;
  }, [selectedDate, dates]);

  const handlePickerChange = (event: DateTimePickerEvent, date?: Date) => {
    setShowPicker(false);
    if (date && event.type === 'set') {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      onDateSelect(formattedDate);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.header}
        onPress={() => setShowPicker(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.monthText}>{currentMonthYear}</Text>
        <View style={styles.chevron} />
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={new Date(selectedDate)}
          mode="date"
          display="default"
          onChange={handlePickerChange}
        />
      )}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {dates.map(item => {
          const isSelected = item.full === selectedDate;
          return (
            <TouchableOpacity
              key={item.full}
              style={styles.dateItem}
              onPress={() => onDateSelect(item.full)}
              activeOpacity={0.7}
            >
              <Text style={styles.dayName}>{item.dayName}</Text>
              <View style={[styles.dayCircle, isSelected && styles.selectedCircle]}>
                <Text style={[styles.dayNum, isSelected && styles.selectedDayNum]}>
                  {item.dayNum}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  monthText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
  },
  chevron: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#333',
    marginLeft: 6,
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  dateItem: {
    alignItems: 'center',
    marginHorizontal: 10,
    width: 40,
  },
  dayName: {
    fontSize: 11,
    color: '#999',
    marginBottom: 6,
    fontWeight: '500',
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCircle: {
    backgroundColor: '#3D5AFE', // Vibrant indigo for selection
  },
  dayNum: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  selectedDayNum: {
    color: '#fff',
  },
});

export default DatePicker;
