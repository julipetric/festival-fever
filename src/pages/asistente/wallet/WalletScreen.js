import { t } from 'i18n-js';
import { cloneDeep } from 'lodash';
import React, { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useSelector } from 'react-redux';
import {
  useFirebase,
  useFirestore,
  useFirestoreConnect,
} from 'react-redux-firebase';
import StyledButton from '../../components/StyledButton';
import TransactionItem from './TransactionItem';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    paddingHorizontal: 20,
    flex: 1,
  },
  accountTotal: {
    marginTop: 30,
  },
  numbersContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 10,
  },
  accountTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  accountTotalDecimal: {
    fontSize: 50,
    fontWeight: 'bold',
  },
  accountTotalFloat: {
    marginLeft: 5,
    fontSize: 30,
    fontWeight: 'bold',
  },
  transactionsContainer: {
    marginVertical: 20,
    display: 'flex',
    width: '100%',
  },
  transactionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

function AccountTotal() {
  return (
    <View style={styles.accountTotal}>
      <Text style={styles.accountTotalLabel}>{t('accountTotal')}</Text>
      <View style={styles.numbersContainer}>
        <Text style={styles.accountTotalDecimal}>$ 420</Text>
        <Text style={styles.accountTotalFloat}>69</Text>
      </View>
      <StyledButton
        label="Cargar Saldo con MercadoPago"
        mode="contained"
        style={{ backgroundColor: '#00AFF0' }}
      />
    </View>
  );
}

function TransactionsList({ data }) {
  return (
    <FlatList
      contentContainerStyle={{ marginTop: 10 }}
      data={data}
      renderItem={({ item }) => <TransactionItem transaction={item} />}
    />
  );
}

function Transactions({ data }) {
  return (
    <View style={styles.transactionsContainer}>
      <Text style={styles.transactionsTitle}>{t('transactions')}</Text>
      <TransactionsList data={data} />
    </View>
  );
}

const PAGE_SIZE = 30;

function WalletScreen() {
  const firebase = useFirebase();
  const firestore = useFirestore();

  const [page, setPage] = useState(0);

  const { userOrders, userOrdersPurchasables } = useSelector(state => ({
    userOrders: state.firestore.ordered.userOrders,
    userOrdersPurchasables: state.firestore.data.userOrdersPurchasables,
  }));

  useFirestoreConnect(() => {
    const array = [
      {
        collection: 'orders',
        where: ['userId', '==', firebase.auth().currentUser.uid],
        orderBy: ['timestamp', 'desc'],
        limit: PAGE_SIZE * (page + 1),
        storeAs: 'userOrders',
      },
    ];
    if (userOrders)
      array.push({
        collection: 'purchasables',
        where: [
          firestore.FieldPath.documentId(),
          'in',
          userOrders.flatMap(item =>
            item.items.map(subItem => subItem.purchasableId)
          ),
        ],
        storeAs: 'userOrdersPurchasables',
      });
    return array;
  });

  console.log(userOrders);

  return (
    <View style={styles.container}>
      <AccountTotal />
      {userOrders && userOrdersPurchasables && (
        <Transactions
          setPage={setPage}
          data={userOrders.map(order => ({
            ...cloneDeep(order),
            items: order.items.map(item => ({
              ...item,
              purchasble: userOrdersPurchasables[item.purchasableId],
            })),
          }))}
        />
      )}
    </View>
  );
}

export default WalletScreen;
