import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useRoute } from '@react-navigation/core';
import CategoryDetailsHeader from './CategoryDetailsHeader';
import EventsFilterBar from './EventsFilterBar';
import { BackgroundGray } from '../../../../assets/Colors';
import EventCards from './eventCards/EventCards';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    backgroundColor: BackgroundGray,
  },
});

function CategoryDetails() {
  const route = useRoute();
  const { category } = route.params;

  return (
    <View style={styles.container}>
      <CategoryDetailsHeader name={category.name} image={category.image} />
      <EventsFilterBar />
      <EventCards events={category.events} />
    </View>
  );
}

export default CategoryDetails;
