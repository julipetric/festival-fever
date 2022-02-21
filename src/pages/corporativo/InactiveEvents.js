import { t } from 'i18n-js';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text, Title } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';
import { PagePaddingHorizontal } from '../../assets/UIConstants';
import EventListItem from '../components/EventListItem';

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: 10,
    width: '100%',
  },
});

function InactiveEvents() {
  const { inactiveEvents, categories } = useSelector(state => ({
    inactiveEvents: state.firestore.ordered.inactiveEvents,
    categories: state.firestore.ordered.categories,
  }));

  useFirestoreConnect(() => [
    {
      collection: 'events',
      where: [
        // ['endDate', '<', moment().unix()],
        ['active', '==', false],
      ],
      orderBy: ['endDate', 'desc'],
      storeAs: 'inactiveEvents',
    },
    { collection: 'categories' },
  ]);

  return inactiveEvents && categories ? (
    <FlatList
      contentContainerStyle={styles.contentContainer}
      data={inactiveEvents || []}
      scrollEnabled={false}
      keyExtractor={item => item.id}
      renderItem={({ item: event }) => (
        <EventListItem
          event={event}
          category={categories.find(
            category => category.id === event.categoryId
          )}
        />
      )}
      ListHeaderComponent={() => (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: PagePaddingHorizontal,
          }}
        >
          <Title>{t('inactiveEvents')}</Title>
        </View>
      )}
      ListEmptyComponent={() => (
        <Text style={{ color: 'white', padding: 25, fontSize: 16 }}>
          {t('noInactiveEvents')}
        </Text>
      )}
    />
  ) : (
    <ActivityIndicator style={{ flex: 1 }} />
  );
}

export default InactiveEvents;
