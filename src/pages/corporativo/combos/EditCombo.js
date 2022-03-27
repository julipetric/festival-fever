import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Alert,
  StyleSheet,
  FlatList,
  View,
  TouchableOpacity,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  ActivityIndicator,
  HelperText,
  Menu,
  TextInput,
  Text,
} from 'react-native-paper';
import { t } from 'i18n-js';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFirebase, useFirestore } from 'react-redux-firebase';
import { useDispatch, useSelector } from 'react-redux';
import { debounce, sortBy, uniqueId } from 'lodash';
import PropTypes from 'prop-types';
import StyledButton from '../../components/StyledButton';
import FormTextInput from '../../components/FormTextInput';
import ComboSchema from '../../../schemas/ComboSchema';
import { setSelectedEvent } from '../../../redux/myStoreSlice';
import { updateEventTimestamp } from '../../../utils';
import { BackgroundGray } from '../../../assets/Colors';
import { ListItemBorderRadius } from '../../../assets/UIConstants';

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  button: {
    marginTop: 20,
  },
  itemContainer: {
    backgroundColor: 'white',
    padding: 7,
    paddingHorizontal: 10,
    borderRadius: ListItemBorderRadius,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    opacity: 0.65,
  },
  purchasableName: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
  },
  purchasablePrice: {
    fontSize: 14,
    color: BackgroundGray,
  },
  unitsContainer: {
    borderRadius: ListItemBorderRadius,
    borderColor: 'black',
    borderWidth: 2,
    flexDirection: 'row',
    overflow: 'hidden',
  },
});

function ComboItem({ item, setItem }) {
  function onAdd() {
    setItem({
      ...item,
      quantity: item.quantity + 1,
    });
  }

  function onSubstract() {
    if (item.quantity - 1 === 0) setItem(undefined);
    else
      setItem({
        ...item,
        quantity: item.quantity - 1,
      });
  }

  return (
    <View style={styles.itemContainer} key={uniqueId()}>
      <View style={{ flex: 1 }}>
        <Text style={styles.purchasableName}>{item.item.name}</Text>
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <Text style={styles.purchasablePrice}>{t('price')}:</Text>
          <Text
            style={[
              styles.purchasablePrice,
              { fontWeight: 'bold', marginLeft: 5 },
            ]}
          >
            ${item.item.price}
          </Text>
        </View>
      </View>
      <View style={styles.unitsContainer}>
        <TouchableOpacity
          style={{ width: 20, opacity: item.quantity < 1 ? 0.5 : 1 }}
          onPress={onSubstract}
          disabled={item.quantity < 1}
        >
          <Text
            style={{
              color: 'black',
              textAlign: 'center',
              lineHeight: 25,
              fontWeight: 'bold',
            }}
          >
            ―
          </Text>
        </TouchableOpacity>
        <Text
          style={{
            borderRightWidth: 2,
            borderLeftWidth: 2,
            borderColor: 'black',
            fontWeight: 'bold',
            width: 25,
            textAlign: 'center',
            lineHeight: 25,
            color: 'black',
          }}
        >
          {item.quantity}
        </Text>
        <TouchableOpacity style={{ width: 20 }} onPress={onAdd}>
          <Text
            style={{
              color: 'black',
              textAlign: 'center',
              lineHeight: 25,
              fontWeight: 'bold',
            }}
          >
            +
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

ComboItem.propTypes = {
  item: PropTypes.object.isRequired,
  setItem: PropTypes.func.isRequired,
};

function EditCombo() {
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
    resolver: useMemo(() => ComboSchema(item?.sold || 0), [item]),
  });

  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState();
  const [debouncedSearchText, setDebouncedSearchText] = useState();
  const [menuVisible, setMenuVisible] = useState(false);
  const [itemsList, setItemsList] = useState();
  const [comboItems, setComboItems] = useState(item?.purchasables || []);

  function onSaveSuccess() {
    setLoading(false);
    navigation.goBack();
  }

  async function onSave() {
    setLoading(true);
    try {
      const { name, description, price, stock } = watch();

      const saveCombo = {
        ...item,
        name,
        description: description || '',
        eventId: event.id,
        stock: stock || '',
        price,
        purchasables: comboItems.map(e => ({
          purchasableId: e.item.id,
          quantity: e.quantity,
        })),
      };

      delete saveCombo.id;
      if (!item) {
        await firestore
          .collection('combos')
          .add({ ...saveCombo, active: true, sold: 0 });
      } else {
        await firestore.collection('combos').doc(item.id).update(saveCombo);
      }
      const updatedEvent = await updateEventTimestamp(
        firestore,
        firebase,
        event
      );
      dispatch(setSelectedEvent({ ...event, ...updatedEvent }));
      onSaveSuccess();
    } catch (e) {
      Alert.alert(t('error'), JSON.stringify(e));
      setLoading(false);
    }
  }

  const disabled = item?.sold > 0;

  const fetchProducts = useCallback(async () => {
    if (event.products?.length) {
      const array = [];
      (
        await firestore
          .collection('purchasables')
          .where(firestore.FieldPath.documentId(), 'in', event.products)
          .get()
      ).forEach(doc => array.push({ ...doc.data(), id: doc.id }));
      return array;
    }
    return [];
  }, [event, firestore]);

  const fetchTickets = useCallback(async () => {
    const array = [];
    (
      await firestore
        .collection('ticketSegments')
        .where('eventId', '==', event.id)
        .get()
    ).forEach(doc => array.push({ ...doc.data(), id: doc.id }));
    if (array?.length) {
      const result = [];
      (
        await firestore
          .collection('purchasables')
          .where(
            firestore.FieldPath.documentId(),
            'in',
            array.map(segment => segment.purchasableId)
          )
          .get()
      ).forEach(doc => result.push({ ...doc.data(), id: doc.id }));
      return result;
    }
    return [];
  }, [event.id, firestore]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [result1, result2] = await Promise.all([
      fetchProducts(),
      fetchTickets(),
    ]);
    setItemsList(sortBy([...result1, ...result2], 'name'));
    setLoading(false);
  }, [fetchProducts, fetchTickets]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const debouncedSetSearch = debounce(text => {
    setDebouncedSearchText(text);
    setMenuVisible(true);
  }, 400);

  function addItem(e) {
    setSearchText('');
    const index = comboItems.findIndex(i => i.item.id === e.id);
    if (index > -1) {
      const newItems = [...comboItems];
      const existingItem = newItems[index];
      const newItem = {
        ...existingItem,
        quantity: existingItem.quantity + 1,
      };
      newItems.splice(index, 1, newItem);
      setComboItems(newItems);
    } else {
      setComboItems([...comboItems, { item: e, quantity: 1 }]);
    }
    setMenuVisible(false);
  }

  function onItemChange(i, index) {
    const newItems = [...comboItems];
    if (i) newItems.splice(index, 1, i);
    else newItems.splice(index, 1);
    setComboItems(newItems);
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
        <Menu
          visible={debouncedSearchText && menuVisible}
          style={{ marginTop: 60, width: '90%' }}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <TextInput
              onChangeText={text => {
                setSearchText(text);
                debouncedSetSearch.cancel();
                debouncedSetSearch(text);
              }}
              style={{ backgroundColor: BackgroundGray }}
              label={t('searchItem')}
              value={searchText}
            />
          }
        >
          <FlatList
            style={{ maxHeight: 250, width: '100%' }}
            renderItem={({ item: e }) => (
              <Menu.Item title={e.name} key={e.id} onPress={() => addItem(e)} />
            )}
            data={(itemsList || []).filter(e =>
              e.name
                .toLowerCase()
                .includes((debouncedSearchText || '').toLowerCase())
            )}
            ListEmptyComponent={() => (
              <Menu.Item title={t('noItems')} key={uniqueId()} disabled />
            )}
          />
        </Menu>
        {comboItems?.length ? (
          <View style={{ paddingTop: 10 }}>
            {comboItems.map((i, index) => (
              <ComboItem
                item={i}
                setItem={newItem => onItemChange(newItem, index)}
                key={uniqueId()}
              />
            ))}
          </View>
        ) : (
          <HelperText visible={false}>dummyHelper</HelperText>
        )}
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

export default EditCombo;
