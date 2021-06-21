import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';
import { t } from 'i18n-js';
import { useForm } from 'react-hook-form';
import { useFirebase } from 'react-redux-firebase';
import { useNavigation } from '@react-navigation/core';
import { ActivityIndicator } from 'react-native-paper';
import { useSelector } from 'react-redux';
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

  const [loading, setLoading] = useState(false);

  const profile = useSelector(state => state.firebase.profile);

  async function loginFunction() {
    setLoading(true);
    try {
      await firebase.login({
        email: getValues().username,
        password: getValues().password,
      });
    } catch (e) {
      setLoading(false);
      Alert.alert(t('error'), t('wrongUserPasswordCombination'));
    }
  }

  useEffect(() => {
    if (profile && profile.userTypeId) {
      if (profile.userTypeId === 1) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainAsistente' }],
        });
      }
      if (profile.userTypeId === 2) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainCorporativo' }],
        });
      }
      setLoading(false);
    }
  }, [navigation, profile]);

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
      {loading ? (
        <ActivityIndicator />
      ) : (
        <>
          <StyledButton
            mode="contained"
            style={styles.button}
            onPress={handleSubmit(loginFunction)}
          >
            {t('login')}
          </StyledButton>

          <StyledButton
            mode="text"
            style={styles.button}
            onPress={handleRegister}
          >
            {t('register')}
          </StyledButton>
        </>
      )}
    </View>
  );
}
