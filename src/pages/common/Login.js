import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { t } from 'i18n-js';
import { useForm } from 'react-hook-form';
import { Dialog, Portal } from 'react-native-paper';
import { useFirebase } from 'react-redux-firebase';
import { useNavigation } from '@react-navigation/core';
import StyledButton from '../components/StyledButton';
import FormTextInput from '../components/FormTextInput';
import PasswordFormTextInput from '../components/PasswordFormTextInput';

const styles = StyleSheet.create({
  container: {
    resizeMode: 'cover',
    flex: 1,
    justifyContent: 'center',
    height: '100%',
    width: '80%',
    alignSelf: 'center',
    paddingHorizontal: 20,
  },
  elementsPadding: {
    margin: 10,
  },
  button: {
    margin: 10,
  },
});

export default function Login() {
  const { control, handleSubmit, watch, getValues } = useForm();

  const [alertVisible, setAlertVisible] = useState(false);

  const firebase = useFirebase();
  const navigation = useNavigation();

  function hideDialog() {
    setAlertVisible(false);
  }

  function loginFunction() {
    firebase.login({
      email: getValues().username,
      password: getValues().password,
    });
  }

  function handleRegister() {
    navigation.push(t('register'));
  }

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.elementsPadding,
          { fontWeight: 'bold', fontSize: 30, color: 'white' },
        ]}
      >
        FESTIVAL FEVER LOGO
      </Text>

      <FormTextInput
        name="username"
        mode="outlined"
        autoCapitalize="none"
        control={control}
        label={t('username')}
        style={styles.elementsPadding}
        autoFocus
        autoCompleteType="username"
      />

      <PasswordFormTextInput
        name="password"
        mode="outlined"
        control={control}
        label={t('password')}
        style={styles.elementsPadding}
      />

      <StyledButton
        mode="contained"
        style={styles.button}
        onPress={handleSubmit(loginFunction)}
      >
        {t('login')}
      </StyledButton>

      <StyledButton mode="text" style={styles.button} onPress={handleRegister}>
        {t('register')}
      </StyledButton>

      <Portal>
        <Dialog visible={alertVisible} onDismiss={hideDialog}>
          <Dialog.Title>{watch('username')}</Dialog.Title>
          <Dialog.Content>
            <Text>{watch('password')}</Text>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </View>
  );
}
