import { t } from 'i18n-js';
import { cloneDeep, uniq, uniqBy } from 'lodash';
import React, { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Modal, Portal, Text, Title } from 'react-native-paper';
import { useSelector } from 'react-redux';
import {
  useFirebase,
  useFirestore,
  useFirestoreConnect,
} from 'react-redux-firebase';
import { DarkCardBackground } from '../../../assets/Colors';
import TransactionItem from './TransactionItem';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ordersLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 10,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 10,
    margin: 30,
  },
  modalTitle: {
    color: DarkCardBackground,
    textTransform: 'uppercase',
  },
});

function Orders() {
  const firebase = useFirebase();
  const firestore = useFirestore();

  const [viewQRModal, setViewQRModal] = useState();

  const { userOrders, userOrdersPurchasables } = useSelector(state => ({
    userOrders: state.firestore.ordered.userOrders,
    userOrdersPurchasables: state.firestore.data.userOrdersPurchasables,
  }));

  const activeOrders = userOrders?.filter(order =>
    order.items?.some(item => item.status === 1)
  );

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
          uniq(
            userOrders
              .flatMap(item =>
                item.items?.map(subItem => subItem.purchasableId)
              )
              .filter(e => e !== undefined)
          ),
        ],
        storeAs: 'userOrdersPurchasables',
      });
    return array;
  });

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.ordersLabel}>{t('orders')}</Text>
        <FlatList
          renderItem={({ item }) => (
            <TransactionItem
              transaction={item}
              hideOrderTotal
              onPress={() => setViewQRModal(item)}
            />
          )}
          data={activeOrders?.map(order => {
            if (order.status === 10) return order;
            return {
              ...cloneDeep(order),
              items: uniqBy(order.items, 'purchasableId').map(item => ({
                ...item,
                quantity: order.items.filter(
                  orderItem => orderItem.purchasableId === item.purchasableId
                ).length,
                purchasable: userOrdersPurchasables
                  ? userOrdersPurchasables[item?.purchasableId]
                  : undefined,
              })),
            };
          })}
        />
      </View>
      <Portal>
        <Modal
          visible={viewQRModal}
          onDismiss={() => {
            setViewQRModal(undefined);
          }}
          contentContainerStyle={styles.modalContainer}
        >
          <Title style={styles.modalTitle}>{t('viewQRForProduct')}</Title>
          {uniqBy(viewQRModal?.items, 'purchasableId').map(item => (
            <TouchableOpacity>
              <Text style={{ color: 'black' }}>{item.purchasable.name}</Text>
            </TouchableOpacity>
          ))}
        </Modal>
      </Portal>
    </>
  );
}

export default Orders;
