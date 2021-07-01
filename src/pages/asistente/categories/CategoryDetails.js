import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import PropTypes from 'prop-types';
import { useRoute } from '@react-navigation/core';

function CategoryDetails() {
  const route = useRoute();
  const { category } = route.params;

  return (
    <View>
      <Text>{category.name}</Text>
    </View>
  );
}

CategoryDetails.propTypes = {
  category: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    // Ver tipo de prop, calidad de código
    image: PropTypes.any.isRequired,
  }).isRequired,
};

export default CategoryDetails;
