import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    height: 60,
    justifyContent: 'center',
    width: '100%',
  },
});

function CategoryDetailsHeader({ name, image }) {
  return (
    <ImageBackground
      style={styles.container}
      source={image}
      blurRadius={1.4}
      testID="categoryDetailsHeader"
    >
      <Text testID="categoryDetailsHeaderTitle">{name}</Text>
    </ImageBackground>
  );
}

CategoryDetailsHeader.propTypes = {
  name: PropTypes.string.isRequired,
  image: PropTypes.any.isRequired,
};

export default CategoryDetailsHeader;
