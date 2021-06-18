import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TextInput, HelperText, Caption } from 'react-native-paper';
import i18n, { t } from 'i18n-js';
import moment from 'moment';
import { Feather, Ionicons } from '@expo/vector-icons';
import { DatePickerModal } from 'react-native-paper-dates';
import PropTypes from 'prop-types';
import StyledButton from '../../components/StyledButton';
import FormTextInput from '../../components/FormTextInput';
import { BackgroundGray } from '../../../assets/Colors';

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
  },
  button: {
    marginTop: 20,
  },
});

function AddEvent({ navigation }) {
  const { control, handleSubmit, formState } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const [timeDate, setTimeDate] = useState(undefined);
  const [timeDateOpen, setTimeDateOpen] = useState(false);
  const [
    address,
    // setAddress
  ] = useState();

  function onConfirmTimeDate(params) {
    setTimeDateOpen(false);
    setTimeDate(params.date);
  }

  function onSave() {}

  return (
    <>
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.container}
        extraHeight={125}
        enableOnAndroid
        enableAutomaticScroll
      >
        <FormTextInput
          name="eventName"
          autoCapitalize="words"
          control={control}
          label={t('eventName')}
          autoFocus
        />
        <TextInput
          label={t('timeAndDate')}
          placeholder={t('timeAndDate')}
          value={moment(timeDate).format('LL')}
          editable={false}
          right={
            <TextInput.Icon
              icon={({ size, color }) => (
                <Feather name="calendar" size={size} color={color} />
              )}
              onPress={() => setTimeDateOpen(true)}
            />
          }
          style={{ backgroundColor: BackgroundGray }}
        />
        <HelperText visible={false}>dummyHelper</HelperText>
        <TextInput
          label={t('location')}
          placeholder={t('location')}
          value={address}
          editable={false}
          right={
            <TextInput.Icon
              icon={({ size, color }) => (
                <Ionicons name="location" size={size} color={color} />
              )}
              onPress={() => navigation.push('FullScreenMapView')}
            />
          }
          style={{ backgroundColor: BackgroundGray }}
        />
        <HelperText visible={false}>dummyHelper</HelperText>
        <FormTextInput
          name="address"
          autoCapitalize="words"
          control={control}
          label={t('address')}
          multiline
        />
        <FormTextInput
          name="contactPhone"
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          control={control}
          label={t('contactPhone')}
        />
        <FormTextInput
          name="contactEmail"
          textContentType="emailAddress"
          control={control}
          label={t('contactEmail')}
        />
        <Caption>{t('createEventProductNotes')}</Caption>
        <StyledButton
          mode="contained"
          style={styles.button}
          onPress={handleSubmit(onSave)}
          disabled={!formState.isValid}
        >
          {t('save')}
        </StyledButton>
      </KeyboardAwareScrollView>
      <DatePickerModal
        locale={i18n.locale}
        mode="multiple"
        visible={timeDateOpen}
        onDismiss={() => setTimeDateOpen(false)}
        date={timeDate}
        onConfirm={onConfirmTimeDate}
        validRange={{
          startDate: new Date(),
        }}
        label={t('timeAndDate')}
      />
    </>
  );
}

AddEvent.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default AddEvent;
