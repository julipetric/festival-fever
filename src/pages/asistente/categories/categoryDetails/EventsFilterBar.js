import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import PropTypes from 'prop-types';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { PinkPrimary } from '../../../../assets/Colors';

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

function FilterButton({ children, selected }) {
  return (
    <View style={[styles.filterButton, { opacity: selected ? 1 : 0.3 }]}>
      {children}
    </View>
  );
}

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
            <FilterButton selected={filter.selected}>
              <Text>{filter.text}</Text>
            </FilterButton>
          ))}
        </ScrollView>
        <View style={[styles.rowSpaceBetween, { paddingBottom: 7 }]}>
          <FilterButton selected>
            <MaterialCommunityIcons
              name="view-carousel"
              size={22}
              color="white"
            />
          </FilterButton>
          <FilterButton>
            <FontAwesome5 name="th-list" size={16} color="white" />
          </FilterButton>
        </View>
      </View>
    </View>
  );
}

FilterButton.defaultProps = {
  selected: false,
};

FilterButton.propTypes = {
  children: PropTypes.element.isRequired,
  selected: PropTypes.bool,
};

export default EventsFilterBar;
