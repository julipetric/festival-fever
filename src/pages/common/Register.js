import i18n, { t } from 'i18n-js';
import moment from 'moment';
import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import { Feather } from '@expo/vector-icons';
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
  button: {
    marginTop: 40,
  },
});

export default function Register() {
  const { control, handleSubmit } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: UserRegisterSchema,
  });

  const [date, setDate] = useState(undefined);
  const [open, setOpen] = useState(false);

  const onDismissDatePicker = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirmDatePicker = useCallback(
    params => {
      setOpen(false);
      setDate(params.date);
    },
    [setOpen, setDate]
  );

  function registerFunction() {}

  return (
    <>
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

        <TextInput
          mode="outlined"
          label={t('birthday')}
          placeholder={t('birthday')}
          value={moment(date).format('LL')}
          editable={false}
          right={
            <TextInput.Icon
              icon={({ size, color }) => (
                <Feather name="calendar" size={size} color={color} />
              )}
              onPress={() => setOpen(true)}
            />
          }
        />

        <StyledButton
          mode="contained"
          style={styles.button}
          onPress={handleSubmit(registerFunction)}
        >
          {t('signUp')}
        </StyledButton>
      </View>
      <DatePickerModal
        locale={i18n.locale}
        mode="single"
        visible={open}
        onDismiss={onDismissDatePicker}
        date={date}
        onConfirm={onConfirmDatePicker}
        validRange={{
          endDate: new Date(),
        }}
        label={t('birthday')}
      />
    </>
  );
}
