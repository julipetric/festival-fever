import { useRoute } from '@react-navigation/native';
import { t } from 'i18n-js';
import React, { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, FAB, Text, Title } from 'react-native-paper';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useFirebase } from 'react-redux-firebase';
import { PinkPrimary } from '../../assets/Colors';

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
      <Title style={{ color: PinkPrimary }}>{t('confirmOrder')}</Title>
      <Text style={{ opacity: 0.6 }}>{t('confirmingOrder')}:</Text>
    </View>
  );
}

function ListFooter({ orderTotal, currentBalance }) {
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
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
        }}
      >
        <Text>{t('balanceAfterOperation')}</Text>
        <Text style={{ fontWeight: 'bold' }}>
          ${currentBalance - orderTotal}
        </Text>
      </View>
    </>
  );
}

ListFooter.propTypes = {
  orderTotal: PropTypes.number.isRequired,
  currentBalance: PropTypes.number.isRequired,
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

function ConfirmOrder() {
  const route = useRoute();
  const { items } = route.params;

  const firebase = useFirebase();

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
    await firebase.updateProfile({ balance: currentBalance - total });
    setLoading(false);
  }

  return (
    <>
      <FlatList
        ListHeaderComponent={ScreenHeader}
        contentContainerStyle={styles.container}
        data={items}
        renderItem={({ item }) => <OrderItem item={item} />}
        ListFooterComponent={() => (
          <ListFooter orderTotal={total} currentBalance={profile.balance} />
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
        />
      )}
    </>
  );
}

export default ConfirmOrder;
