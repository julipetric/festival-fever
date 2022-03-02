import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { ActivityIndicator, FAB, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { t } from 'i18n-js';
import Accordion from 'react-native-collapsible/Accordion';
import { useFirestore } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import { orderBy } from 'lodash';
import { PinkPrimary, TransparentBackdrop } from '../../../assets/Colors';
import EventProduct from './EventProduct';
import EventLandingPage from '../../common/EventLandingPage';

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
    marginVertical: 15,
  },
  counter: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  line: {
    backgroundColor: PinkPrimary,
    flexGrow: 1,
    height: 1,
  },
  productsCount: {
    paddingHorizontal: 10,
  },
  grid: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
});

function EventDetails() {
  const navigation = useNavigation();
  const firestore = useFirestore();

  const { event } = useSelector(state => ({
    event: state.myStore.selectedEvent,
  }));

  const [priceTag, setPriceTag] = useState('-');

  const [ticketSegments, setTicketSegments] = useState();
  const [eventTickets, setEventTickets] = useState();
  const [products, setProducts] = useState();
  const [loading, setLoading] = useState(false);

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
            .get()
        ).forEach(doc => tickets.push(doc.data()));
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
            .get()
        ).forEach(doc => array.push(doc.data()));
      setProducts(array);
    }

    async function fetchEventData() {
      setLoading(true);
      await Promise.all([fetchTickets(), fetchProducts()]);
      setLoading(false);
    }
    fetchEventData();
  }, [event.id, event.products, firestore]);

  const [activeSections, setActiveSections] = useState([]);

  const SECTIONS = [
    {
      title: t('products'),
      content: products,
    },
  ];

  function renderContent(section) {
    return (
      <>
        <View style={styles.counter}>
          <View style={styles.line} />
          <Text style={styles.productsCount}>
            {section.content.length === 1
              ? t('showingOneProduct')
              : t('showingNumberProducts')}
          </Text>
          <View style={styles.line} />
        </View>
        <View style={styles.grid}>
          {section.content.map(item => (
            <EventProduct product={item} />
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
        <Text style={styles.headerText}>{section.title}</Text>
        <Animated.View style={{ rotation: animatedRotation }}>
          <AntDesign name="caretdown" size={12} color="white" />
        </Animated.View>
      </View>
    );
  }

  useEffect(() => {
    if (ticketSegments && ticketSegments.length) {
      if (eventTickets && eventTickets.length) {
        let tag;
        if (eventTickets.length > 1) {
          const cheapest = orderBy(eventTickets, 'price');
          tag = t('from').toLowerCase();
          tag += ' $';
          tag += cheapest[0].price;
        } else {
          tag = `$${eventTickets[0].price}`;
        }
        setPriceTag(tag);
      }
    } else setPriceTag(undefined);
  }, [ticketSegments, eventTickets]);

  function navigateToMap() {
    navigation.navigate('FullScreenMapView');
  }

  function buyTickets() {
    navigation.navigate(t('buyTickets'), {
      tickets: eventTickets,
      event,
    });
  }

  return event && products && !loading ? (
    <>
      <EventLandingPage
        event={event}
        category={event.category}
        navigateToMap={navigateToMap}
      >
        <View style={{ paddingHorizontal: 15 }}>
          {priceTag && (
            <View style={styles.row}>
              <Text style={styles.bodyText}>{t('ticketValue')}</Text>
              <Text style={[styles.bodyText, { fontWeight: 'bold' }]}>
                {priceTag}
              </Text>
            </View>
          )}
          {products?.length ? (
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
      <FAB
        label={t('buyTickets')}
        style={styles.floatingButton}
        onPress={buyTickets}
        disabled={!ticketSegments?.length}
      />
    </>
  ) : (
    <ActivityIndicator size="large" style={{ paddingTop: 30 }} />
  );
}

export default EventDetails;
