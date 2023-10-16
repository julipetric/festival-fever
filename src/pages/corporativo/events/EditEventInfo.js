import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  TextInput,
  HelperText,
  Caption,
  ActivityIndicator,
  Menu,
  Switch,
  Text,
} from 'react-native-paper';
import i18n, { t } from 'i18n-js';
import moment from 'moment';
import { Feather, Ionicons } from '@expo/vector-icons';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  useFirebase,
  useFirestore,
  useFirestoreConnect,
} from 'react-redux-firebase';
import { useDispatch, useSelector } from 'react-redux';
import StyledButton from '../../components/StyledButton';
import FormTextInput from '../../components/FormTextInput';
import { BackgroundGray } from '../../../assets/Colors';
import { formatEventForm } from '../../../firebase/EventsHelper';
import EventInfoSchema from '../../../schemas/EventInfoSchema';
import { setSelectedEvent } from '../../../redux/myStoreSlice';

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
  const firestore = useFirestore();
  const route = useRoute();
  const newEvent = route?.params?.newEvent;
  const dispatch = useDispatch();
  const firebase = useFirebase();

  useFirestoreConnect(() => [{ collection: 'categories', orderBy: ['order'] }]);
  const { categories, event } = useSelector(state => ({
    categories: state.firestore.ordered.categories,
    event: state.myStore.selectedEvent,
  }));
  const { control, handleSubmit, formState, watch, setValue, getValues } =
    useForm({
      mode: 'onChange',
      reValidateMode: 'onChange',
      defaultValues: newEvent
        ? { active: true }
        : {
            ...event,
            category: event
              ? categories.find(category => category.id === event.categoryId)
              : undefined,
            active: event?.active !== undefined ? event.active : true,
          },
      resolver: useMemo(() => EventInfoSchema(), []),
    });

  const [loading, setLoading] = useState(false);

  const [startDate, setStartDate] = useState(
    !newEvent && event ? moment.unix(event.startDate) : undefined
  );
  const [endDate, setEndDate] = useState(
    !newEvent && event ? moment.unix(event.endDate) : undefined
  );
  const [dateOpen, setDateOpen] = useState(false);
  const [settingStartTime, setSettingStartTime] = useState(true);
  const [timeOpen, setTimeOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  function onConfirmDate(params) {
    setStartDate(moment(params.date));
    setDateOpen(false);
    setTimeOpen(true);
  }
  function onConfirmTime(e) {
    const params = e;
    if (params.hours === 12 || params.hours === 24) params.hours -= 12;
    if (settingStartTime) {
      setStartDate(startDate.hours(params.hours).minutes(params.minutes));
      setSettingStartTime(false);
    } else {
      const end = moment(startDate).hours(params.hours).minutes(params.minutes);
      if (
        params.hours < startDate.hours() ||
        (params.hours <= startDate.hours() &&
          params.minutes < startDate.minutes())
      )
        end.add(1, 'day');
      setEndDate(end);
      setTimeOpen(false);
      setSettingStartTime(true);
    }
  }

  function onLocationSelected(location) {
    setValue('location.coordinates', JSON.stringify(location));
  }

  function onSaveSuccess() {
    setLoading(false);
    if (watch('active')) navigation.navigate(t('myEvents'));
    else navigation.navigate(t('inactiveEvents'));
  }

  async function onSave() {
    setLoading(true);
    try {
      const saveEvent = formatEventForm(watch(), startDate, endDate);
      saveEvent.lastEditBy = {
        userId: firebase.auth()?.currentUser?.uid,
        timestamp: moment().unix(),
      };
      if (newEvent || !event)
        await firestore.collection('events').add(saveEvent);
      else await firestore.collection('events').doc(event.id).update(saveEvent);
      dispatch(
        setSelectedEvent({
          ...saveEvent,
          category: event?.category || watch('category'),
        })
      );
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
          value={
            startDate && endDate
              ? `${startDate?.format('MMM D, H:mm')}${
                  endDate ? ` - ${endDate?.format('H:mm')}` : ''
                }`
              : null
          }
          editable={false}
          right={
            <TextInput.Icon
              icon={({ size, color }) => (
                <Feather name="calendar" size={size} color={color} />
              )}
              onPress={() => setDateOpen(true)}
            />
          }
          style={{ backgroundColor: BackgroundGray }}
        />
        <HelperText visible={false}>dummyHelper</HelperText>
        <TextInput
          label={t('location')}
          placeholder={t('location')}
          value={
            watch('location.coordinates') ? t('seeSelectedLocation') : undefined
          }
          editable={false}
          right={
            <TextInput.Icon
              icon={({ size, color }) => (
                <Ionicons name="location" size={size} color={color} />
              )}
              onPress={() =>
                navigation.push('FullScreenMapView', {
                  callback: onLocationSelected,
                  defaultMarker: watch('location.coordinates'),
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
          autoCapitalize="none"
          autoCompleteType="email"
          keyboardType="email-address"
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: 10,
          }}
        >
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
            {t('active')}
          </Text>
          <Switch
            value={watch('active')}
            onValueChange={() => setValue('active', !getValues('active'))}
          />
        </View>

        {(newEvent || !event) && (
          <Caption>{t('createEventProductNotes')}</Caption>
        )}
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
        visible={dateOpen}
        mode="single"
        onDismiss={() => setDateOpen(false)}
        onConfirm={onConfirmDate}
        validRange={{
          startDate: new Date(),
        }}
        label={t('date')}
        date={startDate?.toDate()}
      />
      <TimePickerModal
        locale={i18n.locale}
        visible={timeOpen}
        onConfirm={onConfirmTime}
        onDismiss={() => {
          setSettingStartTime(true);
          setTimeOpen(false);
        }}
        label={settingStartTime ? t('startTime') : t('endTime')}
      />
    </>
  );
}

export default EditEventInfo;
