import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import walletData from '../../../mocks/walletData';
import TransactionItem from './TransactionItem';

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
});

function TransactionsList() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {walletData.map(transaction => (
        <TransactionItem transaction={transaction} />
      ))}
    </ScrollView>
  );
}

export default TransactionsList;
