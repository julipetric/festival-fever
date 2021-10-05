import React from 'react';
import { FlatList } from 'react-native';
import { useFirestoreConnect } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import CategoryItem from './CategoryItem';

function CategoriesScreen() {
  useFirestoreConnect(() => ['categories']);
  const { categories } = useSelector(state => ({
    categories: state.firestore.data.categories,
  }));

  const categoriesMap = Object.entries(categories || []).map(([key, value]) => {
    return {
      ...value,
      id: key,
    };
  });

  return (
    <FlatList
      data={categoriesMap}
      renderItem={({ item }) => <CategoryItem category={item} />}
    />
  );
}

export default CategoriesScreen;
