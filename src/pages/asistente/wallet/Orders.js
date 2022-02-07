import { t } from 'i18n-js';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useSelector } from 'react-redux';
import {
  useFirebase,
  useFirestore,
  useFirestoreConnect,
} from 'react-redux-firebase';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

function Orders() {
  const firebase = useFirebase();
  const firestore = useFirestore();

  const { userOrders, userOrdersPurchasables } = useSelector(state => ({
    userOrders: state.firestore.ordered.userOrders,
    userOrdersPurchasables: state.firestore.data.userOrdersPurchasables,
  }));

  useFirestoreConnect(() => {
    const array = [
      {
        collection: 'orders',
        where: ['userId', '==', firebase.auth()?.currentUser?.uid],
        orderBy: ['timestamp', 'desc'],
        storeAs: 'userOrders',
      },
    ];
    if (userOrders?.some(order => order.items?.length))
      array.push({
        collection: 'purchasables',
        where: [
          firestore.FieldPath.documentId(),
          'in',
          userOrders
            .flatMap(item => item.items?.map(subItem => subItem.purchasableId))
            .filter(e => e !== undefined),
        ],
        storeAs: 'userOrdersPurchasables',
      });
    return array;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.accountTotalLabel}>{t('orders')}</Text>
    </View>
  );
}

export default Orders;
