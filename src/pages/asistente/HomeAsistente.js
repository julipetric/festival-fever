import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { AntDesign, Entypo, FontAwesome } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { t } from 'i18n-js';
import { PinkPrimary, TabBarBackground } from '../../assets/Colors';
import FavoritesScreen from './favorites/FavoritesScreen';
import CategoriesMain from './categories/CategoriesMain';
import WalletNavigator from './wallet/WalletNavigator';

const Tab = createMaterialBottomTabNavigator();

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    alignSelf: 'center',
  },
  mainLayout: {
    flex: 1,
  },
  elementsPadding: {
    margin: 10,
  },
  button: {
    margin: 10,
  },
});

function HomeAsistente() {
  return (
    <View style={styles.container}>
      <View style={styles.mainLayout}>
        <Tab.Navigator
          activeColor={PinkPrimary}
          initialRouteName={t('categories')}
          tabBarOptions={{
            activeTintColor: PinkPrimary,
            style: { position: 'absolute' },
          }}
          barStyle={{
            backgroundColor: TabBarBackground,
          }}
        >
          <Tab.Screen
            name={t('categories')}
            component={CategoriesMain}
            options={{
              // eslint-disable-next-line react/prop-types
              tabBarIcon: ({ color }) => (
                <AntDesign name="appstore1" size={23} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name={t('wallet')}
            component={WalletNavigator}
            options={{
              // eslint-disable-next-line react/prop-types
              tabBarIcon: ({ color }) => (
                <Entypo name="wallet" size={23} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name={t('favorites')}
            component={FavoritesScreen}
            options={{
              // eslint-disable-next-line react/prop-types
              tabBarIcon: ({ color }) => (
                <FontAwesome name="star" size={23} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      </View>
      {/* eslint-disable-next-line react/style-prop-object */}
      <StatusBar style="light" translucent />
    </View>
  );
}

export default HomeAsistente;
