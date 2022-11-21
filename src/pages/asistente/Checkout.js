import {
  StackActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { t } from 'i18n-js';
import React, { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, FAB, Text, Title } from 'react-native-paper';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { useFirebase, useFirestore } from 'react-redux-firebase';
import { uniqueId } from 'lodash';
import { PinkPrimary, RedTransaction } from '../../assets/Colors';
import StyledButton from '../components/StyledButton';
import AddFundsModal from './wallet/AddFundsModal';

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  itemName: { fontSize: 16, fontWeight: 'bold' },
  itemDescription: { opacity: 0.7, paddingTop: 5, paddingBottom: 15 },
  line: {
    backgroundColor: 'white',
    flexGrow: 1,
    height: 1,
  },
  floatingButton: {
    position: 'absolute',
    bottom: '2%',
    alignSelf: 'center',
  },
});

function ScreenHeader() {
  return (
    <View style={{ marginBottom: 10 }}>
      <Title style={{ color: PinkPrimary }} testID="checkoutHeader">
        {t('checkout')}
      </Title>
      <Text style={{ opacity: 0.6 }}>{t('confirmingOrder')}:</Text>
    </View>
  );
}

function ListFooter({ orderTotal, currentBalance, loading, addFundsPressed }) {
  return (
    <>
      <View
        style={[
          styles.line,
          { backgroundColor: 'white', marginTop: 5, marginBottom: 15 },
        ]}
      />
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          paddingBottom: 5,
        }}
      >
        <Text style={{ fontSize: 13 }}>{t('currentBalance')}</Text>
        <Text style={{ fontSize: 13 }}>${currentBalance}</Text>
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
        }}
      >
        <Text style={{ fontSize: 13 }}>{t('orderTotal')}</Text>
        <Text style={{ fontSize: 13 }}>- ${orderTotal}</Text>
      </View>
      <View
        style={[
          styles.line,
          { backgroundColor: 'white', marginVertical: 5, opacity: 0.5 },
        ]}
      />
      {!loading && (
        <>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
            }}
          >
            <Text>{t('balanceAfterOperation')}</Text>
            <Text
              style={{
                fontWeight: 'bold',
                color: orderTotal > currentBalance ? RedTransaction : 'white',
              }}
            >
              ${currentBalance - orderTotal}
            </Text>
          </View>
          {orderTotal > currentBalance && (
            <View style={{ flex: 1 }}>
              <Text style={{ color: RedTransaction, textAlign: 'right' }}>
                {t('insufficientFunds')}
              </Text>
              <StyledButton
                label={t('addFunds')}
                style={{ paddingHorizontal: 0, marginTop: 10 }}
                mode="contained"
                onPress={addFundsPressed}
                testID="addFundsButton"
              />
            </View>
          )}
        </>
      )}
    </>
  );
}

ListFooter.propTypes = {
  orderTotal: PropTypes.number.isRequired,
  currentBalance: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  addFundsPressed: PropTypes.func.isRequired,
};

function OrderItem({ item }) {
  return (
    <>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
      >
        <Text style={styles.itemName}>{item.item.name}</Text>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-end',
          }}
        >
          <Text
            style={{
              marginRight: 8,
              fontSize: 13,
              opacity: 0.5,
            }}
          >
            x{item.quantity}
          </Text>
          <Text>${item.item.price * item.quantity}</Text>
        </View>
      </View>
      <Text style={styles.itemDescription}>{item.item.description}</Text>
    </>
  );
}

OrderItem.propTypes = {
  item: PropTypes.object.isRequired,
};

function Checkout() {
  const route = useRoute();
  const navigation = useNavigation();
  const { items } = route.params;

  const firebase = useFirebase();
  const firestore = useFirestore();

  const [loading, setLoading] = useState(false);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [fundsInput, setFundsInput] = useState();

  const { profile, event } = useSelector(state => ({
    profile: state.firebase.profile,
    event: state.myStore.selectedEvent,
  }));

  let total = 0;
  items.forEach(item => {
    total += item.item.price * item.quantity;
  });

  async function onConfirm() {
    const orderItems = items.flatMap(i => {
      if (i.item?.purchasables?.length) return i.item.purchasables;
      return i;
    });
    const currentBalance = profile.balance;
    setLoading(true);

    const order = {
      userId: firebase.auth()?.currentUser?.uid,
      eventId: event.id,
      items: orderItems.flatMap(item => {
        if (item.purchasables?.length) {
          return item.purchasables.flatMap(p => {
            const array = [];
            const itemObject = {
              purchasableId: p.item.id,
              status: 1,
            };
            for (let i = 0; i < item.quantity; i += 1)
              array.push({ ...itemObject, orderItemId: uniqueId() });
            return array;
          });
        }
        const array = [];
        const itemObject = {
          purchasableId: item.item.id,
          status: 1,
        };
        for (let i = 0; i < item.quantity; i += 1)
          array.push({ ...itemObject, orderItemId: uniqueId() });
        return array;
      }),
      amount: total,
      timestamp: moment().unix(),
    };

    const promises = [
      firebase.updateProfile({ balance: currentBalance - total }),
      firestore.collection('orders').add(order),
    ];

    orderItems.forEach(e => {
      const item = { ...e.item };
      delete item.id;
      promises.push(
        firestore
          .collection('purchasables')
          .doc(e.item?.id)
          .update({
            ...item,
            sold: (item.sold || 0) + e.quantity,
          })
      );
    });

    await Promise.all(promises);
    setLoading(false);
    navigation.dispatch(StackActions.popToTop());
    navigation.dispatch(StackActions.popToTop());
  }

  function addFundsPressed() {
    setShowAddFunds(true);
  }

  async function onConfirmFundsPressed() {
    setLoading(true);
    setShowAddFunds(false);
    setFundsInput();

    const order = {
      userId: firebase.auth()?.currentUser?.uid,
      status: 10,
      amount: -Number(fundsInput),
      timestamp: moment().unix(),
    };

    const newBalance = Number(profile.balance) + Number(fundsInput);

    await Promise.all([
      firestore.collection('orders').add(order),
      firebase.updateProfile({ balance: newBalance }),
    ]);

    setLoading(false);
  }

  return (
    <View style={{ height: '100%' }}>
      <FlatList
        ListHeaderComponent={ScreenHeader}
        contentContainerStyle={styles.container}
        data={items}
        renderItem={({ item }) => <OrderItem item={item} />}
        ListFooterComponent={() =>
          loading ? (
            <ActivityIndicator style={{ paddingTop: 10 }} />
          ) : (
            <ListFooter
              orderTotal={total}
              currentBalance={profile.balance}
              loading={loading}
              addFundsPressed={addFundsPressed}
            />
          )
        }
        keyExtractor={item => item.item.id}
      />
      {!loading && (
        <FAB
          label={t('confirm')}
          style={styles.floatingButton}
          onPress={onConfirm}
          disabled={total > profile.balance}
          testID="checkoutConfirmFAB"
        />
      )}
      <AddFundsModal
        visible={showAddFunds}
        setVisible={setShowAddFunds}
        input={fundsInput}
        setInput={setFundsInput}
        onConfirm={onConfirmFundsPressed}
      />
    </View>
  );
}

export default Checkout;
