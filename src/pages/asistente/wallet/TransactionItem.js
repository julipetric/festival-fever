import React from 'react';
import { Subheading, Text } from 'react-native-paper';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { floor, uniqueId } from 'lodash';
import { t } from 'i18n-js';
import moment from 'moment';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
  DarkCardBackground,
  GreenTransaction,
  RedTransaction,
} from '../../../assets/Colors';
import { ListItemBorderRadius } from '../../../assets/UIConstants';

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: ListItemBorderRadius,
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
  },
  date: {
    fontSize: 12,
    opacity: 0.6,
  },
  amountContainer: {
    display: 'flex',
    flexDirection: 'row',
    flex: 0,
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
  eventName: {
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

function ItemRow({ item, hideItemPrice }) {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flex: 1,
      }}
      key={uniqueId()}
    >
      <Text style={styles.description}>{item?.purchasable?.name}</Text>
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
        {!hideItemPrice && (
          <Text>${item.purchasable?.price * item.quantity}</Text>
        )}
      </View>
    </View>
  );
}

ItemRow.propTypes = {
  item: PropTypes.object.isRequired,
  hideItemPrice: PropTypes.bool.isRequired,
};

function TransactionItem({
  transaction,
  hideOrderTotal,
  hideItemPrice,
  onPress,
  event,
  disabled,
}) {
  return (
    <TouchableOpacity
      style={styles.container}
      key={transaction?.id}
      onPress={onPress}
      disabled={!onPress || disabled}
    >
      <View style={{ flex: 1, paddingRight: 20 }}>
        {transaction.status === 10 ? (
          <Text style={styles.description}>{t('addedFunds')}</Text>
        ) : (
          <>
            {event && (
              <Subheading style={styles.eventName}>{event.name}</Subheading>
            )}
            {transaction.items.map(item => (
              <ItemRow item={item} hideItemPrice={hideItemPrice} />
            ))}
          </>
        )}
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 2,
          }}
        >
          <Text style={styles.date}>
            {moment.unix(transaction.timestamp).format('MM/DD/YYYY - HH:mm')}
          </Text>
          {hideOrderTotal && (
            <Text style={{ opacity: 0.6 }}>Total: ${transaction.amount}</Text>
          )}
        </View>
      </View>
      {!hideOrderTotal && <AmountLabel amount={transaction.amount} />}
    </TouchableOpacity>
  );
}

TransactionItem.defaultProps = {
  hideOrderTotal: false,
  hideItemPrice: false,
  onPress: undefined,
  event: undefined,
  disabled: false,
};

TransactionItem.propTypes = {
  transaction: PropTypes.object.isRequired,
  hideOrderTotal: PropTypes.bool,
  hideItemPrice: PropTypes.bool,
  onPress: PropTypes.func,
  event: PropTypes.object,
  disabled: PropTypes.bool,
};

AmountLabel.propTypes = {
  amount: PropTypes.number.isRequired,
};

export default TransactionItem;
