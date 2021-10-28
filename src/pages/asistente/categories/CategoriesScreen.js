import React from 'react';
import { FlatList } from 'react-native';
import { useFirestoreConnect } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import { ActivityIndicator } from 'react-native-paper';
import CategoryItem from './CategoryItem';

function CategoriesScreen() {
  useFirestoreConnect(() => ['categories']);
  const { categories } = useSelector(state => ({
    categories: state.firestore.ordered.categories,
  }));

  return categories ? (
    <FlatList
      data={categories}
      renderItem={({ item }) => <CategoryItem category={item} />}
    />
  ) : (
    <ActivityIndicator />
  );
}

export default CategoriesScreen;
