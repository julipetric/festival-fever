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
import { useFirebase, useFirestore } from 'react-redux-firebase';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { PinkPrimary, TransparentBackdrop } from '../../assets/Colors';
import MyAccount from '../common/MyAccount';
import InactiveEvents from './InactiveEvents';
import MyEvents from './events/MyEvents';
import MyOrganization from './myOrganization/MyOrganization';

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
  // eslint-disable-next-line no-unused-vars
  const firestore = useFirestore();
  // eslint-disable-next-line no-unused-vars
  const userId = firebase.auth()?.currentUser?.uid;

  const { userRole } = useSelector(state => ({
    userRole: state.myStore?.userRole,
  }));

  async function logout() {
    await firebase.logout();
    navigation.navigate('AuthNavigator');
  }

  function navigateToQRScanner() {
    navigation.navigate('QRScanner');
  }

  const onDevPress = undefined;

  function HeaderRight() {
    return (
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <TouchableOpacity
          style={{ marginRight: 15 }}
          onPress={onDevPress || (() => {})}
          containerStyle={{ opacity: onDevPress ? 1 : 0.5 }}
          disabled={!onDevPress}
        >
          <FontAwesome5 name="dev" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={{ marginRight: 15 }}
          onPress={navigateToQRScanner}
        >
          <Ionicons name="qr-code" color="white" size={24} />
        </TouchableOpacity>
      </View>
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
          <Drawer.Screen name={t('myEvents')} component={MyEvents} />
          {userRole?.userTypeId === 2 ? (
            <Drawer.Screen
              name={t('inactiveEvents')}
              component={InactiveEvents}
            />
          ) : undefined}
          <Drawer.Screen name={t('myAccount')} component={MyAccount} />
          {userRole?.userTypeId === 2 ? (
            <Drawer.Screen
              name={t('myOrganization')}
              component={MyOrganization}
            />
          ) : undefined}
        </Drawer.Navigator>
      </View>
      {/* eslint-disable-next-line react/style-prop-object */}
      <StatusBar style="light" translucent />
    </View>
  );
}

export default HomeCorporativo;
