import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { t } from 'i18n-js';
import { useFirebase } from 'react-redux-firebase';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { PinkPrimary, TransparentBackdrop } from '../../assets/Colors';
import MyEvents from './MyEvents';
import MyAccount from '../common/MyAccount';

const Drawer = createDrawerNavigator();

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    alignSelf: 'center',
    backgroundColor: TransparentBackdrop,
  },
  mainLayout: {
    flex: 1,
  },
});

function CustomDrawerContent({ logout, ...props }) {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <DrawerContentScrollView {...props}>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <DrawerItemList {...props} />
      <DrawerItem
        label={t('logout')}
        onPress={logout}
        style={{ paddingTop: 10 }}
      />
    </DrawerContentScrollView>
  );
}

CustomDrawerContent.propTypes = {
  logout: PropTypes.func.isRequired,
};

function HomeCorporativo() {
  const firebase = useFirebase();
  const navigation = useNavigation();

  async function logout() {
    await firebase.logout();
    navigation.navigate('AuthNavigator');
  }

  function navigateToQRScanner() {
    navigation.navigate('QRScanner');
  }

  function HeaderRight() {
    return (
      <TouchableOpacity
        style={{ marginRight: 15 }}
        onPress={navigateToQRScanner}
      >
        <Ionicons name="qr-code" color="white" size={24} />
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.mainLayout}>
        <Drawer.Navigator
          activeColor={PinkPrimary}
          initialRouteName={t('events')}
          drawerContent={props => (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <CustomDrawerContent logout={logout} {...props} />
          )}
          screenOptions={{ headerTintColor: 'white', headerRight: HeaderRight }}
        >
          <Drawer.Screen
            name={t('myEvents')}
            component={MyEvents}
            options={{
              // eslint-disable-next-line react/prop-types
              tabBarIcon: ({ color }) => (
                <FontAwesome5 name="calendar-alt" size={23} color={color} />
              ),
              title: t('myEvents'),
            }}
          />
          <Drawer.Screen
            name="MyAccount"
            component={MyAccount}
            options={{ title: t('myAccount') }}
          />
        </Drawer.Navigator>
      </View>
      {/* eslint-disable-next-line react/style-prop-object */}
      <StatusBar style="light" translucent />
    </View>
  );
}

export default HomeCorporativo;
