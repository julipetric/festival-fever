import { Ionicons } from '@expo/vector-icons';
import { t } from 'i18n-js';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Title } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useFirestore, useFirestoreConnect } from 'react-redux-firebase';
import moment from 'moment';
import StyledButton from '../../components/StyledButton';
import { PagePaddingHorizontal } from '../../../assets/UIConstants';
import EventItem from './EventItem';

const FILTER_PAST_EVENTS = false;

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: 10,
    width: '100%',
  },
});

function MyEvents() {
  const navigation = useNavigation();
  const firestore = useFirestore();

  const { events, categories, ticketSegments, ticketSegmentsPurchasables } =
    useSelector(state => ({
      events: state.firestore.ordered.activeEvents,
      categories: state.firestore.ordered.categories,
      ticketSegments: state.firestore.ordered.eventsTicketSegments,
      ticketSegmentsPurchasables:
        state.firestore.ordered.ticketSegmentsPurchasables,
    }));

  const eventsWhere = ['active', '==', true];

  if (FILTER_PAST_EVENTS) eventsWhere.push(['endDate', '>=', moment().unix()]);

  useFirestoreConnect(() => {
    const array = [
      { collection: 'categories' },
      {
        collection: 'events',
        where: eventsWhere,
        orderBy: ['startDate', 'asc'],
        storeAs: 'activeEvents',
      },
    ];
    if (events?.length)
      array.push({
        collection: 'ticketSegments',
        where: ['eventId', 'in', events.map(event => event.id)],
        storeAs: 'eventsTicketSegments',
      });
    if (ticketSegments?.length)
      array.push({
        collection: 'purchasables',
        where: [
          firestore.FieldPath.documentId(),
          'in',
          ticketSegments.map(segment => segment.purchasableId),
        ],
        storeAs: 'ticketSegmentsPurchasables',
      });
    return array;
  });

  return events &&
    categories &&
    ticketSegments &&
    ticketSegmentsPurchasables ? (
    <FlatList
      contentContainerStyle={styles.contentContainer}
      data={events || []}
      keyExtractor={item => item.id}
      renderItem={({ item: event }) => (
        <EventItem
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
          <Title>{t('myEvents')}</Title>
          <StyledButton
            icon={({ color }) => (
              <Ionicons name="add-circle" size={26} color={color} />
            )}
            onPress={() =>
              navigation.navigate(t('eventInfo'), { newEvent: true })
            }
          >
            {t('addEvent')}
          </StyledButton>
        </View>
      )}
    />
  ) : (
    <ActivityIndicator style={{ flex: 1 }} />
  );
}

export default MyEvents;
