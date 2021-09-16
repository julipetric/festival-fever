import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

// TODO: HACER QUE EL ANCHO SEA WIDTH/3

const styles = StyleSheet.create({
  container: { padding: 9 },
  itemContainer: {
    backgroundColor: 'white',
    width: 115,
    height: 115,
    borderRadius: 10,
  },
});

function EventProduct({ product }) {
  return (
    <View style={styles.container}>
      <View style={styles.itemContainer}>
        <Text>{product.title}</Text>
      </View>
    </View>
  );
}

export default EventProduct;
