import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { FAB, Text } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { t } from 'i18n-js';
import Accordion from 'react-native-collapsible/Accordion';
import { useFirestore, useFirestoreConnect } from 'react-redux-firebase';
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
  const route = useRoute();
  const navigation = useNavigation();
  const { event, category } = route.params;
  const firestore = useFirestore();

  const { ticketSegments, eventTickets } = useSelector(state => ({
    ticketSegments: state.firestore.ordered.ticketSegments,
    eventTickets: state.firestore.ordered.eventTickets,
  }));

  const [priceTag, setPriceTag] = useState('-');

  useFirestoreConnect([
    { collection: 'ticketSegments', where: ['eventId', '==', event.id] },
    {
      collection: 'purchasables',
      where:
        ticketSegments && ticketSegments.length
          ? [
              firestore.FieldPath.documentId(),
              'in',
              ticketSegments.map(segment => segment.purchasableId),
            ]
          : undefined,
      storeAs: 'eventTickets',
    },
  ]);

  const [activeSections, setActiveSections] = useState([]);

  const SECTIONS = [
    {
      title: 'Products',
      content: [
        { title: 'title', description: 'description' },
        { title: 'title', description: 'description' },
        { title: 'title', description: 'description' },
        { title: 'title', description: 'description' },
        { title: 'title', description: 'description' },
        { title: 'title', description: 'description' },
        { title: 'title', description: 'description' },
      ],
    },
  ];

  function renderContent(section) {
    return (
      <>
        <View style={styles.counter}>
          <View style={styles.line} />
          <Text style={styles.productsCount}>
            {t('showingNumberProducts', { number: section.content.length })}
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
  }, [eventTickets]);

  function navigateToMap() {
    navigation.navigate('FullScreenMapView');
  }

  return (
    <>
      <EventLandingPage
        event={event}
        category={category}
        priceTag={priceTag}
        navigateToMap={navigateToMap}
      >
        <View style={{ paddingHorizontal: 15 }}>
          <View style={styles.row}>
            <Text style={styles.bodyText}>{t('ticketValue')}</Text>
            <Text style={[styles.bodyText, { fontWeight: 'bold' }]}>
              {priceTag}
            </Text>
          </View>
          <Accordion
            sections={SECTIONS}
            activeSections={activeSections}
            onChange={e => {
              setActiveSections(e);
              animate(e.length);
            }}
            renderContent={renderContent}
            renderHeader={renderHeader}
            underlayColor={TransparentBackdrop}
            duration={400}
          />
        </View>
      </EventLandingPage>
      <FAB
        label={t('buyTickets')}
        style={styles.floatingButton}
        // TODO: design Get Tickets page
      />
    </>
  );
}

export default EventDetails;
