import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { PinkPrimary } from '../../../../assets/Colors';
import PillButton from '../../../common/PillButton';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  counter: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  line: {
    backgroundColor: PinkPrimary,
    flexGrow: 1,
    height: 1,
  },
  eventsCount: {
    paddingHorizontal: 10,
  },
  rowSpaceBetween: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterButton: {
    backgroundColor: PinkPrimary,
    paddingVertical: 3,
    paddingHorizontal: 9,
    marginHorizontal: 3,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersScroll: {
    flexDirection: 'row',
    flexGrow: 1,
    marginRight: 5,
    paddingBottom: 7,
  },
});

const filters = [
  { text: 'Filter', id: 'filter', selected: true },
  { text: 'Filter', id: 'filter' },
  { text: 'Filter', id: 'filter' },
  { text: 'Filter', id: 'filter', selected: true },
  { text: 'Filter', id: 'filter' },
  { text: 'Filter', id: 'filter' },
  { text: 'Filter', id: 'filter' },
  { text: 'Filter', id: 'filter', selected: true },
  { text: 'Filter', id: 'filter' },
];

function EventsFilterBar() {
  return (
    <View style={styles.container}>
      <View style={styles.counter}>
        <View style={styles.line} />
        <Text style={styles.eventsCount}>Events Count</Text>
        <View style={styles.line} />
      </View>
      <View style={styles.rowSpaceBetween}>
        <ScrollView style={styles.filtersScroll} horizontal>
          {filters.map(filter => (
            <PillButton selected={filter.selected} text={filter.text} />
          ))}
        </ScrollView>
        <View style={[styles.rowSpaceBetween, { paddingBottom: 7 }]}>
          <PillButton
            selected
            element={
              <MaterialCommunityIcons
                name="view-carousel"
                size={22}
                color="white"
              />
            }
          />
          <PillButton
            element={<FontAwesome5 name="th-list" size={16} color="white" />}
          />
        </View>
      </View>
    </View>
  );
}

export default EventsFilterBar;
