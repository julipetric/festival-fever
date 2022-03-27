import { useFocusEffect } from '@react-navigation/native';
import { t } from 'i18n-js';
import React, { useCallback, useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  View,
} from 'react-native';
import { ActivityIndicator, Menu, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useFirebase, useFirestore } from 'react-redux-firebase';
import { TransparentBackdrop } from '../../../assets/Colors';
import { PagePaddingHorizontal } from '../../../assets/UIConstants';
import {
  setSelectedEvent,
  setTicketClipboard,
} from '../../../redux/myStoreSlice';
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

  const { event, ticketClipboard } = useSelector(state => ({
    event: state.myStore.selectedEvent,
    ticketClipboard: state.myStore.ticketClipboard,
  }));

  const [anchor, setAnchor] = useState();
  const [loading, setLoading] = useState(false);
  const [ticketSegments, setTicketSegments] = useState();
  const [ticketSegmentsPurchasables, setTicketSegmentsPurchasables] =
    useState();

  const fetchTicketSegments = useCallback(async () => {
    setLoading(true);
    const array = [];
    (
      await firestore
        .collection('ticketSegments')
        .where('eventId', '==', event.id)
        .get()
    ).forEach(doc => array.push({ ...doc.data(), id: doc.id }));
    setTicketSegments(array);
    if (array?.length) {
      const result = [];
      (
        await firestore
          .collection('purchasables')
          .where(
            firestore.FieldPath.documentId(),
            'in',
            array.map(segment => segment.purchasableId)
          )
          .get()
      ).forEach(doc => result.push({ ...doc.data(), id: doc.id }));

      setTicketSegmentsPurchasables(result);
    } else {
      setTicketSegmentsPurchasables([]);
    }
    setLoading(false);
  }, [event.id, firestore]);

  useFocusEffect(
    useCallback(() => {
      fetchTicketSegments();
    }, [fetchTicketSegments])
  );

  async function setItemActive(item, value) {
    const saveItem = { ...item, active: value };
    delete saveItem.id;
    const saveEvent = { ...event };
    delete saveEvent.category;
    delete saveEvent.id;
    saveEvent.lastEditBy = {
      userId: firebase.auth()?.currentUser?.uid,
      timestamp: moment().unix(),
    };
    await Promise.all([
      firestore.collection('purchasables').doc(item.id).update(saveItem),
      firestore.collection('events').doc(event.id).update(saveEvent),
    ]);
    dispatch(setSelectedEvent({ ...event, ...saveEvent }));
  }

  async function addItem(item) {
    setLoading(true);
    try {
      const savePurchasable = {
        ...item,
        active: true,
        sold: 0,
        timestamp: moment().unix(),
      };
      const purchasableId = (
        await firestore.collection('purchasables').add(savePurchasable)
      ).id;
      const saveTicketSegment = { eventId: event.id, purchasableId };
      const ticketSegmentId = (
        await firestore.collection('ticketSegments').add(saveTicketSegment)
      ).id;
      const saveEvent = {
        ...event,
        lastEditBy: {
          userId: firebase.auth()?.currentUser?.uid,
          timestamp: moment().unix(),
        },
      };
      delete saveEvent.category;
      delete saveEvent.id;
      await firestore.collection('events').doc(event.id).update(saveEvent);
      setTicketSegmentsPurchasables([
        { ...savePurchasable, id: purchasableId },
        ...ticketSegmentsPurchasables,
      ]);
      setTicketSegments([
        { ...saveTicketSegment, id: ticketSegmentId },
        ...ticketSegments,
      ]);
      dispatch(setSelectedEvent({ ...event, ...saveEvent }));
      setLoading(false);
    } catch (e) {
      Alert.alert(t('error'), JSON.stringify(e));
      setLoading(false);
    }
  }

  async function onDuplicateProduct() {
    const savePurchasable = {
      ...ticketSegmentsPurchasables?.find(
        e => e.id === anchor?.item?.purchasableId
      ),
    };
    savePurchasable.name = `${savePurchasable.name} - Copy`;
    delete savePurchasable.id;
    delete savePurchasable.eventId;
    await addItem(savePurchasable);
  }

  async function onDeleteProduct() {
    setLoading(true);
    try {
      const saveEvent = {
        ...event,
        lastEditBy: {
          userId: firebase.auth()?.currentUser?.uid,
          timestamp: moment().unix(),
        },
      };
      delete saveEvent.category;
      delete saveEvent.id;
      await Promise.all([
        firestore
          .collection('purchasables')
          .doc(anchor?.item?.purchasableId)
          .delete(),
        firestore.collection('ticketSegments').doc(anchor?.item?.id).delete(),
        firestore.collection('events').doc(event.id).update(saveEvent),
      ]);
      setTicketSegments(
        [...ticketSegments].filter(e => e.id !== anchor?.item?.id)
      );
      dispatch(setSelectedEvent({ ...event, ...saveEvent }));
    } catch (e) {
      Alert.alert(t('error'), JSON.stringify(e));
    } finally {
      setAnchor(undefined);
      setLoading(false);
    }
  }

  function onCopyProduct() {
    dispatch(
      setTicketClipboard(
        ticketSegmentsPurchasables?.find(
          e => e.id === anchor?.item?.purchasableId
        )
      )
    );
    setAnchor(undefined);
  }

  async function onPasteProduct() {
    const savePurchasable = { ...ticketClipboard };
    savePurchasable.name = `${savePurchasable.name} - Copy`;
    delete savePurchasable.id;
    savePurchasable.active = false;
    savePurchasable.sold = 0;
    await addItem(savePurchasable);
  }

  return (
    <View style={{ backgroundColor: TransparentBackdrop, flex: 1 }}>
      {ticketSegments && !loading ? (
        <>
          <TouchableOpacity
            onLongPress={e =>
              setAnchor({
                position: {
                  x: e.nativeEvent.pageX,
                  y: e.nativeEvent.pageY,
                },
              })
            }
            style={{ flex: 1 }}
          >
            <FlatList
              contentContainerStyle={styles.contentContainer}
              data={ticketSegments || []}
              ListEmptyComponent={() => (
                <Text style={{ paddingTop: 10 }}>{t('noTicketSegments')}</Text>
              )}
              renderItem={({ item }) => (
                <TicketSegmentItem
                  item={item}
                  purchasable={ticketSegmentsPurchasables?.find(
                    e => e.id === item.purchasableId
                  )}
                  setItemActive={value =>
                    setItemActive(
                      ticketSegmentsPurchasables?.find(
                        e => e.id === item.purchasableId
                      ),
                      value
                    )
                  }
                  setAnchor={setAnchor}
                />
              )}
            />
          </TouchableOpacity>
          <Menu
            visible={anchor !== undefined && !anchor?.item}
            onDismiss={() => setAnchor(undefined)}
            anchor={anchor?.position}
          >
            <Menu.Item
              title={t('paste')}
              icon="content-paste"
              onPress={onPasteProduct}
              disabled={!ticketClipboard}
            />
          </Menu>
          <Menu
            visible={anchor?.item !== undefined}
            onDismiss={() => setAnchor(undefined)}
            anchor={anchor?.position}
          >
            <Menu.Item
              title={t('duplicate')}
              icon="content-duplicate"
              onPress={onDuplicateProduct}
            />
            <Menu.Item
              title={t('copy')}
              icon="content-copy"
              onPress={onCopyProduct}
            />
            <Menu.Item
              title={t('delete')}
              icon="delete"
              disabled={anchor?.item?.sold > 0}
              onPress={onDeleteProduct}
            />
          </Menu>
        </>
      ) : (
        <ActivityIndicator size="large" style={{ paddingTop: 30 }} />
      )}
    </View>
  );
}

export default TicketSegments;
