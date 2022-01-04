import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { t } from 'i18n-js';
import { useForm } from 'react-hook-form';
import { useFirebase, useFirestoreConnect } from 'react-redux-firebase';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, Title } from 'react-native-paper';
import { useSelector } from 'react-redux';
import StyledButton from '../components/StyledButton';
import FormTextInput from '../components/FormTextInput';
import PasswordFormTextInput from '../components/PasswordFormTextInput';
import FormCheckbox from '../components/FormCheckbox';
import RoleSelectorModal from './RoleSelectorModal';

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
  const { control, handleSubmit, getValues } = useForm();

  const firebase = useFirebase();
  const navigation = useNavigation();

  useFirestoreConnect(() => ['roles']);

  const { profile, roles } = useSelector(state => ({
    profile: state.firebase.profile,
    roles: state.firestore.ordered.roles,
  }));

  const [loading, setLoading] = useState(
    firebase.auth().currentUser !== undefined &&
      firebase.auth().currentUser !== null
  );
  const [roleSelectorVisible, setRoleSelectorVisible] = useState(false);
  const [userRoles, setUserRoles] = useState([]);

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
    setRoleSelectorVisible(false);
    if (role.userTypeId === 2) {
      navigateCorporativo();
    }
    if (role.userTypeId === 1) {
      navigateAsistente();
    }
  }

  useEffect(() => {
    if (navigation) {
      if (profile && roles && profile.roles) {
        setUserRoles(
          roles.filter(role =>
            profile.roles.some(userRoleId => userRoleId === role.id)
          )
        );
      }
    }
  }, [firebase, navigation, profile, roles]);

  useEffect(() => {
    if (userRoles.length) {
      if (userRoles.length > 1) {
        setRoleSelectorVisible(true);
      } else {
        if (userRoles.some(role => role.userTypeId === 2)) {
          navigateCorporativo();
          return;
        }
        if (userRoles.some(role => role.userTypeId === 1)) {
          navigateAsistente();
          return;
        }
        setLoading(false);
      }
    }
  }, [navigateAsistente, navigateCorporativo, userRoles]);

  function handleRegister() {
    navigation.push(t('register'));
  }

  return (
    <>
      <View style={styles.container}>
        <Title
          style={[
            styles.elementsPadding,
            {
              fontWeight: 'bold',
              fontSize: 40,
              color: 'white',
              fontFamily: 'MADE-Evolve-Sans-Bold',
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
      <RoleSelectorModal
        visible={roleSelectorVisible}
        closeModal={() => {
          setRoleSelectorVisible(false);
          setLoading(false);
        }}
        userRoles={userRoles}
        onRoleSelected={onRoleSelected}
      />
    </>
  );
}
