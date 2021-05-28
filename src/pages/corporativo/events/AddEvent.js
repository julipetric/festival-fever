import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TextInput, HelperText, Caption } from 'react-native-paper';
import i18n, { t } from 'i18n-js';
import moment from 'moment';
import { Feather } from '@expo/vector-icons';
import { DatePickerModal } from 'react-native-paper-dates';
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

function AddEvent() {
  const { control, handleSubmit, formState } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const [timeDate, setTimeDate] = useState(undefined);
  const [timeDateOpen, setTimeDateOpen] = useState(false);

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
          // style={{ backgroundColor: BackgroundGray }}
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
        <FormTextInput
          name="addressDescription"
          autoCapitalize="words"
          control={control}
          label={t('addressDescription')}
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

export default AddEvent;
