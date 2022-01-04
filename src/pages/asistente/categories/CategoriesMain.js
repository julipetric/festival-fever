import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
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
    </Stack.Navigator>
  );
}

export default CategoriesMain;
