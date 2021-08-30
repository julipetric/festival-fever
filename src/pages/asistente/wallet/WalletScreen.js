import { t } from 'i18n-js';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import StyledButton from '../../components/StyledButton';
import Transactions from './Transactions';

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

function WalletScreen() {
  return (
    <View style={styles.container}>
      <AccountTotal />
      <Transactions />
    </View>
  );
}

export default WalletScreen;
