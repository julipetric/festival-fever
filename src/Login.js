import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { t } from 'i18n-js';
import { Controller, useForm } from 'react-hook-form';
import { TextInput } from 'react-native-paper';
import StyledButton from './components/StyledButton';

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

function Login() {
  const { control, handleSubmit, watch } = useForm();

  const [alertVisible, setAlertVisible] = useState(false);

  function hideDialog() {
    setAlertVisible(false);
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

      <Controller
        control={control}
        name="username"
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <TextInput
            label={t('username')}
            onBlur={onBlur}
            onChange={onChange}
            checked={value}
            inputRef={ref}
            style={styles.elementsPadding}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <TextInput
            label={t('password')}
            onBlur={onBlur}
            onChange={onChange}
            checked={value}
            inputRef={ref}
            style={styles.elementsPadding}
          />
        )}
      />

      <StyledButton mode="contained" style={styles.button}>
        {t('login')}
      </StyledButton>
    </View>
  );
}

export default Login;
