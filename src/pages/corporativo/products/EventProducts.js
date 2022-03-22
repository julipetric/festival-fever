import { useNavigation } from '@react-navigation/native';
import { t } from 'i18n-js';
import { isEqual, uniq } from 'lodash';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { ActivityIndicator, Menu, Subheading } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useFirebase, useFirestore } from 'react-redux-firebase';
import { TransparentBackdrop } from '../../../assets/Colors';
import {
  ListItemBorderRadius,
  PagePaddingHorizontal,
} from '../../../assets/UIConstants';
import {
  setProductClipboard,
  setSelectedEvent,
} from '../../../redux/myStoreSlice';

import ProductItem from './ProductItem';

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

function EventProducts() {
  const firestore = useFirestore();
  const firebase = useFirebase();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { event, productClipboard } = useSelector(state => ({
    event: state.myStore?.selectedEvent,
    productClipboard: state.myStore?.productClipboard,
  }));

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [modifiedEvent, setModifiedEvent] = useState({ ...event });
  const [anchor, setAnchor] = useState();

  useEffect(() => {
    navigation.addListener('beforeRemove', () => {
      if (!isEqual(modifiedEvent, event)) {
        dispatch(setSelectedEvent(modifiedEvent));
      }
    });
  }, [dispatch, event, modifiedEvent, navigation]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    if (!event?.products?.length) setProducts([]);
    else {
      const array = [];
      (
        await firestore
          .collection('purchasables')
          .where(firestore.FieldPath.documentId(), 'in', event?.products)
          .get()
      ).forEach(doc => array.push({ ...doc.data(), id: doc.id }));
      setProducts(array);
    }
    setLoading(false);
  }, [event.products, firestore]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  function onItemPress(item) {
    navigation.navigate(t('productInfo'), { item });
  }

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
    setModifiedEvent({ ...event, ...saveEvent });
  }

  async function addItem(item) {
    setLoading(true);
    try {
      const purchasableId = (
        await (await firestore.collection('purchasables').add(item)).get()
      ).id;
      const saveEvent = {
        ...event,
        products: uniq([...(event?.products || []), purchasableId]),
        lastEditBy: {
          userId: firebase.auth()?.currentUser?.uid,
          timestamp: moment().unix(),
        },
      };
      delete saveEvent.category;
      delete saveEvent.id;
      await firestore.collection('events').doc(event.id).update(saveEvent);
      setProducts([{ ...item, id: purchasableId }, ...products]);
      setModifiedEvent({ ...event, ...saveEvent });
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
      const saveEvent = {
        ...event,
        products: (event?.products || []).filter(e => e !== anchor?.item?.id),
        lastEditBy: {
          userId: firebase.auth()?.currentUser?.uid,
          timestamp: moment().unix(),
        },
      };
      delete saveEvent.category;
      delete saveEvent.id;
      await Promise.all([
        firestore.collection('purchasables').doc(anchor?.item?.id).delete(),
        firestore.collection('events').doc(event.id).update(saveEvent),
      ]);
      setProducts([...products].filter(p => p.id !== anchor?.item?.id));
      setModifiedEvent({ ...event, ...saveEvent });
    } catch (e) {
      Alert.alert(t('error'), JSON.stringify(e));
    } finally {
      setAnchor(undefined);
      setLoading(false);
    }
  }

  function onCopyProduct() {
    dispatch(setProductClipboard(anchor?.item));
    setAnchor(undefined);
  }

  async function onPasteProduct() {
    const savePurchasable = { ...productClipboard };
    savePurchasable.name = `${savePurchasable.name} - Copy`;
    delete savePurchasable.id;
    savePurchasable.active = false;
    savePurchasable.sold = 0;
    await addItem(savePurchasable);
  }

  return loading || !products ? (
    <ActivityIndicator size="large" style={{ paddingTop: 30 }} />
  ) : (
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
          data={products || []}
          style={{ backgroundColor: TransparentBackdrop }}
          contentContainerStyle={styles.container}
          ListEmptyComponent={() => <Subheading>{t('noItems')}</Subheading>}
          renderItem={({ item }) => (
            <ProductItem
              item={item}
              onPress={() => onItemPress(item)}
              setItemActive={value => setItemActive(item, value)}
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
          disabled={!productClipboard}
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
  );
}

export default EventProducts;
