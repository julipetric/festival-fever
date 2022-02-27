import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  ActivityIndicator,
  Checkbox,
  Modal,
  Portal,
  Text,
} from 'react-native-paper';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { t } from 'i18n-js';
import { useFirestore } from 'react-redux-firebase';
import theme from '../../../assets/theme';
import { BackgroundGray, PinkPrimary } from '../../../assets/Colors';
import StyledButton from '../../components/StyledButton';

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    padding: 10,
    margin: 30,
  },
});

function UserRoleModal({ user, setSelectedUser }) {
  const firestore = useFirestore();
  const { organizationRoles, attendeeRole } = useSelector(state => ({
    attendeeRole: state.myStore.attendeeRole,
    organizationRoles: state.firestore.ordered.organizationRoles,
  }));

  const [selectedRoles, setSelectedRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user)
      setSelectedRoles(
        organizationRoles.map(role => ({
          role,
          active: user?.roles?.some(e => e === role.id),
        }))
      );
  }, [organizationRoles, user]);

  async function onSave() {
    setLoading(true);
    const saveUser = { ...user };
    delete saveUser.id;
    saveUser.roles = [
      attendeeRole.id,
      ...selectedRoles?.filter(role => role.active).map(role => role.role.id),
    ];
    await firestore.collection('users').doc(user.id).update(saveUser);
    setSelectedUser(undefined);
    setLoading(false);
  }

  return (
    <Portal>
      <Modal
        contentContainerStyle={styles.modalContainer}
        visible={user}
        onDismiss={() => setSelectedUser(undefined)}
      >
        {selectedRoles.map(role => {
          const disabled =
            loading ||
            (role.role.userTypeId === 2 &&
              user?.roles?.some(e => e === role.role.id));
          return (
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                opacity: disabled ? 0.5 : 1,
              }}
              key={role.id}
            >
              <Checkbox
                theme={{
                  ...theme,
                  colors: { ...theme.colors, disabled: PinkPrimary },
                }}
                onPress={() => {
                  const newRoles = [...selectedRoles];
                  const index = newRoles.findIndex(
                    e => e.role.name === role.role.name
                  );
                  newRoles.splice(index, 1, {
                    ...selectedRoles[index],
                    active: !role.active,
                  });
                  setSelectedRoles(newRoles);
                }}
                status={role.active ? 'checked' : 'unchecked'}
                disabled={disabled}
                uncheckedColor={BackgroundGray}
              />
              <Text style={{ color: 'black' }}>{role.role.name}</Text>
            </View>
          );
        })}
        {loading ? (
          <ActivityIndicator />
        ) : (
          <View style={{ alignItems: 'flex-end' }}>
            <StyledButton label={t('save')} mode="text" onPress={onSave} />
          </View>
        )}
      </Modal>
    </Portal>
  );
}
UserRoleModal.defaultProps = { user: undefined };
UserRoleModal.propTypes = {
  user: PropTypes.object,
  setSelectedUser: PropTypes.func.isRequired,
};

export default UserRoleModal;
