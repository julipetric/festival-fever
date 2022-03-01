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
      <Title style={{ color: PinkPrimary }}>{t('checkout')}</Title>
      <Text style={{ opacity: 0.6 }}>{t('confirmingOrder')}:</Text>
    </View>
  );
}

function ListFooter({ orderTotal, currentBalance, loading }) {
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
            <Text
              style={{ textAlign: 'right', flex: 1, color: RedTransaction }}
            >
              {t('insufficientFunds')}
            </Text>
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
        <Text style={styles.itemName}>{item.ticket.name}</Text>
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
          <Text>${item.ticket.price * item.quantity}</Text>
        </View>
      </View>
      <Text style={styles.itemDescription}>{item.ticket.description}</Text>
    </>
  );
}

OrderItem.propTypes = {
  item: PropTypes.object.isRequired,
};

function Checkout() {
  const route = useRoute();
  const navigation = useNavigation();
  const { items, event } = route.params;

  const firebase = useFirebase();
  const firestore = useFirestore();

  const [loading, setLoading] = useState(false);

  const { profile } = useSelector(state => ({
    profile: state.firebase.profile,
  }));

  let total = 0;
  items.forEach(item => {
    total += item.ticket.price * item.quantity;
  });

  async function onConfirm() {
    const currentBalance = profile.balance;
    setLoading(true);

    const order = {
      userId: firebase.auth()?.currentUser?.uid,
      eventId: event.id,
      items: items.flatMap(item => {
        const array = [];
        const itemObject = {
          purchasableId: item.ticket.id,
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

    items.forEach(item => {
      const ticket = { ...item.ticket };
      delete ticket.id;
      promises.push(
        firestore
          .collection('purchasables')
          .doc(item.ticket?.id)
          .update({
            ...ticket,
            sold: (item.ticket.sold || 0) + item.quantity,
          })
      );
    });

    await Promise.all(promises);
    setLoading(false);
    navigation.dispatch(StackActions.popToTop());
    navigation.dispatch(StackActions.popToTop());
  }

  return (
    <>
      <FlatList
        ListHeaderComponent={ScreenHeader}
        contentContainerStyle={styles.container}
        data={items}
        renderItem={({ item }) => <OrderItem item={item} />}
        ListFooterComponent={() => (
          <ListFooter
            orderTotal={total}
            currentBalance={profile.balance}
            loading={loading}
          />
        )}
        keyExtractor={item => item.ticket.id}
      />
      {loading ? (
        <ActivityIndicator style={styles.floatingButton} />
      ) : (
        <FAB
          label={t('confirm')}
          style={styles.floatingButton}
          onPress={onConfirm}
          disabled={total > profile.balance}
        />
      )}
    </>
  );
}

export default Checkout;
