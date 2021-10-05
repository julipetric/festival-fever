import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import PropTypes from 'prop-types';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { padding: 9 },
  itemContainer: {
    backgroundColor: 'white',
    width: width / 4,
    height: width / 4,
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

EventProduct.propTypes = {
  product: PropTypes.object.isRequired,
};

export default EventProduct;
