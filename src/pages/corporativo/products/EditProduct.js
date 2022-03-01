import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, StyleSheet, Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ActivityIndicator, TextInput } from 'react-native-paper';
import { t } from 'i18n-js';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFirebase, useFirestore } from 'react-redux-firebase';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { uniq, uniqueId } from 'lodash';
import StyledButton from '../../components/StyledButton';
import FormTextInput from '../../components/FormTextInput';
import NoImage from '../../../assets/no-image.png';
import ProductSchema from '../../../schemas/ProductSchema';
import ProductPhoto from './ProductPhoto';
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

function EditProduct() {
  const navigation = useNavigation();
  const firestore = useFirestore();
  const firebase = useFirebase();
  const dispatch = useDispatch();
  const { params } = useRoute();
  const item = params?.item;

  const { event } = useSelector(state => ({
    event: state.myStore.selectedEvent,
  }));

  const { control, handleSubmit, formState, watch } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      ...item,
    },
    resolver: useMemo(() => ProductSchema(item?.sold || 0), [item]),
  });

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(
    item?.imageUrl || Image.resolveAssetSource(NoImage).uri
  );

  function onSaveSuccess() {
    setLoading(false);
    navigation.goBack();
  }

  async function onSave() {
    setLoading(true);
    try {
      const { name, description, stock, price } = watch();

      const resultImage = await fetch(image);
      const blob = await resultImage.blob();

      const fileExtension = image.substring(image.lastIndexOf('.') + 1);

      const fileName = `${name.substring(0, 10)}-${
        item?.id || uniqueId()
      }-${moment().unix()}.${fileExtension}`;

      const uploadResult = await firebase.uploadFile(
        'products',
        blob,
        undefined,
        {
          name: fileName,
        }
      );

      const downloadUrl =
        await uploadResult.uploadTaskSnapshot.ref.getDownloadURL();

      const savePurchasable = {
        ...item,
        name,
        description: description || '',
        stock: stock || '',
        price,
        imageUrl: downloadUrl,
      };

      delete savePurchasable.id;

      if (item?.imageUrl) {
        const pathToDelete = firebase.storage().refFromURL(item?.imageUrl);
        await firebase.deleteFile(pathToDelete.fullPath);
      }

      let purchasableId;
      if (!item) {
        purchasableId = (
          await (
            await firestore
              .collection('purchasables')
              .add({ ...savePurchasable, active: true, sold: 0 })
          ).get()
        ).id;
      } else {
        purchasableId = item.id;
        await firestore
          .collection('purchasables')
          .doc(item.id)
          .update(savePurchasable);
      }
      const saveEvent = {
        ...event,
        products: uniq([...(event?.products || []), purchasableId]),
        lastEditBy: {
          userId: firebase.auth()?.currentUser?.uid,
          timestamp: moment().unix(),
        },
      };
      delete saveEvent.category;
      delete saveEvent.id;
      await firestore.collection('events').doc(event.id).update(saveEvent);
      dispatch(setSelectedEvent({ ...event, ...saveEvent }));
      onSaveSuccess();
    } catch (e) {
      Alert.alert(t('error'), JSON.stringify(e));
      setLoading(false);
    }
  }

  const disabled = item?.sold > 0;

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
        <ProductPhoto image={image} setImage={setImage} />
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

export default EditProduct;
