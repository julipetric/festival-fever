import React from 'react';
import { StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/core';

const styles = StyleSheet.create({
  itemBackground: {
    display: 'flex',
    height: 200,
  },
  itemContainer: {
    display: 'flex',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function CategoryItem({ category }) {
  const navigation = useNavigation();

  function handleOnPress() {
    navigation.push('CategoryDetails', { category });
  }

  return (
    <ImageBackground
      key={category.id}
      style={styles.itemBackground}
      source={category.image}
      blurRadius={1.4}
    >
      <TouchableOpacity
        style={styles.itemContainer}
        activeOpacity={0.5}
        onPress={handleOnPress}
      >
        <Text>{category.name}</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

CategoryItem.propTypes = {
  category: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    // Ver tipo de prop, calidad de código
    image: PropTypes.any.isRequired,
  }).isRequired,
};

export default CategoryItem;
