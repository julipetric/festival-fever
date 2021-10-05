import React from 'react';
import { StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { setLoadingEvents } from '../../../redux/slices/eventsSlice';
import { getEvents } from '../../../firebase/eventsHelper';

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
  const dispatch = useDispatch();

  function handleOnPress() {
    dispatch(setLoadingEvents(true));
    navigation.push('CategoryDetails', {
      category: { ...category, events: [] },
    });
    if (category.events) getEvents(category.events, dispatch);
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
        <Text>{category.name}</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

CategoryItem.propTypes = {
  category: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    events: PropTypes.array,
  }).isRequired,
};

export default CategoryItem;
