import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Animated, TouchableOpacity } from 'react-native';
import { ActivityIndicator, FAB, Snackbar, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { t } from 'i18n-js';
import Accordion from 'react-native-collapsible/Accordion';
import { useFirebase, useFirestore } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import { first, orderBy, remove, sumBy } from 'lodash';
import PropTypes from 'prop-types';
import { PinkPrimary, TransparentBackdrop } from '../../../assets/Colors';
import EventLandingPage from '../../common/EventLandingPage';
import ProductItem from '../../corporativo/products/ProductItem';
import { ListItemBorderRadius } from '../../../assets/UIConstants';

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: '2%',
    alignSelf: 'center',
  },
  collapsibleHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    paddingVertical: 5,
  },
  counter: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 5,
  },
  line: {
    backgroundColor: PinkPrimary,
    flexGrow: 1,
    height: 1,
  },
  productsCount: {
    paddingHorizontal: 10,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    marginTop: 14,
  },
  bodyText: {
    fontSize: 16,
  },
  headerText: {
    fontWeight: 'bold',
  },
  comboContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: ListItemBorderRadius,
    marginBottom: 15,
  },
});

function ComboItem({ item, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.comboContainer}
      key={item.id}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ color: 'black', fontSize: 16 }}>{item.name}</Text>
        <Text style={{ color: 'black', fontSize: 16 }}>
          ${Number(item.price).toFixed(2)}
        </Text>
      </View>
      {item.description !== '' && (
        <Text style={{ color: 'black', fontSize: 14, opacity: 0.6 }}>
          {item.description}
        </Text>
      )}
      <Text style={{ color: 'black', fontSize: 14, opacity: 0.6 }}>
        {item.purchasables
          ?.map(e => `${e.item.name} ($${e.item.price}) x${e.quantity}`)
          .join(', ')}
      </Text>
    </TouchableOpacity>
  );
}

ComboItem.propTypes = {
  item: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired,
};

function EventDetails() {
  const navigation = useNavigation();
  const firestore = useFirestore();
  const firebase = useFirebase();

  const { event, profile } = useSelector(state => ({
    event: state.myStore.selectedEvent,
    profile: state.firebase.profile,
  }));

  const { favorites } = profile;

  const [priceTag, setPriceTag] = useState('-');

  const [ticketSegments, setTicketSegments] = useState();
  const [eventTickets, setEventTickets] = useState();
  const [products, setProducts] = useState();
  const [combos, setCombos] = useState();
  const [combosPurchasables, setCombosPurchasables] = useState();
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [activeSections, setActiveSections] = useState([]);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  useEffect(() => {
    async function fetchTickets() {
      const segments = [];
      const tickets = [];
      (
        await firestore
          .collection('ticketSegments')
          .where('eventId', '==', event.id)
          .get()
      ).forEach(doc => segments.push(doc.data()));
      if (segments.length)
        (
          await firestore
            .collection('purchasables')
            .where(
              firestore.FieldPath.documentId(),
              'in',
              segments.map(segment => segment.purchasableId)
            )
            .where('active', '==', true)
            .get()
        ).forEach(doc => tickets.push({ ...doc.data(), id: doc.id }));
      setTicketSegments(segments);
      setEventTickets(tickets);
    }

    async function fetchProducts() {
      const array = [];
      if (event?.products?.length)
        (
          await firestore
            .collection('purchasables')
            .where(firestore.FieldPath.documentId(), 'in', event.products)
            .where('active', '==', true)
            .get()
        ).forEach(doc => array.push({ ...doc.data(), id: doc.id }));
      setProducts(array);
    }

    async function fetchCombos() {
      const array = [];
      (
        await firestore
          .collection('combos')
          .where('eventId', '==', event?.id)
          .get()
      ).forEach(doc => array.push({ ...doc.data(), id: doc.id }));
      if (array?.length) {
        const purchasables = [];
        (
          await firestore
            .collection('purchasables')
            .where(
              firestore.FieldPath.documentId(),
              'in',
              array.flatMap(combo =>
                combo.purchasables.map(p => p.purchasableId)
              )
            )
            .get()
        ).forEach(doc => purchasables.push({ ...doc.data(), id: doc.id }));
        setCombosPurchasables(purchasables);
      } else {
        setCombosPurchasables([]);
      }
      setCombos(array);
      setLoading(false);
    }

    async function fetchEventData() {
      setLoading(true);
      await Promise.all([fetchTickets(), fetchProducts(), fetchCombos()]);
      setLoading(false);
    }
    fetchEventData();
  }, [event.id, event.products, firestore]);

  const mappedCombos = combos?.map(e => ({
    ...e,
    purchasables: e.purchasables.map(p => ({
      ...p,
      item: combosPurchasables.find(i => i.id === p.purchasableId),
    })),
  }));

  const SECTIONS = [
    {
      title: t('tickets'),
      content: eventTickets,
    },
    {
      title: t('combos'),
      content: mappedCombos,
    },
    {
      title: t('products'),
      content: products,
    },
  ].filter(e => e.content?.length);

  function onRowPress(item) {
    if (item.stock && item.sold && item.sold >= item.stock)
      setSnackbarVisible(true);
    else {
      const newArray = [...cartItems];
      const index = cartItems.findIndex(e => e.item.id === item.id);
      if (index > -1) {
        newArray[index].quantity += 1;
        setCartItems(newArray);
      } else {
        newArray.push({ item, quantity: 1 });
        setCartItems(newArray);
      }
    }
  }

  function onComboPress(item) {
    const addItem = {
      ...item,
      description: item.purchasables
        ?.map(e => `${e.item.name} ($${e.item.price}) x${e.quantity}`)
        .join(', '),
    };
    onRowPress(addItem);
  }

  function renderContent(section) {
    return (
      <>
        <View style={styles.counter}>
          <View style={styles.line} />
          <Text style={styles.productsCount}>
            {section.content.length === 1
              ? t('showingOneItem')
              : t('showingNumberItems', { number: section.content.length })}
          </Text>
          <View style={styles.line} />
        </View>
        <View>
          {section.content.map(item =>
            section?.title === t('combos') ? (
              <ComboItem item={item} onPress={() => onComboPress(item)} />
            ) : (
              <ProductItem
                item={item}
                hideOptions
                onPress={() => onRowPress(item)}
              />
            )
          )}
        </View>
      </>
    );
  }

  const rotationAnimation = useRef(new Animated.Value(0)).current;

  const animatedRotation = rotationAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -180],
  });

  function animate(open) {
    Animated.timing(rotationAnimation, {
      toValue: open,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }

  function renderHeader(section) {
    return (
      <View style={styles.collapsibleHeader}>
        <Text style={[styles.headerText, { color: PinkPrimary }]}>
          {section.title}
        </Text>
        <Animated.View style={{ rotation: animatedRotation }}>
          <AntDesign name="caretdown" size={12} color={PinkPrimary} />
        </Animated.View>
      </View>
    );
  }

  useEffect(() => {
    if (ticketSegments && ticketSegments.length) {
      if (eventTickets && eventTickets.length) {
        const tag = `${t('from').toLowerCase()}: $${
          first(orderBy(eventTickets, 'price', 'desc')).price
        }`;
        setPriceTag(tag);
      }
    } else setPriceTag(undefined);
  }, [ticketSegments, eventTickets]);

  function navigateToMap() {
    navigation.navigate('FullScreenMapView', {
      defaultMarker: event.location?.coordinates,
    });
  }

  const onFavAdded = useCallback(async () => {
    const newFavorites = (favorites && [...favorites]) || [];
    if (newFavorites.includes(event.id))
      remove(newFavorites, e => e === event.id);
    else newFavorites.push(event.id);
    await firebase.updateProfile({ favorites: newFavorites });
  }, [event.id, favorites, firebase]);

  return event && products && !loading ? (
    <>
      <EventLandingPage
        event={event}
        category={event.category}
        navigateToMap={navigateToMap}
        isFavorite={favorites?.includes(event.id)}
        onFavPress={onFavAdded}
      >
        <View style={{ paddingHorizontal: 15 }}>
          {priceTag && (
            <View style={[styles.row, { marginBottom: 5 }]}>
              <Text style={styles.bodyText}>{t('ticketValue')}</Text>
              <Text style={[styles.bodyText, { fontWeight: 'bold' }]}>
                {priceTag}
              </Text>
            </View>
          )}
          {SECTIONS?.length ? (
            <Accordion
              sections={SECTIONS}
              activeSections={activeSections}
              onChange={e => {
                setActiveSections(e);
                animate(e.length);
              }}
              renderContent={renderContent}
              keyExtractor={item => item.title}
              renderHeader={renderHeader}
              underlayColor={TransparentBackdrop}
              duration={400}
            />
          ) : (
            <></>
          )}
        </View>
      </EventLandingPage>
      {cartItems?.length ? (
        <FAB
          icon={() => <AntDesign name="shoppingcart" size={24} color="white" />}
          label={`${t('cart')} (${sumBy(cartItems, 'quantity')})`}
          style={styles.floatingButton}
          onPress={() => navigation.navigate(t('cart'), { cartItems })}
          disabled={!ticketSegments?.length}
        />
      ) : undefined}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={600}
        style={{ opacity: 0.8 }}
      >
        {t('noMoreStock')}
      </Snackbar>
    </>
  ) : (
    <ActivityIndicator size="large" style={{ paddingTop: 30 }} />
  );
}

export default EventDetails;
