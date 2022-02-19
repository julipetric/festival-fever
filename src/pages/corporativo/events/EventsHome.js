import { Ionicons } from '@expo/vector-icons';
import { t } from 'i18n-js';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Title } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';
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

function EventsHome() {
  const navigation = useNavigation();

  const { events, categories, ticketSegments } = useSelector(state => ({
    events: state.firestore.ordered.events,
    categories: state.firestore.ordered.categories,
    ticketSegments: state.firestore.ordered.ticketSegments,
  }));

  const ticketSegmentsQuery = {
    collection: 'ticketSegments',
    where: events?.length
      ? ['eventId', 'in', events.map(event => event.id)]
      : undefined,
  };

  const ordersQuery = {
    collection: 'orders',
    where: ticketSegments
      ? [
          'purchasableId',
          'in',
          ticketSegments.map(segment => segment.purchasableId),
        ]
      : undefined,
  };

  const eventsWhere = [['active', '==', true]];

  if (FILTER_PAST_EVENTS) eventsWhere.push(['endDate', '>=', moment().unix()]);

  useFirestoreConnect(() => [
    {
      collection: 'events',
      where: eventsWhere,
      orderBy: ['startDate', 'asc'],
    },
    { collection: 'categories' },
    ticketSegmentsQuery,
    ordersQuery,
  ]);

  return events && categories ? (
    <FlatList
      contentContainerStyle={styles.contentContainer}
      data={events || []}
      scrollEnabled={false}
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
            onPress={() => navigation.push('EditEventInfo')}
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

export default EventsHome;
