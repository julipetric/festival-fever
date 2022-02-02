import { t } from 'i18n-js';
import { cloneDeep } from 'lodash';
import React, { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Modal, Portal, Text, TextInput, Title } from 'react-native-paper';
import { useSelector } from 'react-redux';
import {
  useFirebase,
  useFirestore,
  useFirestoreConnect,
} from 'react-redux-firebase';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  BackgroundGray,
  DarkCardBackground,
  TransparentBackdrop,
  TransparentBackdrop2,
} from '../../../assets/Colors';
import FormTextInput from '../../components/FormTextInput';
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

function AccountTotal({ addFundsPressed, balance }) {
  return (
    <View style={styles.accountTotal}>
      <Text style={styles.accountTotalLabel}>{t('accountTotal')}</Text>
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
};

function TransactionsList({ data }) {
  return (
    <FlatList
      contentContainerStyle={{ marginTop: 10 }}
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

const PAGE_SIZE = 30;

function WalletScreen() {
  const firebase = useFirebase();
  const firestore = useFirestore();

  const [page, setPage] = useState(0);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [fundsInput, setFundsInput] = useState();

  const { userOrders, userOrdersPurchasables, balance } = useSelector(
    state => ({
      userOrders: state.firestore.ordered.userOrders,
      userOrdersPurchasables: state.firestore.data.userOrdersPurchasables,
      balance: state.firebase.profile.balance,
    })
  );

  useFirestoreConnect(() => {
    const array = [
      {
        collection: 'orders',
        where: ['userId', '==', firebase.auth()?.currentUser?.uid],
        orderBy: ['timestamp', 'desc'],
        limit: PAGE_SIZE * (page + 1),
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

  function addFundsPressed() {
    setShowAddFunds(true);
  }

  async function onConfirmPressed() {
    const order = {
      userId: firebase.auth()?.currentUser?.uid,
      status: 10,
      amount: -Number(fundsInput),
      timestamp: moment().unix(),
    };

    await firestore.collection('orders').add(order);

    const newBalance = Number(balance) + Number(fundsInput);
    await firebase.updateProfile({ balance: newBalance });
  }

  return (
    <>
      <View style={styles.container}>
        <AccountTotal addFundsPressed={addFundsPressed} balance={balance} />
        {userOrders && userOrdersPurchasables && (
          <Transactions
            setPage={setPage}
            data={userOrders.map(order =>
              order.status === 10
                ? order
                : {
                    ...cloneDeep(order),
                    items: order.items.map(item => ({
                      ...item,
                      purchasble: userOrdersPurchasables[item.purchasableId],
                    })),
                  }
            )}
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

export default WalletScreen;
