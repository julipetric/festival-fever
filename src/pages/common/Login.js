import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { t } from 'i18n-js';
import { useForm } from 'react-hook-form';
import {
  useFirebase,
  useFirestore,
  useFirestoreConnect,
} from 'react-redux-firebase';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, Title } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import StyledButton from '../components/StyledButton';
import FormTextInput from '../components/FormTextInput';
import PasswordFormTextInput from '../components/PasswordFormTextInput';
import FormCheckbox from '../components/FormCheckbox';
import RoleSelectorModal from './RoleSelectorModal';
import { setUserRole, setUserRoles } from '../../redux/myStoreSlice';
import LoginSchema from '../../schemas/LoginSchema';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    width: '80%',
    alignSelf: 'center',
    paddingHorizontal: 20,
  },
  elementsPadding: {
    padding: 8,
  },
  button: {
    margin: 10,
    marginTop: 20,
  },
});

export default function Login() {
  const { control, handleSubmit, getValues, formState, trigger } = useForm({
    resolver: useMemo(() => LoginSchema(), []),
    mode: 'onChange',
  });

  const firebase = useFirebase();
  const firestore = useFirestore();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const currentUser = firebase.auth()?.currentUser;

  const { profile, userRoles, storeRoles } = useSelector(state => ({
    profile: state.firebase.profile,
    userRoles: state.firestore.ordered.userRoles,
    storeRoles: state.myStore.userRoles,
  }));

  useFirestoreConnect(() => {
    if (currentUser && profile?.roles?.length)
      return {
        collection: 'roles',
        where: [firestore.FieldPath.documentId(), 'in', profile?.roles],
        storeAs: 'userRoles',
      };
    return undefined;
  });

  const [loading, setLoading] = useState(
    currentUser !== undefined && currentUser !== null
  );

  const [roleSelectorVisible, setRoleSelectorVisible] = useState(false);

  async function loginFunction() {
    setLoading(true);
    try {
      firebase
        .auth()
        .setPersistence(getValues().rememberLogin ? 'local' : 'none');
      await firebase.login({
        email: getValues().username,
        password: getValues().password,
      });
    } catch (e) {
      setLoading(false);
      Alert.alert(t('error'), t('wrongUserPasswordCombination'));
    }
  }

  const navigateCorporativo = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainCorporativo' }],
    });
  }, [navigation]);

  const navigateAsistente = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainAsistente' }],
    });
  }, [navigation]);

  function onRoleSelected(role) {
    dispatch(setUserRole(role));
    setRoleSelectorVisible(false);
    if (role?.userTypeId === 1) {
      navigateAsistente();
    } else {
      navigateCorporativo();
    }
  }

  useEffect(() => {
    dispatch(setUserRoles(userRoles));
  }, [dispatch, userRoles]);

  useEffect(() => {
    if (currentUser && storeRoles) {
      setLoading(false);
      if (storeRoles.length > 1) {
        setRoleSelectorVisible(true);
      } else if (storeRoles.some(role => role?.userTypeId === 1)) {
        navigateAsistente();
      } else {
        navigateCorporativo();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeRoles]);

  function handleRegister() {
    navigation.push(t('register'));
  }

  async function handleForgotPassword() {
    trigger('username', true);
    if (!formState.errors?.username && formState.isDirty) {
      setLoading(true);
      await firebase.auth().sendPasswordResetEmail(getValues().username);
      setLoading(false);
      Alert.alert(
        t('passwordReset'),
        t('passwordResetMessage', { email: getValues().username })
      );
    }
  }

  return (
    <>
      <View style={styles.container}>
        <Title
          testID="loginTitle"
          style={[
            styles.elementsPadding,
            {
              fontWeight: 'bold',
              fontSize: 40,
              color: 'white',
              fontFamily: 'Poppins-Bold',
            },
          ]}
        >
          festival fever
        </Title>

        <FormTextInput
          name="username"
          mode="outlined"
          autoCapitalize="none"
          control={control}
          label={t('username')}
          style={styles.elementsPadding}
          autoFocus
          autoCompleteType="username"
          disabled={loading}
          keyboardType="email-address"
        />

        <PasswordFormTextInput
          name="password"
          mode="outlined"
          control={control}
          label={t('password')}
          style={styles.elementsPadding}
          disabled={loading}
        />
        <FormCheckbox
          name="rememberLogin"
          defaultValue={false}
          control={control}
          label={t('rememberMe')}
          disabled={loading}
        />

        {loading ? (
          <ActivityIndicator style={{ paddingTop: 10 }} />
        ) : (
          <>
            <StyledButton
              testID="loginButton"
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
            <StyledButton
              mode="text"
              style={[styles.button, { paddingHorizontal: 0 }]}
              onPress={handleForgotPassword}
            >
              {t('forgotPassword')}
            </StyledButton>
          </>
        )}
      </View>
      <RoleSelectorModal
        visible={roleSelectorVisible}
        closeModal={() => {
          setRoleSelectorVisible(false);
        }}
        userRoles={userRoles}
        onRoleSelected={onRoleSelected}
      />
    </>
  );
}
