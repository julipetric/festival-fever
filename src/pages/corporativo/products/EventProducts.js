import { useNavigation } from '@react-navigation/native';
import { t } from 'i18n-js';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { ActivityIndicator, Subheading } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useFirestore } from 'react-redux-firebase';
import {
  ListItemBorderRadius,
  PagePaddingHorizontal,
} from '../../../assets/UIConstants';

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
  const navigation = useNavigation();
  const { event } = useSelector(state => ({
    event: state.myStore?.selectedEvent,
  }));

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

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
          setItemActive={() => {}}
        />
      )}
    />
  );
}

export default EventProducts;
