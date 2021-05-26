import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { t } from 'i18n-js';
import { useForm } from 'react-hook-form';
import { useFirebase } from 'react-redux-firebase';
import { useNavigation } from '@react-navigation/core';
import StyledButton from '../components/StyledButton';
import FormTextInput from '../components/FormTextInput';
import PasswordFormTextInput from '../components/PasswordFormTextInput';
import FormCheckbox from '../components/FormCheckbox';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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
  const { control, handleSubmit, getValues } = useForm();

  const firebase = useFirebase();
  const navigation = useNavigation();

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

      {/* NO FUNCIONA */}
      <FormCheckbox
        name="rememberUsername"
        defaultValue={false}
        control={control}
        label="Remember me"
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
    </View>
  );
}
