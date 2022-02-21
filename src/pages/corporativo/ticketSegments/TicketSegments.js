import { t } from 'i18n-js';
import { head } from 'lodash';
import React from 'react';
import { StyleSheet } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { ActivityIndicator, Text } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useFirestore, useFirestoreConnect } from 'react-redux-firebase';
import { TransparentBackdrop } from '../../../assets/Colors';
import { PagePaddingHorizontal } from '../../../assets/UIConstants';
import TicketSegmentItem from './TicketSegmentItem';

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: 10,
    width: '100%',
    paddingHorizontal: PagePaddingHorizontal,
  },
});

function TicketSegments() {
  const firestore = useFirestore();

  const { event, ticketSegments, eventTickets, requesting } = useSelector(
    state => ({
      event: head(state.firestore.ordered.selectedEvent),
      ticketSegments: state.firestore.ordered.selectedEventTicketSegments,
      eventTickets: state.firestore.ordered.eventTickets,
      requesting: state.firestore.status.requesting,
    })
  );

  useFirestoreConnect(() => {
    const array = [
      {
        collection: 'ticketSegments',
        where: ['eventId', '==', event.id],
        storeAs: 'selectedEventTicketSegments',
      },
    ];
    if (ticketSegments?.length)
      array.push({
        collection: 'purchasables',
        where: [
          firestore.FieldPath.documentId(),
          'in',
          ticketSegments.map(segment => segment.purchasableId),
        ],
        storeAs: 'eventTickets',
      });
    return array;
  });

  const loading = requesting.eventTickets;

  return ticketSegments &&
    !loading &&
    (!ticketSegments?.length || eventTickets) ? (
    <FlatList
      style={{ backgroundColor: TransparentBackdrop }}
      contentContainerStyle={styles.contentContainer}
      data={ticketSegments || []}
      ListEmptyComponent={() => (
        <Text style={{ paddingTop: 10 }}>{t('noTicketSegments')}</Text>
      )}
      renderItem={({ item }) => (
        <TicketSegmentItem
          item={item}
          purchasable={eventTickets?.find(e => e.id === item.purchasableId)}
          setItemActive={() => {}}
        />
      )}
    />
  ) : (
    <ActivityIndicator size="large" style={{ paddingTop: 30 }} />
  );
}

export default TicketSegments;
