import { flatten } from 'lodash';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { BackgroundGray } from '../../../assets/Colors';
import { demoEvents } from '../../../mocks/eventsDemoData';
import FavouriteEventCard from './FavouriteEventCard';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    backgroundColor: BackgroundGray,
  },
  scrollView: { width: '100%', marginTop: 8 },
});

const repeatedEvents = flatten([
  demoEvents,
  demoEvents,
  demoEvents,
  demoEvents,
  demoEvents,
]);

function FavoritesScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={repeatedEvents}
        renderItem={({ item }) => <FavouriteEventCard event={item} />}
        style={styles.scrollView}
      />
    </View>
  );
}

export default FavoritesScreen;
