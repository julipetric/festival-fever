import { t } from 'i18n-js';
import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Modal, Portal, Title } from 'react-native-paper';
import { useFirebase } from 'react-redux-firebase';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { DarkCardBackground } from '../../assets/Colors';
import StyledButton from '../components/StyledButton';
import { logout } from '../../firebase/Auth';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 10,
    margin: 30,
  },
  title: {
    color: DarkCardBackground,
    textTransform: 'uppercase',
  },
});

function RoleSelectorModal({ visible, closeModal, userRoles, onRoleSelected }) {
  const dispatch = useDispatch();
  const firebase = useFirebase();

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={() => {
          logout(firebase, dispatch);
          closeModal();
        }}
        contentContainerStyle={styles.container}
      >
        <Title style={styles.title} testID="selectRoleTitle">
          {t('selectRole')}
        </Title>
        <FlatList
          scrollEnabled={false}
          data={userRoles}
          renderItem={({ item, index }) => (
            <StyledButton
              label={item?.userTypeId === 1 ? t('attendee') : item.name}
              mode="text"
              onPress={() => onRoleSelected(item)}
              testID={`roleOption-${index}`}
            />
          )}
        />
      </Modal>
    </Portal>
  );
}

RoleSelectorModal.defaultProps = { userRoles: [] };

RoleSelectorModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  userRoles: PropTypes.array,
  onRoleSelected: PropTypes.func.isRequired,
};

export default RoleSelectorModal;
