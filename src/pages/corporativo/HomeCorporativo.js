import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { t } from 'i18n-js';
import { useFirebase, useFirestore } from 'react-redux-firebase';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { PinkPrimary, TransparentBackdrop } from '../../assets/Colors';
import InactiveEvents from './InactiveEvents';
import MyEvents from './events/MyEvents';
import MyOrganization from './MyOrganization/MyOrganization';
import PersonalInformation from '../common/MyAccount/PersonalInformation';
import HelpAndSupport from './HelpAndSupport';
import { logout } from '../../firebase/Auth';

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

function CustomDrawerContent({ onLogout, ...props }) {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <DrawerContentScrollView {...props}>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <DrawerItemList {...props} />
      <DrawerItem label={t('logout')} onPress={onLogout} />
    </DrawerContentScrollView>
  );
}

CustomDrawerContent.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

function HomeCorporativo() {
  const dispatch = useDispatch();
  const firebase = useFirebase();
  const navigation = useNavigation();
  // eslint-disable-next-line no-unused-vars
  const firestore = useFirestore();
  // eslint-disable-next-line no-unused-vars
  const userId = firebase.auth()?.currentUser?.uid;

  const { userRole } = useSelector(state => ({
    userRole: state.myStore?.userRole,
  }));

  async function logoutFunc() {
    await logout(firebase, dispatch);
    navigation.navigate('AuthNavigator');
  }

  function navigateToQRScanner() {
    navigation.navigate('QRScanner');
  }

  const onDevPress = () => navigation.dispatch(DrawerActions.toggleDrawer());

  function HeaderRight() {
    return (
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <TouchableOpacity
          style={{ marginRight: 15 }}
          onPress={onDevPress || (() => {})}
          containerStyle={{ opacity: onDevPress ? 1 : 0.5 }}
          disabled={!onDevPress}
          testID="devButton"
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
      <View style={styles.mainLayout} testID="mainLayoutCorporativo">
        <Drawer.Navigator
          activeColor={PinkPrimary}
          initialRouteName={t('events')}
          drawerContent={props => (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <CustomDrawerContent onLogout={logoutFunc} {...props} />
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
          {userRole?.userTypeId === 2 ? (
            <Drawer.Screen
              name={t('myOrganization')}
              component={MyOrganization}
            />
          ) : undefined}
          <Drawer.Screen
            name={t('personalInformation')}
            component={PersonalInformation}
            options={{}}
          />
          {userRole?.userTypeId === 2 ? (
            <Drawer.Screen
              name={t('helpAndSupport')}
              component={HelpAndSupport}
              options={{}}
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
