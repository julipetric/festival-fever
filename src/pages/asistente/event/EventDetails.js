import React from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  View,
} from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from '@expo/vector-icons';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native-gesture-handler';
import moment from 'moment';
import { t } from 'i18n-js';
import {
  BackgroundGray,
  PinkPrimary,
  PurplePill,
} from '../../../assets/Colors';

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
  },
  dataContainer: {
    alignItems: 'flex-start',
    paddingHorizontal: 15,
    flex: 1,
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

  return (
    <ScrollView style={styles.container}>
      <ImageHeader image={event.image} />
      <View style={styles.dataContainer}>
        <View style={styles.categoryPill}>
          <Text style={styles.categoryText}>Category</Text>
        </View>
        <Text style={styles.eventTitle}>{event.name}</Text>
        <DatePlaceRow event={event} />
        <View style={styles.divider} />
      </View>
    </ScrollView>
  );
}

export default EventDetails;

ImageHeader.propTypes = {
  image: PropTypes.object.isRequired,
};
