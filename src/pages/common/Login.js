import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { t } from 'i18n-js';
import { useForm } from 'react-hook-form';
import { Dialog, Portal } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useFirebase } from 'react-redux-firebase';
import StyledButton from '../components/StyledButton';
import FormTextInput from '../components/FormTextInput';

const styles = StyleSheet.create({
  container: {
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

  function hideDialog() {
    setAlertVisible(false);
  }

  function loginFunction() {
    firebase
      .login({
        email: getValues().username,
        password: getValues().password,
      })
      .then(() => {
        console.log('success');
      });
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
        control={control}
        label={t('username')}
        style={styles.elementsPadding}
      />

      <FormTextInput
        name="password"
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
