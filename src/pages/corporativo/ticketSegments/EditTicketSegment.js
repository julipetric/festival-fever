import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ActivityIndicator, TextInput } from 'react-native-paper';
import { t } from 'i18n-js';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFirebase, useFirestore } from 'react-redux-firebase';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import StyledButton from '../../components/StyledButton';
import FormTextInput from '../../components/FormTextInput';
import TicketSegmentSchema from '../../../schemas/TicketSegmentSchema';
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

function EditTicketSegment() {
  const navigation = useNavigation();
  const firestore = useFirestore();
  const firebase = useFirebase();
  const dispatch = useDispatch();
  const { params } = useRoute();
  const item = params?.item;
  const purchasable = params?.purchasable;

  const { event } = useSelector(state => ({
    event: state.myStore.selectedEvent,
  }));

  const { control, handleSubmit, formState, watch } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      ...item,
      ...purchasable,
    },
    resolver: useMemo(
      () => TicketSegmentSchema(purchasable?.sold || 0),
      [purchasable]
    ),
  });

  const [loading, setLoading] = useState(false);

  async function onSave() {
    setLoading(true);
    try {
      const { name, description, stock, price } = watch();
      const savePurchasable = {
        name,
        description,
        stock: stock || '',
        price,
      };
      if (!item) {
        const purchasableId = (
          await (
            await firestore
              .collection('purchasables')
              .add({ ...savePurchasable, active: true, sold: 0 })
          ).get()
        ).id;
        await firestore
          .collection('ticketSegments')
          .add({ eventId: event.id, purchasableId });
      } else {
        await firestore
          .collection('purchasables')
          .doc(item.purchasableId)
          .update(savePurchasable);
      }
      const saveEvent = {
        ...event,
        lastEditBy: {
          userId: firebase.auth()?.currentUser?.uid,
          timestamp: moment().unix(),
        },
      };
      delete saveEvent.category;
      delete saveEvent.id;
      await firestore.collection('events').doc(event.id).update(saveEvent);
      dispatch(setSelectedEvent({ ...event, ...saveEvent }));
      setLoading(false);
      navigation.goBack();
    } catch (e) {
      Alert.alert(t('error'), JSON.stringify(e));
      setLoading(false);
    }
  }

  const disabled = purchasable?.sold > 0;

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
          label={t('name')}
          autoFocus={!disabled}
          disabled={disabled}
        />
        <FormTextInput
          name="description"
          control={control}
          label={t('description')}
          disabled={disabled}
        />
        <FormTextInput
          name="price"
          control={control}
          label={t('price')}
          keyboardType="number-pad"
          left={<TextInput.Affix text="$" />}
          disabled={disabled}
        />
        <FormTextInput
          name="stock"
          control={control}
          label={t('stock')}
          keyboardType="decimal-pad"
        />

        {loading ? (
          <ActivityIndicator style={styles.button} size="large" />
        ) : (
          <StyledButton
            mode="contained"
            style={styles.button}
            onPress={handleSubmit(onSave)}
            disabled={formState.isSubmitted && !formState.isValid}
          >
            {t('save')}
          </StyledButton>
        )}
      </KeyboardAwareScrollView>
    </>
  );
}

export default EditTicketSegment;
