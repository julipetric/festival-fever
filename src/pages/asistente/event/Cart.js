import { useNavigation, useRoute } from '@react-navigation/native';
import { t } from 'i18n-js';
import React, { useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  Subheading,
  Text,
  Title,
  Caption,
  FAB,
  Snackbar,
} from 'react-native-paper';
import PropTypes from 'prop-types';
import { orderBy } from 'lodash';
import { useSelector } from 'react-redux';
import { BackgroundGray, PinkPrimary } from '../../../assets/Colors';
import { ListItemBorderRadius } from '../../../assets/UIConstants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundGray,
    padding: 10,
  },
  itemContainer: {
    backgroundColor: 'white',
    padding: 7,
    paddingHorizontal: 10,
    borderRadius: ListItemBorderRadius,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ticketName: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
  },
  ticketDescription: {
    color: BackgroundGray,
    fontSize: 12,
    marginBottom: 5,
  },
  ticketPrice: {
    fontSize: 14,
    color: BackgroundGray,
  },
  line: {
    backgroundColor: PinkPrimary,
    flexGrow: 1,
    height: 1,
    marginBottom: 5,
  },
  floatingButton: {
    position: 'absolute',
    bottom: '2%',
    alignSelf: 'center',
  },
  unitsContainer: {
    borderRadius: ListItemBorderRadius,
    borderColor: 'black',
    borderWidth: 2,
    flexDirection: 'row',
    overflow: 'hidden',
  },
});

function Item({ item, setItem, showNoStock }) {
  function onAdd() {
    const newQuantity = item.quantity + 1;
    if (item.item.stock && newQuantity + item.item.sold > item.item.stock)
      showNoStock();
    else
      setItem({
        ...item,
        quantity: newQuantity,
      });
  }

  function onSubstract() {
    const newQuantity = item.quantity - 1;
    setItem({
      ...item,
      quantity: newQuantity,
    });
  }

  return (
    <View style={styles.itemContainer}>
      <View style={{ flex: 1 }}>
        <Text style={styles.ticketName}>{item.item.name}</Text>
        {item.item?.description !== '' && (
          <Text style={styles.ticketDescription}>{item.item.description}</Text>
        )}
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <Text style={styles.ticketPrice}>{t('price')}:</Text>
          <Text
            style={[styles.ticketPrice, { fontWeight: 'bold', marginLeft: 5 }]}
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
            backgroundColor: 'rgb(170,170,170)',
            width: 25,
            textAlign: 'center',
            lineHeight: 25,
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

Item.propTypes = {
  item: PropTypes.object.isRequired,
  setItem: PropTypes.func.isRequired,
  showNoStock: PropTypes.func.isRequired,
};

function ScreenHeader({ event }) {
  return (
    <View style={{ marginBottom: 10 }}>
      <Title style={{ color: PinkPrimary }}>
        {t('orderFor')} {event.name}
      </Title>
    </View>
  );
}

ScreenHeader.defaultProps = {
  event: {},
};
ScreenHeader.propTypes = {
  event: PropTypes.object,
};

function OrderSummary({ items }) {
  const orderedItems = orderBy(
    items.filter(e => e.quantity),
    'item.price'
  );

  let total = 0;
  orderedItems.forEach(item => {
    total += item.item.price * item.quantity;
  });
  return (
    <View style={{ paddingVertical: 10, width: '100%' }}>
      <View style={styles.line} />
      <Subheading style={{ color: PinkPrimary }}>
        {t('orderSummary')}
      </Subheading>
      {orderedItems?.length ? (
        <>
          {orderedItems?.map(item => (
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
              key={item.item.id}
            >
              <Text>{item.item.name}</Text>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                <Text style={{ marginRight: 8, fontSize: 13, opacity: 0.5 }}>
                  x{item.quantity}
                </Text>
                <Text>${item.item.price * item.quantity}</Text>
              </View>
            </View>
          ))}
          <View
            style={[styles.line, { backgroundColor: 'white', marginTop: 5 }]}
          />
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Text style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
              {t('total')}
            </Text>
            <Text style={{ fontWeight: 'bold' }}>${total}</Text>
          </View>
        </>
      ) : (
        <Caption>{t('noItemsAddedToYourOrder')}</Caption>
      )}
    </View>
  );
}

OrderSummary.propTypes = {
  items: PropTypes.array.isRequired,
};

function Cart() {
  const route = useRoute();
  const navigation = useNavigation();
  const { cartItems } = route.params;

  const [items, setItems] = useState(orderBy(cartItems, 'item.price'));
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const { event } = useSelector(state => ({
    event: state.myStore.selectedEvent,
  }));

  function onContinue() {
    navigation.navigate(t('checkout'), { items });
  }

  function onItemChange(item, index) {
    const newItems = [...items];
    newItems.splice(index, 1, item);
    setItems(newItems);
  }

  return (
    <>
      <FlatList
        data={items}
        renderItem={({ item, index }) => (
          <Item
            item={item}
            setItem={newItem => onItemChange(newItem, index)}
            showNoStock={() => setSnackbarVisible(true)}
          />
        )}
        keyExtractor={item => item.item.id}
        contentContainerStyle={styles.container}
        ListHeaderComponent={() => <ScreenHeader event={event} />}
        ListFooterComponent={() => <OrderSummary items={items} />}
      />
      <FAB
        label={t('checkout')}
        style={styles.floatingButton}
        onPress={onContinue}
        disabled={!items.length}
      />
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={600}
        style={{ opacity: 0.8 }}
      >
        {t('noMoreUnitsAvailable')}
      </Snackbar>
    </>
  );
}

export default Cart;
