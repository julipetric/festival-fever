import { t } from 'i18n-js';
import React from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import UserRegisterSchema from '../../schemas/UserRegisterSchema';
import FormTextInput from '../components/FormTextInput';
import StyledButton from '../components/StyledButton';

const styles = StyleSheet.create({
  container: {
    resizeMode: 'cover',
    flex: 1,
    justifyContent: 'center',
    height: '100%',
    width: '80%',
    alignSelf: 'center',
  },
});

export default function Register() {
  const { control, handleSubmit } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: UserRegisterSchema,
  });

  function registerFunction() {}

  return (
    <View style={styles.container}>
      <FormTextInput
        name="email"
        mode="outlined"
        autoCapitalize="none"
        control={control}
        label={t('email')}
        autoFocus
        autoCompleteType="email"
      />
      <FormTextInput
        name="name"
        mode="outlined"
        autoCapitalize="none"
        control={control}
        label={t('name')}
        autoFocus
        autoCompleteType="email"
      />
      <FormTextInput
        name="lastName"
        mode="outlined"
        autoCapitalize="none"
        control={control}
        label={t('lastName')}
        autoFocus
        autoCompleteType="email"
      />
      <StyledButton
        mode="contained"
        style={styles.button}
        onPress={handleSubmit(registerFunction)}
      >
        {t('signUp')}
      </StyledButton>
    </View>
  );
}
