import { t } from 'i18n-js';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Orders from './Orders';

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
});

function AccountTotal({ balance, updateWallet }) {
  return (
    <View style={styles.accountTotal}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Text style={styles.accountTotalLabel}>{t('accountBalance')}</Text>
        {updateWallet && (
          <Ionicons
            name="md-reload-circle"
            size={24}
            color="white"
            onPress={updateWallet}
          />
        )}
      </View>
      <View style={styles.numbersContainer}>
        <Text style={styles.accountTotalDecimal}>
          $ {Math.floor(balance).toFixed(0)}
        </Text>
        <Text style={styles.accountTotalFloat}>
          {(balance % 1).toFixed(2).substring(2)}
        </Text>
      </View>
    </View>
  );
}

AccountTotal.defaultProps = { updateWallet: undefined };

AccountTotal.propTypes = {
  balance: PropTypes.number.isRequired,
  updateWallet: PropTypes.func,
};

function WalletHome() {
  const navigation = useNavigation();

  const { balance } = useSelector(state => ({
    balance: state.firebase.profile.balance,
  }));

  return (
    <View style={styles.container}>
      <Orders />
      <TouchableOpacity
        onPress={() => navigation.navigate('WalletTransactions')}
      >
        <AccountTotal balance={balance} />
      </TouchableOpacity>
    </View>
  );
}

export default WalletHome;
