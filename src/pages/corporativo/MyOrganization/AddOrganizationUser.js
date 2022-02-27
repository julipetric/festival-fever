import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  ActivityIndicator,
  Menu,
  Modal,
  Portal,
  Title,
} from 'react-native-paper';
import PropTypes from 'prop-types';
import { t } from 'i18n-js';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useFirestore } from 'react-redux-firebase';
import { first } from 'lodash';
import { useSelector } from 'react-redux';
import StyledButton from '../../components/StyledButton';
import FormTextInput from '../../components/FormTextInput';
import { themeBlackText } from '../../../assets/theme';
import { BackgroundGray } from '../../../assets/Colors';

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 30,
  },
});
function AddOrganizationUser({ visible, setVisible }) {
  const firestore = useFirestore();

  const [loading, setLoading] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const { organizationRoles, organizationUsers } = useSelector(state => ({
    organizationRoles: state.firestore.ordered.organizationRoles,
    organizationUsers: state.firestore.ordered.organizationUsers,
  }));

  const { control, handleSubmit, reset, watch, setValue } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    resolver: yupResolver(
      yup.object({
        email: yup.string().email().required().label(t('email')),
        role: yup.object().required().label(t('role')),
      })
    ),
  });

  async function onSubmit() {
    if (organizationUsers.find(e => e.email === watch('email'))) {
      Alert.alert(
        t('userAlreadyAdded'),
        t('userAlreadyAddedDescription'),
        [
          {
            text: t('ok'),
            onPress: () => {
              setVisible(false);
            },
            style: 'cancel',
          },
        ],
        {
          cancelable: false,
        }
      );
    } else {
      setLoading(true);
      const { docs: users } = await firestore
        .collection('users')
        .where('email', '==', watch('email'))
        .get();
      if (users?.length) {
        const user = first(users).data();
        const saveUser = { ...user, roles: [...user.roles, watch('role').id] };
        await firestore
          .collection('users')
          .doc(first(users).id)
          .update(saveUser);
        setVisible(false);
      } else {
        Alert.alert(t('userNotFound'), t('addExistentUser'), undefined, {
          cancelable: true,
        });
      }
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!visible) reset();
  }, [reset, visible]);

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={() => setVisible(false)}
        contentContainerStyle={styles.modalContainer}
      >
        <Title style={{ color: 'black', paddingBottom: 10 }}>
          {t('addUser')}
        </Title>
        <FormTextInput
          label={t('email')}
          name="email"
          control={control}
          style={{ backgroundColor: 'white' }}
          underlineColor={BackgroundGray}
          theme={themeBlackText}
        />
        <Menu
          style={{ paddingTop: 60 }}
          contentStyle={{ display: 'flex' }}
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <>
              <TouchableOpacity onPress={() => setMenuVisible(true)}>
                <FormTextInput
                  name="role"
                  control={control}
                  label={t('role')}
                  style={{ backgroundColor: 'white' }}
                  underlineColor={BackgroundGray}
                  theme={themeBlackText}
                  editable={false}
                  valueGetter={category =>
                    category ? category.name : undefined
                  }
                />
              </TouchableOpacity>
            </>
          }
        >
          {(organizationRoles || []).map(role => (
            <Menu.Item
              onPress={() => {
                setValue('role', role);
                setMenuVisible(false);
              }}
              title={role.name}
              key={role.id}
            />
          ))}
        </Menu>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <View style={{ alignItems: 'flex-end' }}>
            <StyledButton
              label={t('add')}
              mode="text"
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        )}
      </Modal>
    </Portal>
  );
}

AddOrganizationUser.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
};

export default AddOrganizationUser;
