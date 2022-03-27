import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { t } from 'i18n-js';
import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Alert, View } from 'react-native';
import { ActivityIndicator, Menu, Subheading } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useFirebase, useFirestore } from 'react-redux-firebase';
import { TransparentBackdrop } from '../../../assets/Colors';
import {
  ListItemBorderRadius,
  PagePaddingHorizontal,
} from '../../../assets/UIConstants';
import { setSelectedEvent } from '../../../redux/myStoreSlice';
import { updateEventTimestamp } from '../../../utils';
import ComboItem from './ComboItem';

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingHorizontal: PagePaddingHorizontal,
  },
  productContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: ListItemBorderRadius,
    flexDirection: 'row',
  },
});

function EventCombos() {
  const firestore = useFirestore();
  const firebase = useFirebase();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { event } = useSelector(state => ({
    event: state.myStore?.selectedEvent,
  }));

  const [loading, setLoading] = useState(false);
  const [combos, setCombos] = useState([]);
  const [combosPurchasables, setCombosPurchasables] = useState();
  const [anchor, setAnchor] = useState();

  const fetchCombos = useCallback(async () => {
    setLoading(true);
    const array = [];
    (
      await firestore
        .collection('combos')
        .where('eventId', '==', event?.id)
        .get()
    ).forEach(doc => array.push({ ...doc.data(), id: doc.id }));
    if (array?.length) {
      const purchasables = [];
      (
        await firestore
          .collection('purchasables')
          .where(
            firestore.FieldPath.documentId(),
            'in',
            array.flatMap(combo => combo.purchasables.map(p => p.purchasableId))
          )
          .get()
      ).forEach(doc => purchasables.push({ ...doc.data(), id: doc.id }));
      setCombosPurchasables(purchasables);
    } else {
      setCombosPurchasables([]);
    }
    setCombos(array);
    setLoading(false);
  }, [event.id, firestore]);

  useFocusEffect(
    useCallback(() => {
      fetchCombos();
    }, [fetchCombos])
  );

  function onItemPress(item) {
    navigation.navigate(t('comboInfo'), { item });
  }

  async function setItemActive(item, value) {
    const saveItem = { ...item, active: value };
    delete saveItem.id;
    saveItem.purchasables = saveItem.purchasables.map(p => ({
      purchasableId: p.purchasableId,
      quantity: p.quantity,
    }));
    const [, updatedEvent] = await Promise.all([
      firestore.collection('combos').doc(item.id).update(saveItem),
      updateEventTimestamp(firestore, firebase, event),
    ]);
    dispatch(setSelectedEvent({ ...event, ...updatedEvent }));
  }

  async function addItem(item) {
    setLoading(true);
    try {
      const [comboRef, updatedEvent] = await Promise.all([
        firestore.collection('combos').add(item),
        updateEventTimestamp(firestore, firebase, event),
      ]);
      const comboId = comboRef.id;
      setCombos([{ ...item, id: comboId }, ...combos]);
      dispatch(setSelectedEvent({ ...event, ...updatedEvent }));
    } catch (e) {
      Alert.alert(t('error'), JSON.stringify(e));
    } finally {
      setAnchor(undefined);
      setLoading(false);
    }
  }

  async function onDuplicateProduct() {
    const savePurchasable = { ...anchor?.item };
    savePurchasable.name = `${savePurchasable.name} - Copy`;
    delete savePurchasable.id;
    savePurchasable.active = true;
    savePurchasable.sold = 0;
    await addItem(savePurchasable);
  }

  async function onDeleteProduct() {
    setLoading(true);
    try {
      const [, updatedEvent] = await Promise.all([
        firestore.collection('combos').doc(anchor?.item?.id).delete(),
        updateEventTimestamp(firestore, firebase, event),
      ]);
      setCombos([...combos].filter(p => p.id !== anchor?.item?.id));
      dispatch(setSelectedEvent({ ...event, ...updatedEvent }));
    } catch (e) {
      Alert.alert(t('error'), JSON.stringify(e));
    } finally {
      setAnchor(undefined);
      setLoading(false);
    }
  }

  const mappedCombos = combos?.map(e => ({
    ...e,
    purchasables: e.purchasables.map(p => ({
      ...p,
      item: combosPurchasables?.find(c => c.id === p.purchasableId),
    })),
  }));

  return (
    <View style={{ backgroundColor: TransparentBackdrop, flex: 1 }}>
      {loading || !combos ? (
        <ActivityIndicator size="large" style={{ paddingTop: 30 }} />
      ) : (
        <>
          <FlatList
            data={mappedCombos || []}
            contentContainerStyle={styles.container}
            ListEmptyComponent={() => <Subheading>{t('noItems')}</Subheading>}
            renderItem={({ item }) => (
              <ComboItem
                item={{
                  ...item,
                  purchasables: item.purchasables.map(p => ({
                    ...p,
                    item: combosPurchasables.find(
                      e => e.id === p.purchasableId
                    ),
                  })),
                }}
                onPress={() => onItemPress(item)}
                setItemActive={value => setItemActive(item, value)}
                setAnchor={setAnchor}
              />
            )}
          />
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
              title={t('delete')}
              icon="delete"
              disabled={anchor?.item?.sold > 0}
              onPress={onDeleteProduct}
            />
          </Menu>
        </>
      )}
    </View>
  );
}

export default EventCombos;
