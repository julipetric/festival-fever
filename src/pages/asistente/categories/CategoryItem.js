import React from 'react';
import {
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Text } from 'react-native-paper';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';

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
    navigation.push('CategoryDetails', { categoryId: category.id });
  }

  return (
    <ImageBackground
      key={category.id}
      style={styles.itemBackground}
      source={{ uri: category.imageUrl }}
      blurRadius={1.4}
    >
      <TouchableOpacity
        style={styles.itemContainer}
        activeOpacity={0.5}
        onPress={handleOnPress}
      >
        {category.iconUrl && (
          <Image
            source={{ uri: category.iconUrl }}
            style={{ height: 50, width: 50, marginBottom: 5 }}
            resizeMode="contain"
          />
        )}
        <Text>{category.name}</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

CategoryItem.propTypes = {
  category: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    iconUrl: PropTypes.string,
    imageUrl: PropTypes.string.isRequired,
    events: PropTypes.array,
  }).isRequired,
};

export default CategoryItem;
