import { createStackNavigator } from '@react-navigation/stack';
import { t } from 'i18n-js';
import React from 'react';
import SearchScreen from '../SearchScreen';
import CategoriesScreen from './CategoriesScreen';
import CategoryDetails from './categoryDetails/CategoryDetails';

const Stack = createStackNavigator();

function CategoriesMain() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="CategoriesScreen"
    >
      <Stack.Screen name="CategoriesScreen" component={CategoriesScreen} />
      <Stack.Screen name="CategoryDetails" component={CategoryDetails} />
      <Stack.Screen name={t('search')} component={SearchScreen} />
    </Stack.Navigator>
  );
}

export default CategoriesMain;
