import React from 'react';
import { FlatList, Image } from 'react-native';
import { useFirestoreConnect } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import { ActivityIndicator } from 'react-native-paper';
import { t } from 'i18n-js';
import CategoryItem from './CategoryItem';
import allCategoriesBackground from '../../../assets/default_bg.png';
import allCategoriesIcon from '../../../assets/all-categories.png';

// CategoryItem consume URIs; los assets empaquetados se resuelven a la suya.
const ALL_CATEGORIES_IMAGE_URI = Image.resolveAssetSource(
  allCategoriesBackground
).uri;
const ALL_CATEGORIES_ICON_URI = Image.resolveAssetSource(allCategoriesIcon).uri;

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
          imageUrl: ALL_CATEGORIES_IMAGE_URI,
          iconUrl: ALL_CATEGORIES_ICON_URI,
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
