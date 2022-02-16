import i18n, { t } from 'i18n-js';
import moment from 'moment';
import React, { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, StyleSheet } from 'react-native';
import { ActivityIndicator, HelperText, TextInput } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import { Feather } from '@expo/vector-icons';
import { useFirebase, useFirestoreConnect } from 'react-redux-firebase';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { first } from 'lodash';
import UserRegisterSchema from '../../schemas/UserRegisterSchema';
import FormTextInput from '../components/FormTextInput';
import StyledButton from '../components/StyledButton';
import PasswordFormTextInput from '../components/PasswordFormTextInput';
import { BackgroundGray } from '../../assets/Colors';

const styles = StyleSheet.create({
  keyboardScrollView: {
    height: '100%',
    backgroundColor: 'red',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    width: '80%',
    alignSelf: 'center',
    paddingBottom: 20,
  },
  button: {
    marginTop: 40,
  },
});

export default function Register() {
  const navigation = useNavigation();

  useFirestoreConnect({
    collection: 'roles',
    where: ['userTypeId', '==', 1],
    storeAs: 'attendeeRole',
  });

  const { control, handleSubmit, formState, getValues } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: useMemo(() => UserRegisterSchema(), []),
  });

  const attendeeRole = useSelector(
    state => state.firestore.ordered.attendeeRole
  );

  const firebase = useFirebase();

  const [birthday, setBirthday] = useState(undefined);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onDismissDatePicker = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  function onConfirmDatePicker(params) {
    setOpen(false);
    setBirthday(params.date);
  }

  async function registerFunction() {
    setLoading(true);
    const { email, password, name, lastName } = getValues();
    try {
      await firebase.createUser(
        { email, password },
        {
          name,
          lastName,
          birthday: moment(birthday).format('LL'),
          roles: [first(attendeeRole).id],
          balance: 0,
        }
      );
      setLoading(false);
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainAsistente' }],
      });
    } catch (error) {
      Alert.alert(t('error'), error.error || error);
    }
  }

  return attendeeRole ? (
    <>
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.container}
        extraHeight={100}
        enableOnAndroid
        enableAutomaticScroll
      >
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
        />
        <FormTextInput
          name="lastName"
          mode="outlined"
          autoCapitalize="none"
          control={control}
          label={t('lastName')}
        />
        <TextInput
          mode="outlined"
          label={t('birthday')}
          placeholder={t('birthday')}
          value={moment(birthday).format('LL')}
          style={{ backgroundColor: BackgroundGray }}
          onFocus={() => {
            setOpen(true);
          }}
          caretHidden
          right={
            <TextInput.Icon
              icon={({ size, color }) => (
                <Feather name="calendar" size={size} color={color} />
              )}
            />
          }
        />
        <HelperText visible={false}>dummyHelper</HelperText>

        <PasswordFormTextInput
          name="password"
          mode="outlined"
          control={control}
          label={t('password')}
        />

        <PasswordFormTextInput
          name="repeatPassword"
          mode="outlined"
          control={control}
          label={t('repeatPassword')}
        />
        {loading ? (
          <ActivityIndicator size="large" style={{ paddingTop: 40 }} />
        ) : (
          <StyledButton
            mode="contained"
            style={styles.button}
            onPress={handleSubmit(registerFunction)}
            disabled={!formState.isValid}
          >
            {t('signUp')}
          </StyledButton>
        )}
      </KeyboardAwareScrollView>
      <DatePickerModal
        locale={i18n.locale}
        mode="single"
        visible={open}
        onDismiss={onDismissDatePicker}
        date={birthday}
        onConfirm={onConfirmDatePicker}
        validRange={{
          endDate: new Date(),
          startDate: new Date(1930, 1),
        }}
        label={t('birthday')}
      />
    </>
  ) : (
    <ActivityIndicator size="large" style={{ paddingTop: 30 }} />
  );
}
