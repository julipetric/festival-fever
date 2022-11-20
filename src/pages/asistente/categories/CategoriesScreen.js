import React from 'react';
import { FlatList } from 'react-native';
import { useFirestoreConnect } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import { ActivityIndicator } from 'react-native-paper';
import { t } from 'i18n-js';
import CategoryItem from './CategoryItem';

function CategoriesScreen() {
  useFirestoreConnect(() => [{ collection: 'categories', orderBy: ['order'] }]);
  const { categories } = useSelector(state => ({
    categories: state.firestore.ordered.categories,
  }));

  return categories ? (
    <FlatList
      testID="CategoriesList"
      data={[
        {
          name: t('allEvents'),
          imageUrl: 'https://picsum.photos/1000/800',
          iconUrl: 'https://picsum.photos/200',
        },
        ...categories,
      ]}
      renderItem={({ item }) => <CategoryItem category={item} />}
    />
  ) : (
    <ActivityIndicator style={{ paddingTop: 30 }} size="large" />
  );
}

export default CategoriesScreen;
