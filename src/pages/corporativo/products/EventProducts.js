import { useNavigation } from '@react-navigation/native';
import { t } from 'i18n-js';
import { isEqual } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { ActivityIndicator, Subheading } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useFirebase, useFirestore } from 'react-redux-firebase';
import {
  ListItemBorderRadius,
  PagePaddingHorizontal,
} from '../../../assets/UIConstants';
import { setSelectedEvent } from '../../../redux/myStoreSlice';

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
  const { event } = useSelector(state => ({
    event: state.myStore?.selectedEvent,
  }));

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [modifiedEvent, setModifiedEvent] = useState({ ...event });

  useEffect(() => {
    navigation.addListener('beforeRemove', () => {
      if (!isEqual(modifiedEvent, event)) {
        dispatch(setSelectedEvent(modifiedEvent));
      }
    });
  }, [dispatch, event, modifiedEvent, navigation]);

  useEffect(() => {
    async function fetchProducts() {
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
    }
    fetchProducts();
  }, [event, firestore]);

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

  return loading || !products ? (
    <ActivityIndicator size="large" style={{ paddingTop: 30 }} />
  ) : (
    <FlatList
      data={products || []}
      contentContainerStyle={styles.container}
      ListEmptyComponent={() => <Subheading>{t('noItems')}</Subheading>}
      renderItem={({ item }) => (
        <ProductItem
          item={item}
          onPress={() => onItemPress(item)}
          setItemActive={value => setItemActive(item, value)}
        />
      )}
    />
  );
}

export default EventProducts;
