import React from 'react';
import { StyleSheet } from 'react-native';
import { Modal, Portal, TextInput, Title } from 'react-native-paper';
import PropTypes from 'prop-types';
import { t } from 'i18n-js';
import StyledButton from '../../components/StyledButton';
import { DarkCardBackground } from '../../../assets/Colors';

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    padding: 10,
    margin: 30,
  },
  modalTitle: {
    color: DarkCardBackground,
    textTransform: 'uppercase',
  },
});

function AddFundsModal({ visible, setVisible, input, setInput, onConfirm }) {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={() => {
          setVisible(false);
        }}
        contentContainerStyle={styles.modalContainer}
      >
        <Title style={styles.modalTitle}>{t('addFunds')}</Title>
        <TextInput
          autoFocus
          keyboardType="decimal-pad"
          style={{ backgroundColor: 'rgb(150,150,150)' }}
          value={input}
          onChangeText={text => setInput(text)}
          testID="fundsInput"
        />
        <StyledButton
          label={t('confirm')}
          onPress={onConfirm}
          testID="addFundsConfirm"
          style={{ marginTop: 10 }}
        />
      </Modal>
    </Portal>
  );
}

AddFundsModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  input: PropTypes.string.isRequired,
  setInput: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default AddFundsModal;
