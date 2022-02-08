import { t } from 'i18n-js';
import { cloneDeep, uniqBy } from 'lodash';
import React, { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import {
  ActivityIndicator,
  Modal,
  Portal,
  Text,
  TextInput,
  Title,
} from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useFirebase, useFirestore } from 'react-redux-firebase';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';
import { DarkCardBackground } from '../../../assets/Colors';
import StyledButton from '../../components/StyledButton';
import TransactionItem from './TransactionItem';
import { deleteUserTransactions } from '../../../utils';

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
    paddingTop: 20,
    paddingBottom: 1,
    display: 'flex',
    flex: 1,
  },
  transactionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
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

function AccountTotal({ addFundsPressed, balance, updateWallet }) {
  return (
    <View style={styles.accountTotal}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Text style={styles.accountTotalLabel}>{t('accountTotal')}</Text>
        <Ionicons
          name="md-reload-circle"
          size={24}
          color="white"
          onPress={updateWallet}
        />
      </View>
      <View style={styles.numbersContainer}>
        <Text style={styles.accountTotalDecimal}>
          $ {Math.floor(balance).toFixed(0)}
        </Text>
        <Text style={styles.accountTotalFloat}>
          {(balance % 1).toFixed(2).substring(2)}
        </Text>
      </View>
      <StyledButton
        label={t('addFunds')}
        mode="contained"
        style={{ backgroundColor: '#00AFF0' }}
        onPress={addFundsPressed}
      />
    </View>
  );
}

AccountTotal.propTypes = {
  addFundsPressed: PropTypes.func.isRequired,
  balance: PropTypes.number.isRequired,
  updateWallet: PropTypes.func.isRequired,
};

function TransactionsList({ data }) {
  return (
    <FlatList
      contentContainerStyle={{ marginTop: 10 }}
      indicatorStyle="white"
      data={data}
      renderItem={({ item }) => <TransactionItem transaction={item} />}
    />
  );
}

TransactionsList.propTypes = {
  data: PropTypes.array.isRequired,
};

function Transactions({ data }) {
  return (
    <View style={styles.transactionsContainer}>
      <Text style={styles.transactionsTitle}>{t('transactions')}</Text>
      <TransactionsList data={data} />
    </View>
  );
}

Transactions.propTypes = {
  data: PropTypes.array.isRequired,
};

function WalletTransactions() {
  const firebase = useFirebase();
  const firestore = useFirestore();

  // eslint-disable-next-line no-unused-vars
  const [page, setPage] = useState(0);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [fundsInput, setFundsInput] = useState();
  const [updatingWallet, setUpdatingWallet] = useState(false);

  const { userOrders, userOrdersPurchasables, balance } = useSelector(
    state => ({
      userOrders: state.firestore.ordered.userOrders,
      userOrdersPurchasables: state.firestore.data.userOrdersPurchasables,
      balance: state.firebase.profile.balance,
    })
  );

  function addFundsPressed() {
    setShowAddFunds(true);
  }

  async function onConfirmPressed() {
    setUpdatingWallet(true);
    setShowAddFunds(false);
    setFundsInput();

    const order = {
      userId: firebase.auth()?.currentUser?.uid,
      status: 10,
      amount: -Number(fundsInput),
      timestamp: moment().unix(),
    };

    const newBalance = Number(balance) + Number(fundsInput);

    await Promise.all([
      firestore.collection('orders').add(order),
      firebase.updateProfile({ balance: newBalance }),
    ]);

    setUpdatingWallet(false);
  }

  async function updateWallet() {
    setUpdatingWallet(true);
    await deleteUserTransactions(firestore, firebase.auth()?.currentUser?.uid);
    setUpdatingWallet(false);
  }

  return updatingWallet ? (
    <ActivityIndicator size="large" style={{ paddingTop: 30 }} />
  ) : (
    <>
      <View style={styles.container}>
        <AccountTotal
          addFundsPressed={addFundsPressed}
          balance={balance}
          updateWallet={updateWallet}
        />
        {userOrders &&
          (!userOrders?.some(order => order.items?.length) ||
            userOrdersPurchasables) && (
            <Transactions
              setPage={setPage}
              data={userOrders.map(order => {
                if (order.status === 10) return order;
                return {
                  ...cloneDeep(order),
                  items: uniqBy(order.items, 'purchasableId').map(item => ({
                    ...item,
                    quantity: order.items.filter(
                      orderItem =>
                        orderItem.purchasableId === item.purchasableId
                    ).length,
                    purchasable: userOrdersPurchasables
                      ? userOrdersPurchasables[item?.purchasableId]
                      : undefined,
                  })),
                };
              })}
            />
          )}
      </View>
      <Portal>
        <Modal
          visible={showAddFunds}
          onDismiss={() => {
            setShowAddFunds(false);
          }}
          contentContainerStyle={styles.modalContainer}
        >
          <Title style={styles.modalTitle}>{t('addFunds')}</Title>
          <TextInput
            autoFocus
            keyboardType="decimal-pad"
            style={{ backgroundColor: 'rgb(150,150,150)' }}
            value={fundsInput}
            onChangeText={text => setFundsInput(text)}
          />
          <StyledButton label={t('confirm')} onPress={onConfirmPressed} />
        </Modal>
      </Portal>
    </>
  );
}

export default WalletTransactions;
