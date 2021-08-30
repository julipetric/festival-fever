import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { t } from 'i18n-js';
import { PinkPrimary } from '../../../assets/Colors';
import PillButton from '../../common/PillButton';
import TransactionsList from './TransactionsList';

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    display: 'flex',
    width: '100%',
  },
  filterButton: {
    backgroundColor: PinkPrimary,
    paddingVertical: 3,
    paddingHorizontal: 9,
    marginHorizontal: 3,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersRow: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 10,
  },
  orderByButtons: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 15,
  },
  transactionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

const filters = [
  { text: 'Filter', id: 'filter', selected: true },
  { text: 'Filter', id: 'filter' },
  { text: 'Filter', id: 'filter' },
  { text: 'Filter', id: 'filter', selected: true },
  { text: 'Filter', id: 'filter' },
  { text: 'Filter', id: 'filter' },
  { text: 'Filter', id: 'filter' },
  { text: 'Filter', id: 'filter', selected: true },
  { text: 'Filter', id: 'filter' },
];

function Transactions() {
  return (
    <View style={styles.container}>
      <Text style={styles.transactionsTitle}>Transactions</Text>
      <View style={styles.filtersRow}>
        <ScrollView horizontal>
          {filters.map(filter => (
            <PillButton selected={filter.selected} text={filter.text} />
          ))}
        </ScrollView>
        <View style={styles.orderByButtons}>
          <PillButton selected text={t('byDate')} />
          <PillButton selected text={t('byAmount')} />
        </View>
      </View>
      <TransactionsList />
    </View>
  );
}

export default Transactions;
