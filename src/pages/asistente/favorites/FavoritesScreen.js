import { t } from 'i18n-js';
import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { ActivityIndicator, Subheading } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useFirestore, useFirestoreConnect } from 'react-redux-firebase';
import EventListItem from '../../components/EventListItem';

const styles = StyleSheet.create({
  scrollView: { width: '100%', marginTop: 8 },
});

function FavoritesScreen() {
  const firestore = useFirestore();

  const { favorites, events, categories } = useSelector(state => ({
    favorites: state.firebase.profile.favorites,
    events: state.firestore.ordered.favoriteEvents,
    categories: state.firestore.ordered.favoriteCategories,
  }));

  useFirestoreConnect(() => {
    const array = [];
    array.push({
      collection: 'events',
      where: [
        firestore.FieldPath.documentId(),
        'in',
        favorites?.length ? favorites : ['dummyId'],
      ],
      storeAs: 'favoriteEvents',
    });
    if (events?.length)
      array.push({
        collection: 'categories',
        where: [
          firestore.FieldPath.documentId(),
          'in',
          events.map(e => e.categoryId),
        ],
        storeAs: 'favoriteCategories',
      });
    return array;
  });

  // eslint-disable-next-line no-nested-ternary
  return favorites && events && categories ? (
    events?.length ? (
      <FlatList
        data={events}
        renderItem={({ item }) => (
          <EventListItem
            event={item}
            category={categories.find(e => e.id === item.categoryId)}
          />
        )}
        style={styles.scrollView}
      />
    ) : (
      <Subheading style={{ alignSelf: 'center', paddingTop: 30 }}>
        {t('noEventsAdded')}
      </Subheading>
    )
  ) : (
    <ActivityIndicator size="large" style={{ paddingTop: 30 }} />
  );
}

export default FavoritesScreen;
