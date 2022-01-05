import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Animated, Image, ScrollView } from 'react-native';
import { FAB, Modal, Portal, Text } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
// eslint-disable-next-line import/no-unresolved
import ZoomableView from '@openspacelabs/react-native-zoomable-view/src/ReactNativeZoomableView';
import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import moment from 'moment';
import { t } from 'i18n-js';
import Accordion from 'react-native-collapsible/Accordion';
import { useFirestore, useFirestoreConnect } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import { orderBy } from 'lodash';
import {
  BackgroundGray,
  PinkPrimary,
  PurplePill,
  TransparentBackdrop,
} from '../../../assets/Colors';
import EventProduct from './EventProduct';
import ImageHeader from './ImageHeader';

const styles = StyleSheet.create({
  container: {
    backgroundColor: BackgroundGray,
  },
  categoryPill: {
    backgroundColor: PurplePill,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  dataContainer: {
    paddingHorizontal: 15,
    flex: 1,
    display: 'flex',
  },
  eventTitle: {
    fontSize: 50,
    fontWeight: 'bold',
  },
  categoryText: {
    fontSize: 10,
    textTransform: 'uppercase',
  },
  text1: {
    opacity: 0.8,
    fontWeight: 'bold',
    fontSize: 14,
  },
  text2: {
    opacity: 0.6,
    fontSize: 14,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: 'white',
    marginTop: 15,
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
});

function DatePlaceRow({ event }) {
  let startDateString;
  let hoursString;
  if (event.dates.length === 1 && event.dates[0].start === 'dummyDate') {
    startDateString = moment()
      .add(3, 'days')
      .format(`dddd D [${t('of')}] MMMM`);
    hoursString = `${moment()
      .add(3, 'days')
      .add(2, 'hours')
      .format(`HH:mm`)} - ${moment()
      .add(3, 'days')
      .add(7, 'hours')
      .format(`HH:mm`)}`;
  } else {
    startDateString = moment(event.dates[0].start).format(
      `dddd D [${t('of')}] MMMM`
    );
    hoursString = `${moment(event.dates[0].start).format(`HH:mm`)} - ${moment(
      event.dates[0].end
    ).format(`HH:mm`)}`;
  }

  return (
    <View
      style={{
        width: '100%',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 10,
        }}
      >
        <Feather name="calendar" size={24} color={PinkPrimary} />
        <View
          style={{
            marginLeft: 10,
          }}
        >
          <Text style={styles.text1}>{startDateString}</Text>
          <Text style={styles.text2}>{hoursString}</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <MaterialIcons name="restaurant" size={24} color={PinkPrimary} />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.text1}>{event.location.description}</Text>
          <Text style={styles.text2}>{event.location.address}</Text>
        </View>
      </View>
    </View>
  );
}

DatePlaceRow.propTypes = { event: PropTypes.object.isRequired };

function EventDetails() {
  const route = useRoute();
  const { event, category } = route.params;
  const firestore = useFirestore();

  const { ticketSegments, eventTickets } = useSelector(state => ({
    ticketSegments: state.firestore.ordered.ticketSegments,
    eventTickets: state.firestore.ordered.eventTickets,
  }));

  const [priceTag, setPriceTag] = useState('-');
  const [showImageFullscreen, setShowImageFullscreen] = useState(false);

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

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 70 }}
      >
        <ImageHeader
          image={event.imageUrl}
          openImage={() => setShowImageFullscreen(true)}
        />
        <View style={styles.dataContainer}>
          <View style={styles.categoryPill}>
            <Text style={styles.categoryText}>{category.name}</Text>
          </View>
          <Text style={styles.eventTitle}>{event.name}</Text>
          <DatePlaceRow event={event} />
          <View style={styles.divider} />
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
      </ScrollView>
      <FAB
        label={t('buyTickets')}
        style={styles.floatingButton}
        // TODO: design Get Tickets page
      />
      <Portal>
        <Modal
          visible={showImageFullscreen}
          contentContainerStyle={{ height: '100%', width: '100%' }}
          onDismiss={() => setShowImageFullscreen(false)}
          style={{ backgroundColor: TransparentBackdrop }}
        >
          <ZoomableView maxZoom={4} minZoom={1} initialZoom={1} bindToBorders>
            <Image
              source={{ uri: event.imageUrl }}
              resizeMode="contain"
              style={{ width: '100%', height: '100%' }}
            />
          </ZoomableView>
        </Modal>
      </Portal>
    </>
  );
}

export default EventDetails;
