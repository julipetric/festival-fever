import { useNavigation } from '@react-navigation/native';
import { t } from 'i18n-js';
import { isEqual } from 'lodash';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { ActivityIndicator, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import {
  useFirebase,
  useFirestore,
  useFirestoreConnect,
} from 'react-redux-firebase';
import { TransparentBackdrop } from '../../../assets/Colors';
import { PagePaddingHorizontal } from '../../../assets/UIConstants';
import { setSelectedEvent } from '../../../redux/myStoreSlice';
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
  const firebase = useFirebase();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { event, ticketSegments, eventTickets, requesting } = useSelector(
    state => ({
      event: state.myStore.selectedEvent,
      ticketSegments: state.firestore.ordered.selectedEventTicketSegments,
      eventTickets: state.firestore.ordered.eventTickets,
      requesting: state.firestore.status.requesting,
    })
  );

  const [modifiedEvent, setModifiedEvent] = useState({ ...event });

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

  useEffect(() => {
    navigation.addListener('beforeRemove', () => {
      if (!isEqual(modifiedEvent, event)) {
        dispatch(setSelectedEvent(modifiedEvent));
      }
    });
  }, [dispatch, event, modifiedEvent, navigation]);

  const loading = requesting.eventTickets;

  async function setItemActive(item, value) {
    const saveItem = { ...item, active: value };
    delete saveItem.id;
    const saveEvent = { ...event };
    delete saveEvent.category;
    delete saveEvent.id;
    saveEvent.lastEditBy = {
      userId: firebase.auth()?.currentUser?.uid,
      timestamp: modifiedEvent().unix(),
    };
    await Promise.all([
      firestore.collection('purchasables').doc(item.id).update(saveItem),
      firestore.collection('events').doc(event.id).update(saveEvent),
    ]);
    setModifiedEvent({ ...event, ...saveEvent });
  }

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
          setItemActive={value =>
            setItemActive(
              eventTickets?.find(e => e.id === item.purchasableId),
              value
            )
          }
        />
      )}
    />
  ) : (
    <ActivityIndicator size="large" style={{ paddingTop: 30 }} />
  );
}

export default TicketSegments;
