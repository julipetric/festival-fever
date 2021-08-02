import { t } from 'i18n-js';
import React from 'react';
import { View } from 'react-native';
import { useFirebase } from 'react-redux-firebase';
import { useNavigation } from '@react-navigation/native';
import StyledButton from '../components/StyledButton';

export default function MyAccount() {
  const firebase = useFirebase();
  const navigation = useNavigation();

  async function logout() {
    await firebase.logout();
    navigation.navigate('AuthNavigator');
  }

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
      <StyledButton label={t('logout')} onPress={logout} />
    </View>
  );
}
