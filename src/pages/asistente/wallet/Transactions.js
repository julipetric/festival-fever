import { t } from 'i18n-js';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import TransactionsList from './TransactionsList';

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    display: 'flex',
    width: '100%',
  },
  transactionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

function Transactions() {
  return (
    <View style={styles.container}>
      <Text style={styles.transactionsTitle}>{t('transactions')}</Text>
      <TransactionsList />
    </View>
  );
}

export default Transactions;
