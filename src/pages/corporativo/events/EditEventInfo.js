import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  TextInput,
  HelperText,
  Caption,
  ActivityIndicator,
  Menu,
} from 'react-native-paper';
import i18n, { t } from 'i18n-js';
import moment from 'moment';
import { Feather, Ionicons } from '@expo/vector-icons';
import { DatePickerModal } from 'react-native-paper-dates';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFirestore, useFirestoreConnect } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import StyledButton from '../../components/StyledButton';
import FormTextInput from '../../components/FormTextInput';
import { BackgroundGray } from '../../../assets/Colors';
import { formatEventForm } from '../../../firebase/EventsHelper';

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  button: {
    marginTop: 20,
  },
});

function EditEventInfo() {
  const navigation = useNavigation();
  const route = useRoute();

  const firestore = useFirestore();

  useFirestoreConnect(() => [
    { collection: 'categories', orderBy: ['order'] },
    { collection: 'events' },
  ]);
  const { categories } = useSelector(state => ({
    categories: state.firestore.ordered.categories,
  }));

  const event = route?.params?.event;

  const { control, handleSubmit, formState, watch, setValue } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      ...event,
      category: event
        ? categories.find(category => category.id === event.categoryId)
        : undefined,
      // location: JSON.parse(event.location)
    },
  });

  const [loading, setLoading] = useState(false);

  const [timeDate, setTimeDate] = useState(undefined);
  const [timeDateOpen, setTimeDateOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  function onConfirmTimeDate(params) {
    setTimeDateOpen(false);
    setTimeDate(params.date || params.dates);
  }

  function onLocationSelected(location) {
    setValue('location', JSON.stringify(location));
  }

  function onSaveSuccess() {
    setLoading(false);
    navigation.pop();
  }

  async function onSave() {
    setLoading(true);
    try {
      const saveEvent = formatEventForm(watch(), timeDate);
      if (!event) await firestore.collection('events').add(saveEvent);
      else await firestore.collection('events').doc(event.id).update(saveEvent);
      onSaveSuccess();
    } catch (e) {
      Alert.alert(t('error'), JSON.stringify(e));
      setLoading(false);
    }
  }

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
          name="name"
          autoCapitalize="words"
          control={control}
          label={t('eventName')}
          autoFocus
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
                  name="category"
                  control={control}
                  label={t('category')}
                  editable={false}
                  valueGetter={category =>
                    category ? category.name : undefined
                  }
                />
              </TouchableOpacity>
            </>
          }
        >
          {(categories || []).map(category => (
            <Menu.Item
              onPress={() => {
                setValue('category', category);
                setMenuVisible(false);
              }}
              title={category.name}
              key={category.id}
            />
          ))}
        </Menu>
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
          value={watch('location') ? t('seeSelectedLocation') : undefined}
          editable={false}
          right={
            <TextInput.Icon
              icon={({ size, color }) => (
                <Ionicons name="location" size={size} color={color} />
              )}
              onPress={() =>
                navigation.push('FullScreenMapView', {
                  callback: onLocationSelected,
                  defaultMarker: watch('location'),
                })
              }
            />
          }
          style={{ backgroundColor: BackgroundGray }}
        />
        <HelperText visible={false}>dummyHelper</HelperText>
        <FormTextInput
          name="location.address"
          autoCapitalize="words"
          control={control}
          label={t('address')}
        />
        <FormTextInput
          name="location.description"
          autoCapitalize="words"
          control={control}
          label={t('addressDescription')}
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
        <View
          style={{
            alignItems: 'flex-start',
            padding: 0,
            margin: 0,
          }}
        >
          <StyledButton
            label={t('editPhoto')}
            style={{ paddingHorizontal: 0, marginBottom: 15 }}
          />
        </View>
        {!event && <Caption>{t('createEventProductNotes')}</Caption>}
        {loading ? (
          <ActivityIndicator style={styles.button} size="large" />
        ) : (
          <StyledButton
            mode="contained"
            style={styles.button}
            onPress={handleSubmit(onSave)}
            disabled={!formState.isValid}
          >
            {t('save')}
          </StyledButton>
        )}
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

export default EditEventInfo;
