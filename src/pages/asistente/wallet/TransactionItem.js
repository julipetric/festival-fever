import React from 'react';
import { Text } from 'react-native-paper';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { floor } from 'lodash';
import { t } from 'i18n-js';
import moment from 'moment';
import {
  DarkCardBackground,
  GreenTransaction,
  RedTransaction,
} from '../../../assets/Colors';

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 5,
    padding: 7,
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: DarkCardBackground,
  },
  description: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
  },
  amountContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  amount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  amountCents: {
    marginLeft: 3,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

function AmountLabel({ amount }) {
  const inverseAmount = amount * -1;
  let sign;
  if (inverseAmount < 0) sign = '-';
  if (inverseAmount > 0) sign = '+';
  return (
    <View style={styles.amountContainer}>
      <Text
        style={[
          styles.amount,
          { color: inverseAmount < 0 ? RedTransaction : GreenTransaction },
        ]}
      >
        {`${sign} $ ${Math.abs(inverseAmount).toFixed(0)}`}
      </Text>
      <Text
        style={[
          styles.amountCents,
          { color: inverseAmount < 0 ? RedTransaction : GreenTransaction },
        ]}
      >
        {(inverseAmount - floor(inverseAmount)).toFixed(2).substring(2)}
      </Text>
    </View>
  );
}

function ItemRow({ item }) {
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
        <Text style={styles.description}>{item.name}</Text>
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
    </>
  );
}

function TransactionItem({ transaction }) {
  return (
    <View style={styles.container} key={transaction.id}>
      <View>
        {transaction.status === 10 ? (
          <Text style={styles.description}>{t('addedFunds')}</Text>
        ) : (
          <>
            {/* {transaction.items.map(item => (
          //<ItemRow item={item} />
        ))} */}
          </>
        )}
        <Text style={styles.date}>
          {moment.unix(transaction.timestamp).format('MM/DD/YYYY - HH:mm')}
        </Text>
      </View>
      <AmountLabel amount={transaction.amount} />
    </View>
  );
}

TransactionItem.propTypes = {
  transaction: PropTypes.object.isRequired,
};

AmountLabel.propTypes = {
  amount: PropTypes.number.isRequired,
};

export default TransactionItem;
