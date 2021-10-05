import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { ActivityIndicator } from 'react-native-paper';
import CategoryDetailsHeader from './CategoryDetailsHeader';
import { BackgroundGray } from '../../../../assets/Colors';
import EventCards from './eventCards/EventCards';
import PillButton from '../../../common/PillButton';
import commonStyles from '../../../../assets/commonStyles';
import FilterBar from '../../../components/FilterBar';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    backgroundColor: BackgroundGray,
  },
  filtersScroll: {
    flexDirection: 'row',
    flexGrow: 1,
    marginRight: 5,
    paddingBottom: 7,
  },
});

function CategoryDetails() {
  const route = useRoute();
  const { category } = route.params;
  const { loadingEvents, events } = useSelector(state => ({
    loadingEvents: state.events.loadingEvents,
    events: state.events.events,
  }));

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

  return (
    <View style={styles.container}>
      <CategoryDetailsHeader
        name={category.name}
        image={{ uri: category.imageUrl }}
      />
      <FilterBar
        left={
          <ScrollView style={styles.filtersScroll} horizontal>
            {filters.map(filter => (
              <PillButton selected={filter.selected} text={filter.text} />
            ))}
          </ScrollView>
        }
        right={
          <View style={[commonStyles.rowSpaceBetween, { paddingBottom: 7 }]}>
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
        }
        text="Events Count"
      />
      {loadingEvents ? (
        <ActivityIndicator size="large" />
      ) : (
        <EventCards events={events} />
      )}
    </View>
  );
}

export default CategoryDetails;
