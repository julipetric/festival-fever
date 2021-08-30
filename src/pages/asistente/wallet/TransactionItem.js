import React from 'react';
import { Text } from 'react-native-paper';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { floor } from 'lodash';
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
  let sign;
  if (amount < 0) sign = '-';
  if (amount > 0) sign = '+';
  return (
    <View style={styles.amountContainer}>
      <Text
        style={[
          styles.amount,
          { color: amount < 0 ? RedTransaction : GreenTransaction },
        ]}
      >
        {`${sign} $ ${Math.abs(amount).toFixed(0)}`}
      </Text>
      <Text
        style={[
          styles.amountCents,
          { color: amount < 0 ? RedTransaction : GreenTransaction },
        ]}
      >
        {(amount - floor(amount)).toFixed(2).substring(2)}
      </Text>
    </View>
  );
}

function TransactionItem({ transaction }) {
  return (
    <View style={styles.container} key={transaction.id}>
      <View>
        <Text style={styles.description}>{transaction.description}</Text>
        <Text style={styles.date}>{transaction.date}</Text>
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
