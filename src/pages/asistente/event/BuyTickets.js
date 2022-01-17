import { useRoute } from '@react-navigation/native';
import { t } from 'i18n-js';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

function BuyTickets() {
  const route = useRoute();
  const { tickets } = route.params;

  console.log(tickets);

  return (
    <View style={styles.container}>
      <Text style={{ color: 'black' }}>Lalallalala</Text>
    </View>
  );
}

export default BuyTickets;
