import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { ActivityIndicator, FAB, Snackbar, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { t } from 'i18n-js';
import Accordion from 'react-native-collapsible/Accordion';
import { useFirebase, useFirestore } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import { first, orderBy, remove, sumBy } from 'lodash';
import { PinkPrimary, TransparentBackdrop } from '../../../assets/Colors';
import EventLandingPage from '../../common/EventLandingPage';
import ProductItem from '../../corporativo/products/ProductItem';

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
});

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

    async function fetchEventData() {
      setLoading(true);
      await Promise.all([fetchTickets(), fetchProducts()]);
      setLoading(false);
    }
    fetchEventData();
  }, [event.id, event.products, firestore]);

  const SECTIONS = [
    {
      title: t('tickets'),
      content: eventTickets,
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
          {section.content.map(item => (
            <ProductItem
              item={item}
              hideOptions
              onPress={() => onRowPress(item)}
            />
          ))}
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
          first(orderBy(eventTickets, 'price')).price
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
