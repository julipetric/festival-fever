import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  View,
  Animated,
} from 'react-native';
import { FAB, IconButton, Text } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  AntDesign,
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from '@expo/vector-icons';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native-gesture-handler';
import moment from 'moment';
import { t } from 'i18n-js';
import Accordion from 'react-native-collapsible/Accordion';
import {
  BackgroundGray,
  PinkPrimary,
  PurplePill,
  TransparentBackdrop,
} from '../../../assets/Colors';
import EventProduct from './EventProduct';

const styles = StyleSheet.create({
  container: {
    backgroundColor: BackgroundGray,
  },
  image: {
    width: '100%',
    height: 80,
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 20,
  },
  circleIcon: { backgroundColor: 'rgba(0,0,0,0.3)', padding: 3 },
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
          <Text style={styles.text1}>
            {moment(event.dates[0].start).format(`dddd D [${t('of')}] MMMM`)}
          </Text>
          <Text style={styles.text2}>{`${moment(event.dates[0].start).format(
            `HH:mm`
          )} - ${moment(event.dates[0].end).format(`HH:mm`)} hs`}</Text>
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

function ImageHeader({ image }) {
  const navigation = useNavigation();

  const imageSource = Image.resolveAssetSource(image);
  const { width } = Dimensions.get('window');
  const ratio = width / imageSource.width;
  const height = imageSource.height * ratio;

  return (
    <ImageBackground source={image} style={[styles.image, { height }]}>
      <IconButton
        icon={({ size }) => (
          <Ionicons name="arrow-back" size={size} color="white" />
        )}
        style={styles.circleIcon}
        size={25}
        onPress={() => navigation.goBack()}
      />
      <View style={{ flexDirection: 'row' }}>
        <IconButton
          icon={({ size }) => (
            <FontAwesome5 name="share-alt" size={size} color="white" />
          )}
          style={styles.circleIcon}
          size={23}
        />
        <IconButton
          icon={({ size }) => <Feather name="star" size={size} color="white" />}
          style={styles.circleIcon}
          size={25}
        />
      </View>
    </ImageBackground>
  );
}

function EventDetails() {
  const route = useRoute();
  const { event } = route.params;

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

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 70 }}
      >
        <ImageHeader image={event.image} />
        <View style={styles.dataContainer}>
          <View style={styles.categoryPill}>
            <Text style={styles.categoryText}>Category</Text>
          </View>
          <Text style={styles.eventTitle}>{event.name}</Text>
          <DatePlaceRow event={event} />
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.bodyText}>{t('ticketValue')}</Text>
            <Text style={[styles.bodyText, { fontWeight: 'bold' }]}>text2</Text>
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
        onPress={() => {}}
      />
    </>
  );
}

export default EventDetails;

ImageHeader.propTypes = {
  image: PropTypes.object.isRequired,
};
